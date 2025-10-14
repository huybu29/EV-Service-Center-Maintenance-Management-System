package project.repo.service;

import org.springframework.stereotype.Service;
import project.repo.entity.Staff;
import project.repo.repository.StaffRepository;
import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    private final StaffRepository staffRepository;

    public StaffService(StaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    // ✅ Lưu nhân viên mới
    public Staff saveStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    // ✅ Lấy tất cả nhân viên
    public List<Staff> getAllStaffs() {
        return staffRepository.findAll();
    }

    // ✅ Lấy tất cả kỹ thuật viên
    public List<Staff> getAllTechnicians() {
        return staffRepository.findByRole("Technician");
    }

    // ✅ Cập nhật nhân viên theo ID
    public Staff updateStaff(Long id, Staff staffDetails) {
        Optional<Staff> optionalStaff = staffRepository.findById(id);
        if (optionalStaff.isPresent()) {
            Staff staff = optionalStaff.get();
            staff.setName(staffDetails.getName());
            staff.setRole(staffDetails.getRole());
            staff.setShift(staffDetails.getShift());
            return staffRepository.save(staff);
        } else {
            throw new RuntimeException("Staff not found with id: " + id);
        }
    }

    // ✅ Xóa nhân viên theo ID
    public void deleteStaff(Long id) {
        if (staffRepository.existsById(id)) {
            staffRepository.deleteById(id);
        } else {
            throw new RuntimeException("Staff not found with id: " + id);
        }
    }
}
