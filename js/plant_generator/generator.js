gsap.registerPlugin(DrawSVGPlugin);
gsap.config({ trialWarn: false });

const ns = "http://www.w3.org/2000/svg";

let globalConfig = {
}

const emotion = localStorage.getItem("emotionKey");

const mainTimeline = gsap.timeline();
mainTimeline.addLabel("start", 0);
let timelines = [];

const mapTypeName = {
    "tallos": "stem",
    "Tallo": "stem",
    "Hojas": "leaf",
    "Flores": "flower",
    "Semilla": "seed",
    "Suelo": "soil",
    "Raices": "root",
    "Fondo": "background"
}

function loadPlantTypeConfigurationFile(type) {
    const configuration = localStorage.getItem(`${type}_configuration`);
    if (configuration !== null) {
        console.log("loadedConfiguration", configuration);
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


function generate(configuration) {
    const numberOfPlants = configuration.number_plants;
    const minSeparation = configuration.min_separation;
    const svgGarden = document.getElementById("garden");
    const initialPositions = generateInitialPositions(minSeparation, svgGarden);
    const sampledPositions = _.sampleSize(initialPositions, numberOfPlants);
    const plantConfiguration = _.sample(configuration.plants);

    for (let i = 0; i < numberOfPlants; i++) {
        generatePlant(i, sampledPositions[i], plantConfiguration, svgGarden);
    }


    generateSinglePlant(plantConfiguration, true);
}

function generateSinglePlant(plantConfiguration, animateGlobalComponents) {


    const svgGarden = document.getElementById("plant_anatomy-img");
    const viewBox = svgGarden.viewBox.baseVal;

    const position = {
        "x": viewBox.width / 4,
        "y": 0
    }
    plantConfiguration.scale = 3;
    generatePlant(5, position, plantConfiguration, svgGarden, animateGlobalComponents);
}

function generateInitialPositions(minSeparation, garden) {
    let initialPositions = [];
    const viewBox = garden.viewBox.baseVal;
    let currentX = minSeparation/4;
    while (currentX < viewBox.width - minSeparation) {
        initialPositions.push({
            x: currentX,
            y: 0
        })
        currentX += _.random(minSeparation, minSeparation + 10);
    }
    return initialPositions;

}

function generatePlant(counter, initialPosition, configuration, garden, animateGlobalComponents = false) {

    const plantSuffix = `${configuration.name}_${counter}`
    const plant = createElements(configuration, plantSuffix, initialPosition, garden);

    for (const group of plant.children) {
        prepareElementForGrow(configuration, group);
        createElementGroupAnimation(configuration, group, animateGlobalComponents);
    }

    mainTimeline.play();

}

function initPlantTimeline() {
    return gsap.timeline()
}

function prepareElementForGrow(configuration, group) {
    const type = group.id;
    const groupConfiguration = configuration.components[mapTypeName[type]];
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

function createElementGroupAnimation(configuration, group, animateGlobalComponents) {
    const rawType = group.id;
    const type = mapTypeName[rawType];
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

    const groupConfiguration = overridedConfiguration.components[type];
    if (groupConfiguration === null || groupConfiguration === undefined) {
        return
    }
    let timeline = initPlantTimeline();
    timeline.addLabel("start", 0);
    if (type === "stem" || type === "soil" || type === "background" || type === "seed" || type === "root") {

        createElementAnimation(groupConfiguration, timeline, type, group);
    }
    else {
        for (const upperElement of group.children) {
            createElementAnimation(groupConfiguration, timeline, type, upperElement);
        }
    }

    mainTimeline.add(timeline, "start");
}

function createElementAnimation(configuration, timeline, type, element) {

    const growDuration = configuration.grow_duration;
    const growDelay = configuration.grow_delay;
    const animationStrategy = configuration.animation_strategy;

    switch (type) {
        case "stem":
            timeline.to("#empty0", { opacity: 0, duration: growDuration }, `start+=${growDelay}`)
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



function animateTrails(stem, timeline, growDuration, growDelay) {   
    timeline.from(stem.querySelectorAll("path,rect,ellipse,line,polyline"), {
        drawSVG: 1,
        duration: growDuration,
    }, `start+=${growDelay}`);
    timeline.fromTo(stem.querySelectorAll("polygon"), {
        opacity: 0,
    }, { opacity: 1, duration: growDuration, stagger: 0.05 }, `start+=${growDelay}`);
}

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

function initTransformElements(configuration, plant, totalOffset) {
    let options = {
        x: totalOffset.x,
        y: totalOffset.y,
        scaleX: configuration.scale,
        scaleY: configuration.scale
    }
    if (Object.hasOwn(configuration, "origin")) {
        options.transformOrigin = `${configuration.origin.x_percent}% ${configuration.origin.y_percent}%`;
    }
    gsap.set(plant, options);
}




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





