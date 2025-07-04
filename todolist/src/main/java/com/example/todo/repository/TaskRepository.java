package com.example.todo.repository;

import com.example.todo.model.Task;
import com.example.todo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);

    List<Task> findByUserAndCategory(User user, String category);

    List<Task> findByUserAndCompleted(User user, boolean completed);
}
