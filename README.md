# Task Manager API

A simple RESTful API for managing tasks built with Express.js.

## Features

- Create, read, update, and delete tasks
- File-based data persistence using `task.json`
- Input validation
- RESTful API design
- Pre-loaded with 15 sample tasks

## Prerequisites

- Node.js >= 18.0.0
- npm (Node Package Manager)

## Installation

1. Clone the repository or navigate to the project directory:
```bash
cd task-manager
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the server:
```bash
node app.js
```

The server will start on port 3000. You should see:
```
Server is listening on 3000
```

## API Endpoints

### Get All Tasks
```
GET /tasks
```
Returns a list of all tasks.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true
  }
]
```

### Get Task by ID
```
GET /tasks/:id
```
Returns a specific task by ID.

**Response:** `200 OK` or `404 Not Found`
```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true
}
```

### Create a New Task
```
POST /tasks
```
Creates a new task.

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description here",
  "completed": false
}
```

**Response:** `201 Created` or `400 Bad Request`

**Validation:**
- `title` (required, string)
- `description` (required, string)
- `completed` (required, boolean)

### Update a Task
```
PUT /tasks/:id
```
Updates an existing task.

**Request Body:**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true
}
```

**Response:** `200 OK`, `400 Bad Request`, or `404 Not Found`

### Delete a Task
```
DELETE /tasks/:id
```
Deletes a task by ID.

**Response:** `200 OK` or `404 Not Found`

## Testing

### Automated Tests

Run the test suite:
```bash
npm test
```
