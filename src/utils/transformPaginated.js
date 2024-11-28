// Función para transformar el resultado de la paginación
function transformPaginationResult(products, route) {
    return {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `/${route}/?page=${products.prevPage}` : null,
        nextLink: products.hasNextPage ? `/${route}/?page=${products.nextPage}` : null,
    };
}


export default transformPaginationResult ;