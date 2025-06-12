'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { db } from '../../../firebaseConfig.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDocs, getDoc } from 'firebase/firestore';
import { DndContext, closestCenter, useSensor, useSensors, MouseSensor, TouchSensor, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate - now;
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg text-center">
      <h3 className="text-md font-medium text-gray-900 mb-2">Time to July 15, 2025</h3>
      <div className="flex justify-center space-x-4">
        <div><p className="text-2xl font-bold text-teal-600">{timeLeft.days}</p><p className="text-sm text-gray-500">Days</p></div>
        <div><p className="text-2xl font-bold text-teal-600">{timeLeft.hours}</p><p className="text-sm text-gray-500">Hours</p></div>
        <div><p className="text-2xl font-bold text-teal-600">{timeLeft.minutes}</p><p className="text-sm text-gray-500">Minutes</p></div>
        <div><p className="text-2xl font-bold text-teal-600">{timeLeft.seconds}</p><p className="text-sm text-gray-500">Seconds</p></div>
      </div>
    </div>
  );
};

// Sortable Task Item
const SortableTask = ({ task, openTaskModal, handleDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-md shadow-sm mb-2 border border-gray-200 cursor-grab"
      role="listitem"
      aria-label={`Task: ${task.title}`}
    >
      <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
      <p className="text-xs text-gray-500">{task.description || 'No description'}</p>
      <p className="text-xs text-gray-500">Assigned: {task.assignedTo || 'Unassigned'}</p>
      <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      <p className="text-xs text-gray-500">Priority: {task.priority}</p>
      <div className="mt-2 flex justify-between">
        <button
          onClick={() => openTaskModal(task)}
          className="text-teal-600 hover:text-teal-900 text-xs"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(task.id, 'tasks')}
          className="text-red-600 hover:text-red-900 text-xs"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// Kanban Column
const KanbanColumn = ({ status, tasks, openTaskModal, handleDelete }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-inner">
      <h3 className="text-md font-semibold text-gray-900 mb-3 capitalize">{status.replace('-', ' ')}</h3>
      <div
        ref={setNodeRef}
        className={`min-h-[200px] ${isOver ? 'bg-teal-100' : ''}`}
        role="listbox"
        aria-label={`${status} tasks`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTask
              key={task.id}
              task={task}
              openTaskModal={openTaskModal}
              handleDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </div>
      <button
        onClick={() => openTaskModal()}
        className="mt-2 w-full px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 text-sm"
      >
        Add Task
      </button>
    </div>
  );
};

export default function EngineeringDashboard() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [burndownData, setBurndownData] = useState({});
  const [selectedKanbanProjectId, setSelectedKanbanProjectId] = useState('all');
  const [selectedBurndownProjectId, setSelectedBurndownProjectId] = useState('all');
  const [selectedTimelineProjectId, setSelectedTimelineProjectId] = useState('all');
  const [newProject, setNewProject] = useState({ name: '', description: '', startDate: '', endDate: '', status: 'planning' });
  const [newTask, setNewTask] = useState({ projectId: '', title: '', description: '', assignedTo: '', dueDate: '', priority: 'medium', status: 'to-do' });
  const [newUpdate, setNewUpdate] = useState({ projectId: '', taskId: '', message: '', author: '' });
  const [editingId, setEditingId] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const router = useRouter();

  // Dnd-kit sensors
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin');
      return;
    }

    const unsubscribeProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectData);
      setLoading(false);
    });

    const unsubscribeTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const taskData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(taskData);
      updateBurndownData(taskData);
    });

    const unsubscribeUpdates = onSnapshot(collection(db, 'updates'), (snapshot) => {
      setUpdates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeProjects();
      unsubscribeTasks();
      unsubscribeUpdates();
    };
  }, [router]);

  const updateBurndownData = async (taskData) => {
    if (!projects.length) return;

    // Calculate burndown data for individual projects
    for (const project of projects) {
        const projectTasks = taskData.filter(task => task.projectId === project.id);
        const totalTasks = projectTasks.length;

        // Use the current actual date instead of hardcoded date
        const now = new Date();
        const burndownRecords = [];
        
        // Create daily data for the past 14 days
        for (let i = 14; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const formattedDate = day.toISOString().split('T')[0];
        
        // For past days, calculate how many tasks were not completed on that day
        const tasksRemainingOnDay = projectTasks.filter(task => {
            if (task.status !== 'completed') return true;
            // If task is completed, check if it was completed after this day
            const completedDate = task.completedDate ? new Date(task.completedDate) : null;
            return !completedDate || completedDate > day;
        }).length;
        
        burndownRecords.push({
            date: formattedDate,
            tasksRemaining: tasksRemainingOnDay
        });
        }

        const burndownCollection = collection(db, 'projects', project.id, 'burndown');
        
        // First clear existing burndown records
        const existingDocs = await getDocs(burndownCollection);
        for (const docSnapshot of existingDocs.docs) {
        await deleteDoc(doc(db, 'projects', project.id, 'burndown', docSnapshot.id));
        }
        
        // Add the new burndown records
        for (const record of burndownRecords) {
        await addDoc(burndownCollection, record);
        }

        const burndownSnapshot = await getDocs(burndownCollection);
        setBurndownData(prev => ({
        ...prev,
        [project.id]: burndownSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        }));
    }

    // Calculate aggregated burndown data for all projects
    const allTasks = taskData;
    const now = new Date();
    const allBurndownRecords = [];
    
    // Create daily data for the past 14 days
    for (let i = 14; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const formattedDate = day.toISOString().split('T')[0];
        
        // Count tasks that were not completed by that date
        const tasksRemainingOnDay = allTasks.filter(task => {
        if (task.status !== 'completed') return true;
        // If task is completed, check if it was completed after this day
        const completedDate = task.completedDate ? new Date(task.completedDate) : null;
        return !completedDate || completedDate > day;
        }).length;
        
        allBurndownRecords.push({
        date: formattedDate,
        tasksRemaining: tasksRemainingOnDay
        });
    }

    setBurndownData(prev => ({
        ...prev,
        all: allBurndownRecords,
    }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const projectData = {
        name: newProject.name,
        description: newProject.description,
        startDate: new Date(newProject.startDate).toISOString(),
        endDate: new Date(newProject.endDate).toISOString(),
        status: newProject.status,
      };
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), projectData);
        setEditingId(null);
        showNotification('Project updated successfully');
      } else {
        await addDoc(collection(db, 'projects'), projectData);
        showNotification('Project added successfully');
      }
      setNewProject({ name: '', description: '', startDate: '', endDate: '', status: 'planning' });
      setIsProjectModalOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      showNotification('Failed to save project', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        const taskData = {
        projectId: newTask.projectId,
        title: newTask.title,
        description: newTask.description,
        assignedTo: newTask.assignedTo,
        dueDate: new Date(newTask.dueDate).toISOString(),
        priority: newTask.priority,
        status: newTask.status,
        };
        
        // Add completion date if the task is marked as completed
        if (newTask.status === 'completed') {
        taskData.completedDate = new Date().toISOString();
        } else {
        // If task was previously completed but now is not, remove completion date
        taskData.completedDate = null;
        }
        
        if (editingId) {
        await updateDoc(doc(db, 'tasks', editingId), taskData);
        setEditingId(null);
        showNotification('Task updated successfully');
        } else {
        await addDoc(collection(db, 'tasks'), taskData);
        showNotification('Task added successfully');
        }
        setNewTask({ projectId: '', title: '', description: '', assignedTo: '', dueDate: '', priority: 'medium', status: 'to-do' });
        setIsTaskModalOpen(false);
    } catch (error) {
        console.error('Error saving task:', error);
        showNotification('Failed to save task', 'error');
    } finally {
        setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updateData = {
        projectId: newUpdate.projectId,
        taskId: newUpdate.taskId || null,
        timestamp: new Date().toISOString(),
        message: newUpdate.message,
        author: newUpdate.author,
      };
      await addDoc(collection(db, 'updates'), updateData);
      showNotification('Update added successfully');
      setNewUpdate({ projectId: '', taskId: '', message: '', author: '' });
    } catch (error) {
      console.error('Error saving update:', error);
      showNotification('Failed to save update', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, collectionName) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, collectionName, id));
        showNotification('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        showNotification('Failed to delete item', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    try {
        setLoading(true);
        const statusMap = {
        'to-do': 'to-do',
        'in-progress': 'in-progress',
        'completed': 'completed',
        };
        const newStatus = statusMap[over.id];
        
        const updateData = { status: newStatus };
        
        // If moving to completed, add completion date
        if (newStatus === 'completed') {
        updateData.completedDate = new Date().toISOString();
        } 
        // If moving out of completed, remove completion date
        else {
        updateData.completedDate = null;
        }
        
        await updateDoc(doc(db, 'tasks', active.id), updateData);
        showNotification('Task status updated successfully');
    } catch (error) {
        console.error('Error updating task status:', error);
        showNotification('Failed to update task status', 'error');
    } finally {
        setLoading(false);
    }
  };

  const getBurndownChartData = () => {
    if (!selectedBurndownProjectId || !burndownData[selectedBurndownProjectId]) {
        return { labels: [], datasets: [] };
    }

    const projectBurndown = burndownData[selectedBurndownProjectId]
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
        labels: projectBurndown.map(record => {
        const date = new Date(record.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
        {
            label: 'Tasks Remaining',
            data: projectBurndown.map(record => record.tasksRemaining),
            backgroundColor: 'rgba(45, 212, 191, 0.8)',
            borderColor: 'rgb(45, 212, 191)',
            borderWidth: 1,
        }
        ],
    };
  };

  const openTaskModal = (task = null) => {
    if (task) {
      setEditingId(task.id);
      setNewTask({
        projectId: task.projectId,
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        dueDate: new Date(task.dueDate).toISOString().split('T')[0],
        priority: task.priority,
        status: task.status,
      });
    } else {
      setEditingId(null);
      setNewTask({ projectId: selectedKanbanProjectId === 'all' ? '' : selectedKanbanProjectId, title: '', description: '', assignedTo: '', dueDate: '', priority: 'medium', status: 'to-do' });
    }
    setIsTaskModalOpen(true);
  };

  const filteredTasks = selectedKanbanProjectId === 'all'
    ? tasks
    : tasks.filter(task => task.projectId === selectedKanbanProjectId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-700">Loading engineering data...</p>
        </div>
      </div>
    );
  }

  // Current date for the Gantt chart marker (03:47 PM PDT, June 11, 2025)
  const currentDate = new Date('2025-06-11T15:47:00-07:00');

  // Group tasks by due date
  const taskDueDates = {};
  const filteredTimelineTasks = selectedTimelineProjectId === 'all'
    ? tasks
    : tasks.filter(task => task.projectId === selectedTimelineProjectId);
  filteredTimelineTasks.forEach(task => {
    const dueDate = new Date(task.dueDate).toISOString().split('T')[0];
    if (!taskDueDates[dueDate]) {
      taskDueDates[dueDate] = [];
    }
    taskDueDates[dueDate].push(task);
  });

  return (
    <div>
      {notification && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-md z-50 ${
            notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="py-6">
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-2xl font-semibold text-gray-900"
          >
            Engineering Dashboard
          </motion.h1>
        </div>

        <div className="mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-1"
            >
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Project Summary</h2>
                  <ul className="space-y-4">
                    {projects.map(project => (
                      <li key={project.id} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.description}</p>
                        <p className="text-sm text-gray-500">Status: {project.status}</p>
                        <p className="text-sm text-gray-500">
                          Tasks: {tasks.filter(t => t.projectId === project.id).length} (
                          {tasks.filter(t => t.projectId === project.id && t.status === 'completed').length} completed)
                        </p>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setNewProject({ name: '', description: '', startDate: '', endDate: '', status: 'planning' });
                      setIsProjectModalOpen(true);
                    }}
                    className="mt-4 w-full px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                  >
                    New Project
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-3"
            >
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                        activeTab === 'tasks'
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Tasks ({tasks.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                        activeTab === 'projects'
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Projects ({projects.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('updates')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                        activeTab === 'updates'
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Updates ({updates.length})
                    </button>
                  </nav>
                </div>

                <div className="p-4">
                  {activeTab === 'tasks' && (
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Select Project</label>
                        <select
                          value={selectedKanbanProjectId}
                          onChange={e => setSelectedKanbanProjectId(e.target.value)}
                          className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        >
                          <option value="all">All Projects</option>
                          {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                          ))}
                        </select>
                      </div>
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <div className="flex space-x-4 overflow-x-auto pb-4">
                          {['to-do', 'in-progress', 'completed'].map(status => (
                            <KanbanColumn
                              key={status}
                              status={status}
                              tasks={filteredTasks.filter(task => task.status === status)}
                              openTaskModal={openTaskModal}
                              handleDelete={handleDelete}
                            />
                          ))}
                        </div>
                      </DndContext>
                    </div>
                  )}

                  {activeTab === 'projects' && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {projects.map(project => (
                            <tr key={project.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(project.startDate).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(project.endDate).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.status}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => {
                                    setEditingId(project.id);
                                    setNewProject({
                                      name: project.name,
                                      description: project.description,
                                      startDate: new Date(project.startDate).toISOString().split('T')[0],
                                      endDate: new Date(project.endDate).toISOString().split('T')[0],
                                      status: project.status,
                                    });
                                    setIsProjectModalOpen(true);
                                  }}
                                  className="text-teal-600 hover:text-teal-900 mr-4"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(project.id, 'projects')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                          {projects.length === 0 && (
                            <tr>
                              <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                No projects found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'updates' && (
                    <div>
                      <form onSubmit={handleUpdateSubmit} className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Project</label>
                            <select
                              value={newUpdate.projectId}
                              onChange={e => setNewUpdate({ ...newUpdate, projectId: e.target.value, taskId: '' })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                              required
                            >
                              <option value="">Select Project</option>
                              {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Task (Optional)</label>
                            <select
                              value={newUpdate.taskId}
                              onChange={e => setNewUpdate({ ...newUpdate, taskId: e.target.value })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            >
                              <option value="">Select Task</option>
                              {tasks
                                .filter(t => t.projectId === newUpdate.projectId)
                                .map(task => (
                                  <option key={task.id} value={task.id}>{task.title}</option>
                                ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea
                              value={newUpdate.message}
                              onChange={e => setNewUpdate({ ...newUpdate, message: e.target.value })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Author</label>
                            <input
                              type="text"
                              value={newUpdate.author}
                              onChange={e => setNewUpdate({ ...newUpdate, author: e.target.value })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                              required
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                        >
                          Add Update
                        </button>
                      </form>

                      <div className="space-y-4">
                        {updates.map(update => (
                          <div key={update.id} className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">{new Date(update.timestamp).toLocaleString()}</p>
                            <p className="text-md font-medium text-gray-900">{update.message}</p>
                            <p className="text-sm text-gray-500">By {update.author}</p>
                            <p className="text-sm text-gray-500">
                              Project: {projects.find(p => p.id === update.projectId)?.name || 'N/A'}
                              {update.taskId && ` | Task: ${tasks.find(t => t.id === update.taskId)?.title || 'N/A'}`}
                            </p>
                          </div>
                        ))}
                        {updates.length === 0 && (
                          <p className="text-center text-sm text-gray-500">No updates found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CountdownTimer targetDate={new Date('2025-07-15T23:59:59Z')} />
              <div className="mt-4 bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-md font-medium text-gray-900 mb-2">Task Due Dates Timeline</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Select Project</label>
                  <select
                    value={selectedTimelineProjectId}
                    onChange={e => setSelectedTimelineProjectId(e.target.value)}
                    className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="all">All Projects</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  {Object.keys(taskDueDates).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(taskDueDates).map(([date, tasksForDate]) => {
                        const dueDate = new Date(date);
                        const isCurrentDate = dueDate.toDateString() === currentDate.toDateString();
                        return (
                          <div key={date} className="mb-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              {isCurrentDate && (
                                <span className="ml-2 text-red-600 font-bold"> (Today)</span>
                              )}
                            </h4>
                            <div className="ml-4 space-y-1">
                              {tasksForDate.map(task => (
                                <div key={task.id} className="text-sm text-gray-600">
                                  {task.title}
                                </div>
                              ))}
                            </div>
                            {isCurrentDate && (
                              <div
                                className="absolute w-0.5 bg-red-600 h-full"
                                style={{ left: '50%', transform: 'translateX(-50%)' }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No tasks found</p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-md font-medium text-gray-900 mb-2">Task Burndown</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select Project</label>
                <select
                  value={selectedBurndownProjectId}
                  onChange={e => setSelectedBurndownProjectId(e.target.value)}
                  className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                >
                  <option value="all">All Projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <Bar
                data={getBurndownChartData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Daily Tasks Remaining' },
                  },
                  scales: {
                    y: { 
                      title: { display: true, text: 'Tasks' },
                      beginAtZero: true,
                    },
                    x: {
                      title: { display: true, text: 'Date' }
                    }
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={modalVariants}
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
            role="dialog"
            aria-modal="true"
            aria-label="Project Modal"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">{editingId ? 'Edit Project' : 'New Project'}</h3>
            <form onSubmit={handleProjectSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                    className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                    className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={e => setNewProject({ ...newProject, startDate: e.target.value })}
                    className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={e => setNewProject({ ...newProject, endDate: e.target.value })}
                    className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={newProject.status}
                    onChange={e => setNewProject({ ...newProject, status: e.target.value })}
                    className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={modalVariants}
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
            role="dialog"
            aria-modal="true"
            aria-label="Task Modal"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">{editingId ? 'Edit Task' : 'New Task'}</h3>
            <form onSubmit={handleTaskSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project</label>
                  <select
                    value={newTask.projectId}
                    onChange={e => setNewTask({ ...newTask, projectId: e.target.value })}
                    className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                    aria-required="true"
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                    className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <input
                    type="text"
                    value={newTask.assignedTo}
                    onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                    className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={newTask.status}
                    onChange={e => setNewTask({ ...newTask, status: e.target.value })}
                    className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option value="to-do">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}