const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = Object.fromEntries(data.entries());

    try {
        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            body: JSON.stringify(obj),

        });

        if (response.ok) {
            window.location.replace('api/products');
        } else {
            //Agregar un sweet alert o modal.
        }
    } catch (error) {
        console.log(error);
    }
});
