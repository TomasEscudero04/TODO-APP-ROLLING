import multer from 'multer';
import path from 'path';

const storageTaskFiles = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads/tasks');
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_tasks_${path.extname(file.originalname)}`);
    }
});

const configUploadTaskFiles = multer({
    storage: storageTaskFiles,
    limits: { 
        files: 5,
        fileSize: 2 * 1024 * 1024 // 2MB 
    },
    fileFilter: (req, file, cb) => {
        // 1- validar el titulo de la tarea antes de aceptar el archivo
        if (!req.body.title || req.body.title.trim() === '') {
            req.fileValidationError = "Title is required";
            return cb(null, false);
        }

        // 2- validar el tipo de archivo
        const filetypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|zip|xlsx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
           return cb(null, true);
            
        } else {
            req.fileValidationError = "Only files of type png, jpg, jpeg, gif, webp, pdf, doc, docx, and zip are allowed";
            return cb(null, false);
        }
    }
})

const uploadsTasksFiles = (req, res, next) => {
    const upload = configUploadTaskFiles.array('files');

    upload(req, res, function(error){
        if (error) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                req.fileValidationError = "File size exceeds 2MB limit";
            } else if (error.code === 'LIMIT_FILE_COUNT') {
                req.fileValidationError = "Too many files uploaded, maximum is 5";
            } else if(error.code === 'LIMIT_UNEXPECTED_FILE') {
                req.fileValidationError = "Unexpected file upload";
            } else {
                console.log(error);
                req.fileValidationError = `Error uploading file - ${error}`;
            }
        }
        next();
    })
};


export default uploadsTasksFiles;