// Lee el archivo JSON de las configuraciones de las plantas
function readJsonFile(path, field = "") {
    return fetch(path)
        .then(response => response.json())
        .then((json) => {
            if (field === "") {
                return json;
            }
            return json[field];
        })
}

// Carga las configurationes por tipo de planta para una misma emocion
function loadPlantTypeConfiguration(plantTypeconfiguration) {
    return loadPlantTypeShapes(plantTypeconfiguration);

}

// Construye las formas a partir de SVGs
function loadPlantTypeShapes(plantTypeconfiguration) {
    let processes = [];
    for (const plant of plantTypeconfiguration.plants) {
        processes.push(populatePlantShapes(plant));
    }
    // Las promesas son para expresar que la funcion terminara mas tarde
    return Promise.all(processes)
    .then(() => plantTypeconfiguration);
}


// Lee las formas dentro del SVG y las carga en un objeto JSON
function populatePlantShapes(plant) {
    return parseSvg(plant["source"])
        .then((group) => includeShapesOnPlant(plant, group));
}

// Carga los archivos SVG
function parseSvg(source) {
    return fetch(source)
        .then(response => response.text())
        .then(text => extractShapes(text, source))
}

// Lee el archivo SVG buscando los patrones de formas en el SVG
function extractShapes(text, source) {
    const re = /<((?:path|circle|rect|ellipse|line|polyline|polygon|\/?g)[^>]*)\/?>/g;
    const rawShapes = text.matchAll(re);
    let mainGroup = {
        "name": source.replace(/\.\/.+\//, "").replace(/\..+/, ""),
        "shapes": []
    }

    let innerGroups = [];
    let lastGroup = mainGroup;

    for (const rawShape of rawShapes) {
        if (rawShape.length < 2) {
            continue;
        }
        if (rawShape[1].startsWith("/g")) {
            lastGroup = innerGroups.pop();
            continue
        }
        if (rawShape[1].startsWith("g")) {
            innerGroups.push(lastGroup);
            tmpGroup = parseGroup(rawShape[1]);
            lastGroup.shapes.push(tmpGroup);
            lastGroup = tmpGroup;
            continue
        }

        let parsedShape = parseShape(rawShape[1]);
        lastGroup.shapes.push(parsedShape);
    }
    return lastGroup;
}

// Construye los grupos de formas (g)
function parseGroup(rawShape) {
    const rawAttr = rawShape.replaceAll(/ ([^= ]+)=/g, "%%%$1=");
    const attr = rawAttr.split("%%%");
    let group = {
        "type": attr[0],
        "shapes": [],
        "attr": {}
    };

    for (let i = 1; i < attr.length; i++) {
        const feat = attr[i].split("=");
        feat[1] = feat[1].replaceAll("\"", "");
        group["attr"][feat[0]] = feat[1].replaceAll("\"", "");
    }
    return group;
}


// Construye las formas
function parseShape(rawShape) {
    const rawAttr = rawShape.replaceAll(/ ([^= ]+)=/g, "%%%$1=").replaceAll("/","");
    const attr = rawAttr.split("%%%");
    let shape = {
        "type": attr[0],
        "attr": {}
    };

    for (let i = 1; i < attr.length; i++) {
        const feat = attr[i].split("=");
        feat[1] = feat[1].replaceAll("\"", "");
        shape["attr"][feat[0]] = feat[1].replaceAll("\"", "");
    }
    return shape;
}

// Añade las formas al objeto JSON final
function includeShapesOnPlant(configuration, shapeGroup) {
    configuration.name = shapeGroup.name;
    configuration.shapes = shapeGroup.shapes;
}


