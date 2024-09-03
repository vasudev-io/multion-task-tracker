"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export default function TaskForm({ onAddTask }: { onAddTask: (task: { id: string; title: string; status: string; label: string; priority: string }) => void }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [label, setLabel] = useState("");
  const [priority, setPriority] = useState("");

  const handleSubmit = async () => {
    const newTask = {
      id: `TASK-${Date.now()}`,
      title: title,
      status: status,
      label: label,
      priority: priority,
    };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
       
        // Reset form fields
        setTitle("");
        setStatus("");
        setLabel("");
        setPriority("");
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="select">
        <option value="backlog">Backlog</option>
        <option value="in progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select value={label} onChange={(e) => setLabel(e.target.value)} className="select">
        <option value="feature">Feature</option>
        <option value="bug">Bug</option>
        <option value="documentation">Documentation</option>
      </select>
      <select value={priority} onChange={(e) => setPriority(e.target.value)} className="select">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <Button type="submit">Add Task</Button>
    </form>
  );
}