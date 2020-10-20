import * as WEBCAM from './webcamHandler.js'
import * as INTERFACE from './script.js' 
import * as FILTER from './OneEuroFilter.js'


//var stats = new Stats();
//stats.showPanel(0);

//document.body.appendChild(stats.dom);

// document.getElementById("exit").onclick = hideWelcome;
const slider = document.getElementById("myRange");

const filters = [...Array(21).keys()].map((_ => [new FILTER.LowPassFilter(0.5), new FILTER.LowPassFilter(0.5), new FILTER.LowPassFilter(0.5)]));


const scene = new INTERFACE.Scene();

slider.oninput = function () {
    document.getElementById("alphaText").textContent = "Alpha Value: " + this.value;

    filters.forEach(filter => filter.forEach(filter_inner => filter_inner.setAlpha(this.value)));
}

startTracking();


let pointerString = document.createElement('p');
pointerString.setAttribute("id", "handDetected")
pointerString.textContent = "Pointer Position: Loading...";

document.body.appendChild(pointerString);

const video = document.querySelector("#webcamDisplay")
var model = 0

async function startTracking() {

    model = await handpose.load();

    WEBCAM.startWebcam();



    setInterval(trackHand, 1);
}

async function trackHand() {
   //stats.begin();
    if (model != 0) {
        const hands = await model.estimateHands(video);

        try {
            pointerString.textContent = "Hand Detected";
            pointerString.style.color = "green";
            
            INTERFACE.fingerPositionProcessor(scene,
                hands[0].landmarks
                    .map((xyz, outer_index) => 
                                    [-1 * (xyz[0] - 320), -1 * (xyz[1] - 240), xyz[2]]
                                        .map((elem, inner_index) => filters[outer_index][inner_index].filter(elem))));
            
        } catch (err){
            pointerString.textContent = "No Hand Detected";
            pointerString.style.color = "red";
            console.log(err.stack)
        }
    }
    //stats.end();
}

function animate () {
    requestAnimationFrame(animate);

    scene.renderer.render(scene.scene, scene.camera);

}

animate();

export function addGraphFromFile(graphData, title, type) {
    let graph;
    console.log(graphData)
    if (type === 'bar') {
        graph = new INTERFACE.BarGraph(graphData[0], title, graphData[1])
    } else if (type === 'scatter') {
        graph = new INTERFACE.ScatterGraph(graphData, title)
    } else if (type === 'line') {
        graph = new INTERFACE.LineGraph(graphData[0], title, graphData[1])
    } else if (type === "australia") {
        graph = new INTERFACE.Australia(graphData, title)
    } else if (type === "multiLine") {
        graph = new INTERFACE.LineGraphMulti(graphData[1][0], title, graphData[0], graphData[2])
    }
    
    scene.addToTimeLine(graph)
}

function hideWelcome() {
    document.getElementById("welcomePage").style.visibility = "hidden";
    document.getElementById("message").style.visibility = "hidden";
    document.getElementById("exit").style.visibility = "hidden";
}