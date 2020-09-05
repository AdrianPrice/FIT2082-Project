import * as LAUNCHER from './launcher.js'    

const objects = [];

Chart.defaults.global.defaultFontFamily = "Arial, Helvetica, sans-serif";
Chart.defaults.global.defaultFontSize = 45;
Chart.defaults.global.defaultFontColor = 'black';

var myChart = document.getElementById('chartLegend').getContext('2d');

var barChart = new Chart(myChart, {
    type: 'bar', //bar, horizontal bar, pie, line, doughnut, radar, polarArea
    data: {
        labels:[],
        datasets:[ {
            label: "",
            fillColor: "rgba(220,220,220,0.0)",
            strokeColor: "rgba(220,220,220,0)",
            pointColor: "rgba(220,220,220,0)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            // change this data values according to the vertical scale
            // you are looking for 
            data: [0, 20]
        },
        // your real chart here
        {
            label: "",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
        }]
    },
    options:{
        legend: {
            display: false
        }
    }
});

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
        const cam2 = new THREE.OrthographicCamera(-320, 320, 240, -240, -1000000, 1000000 )
        cam2.position.z = 318;

        return cam2;
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
        console.log("NEXT");
        //myChart.canvas.style.visibility = "hidden";

        if (this.timeLine[this.index + 1] instanceof BarGraph) {
            
        }
        if (this.index + 1 < this.timeLine.length) {
            if (this.index === -1) {
                this.index += 1;

                this.timeLine[this.index].display(this.scene);
            } else {
                this.timeLine[this.index].hide(this.scene);
                
                this.index += 1;

                this.timeLine[this.index].display(this.scene);
            }
            myChart.canvas.style.visibility = "visible";
            console.log(this.timeLine[this.index].maxVal)
            var barChart = new Chart(myChart, {
                type: 'bar', //bar, horizontal bar, pie, line, doughnut, radar, polarArea
                data: {
                    labels:[],
                    datasets:[ {
                        label: "",
                        fillColor: "rgba(220,220,220,0.0)",
                        strokeColor: "rgba(220,220,220,0)",
                        pointColor: "rgba(220,220,220,0)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: [0, this.timeLine[this.index].maxVal]
                    },
                    {
                        label: "",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: []
                    }]
                },
                options:{
                    legend: {
                        display: false
                    }
                }
            });

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
        this.maxVal = Math.max.apply(Math, yValues)
        this.formatTitle(title, 230);

        this.yValues = this.formatValues(yValues, this.maxVal);
        
        this.graph = this.createBarGraph(this.yValues);
    }

    createBarGraph(yValues) {
        if (this.maxVal < 100) {
            return yValues.map((elem, index) => new Bar(elem, index, 230/(Math.ceil(this.maxVal/10) * 10)));
        } else {
            return yValues.map((elem, index) => new Bar(elem, index, 230/(Math.ceil(this.maxVal/100) * 100)));
        }
        
    }

    display(scene) {
        this.graph.forEach((shape) => shape.display(scene));
        this.title.style.visibility = "visible";
    }

    hide(scene) {
        this.graph.forEach((shape) => shape.hide(scene));
        this.title.style.visibility = "hidden";
    }

    formatValues(yValues, maxValue) {
        let ratio = 0;
        if (maxValue < 100) {
            ratio = 230 / (Math.ceil(maxValue/10) * 10);
        } else {
            ratio = 230 / (Math.ceil(maxValue/100) * 100);
        }
        

        return yValues.map(value => parseInt(value) * ratio)


    }

    formatTitle(title, maxY) {
        this.title.textContent = title;
        this.title.style.position = "absolute";
        this.title.style.top =  (240 - maxY) + "px";
        this.title.style.left = (400 - (8 * title.length)) + "px";
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
    constructor(yVal, index, ratio) {
        this.yVal = yVal;

        this.index = index;
        this.ratio = ratio;

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
        return createSimpleBox(((this.index - 1) * 10), - 100 + this.yVal / 2, this.yVal, 10, 10)
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
        this.valueLabel.textContent = Math.round(this.yVal / this.ratio);
        this.valueLabel.style.position = "absolute";
        this.valueLabel.style.top =  (170 + (-1 * (- 100 + this.yVal))) + "px";
        this.valueLabel.style.left = (260 + (45 + ((this.index - 1) * 10))) + "px";
        this.valueLabel.style.color = "black";
        this.valueLabel.style.fontSize = "20px";
        this.valueLabel.style.zIndex = "1500";
        this.valueLabel.style.visibility = "hidden";

        document.body.appendChild(this.valueLabel);
    }
}

export class ScatterGraph {
    constructor (xyValues, title) {
        this.values = xyValues;
        this.title = title;

        this.maxVal = 300;

        this.minX = this.values.reduce((acc, currenElem) => currenElem[0] < acc[0] ? currenElem : acc)
        this.maxX = this.values.reduce((acc, currenElem) => currenElem[0] > acc[0] ? currenElem : acc)

        this.minY = this.values.reduce((acc, currenElem) => currenElem[1] < acc[1] ? currenElem : acc)
        this.maxY = this.values.reduce((acc, currenElem) => currenElem[1] > acc[1] ? currenElem : acc)

        this.graph = this.createGraph();

        this.trendlineSlope = this.calculateTrendlineSlope();
        this.trendlineIntercept = this.calculateTrendlineIntercept();
        this.trendlineLength = this.calculateTrendlineLength();
        this.trendline = this.createTrendline();
    }

    createGraph() {
        return this.values.map(elem => new Point(elem[0], 230 * (elem[1] / 300)))
    }

    display(scene) {
        this.graph.forEach((shape) => shape.display(scene));

        scene.addToScene(this.trendline);
    }

    hide(scene) {
        this.graph.forEach((shape) => shape.hide(scene));
    }

    calculateTrendlineSlope() {
        const top = (this.values.length * this.values.reduce((acc, currentElem) => acc + (currentElem[0] * currentElem[1]), 0)) - (this.values.reduce((acc, currentElem) => acc + currentElem[0], 0) * this.values.reduce((acc, currentElem) => acc + currentElem[1], 0))
        const bottom = (this.values.length * this.values.reduce((acc, currentElem) => acc + (currentElem[0] * currentElem[0]), 0)) - Math.pow(this.values.reduce((acc, currentElem) => acc + currentElem[0], 0), 2)
        return top / bottom;
    }

    calculateTrendlineIntercept() {
        return (this.values.reduce((acc, currentElem) => acc + currentElem[1], 0) - this.trendlineSlope * this.values.reduce((acc, currentElem) => acc + currentElem[0], 0)) / this.values.length
    }

    createTrendline() {
        const line = createSimpleBox(this.minX[0] + (this.trendlineLength / 2) * Math.sin(this.trendlineSlope), (230 * ((this.trendlineSlope * ((this.maxX[0] + this.minX[0])/2)) + this.trendlineIntercept))/300 - 100, 2, this.trendlineLength, 5);
        
        line.material.color.setHex( 0x808080);

        line.rotation.z = Math.atan(this.trendlineSlope);
        return line;
    }

    calculateTrendlineLength() {
        console.log(this.maxX);
        return Math.sqrt(Math.pow((this.maxX[0] - this.minX[0]),2) + Math.pow((this.maxY[1] - this.minY[1]),2))
    }

}

class Point {
    constructor (xVal, yVal) {
        this.xVal = xVal;
        this.yVal = yVal;
        
        this.shape = this.createShape();

        this.geometry = {
            parameters: {
                width: 10,
                height: 10
            }
        };

        this.position = {
            y: this.shape.position.y,
            x: this.shape.position.x
        };
    }

    createShape() {
        return createSimpleCircle(this.xVal, this.yVal - 100, 5);
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
    }

    offHover() {
        this.shape.material.color.setHex( 0xFFCC00);
    }

    onClick() {
        console.log("CLICKED");
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
            console.log("click")
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

function createTileInterface(scene) {
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

function createSimpleCircle(posX, posY, radius) {
    var geometry = new THREE.CircleGeometry(radius, 32);
    var material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = posX;
    mesh.position.y = posY;

    return mesh;
}

function createSimpleBox(posX, posY, height = .8, width = 1, depth = .4) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = posX;
    mesh.position.y = posY;

    return mesh;
}

function createRandomBarGraph(scene) {
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
    shape.position === undefined ? console.log(shape) : null
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