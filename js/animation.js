
document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(DrawSVGPlugin);
  
    // Anima todos los trazos de los paths en el SVG
    gsap.fromTo(
      ".home_logo .b", // Asegúrate de que este selector coincida con los trazos del SVG
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 3, ease: "power1.inOut", stagger: 0.3, fill: "#da483b"}
    );
    gsap.fromTo(
        ".home_logo .c", // Asegúrate de que este selector coincida con los trazos del SVG
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 3, ease: "power1.inOut", stagger: 0.3, fill: "#0c0c0c"}
      );
  });
