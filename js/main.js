// main.js - Archivo JavaScript principal para el proyecto Jardín de Emociones

document.addEventListener('DOMContentLoaded', () => {
    // Efecto de aparición al hacer scroll en los elementos con la clase 'fade-in'
    const elements = document.querySelectorAll('[data-scroll="fade-in"]');

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
        { opacity: 1, duration: 1.5, delay:1.5}
    )

    gsap.fromTo(
        buttonGroup,
        { scale: 0 },
        { scale: 1, duration: 1.5, delay: 1.5 }

    )

   
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.5
    });

    elements.forEach(el => observer.observe(el));

    // Datos de emociones y sus colores
    const emotions = {
        esperanza: {
            key: "hope",
            title: "Esperanza",
            location: "hope.html",
            latin_name: "Spes Lucida",
            family: "Energizing Family",
            image: "assets/images/Hope/hope_seed.png",
            description_explore: "La esperanza es la emoción que nos motiva a proyectarnos hacia el futuro con optimismo, aun en circunstancias desafiantes. Nos impulsa a confiar en el cambio y a visualizar posibilidades que nos inspiran.",
            color: "var(--color-emotion-esperanza)"
        },
        alegria: {
            key: "joy",
            title: "Alegría",
            location: "joy.html",
            latin_name: "Laetitia Vivida",
            family: "Energizing Family",
            image: "assets/images/Joy/joy_seed.png",
            description_explore: "La alegría es una emoción positiva que refuerza nuestro bienestar y nos conecta con los aspectos satisfactorios de la vida. Experimentarla nos invita a apreciar el presente y a compartir momentos de conexión.",
            color: "var(--color-emotion-alegria)"
        },
        calma: {
            key: "calm",
            title: "Calma",
            location: "calm.html",
            latin_name: "Serenitas Profunda",
            family: "Tranquilizing Family",
            image: "assets/images/Calm/calm_seed.png",
            description_explore: "La calma es una sensación de serenidad que nos permite centrar nuestra mente y cuerpo. Esta emoción es fundamental para el bienestar, pues nos ayuda a gestionar el estrés y a encontrar claridad en la toma de decisiones.",
            color: "var(--color-emotion-calma)"
        },
        tristeza: {
            key: "sadness",
            title: "Tristeza",
            location: "sadness.html",
            latin_name: "Tristitia Profunda",
            family: "Introspective Family",
            image: "assets/images/Sadness/sadness_seed.png",
            description_explore: "La tristeza es una emoción que nos permite procesar y reflexionar sobre las pérdidas o momentos difíciles. A través de ella, reconocemos nuestras experiencias y aprendemos a dejar ir, fortaleciendo nuestra resiliencia.",
            color: "var(--color-emotion-tristeza)"
        },
        rabia: {
            key: "rage",
            title: "Rabia",
            location: "rage.html",
            latin_name: "Ira Vehementia",
            family: "Activating Family",
            image: "assets/images/Rage/rage_seed.png",
            description_explore: "La rabia es una emoción intensa que surge cuando percibimos injusticias o amenazas. Es una fuerza que nos motiva a protegernos y a defender nuestros valores, siempre con el desafío de expresarla de forma constructiva.",
            color: "var(--color-emotion-rabia)"
        },
        ansiedad: {
            key: "anxiety",
            title: "Ansiedad",
            location: "anxiety.html",
            latin_name: "Anxietas Constans",
            family: "Anticipatory Family",
            image: "assets/images/Anxiety/anxiety_seed.png",
            description_explore: "La ansiedad es una respuesta emocional ante la incertidumbre y el cambio. Aunque a veces desafiante, comprenderla nos ayuda a reconocer nuestros miedos y a desarrollar estrategias para manejarlos con equilibrio.",
            color: "var(--color-emotion-ansiedad)"
        }
    };




    console.log(descriptionContainer);
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

        // Limpiar la descripción y ocultar cuadro al quitar el mouse
        button.addEventListener('mouseout', () => {
            descriptionDiv.style.display = "none";
            descriptionDiv.innerHTML = '';
            const emotionName = button.querySelector('.explore_button-label');

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

    

    // Resaltar el enlace activo en el encabezado
    const links = document.querySelectorAll('.header_link');
    const currentPage = window.location.pathname.replace("/", "");

    console.log('links', links)
    console.log('currentPage', currentPage)

    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('header_link--active');
        }
    });
});
