package project.repo.controllers;

import org.springframework.web.bind.annotation.*;
import project.repo.entity.Staff;
import project.repo.service.StaffService;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    // ✅ Tạo nhân viên mới
    @PostMapping("/create")
    public Staff createStaff(@RequestBody Staff staff) {
        return staffService.saveStaff(staff);
    }

    // ✅ Xem tất cả nhân viên
    @GetMapping("/all")
    public List<Staff> getAllStaffs() {
        return staffService.getAllStaffs();
    }

    // ✅ Xem tất cả kỹ thuật viên
    @GetMapping("/technicians")
    public List<Staff> getAllTechnicians() {
        return staffService.getAllTechnicians();
    }

    // ✅ Cập nhật thông tin nhân viên
    @PutMapping("/update/{id}")
    public Staff updateStaff(@PathVariable Long id, @RequestBody Staff staffDetails) {
        return staffService.updateStaff(id, staffDetails);
    }

    // ✅ Xóa nhân viên theo ID
    @DeleteMapping("/delete/{id}")
    public String deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return "Staff with ID " + id + " has been deleted successfully!";
    }
}
