// main.js - Archivo JavaScript principal para el proyecto Jardín de Emociones

document.addEventListener('DOMContentLoaded', () => {
    // Efecto de aparición al hacer scroll en los elementos con la clase 'fade-in'
    const elements = document.querySelectorAll('[data-scroll="fade-in"]');

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
            title: "Esperanza",
            description: "La esperanza es la emoción que nos motiva a proyectarnos hacia el futuro con optimismo. Nos impulsa a confiar en el cambio y visualizar posibilidades que nos inspiran.",
            color: "var(--color-emotion-esperanza)"
        },
        alegria: {
            title: "Alegría",
            description: "La alegría nos brinda momentos de felicidad y satisfacción con la vida. Es una emoción positiva que nos conecta con el presente.",
            color: "var(--color-emotion-alegria)"
        },
        calma: {
            title: "Calma",
            description: "La calma nos permite mantenernos en paz en situaciones de tranquilidad. Nos ayuda a encontrar un equilibrio interior y a disfrutar de momentos de serenidad.",
            color: "var(--color-emotion-calma)"
        },
        tristeza: {
            title: "Tristeza",
            description: "La tristeza refleja la emoción ante las pérdidas y nos ayuda a sanar. Es una emoción que nos permite conectar con nuestra vulnerabilidad.",
            color: "var(--color-emotion-tristeza)"
        },
        rabia: {
            title: "Rabia",
            description: "La rabia nos da fuerza para enfrentar las injusticias y cambios. Es una emoción que nos motiva a actuar y buscar soluciones.",
            color: "var(--color-emotion-rabia)"
        },
        ansiedad: {
            title: "Ansiedad",
            description: "La ansiedad es una señal de alerta para buscar calma y seguridad. Nos recuerda la importancia de cuidar de nuestra salud mental y emocional.",
            color: "var(--color-emotion-ansiedad)"
        }
    };

    const emotionButtons = document.querySelectorAll('.emotion-button');
    const descriptionDiv = document.getElementById('emotionDescription');

    // Mostrar descripción y animación al pasar el mouse sobre un botón de emoción
    emotionButtons.forEach(button => {
        button.addEventListener('mouseover', () => {
            const emotion = button.getAttribute('data-emotion');
            const emotionInfo = emotions[emotion];

            // Cambiar el color de la mitad superior
            button.style.setProperty('--color-emotion-hover', emotionInfo.color);

            // Mostrar cuadro de texto con la descripción y ajustar visibilidad
            descriptionDiv.innerHTML = `
                <div class="description-box" style="background-color: var(--color-highlight)">
                    <h3>${emotionInfo.title}</h3>
                    <p>${emotionInfo.description}</p>
                </div>
            `;
            descriptionDiv.style.display = "block";

            // Agregar clase de rebote para la animación
            const emotionName = button.querySelector('.emotion-name');
            emotionName.classList.add('bounce');
        });

        // Limpiar la descripción y ocultar cuadro al quitar el mouse
        button.addEventListener('mouseout', () => {
            descriptionDiv.style.display = "none";
            descriptionDiv.innerHTML = '';
            const emotionName = button.querySelector('.emotion-name');
            emotionName.classList.remove('bounce');
        });

        // Al hacer clic en una emoción, almacenar los datos y redirigir a la página de generación de la planta
        button.addEventListener('click', () => {
            const emotion = button.getAttribute('data-emotion');
            const emotionInfo = emotions[emotion];
            localStorage.setItem('selectedEmotion', JSON.stringify(emotionInfo));
            window.location.href = 'plant.html';
        });
    });

    // Cargar la emoción seleccionada en plant.html
    const selectedEmotion = localStorage.getItem('selectedEmotion');
    if (selectedEmotion && window.location.pathname.includes('plant.html')) {
        const emotionData = JSON.parse(selectedEmotion);
        document.getElementById('emotionTitle').textContent = emotionData.title;
        document.getElementById('emotionDescriptionText').textContent = emotionData.description;
    }
});
