import { createContext, useState } from 'react';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const createTask = (title) => {
    const newTask = { id: Date.now(), title };
    setTasks([...tasks, newTask]);
  };

  const getTasks = () => {
    return tasks;
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (id, updatedTitle) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, title: updatedTitle } : task
    ));
  }

  return (
    <TasksContext.Provider value={{
        tasks, 
        createTask, 
        getTasks,
        deleteTask,
        updateTask 
        }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTask = () => useContext(TasksContext);