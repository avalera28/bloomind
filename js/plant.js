gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    const anchorLink = document.querySelector(".anatomy_link");
    anchorLink.addEventListener('click', () => {
        anatomyPlantTimeline.play();
    })

    ScrollTrigger.create({
        trigger: '#plant_anatomy-section',
        start: 'top top',
        onToggle: (self) => {
           console.log("triggered");
           
    
           anatomyPlantTimeline.play();
        }

    });
    

    const anatomygarden = document.getElementById("plant_anatomy-img");


    let alreadyPlayed = {
        leaves: false,
        flowers: false,
        stem: false,
        soil: false,
        seed: false,
        root: false
    }
    anatomygarden.addEventListener("plants_generated", () => {

        
        const leaves = anatomygarden.querySelector("#leaf").children;
        const flowers = anatomygarden.querySelector("#flower").children;
        const stem = anatomygarden.querySelector("#stem").children;
        const soil = anatomygarden.querySelector("#soil").children;
        const seed = anatomygarden.querySelector("#seed").children;
        const root = anatomygarden.querySelector("#root").children;


        for( const child of leaves){
            child.addEventListener('mouseover', () => animatePlantDescription("plant_anatomy-leaf", "leaves"));
            
        }
        for( const child of flowers){
            child.addEventListener('mouseover', () => animatePlantDescription("plant_anatomy-flower", "flowers"));
            
        }
        for( const child of stem){
            child.addEventListener('mouseover', () => animatePlantDescription("plant_anatomy-stem", "stem"));
            
        }
        for( const child of soil){
            child.addEventListener('mouseover', () => animatePlantDescription("plant_anatomy-soil", "soil"));
            
        }
        for( const child of seed){
            child.addEventListener('mouseover', () => animatePlantDescription("plant_anatomy-seed", "seed"));
            
        }
        for( const child of root){
            child.addEventListener('mouseover', () => animatePlantDescription("plant_anatomy-root", "root"));
            
        }
        
    })

    function animatePlantDescription(id, type){
        if(!alreadyPlayed[type] && anatomyPlantTimeline.progress() == 1){
            alreadyPlayed[type] = true;
            gsap.to(document.getElementById(id), {
                keyframes: {
                    "0%":   { opacity: 0},
                    "40%":   { opacity: 0.6},
                    "100%":   { opacity: 1},
                   },
                duration: 1
            })
        }
        
    }


    const emotionButtons = document.querySelectorAll('.explore_button');
    const buttonGroup = document.querySelector('.explore_button-group');
    // Mostrar descripción y animación al pasar el mouse sobre un botón de emoción

    gsap.fromTo(
        buttonGroup,
        { scale: 0 },
        { scale: 1, duration: 1.5, delay: 1.5 }

    )
    emotionButtons.forEach(button => {
        button.addEventListener('mouseover', () => {

            // Reposicionar los botones
            buttonGroup.classList.add('active');

            const emotion = button.getAttribute('data-emotion');
            const emotionInfo = emotions[emotion];

            // Cambiar el color de la mitad superior
            button.style.setProperty('--color-emotion-hover', emotionInfo.color);

        });


        // Al hacer clic en una emoción, almacenar los datos y redirigir a la página de generación de la planta
        button.addEventListener('click', () => {
            const emotion = button.getAttribute('data-emotion');
            const emotionInfo = emotions[emotion];

            localStorage.setItem("plant_source", emotions[emotion].emotion);
            localStorage.setItem("emotionKey", emotions[emotion].key)
            window.location.href = emotionInfo.location;
        });
    });


    
    const bloomElement = document.querySelector(".bloom-tip-content");
    const bloomText = document.querySelector(".plant_anatomy-bloom-tip .plant_anatomy-item-text");

    console.log("bloomText", bloomText);
    
    gsap.set(bloomText, {opacity: 0});
   
    
    bloomElement.addEventListener('click', () => {
        gsap.to(bloomText, {opacity: 1, duration: 2});
    })
    
});




