package project.repo.repository;

import project.repo.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Ví dụ: tìm khách hàng theo email
    Customer findByEmail(String email);
}
