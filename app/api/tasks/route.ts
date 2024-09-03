import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { taskSchema } from '@/data/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const data = await fs.readFile(path.join(process.cwd(), '/data/tasks.json'));
  const tasks = JSON.parse(data.toString());
  const parsedTasks = z.array(taskSchema).parse(tasks);
  return NextResponse.json(parsedTasks);
}

export async function POST(req: NextRequest) {
  try {
    const tasksFilePath = path.join(process.cwd(), 'data', 'tasks.json');
    const tasksData = JSON.parse(await fs.readFile(tasksFilePath, 'utf8'));
    
    const newTask = await req.json();
    const parsedTask = taskSchema.parse(newTask);
    tasksData.push(parsedTask);
    
    await fs.writeFile(tasksFilePath, JSON.stringify(tasksData, null, 2));
    
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

    const tasksFilePath = path.join(process.cwd(), 'data', 'tasks.json');
    let tasksData = JSON.parse(await fs.readFile(tasksFilePath, 'utf8'));

    const taskIndex = tasksData.findIndex((task: any) => task.id === id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    tasksData.splice(taskIndex, 1);

    await fs.writeFile(tasksFilePath, JSON.stringify(tasksData, null, 2));

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}