import { useEffect, useState } from 'react';
import Modal from './Modal';
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { Priority, Task, TaskForm } from '@/model/task';
import { useTask } from './TaskProvider';

type TaskModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PRIORITIES = [
  'High',
  'Medium',
  'Low'
];

export default function TaskModal({open,setOpen}:TaskModalProps) {
    const {
      editTask,
      onAdd,
      onEdit,
      clearEditTask,
      clearDeleteTask,
    } = useTask();
    

  const defaultFormData: TaskForm = {
      id: '',
      priority: '',
      description: '',
      dueDate: '',
      status: 'not_started',
  };
  
  const [formData, setFormData] = useState<TaskForm>(defaultFormData);

  useEffect(() => {
    if (editTask) {
      setFormData({
        id: editTask.id || '',
        priority: editTask.priority || '',
        description: editTask.name || '',
        dueDate: editTask.dueDate || '',
        status: editTask.status || 'not_started',
      });
    }
  }, [editTask]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.description || !formData.priority) {
      alert("Please fill out all required fields.");
      return;
    }
  
    if(editTask)
    {
      const updatedTask: Task = {
        id: editTask.id,
        name: formData.description,
        dueDate: editTask.dueDate,
        priority: formData.priority as Priority,
        status: editTask.status,
      };
    
      onEdit(updatedTask);
    }else{
      const newTask: Task = {
        id: formData.id || crypto.randomUUID(),
        name: formData.description,
        dueDate: new Date().toISOString().slice(0, 10),
        priority: formData.priority as Priority,
        status: formData.status,
      };
    
      onAdd(newTask);
    }
    
    handleClear();
    setFormData(defaultFormData);
  };
  
  const handleClear = () => {
    setOpen(false);
    clearEditTask();
    clearDeleteTask();
  }

  return (
    <Modal open={open} setOpen={setOpen} className='sm:max-w-xl'>
      <form onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold text-center"> Task Modal Form</h1>
        <div className="mt-2 col-span-full">
          <label htmlFor="priority" className="block text-sm/6 font-medium">
            Priority
          </label>
          <div className="mt-2 grid grid-cols-1">
          <select
            id="priority"
            name="priority"
            value={formData?.priority}
            onChange={handleChange}
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
          >
            <option value="">Select priority</option>
            {PRIORITIES.map((item, index) => (
              <option key={index} value={item}>
                {item}
            </option>
            ))}
          </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </div>
        </div>
        <div className="col-span-full mt-2">
          <label htmlFor="description" className="block text-sm/6 font-medium">
            Description
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={5}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              defaultValue={formData?.description}
            />
          </div>
        </div>
        <div className="mt-5 sm:mt-6 flex justify-center gap-4 w-2/3 mx-auto">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
      </div>
      </form>
    </Modal>
  )
}
