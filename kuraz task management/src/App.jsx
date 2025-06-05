import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState("all"); //defualt filter method "all"
  const [sortOrder, setSort] = useState("dueDate"); //making defualt sorting mathod to "dueDate"

  useEffect(() => {
    const storedTasks = localStorage.getItem("task");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]); //when ever the the task changes this hook runs

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  //adding tasks
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.title.trim() === "") {
      alert("Title cannot be empty.");
      return;
    }
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        ...newTask,
        completed: false,
      },
    ]);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
    });
  };

  //handling Delete Task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleCompleteTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEditTask = (task) => {
    setEditTask(task);
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (editTask.title.trim() === "") {
      alert("Title Cannot Be Empty!");
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === editTask.id ? { ...task, ...editTask } : task
      )
    );
    setEditTask(null);
  };

  const handleCancelEdit = () => {
    setEditTask(null);
  };

  //handling filters

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredTasks = () => {
    switch (filter) {
      case "completed":
        return tasks.filter((task) => task.completed);
      case "incomplete":
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  };

  //handling sort order

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const sortedTasks = () => {
    const filtered = filteredTasks();
    return [...filtered].sort((a, b) => {
      //core sorting logic
      if (sortOrder === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else {
        return a.title.localCompare(b.title);
      }
    });
  };

  return (
    <div className="app">
      <h1>
        Kuraz Tech
        <br /> Task Management App
      </h1>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          name="title"
          placeholder="Enter Task Title"
          value={newTask.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Enter Description Here"
          value={newTask.description}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="duDate"
          value={newTask.duDate}
          onChange={handleInputChange}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="filter-sort">
        <label htmlFor="filter">Filter</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>

        <label htmlFor="sort">Sort BY </label>
        <select id="sort" value={sortOrder} onChange={handleSortChange}>
          <option value="DueDate">Due Date</option>
          <option value="title">Title</option>
        </select>
      </div>
      {/*listing tasks*/}
      <ul className="task-list">
        {sortedTasks().map((task) => (
          <li
            key={task.id}
            className={`task-item ${task.completed ? "completed" : ""}`}
          >
            {editTask && editTask.id === task.id ? (
              // edit action
              <form onsubmit={handleUpdateTask} className="edit-form">
                <input
                  type="text"
                  name="title"
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask({ ...editTask, title: e.target.value })
                  }
                  required
                />

                <textarea
                  name="description"
                  value={editTask.description}
                  onChange={(e) =>
                    setEditTask({ ...editTask, description: e.target.value })
                  }
                />

                <input
                  type="date"
                  name="dueDate"
                  value={editTask.dueDate}
                  onChange={(e) =>
                    setEditTask({ ...editTask, dueDate: e.target.value })
                  }
                />
                <button type="submit" id="update-button">
                  Update
                </button>
                <button
                  type="button"
                  id="cancel-button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </form>
            ) : (
              //Displaying The Tasks

              //JSX component must have one parent element <> </>
              <>
                <div className="task-details">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Due Date {task.dueDate}</p>
                </div>
                <div className="task-actions">
                  <button onClick={() => handleCompleteTask(task.id)}>
                    {task.completed ? "Incomplete" : "Completed"}
                  </button>
                  <button onClick={() => handleEditTask(task)}>Edit</button>
                  <button onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
