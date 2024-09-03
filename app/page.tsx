"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { UserNav } from "../components/user-nav";
import { taskSchema } from "../data/schema";
import { Task } from "../data/schema";
import Image from 'next/image';
import ChatSupport from "../components/chat-support";

export default function TaskPage() {
  // State for user ID and tasks
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Function to fetch tasks from the API
  const fetchTasks = () => {
    if (userId) {
      fetch('/api/tasks')
        .then(response => response.json())
        .then(setTasks)
        .catch(error => console.error('Error fetching tasks:', error));
    }
  };

  // Effect to handle authentication on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const userIdFromUrl = params.get('user_id');

    if (code) {
      exchangeCodeForToken(code);
    } else if (userIdFromUrl) {
      setUserId(userIdFromUrl);
      localStorage.setItem('multion_user_id', userIdFromUrl);
    } else {
      const storedUserId = localStorage.getItem('multion_user_id');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  // Effect to fetch tasks when userId changes
  useEffect(() => {
    fetchTasks();
  }, [userId]);

  // Function to exchange authorization code for token
  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await fetch(`/api/chat?code=${code}`);
      const data = await response.json();
      if (data.success && data.userId) {
        setUserId(data.userId);
        localStorage.setItem('multion_user_id', data.userId);
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    }
  };

  // Function to initiate Multion authentication
  const connectWithMultion = () => {
    const orgId = process.env.MULTION_ORG_ID;
    const redirectUri = encodeURIComponent(window.location.origin);
    const multionAuthUrl = `https://platform.multion.ai/authorize?org_id=${orgId}&redirect_uri=${redirectUri}`;
    window.location.href = multionAuthUrl;
  };

  // Function to handle user sign out
  const handleSignOut = () => {
    setUserId(null);
    localStorage.removeItem('multion_user_id');
  };

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Task Tracker</h2>
            <p className="text-muted-foreground">
              {userId ? "Welcome back! Here's a list of your tasks for this month!" : "Please log in to view your tasks."}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {!userId ? (
              <Button onClick={connectWithMultion}>
                Login with Multion
              </Button>
            ) : (
              <>
                <p className="text-sm font-medium">Logged in</p>
                <UserNav />
                <Button onClick={handleSignOut} variant="destructive">
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
        {userId && <DataTable data={tasks} columns={columns} meta={{
          refreshData: fetchTasks
        }} />}
      </div>
      {userId && <ChatSupport />}
    </>
  );
}
