const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const tasksFilePath = path.join(__dirname, 'task.json');

let tasks = [];
let nextId = 1;

const loadTasks = () => {
    try {
        const data = fs.readFileSync(tasksFilePath, 'utf8');
        const jsonData = JSON.parse(data);
        tasks = jsonData.tasks || [];
        if (tasks.length > 0) {
            nextId = Math.max(...tasks.map(t => t.id)) + 1;
        }
    } catch (error) {
        console.error('Error loading tasks from file:', error.message);
        tasks = [];
        nextId = 1;
    }
};

// Save tasks to task.json file
const saveTasks = () => {
    try {
        const data = JSON.stringify({ tasks }, null, 2);
        fs.writeFileSync(tasksFilePath, data, 'utf8');
    } catch (error) {
        console.error('Error saving tasks to file:', error.message);
    }
};

// Load tasks on startup
loadTasks();

const isValidTask = (task, isUpdate = false) => {
    if (!task.title || typeof task.title !== 'string') {
        return false;
    }
    if (!task.description || typeof task.description !== 'string') {
        return false;
    }
    if (typeof task.completed !== 'boolean') {
        return false;
    }
    return true;
};

// GET /tasks - Get all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// GET /tasks/:id - Get a specific task
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(task);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, completed } = req.body;
    
    // Validate required fields
    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Invalid task data. Title, description, and completed are required.' });
    }
    
    const newTask = {
        id: nextId++,
        title,
        description,
        completed
    };
    
    tasks.push(newTask);
    saveTasks(); // Save to file
    res.status(201).json(newTask);
});
// PUT /tasks/:id - Update a task
// PUT /tasks/:id - Update a task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    const { title, description, completed } = req.body;
    
    // Validate task data
    if (!isValidTask({ title, description, completed })) {
        return res.status(400).json({ error: 'Invalid task data. Title, description (strings), and completed (boolean) are required.' });
    }
    
    tasks[taskIndex] = {
        id: taskId,
        title,
        description,
        completed
    };
    
    saveTasks(); // Save to file
    res.status(200).json(tasks[taskIndex]);
});
// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    saveTasks(); // Save to file
    res.status(200).json(deletedTask);
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;