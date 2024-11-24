let examplePlantConfiguration = {};
let emotions = {};

function initPlantConfiguration() {
    return readJsonFile(localStorage.getItem("plant_source"))
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
    "esperanza-variacion-2": getComputedStyle(document.body).getPropertyValue("--esperanza-variacion-2"),
    "esperanza-variacion-3": getComputedStyle(document.body).getPropertyValue("--esperanza-variacion-3"),
    "esperanza-variacion-4": getComputedStyle(document.body).getPropertyValue("--esperanza-variacion-4"),

    "alegria-variacion-1": getComputedStyle(document.body).getPropertyValue("--alegria-variacion-1"),
    "alegria-variacion-2": getComputedStyle(document.body).getPropertyValue("--alegria-variacion-2"),
    "alegria-variacion-3": getComputedStyle(document.body).getPropertyValue("--alegria-variacion-3"),
    "alegria-variacion-4": getComputedStyle(document.body).getPropertyValue("--alegria-variacion-4"),

    "calma-variacion-1": getComputedStyle(document.body).getPropertyValue("--calma-variacion-1"),

    "tristeza-variacion-1": getComputedStyle(document.body).getPropertyValue("--tristeza-variacion-1"),

    "rabia-variacion-1": getComputedStyle(document.body).getPropertyValue("--rabia-variacion-1"),

    "ansiedad-variacion-1": getComputedStyle(document.body).getPropertyValue("--ansiedad-variacion-1"),
}


