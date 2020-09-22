import * as WEBCAM from './webcamHandler.js'
import * as INTERFACE from './script.js' 
import * as FILTER from './OneEuroFilter.js'


var stats = new Stats();
stats.showPanel(0);

document.body.appendChild(stats.dom);


const slider = document.getElementById("myRange");

const filters = [...Array(21).keys()].map((_ => [new FILTER.LowPassFilter(0.5), new FILTER.LowPassFilter(0.5), new FILTER.LowPassFilter(0.5)]));


const scene = new INTERFACE.Scene();

slider.oninput = function () {
    document.getElementById("alphaText").textContent = "Alpha Value: " + this.value;

    filters.forEach(filter => filter.forEach(filter_inner => filter_inner.setAlpha(this.value)));
}


// const graph = new INTERFACE.LineGraphMulti([[["Jan", 12], ["Fev", 15], ["March", 53], ["April", 1], ["May", 21], ["June", 19], ["July", 22], ["August", 54], ["September", 71], ["October", 345], ["November", 19], ["December", 22]], 
//                                             [["Jan", 100], ["Fev", 300], ["March", 22], ["April", 1], ["May", 345], ["June", 19], ["July", 22], ["August", 22], ["September", 14], ["October", 345], ["November", 75], ["December", 22]], 
//                                             [["Jan", 21], ["Fev", 34], ["March", 75], ["April", 1], ["May", 22], ["June", 45], ["July", 22], ["August", 22], ["September", 17], ["October", 345], ["November", 19], ["December", 14]], 
//                                             [["Jan", 32], ["Fev", 15], ["March", 22], ["April", 1], ["May", 345], ["June", 45], ["July", 22], ["August", 282], ["September", 1], ["October", 345], ["November", 19], ["December", 22]],
//                                             [["Jan", 53], ["Fev", 214], ["March", 22], ["April", 1], ["May", 44], ["June", 19], ["July", 22], ["August", 22], ["September", 19], ["October", 43], ["November", 22], ["December", 11]]], 
//                                             "Multiline Line Graph", ["Australia", "Asia", "Africa", "North America", "Europe"])
// scene.addToTimeLine(graph);

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
    stats.begin();
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
    stats.end();
}

function animate () {
    requestAnimationFrame(animate);

    scene.renderer.render(scene.scene, scene.camera);

}

animate();

export function addGraphFromFile(graphData, title, type) {
    let graph;
    if (type === 'bar') {
        graph = new INTERFACE.BarGraph(graphData, title)
    } else if (type === 'scatter') {
        graph = new INTERFACE.ScatterGraph(graphData, title)
    } else if (type === 'line') {
        graph = new INTERFACE.LineGraph(graphData, title)
    } else if (type === "australia") {
        graph = new INTERFACE.Australia(graphData, title)
    } else if (type === "multiLine") {
        graph = new INTERFACE.LineGraphMulti(graphData[1][0], title, graphData[0])
    }
    
    scene.addToTimeLine(graph)
}