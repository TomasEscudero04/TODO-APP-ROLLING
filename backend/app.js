import express, {urlencoded} from "express"; //importar express
import dotenv from "dotenv"; //importar dotenv
import fs from 'node:fs'; //importar fs
import cors from 'cors'; 
import morgan from 'morgan'; //importar morgan para el manejo de logs
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from 'url'; //importar fileURLToPath para obtener la ruta del archivo actual


dotenv.config(); //ejecutar dotenv para cargar las variables de entorno

const app = express(); //crear una instancia de express

const __filename = fileURLToPath(import.meta.url); //obtener la ruta del archivo actual
const __dirname = path.dirname(__filename); //obtener el directorio del archivo actual

//middlewares
const corsOptions = {
    origin: process.env.FRONTEND_URL || `http://localhost:5173`,
    credentials: true, // Permitir el uso de credenciales (cookies, autenticación, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'], // Encabezados permitidos
    exposedHeaders: ['Set-Cookie'], // Encabezados expuestos al cliente
}

app.use(cors(corsOptions)); //configurar cors para permitir solicitudes desde el frontend
app.use(express.json()); //convertir el cuerpo de la solicitud a json
app.use(urlencoded({
    extended: true // Permitir el uso de objetos anidados en el cuerpo de la solicitud
}))
app.use(cookieParser()); //configurar cookie-parser para manejar cookies
app.use(morgan('dev')); //configurar morgan para el manejo de logs en desarrollo


//Configuracion de archivos estaticos
app.use(express.static(path.join(__dirname, 'public'))); //configurar express para servir archivos estaticos desde el directorio 'public'


//MANEJO DE RUTAS
//Leemos todos los archivos del directorio './src/routes de forma sincrona
//fs.readdirSync devuelve un array con los nombres de los archivos
const routeFiles = fs.readdirSync('./src/routes');

//Iteramos sobre cada archivo en el directorio de rutas

routeFiles.forEach((file) => {
    //Usamos importaciones dinamicas (import()) para cargar cada modulo de ruta
    //Esto es util porque:
    //1. Nos permite cargar modulos de forma asincrona
    //2. Cada ruta se registra independientemente
    //3. Si una ruta falla, no afecta a las demas

    import(`./src/routes/${file}`).then((route) => {
        //Registramos la ruta en nuestra aplicacion express
        //Todas las rutas importadas seras prefijadas con '/api/v1'
        //Esto nos da:
        //-Versionado de la API
        //-Un punto de entrada comun para todas las rutas
        //-Mejor organizacion del codigo
        app.use('/api/v1', route.default);
    }).catch((err) => {
        console.log(`Error al cargar la ruta ${file}: ${err}`);   
    })     
})

export default app; //exportar la instancia de express para usarla en otros archivos