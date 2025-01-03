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

function createHamburgerMenu() {
    const menu = document.querySelector(".mobile-menu");
    const menuItems = document.querySelectorAll(".header_link");
    const hamburger = document.querySelector(".hamburger-menu");
    //const closeIcon = document.querySelector(".closeIcon");
    const menuIcon = document.querySelector(".hamburger-menu svg");
    let isMenuOpen = false;


    const openMenu = () => {
        isMenuOpen = true;
        menu.classList.add('show');
        gsap.to(menu, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
        gsap.to(hamburger.querySelector('svg'), {
            rotation: 90,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    // Función para cerrar el menú
    const closeMenu = () => {
        isMenuOpen = false;
        gsap.to(menu, {
            opacity: 0,
            y: -10,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                menu.classList.remove('show');
            }
        });
        gsap.to(hamburger.querySelector('svg'), {
            rotation: 0,
            duration: 0.3,
            ease: "power2.in"
        });
    };

    function toggleMenu() {
        if (!isMenuOpen) {
            openMenu()
        } else {
            closeMenu()
        }
    }

    hamburger.addEventListener("click", toggleMenu);


    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (menu.classList.contains("show") &&
            !menu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Cerrar menú al redimensionar la ventana
    window.addEventListener('resize', () => {
        if (menu.classList.contains("show") && window.innerWidth > 768) {
            closeMenu();
        }
    });
}
