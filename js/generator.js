gsap.registerPlugin(DrawSVGPlugin);
gsap.config({ trialWarn: false });

const ns = "http://www.w3.org/2000/svg";


let stems = document.querySelector("#stems");
let leaves = document.querySelector("#leaves");
let flowers = document.querySelector("#flowers");
let garden = document.querySelector("#garden");

const emotion = localStorage.getItem("emotionKey");

initPlantConfiguration()
    .then(() => populatePlantSchemas([examplePlantConfiguration]))
    .then(() => generate())


function generate(){
    const numberOfPlants = examplePlantConfiguration.plants;
    const minSeparation = examplePlantConfiguration.min_separation;
    const growDuration = examplePlantConfiguration.grow_duration;
    const initialPositions = generateInitialPositions(minSeparation);
    const sampledPositions = _.sampleSize(initialPositions, numberOfPlants);
    for(let i=0; i< numberOfPlants; i++){
        generatePlant(i, sampledPositions[i], growDuration);
    }
}

function generateInitialPositions(minSeparation){
    let initialPositions = [];
    const viewBox = document.getElementById("garden").viewBox.baseVal;
    let currentX = viewBox.width * 0.15 + _.random(10);
    while(currentX < viewBox.width * 0.85){
        initialPositions.push({
            x: currentX,
            y: 0
        })
        currentX += _.random(minSeparation, minSeparation + 10);
    }
    return initialPositions;
    
}

function generatePlant(counter, initialPosition, growDuration) {

    const plantSuffix = `example_${counter}`
    const stemElements = createStem(plantSuffix, initialPosition);
    const leavesElements = createLeaves(plantSuffix, stemElements[0].points);
    const flowerElements = createFlowers(plantSuffix, stemElements[0].points);
    const allElements = leavesElements.concat(flowerElements);
    gsap.from(stemElements[0].element, {
        drawSVG: 0,
        duration: growDuration
      });
    for(let plantElement of allElements){
        gsap.from(plantElement.element, 1, { scale: 0,  delay: growDuration });
    }
    return stemElements;
}

function createStem(plantSuffix, initialPosition) {

    const stemConfiguration = examplePlantConfiguration.components.stem;

    const template = _.sample(stemConfiguration.templates);
    const id = `${plantSuffix}_stem_${template.name}`;
    const stem = createSvgElement(stems, template, id);

    const totalOffset = {
        x: initialPosition.x + template.offset.x,
        y: initialPosition.y + template.offset.y,
    }
    initTransformElement(stem, template, totalOffset);
    initColors(stem, stemConfiguration.colors);

    return [{
        "element": stem,
        "type": "stem",
        "points": pathToCoords(stem, totalOffset, template.scale)
    }]
}

function createFlowers(plantSuffix, stemPoints){
    const flowerConfiguration = examplePlantConfiguration.components.flower;
    const template = _.sample(flowerConfiguration.templates);
    const id = `${plantSuffix}_flower_${template.name}`;
    const flower = createSvgElement(flowers, template, id);


    const initialPosition = calculateFlowerInitialPosition(stemPoints);
    const totalOffset = {
        x: initialPosition.x + template.offset.x,
        y: initialPosition.y + template.offset.y,
    }
    initTransformElement(flower, template, totalOffset);
    initColors(flower, flowerConfiguration.colors);
    
    return [{
        "element": flower,
        "type": "flower",
    }]
}

function calculateFlowerInitialPosition(stemPoints) {
    
    const point = stemPoints[stemPoints.length - 1];
    return {
        x: point.x,
        y: point.y
    }
}

function createLeaves(plantSuffix, stemPoints) {
    const numberOfLeaves = examplePlantConfiguration.leaves_per_plant;

    const leavesElements = [];
    const leafConfiguration = examplePlantConfiguration.components.leaf;
    for (let i = 0; i < numberOfLeaves; i++) {
        const template = _.sample(leafConfiguration.templates);
        const id = `${plantSuffix}_leave_${i}`;
        const leaf = createSvgElement(leaves, template, id);


        leavesElements.push(
            {
                "element": leaf,
                "type": "leaf"
            });
        const initialPosition = calculateLeafinitialPosition(template.distribution, stemPoints);
        const totalOffset = {
            x: initialPosition.x + template.offset.x,
            y: initialPosition.y + template.offset.y,
        }
        initTransformElement(leaf, template, totalOffset);
        initColors(leaf, leafConfiguration.colors);
    }

    return leavesElements
}

function calculateLeafinitialPosition(distribution, stemPoints) {
    const sideDistribution = _.sample(Object.entries(distribution))[1];
    const values = _.sample(sideDistribution)
    const pointIndex = Math.ceil((stemPoints.length - 1) * values.relative_position/100);
    
    const point = stemPoints[pointIndex];
    return {
        x: point.x + values.offset.x,
        y: point.y + values.offset.y
    }
}

function initTransformElement(element, template, totalOffset) {
    let options =  {
        x: totalOffset.x,
        y: totalOffset.y,
        scaleX: template.scale,
        scaleY: template.scale,
        rotation: _.random(template.rotation.min, template.rotation.max)
    }
    if(Object.hasOwn(template, "origin")){
        options.transformOrigin = `${template.origin.x_percent}% ${template.origin.y_percent}%`;
    }
    gsap.set(element, options);
}

function initColors(element, colors){
    if(element.children.length > 0){
        for(let child of element.children){
            gsap.set(child, {attr: {"fill": _.sample(colors)}});
        }
        return
    }
    gsap.set(element, {attr: {"fill": _.sample(colors)}});
    
}

function createSvgElement(parent, template, id) {
    if (template["shapes"].length > 1) {
        return createComposedSvgElement(parent, template, id);
    }
    return createSimpleSvgElement(parent, template, id);
}

function createSimpleSvgElement(parent, template, id) {
    const shape = template["shapes"][0];
    let element = document.createElementNS(ns, shape.type);
    setAttributes(element, shape.attr);
    element.setAttribute("id", id);
    return parent.appendChild(element);
}

function createComposedSvgElement(parent, template, id) {
    let group = document.createElementNS(ns, "g");
    template.shapes.forEach(shape => {
        const element = document.createElementNS(ns, shape.type);
        setAttributes(element, shape.attr);
        group.append(element);
    });
    group.setAttribute("id", id);
    return parent.appendChild(group);
}

function setAttributes(element, attr) {
    for (const [key, value] of Object.entries(attr)) {
        element.setAttribute(key, value);
    }
}

function pathToCoords(path, totalOffset, scale) {

    const numSamples = 100;
    const step = Math.ceil(path.getTotalLength() / numSamples)

    let points = [];
    for (let i = 0; i < numSamples; i++) {
        let point = path.getPointAtLength(i * step);
        points.push({ x: (point.x + totalOffset.x), y: (point.y + totalOffset.y) });
    }
    return points;
}




