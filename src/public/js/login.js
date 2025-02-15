
const $$loginBtn = document.querySelector("#login");
const $$loginForm = document.querySelector("#loginForm");
const socket = io();

console.log("socket: ", socket);
console.log("loginBtn: ", $$loginBtn);
console.log("loginForm: ", $$loginForm);

$$loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData($$loginForm);
        const data = Object.fromEntries(formData); // Convierte FormData a objeto
        const jsonData = JSON.stringify(data); // Convierte el objeto a JSON
        console.log(jsonData);

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

        console.log("antes del fetch");

        let response = await fetch($$loginForm.action, options);

        console.log("despues del fetch");
        
        
    } catch (error) {
        console.error(error);
    }
});
    