import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { taskSchema } from '@/data/schema';

export async function GET() {
  const data = await fs.readFile(path.join(process.cwd(), '/data/tasks.json'));
  const tasks = JSON.parse(data.toString());
  const parsedTasks = z.array(taskSchema).parse(tasks);
  return Response.json(parsedTasks);
}
