import { createContext, useContext, useState, useEffect,} from 'react';
import * as taskService from '../services/taskService';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loadingTask, setLoadingTask] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.log("Errror fetching tasks:", error.nessage);
    } finally {
      setLoadingTask(false);
    }
  };

  const createTask = async (taskData) => {
    const newTask = await taskService.createTask(taskData);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const deleteTask = async (id) => {
    await taskService.deleteTask(id);
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTask = async (id, updatedData) => {
    const updatedTask = await taskService.updateTask(id, updatedData);
    setTasks(prev =>
      prev.map(task => (task.id === id ? updatedTask : task))
    );
    return updatedTask;
  };

  return (
    <TasksContext.Provider value={{
        fetchTasks,
        tasks,
        loadingTask,
        createTask,
        deleteTask,
        updateTask 
        }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTask = () => useContext(TasksContext);