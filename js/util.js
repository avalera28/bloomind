// Inicializa las templates del archivo
function readJsonFile(path, field = "") {
    return fetch(path)
    .then(response => response.json())
    .then((json) => {
        if(field === ""){
            return json;
        }
        return json[field];
    })
}

function pathToCoords(){
    return [];
}

function populatePlantSchemas(schemas){
    let processes = [];
    for (let schema of schemas){
        processes.push(populatePlantSchema(schema));
    }
    return Promise.all(processes);
}

function populatePlantSchema(schema){
    let processes = [];
    for (const [key, value] of Object.entries(schema["components"])) {
        processes.push(populateTemplates(value));
    }
    return Promise.all(processes);
}

function populateTemplates(component){
    if(component.hasOwnProperty('templates')){
        let shapeGroups = [];
        for(let template of component["templates"]){
            shapeGroups.push(parseSvg(template["source"]));
        }
        return Promise.all(shapeGroups)
        .then((groups) => includeShapesOnTemplates(component["templates"], groups))
        .then(() => populateComponentColors(component, allColors));
    }
    return Promise.resolve(null);
}


function parseSvg(source){
    return fetch(source)
    .then(response => response.text())
    .then(text => extractShapes(text, source))
}

function extractShapes(text, source){
    const re = /<((?:path|circle|rect|ellipse|line|polyline|poligon) [^>]+)\/>/g;
    const rawShapes = text.matchAll(re);
    let shapeGroup = {
        "source": source,
        "shapes": []
    }
    for (const rawShape of rawShapes){
        if(rawShape.length < 2){
            continue;
        }
        let parsedShape = parseShape(rawShape[1]);
        shapeGroup.shapes.push(parsedShape);
    }
    return shapeGroup;
}

function parseShape(rawShape){
    const rawAttr = rawShape.replaceAll(/ ([^= ]+)=/g, "%%%$1=");
    const attr = rawAttr.split("%%%");
    let shape = {
        "type": attr[0],
        "attr": {}
    };

    for(let i=1; i < attr.length; i++){
        const feat = attr[i].split("=");
        feat[1] = feat[1].replaceAll("\"","");
        if(feat[1] !== "fill" && feat[1] !== "class" && feat[1] !== "stroke"){
            shape["attr"][feat[0]] = feat[1].replaceAll("\"","");
        }
    }
    return shape;
}

function includeShapesOnTemplates(templates, shapeGroups){
    let groupMap = {}
    
    for(let group of shapeGroups){
        groupMap[group["source"]] = group["shapes"]
    }
    for(let template of templates){
        template["shapes"] =  groupMap[template["source"]];
        template["name"] = template["source"].replace(/\.\/.+\//, "").replace(/\..+/, "");
    }
}

function populateComponentColors(component, allColors){
    component.colors = [];
    for(let [key, value] of Object.entries(allColors)){
        if(key.includes(`${component.color_palette}-variacion`)){
            component.colors.push(value);
        }
    }
    
}

