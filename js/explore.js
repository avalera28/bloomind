document.addEventListener('DOMContentLoaded', () => {

    // Resaltar el enlace activo en el encabezado
    const links = document.querySelectorAll('.header_link');
    const currentPage = window.location.pathname.replace("/", "");

    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('header_link--active');
        }
    });

    // Elementos de la tarjeta
    const titleElement = document.querySelector('.explore-description_title');
    const subtitleElement = document.querySelector('.explore-description_subtitle');
    const latinNameElement = document.querySelector('.explore-description_latin-name');
    const descriptionTextElement = document.getElementById('emotionDescription');
    const imageElement = document.querySelector('.explore-description_image-container img');
    const descriptionContainer = document.querySelector('.explore_description-container');
    const emotionButtons = document.querySelectorAll('.explore_button');
    const buttonGroup = document.querySelector('.explore_button-group');
    const exploreInstruction = document.querySelector('.explore_instruction');

    let cardActive = false;

    gsap.to(
        ".explore_title",
        { opacity: 1, duration: 1.5 }
    )

    gsap.to(
        exploreInstruction,
        { opacity: 1, duration: 1.5, delay: 1.5 }
    )

    gsap.fromTo(
        buttonGroup,
        { scale: 0 },
        { scale: 1, duration: 1.5, delay: 1.5 }

    )

    // Mostrar descripción y animación al pasar el mouse sobre un botón de emoción
    emotionButtons.forEach(button => {
        button.addEventListener('mouseover', () => {

            // Reposicionar los botones
            buttonGroup.classList.add('active');

            const emotion = button.getAttribute('data-emotion');
            const emotionInfo = emotions[emotion];

            // Cambiar el color de la mitad superior
            button.style.setProperty('--color-emotion-hover', emotionInfo.color);


            // Rellenar los datos en la tarjeta
            titleElement.textContent = emotionInfo.title;
            subtitleElement.textContent = "Semilla"; // Valor estático
            latinNameElement.style.color = emotionInfo.color;
            latinNameElement.textContent = emotionInfo.latin_name;
            descriptionTextElement.textContent = emotionInfo.description_explore;
            imageElement.src = emotionInfo.image;
            imageElement.alt = emotionInfo.title;

            // Mostrar el contenedor si estaba oculto
            if (cardActive == false) {
                gsap.fromTo(
                    descriptionContainer,
                    { rotateX: 80, opacity: 0 },
                    { rotateX: 0, opacity: 1, duration: 0.5 }
                );
                cardActive = true;
            }

            gsap.to(
                exploreInstruction,
                { opacity: 0, duration: 1.5 }
            )



        });


        // Al hacer clic en una emoción, almacenar los datos y redirigir a la página de generación de la planta
        button.addEventListener('click', () => {
            const emotion = button.getAttribute('data-emotion');
            const emotionInfo = emotions[emotion];

            localStorage.setItem("plant_source", emotions[emotion].emotion);
            localStorage.setItem("emotionKey", emotions[emotion].key)
            window.location.href = emotionInfo.location;
        });
    });





});




