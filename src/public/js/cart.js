console.log("cart.js");

const cartContent = document.getElementById('cart-content');
const emptyCartMessage = document.getElementById('empty-cart-message');
const purchaseCompleteMessage = document.getElementById('purchase-complete-message');
const emptyCartButton = document.getElementById('empty-cart');
const completePurchaseButton = document.getElementById('complete-purchase');
const cartId = cartContent.dataset.cartId; 

console.log("cartId: ", cartId);



//funcion para mostrar mensajes y ocultar contenido
function showMessage(messageElement) {
  cartContent.style.display = 'none';
  emptyCartMessage.style.display = 'none';
  purchaseCompleteMessage.style.display = 'none';
  messageElement.style.display = 'block';
}


//funcion para manejar acciones en el carrito
async function handleCartAction(action, messageElement) {
  try {
      let method = ''

      if (action === 'empty') {
          method = 'PUT';
      }else if(action === 'purchase'){
          method = 'PUT';
      }

      const options = {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartId: cartId })
      };

    const response = await fetch(`/views/carts/${cartId}/${action}`, options);

    if (response.ok) {
      showMessage(messageElement);
    } else {
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Eventos para manejar acciones en el carrito
//vaciar carrito
emptyCartButton.addEventListener('click', async () => {

  const response = await Swal.fire({
    title: '¿Estás seguro de que deseas vaciar el carrito?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, vaciar carrito',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,

  }).then(result => {
    //si el usuario confirma la acción, ejecutar la función thenLogout
    if (result.isConfirmed) {
      handleCartAction('empty', emptyCartMessage);
    }
  });
   
    
});

//completar compra
completePurchaseButton.addEventListener('click', async () => {

  const response = await Swal.fire({
      title: '¿Estás seguro de que deseas completar la compra?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, completar compra',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,

  }).then(result => {
      //si el usuario confirma la acción, ejecutar la función thenLogout
      if (result.isConfirmed) {
          handleCartAction('purchase', purchaseCompleteMessage);
      }
  });
    
});
