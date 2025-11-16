# === Giai đoạn 1: Build (Xây dựng) ===
# Sử dụng một image Node.js (Alpine là bản nhẹ)
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json và package-lock.json trước
COPY package.json package-lock.json ./

# Cài đặt dependencies (npm install)
RUN npm install

# Copy toàn bộ source code
COPY . .

# Chạy lệnh build (từ package.json)
RUN npm run build

# === Giai đoạn 2: Serve (Phục vụ) ===
# Sử dụng một image Nginx (web server)
FROM nginx:1.25-alpine AS server

# Đặt thư mục làm việc của Nginx
WORKDIR /usr/share/nginx/html

# Xóa các file default của Nginx
RUN rm -rf ./*

# Copy các file đã build (trong thư mục 'dist') từ Giai đoạn 1
COPY --from=builder /app/dist .

# (Quan trọng) Copy file cấu hình nginx.conf (chúng ta sẽ tạo ở dưới)
# File này BẮT BUỘC để React Router hoạt động
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80 (cổng mặc định của Nginx)
EXPOSE 80

# Chạy Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]