document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(DrawSVGPlugin);
  
    // Anima todos los trazos de los paths en el SVG
    gsap.fromTo(
      "path", // Asegúrate de que este selector coincida con los trazos del SVG
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 3, ease: "power1.inOut", stagger: 0.3 }
    );
  });
