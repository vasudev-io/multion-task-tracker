import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';
import { taskSchema } from '@/data/schema';
import { z } from 'zod';

export async function GET() {
  const tasks = await kv.get('tasks') || [];
  const parsedTasks = z.array(taskSchema).parse(tasks);
  return NextResponse.json(parsedTasks);
}

export async function POST(req: NextRequest) {
  try {
    const newTask = await req.json();
    const parsedTask = taskSchema.parse(newTask);
    const tasks = await kv.get('tasks') || [];
    tasks.push(parsedTask);
    await kv.set('tasks', tasks);
    return NextResponse.json({ message: 'Task added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding task:', error);
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const tasks = await kv.get('tasks') || [];
    const updatedTasks = tasks.filter((task: any) => task.id !== id);
    await kv.set('tasks', updatedTasks);

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}