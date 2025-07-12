import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDb...");
        await mongoose.connect(process.env.MONGODB_URI, {});
        console.log("MongoDb connected successfully");
        
    } catch (error) {
        console.log("Error connecting to MongoDb: "+ error);
        process.exit(1); // Salir del proceso con un código de error 1
        
    }
}

export default connectDB; // Exportar la función connectDB para que pueda ser utilizada en otros archivos