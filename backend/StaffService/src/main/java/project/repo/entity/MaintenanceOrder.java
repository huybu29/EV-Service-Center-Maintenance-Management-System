package project.repo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "maintenance_orders")
public class MaintenanceOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleVin;
    private String serviceType;
    private String status; // pending, in_progress, completed

    @ManyToOne
    @JoinColumn(name = "technician_id")
    private Staff assignedTechnician;

    // Constructors
    public MaintenanceOrder() {}

    public MaintenanceOrder(String vehicleVin, String serviceType, String status) {
        this.vehicleVin = vehicleVin;
        this.serviceType = serviceType;
        this.status = status;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public String getVehicleVin() {
        return vehicleVin;
    }

    public void setVehicleVin(String vehicleVin) {
        this.vehicleVin = vehicleVin;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Staff getAssignedTechnician() {
        return assignedTechnician;
    }

    public void setAssignedTechnician(Staff assignedTechnician) {
        this.assignedTechnician = assignedTechnician;
    }
}
