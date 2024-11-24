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
            latin_name: "Spes Lucida",
            family: "Energizing Family",
            image: "assets/images/hope_seed.png",
            description_explore: "La esperanza es la emoción que nos motiva a proyectarnos hacia el futuro con optimismo, aun en circunstancias desafiantes. Nos impulsa a confiar en el cambio y a visualizar posibilidades que nos inspiran.",
            description_plant: "La esperanza se manifiesta como una sensación de apertura y ligereza en el pecho, una expansión que nos anima a proyectarnos hacia adelante. Mentalmente, se percibe como un destello de claridad, que ilumina nuevas posibilidades. Aprovecha este momento para visualizar tus metas y conectarte con lo que te inspira.",
            color: "var(--color-emotion-esperanza)"
        },
        alegria: {
            key: "joy",
            title: "Alegría",
            latin_name: "Laetitia Vivida",
            family: "Energizing Family",
            image: "assets/images/joy_seed.png",
            description_explore: "La alegría es una emoción positiva que refuerza nuestro bienestar y nos conecta con los aspectos satisfactorios de la vida. Experimentarla nos invita a apreciar el presente y a compartir momentos de conexión.",
            description_plant: "La alegría se siente como una chispa de energía que recorre todo el cuerpo, una sensación brillante y efervescente que nos llena de vitalidad. Mentalmente, es un estado claro y positivo, que nos impulsa a disfrutar plenamente el momento presente. Aprovecha esta alegría para compartir tus sensaciones con los demás y expandir ese momento positivo.",
            color: "var(--color-emotion-alegria)"
        },
        calma: {
            key: "calm",
            title: "Calma",
            latin_name: "Serenitas Profunda",
            family: "Tranquilizing Family",
            image: "assets/images/calm_seed.png",
            description_explore: "La calma es una sensación de serenidad que nos permite centrar nuestra mente y cuerpo. Esta emoción es fundamental para el bienestar, pues nos ayuda a gestionar el estrés y a encontrar claridad en la toma de decisiones.",
            description_plant: "La calma se percibe como una suavidad en todo el cuerpo, una sensación de relajación que invita a bajar el ritmo. Mentalmente, es similar a una superficie de agua tranquila y sin interrupciones. Permítete disfrutar de esta calma, respirando lentamente y saboreando la tranquilidad del momento.",
            color: "var(--color-emotion-calma)"
        },
        tristeza: {
            key: "sadness",
            title: "Tristeza",
            latin_name: "Tristitia Profunda",
            family: "Introspective Family",
            image: "assets/images/sadness_seed.png",
            description_explore: "La tristeza es una emoción que nos permite procesar y reflexionar sobre las pérdidas o momentos difíciles. A través de ella, reconocemos nuestras experiencias y aprendemos a dejar ir, fortaleciendo nuestra resiliencia.",
            description_plant: "La tristeza se percibe como una sensación de peso en el cuerpo, especialmente en el pecho y los hombros, y tiende a ralentizar nuestro ritmo. Mentalmente, es un estado profundo y reflexivo, que invita a la introspección y a procesar lo que hemos vivido. Date el permiso de sentir y expresar esta emoción; hablar con alguien de confianza puede ayudarte a procesarla.",
            color: "var(--color-emotion-tristeza)"
        },
        rabia: {
            key: "rage",
            title: "Rabia",
            latin_name: "Ira Vehementia",
            family: "Activating Family",
            image: "assets/images/rage_seed.png",
            description_explore: "La rabia es una emoción intensa que surge cuando percibimos injusticias o amenazas. Es una fuerza que nos motiva a protegernos y a defender nuestros valores, siempre con el desafío de expresarla de forma constructiva.",
            description_plant: "La rabia es una emoción intensa que se siente como una presión o calor concentrado en el pecho o las manos. Es una energía fuerte y motivadora, que nos da la determinación de actuar o expresar nuestras inquietudes con convicción. Antes de reaccionar, intenta canalizar esa energía de manera constructiva, por ejemplo, escribiendo o hablando sobre lo que sientes.",
            color: "var(--color-emotion-rabia)"
        },
        ansiedad: {
            key: "anxiety",
            title: "Ansiedad",
            latin_name: "Anxietas Constans",
            family: "Anticipatory Family",
            image: "assets/images/anxiety_seed.png",
            description_explore: "La ansiedad es una respuesta emocional ante la incertidumbre y el cambio. Aunque a veces desafiante, comprenderla nos ayuda a reconocer nuestros miedos y a desarrollar estrategias para manejarlos con equilibrio.",
            description_plant: "La ansiedad suele sentirse como una tensión constante en el cuerpo, especialmente en el pecho y el abdomen, acompañada de una sensación de inquietud. A nivel mental, puede ser un flujo rápido y repetitivo de pensamientos difíciles de controlar. Tómate un instante para respirar profundamente y recobrar el equilibrio, permitiendo que cada respiración calme tu mente.",
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
            localStorage.setItem('selectedEmotion', JSON.stringify(emotionInfo));
            localStorage.setItem("plant_source", emotions[emotion].emotion);
            localStorage.setItem("emotionKey", emotions[emotion].key)
            window.location.href = 'plant.html';
        });
    });

    // Cargar la emoción seleccionada en plant.html
    const selectedEmotion = localStorage.getItem('selectedEmotion');
    if (selectedEmotion && window.location.pathname.includes('plant.html')) {
        const emotionData = JSON.parse(selectedEmotion);
        document.getElementById('emotionTitle').textContent = emotionData.title;
        document.getElementById('emotionDescriptionText').textContent = emotionData.description_plant;
        document.querySelector(".plant_family-name").textContent = emotionData.family;
        document.querySelector(".plant_latin-name").textContent = emotionData.latin_name;
        document.querySelector(".plant_visual-title").textContent = emotionData.latin_name;
    }

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
