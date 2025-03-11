
import { createCart, updatedCart, getUserByToken} from '../public/js/utils.js'; // Importar las funciones utilitarias


import cookie from 'cookie';


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

        //recuperar token de la cookie  authToken
        const cookies = cookie.parse(socket.request.headers.cookie);
        const token = cookies.authToken;
         

        if (!token){
            console.log("token no existe");
            socket.emit('login',{message: "please login"});

        }else{
            console.log("token existe");

            const user = await getUserByToken(token);
            console.log("user: ", user);

            //si user.cart no existe crear un nuevo si no actualizar existente
            if(!user.cart){

                const newCart = await createCart(data, user);
                console.log("newCart: ", newCart);

                if (newCart == null) {
                    // Emitir error si no se pudo crear el carrito
                    socket.emit('errorCart', {
                        message: 'Error al crear el carrito'
                    });

                }else{
                    // Emitir evento de actualización del carrito
                    socket.emit('cartUpdate', {
                        message: 'Carrito creado',
                        data: newCart 
                    });

                }
                
            }else{

                let cartUpdate = await updatedCart(user, data);
                console.log("updatedCart: ", cartUpdate);

                socket.emit('cartUpdate', {
                    message: cartUpdate.message,
                    data: cartUpdate.data
                });
            }
            
            
            
            
        }

           

        // const newCart = await addToCart(data); // Intentar agregar al carrito
        // if (newCart) {
        //     // Emitir evento de actualización del carrito
        //     socket.emit('cartUpdate', {
        //         message: 'Carrito actualizado',
        //         data: newCart 
        //     });
        // } else {
        //     // Emitir error si no se pudo actualizar el carrito
        //     socket.emit('errorCart', {
        //         message: 'Error al actualizar el carrito'
        //     });
        // }
    });

    
};
