/**
 * Incluye las funciónes CRUD que interactúan con la API centralizando todas las solicitudes
 * incluyendo la autenticación con token JTW
 */

const API_URL = "http://localhost:3000"; // URL del servidor donde está alojada la API

/**
 * Función que maneja las respuestas de error de la API.
 * @param {} response 
 * @returns Dependiendo del error muestra un mensaje diferente. Si no hay errores devuelve la respuesta en formato json.
 */
const handleResponse = async (response) => {
    if (!response.ok) {
      let errorMessage = await response.text();
      switch (response.status) {
        case 401:
          errorMessage = "No autorizado. Debes iniciar sesión.";
          break;
        case 403:
          errorMessage = "No tienes permisos para realizar esta acción.";
          break;
        case 404:
          errorMessage = "Recurso no encontrado.";
          break;
        case 500:
          errorMessage = "Error interno del servidor.";
          break;
        default:
          errorMessage = `Error ${response.status}: ${errorMessage}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  };
  
  /**
 * Función que recupera el token almacenado en el localStorage y lo añade a la cabecera
 * @returns la cabecera Authorization con el token almacenado si existe o vacío.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


/**
 * Obtiene los libros de un usuario específico mediante una petición GET
 * @param {String | number} userId ID del usuario autenticado
 * @returns Si la respuesta es válida devuelve los datos en formato JSON.
 */
export const getBooks = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/books?userId=${userId}`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error al obtener libros:", error);
      throw error;
    }
  };

/**
 * Función para añadir un libro a la base de datos mediante una petición POST
 * @param {Object} newBook El libro que se desea añadir 
 * @returns Si la respuesta es válida devuelve el libro añadido.
 */
export const addBook = async (newBook) => {
    try {
      const response = await fetch(`${API_URL}/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(newBook),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error al añadir libro:", error);
      throw error;
    }
  };

/**
 * Función para editar los datos de un libro de la base de datos mediante una petición PUT
 * @param {String | number} id ID del libro para actualizar
 * @param {Object} updatedBook libro con los datos actualizados
 * @returns Si la resuesta es válida devuelve los datos actualizados
 */
export const updateBook = async (id, updatedBook) => {
    try {
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updatedBook),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error al actualizar libro:", error);
      throw error;
    }
  };

/**
 * Función para eliminar un libro de la base de datos mediante una petición DELETE
 * @param {String | number} id ID del libro a eliminar
 * @returns Si la eliminación fue exitosa true, sino false.
 */
export const deleteBook = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      await handleResponse(response);
      return true;
    } catch (error) {
      console.error("Error al eliminar libro:", error);
      throw error;
    }
  };


  