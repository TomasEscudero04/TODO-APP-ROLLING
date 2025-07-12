import app from "./app.js";
import connectDB from "./db.js";

const PORT = process.env.PORT || 3000; //definir el puerto del servidor, si no se define en las variables de entorno, usar el puerto 3000

connectDB(); //conectar a la base de datos MongoDB

//Iniciar el servidor
const server = async() => {
    try {
        app.listen(PORT, () => {
            console.log(`El servidor esta corriendo en el puerto: http://localhost:${PORT}`); //iniciar el servidor en el puerto 3000
        })
    } catch (error) {
        console.log("Error al iniciar el servidor: ", error);
        process.exit(1); //salir del proceso con un codigo de error 1
    }
}

server(); //ejecutar la funcion server para iniciar el servidor