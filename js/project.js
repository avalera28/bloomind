document.addEventListener("DOMContentLoaded", function () {


  createHamburgerMenu();

  const links = document.querySelectorAll('.header_link');
  const currentPage = window.location.pathname.replace("/", "");

  links.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('header_link--active');
    }
  });

  // Lógica del carrusel
  const track = document.querySelector(".carousel-track");
  if (track) {
    const items = document.querySelectorAll(".carousel-item");
    const prevButton = document.querySelector(".carousel-button.prev");
    const nextButton = document.querySelector(".carousel-button.next");

    if (items.length > 0) {
      const itemWidth = items[0].offsetWidth + 16; // Ajustar según el margen entre items
      let position = 0;

      const updateTrackPosition = () => {
        track.style.transform = `translateX(-${position * itemWidth}px)`;
      };

      prevButton.addEventListener("click", () => {
        position = (position - 1 + items.length) % items.length; // Ciclo hacia atrás
        updateTrackPosition();
      });

      nextButton.addEventListener("click", () => {
        position = (position + 1) % items.length; // Ciclo hacia adelante
        updateTrackPosition();
      });

      // Inicializa el estado del carrusel
      updateTrackPosition();
    }
  }

  // Animaciones de fade-in al hacer scroll
  const elements = document.querySelectorAll("[data-scroll='fade-in']");
  if (elements.length > 0) {
    document.addEventListener("scroll", () => {
      const windowHeight = window.innerHeight;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight - 100) {
          el.classList.add("active");
        }
      });
    });
  }

});



