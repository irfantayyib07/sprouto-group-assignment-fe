import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
 Table,
 TableBody,
 TableCaption,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Task } from "@/types/task";
import { Pencil, Trash2 } from "lucide-react";
import EditTaskDialog from "./EditTaskDialog";
import DeleteTaskDialog from "./DeleteTaskDialog";
import { capitalize, cn } from "@/lib/utils";

function formatDate(dateString: string) {
 const date = new Date(dateString);
 return new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
 }).format(date);
}

interface TaskTableProps {
 tasks: Task[];
 onTasksChanged: () => void;
}

function TaskTable({ tasks, onTasksChanged }: TaskTableProps) {
 const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
 const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
 const [viewingDescriptionTaskId, setViewingDescriptionTaskId] = useState<string | null>(null);

 const taskToEdit = tasks.find(task => task._id === editingTaskId) || null;
 const taskToDelete = tasks.find(task => task._id === deletingTaskId) || null;
 const taskWithDescription = tasks.find(task => task._id === viewingDescriptionTaskId) || null;

 const truncateDescription = (description: string) => {
  if (description.length > 50) {
   return `${description.substring(0, 50)}...`;
  }
  return description;
 };

 return (
  <>
   <Table className="mb-4">
    {tasks.length === 0 ? null : <TableCaption>You're all set!</TableCaption>}
    <TableHeader>
     <TableRow>
      <TableHead className="w-1/5">Title</TableHead>
      <TableHead className="w-2/5">
       Description <small>(Click to read full)</small>
      </TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Created</TableHead>
      <TableHead className="text-right">Actions</TableHead>
     </TableRow>
    </TableHeader>
    <TableBody>
     {tasks.length === 0 ? (
      <TableRow>
       <TableCell colSpan={5} className="text-center py-6 text-gray-500">
        No tasks match your current filters. Try adjusting your filters or add new tasks.
       </TableCell>
      </TableRow>
     ) : (
      tasks.map(task => (
       <TableRow key={task._id}>
        <TableCell className="font-medium">{task.title}</TableCell>
        <TableCell
         className={cn(task.description.length > 50 ? "cursor-pointer hover:text-blue-600" : "")}
         onClick={() => task.description.length > 50 && setViewingDescriptionTaskId(task._id)}
        >
         {truncateDescription(task.description)}
        </TableCell>
        <TableCell>
         <Badge
          className={
           task.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }
         >
          {capitalize(task.status)}
         </Badge>
        </TableCell>
        <TableCell>{formatDate(task.createdAt)}</TableCell>
        <TableCell className="text-right">
         <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditingTaskId(task._id)}>
           <Pencil className="h-4 w-4" />
          </Button>
          <Button
           variant="outline"
           size="sm"
           className="text-red-500 hover:text-red-700"
           onClick={() => setDeletingTaskId(task._id)}
          >
           <Trash2 className="h-4 w-4" />
          </Button>
         </div>
        </TableCell>
       </TableRow>
      ))
     )}
    </TableBody>
   </Table>

   {taskToEdit && (
    <EditTaskDialog
     isOpen={editingTaskId !== null}
     setIsOpen={isOpen => {
      if (!isOpen) setEditingTaskId(null);
     }}
     taskToEdit={taskToEdit}
     onSuccess={onTasksChanged}
    />
   )}

   {taskToDelete && (
    <DeleteTaskDialog
     isOpen={deletingTaskId !== null}
     setIsOpen={isOpen => {
      if (!isOpen) setDeletingTaskId(null);
     }}
     taskToDelete={taskToDelete}
     onSuccess={onTasksChanged}
    />
   )}

   {taskWithDescription && (
    <AlertDialog
     open={viewingDescriptionTaskId !== null}
     onOpenChange={open => {
      if (!open) setViewingDescriptionTaskId(null);
     }}
    >
     <AlertDialogContent>
      <AlertDialogHeader>
       <AlertDialogTitle>{taskWithDescription.title}</AlertDialogTitle>
       <AlertDialogDescription className="whitespace-pre-wrap">
        {taskWithDescription.description}
       </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
       <AlertDialogAction>Close</AlertDialogAction>
      </AlertDialogFooter>
     </AlertDialogContent>
    </AlertDialog>
   )}
  </>
 );
}

export default TaskTable;
