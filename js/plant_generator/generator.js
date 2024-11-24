gsap.registerPlugin(DrawSVGPlugin);
gsap.config({ trialWarn: false });

const ns = "http://www.w3.org/2000/svg";


let garden = document.querySelector("#garden");

const emotion = localStorage.getItem("emotionKey");

const mainTimeline = gsap.timeline();
mainTimeline.addLabel("start", 0);
let timelines = [];

const mapTypeName = {
    "tallos": "stem",
    "Tallo": "stem",
    "Hojas": "leaf",
    "Flores": "flower"
}

function loadPlantTypeConfigurationFile(type) {
    const configuration = localStorage.getItem(`${type}_configuration`);
    if (configuration !== null) {
        console.log("loadedConfiguration", configuration);
        return Promise.resolve(configuration);
    }

    return readJsonFile(`./data/plant_configurations/${type}_configuration.json`)
        .then((data) => {
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
    const initialPositions = generateInitialPositions(minSeparation);
    const sampledPositions = _.sampleSize(initialPositions, numberOfPlants);
    for (let i = 0; i < numberOfPlants; i++) {
        generatePlant(i, sampledPositions[i], _.sample(configuration.plants));
    }
}

function generateInitialPositions(minSeparation) {
    let initialPositions = [];
    const viewBox = document.getElementById("garden").viewBox.baseVal;
    let currentX = 20 + _.random(10);
    while (currentX < viewBox.width - 300) {
        initialPositions.push({
            x: currentX,
            y: 0
        })
        currentX += _.random(minSeparation, minSeparation + 10);
    }
    return initialPositions;

}

function generatePlant(counter, initialPosition, configuration) {

    const plantSuffix = `${configuration.name}_${counter}`
    const plant = createElements(configuration, plantSuffix, initialPosition);

    for (const group of plant.children) {
        prepareElementForGrow(configuration, group);
        createElementGroupAnimation(configuration, group);
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

function createElementGroupAnimation(configuration, group) {
    const rawType = group.id;
    const type = mapTypeName[rawType];
    const groupConfiguration = configuration.components[type];
    if (groupConfiguration === null || groupConfiguration === undefined) {
        return
    }
    let timeline = initPlantTimeline();
    timeline.addLabel("start", 0);
    if (type === "stem") {
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
            animateStem(element, timeline, growDuration, growDelay);
            break;
        case "leaf":
            timeline.to("#empty1", { opacity: 0, duration: growDuration }, `start+=${growDelay}`)
            animatePlantComponent(element, timeline, growDuration, growDelay, animationStrategy);
            break;
        case "flower":
            timeline.to("#empty2", { opacity: 0, duration: growDuration }, `start+=${growDelay}`)
            animatePlantComponent(element, timeline, growDuration, growDelay, animationStrategy);
            break;
    }
    return element;
}


function animateStem(stem, timeline, growDuration, growDelay) {
    console.log("stem parts", stem.querySelectorAll("polygon"));
    timeline.from(stem.querySelectorAll("path,rect,ellipse,line,polyline"), {
        drawSVG: 1,
        duration: growDuration,
    }, `start+=${growDelay}`);
    timeline.fromTo(stem.querySelectorAll("polygon"), {
        opacity: 0,
    }, {opacity: 1, duration: growDuration,  stagger: 0.05}, `start+=${growDelay}`);
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

function createElements(configuration, plantSuffix, initialPosition) {
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





