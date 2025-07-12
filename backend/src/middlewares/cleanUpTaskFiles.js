import fs from "fs/promises";
import path from "path";
import Task from "../models/task.model.js";

export const cleanUpTaskFiles = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task && task.files.length > 0) {
            await Promise.all(
                task.files.map(async (file) => {
                    const filePath = path.join(process.cwd(), 'public', file.path);
                    try {
                        await fs.unlink(filePath);
                    } catch (error) {
                        console.log(`Error deleting file ${file.name}:`, error);
                    }

                })
            )
        };
        next();
    } catch (error) {
        console.log(error);
        next();
    }
}
