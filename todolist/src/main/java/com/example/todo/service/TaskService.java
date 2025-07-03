package com.example.todo.service;

import com.example.todo.model.Task;
import com.example.todo.model.User;
import com.example.todo.repository.TaskRepository;
import com.example.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepo;

    @Autowired
    private UserRepository userRepo;

    public Task saveTask(Task task, String email) {
        User user = userRepo.findByEmailIgnoreCase(email);
        if (user == null)
            return null;

        task.setUser(user);
        return taskRepo.save(task);
    }

    public Task updateTask(Long taskId, Task updatedTask, String email) {
        Optional<Task> optionalTask = taskRepo.findById(taskId);
        if (optionalTask.isEmpty()) {
            System.err.println("❌ Task not found: " + taskId);
            return null;
        }

        Task existingTask = optionalTask.get();

        // Fetch user from email
        User user = userRepo.findByEmailIgnoreCase(email);
        if (user == null) {
            System.err.println("❌ No user found with email: " + email);
            return null;
        }

        // If task has no user assigned, assign now
        if (existingTask.getUser() == null) {
            existingTask.setUser(user);
        }

        // Sanity check
        if (!existingTask.getUser().getEmail().equalsIgnoreCase(email)) {
            System.err.println("❌ Email mismatch: " + email + " vs " + existingTask.getUser().getEmail());
            return null;
        }

        // Proceed with update
        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setDue(updatedTask.getDue());
        existingTask.setPriority(updatedTask.getPriority());
        existingTask.setCategory(updatedTask.getCategory());
        if (updatedTask.getCompleted() != null) {
            existingTask.setCompleted(updatedTask.getCompleted());
        }

        try {
            return taskRepo.save(existingTask);
        } catch (Exception e) {
            e.printStackTrace(); // Print full error in logs
            return null;
        }
    }

    public Task toggleTaskCompletion(Long taskId, String email, boolean completed) {
        Optional<Task> optionalTask = taskRepo.findById(taskId);
        if (optionalTask.isEmpty())
            return null;

        Task task = optionalTask.get();
        User taskUser = task.getUser();
        if (taskUser == null || !taskUser.getEmail().equalsIgnoreCase(email))
            return null;

        task.setCompleted(completed);
        return taskRepo.save(task);
    }

    public void deleteTask(Long taskId, String email) {
        Optional<Task> optionalTask = taskRepo.findById(taskId);
        if (optionalTask.isEmpty())
            return;

        Task task = optionalTask.get();
        User taskUser = task.getUser();
        if (taskUser == null || !taskUser.getEmail().equalsIgnoreCase(email))
            return;

        taskRepo.delete(task);
    }

    public List<Task> getTasksByUser(String email) {
        User user = userRepo.findByEmailIgnoreCase(email);
        return user != null ? taskRepo.findByUser(user) : List.of();
    }

    public List<Task> getTasksByCategory(String email, String category) {
        User user = userRepo.findByEmailIgnoreCase(email);
        return user != null ? taskRepo.findByUserAndCategory(user, category) : List.of();
    }

    public List<Task> getTasksByCompletion(String email, boolean completed) {
        User user = userRepo.findByEmailIgnoreCase(email);
        return user != null ? taskRepo.findByUserAndCompleted(user, completed) : List.of();
    }
}
