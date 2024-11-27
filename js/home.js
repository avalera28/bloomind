gsap.registerPlugin(DrawSVGPlugin);
gsap.registerPlugin(ScrollTrigger);

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


    const colorBackground = getComputedStyle(document.body).getPropertyValue("--color-background");
    const colorPrimary = getComputedStyle(document.body).getPropertyValue("--color-primary");

    const colorText = getComputedStyle(document.body).getPropertyValue("--color-text");
    const colorTextLight = getComputedStyle(document.body).getPropertyValue("--color-text-light");

    ScrollTrigger.create({
        trigger: '.main-container-home section',
        start: 'top 10%',
        onToggle: (self) => {
            gsap.set(".header_link", {color: colorText})
            gsap.set(".header_logo", { "attr": {"src": "assets/images/logo.png"} })
           gsap.to(".header", {"background-color": colorBackground, duration: 0.3});
           
        },
        onLeaveBack: ({progress, direction, isActive}) => {
            gsap.set(".header_link", {color: colorTextLight})
            gsap.set(".header_logo", { "attr": {"src": "assets/images/logo_light.png"} })
            gsap.to(".header", {"background-color": colorPrimary, duration: 0.3})
        }


    });

});





