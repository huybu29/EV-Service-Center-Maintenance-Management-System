package project.repo.service;

import org.springframework.stereotype.Service;
import project.repo.entity.MaintenanceOrder;
import project.repo.entity.Staff;
import project.repo.repository.MaintenanceOrderRepository;
import project.repo.repository.StaffRepository;

@Service
public class MaintenanceService {
    private final MaintenanceOrderRepository orderRepo;
    private final StaffRepository staffRepo;

    public MaintenanceService(MaintenanceOrderRepository orderRepo, StaffRepository staffRepo) {
        this.orderRepo = orderRepo;
        this.staffRepo = staffRepo;
    }

    // Phân công kỹ thuật viên
    public MaintenanceOrder assignTechnician(Long orderId, Long technicianId) {
        MaintenanceOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Staff technician = staffRepo.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        order.setAssignedTechnician(technician);
        order.setStatus("in_progress");
        return orderRepo.save(order);
    }
}
