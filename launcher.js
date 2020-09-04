import * as WEBCAM from './webcamHandler.js'
import * as INTERFACE from './script.js' 
import * as FILTER from './OneEuroFilter.js'


var stats = new Stats();
stats.showPanel(0);

document.body.appendChild(stats.dom);

document.getElementById("addGraphButton").onclick = getNewGraph;

const slider = document.getElementById("myRange");


const scene = new INTERFACE.Scene();
const lpFilterPointerX = new FILTER.LowPassFilter(0.3);
const lpFilterPointerY = new FILTER.LowPassFilter(0.3);
const lpFilterThumbX = new FILTER.LowPassFilter(0.3);
const lpFilterThumbY = new FILTER.LowPassFilter(0.3);

slider.oninput = function () {
    document.getElementById("alphaText").textContent = "Alpha Value: " + this.value;
    lpFilterPointerX.setAlpha(this.value);
    lpFilterPointerY.setAlpha(this.value);
    lpFilterThumbX.setAlpha(this.value);
    lpFilterThumbY.setAlpha(this.value);
}
// scene.addToTimeLine(graph);
// scene.addToTimeLine(graph2);
// scene.addToTimeLine(graph3);
// scene.addToTimeLine(graph4);

const scatter = new INTERFACE.ScatterGraph([[0, 0], [50, 50], [100, 100], [200, 200], [230, 230], [250,250], [300, 300]], "Graph");
scene.addToTimeLine(scatter);

// const button = new INTERFACE.Button(40, 80, -100, -40, "Next");
// button.displayButton(scene);
// var objLoader = new THREE.OBJLoader();

// var loader = new GLTFLoader();

// console.log("BUZZ")
// loader.load( './Victoria.glb', function ( gltf ) {
//     console.log("CUZZ")

// 	scene.add( gltf.scene );

// }, undefined, function ( error ) {

// 	console.error( error );

// } );
// console.log("LUZZ")

//INTERFACE.render(renderer, scene, camera);

var loader = new THREE.GLTFLoader();
var modelVIC;
var modelNSW;
loader.load(
	// resource URL
	'victoria.glb',
	// called when the resource is loaded
	function ( gltf ) {
        modelVIC = gltf.scene;

        modelVIC.traverse((object) => {
            if (object.isMesh) {
                object.material.color.set( 0xFFCC00 )
            }
        })

        gltf.scene.rotation.x = 90;
        gltf.scene.position.x -= 100;
        console.log(gltf.scene);
		scene.addToScene( gltf.scene );

   })
    
    // loader.load(
    //     // resource URL
    //     'NSW.glb',
    //     // called when the resource is loaded
    //     function ( gltf ) {
    //         modelNSW = gltf.scene;
    
    //         modelNSW.traverse((object) => {
    //             if (object.isMesh) {
    //                 object.material.color.set( 0xFFCC00 )
    //             }
    //         })
    
    //         gltf.scene.rotation.y = 90;
    //         console.log(gltf.scene);
    //         scene.addToScene( gltf.scene );
    
    //     })




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
    // const graph = new INTERFACE.BarGraph([parseInt(document.getElementById('y1Val').value), 
    //                                      parseInt(document.getElementById('y2Val').value), 
    //                                      parseInt(document.getElementById('y3Val').value), 
    //                                      parseInt(document.getElementById('y4Val').value), 
    //                                      parseInt(document.getElementById('y5Val').value),
    //                                      parseInt(document.getElementById('y6Val').value),
    //                                      parseInt(document.getElementById('y7Val').value),
    //                                      parseInt(document.getElementById('y8Val').value)], 
    //                                      document.getElementById('graphTitle').value);
    
    // document.getElementById('graphTitle').value = "";
    // document.getElementById('y1Val').value = "";
    // document.getElementById('y2Val').value = "";
    // document.getElementById('y3Val').value = "";
    // document.getElementById('y4Val').value = "";
    // document.getElementById('y5Val').value = "";
    // document.getElementById('y6Val').value = "";
    // document.getElementById('y7Val').value = "";
    // document.getElementById('y8Val').value = "";

    const graph2 = new INTERFACE.BarGraph([630, 550, 369, 603, 352, 406, 687, 445, 422, 454, 373, 310, 322, 401, 257, 362, 298, 265, 271, 217, 208, 234, 169, 175, 202, 112, 148, 146, 112, 113], "Victoria COVID Cases");
    scene.addToTimeLine(graph2);

    const graph3 = new INTERFACE.BarGraph([2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 19, 13, 7, 13, 9, 12, 6, 5, 11, 6, 3, 9, 7, 5, 7, 12, 13, 2, 9, 14], "New Zealand COVID Cases");
    scene.addToTimeLine(graph3);
}
