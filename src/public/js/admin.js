const socket = io();


const $$searchInput = document.querySelector("#searchInput");
const $$productsDivDelete = document.querySelector("#products-delete");
const $$searchProducts = document.querySelector("#search-delete");
const $$deleteProducts = document.querySelectorAll(".deleteButton");

// Obtener referencia a los botones y las secciones
const actionButtons = document.querySelectorAll('.action-btn');
const actionContents = document.querySelectorAll('.actionContent');

// Agregar event listener a cada botón
actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Ocultar todas las secciones
        actionContents.forEach(content => content.classList.remove('active'));
        
        // Obtener el id del contenido objetivo del botón
        const targetId = button.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        
        // Mostrar la sección correspondiente
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});



async function getProducts(){
    const response = await fetch("/api/products/get/all");
    const data = await response.json();
    return data;
}


async function cardDelete(product) {
    // Crear un div
    let deleteCard = document.createElement('div');
    // Asignar la clase
    deleteCard.classList.add('card-option');
    
    console.log("product: ", product);

    // Agregar contenido dinámico con variables de product
    deleteCard.innerHTML = `
        <h4 class="name-prod">${product.title}</h4>
        <button class="deleteButton" data-id="${product._id}">Delete</button>
    `;

    // Devolver la tarjeta
    return deleteCard;
}



async function filterProductsByText(text) {
    // Obtener productos
    const products = await getProducts();
    const arrayProducts = products.response.response;

    console.log("arrayProducts: ", arrayProducts);

    // Crear array de productos filtrados
    const productFiltered = arrayProducts.filter(product =>
        product.title.toLowerCase().includes(text)
    );

    console.log("productFiltered: ", productFiltered);

    // Limpiar el div de productos
    $$productsDivDelete.innerHTML = ""; // Asegúrate de limpiar antes de actualizar

    // Generar y agregar las tarjetas filtradas
    for (const product of productFiltered) {
        const deleteCard = await cardDelete(product); // Espera la resolución de cada tarjeta
        $$productsDivDelete.appendChild(deleteCard); // Añade la tarjeta al div
    }

    // Actualizar array de tarjetas
    const cards = document.querySelectorAll('.card-option');
    console.log("cards: ", cards);
}

// Listener para el input de búsqueda
$$searchInput.addEventListener("keyup", async (event) => {
    // Obtener el texto del input
    const searchText = event.target.value.toLowerCase();
    console.log("searchText: ", searchText);

    // Filtrar productos por texto de búsqueda
    await filterProductsByText(searchText);

    // Obtener botones de eliminar actualizados
    const buttonDelete = document.querySelectorAll(".deleteButton");
    console.log("buttonDelete: ", buttonDelete);

    // Agregar listener a cada botón de eliminar
    buttonDelete.forEach((button) => {
        button.addEventListener("click", (event) => {
            const productId = event.target.dataset.id;

            alertDelete(productId);
            

            

        });
    });
});


function alertDelete(product){
    Swal.fire({
        title: '¿Estás seguro de que desea eliminar el producto?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar producto',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,

    }).then(result => {
        //si el usuario confirma la acción, ejecutar la función thenLogout
        if (result.isConfirmed) {
            deleteProduct(product)
        }
    });
}

async function deleteProduct(productId){

    const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId})
    };

    const response = await fetch(`/api/products/${productId}`, options);

    if (response.ok) {
        Swal.fire({
            title: '¡Producto eliminado!',
            text: 'El producto ha sido eliminado correctamente.',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,  
        }).then(() => {
            window.location.href = '/views/home/admin';
        });
    } else {
        Swal.fire({
            title: '¡Error!',
            text: 'No se pudo eliminar el producto.',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        });
    }
}






