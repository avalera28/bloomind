document.addEventListener("DOMContentLoaded", function () {
  // Registro de plugins de GSAP
  gsap.registerPlugin(DrawSVGPlugin);

  // Anima los trazos del SVG del logo
  gsap.fromTo(
    ".home_logo .b",
    { drawSVG: "0%" },
    { drawSVG: "100%", duration: 3, ease: "power1.inOut", stagger: 0.3, fill: "#da483b" }
  );
  gsap.fromTo(
    ".home_logo .c",
    { drawSVG: "0%" },
    { drawSVG: "100%", duration: 3, ease: "power1.inOut", stagger: 0.3, fill: "#0c0c0c" }
  );

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
