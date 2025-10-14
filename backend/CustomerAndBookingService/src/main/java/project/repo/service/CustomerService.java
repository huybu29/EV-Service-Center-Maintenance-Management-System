package project.repo.service;

import project.repo.entity.Customer;
import project.repo.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    // Thêm khách hàng
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // Lấy danh sách khách hàng
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Tìm khách hàng theo ID
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    // Cập nhật khách hàng
    public Customer updateCustomer(Long id, Customer updatedCustomer) {
        return customerRepository.findById(id)
                .map(c -> {
                    c.setName(updatedCustomer.getName());
                    c.setEmail(updatedCustomer.getEmail());
                    c.setPhone(updatedCustomer.getPhone());
                    c.setAddress(updatedCustomer.getAddress());
                    return customerRepository.save(c);
                })
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    // Xóa khách hàng
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}
