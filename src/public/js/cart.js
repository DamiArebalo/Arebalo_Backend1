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
          method = 'DELETE';
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
emptyCartButton.addEventListener('click', () => {
   
    handleCartAction('empty', emptyCartMessage);
});

//completar compra
completePurchaseButton.addEventListener('click', () => {
    handleCartAction('purchase', purchaseCompleteMessage);
});
