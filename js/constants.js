let examplePlantConfiguration = {};
let emotions = {};

function initPlantConfiguration() {
    return readJsonFile("./data/example_plant_configuration.json")
    .then((data) => {
        examplePlantConfiguration = data;
        return true;
    })
}

function initEmotions() {
    return readJsonFile("./data/emotions.json", "data")
    .then((data) => {
        emotions = data;
        return true;
    })
}

// Conversión de colores de CSS a código
const allColors = {

    /* Variaciones y Gradientes Emocionales */
    "esperanza-variacion-1": getComputedStyle(document.body).getPropertyValue("--esperanza-variacion-1"),

    "alegria-variacion-1": getComputedStyle(document.body).getPropertyValue("--alegria-variacion-1"),

    "calma-variacion-1": getComputedStyle(document.body).getPropertyValue("--calma-variacion-1"),

    "tristeza-variacion-1": getComputedStyle(document.body).getPropertyValue("--tristeza-variacion-1"),

    "rabia-variacion-1": getComputedStyle(document.body).getPropertyValue("--rabia-variacion-1"),

    "ansiedad-variacion-1": getComputedStyle(document.body).getPropertyValue("--ansiedad-variacion-1"),
}


