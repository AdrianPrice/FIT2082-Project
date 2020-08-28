import * as WEBCAM from './webcamHandler.js'
import * as INTERFACE from './script.js' 
import * as FILTER from './OneEuroFilter.js'


var stats = new Stats();
stats.showPanel(0);

document.body.appendChild(stats.dom);

document.getElementById("addGraphButton").onclick = getNewGraph;

// /*
// ADD AR ELEMENTS TO SCENE
// */
// const scene = INTERFACE.createScene();

// const camera = INTERFACE.createCamera();

// const light = INTERFACE.createLight();
// INTERFACE.addToScene(scene, light);

// const renderer = INTERFACE.createRenderer();

//INTERFACE.createTileInterface(scene);

//INTERFACE.createRandomBarGraph(scene);


// const graph = new INTERFACE.BarGraph([60, 100, 140, 180, 220, 260, 240, 120]);

// const graph2 = new INTERFACE.BarGraph([150, 130, 140, 180, 100, 200, 240, 120]);

// const graph3 = new INTERFACE.BarGraph([100, 100, 100, 100, 100, 100, 100, 100]);

// const graph4 = new INTERFACE.BarGraph([200, 200, 200, 200, 100, 200, 200, 200]);

const scene = new INTERFACE.Scene();
const lpFilterPointerX = new FILTER.LowPassFilter(0.3);
const lpFilterPointerY = new FILTER.LowPassFilter(0.3);
const lpFilterThumbX = new FILTER.LowPassFilter(0.3);
const lpFilterThumbY = new FILTER.LowPassFilter(0.3);
// scene.addToTimeLine(graph);
// scene.addToTimeLine(graph2);
// scene.addToTimeLine(graph3);
// scene.addToTimeLine(graph4);

// const button = new INTERFACE.Button(40, 80, -100, -40, "Next");
// button.displayButton(scene);


//INTERFACE.render(renderer, scene, camera);


startTracking();

// var box = INTERFACE.createSimpleBox(0, 0, 100, 20, 10);
// scene.addToScene(box);
// box = INTERFACE.createSimpleBox(20, 0, 120, 20, 10);
// scene.addToScene(box);
// box = INTERFACE.createSimpleBox(40, 0, 140, 20, 10);
// scene.addToScene(box);
// box = INTERFACE.createSimpleBox(60, 0, 150, 20, 10);
// scene.addToScene(box);
// box = INTERFACE.createSimpleBox(80, 0, 150, 20, 10);
// scene.addToScene(box);
// box = INTERFACE.createSimpleBox(100, 0, 80, 20, 10);
// scene.addToScene(box);
// box = INTERFACE.createSimpleBox(120, 0, 90, 20, 10);
// scene.addToScene(box);
// box = INTERFACE.createSimpleBox(140, 0, 130, 20, 10);
// scene.addToScene(box);


let pointerString = document.createElement('p');
pointerString.textContent = "Pointer Position: Loading...";

document.body.appendChild(pointerString);

const video = document.querySelector("#webcamDisplay")
var model = 0

async function startTracking() {

    model = await handpose.load();

    WEBCAM.startWebcam();



    //const track = setInterval(trackHand(model, video), 1000);
    setInterval(trackHand, 10);
    //startTracking(video);

}

async function trackHand() {
    stats.begin();
    if (model != 0) {
        const hands = await model.estimateHands(video);

        try {
            pointerString.textContent = "Hand Detected";
            pointerString.style.color = "green";
            //pointerString.textContent = "Position: " + lpFilter.filter((-1 * (hands[0].landmarks[8][0] - 320)));
            INTERFACE.fingerPositionProcessor(lpFilterPointerX.filter((-1 * (hands[0].landmarks[8][0] - 320))), lpFilterPointerY.filter((-1 * (hands[0].landmarks[8][1] - 240))), lpFilterThumbX.filter((-1 * (hands[0].landmarks[4][0] - 320))), lpFilterThumbY.filter((-1 * (hands[0].landmarks[4][1] - 240))));
            // box.position.x = lpFilterX.filter((-1 * (hands[0].landmarks[8][0] - 320)) + 320) - 320;
            // box.position.y = lpFilterY.filter((-1 * (hands[0].landmarks[8][1] - 240)) + 240) - 240;

            // box2.position.x = (-1 * (hands[0].landmarks[8][0] - 320));
            // box2.position.y = (-1 * (hands[0].landmarks[8][1] - 240));


            //console.log("STD:",((-1 * (hands[0].landmarks[8][0] - 320)), (-1 * (hands[0].landmarks[8][1] - 240))));
            //console.log("LP:",(lpFilter.filter((-1 * (hands[0].landmarks[8][0] - 320))), lpFilter.filter((-1 * (hands[0].landmarks[8][1] - 240)))))
        } catch {
            pointerString.textContent = "No Hand Detected";
            pointerString.style.color = "red";
            INTERFACE.fingerPositionProcessor(1000000000, 1000000000)
        }
    }
    stats.end();
}

function animate () {
    requestAnimationFrame(animate);

    scene.renderer.render(scene.scene, scene.camera);

}

animate();

function getNewGraph() {
    const graph = new INTERFACE.BarGraph([parseInt(document.getElementById('y1Val').value), 
                                         parseInt(document.getElementById('y2Val').value), 
                                         parseInt(document.getElementById('y3Val').value), 
                                         parseInt(document.getElementById('y4Val').value), 
                                         parseInt(document.getElementById('y5Val').value),
                                         parseInt(document.getElementById('y6Val').value),
                                         parseInt(document.getElementById('y7Val').value),
                                         parseInt(document.getElementById('y8Val').value)], 
                                         document.getElementById('graphTitle').value);
    
    document.getElementById('graphTitle').value = "";
    document.getElementById('y1Val').value = "";
    document.getElementById('y2Val').value = "";
    document.getElementById('y3Val').value = "";
    document.getElementById('y4Val').value = "";
    document.getElementById('y5Val').value = "";
    document.getElementById('y6Val').value = "";
    document.getElementById('y7Val').value = "";
    document.getElementById('y8Val').value = "";

    const graph2 = new INTERFACE.BarGraph([630, 550, 369, 603, 352, 406, 687, 445, 422, 454, 373, 310, 322, 401, 257, 362, 298, 265, 271, 217, 208, 234, 169, 175, 202, 112, 148, 146, 112, 113], "Vic Second Wave");
    scene.addToTimeLine(graph2);
}
