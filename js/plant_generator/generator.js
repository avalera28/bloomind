gsap.registerPlugin(DrawSVGPlugin);
gsap.config({ trialWarn: false });

const ns = "http://www.w3.org/2000/svg";

let globalConfig = {}

// Evento a emitir cuando las plantas y animaciones son añadidas al documento
const plantsGeneratedEvent = new Event("plants_generated");


const emotion = localStorage.getItem("emotionKey");

// Timelines principales de las animaciones
const gardenTimeline = gsap.timeline();
gardenTimeline.addLabel("start", 0);
gardenTimeline.pause();

const anatomyPlantTimeline = gsap.timeline();
anatomyPlantTimeline.addLabel("start", 1);
anatomyPlantTimeline.pause();

let timelines = [];

// Mapa auxiliar para traducir distintos ids
const mapTypeName = {
    "stem": "stem",
    "flower": "flower",
    "seed": "seed",
    "background": "background",
    "leaf": "leaf",
    "soil": "soil",
    "root": "root",
    "tallos": "stem",
    "tallo": "stem",
    "hojas": "leaf",
    "flores": "flower",
    "semilla": "seed",
    "suelo": "soil",
    "raices": "root",
    "fondo": "background"
}

// Lectura de el archivo de configuraciones segun la emocion
function loadPlantTypeConfigurationFile(type) {
    const configuration = localStorage.getItem(`${type}_configuration`);
    if (configuration !== null) {
        return Promise.resolve(configuration);
    }

    return readJsonFile(`./data/plant_configurations/${type}_configuration.json`)
        .then((data) => {
            globalConfig = data.global;
            return data;
        })
}

loadPlantTypeConfigurationFile(emotion)
    .then((configuration) => {
        return loadPlantTypeConfiguration(configuration);
    })
    .then((configuration) => generate(configuration))


// Funcion para generar las plantas a partir de la configuracion
function generate(configuration) {
    const numberOfPlants = configuration.number_plants;
    const minSeparation = configuration.min_separation;
    const svgGarden = document.getElementById("garden");
    const initialPositions = generateInitialPositions(minSeparation, svgGarden);
    const sampledPositions = _.sampleSize(initialPositions, numberOfPlants);
    const plantConfiguration = _.sample(configuration.plants);
    for (let i = 0; i < numberOfPlants; i++) {
        generatePlant(i, sampledPositions[i], plantConfiguration, svgGarden, gardenTimeline);
    }

    gardenTimeline.play();
    selectedPlantConfiguration = plantConfiguration;
    generateSinglePlant(plantConfiguration, true, anatomyPlantTimeline);
    
}

// Funcion para generar una sola planta que es visible en la anatomia de la planta
function generateSinglePlant(plantConfiguration, animateGlobalComponents, timeline) {


    const svgGarden = document.getElementById("plant_anatomy-img");
    const viewBox = svgGarden.viewBox.baseVal;

    const position = {
        "x": 150,
        "y": 0
    }
    plantConfiguration.scale = 3;
    generatePlant(5, position, plantConfiguration, svgGarden, timeline, animateGlobalComponents);
    svgGarden.dispatchEvent(plantsGeneratedEvent);
}

// Calculo aleatorio de las posiciones iniciales de las plantas
function generateInitialPositions(minSeparation, garden) {
    let initialPositions = [];
    const viewBox = garden.viewBox.baseVal;
    let currentX = 0;
    while (currentX < viewBox.width - minSeparation) {
        initialPositions.push({
            x: currentX,
            y: 0
        })
        currentX += minSeparation;
    }
    return initialPositions;

}

// Genera una planta 
function generatePlant(counter, initialPosition, configuration, garden, timeline, animateGlobalComponents = false) {

    const plantSuffix = `${configuration.name}_${counter}`
    const plant = createElements(configuration, plantSuffix, initialPosition, garden);

    for (const group of plant.children) {
        const overridedConfiguration = overrideConfiguration(configuration, group, animateGlobalComponents)
        prepareElementForGrow(overridedConfiguration, group);
        createElementGroupAnimation(overridedConfiguration, group, timeline);
    }

}

// Sobreescribe la configuration de un componente. Es usado para componentes globales como semilla o suelo 
function overrideConfiguration(configuration, group, animateGlobalComponents){
    const rawType = group.id;
    const type = mapTypeName[rawType.toLowerCase()];
    let overridedConfiguration = {};


    if (animateGlobalComponents && globalConfig.components.includes(type)) {
        overridedConfiguration.components = {};
        overridedConfiguration.components[type] = {
            "grow_delay": globalConfig.grow_delay,
            "grow_duration": globalConfig.grow_duration
        }
    }
    else {
        overridedConfiguration = configuration;
    }
    return overridedConfiguration;
}

function initPlantTimeline() {
    return gsap.timeline()
}

// Coloca la configuracion inicial de los elementos antes de la animacion
function prepareElementForGrow(configuration, group) {
    const rawType = group.id;
    const type = mapTypeName[rawType.toLowerCase()];
    const groupConfiguration = configuration.components[type];
    if (groupConfiguration === null || groupConfiguration === undefined) {
        return
    }

    for (const element of group.children) {
        let options = {};

        if (groupConfiguration.animation_strategy === "opacity") {
            options.opacity = 0;
        }

        if (groupConfiguration.animation_strategy === "scale") {
            options.scaleX = 0;
            options.scaleY = 0;
        }

        if (Object.hasOwn(groupConfiguration, "origin")) {
            options.transformOrigin = `${groupConfiguration.origin.x_percent}% ${groupConfiguration.origin.y_percent}%`;
        }

        
        if (options != {}) {
            gsap.set(element, options);
        }
    }


}


// Crea las animaciones de los grupos elementos
function createElementGroupAnimation(configuration, group, timeline) {
    const rawType = group.id;
    const type = mapTypeName[rawType.toLowerCase()];
    const groupConfiguration = configuration.components[type];
    if (groupConfiguration === null || groupConfiguration === undefined) {
        return
    }
    let plantTimeline = initPlantTimeline();
    plantTimeline.addLabel("start", 0);
    if (type === "stem" || type === "soil" || type === "background" || type === "seed" || type === "root") {
        createElementAnimation(groupConfiguration, plantTimeline, type, group);
    }
    else {
        for (const upperElement of group.children) {
            createElementAnimation(groupConfiguration, plantTimeline, type, upperElement);
        }
    }
    timeline.add(plantTimeline, "start");
}

// Crea las animaciones de los elementos
function createElementAnimation(configuration, timeline, type, element) {

    const growDuration = configuration.grow_duration;
    const growDelay = configuration.grow_delay;
    const animationStrategy = configuration.animation_strategy;

    switch (type) {
        case "stem":
            timeline.to("#empty0", { opacity: 0, duration: growDuration }, `start+=${growDelay}`)
            if(animationStrategy === "opacity"){
                for(const innerElement of element.children){
                    animatePlantComponent(innerElement, timeline, growDuration, growDelay, animationStrategy);
                }
                
                break;
            }
            animateTrails(element, timeline, growDuration, growDelay);
            break;
        case "leaf":
            timeline.to("#empty1", { opacity: 0, duration: growDuration }, `start+=${growDelay}`)
            animatePlantComponent(element, timeline, growDuration, growDelay, animationStrategy);
            break;
        case "flower":
            timeline.to("#empty2", { opacity: 0, duration: growDuration }, `start+=${growDelay}`)
            animatePlantComponent(element, timeline, growDuration, growDelay, animationStrategy);
            break;
        case "root":
            animateTrails(element, timeline, growDuration, growDelay);
            break;
        case "soil":
            gsap.set(element, {opacity: 0});
            animatePlantComponent(element, timeline, growDuration, growDelay, "opacity");
            break;
        case "background":
            gsap.set(element, {opacity: 0});
            animatePlantComponent(element, timeline, growDuration, growDelay, "opacity");
            break;
        case "seed":
            gsap.set(element, {opacity: 0});
            animatePlantComponent(element, timeline, growDuration, growDelay, "opacity");
            break;
    }
    return element;
}


// Anima las raices y tallos que esta conformados por elementos admitidos por drawSVG  
function animateTrails(stem, timeline, growDuration, growDelay) {
    timeline.from(stem.querySelectorAll("path,rect,ellipse,line,polyline"), {
        drawSVG: 0,
        duration: growDuration,
    }, `start+=${growDelay}`);
    const poligons = stem.querySelectorAll("polygon");
    if(poligons.length != 0){
        timeline.fromTo(stem.querySelectorAll("polygon"), {
            opacity: 0,
        }, { opacity: 1, duration: growDuration, stagger: 0.05 }, `start+=${growDelay}`);
    }
   
}

// Anima un componente siguiendo una estrategia dada
function animatePlantComponent(component, timeline, growDuration, growDelay, animationStrategy) {
    switch (animationStrategy) {
        case "opacity":
            timeline.to(component, { opacity: 1, duration: growDuration }, `start+=${growDelay}`);
            break;
        case "scale":

            timeline.to(component, { scale: 1, duration: growDuration }, `start+=${growDelay}`);
            break;
        default:
            break;
    }

}

// Crea los elementos de la planta
function createElements(configuration, plantSuffix, initialPosition, garden) {
    let plant = document.createElementNS(ns, "g");
    plant.setAttribute("id", plantSuffix);
    for (const shape of configuration.shapes) {
        createSvgElement(plant, shape, plantSuffix);
    }
    garden.appendChild(plant);
    const rawOffset = configuration.offset
    const offset = {
        x: rawOffset !== null ? rawOffset.x : 0,
        y: rawOffset !== null ? rawOffset.y : 0,
    }
    const totalOffset = {
        x: initialPosition.x + offset.x,
        y: initialPosition.y + offset.y,
    }



    initTransformElements(configuration, plant, totalOffset);

    return plant
}

// Inicia las propiedades iniciales de la planta
function initTransformElements(configuration, plant, totalOffset) {
    let options = {
        x: totalOffset.x,
        y: totalOffset.y,
        scaleX: configuration.scale,
        scaleY: configuration.scale
    }
        options.transformOrigin = `50% 0%`;
    gsap.set(plant, options);
}



// Crea los elementos SVG
function createSvgElement(parent, shape, suffix) {
    let element = document.createElementNS(ns, shape.type);
    setAttributes(element, shape.attr);
    if (!element.hasAttribute("id")) {
        const id = _.uniqueId(`${suffix}_${shape.type}`);
        element.setAttribute("id", id);
    }
    if (shape.shapes !== undefined && shape.shapes.length > 0) {
        let counter = 0;
        for (const innerShape of shape.shapes) {
            createSvgElement(element, innerShape, `${suffix}_${shape.type}_${counter}`);
        }
    }
    return parent.appendChild(element);
}

function setAttributes(element, attr) {
    for (const [key, value] of Object.entries(attr)) {
        element.setAttribute(key, value);
    }
}





