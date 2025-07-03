package com.example.todo.controller;

import com.example.todo.model.User;
import com.example.todo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000") // Important for frontend to connect
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        if (user.getEmail() == null || !user.getEmail().endsWith("@gmail.com")) {
            return ResponseEntity.badRequest().body("❌ Email must end with @gmail.com");
        }

        if (user.getPassword() == null || user.getPassword().length() < 5) {
            return ResponseEntity.badRequest().body("❌ Password must be at least 5 characters");
        }

        boolean success = userService.registerUser(user);
        if (success) {
            return ResponseEntity.ok("✅ Signup Successful");
        } else {
            return ResponseEntity.badRequest().body("⚠️ Email already registered.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        if (user.getEmail() == null || !user.getEmail().endsWith("@gmail.com")) {
            return ResponseEntity.badRequest().body("❌ Invalid Email Format");
        }

        if (user.getPassword() == null || user.getPassword().length() < 5) {
            return ResponseEntity.badRequest().body("❌ Password must be at least 5 characters");
        }

        User validUser = userService.getUserByEmailAndPassword(user.getEmail(), user.getPassword());
        if (validUser != null) {
            Map<String, String> response = new HashMap<>();
            response.put("name", validUser.getName());  // assuming getName() exists
            response.put("email", validUser.getEmail());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("❌ Invalid Credentials");
        }
    }
}
