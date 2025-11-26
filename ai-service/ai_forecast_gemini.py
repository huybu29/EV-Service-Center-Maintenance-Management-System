import google.generativeai as genai
import pandas as pd
import requests
import json
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# --- CẤU HÌNH ---
# ⚠️ LƯU Ý: API Key bạn cung cấp trong câu hỏi nên được bảo mật. Tôi giữ nguyên để bạn chạy được ngay.
API_KEY = "AIzaSyAFwu33jV261_i0mO0bR9UcQhAnFqFk7RI" 

# Đường dẫn file CSV (Hãy đảm bảo file này đang đóng, không mở bằng Excel)
CSV_PATH = r"C:\AI_Data\history_data.csv"

# API Spring Boot (PartService)
BACKEND_API_URL = "http://localhost:8086/api/parts/update-forecast" 

# Khởi tạo Gemini
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('models/gemini-2.0-flash')

def run_forecast():
    # 1. Kiểm tra file tồn tại
    if not os.path.exists(CSV_PATH):
        print(f" File không tồn tại tại đường dẫn: {CSV_PATH}")
        return

    try:
        # 2. Đọc CSV bằng Pandas
        df = pd.read_csv(CSV_PATH)
        
        # 🔥 QUAN TRỌNG: Xóa khoảng trắng ở tên cột để tránh lỗi KeyError (ví dụ " month" -> "month")
        df.columns = df.columns.str.strip()
        
        print(" Đã đọc file CSV thành công!")
        # print(f"   Các cột tìm thấy: {df.columns.tolist()}") # Bỏ comment nếu muốn debug tên cột

        # 3. Gom nhóm dữ liệu (Data Aggregation)
        parts_summary = []
        
        # Kiểm tra xem file có cột 'part_code' không
        if 'part_code' not in df.columns:
            print(" Lỗi: File CSV không có cột 'part_code'. Vui lòng kiểm tra lại NiFi.")
            return

        unique_parts = df['part_code'].unique()

        for code in unique_parts:
            part_df = df[df['part_code'] == code]
            
            # Lấy tên phụ tùng (nếu có cột part_name)
            name = part_df.iloc[0]['part_name'] if 'part_name' in df.columns else "Unknown Part"
            
            # Tạo chuỗi lịch sử sử dụng
            history_list = []
            for _, row in part_df.iterrows():
                # Sử dụng .get() để an toàn nếu thiếu cột
                month = row.get('month', '?')
                year = row.get('year', '?')
                qty = row.get('total_quantity_used', 0) # Hoặc 'total_qty' tùy query SQL của bạn
                service = row.get('service_type', 'General')
                
                history_list.append(f"Tháng {month}/{year}: dùng {qty} cái ({service})")
            
            history_str = "; ".join(history_list)
            parts_summary.append(f"- Mã: {code} | Tên: {name} | Lịch sử: [{history_str}]")

        context_data = "\n".join(parts_summary)

        # 4. Tạo Prompt gửi Gemini
        prompt = f"""
        Bạn là chuyên gia quản lý kho phụ tùng ô tô điện. Dưới đây là dữ liệu sử dụng thực tế:

        {context_data}

        Nhiệm vụ:
        1. Phân tích xu hướng sử dụng của từng phụ tùng.
        2. Dự báo nhu cầu nhập hàng cho THÁNG TIẾP THEO.
        3. Trả về kết quả dưới dạng JSON Array thuần túy (tuyệt đối KHÔNG dùng markdown ```json).

        Cấu trúc JSON mong muốn:
        [
            {{
                "partCode": "Mã phụ tùng (giữ nguyên từ input)",
                "predicted": số_lượng_dự_báo_kiểu_int,
                "reason": "Giải thích ngắn gọn dưới 20 từ (Tiếng Việt)"
            }}
        ]
        """

        print(" Đang gửi dữ liệu sang Gemini để phân tích...")
        response = model.generate_content(prompt)
        
        # Xử lý kết quả trả về (Clean JSON String)
        clean_json = response.text.strip()
        if clean_json.startswith("```json"):
            clean_json = clean_json[7:]
        if clean_json.endswith("```"):
            clean_json = clean_json[:-3]
        
        forecast_results = json.loads(clean_json)

        print("\n KẾT QUẢ DỰ BÁO TỪ AI:")
        print(json.dumps(forecast_results, indent=2, ensure_ascii=False))

        # 5. Gửi kết quả về Backend Spring Boot
        print("\n Đang cập nhật về hệ thống Spring Boot...")
        
        for item in forecast_results:
            try:
                # Gọi API PUT
                res = requests.put(BACKEND_API_URL, json=item)
                
                if res.status_code == 200:
                    print(f"    Đã cập nhật DB: {item['partCode']}")
                else:
                    print(f"    Lỗi Backend ({res.status_code}): {item['partCode']} - {res.text}")
            except requests.exceptions.ConnectionError:
                print(f"    Không thể kết nối tới Spring Boot ({BACKEND_API_URL}). Service có đang chạy không?")
                break # Dừng vòng lặp nếu server chết
            except Exception as api_err:
                print(f"    Lỗi không xác định khi gọi API: {api_err}")

    except Exception as e:
        print(f"\n CÓ LỖI XẢY RA: {e}")
        # In chi tiết lỗi để debug nếu cần
        # import traceback
        # traceback.print_exc()

if __name__ == "__main__":
    run_forecast()