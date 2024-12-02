const $$selector = document.querySelector("#login");

$$selector.addEventListener("click", async (e) => {
    e.preventDefault();
    try {

        const data ={
            email: document.querySelector("#email").value,
            password : document.querySelector("#password").value
        }
        const options = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        };

        const response = await fetch("api/sessions/login", options);
        // console.log(response);

        response = await response.json();

        alert(response.message);

       

        
    } catch (error) {
        console.error(error);
    }
});
    