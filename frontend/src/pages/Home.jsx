import {useState} from 'react';
import TaskForm from '../components/TaskForm';
import {useAuth} from '../context/AuthContext';
import {useTask} from '../context/TaskContext';
import {toast} from "react-hot-toast";
import EditTaskModal from '../components/EditTaskModal';


function Home() {


  const {tasks, loadingTasks, deleteTask} = useTask();
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleDelete = (id) => {
    toast((t) => (
      <div className="space-y-2">
        <p>¿Eliminar esta tarea?🚮</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteTask(id);
                toast.success("Task deleted successfully");
              } catch {
                toast.error("Error to delete task");
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Sí
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {duration: 6000})
  }

  const handleEdit = (task) => {
    setTaskToEdit(task)
  };


  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <TaskForm />

      <h2 className="text-2xl font-bold">Mis Tareas</h2>
      {loadingTasks ? (
        <p>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p>No tenés tareas todavía.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="border rounded p-4 shadow-sm bg-gray-50"
            >
              <div className="flex justify-end gap-2 mb-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>

              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p>{task.description}</p>
            <p className="text-sm text-gray-600">
              Vence: {new Date(task.dueDate).toLocaleDateString("es-AR", { timeZone: "UTC" })}
            </p>

              {task.files?.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Archivos:</p>
                  <ul className="list-disc ml-6 space-y-1">
                    {task.files.map((file, i) => (
                      <li key={i}>
                        <a
                          href={`http://localhost:3003${file.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {taskToEdit && (
        <EditTaskModal
          task={taskToEdit}
          onClose={() => setTaskToEdit(null)}
        />
      )}
    </div>
  )
}

export default Home
