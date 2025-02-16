
//recuperar elementos del formulario
const $$loginBtn = document.querySelector("#login");
const $$loginForm = document.querySelector("#loginForm");
//conectar con el socket
const socket = io();

//puesto de control
// console.log("socket: ", socket);
// console.log("loginBtn: ", $$loginBtn);
// console.log("loginForm: ", $$loginForm);

//evento de click en el botón de inicio de sesión
$$loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        //guardar datos del formulario
        const formData = new FormData($$loginForm);
        const data = Object.fromEntries(formData); // Convierte FormData a objeto
        const jsonData = JSON.stringify(data); // Convierte el objeto a JSON
        //puesto de control
        //console.log(jsonData);

        //configurar opciones para el request
        const options = {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: jsonData
        };

        //escuchar evento de error
        socket.on('errorLogin', (data) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: JSON.stringify(data.err),
                timer: 3000
            })
        });

        //escuchar evento de login
        socket.on('loged', (data) => {
            Swal.fire({
                icon: 'success',
                title: 'Login exitoso',
                text: data.message.message,
                timer: 3000
            }).then(() => {
                window.location.href = '/views/home';
            });
        });

        //enviar petición al servidor con ruta y data
        let response = await fetch($$loginForm.action, options);
        
    
    } catch (error) {
        console.error(error);
    }
});
    