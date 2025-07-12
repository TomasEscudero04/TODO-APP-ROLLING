import multer from 'multer';
import path from 'path';


//la siguiente funcion trabaja con donde y como vamos a guardar el archivo
const storageProfileImage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/uploads/profile')
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_icon_${path.extname(file.originalname)}`) //tengo que armar un nombre unico para cada archivo
    }
})

//Funcion que va a manejar el archivo

const uploadIconProfileImage = multer({
    storage: storageProfileImage,
    limits: {
        fileSize: 3 * 1024 * 1024 // Limite de tamaño de archivo a 3MB
    },
    fileFilter: (req, file, callback) => {
        if (file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            req.fileValidationError = "Only image files are allowed!";
            return callback(null, false, req.fileValidationError)
        }
        callback(null, true);
    }
})

export default uploadIconProfileImage;