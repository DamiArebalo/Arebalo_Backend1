const socket = io();


const $$searchInputDelete = document.querySelector("#searchInputDelete");
const $$searchInputUpdate = document.querySelector("#searchProductUpdate");
const $$productsDivDelete = document.querySelector("#products-delete");
const $$productsDivUpdate = document.querySelector("#products-update");
const $$searchProducts = document.querySelector("#search-delete");
const $$deleteProducts = document.querySelectorAll(".deleteButton");
const $$productForm = document.querySelector("#productForm");
const $$addProduct = document.querySelector("#addProduct");

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



async function getProducts() {
    const response = await fetch("/api/products/get/all");
    const data = await response.json();
    return data;
}

async function getCategory(name){
    const nameCategory = name.toLowerCase();
    const response = await fetch(`/api/products/category/name/${nameCategory}`);
    const data = await response.json();
    console.log("data category: ", data);
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

async function cardUpdate(product) {
    // Crear un div
    let updateCard = document.createElement('div');
    // Asignar la clase
    updateCard.classList.add('card-option');

    console.log("product: ", product);

    // Agregar contenido dinámico con variables de product
    updateCard.innerHTML = `
        <h4 class="name-prod">${product.title}</h4>
        <button class="updateButton" data-id="${product._id}">Update</button>
    `;

    // Devolver la tarjeta
    return updateCard;
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

    return productFiltered;
    //console.log("productFiltered: ", productFiltered);
}

async function createCardDelete(products) {
    // Limpiar el div de productos
    $$productsDivDelete.innerHTML = ""; // Asegúrate de limpiar antes de actualizar

    // Generar y agregar las tarjetas filtradas
    for (const product of products) {
        const deleteCard = await cardDelete(product); // Espera la resolución de cada tarjeta
        $$productsDivDelete.appendChild(deleteCard); // Añade la tarjeta al div
    }

    // Actualizar array de tarjetas
    const cards = document.querySelectorAll('.card-option');
    console.log("cards: ", cards);
}

async function createCardUpdate(products) {
    // Limpiar el div de productos
    $$productsDivUpdate.innerHTML = ""; // Asegúrate de limpiar antes de actualizar

    // Generar y agregar las tarjetas filtradas
    for (const product of products) {
        const updateCard = await cardUpdate(product); // Espera la resolución de cada tarjeta
        $$productsDivUpdate.appendChild(updateCard); // Añade la tarjeta al div
    }

    // Actualizar array de tarjetas
    const cards = document.querySelectorAll('.card-option');
    console.log("cards: ", cards);
}

// Listener para el input de búsqueda
$$searchInputDelete.addEventListener("keyup", async (event) => {
    // Obtener el texto del input
    const searchText = event.target.value.toLowerCase();
    console.log("searchText: ", searchText);

    // Filtrar productos por texto de búsqueda
    const productFiltered = await filterProductsByText(searchText);

    await createCardDelete(productFiltered);

    // Obtener botones de eliminar actualizados
    const buttonDelete = document.querySelectorAll(".deleteButton");
    //console.log("buttonDelete: ", buttonDelete);

    // Agregar listener a cada botón de eliminar
    buttonDelete.forEach((button) => {
        button.addEventListener("click", (event) => {
            const productId = event.target.dataset.id;

            alertDelete(productId);

        });
    });
});


function alertDelete(product) {
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

async function deleteProduct(productId) {

    const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId })
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

async function alertUpdate(productID) {

    const formUpdate = document.querySelector('#productFormUpdate');


    const dataFormuUpdate = new FormData(formUpdate);
    const dataFormu = Object.fromEntries(dataFormuUpdate);
    
    //convierto nombre de la categoría a id
    const  category = await getCategory(dataFormu.category);
    dataFormu.category = category.response.response.toLowerCase();


    console.log("dataFormuUpdate: ", dataFormu.category);
    const jsonData = JSON.stringify(dataFormu);
    

    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: jsonData
    };

    console.log("options: ", options);

    // Eliminar cualquier popup existente
    const existingPopUp = document.querySelector('.popUpDiv');
    const existingOverlay = document.querySelector('.popup-overlay');
    if (existingPopUp) existingPopUp.remove();
    if (existingOverlay) existingOverlay.remove();

    Swal.fire({
        title: '¿Estás seguro de que desea actualizar el producto?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar producto',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,

    }).then(result => {
        //si el usuario confirma la acción, ejecutar la función thenLogout
        if (result.isConfirmed) {
            updateProduct(productID, options)
        }
    });
}

async function updateProduct(productId, options) {

    const response = await fetch(`/api/products/${productId}`, options);
    if (response.ok) {
        Swal.fire({
            title: '¡Producto actualizado!',
            text: 'El producto ha sido actualizado correctamente.',
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
            text: 'No se pudo actualizar el producto.',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        });
    }
}

async function popUpUdateProduct(productID) {
    const response = await fetch(`/api/products/${productID}`);
    const data = await response.json();
    const product = data.response.response;
    const categoryResponse = await fetch(`/api/products/category/${productID}`);
    const categoryData = await categoryResponse.json();
    const categoryName = categoryData.response.response.name;

    // Eliminar cualquier popup existente
    const existingPopUp = document.querySelector('.popUpDiv');
    const existingOverlay = document.querySelector('.popup-overlay');
    if (existingPopUp) existingPopUp.remove();
    if (existingOverlay) existingOverlay.remove();

    // Crear el fondo oscuro
    let overlayDiv = document.createElement('div');
    overlayDiv.classList.add('popup-overlay');
    document.body.appendChild(overlayDiv);

    // Crear el nuevo formulario
    let popUpDiv = document.createElement('div');
    popUpDiv.classList.add('popUpDiv');

    popUpDiv.innerHTML = `
        <span class="close-button">X</span>
        <h2>Actualizar Producto</h2>
        <form id="productFormUpdate" class="form-grid">
            <div class="form-group">
                <label for="title">Título</label>
                <input type="text" id="title" name="title" value="${product.title}" required />
            </div>
            <div class="form-group">
                <label for="priceList">Precio</label>
                <input type="number" id="priceList" name="priceList" value="${product.priceList}" required />
            </div>
            <div class="form-group">
                <label for="stock">Stock</label>
                <input type="number" id="stock" name="stock" value="${product.stock}" required />
            </div>
            <div class="form-group">
                <label for="description">Descripción</label>
                <input type="text" id="description" name="description" value="${product.description}" required />
            </div>
            <div class="form-group">
                <label for="category">Categoría</label>
                <select id="category" name="category" required>
                    <option value="">Seleccione una categoría</option>
                    <option value="Botiquin" ${categoryName == "Botiquin" ? "selected" : ""}>Botiquin</option>
                    <option value="Aromaterapia" ${categoryName == "aromaterapia" ? "selected" : ""}>Aromaterapia</option>
                    <option value="Fisico" ${categoryName == "fisico" ? "selected" : ""}>Fisico</option>
                </select>
            </div>
            <button id="updateProduct" type="submit">Actualizar Producto</button>
        </form>
    `;

    document.body.appendChild(popUpDiv);

    // Añadir funcionalidad al botón de cierre
    document.querySelector('.close-button').addEventListener('click', () => {
        popUpDiv.remove();
        overlayDiv.remove(); // Eliminar el fondo oscuro también
    });

    document.querySelector('#updateProduct').addEventListener('click', async (event) => {
        event.preventDefault();
        alertUpdate(productID);
    });
}



$$searchInputUpdate.addEventListener("keyup", async (event) => {
    // Obtener el texto del input
    const searchText = event.target.value.toLowerCase();
    console.log("searchText: ", searchText);
    // Filtrar productos por texto de búsqueda
    const productFiltered = await filterProductsByText(searchText);
    console.log("productFiltered: ", productFiltered);

    await createCardUpdate(productFiltered);




    const buttonUpdate = document.querySelectorAll(".updateButton");
    //console.log("buttonUpdate: ", buttonUpdate);
    buttonUpdate.forEach((button) => {
        button.addEventListener("click", (event) => {
            const productId = event.target.dataset.id;
            console.log("productId: ", productId);
            popUpUdateProduct(productId);

        });
    });

   
});

$$addProduct.addEventListener("click", async (event) => {
   event.preventDefault();

   const formAdd = $$productForm;
   const dataFormu = Object.fromEntries(new FormData(formAdd));
   console.log("dataFormu: ", dataFormu);

   const category = await getCategory(dataFormu.category);
   dataFormu.category = category.response.response.toLowerCase();

   const jsonData = JSON.stringify(dataFormu);  

   alertAdd(jsonData);
});

async function alertAdd(data) {
    Swal.fire({
        title: '¿Estás seguro de que desea agregar el producto?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, agregar producto',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
    }).then(result => {
        //si el usuario confirma la acción, ejecutar la función thenLogout
        if (result.isConfirmed) {
            addProduct(data)
        }
    });
}

async function addProduct(data) {   
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    };
    console.log("options: ", options);
    const response = await fetch(`/api/products`, options);
    if (response.ok) {
        Swal.fire({
            title: '¡Producto agregado!',
            text: 'El producto ha sido agregado correctamente.',
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
            text: 'No se pudo agregar el producto.',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
        });
    }
}














