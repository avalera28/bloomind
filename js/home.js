gsap.registerPlugin(DrawSVGPlugin);

document.addEventListener('DOMContentLoaded', () => {

    const links = document.querySelectorAll('.header_link');
    const currentPage = window.location.pathname.replace("/", "");

    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('header_link--active');
        }
    });

    gsap.fromTo(
        ".home_logo .b",
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 3, ease: "power1.inOut", stagger: 0.3, fill: "#0c0c0c" }
    );
    gsap.fromTo(
        ".home_logo .a",
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 3, ease: "power1.inOut", stagger: 0.3, fill: "#da483b" }
    );


});





