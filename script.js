import * as LAUNCHER from './launcher.js'    

const objects = [];

export class Scene {
    constructor() {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer();
        this.light = this.createLight();
        this.timeLine = new TimeLine(this);
        this.nextButton = new Button(40, 80, 270, -125, "Next", this);
        
        this.buttonHidden = true;
    }

    /**
     * Creates a scene from the three.js library
     */
    createScene() {
        return new THREE.Scene();
    }

    /**
     * Creates a new camera object
     */
    createCamera() {
        const camera = new THREE.PerspectiveCamera(75, 640/480, 0.1, 2000);
        camera.position.z = 318;

        return camera;
    }

    /**
     * Creates a new renderer object
     */
    createRenderer() {
        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        renderer.setClearColor("#e5e5e5", 0);
        renderer.setSize(640, 480);

        document.body.appendChild(renderer.domElement);

        return renderer
    }

    addToScene(elem) {
        this.scene.add(elem);
        this.scene.matrixWorldNeedsUpdate = true;
        this.renderer.render(this.scene, this.camera);
    }

    addGraph(graph) {
        graph.display(this);
    }
    
    removeFromScene(elem) {
        this.scene.remove(elem);
    }

    createLight() {
        var light = new THREE.PointLight(0xFFFFFF, 1, 7000);
        light.position.set(0, 0, 300);

        this.scene.add(light);
    
        return light;
    }

    addToTimeLine(graph) {
        this.timeLine.addToTimeLine(graph);

        if (this.buttonHidden) {
            this.nextButton.display(this);
            this.buttonHidden = false;
        }
    }

    nextPane() {
        if (this.timeLine.next()) {
            this.button.hide(this);
            this.buttonHidden = true;
        };
    }
}



export function createSimpleBox(posX, posY, height = .8, width = 1, depth = .4) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = posX;
    mesh.position.y = posY;

    return mesh;
}

export function createRandomBarGraph(scene) {
    let height = Math.random() * 250 + 20;
    let box = createSimpleBox(50, - 50 + height / 2, height, 30, 10);
    addToScene(scene, box);

    height = Math.random() * 250 + 20;
    box = createSimpleBox(90, - 50 + height / 2, height, 30, 10);
    addToScene(scene, box);

    height = Math.random() * 250 + 20;
    box = createSimpleBox(130, - 50 + height / 2, height, 30, 10);
    addToScene(scene, box);

    height = Math.random() * 250 + 20;
    box = createSimpleBox(170, - 50 + height / 2, height, 30, 10);
    addToScene(scene, box);

    height = Math.random() * 250 + 20;
    box = createSimpleBox(210, - 50 + height / 2, height, 30, 10);
    addToScene(scene, box);

    height = Math.random() * 250 + 20;
    box = createSimpleBox(250, - 50 + height / 2, height, 30, 10);
    addToScene(scene, box);

    height = Math.random() * 250 + 20;
    box = createSimpleBox(290, - 50 + height / 2, height, 30, 10);
    addToScene(scene, box);

}

export class TimeLine {
    constructor(scene) {
        this.timeLine = [];
        this.index = -1;
        this.scene = scene;
    }

    addToTimeLine(graph) {
        this.timeLine.push(graph);
    }

    next() {
        if (this.index + 1 < this.timeLine.length) {
            if (this.index === -1) {
                this.index += 1;

                this.timeLine[this.index].display(this.scene);
            } else {
                this.timeLine[this.index].hide(this.scene);
                
                this.index += 1;

                this.timeLine[this.index].display(this.scene);
            }

            if (this.index === this.timeLine.length - 1) {
                return true;
            }
        }

        return false;
    }
}

export class BarGraph {
    constructor(yValues, title) {
        this.title = document.createElement('h2');
        this.formatTitle(title, Math.max.apply(Math, yValues));

        this.yValues = yValues;
        this.graph = this.createBarGraph(yValues);
    }

    createBarGraph(yValues) {
        return yValues.map((elem, index) => new Bar(elem, index));
    }

    display(scene) {
        this.graph.forEach((shape) => shape.display(scene));
        this.title.style.visibility = "visible";
    }

    hide(scene) {
        this.graph.forEach((shape) => shape.hide(scene));
        this.title.style.visibility = "hidden";
    }

    formatTitle(title, maxY) {
        this.title.textContent = title;
        this.title.style.position = "absolute";
        this.title.style.top =  (240 - maxY) + "px";
        this.title.style.left = (450 - (8 * title.length)) + "px";
        this.title.style.textAlign = "center";
        this.title.style.color = "black";
        this.title.style.fontSize = "32px";
        this.title.style.zIndex = "1500";
        this.title.style.fontFamily = "Arial, Helvetica, sans-serif";
        this.title.style.visibility = "hidden";

        document.body.appendChild(this.title);
    }

}

class Bar {
    constructor(yVal, index) {
        this.yVal = parseInt(yVal);

        this.index = index;

        this.shape = this.createBar(yVal);

        this.position = {
            y: this.shape.position.y,
            x: this.shape.position.x
        };

        this.geometry = {
            parameters: this.shape.geometry.parameters
        };

        this.valueLabel = document.createElement('h6');
        this.formatValueLabel();
    }

    createBar() {
        return createSimpleBox(50 + ((this.index - 1) * 10), - 100 + this.yVal / 2, this.yVal, 10, 10)
    }

    display(scene) {
        objects.push(this);

        scene.addToScene(this.shape);
    }

    hide(scene) {
        const index = objects.indexOf(this);
        objects.splice(index, 1);
        


        scene.removeFromScene(this.shape)
    }

    onHover() {
        this.shape.material.color.setHex( 0xFF0000);
        this.valueLabel.style.visibility = "visible";
    }

    offHover() {
        this.shape.material.color.setHex( 0xFFCC00);
        this.valueLabel.style.visibility = "hidden";
    }

    onClick() {
        console.log("CLICKED");
    }

    formatValueLabel() {
        this.valueLabel.textContent = this.yVal;
        this.valueLabel.style.position = "absolute";
        this.valueLabel.style.top =  (170 + (-1 * (- 100 + this.yVal))) + "px";
        this.valueLabel.style.left = (310 + (45 + ((this.index - 1) * 10))) + "px";
        this.valueLabel.style.color = "black";
        this.valueLabel.style.fontSize = "20px";
        this.valueLabel.style.zIndex = "1500";
        this.valueLabel.style.visibility = "hidden";

        document.body.appendChild(this.valueLabel);
    }
}

export class Button {
    constructor(width, height, xPos, yPos, text, scene) {
        this.width = width;
        this.height = height;

        this.scene = scene;

        this.position = {
            y: yPos,
            x: xPos
        };

        this.button = this.createButton(this.position, this.height, this.width);

        this.geometry = {
            parameters: this.button.geometry.parameters
        };

        this.allowClick = true;

        this.buttonLabel = document.createElement('h6');
        this.formatValueLabel(text);      
        
    }

    createButton(position, width, height) {
        return createSimpleBox(position.x , position.y - (height / 2), height, width, 10)
    }

    display(scene) {
        scene.addToScene(this.button)
        objects.push(this);

        this.buttonLabel.style.visibility = "visible";
    }

    hide(scene) {
        const index = objects.indexOf(this);
        objects.splice(index, 1);

        scene.removeFromScene(this.button)

        this.buttonLabel.style.visibility = "hidden";
    }

    onHover() {
        
    }

    offHover() {
        //this.button.material.color.setHex( 0xFFCC00);
    }

    resetColour = (button) => () => button.material.color.setHex( 0xFFCC00);

    onClick() {
        if (this.allowClick) {
            this.scene.nextPane();
            setTimeout(this.resetColour(this.button), 1500);
            this.button.material.color.setHex( 0xFF0000);

            this.allowClick = false;

            setTimeout(this.resetClick(this), 1500);
        }

        
    }

    formatValueLabel(text) {
        this.buttonLabel.textContent = text;
        this.buttonLabel.style.position = "absolute";
        this.buttonLabel.style.top = (240 - this.position.y - (this.height / 2)) + "px";
        this.buttonLabel.style.left = (280 + this.position.x + (this.width / 2)) + "px";
        this.buttonLabel.style.color = "black";
        this.buttonLabel.style.fontSize = "20px";
        this.buttonLabel.style.zIndex = "1500";
        this.buttonLabel.style.visibility = "hidden";

        document.body.appendChild(this.buttonLabel);
    }

    resetClick = (buttonObj) => () => buttonObj.allowClick = true;
}

export function createTileInterface(scene) {
    const box = createSimpleBox(0.5, 2);
    addToScene(scene, box);

    const box2 = createSimpleBox(2, 2);
    addToScene(scene, box2);

    const box3 = createSimpleBox(3.5, 2);
    addToScene(scene, box3);

    const box5 = createSimpleBox(0.5, .5);
    addToScene(scene, box5);

    const box6 = createSimpleBox(2, .5);
    addToScene(scene, box6);

    const box7 = createSimpleBox(3.5, .5);
    addToScene(scene, box7);
}



export function fingerPositionProcessor(pointerX, pointerY, thumbX, thumbY) {
    objects.forEach(elem => isFingerOnShape(elem, pointerX, pointerY) 
                                ? isFingerOnShape(elem, thumbX, thumbY) 
                                        ? elem.onClick() 
                                        : elem.onHover() 
                                : isFingerOnShape(elem, thumbX, thumbY)
                                        ? elem.onHover() 
                                        : elem.offHover());
                        
}

function isFingerOnShape(shape, pointerX, pointerY) {
    const shapeX = shape.position.x;
    const shapeY = shape.position.y;

    const shapeWidth = shape.geometry.parameters["width"];
    const shapeHeight = shape.geometry.parameters["height"];

    const shapeStartX = shapeX - (shapeWidth / 2);
    const shapeEndX = shapeX + (shapeWidth / 2);

    const shapeStartY = shapeY - (shapeHeight / 2);
    const shapeEndY = shapeY+ (shapeHeight / 2);

    if (pointerX > shapeStartX && pointerX < shapeEndX) {
        if (pointerY > shapeStartY && pointerY < shapeEndY) {
            return true;
        } 
    }
    return false;
}

/*
scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setClearColor("#e5e5e5", 0);
renderer.setSize(640, 480);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    //renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
})

var geometry = new THREE.BoxGeometry(1, .7, .4);
var material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
var mesh = new THREE.Mesh(geometry, material)

mesh.position.x += 1.5;
mesh.position.y += 2;
// mesh.rotation.x = 0.46365;
//mesh.rotation.y = 1.21203;

scene.add(mesh);

var light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(10, 2, 25);
scene.add(light);

function animate() {
    requestAnimationFrame(animate);
    
    //mesh.rotation.x += 0.01;

    renderer.render(scene, camera);
}

animate()

this.tl = new TimelineMax({paused: true});
this.tl.to(this.mesh.scale, 1, {y: 3, ease: Expo.easeOut});
this.tl.to(this.mesh.rotation, 1, {y: Math.PI / 2, ease: Expo.easeOut}, "=-1");

*/