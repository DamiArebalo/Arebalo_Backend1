//recuperar elemento del botón de cerrar sesión
let logout = document.querySelector("#logout");

//evento de click en el botón de cerrar sesión
logout.onclick = async function(e) {
    e.preventDefault();
    //mostrar SweetAlert para confirmar acción
    const response = await Swal.fire({
        title: '¿Estás seguro de que deseas cerrar la sesión?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,

    }).then(result => {
        //si el usuario confirma la acción, ejecutar la función thenLogout
        if (result.isConfirmed) {
            thenLogout();
        }
    });
};


//función para cerrar la sesión
const thenLogout = async () => {
  //enviar petición al servidor para cerrar la sesión
  const response = await fetch("/views/home/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  //si la petición es exitosa, mostrar SweetAlert para confirmación
  if (response.ok) {
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Has cerrado la sesión exitosamente.',
      icon: 'success',
      confirmButtonText: 'Ok',
      timer: 3000
    }).then(() => {
          // Recargar la página después de que el SweetAlert se cierre
          window.location.reload();
      });
  } else {
    throw new Error('Error al cerrar sesión');
  }
};