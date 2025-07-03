import React, { useState, useEffect, useCallback } from "react";
import { FaUserCircle } from "react-icons/fa";

import axios from "axios";
import "./TodoMain.css";

const TodoMain = ({ onLogout, selectedCategory }) => {
  const [taskCategory, setTaskCategory] = useState(selectedCategory || "Personal");
  const [formVisible, setFormVisible] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", due: "", priority: "" });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [taskDropdownOpen, setTaskDropdownOpen] = useState(true);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);


  const email = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName") || "User";


  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8080/tasks/all?email=${email}`);
      let filtered = res.data;

      if (filter === "completed") {
        filtered = filtered.filter((task) => task.completed);
      } else if (filter === "incomplete") {
        filtered = filtered.filter((task) => !task.completed);
      } else {
        filtered = filtered.filter(
          (task) =>
            !task.completed &&
            (taskCategory === "all" || task.category === taskCategory)
        );
      }

      setTasks(filtered);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  }, [email, filter, taskCategory]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;

    try {
      if (editingTaskId) {
        await axios.put(
          `http://localhost:8080/tasks/update/${editingTaskId}?email=${email}`,
          {
            title: form.title,
            description: form.description,
            due: form.due,
            priority: form.priority,
            category: taskCategory,
            completed: false,
          }
        );
        setSuccessMessage("✅ Task updated successfully!");
      } else {
        await axios.post(
          `http://localhost:8080/tasks/create?email=${email}`,
          {
            ...form,
            category: taskCategory,
            completed: false,
          }
        );
        setSuccessMessage("✅ Task added successfully!");
      }

      setForm({ title: "", description: "", due: "", priority: "" });
      setEditingTaskId(null);
      setFormVisible(false);

      await fetchTasks();
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Failed to save task", err);
    }
  };

  const toggleComplete = async (taskId, currentStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/tasks/complete/${taskId}?email=${email}&completed=${!currentStatus}`
      );
      await fetchTasks();
      setSuccessMessage("✅ Task Completed!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Failed to toggle task completion", err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/tasks/delete/${taskId}?email=${email}`);
      await fetchTasks();
      setSuccessMessage("🗑️ Task deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description || "",
      due: task.due ? task.due.substring(0, 16) : "",
      priority: task.priority ? String(task.priority) : "",
    });
    setTaskCategory(task.category);
    setEditingTaskId(task.id);
    setFormVisible(true);
    setSuccessMessage("");
  };

  const handleCategoryChange = (category) => {
    setTaskCategory(category);
    setFilter("all");
    setFormVisible(false);
    setSuccessMessage("");
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setFormVisible(false);
    setSuccessMessage("");
  };

  const getHeading = () => {
    if (filter === "completed") return "Completed Tasks";
    if (filter === "incomplete") return "Incomplete Tasks";
    if (taskCategory === "all") return "All Tasks";
    return `${taskCategory} Tasks`;
  };

  return (
    <div className="todo-main">
      <div className="header">
        <span className="brand-check">Check</span>
        <span className="brand-todo">Todo</span> ✅
      </div>

      <div className="sidebar">
  <div className="profile-section">
  <div
    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
    style={{ cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}
  >
    <FaUserCircle size={20} />
    {userName}
  </div>
  {profileDropdownOpen && (
    <ul className="profile-dropdown">
      <li onClick={onLogout}>Logout</li>
    </ul>
  )}
</div>
<hr style={{ margin: "1px 0", border: "0.5px solid #ccc" }} />

        <div className="dropdown-section">
          <div onClick={() => setTaskDropdownOpen(!taskDropdownOpen)} style={{ cursor: "pointer", fontWeight: "bold" }}>
            {taskDropdownOpen ? "▾" : "▸"} My Tasks
          </div>
          {taskDropdownOpen && (
            <ul className="task-category-list">
              <li onClick={() => handleCategoryChange("Personal")}>Personal</li>
              <li onClick={() => handleCategoryChange("Work")}>Work</li>
              <li onClick={() => handleCategoryChange("all")}>All</li>
            </ul>
          )}

          <div onClick={() => setFilterDropdownOpen(!filterDropdownOpen)} style={{ cursor: "pointer", fontWeight: "bold", marginTop: "16px" }}>
            {filterDropdownOpen ? "▾" : "▸"} Filter
          </div>
          {filterDropdownOpen && (
            <ul className="filter-list">
              <li onClick={() => handleFilterChange("completed")}>Completed</li>
              <li onClick={() => handleFilterChange("incomplete")}>Incomplete</li>
            </ul>
          )}
        </div>
      </div>

      <div className="main-content">
        {formVisible && (
          <div className="task-box">
            <h2>{editingTaskId ? "Edit Task" : "Add New Task"}</h2>
            <form className="task-form" onSubmit={handleSubmit}>
              <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
              <input name="description" placeholder="Description (optional)" value={form.description} onChange={handleChange} />
              <input type="datetime-local" name="due" value={form.due} onChange={handleChange} />
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="">Priority</option>
                <option value="1">⭐</option>
                <option value="2">⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
              </select>
              <select name="category" value={taskCategory} onChange={(e) => setTaskCategory(e.target.value)}>
                <option value="">Category</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
              </select>
              <button type="submit">{editingTaskId ? "Update" : "Add"}</button>
            </form>
            {successMessage && <div className="success-box">{successMessage}</div>}
          </div>
        )}

        {!formVisible && (
          <>
            <div className="task-header">
              <h2>{getHeading()}</h2>
              <button className="add-task-btn" onClick={() => {
                setFormVisible(true);
                setEditingTaskId(null);
                setForm({ title: "", description: "", due: "", priority: "" });
              }}>
                + Add Task
              </button>
            </div>

            {successMessage && <div className="success-box animated-check">{successMessage}</div>}

            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id} className={`task-item${task.completed ? " completed" : ""}`}>
                  <div>
                    <strong>{task.title}</strong>
                    {task.description && <span> - {task.description}</span>}
                  </div>
                  <div>
                    {task.due && <span>Due: {task.due.replace("T", " ")} </span>}
                    {task.priority && <span>Priority: {"⭐".repeat(parseInt(task.priority))}</span>}
                  </div>
                  <div className="task-actions">
                    {filter !== "completed" && (
                      <>
                        <button onClick={() => toggleComplete(task.id, task.completed)}>Complete</button>
                        <button onClick={() => handleEdit(task)}>Edit</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(task.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoMain;
