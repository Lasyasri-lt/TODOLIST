package com.example.todo.controller;

import com.example.todo.model.Task;
import com.example.todo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/create")
    public ResponseEntity<?> createTask(@RequestBody Task task, @RequestParam String email) {
        Task created = taskService.saveTask(task, email);
        if (created == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ User not found or invalid input");
        }
        return ResponseEntity.ok(created);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTask(
            @PathVariable Long id,
            @RequestBody Task updatedTask,
            @RequestParam String email) {
        try {
            Task updated = taskService.updateTask(id, updatedTask, email);
            if (updated == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Task not found or unauthorized.");
            }
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error updating task: " + e.getMessage());
        }
    }

    @PutMapping("/complete/{id}")
    public ResponseEntity<?> toggleComplete(
            @PathVariable Long id,
            @RequestParam String email,
            @RequestParam boolean completed) {
        Task toggled = taskService.toggleTaskCompletion(id, email, completed);
        if (toggled == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Task not found or unauthorized.");
        }
        return ResponseEntity.ok(toggled);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, @RequestParam String email) {
        try {
            taskService.deleteTask(id, email);
            return ResponseEntity.ok("🗑️ Task deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Failed to delete task.");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllTasks(@RequestParam String email) {
        List<Task> tasks = taskService.getTasksByUser(email);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/category")
    public ResponseEntity<?> getTasksByCategory(@RequestParam String email, @RequestParam String category) {
        List<Task> tasks = taskService.getTasksByCategory(email, category);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/completed")
    public ResponseEntity<?> getCompletedTasks(@RequestParam String email) {
        List<Task> tasks = taskService.getTasksByCompletion(email, true);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/incomplete")
    public ResponseEntity<?> getIncompleteTasks(@RequestParam String email) {
        List<Task> tasks = taskService.getTasksByCompletion(email, false);
        return ResponseEntity.ok(tasks);
    }
}
