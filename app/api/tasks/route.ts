import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import { taskSchema, Task } from '@/data/schema';
import { z } from 'zod';

// GET endpoint to retrieve all tasks
export async function GET() {
  // Fetch tasks from Vercel KV storage, or return an empty array if none exist
  const tasks = await kv.get<Task[]>('tasks') || [];

  // Parse and validate the tasks using Zod schema
  const parsedTasks = z.array(taskSchema).parse(tasks);

  // Return the tasks as a JSON response
  return NextResponse.json(parsedTasks);
}

// POST endpoint to add a new task
export async function POST(req: NextRequest) {
  try {
    // Parse the request body to get the new task data
    const newTask = await req.json();

    // Validate the new task using the taskSchema
    const parsedTask = taskSchema.parse(newTask);

    // Fetch existing tasks or initialize an empty array
    const tasks = await kv.get<Task[]>('tasks') || [];

    // Add the new task to the array
    tasks.push(parsedTask);

    // Save the updated tasks array back to KV storage
    await kv.set('tasks', tasks);

    return NextResponse.json({ message: 'Task added successfully' }, { status: 200 });
  } catch (error) {

    console.error('Error adding task:', error);
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}

// DELETE endpoint to remove a task
export async function DELETE(req: NextRequest) {
  try {
    // Extract the task ID from the request URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Check if an ID was provided
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Fetch existing tasks
    const tasks = await kv.get<Task[]>('tasks');
    // Check if tasks exist
    if (!tasks) {
      return NextResponse.json({ error: 'No tasks found' }, { status: 404 });
    }

    // Filter out the task with the given ID
    const updatedTasks = tasks.filter((task) => task.id !== id);
    // Save the updated tasks array back to KV storage
    await kv.set('tasks', updatedTasks);

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });

  } catch (error) {

    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}