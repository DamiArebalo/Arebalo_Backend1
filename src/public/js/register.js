//recuperar elementos del formulario
const $$registerForm = document.querySelector("#registerForm");
const $$registerBtn = document.querySelector("#register");
//conectar con el socket
const socket = io(); 
//puesto de control
// console.log("socket: ", socket);
// console.log($$registerForm);

//evento de click en el botón de registro
$$registerBtn.addEventListener("click", async (e) => {
     
    //guardar datos del formulario
    const formData = new FormData($$registerForm);
    const data = Object.fromEntries(formData); // Convierte FormData a objeto
    const jsonData = JSON.stringify(data); // Convierte el objeto a JSON
    //puesto de control
    // console.log(jsonData);

    //configurar opciones para el request
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonData
    };

    try {

        //manejar respuesta del servidor con sockets y  swal.fire
        socket.on('registered', (data) => {
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: data.message.message,
                timer: 3000
            }).then(() => {
                window.location.href = '/views/home/login';
            });
        });

        //escuchar evento de error
        socket.on('errorRegister', (data) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: JSON.stringify(data.err),
                timer: 3000
            })
        });

       //enviar petición al servidor con ruta y data
        const response = await fetch($$registerForm.action, options);

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error en el registro',
            text: 'Ocurrió un error al registrar. Inténtalo nuevamente.'
        });
    }
});