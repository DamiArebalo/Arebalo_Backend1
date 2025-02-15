let logout = document.querySelector("#logout");
logout.onclick = async function(e) {
    e.preventDefault();
    // alerta de confirmación
    const response = await Swal.fire({
        title: '¿Estás seguro de que deseas cerrar la sesión?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
    }).then(result => {
        if (result.isConfirmed) {
            thenLogout();
        }
    });
};

      const thenLogout = async () => {
        const response = await fetch("/views/home/logout", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

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