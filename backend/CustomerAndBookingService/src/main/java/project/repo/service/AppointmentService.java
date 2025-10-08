package project.repo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.repo.entity.Appointment;
import project.repo.entity.Customer;
import project.repo.entity.Vehicle;
import project.repo.repository.AppointmentRepository;
import project.repo.repository.CustomerRepository;
import project.repo.repository.VehicleRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;

    // 🔹 Tạo mới Appointment
    public Appointment create(Appointment appointment) {
        // Kiểm tra và nạp lại Customer từ DB
        Customer customer = customerRepository.findById(appointment.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Kiểm tra và nạp lại Vehicle từ DB
        Vehicle vehicle = vehicleRepository.findById(appointment.getVehicle().getId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        appointment.setCustomer(customer);
        appointment.setVehicle(vehicle);

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> findAll() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> findById(Long id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> findByCustomer(Long customerId) {
        return appointmentRepository.findByCustomerId(customerId);
    }

    public List<Appointment> findByVehicle(Long vehicleId) {
        return appointmentRepository.findByVehicleId(vehicleId);
    }

    public Appointment update(Appointment appointment) {
        Customer customer = customerRepository.findById(appointment.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Vehicle vehicle = vehicleRepository.findById(appointment.getVehicle().getId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        appointment.setCustomer(customer);
        appointment.setVehicle(vehicle);

        return appointmentRepository.save(appointment);
    }

    public void delete(Long id) {
        appointmentRepository.deleteById(id);
    }
}
