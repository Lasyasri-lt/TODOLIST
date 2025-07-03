package com.example.todo.repository;

import com.example.todo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    User findByEmailIgnoreCaseAndPassword(String email, String password);

    User findByEmailIgnoreCase(String email);

    User getUserByEmailAndPassword(String email, String password);

}
