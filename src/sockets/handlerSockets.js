
import { addToCart, addOneProduct } from '../public/js/utils.js'; // Importar las funciones utilitarias

// Función para manejar conexiones de WebSocket
export const handleSocketConnection = (socket) => {
    console.log(`cliente activo id: ${socket.id}`); // Mensaje en consola con el ID del cliente

    // Manejar evento para agregar un nuevo producto
    socket.on('addProduct', async (productData) => {
        const newProduct = await addOneProduct(productData); // Intentar agregar el producto

        if (newProduct) {
            // Emitir evento a todos los clientes indicando que se ha agregado un producto
            socket.emit('productAdded', newProduct);
        } else {
            // Emitir error si no se pudo agregar el producto
            socket.emit('error', {
                message: 'Error al agregar el producto'
            });
        }
    });

    // Manejar evento para agregar productos al carrito
    socket.on('addToCart', async (data) => {
        const newCart = await addToCart(data); // Intentar agregar al carrito
        if (newCart) {
            // Emitir evento de actualización del carrito
            socket.emit('cartUpdate', {
                message: 'Carrito actualizado',
                data: newCart 
            });
        } else {
            // Emitir error si no se pudo actualizar el carrito
            socket.emit('errorCart', {
                message: 'Error al actualizar el carrito'
            });
        }
    });

    
};
