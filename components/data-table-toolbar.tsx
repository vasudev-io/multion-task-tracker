"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { useState } from "react" 

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" 
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from "@/components/ui/drawer" 
import { priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

// Define props interface for DataTableToolbar
interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  // State for new task form
  const [taskTitle, setTaskTitle] = useState("") 
  const [taskStatus, setTaskStatus] = useState("")
  const [taskLabel, setTaskLabel] = useState("")
  const [taskPriority, setTaskPriority] = useState("")
  const [isCardOpen, setIsCardOpen] = useState(false)

  // Check if any filters are applied
  const isFiltered = table.getState().columnFilters.length > 0

  // Handle new task submission
  const handleSubmit = async () => {
    const newTask = {
      id: `TASK-${Date.now()}`,
      title: taskTitle,
      status: taskStatus,
      label: taskLabel,
      priority: taskPriority,
    }

    // Send POST request to add new task
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })

    // Reset form if task is added successfully
    if (response.ok) {
      setTaskTitle("")
      setTaskStatus("")
      setTaskLabel("")
      setTaskPriority("")
      setIsCardOpen(false)
    }
  }

  return (
    <div className="flex items-center justify-between space-x-4">
      {/* Drawer for adding new task */}
      <Drawer open={isCardOpen} onOpenChange={setIsCardOpen}>
        <DrawerTrigger asChild>
          {/* Button to "ADD TASK" */}
          <Button onClick={() => setIsCardOpen(true)}>Add Task</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add New Task</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            {/* Input fields for new task */}
            <Input
              placeholder="Task Title - e.g. 'Fix the bug'"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <Input
              placeholder="Status - backlog, in progress, todo"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
            />
            <Input
              placeholder="Label - feature, bug, documentation"
              value={taskLabel}
              onChange={(e) => setTaskLabel(e.target.value)}
            />
            <Input
              placeholder="Priority - low, medium, high"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
            />
          </div>
          <DrawerFooter>
            <Button onClick={handleSubmit}>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* Filtering and view options */}
      <div className="flex flex-1 items-center space-x-4">
        {/* Input for filtering tasks by title */}
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* Faceted filter for status */}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {/* Faceted filter for priority */}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )}
        {/* Reset filters button */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {/* Table view options */}
      <DataTableViewOptions table={table} />
    </div>
  )
}
