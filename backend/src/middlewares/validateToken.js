import jwt from "jsonwebtoken";

// export const authRequired = (req, res, next) => {
//     const {token} = req.cookies;
//     // Verificar si el token existe
//     // Si no existe, devolver un error 401
//     if (!token) {
//         return res.status(401).json({message: "No token provided"});
//     };
//     // Verificar el token
//     jwt.verify(token, process.env.SECRET_KEY, (err, userDecoded) => {
//         if (err) {
//             return res.status(403).json({message: "Invalid token"});
//         }
//         req.user = userDecoded;
//         return next();
//     });
// }

export const authRequired = (req, res, next) => {        
        //leer token headers o de las cookies
        let token = null;
        //1. desde la cabecera de autenticación capturamos el token
        const authHeader = req.headers.authorization;
        if(authHeader && authHeader.startsWith("Bearer ")){
            token = authHeader.split(" ")[1];
        }
        //2. Si no está la cabecera buscamos el token en la cookie
        if(!token && req.cookies?.token){
            token = req.cookies.token
        }
        //3. Si no hay token en ninún lado rechazamos
        if(!token) return res.status(401).json({message: "No token provided"})
        //4. verificar el token
        jwt.verify(token, process.env.SECRET_KEY, (err, userDecoded) => {
            if(err) return res.status(403).json({message: "Invalid Token"})
            req.user = userDecoded;
            next()    
        })    
      
}