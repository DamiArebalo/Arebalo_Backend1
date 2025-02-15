const $$registerForm = document.querySelector("#registerForm");
const socket = io(); 
console.log("socket: ", socket);

console.log($$registerForm);
const $$registerBtn = document.querySelector("#register");
$$registerBtn.addEventListener("click", async (e) => {
     

    const formData = new FormData($$registerForm);
    const data = Object.fromEntries(formData); // Convierte FormData a objeto
    const jsonData = JSON.stringify(data); // Convierte el objeto a JSON
    console.log(jsonData);

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
        console.log("antes del fetch");
        const response = await fetch($$registerForm.action, options);
        console.log("despues del fetch");


        
       

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error en el registro',
            text: 'Ocurrió un error al registrar. Inténtalo nuevamente.'
        });
    }
});