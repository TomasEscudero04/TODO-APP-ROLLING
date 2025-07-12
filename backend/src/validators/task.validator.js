import {z} from 'zod';
import { date } from 'zod/v4';

export const createTaskSchema = z.object({
    title: z.string({
        required_error: 'Title is required'
    }),
    description: z.string({
        required_error: 'Description is required'
    }).optional(),
    date: z.string().datetime().optional(),
})