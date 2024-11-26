
document.addEventListener("DOMContentLoaded", function () {

  gsap.registerPlugin(DrawSVGPlugin);

  // Anima todos los trazos de los paths en el SVG
  gsap.fromTo(
    ".home_logo .b", // Asegúrate de que este selector coincida con los trazos del SVG
    { drawSVG: "0%" },
    { drawSVG: "100%", duration: 3, ease: "power1.inOut", stagger: 0.3, fill: "#da483b" }
  );
  gsap.fromTo(
    ".home_logo .c", // Asegúrate de que este selector coincida con los trazos del SVG
    { drawSVG: "0%" },
    { drawSVG: "100%", duration: 3, ease: "power1.inOut", stagger: 0.3, fill: "#0c0c0c" }
  );

  const track = document.querySelector(".carousel-track");
  const items = document.querySelectorAll(".carousel-item");
  const prevButton = document.querySelector(".carousel-button.prev");
  const nextButton = document.querySelector(".carousel-button.next");

  const itemWidth = items[0].offsetWidth + 16; // Adjust for margin (gap)
  const visibleItems = Math.floor(track.offsetWidth / itemWidth);
  let position = 0;

  const updateButtons = () => {
      prevButton.disabled = position === 0;
      nextButton.disabled = position >= items.length - visibleItems;
  };

  prevButton.addEventListener("click", () => {
      position = Math.max(position - 1, 0);
      track.style.transform = `translateX(-${position * itemWidth}px)`;
      updateButtons();
  });

  nextButton.addEventListener("click", () => {
      position = Math.min(position + 1, items.length - visibleItems);
      track.style.transform = `translateX(-${position * itemWidth}px)`;
      updateButtons();
  });

  updateButtons(); // Initialize button states
});

document.addEventListener("scroll", () => {
  const elements = document.querySelectorAll("[data-scroll='fade-in']");
  const windowHeight = window.innerHeight;

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight - 100) {
      el.classList.add("active");
    }
  });
});