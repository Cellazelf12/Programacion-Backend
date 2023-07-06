const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = Object.fromEntries(data.entries());

    try {
        const response = await fetch('/api/sessions/register', {
            method: 'POST',
            body: JSON.stringify(obj),

        });

        if (response.ok) {
            const json = await response.json();
            console.log(json);
            window.location.replace('http://localhost:8080/');
        } else {
            //Agregar un sweet alert o modal.
        }
    } catch (error) {
        console.log(error);
    }
});
