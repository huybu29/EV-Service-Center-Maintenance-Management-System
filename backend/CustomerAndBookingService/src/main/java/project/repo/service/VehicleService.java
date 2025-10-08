package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.repo.entity.Vehicle;
import project.repo.entity.Customer;
import project.repo.repository.VehicleRepository;
import project.repo.repository.CustomerRepository;
import project.repo.dto.VehicleDTO;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository;

    // Lấy tất cả xe
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    // Lấy xe theo ID
    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    // Lấy danh sách xe theo Customer ID
    public List<Vehicle> getVehiclesByCustomerId(Long customerId) {
        return vehicleRepository.findByCustomerId(customerId);
    }

    // Tạo xe mới
    public Vehicle createVehicle(VehicleDTO vehicleDTO) {
        Customer customer = customerRepository.findById(vehicleDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Vehicle vehicle = Vehicle.builder()
                .licensePlate(vehicleDTO.getLicensePlate())
                .brand(vehicleDTO.getBrand())
                .model(vehicleDTO.getModel())
                .year(vehicleDTO.getYear())
                .customer(customer)
                .build();

        return vehicleRepository.save(vehicle);
    }

    // Cập nhật xe
    public Vehicle updateVehicle(Long id, VehicleDTO updatedVehicleDTO) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        vehicle.setLicensePlate(updatedVehicleDTO.getLicensePlate());
        vehicle.setBrand(updatedVehicleDTO.getBrand());
        vehicle.setModel(updatedVehicleDTO.getModel());
        vehicle.setYear(updatedVehicleDTO.getYear());

        if (updatedVehicleDTO.getCustomerId() != null) {
            Customer customer = customerRepository.findById(updatedVehicleDTO.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            vehicle.setCustomer(customer);
        }

        return vehicleRepository.save(vehicle);
    }

    // Xóa xe
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}
