package com.example.todo.service;

import com.example.todo.model.User;
import com.example.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean registerUser(User user) {
        String email = user.getEmail() != null ? user.getEmail().trim().toLowerCase() : null;
        String password = user.getPassword() != null ? user.getPassword().trim() : null;

        if (!isValidEmail(email) || !isValidPassword(password)) {
            return false;
        }

        if (userRepository.existsByEmail(email)) {
            return false;
        }

        user.setEmail(email); // Normalize email before saving
        user.setPassword(password); // Trimmed password
        userRepository.save(user);
        return true;
    }

    public boolean authenticate(String email, String password) {
        if (email != null)
            email = email.trim().toLowerCase();
        if (password != null)
            password = password.trim();

        if (!isValidEmail(email) || !isValidPassword(password)) {
            return false;
        }

        // Case-insensitive email check
        return userRepository.findByEmailIgnoreCaseAndPassword(email, password) != null;
    }

    public User getUserByEmailAndPassword(String email, String password) {
        if (email != null)
            email = email.trim().toLowerCase();
        if (password != null)
            password = password.trim();

        if (!isValidEmail(email) || !isValidPassword(password)) {
            return null;
        }

        return userRepository.findByEmailIgnoreCaseAndPassword(email, password);
    }

    private boolean isValidEmail(String email) {
        return email != null && email.endsWith("@gmail.com");
    }

    private boolean isValidPassword(String password) {
        return password != null && password.length() >= 5;

    }

}
