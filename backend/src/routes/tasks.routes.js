import {Router} from 'express';
import {authRequired} from '../middlewares/validateToken.js';
import uploadsTasksFiles from '../helpers/multer.config.tasks.js';
import {validateSchema} from '../middlewares/validator.middleware.js';
import {createTaskSchema} from '../validators/task.validator.js';
import { createTask, getTasks, getTask, updateTask, deleteTask } from '../controllers/task.controller.js';
import { get } from 'mongoose';
import { cleanUpTaskFiles } from '../middlewares/cleanUpTaskFiles.js';

const router = Router();

//aca vienen todas las rutas del CRUD de tareas


// 1- Create task
router.post('/tasks',
    authRequired,
    uploadsTasksFiles, //primero multer
    validateSchema(createTaskSchema), //segundo el esquema de validación
    createTask
);

// 2- pedir todas las tareas
router.get('/tasks', authRequired, getTasks);

//pedir una tarea por id
router.get('/tasks/:id', authRequired, getTask);

// actualizar una tarea
router.put('/tasks/:id', authRequired, uploadsTasksFiles, updateTask);

// eliminar una tarea
router.delete('/tasks/:id', authRequired, cleanUpTaskFiles, deleteTask);






export default router;