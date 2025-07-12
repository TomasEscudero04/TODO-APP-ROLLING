// //ZOD VALIDATION SCHEMA IMPLEMENTATION
//  * 
//  * Zod es una librería de validación de esquemas para TypeScript que permite definir
//  * y validar estructuras de datos con un enfoque declarativo y type-safe.
//  * 
//  * Características clave:
//  * 1. Type-safe: Los esquemas generan tipos TypeScript automáticamente
//  * 2. Declarativo: Sintaxis sencilla y legible
//  * 3. Validación completa: Soporta strings, números, objetos, arrays, etc.
//  * 4. Mensajes personalizables: Permite definir mensajes de error específicos
//  * 5. Composible: Los esquemas pueden combinarse y extenderse fácilmente
//  * 
//  * En este archivo vamos implementar dos esquemas:
//  * - registerSchema: Para validar datos de registro de usuario
//  * - loginSchema: Para validar credenciales de inicio de sesión
//  * 
//  * Cada campo tiene validaciones específicas con mensajes de error personalizados
//  * que se mostrarán si la validación falla.
//  */

import { z } from "zod";

export const registerSchema = z.object({
  username: z.string({ required_error: "Username is required" })
  .min(5, { message: "Username must be at least 5 characters long" })
  .max(50, { message: "Username must not exceed 50 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .email(
      {
        pattern:
          /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
      },
      { message: "Invalid email format" }
    ),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must not exceed 20 characters" })
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
    //   message:
    //     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    // }),
    
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email(
      {
        pattern:
          /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
      },
      { message: "Invalid email format" }
    ),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must not exceed 20 characters" }),
})