# Documentación API REST

## Descripción General
Este documento describe las funcionalidades implementadas mediante API REST en la entrega. La aplicación utiliza métodos HTTP estándar para manejar autenticación de usuarios y un sistema de chat en tiempo real. Estas funcionalidades son fundamentales para garantizar la seguridad, el manejo de sesiones y la comunicación entre los usuarios.

---

## **1. Autenticación y Gestión de Usuarios**

El módulo de autenticación permite registrar, autenticar, gestionar y actualizar usuarios. La información de los usuarios se almacena de forma persistente, asegurando la seguridad mediante el cifrado de contraseñas.

### **Ruta Base:** `/api/auth`

| **Funcionalidad**            | **Método HTTP** | **Endpoint**          | **Descripción**                                                                                 |
|------------------------------|------------------|-----------------------|---------------------------------------------------------------------------------------------------|
| Registrar un usuario         | POST             | `/api/auth/register`  | Permite registrar un nuevo usuario. La contraseña se cifra utilizando SHA-256 antes de almacenarse en un archivo persistente.       |
| Iniciar sesión              | POST             | `/api/auth/login`     | Permite al usuario iniciar sesión validando sus credenciales (nombre de usuario y contraseña).   |
| Cerrar sesión               | POST             | `/api/auth/logout`    | Cierra la sesión actual del usuario y elimina los datos de sesión para garantizar la seguridad. |
| Eliminar cuenta              | DELETE           | `/api/auth/delete`    | Elimina la cuenta del usuario actualmente autenticado y actualiza el almacenamiento persistente.  |
| Verificar sesión activa     | GET              | `/api/auth/check`     | Verifica si el usuario está autenticado y devuelve su información si está logueado.              |
| **Actualizar usuario**       | PUT              | `/api/auth/update`    | Permite actualizar la contraseña del usuario actual. Se valida que el nuevo usuario no exista previamente. |

Los datos de usuario se guardan en un archivo local `users.sav` utilizando serialización. Esto permite mantener la persistencia de los usuarios registrados incluso después de reiniciar el servidor.

---

## **2. Chat en Tiempo Real**

El sistema de chat permite a los usuarios autenticados enviar y recibir mensajes en tiempo real. Solo se conservan los últimos 50 mensajes para optimizar el rendimiento.

### **Ruta Base:** `/api/chat`

| **Funcionalidad**            | **Método HTTP** | **Endpoint**          | **Descripción**                                                                                 |
|------------------------------|------------------|-----------------------|---------------------------------------------------------------------------------------------------|
| Obtener mensajes nuevos      | GET              | `/api/chat`           | Retorna los mensajes del chat enviados después de un `ID` especificado. Por defecto, recupera mensajes recientes hasta un límite. |
| Enviar un mensaje al chat    | POST             | `/api/chat`           | Permite a un usuario autenticado enviar un nuevo mensaje al chat. Solo se guardan los 50 mensajes más recientes. |

Los mensajes se almacenan temporalmente en memoria y no persisten entre reinicios del servidor.

---

## **3. Prueba de Conexión**

La funcionalidad de prueba de conexión se utiliza para verificar que el servidor API esté operativo y accesible.

### **Ruta Base:** `/api/test`

| **Funcionalidad**            | **Método HTTP** | **Endpoint**          | **Descripción**                                                                                 |
|------------------------------|------------------|-----------------------|---------------------------------------------------------------------------------------------------|
| Probar conexión             | GET              | `/api/test`           | Retorna el mensaje "hola caracola" para verificar que la API está funcionando correctamente.     |

Esta funcionalidad es útil durante las pruebas iniciales de la aplicación o para validar que el servidor está disponible.

---

## **Resumen de Métodos HTTP Utilizados**
- **GET**: Obtener información o recursos.
  - Ejemplo: `GET /api/chat?after=0` retorna mensajes nuevos desde el ID 0.
- **POST**: Crear nuevos recursos o ejecutar acciones.
  - Ejemplo: `POST /api/auth/login` inicia sesión con credenciales.
- **PUT**: Actualizar recursos existentes.
  - Ejemplo: `PUT /api/auth/update` permite actualizar la contraseña del usuario actual.
- **DELETE**: Eliminar recursos existentes.
  - Ejemplo: `DELETE /api/auth/delete` elimina la cuenta del usuario autenticado.

---

## **Nota:**
Todas las funcionalidades implementadas requieren que el usuario esté autenticado mediante sesión para garantizar la seguridad de la información. El manejo de contraseñas incluye cifrado mediante el algoritmo SHA-256, y los mensajes del chat tienen restricciones de almacenamiento para optimizar el rendimiento.

