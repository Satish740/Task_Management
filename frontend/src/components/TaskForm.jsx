import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskForm = ({ task, onTaskSaved, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [task]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const taskData = { title, description };

        try {
            if (task) {
                // Update existing task
                await axios.put(`/api/tasks/${task.id}/`, taskData);
            } else {
                // Create new task
                await axios.post('/api/tasks/', taskData);
            }
            setTitle(''); 
            setDescription(''); 
            onTaskSaved(); 
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{task ? 'Edit Task' : 'Add Task'}</h2>
            <label>
                Title:
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </label>
            <label>
                Description:
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </label>
            <div><button type="submit" >{task ? 'Update Task' : 'Add Task'}</button> 
            
            {task && <button type="button" onClick={onCancel}>Cancel</button>}
        </div>
            </form>
    );
};

export default TaskForm;
