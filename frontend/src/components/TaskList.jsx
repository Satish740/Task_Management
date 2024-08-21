import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm'; // Component for add/edit forms

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/tasks/');
            setTasks(response.data);
            if (response.data.length === 0) {
                setEditingTask(null); // Switch to "Add New Task" if no tasks
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`);
            setTasks(tasks.filter(task => task.id !== id));
            
            // Check if the deleted task was the one being edited
            if (editingTask && editingTask.id === id) {
                setEditingTask(null); // Switch to "Add New Task" if the currently edited task is deleted
            }
            
            // If there are no tasks left and no task is being edited, switch to "Add New Task"
            if (tasks.length === 1 && !editingTask) {
                setEditingTask(null); // Ensure we are in "Add New Task" mode if all tasks are deleted
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };
    

    const handleEdit = (task) => {
        setEditingTask(task);
    };

    const handleAddNew = () => {
        setEditingTask(null); // Switch to "Add New Task" mode
    };

    const handleTaskSaved = () => {
        fetchTasks(); // Refresh the task list and switch to "Add New Task" mode
        handleAddNew();
    };

    return (
        <div className="task-list-container">
            <h1 className="task-list-header">Task Manager</h1>
          
            <TaskForm 
                task={editingTask} 
                onTaskSaved={handleTaskSaved} // Use handleTaskSaved here
                onCancel={handleAddNew} // Pass handleAddNew to TaskForm
            />
            {tasks.length === 0 && !editingTask && (
                <div className="no-tasks-message">No tasks available. Please add a new task.</div>
            )}
            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task.id} className="task-list-item">
                        <span>{task.title} - {task.description}</span>
                        <div>
                            <button onClick={() => handleEdit(task)} className="task-list-button edit-button" >
                                Edit
                            </button>
                            <button onClick={() => deleteTask(task.id)} className="task-list-button delete-button" >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
