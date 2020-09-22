import * as LAUNCHER from './launcher.js'    

const objects = [];

Chart.defaults.global.defaultFontFamily = "Arial, Helvetica, sans-serif";
Chart.defaults.global.defaultFontSize = 45;
Chart.defaults.global.defaultFontStyle = 'normal'
Chart.defaults.global.defaultFontColor = 'white';

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
        //this.nextButton = new Button(40, 80, 270, -125, "Next", this);
        
        //this.buttonHidden = true;
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

        renderer.domElement.style.position = "absolute"

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
            //this.nextButton.display(this);
            //this.buttonHidden = false;
        }
    }

    nextPane() {
        if (this.timeLine.next()) {
            //this.button.hide(this);
            //this.buttonHidden = true;
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
        //myChart.canvas.style.visibility = "hidden";
        
        if (this.index + 1 < this.timeLine.length) {
            if (this.index === -1) {
                this.index += 1;

                this.timeLine[this.index].update();
                this.timeLine[this.index].display(this.scene);
            } else {
                this.timeLine[this.index].hide(this.scene);
                
                this.index += 1;
                this.timeLine[this.index].update();
                this.timeLine[this.index].display(this.scene);
            }
            // if (this.timeLine[this.index] instanceof Australia) {
            //     myChart.canvas.style.visibility = "hidden";
            // } else {
            //     myChart.canvas.style.visibility = "visible";
            // }
            myChart.canvas.style.visibility = "visible";
            barChart = new Chart(myChart, {
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
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                display: (this.timeLine[this.index] instanceof Australia) ? false : true
                            }
                        }]
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
    constructor(values, title) {
        this.title = document.createElement('h2');
        this.maxVal = Math.max.apply(Math, values.map(elem => elem[1]))
        this.formatTitle(title, 230);

        this.yValues = this.formatValues(values.map(elem => elem[1]), this.maxVal);
        this.xValues = values.map(elem => elem[0]);

        this.graph = this.createBarGraph(this.yValues);
        
        this.yAxis = createSimpleBox(-22,16, 240, 4, 10, 0xFFFFFF);
        this.xAxis = createSimpleBox(132, -102, 4, 308, 10, 0xFFFFFF);

        this.xLabels = this.formatLabels();
    }

    createBarGraph(yValues) {
        if (this.maxVal < 100) {
            return yValues.map((elem, index) => new Bar(elem, index, 230/(Math.ceil(this.maxVal/10) * 10), 305/(this.yValues.length)));
        } else {
            return yValues.map((elem, index) => new Bar(elem, index, 230/(Math.ceil(this.maxVal/100) * 100), 305/(this.yValues.length)));
        }
        
    }

    formatLabels() {
        let values = [];

        var label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValues[this.xValues.length - 1], 580))

        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValues[Math.round(this.xValues.length - ((1/5) * this.xValues.length))], 532))

        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValues[Math.round(this.xValues.length - ((2/5) * this.xValues.length))], 474))

        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValues[Math.round(this.xValues.length - ((3/5) * this.xValues.length))], 416))
        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValues[Math.round(this.xValues.length - ((4/5) * this.xValues.length))], 358))

        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValues[0], 300))

        return values;
    }

    createLabel(label, text, position) {
        label.textContent = text;
        label.style.position = "absolute";
        label.style.top =  (317) + "px";
        label.style.left = (position) + "px";
        label.style.textAlign = "center";
        label.style.color = "white";
        label.style.fontSize = "12px";
        label.style.zIndex = "2000";
        label.style.fontFamily = "Arial, Helvetica, sans-serif";
        label.style.visibility = "hidden";

        document.body.appendChild(label);

        return label;
    }

    display(scene) {
        this.graph.forEach((shape) => shape.display(scene));
        this.title.style.visibility = "visible";

        scene.addToScene(this.yAxis);
        scene.addToScene(this.xAxis);

        this.xLabels.forEach(label => label.style.visibility = "visible")
    }

    hide(scene) {
        this.graph.forEach((shape) => shape.hide(scene));
        this.title.style.visibility = "hidden";

        scene.removeFromScene(this.xAxis);
        scene.removeFromScene(this.yAxis);

        this.xLabels.forEach(label => label.style.visibility = "hidden")
    }

    formatValues(yValues, maxValue) {
        let ratio = 0;
        if (maxValue < 100) {
            ratio = 230 / (Math.ceil(maxValue/10) * 10);
        } else if (maxValue < 1000) {
            ratio = 230 / (Math.ceil(maxValue/100) * 100);
        } else if (maxValue < 10000) {
            ratio = 230 / (Math.ceil(maxValue/500) * 500);
        } else {
            ratio = 230 / (Math.ceil(maxValue/5000) * 5000);
        }
        

        return yValues.map(value => parseInt(value) * ratio)
    }

    formatTitle(title, maxY) {
        this.title.textContent = title;
        this.title.style.position = "absolute";
        this.title.style.top =  (35) + "px";
        this.title.style.left = (240) + "px";
        this.title.style.textAlign = "center";
        this.title.style.color = "white";
        this.title.style.fontSize = "28px";
        this.title.style.zIndex = "1500";
        this.title.style.fontFamily = "Arial, Helvetica, sans-serif";
        this.title.style.visibility = "hidden";

        document.body.appendChild(this.title);
    }

    update () {
        const xPos = [580, 532, 474, 416, 358, 300]
        this.title.style.top =  (35 + translationY) + "px";
        this.title.style.left = (240 + translationX) + "px";

        this.graph.forEach((shape) => shape.update());

        this.xLabels.forEach((shape, index) => {shape.style.top = (317 + translationY) + "px";
                                                shape.style.left = (xPos[index] + translationX) + "px"})
    }

}

class Bar {
    constructor(yVal, index, ratio, width) {
        this.yVal = yVal;

        this.index = index;
        this.ratio = ratio;
        this.width = width;

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
        return createSimpleBox((((this.index)) * this.width) + (this.width/2) - 20, - 100 + this.yVal / 2, this.yVal, this.width, 10)
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
        this.shape.material.color.setHex( 0xFFFFFF);
        this.valueLabel.style.visibility = "visible";
    }

    offHover() {
        this.shape.material.color.setHex( 0x3EF4FA);
        this.valueLabel.style.visibility = "hidden";
    }

    onClick() {
    }

    formatValueLabel() {
        this.valueLabel.textContent = Math.round(this.yVal / this.ratio);
        this.valueLabel.style.position = "absolute";
        this.valueLabel.style.top =  (170 + (-1 * (- 100 + this.yVal))) + "px";
        this.valueLabel.style.left = (260 + (45 + ((this.index - 1) * this.width + ((3 * this.width)/2) - 20))) + "px";
        this.valueLabel.style.color = "white";
        this.valueLabel.style.fontSize = "20px";
        this.valueLabel.style.zIndex = "1500";
        this.valueLabel.style.fontFamily = "Arial, Helvetica, sans-serif";
        this.valueLabel.style.visibility = "hidden";

        document.body.appendChild(this.valueLabel);
    }

    update() {
        this.valueLabel.style.top = ((170 + (-1 * (- 100 + this.yVal))) + translationY) + "px";
        this.valueLabel.style.left = ((260 + (45 + ((this.index - 1) * this.width + ((3 * this.width)/2) - 20))) + translationX) + "px";
    }
}

export class ScatterGraph {
    constructor (xyValues, title) {
        this.values = xyValues;
        this.title = document.createElement('h2');
        this.formatTitle(title, 230);

        this.maxVal = this.values.reduce((acc, currenElem) => currenElem[1] > acc[1] ? currenElem : acc);

        this.minX = this.values.reduce((acc, currenElem) => currenElem[0] < acc[0] ? currenElem : acc)
        this.maxX = this.values.reduce((acc, currenElem) => currenElem[0] > acc[0] ? currenElem : acc)

        this.ratioX = 0;
        this.ratioY = 0;

        this.formatValues();
        

        this.graph = this.createGraph();
        

        this.trendlineSlope = this.calculateTrendlineSlope();
        this.trendlineIntercept = this.calculateTrendlineIntercept();
        this.trendlineLength = this.calculateTrendlineLength();
        this.trendline = this.createTrendline();

        this.yAxis = createSimpleBox(-22,16, 240, 4, 10, 0xFFFFFF);
        this.xAxis = createSimpleBox(132, -102, 4, 308, 10, 0xFFFFFF);
        
        this.xLabels = this.formatLabels();
    }

    createGraph() {
        return this.values.map(elem => new Point(elem[0], elem[1]))
    }

    formatValues () {
        if (this.maxVal[1] < 100) {
            this.ratioY  = 230 / (Math.ceil(this.maxVal[1]/10) * 10);
        } else if (this.maxVal[1] < 1000) {
            this.ratioY  = 230 / (Math.ceil(this.maxVal[1]/100) * 100);
        } else if (this.maxVal[1] < 10000) {
            this.ratioY  = 230 / (Math.ceil(this.maxVal[1]/500) * 500);
        } else {
            this.ratioY  = 230 / (Math.ceil(this.maxVal[1]/5000) * 5000);
        }

        if (this.maxX[0] < 100) {
            this.ratioX = 295 / this.maxX[0];
        } else {
            this.ratioX = 295 / this.maxX[0];
        }

        this.values = this.values.map(([x_val, y_val]) => [parseInt(x_val) * this.ratioX - 15, parseInt(y_val) * this.ratioY])

    }

    formatLabels() {
        let values = [];

        var label = document.createElement('h6');
        values.push(this.createLabel(label, this.maxX[0], 590))

        label = document.createElement('h6');
        values.push(this.createLabel(label, Math.round(this.maxX[0] - ((1/5) * this.maxX[0])), 532))

        label = document.createElement('h6');
        values.push(this.createLabel(label, Math.round(this.maxX[0] - ((2/5) * this.maxX[0])), 474))

        label = document.createElement('h6');
        values.push(this.createLabel(label, Math.round(this.maxX[0] - ((3/5) * this.maxX[0])), 416))
        label = document.createElement('h6');
        values.push(this.createLabel(label, Math.round(this.maxX[0] - ((4/5) * this.maxX[0])), 358))


        return values;
    }

    createLabel(label, text, position) {
        label.textContent = text;
        label.style.position = "absolute";
        label.style.top =  (317) + "px";
        label.style.left = (position) + "px";
        label.style.textAlign = "center";
        label.style.color = "white";
        label.style.fontSize = "12px";
        label.style.zIndex = "1500";
        label.style.fontFamily = "Arial, Helvetica, sans-serif";
        label.style.visibility = "hidden";

        document.body.appendChild(label);

        return label;
    }

    display(scene) {
        this.graph.forEach((shape) => shape.display(scene));
        this.title.style.visibility = "visible";

        scene.addToScene(this.trendline);

        scene.addToScene(this.xAxis);
        scene.addToScene(this.yAxis);

        this.xLabels.forEach(label => label.style.visibility = "visible")
    }

    hide(scene) {
        this.graph.forEach((shape) => shape.hide(scene));
        this.title.style.visibility = "hidden";

        scene.removeFromScene(this.trendline);

        scene.removeFromScene(this.xAxis);
        scene.removeFromScene(this.yAxis);

        this.xLabels.forEach(label => label.style.visibility = "hidden")
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
        const line = createSimpleBox(this.minX[0] + ((this.trendlineLength / 2) * Math.sin((Math.PI/2) - Math.atan(this.trendlineSlope))) - 15, (230 * ((this.trendlineSlope * ((this.maxX[0] + this.minX[0])/2)) + this.trendlineIntercept))/300 - 100, 5, this.trendlineLength, 5);
        
        line.material.color.setHex( 0xffffff);

        line.rotation.z = Math.atan(this.trendlineSlope);
        return line;
    }

    update () {
        this.title.style.top =  (35 + translationY) + "px";
        this.title.style.left = (240 + translationX) + "px";

        const xPos = [590, 532, 474, 416, 358]

        this.xLabels.forEach((shape, index) => {shape.style.top = (317 + translationY) + "px";
                                                shape.style.left = (xPos[index] + translationX) + "px"})
    }

    calculateTrendlineLength() {
        //return (Math.sqrt(Math.pow((this.maxX[0] - this.minX[0]),2) + Math.pow((this.maxY[1] - this.minY[1]),2)))
        return (Math.sqrt(Math.pow(((this.maxX[0] * this.ratioX) - (this.minX[0] * this.ratioX)),2) + Math.pow(((this.trendlineSlope * (this.maxX[0] * this.ratioX)) + this.trendlineIntercept) - ((this.trendlineSlope * (this.minX[0] * this.ratioX)) + this.trendlineIntercept),2)))
    }

    formatTitle(title, maxY) {
        this.title.textContent = title;
        this.title.style.position = "absolute";
        this.title.style.top =  (35) + "px";
        this.title.style.left = (240) + "px";
        this.title.style.textAlign = "center";
        this.title.style.color = "white";
        this.title.style.fontSize = "28px";
        this.title.style.zIndex = "1500";
        this.title.style.fontFamily = "Arial, Helvetica, sans-serif";
        this.title.style.visibility = "hidden";

        document.body.appendChild(this.title);
    }


}

export class LineGraphMulti {
    constructor (xyValues, title, seriesTitles) {
        console.log(xyValues)
        this.colours = [0x3EF4FA, 0xFF0000, 0x32CD32, 0xFFFF00, 0x6A0DAD, 0xFFA500, 0xffc0cb];
        this.seriesTitles = seriesTitles;

        if (xyValues[0].reduce((acc, elem) => isNaN(elem[0]) ? false : acc, true)) {
            this.xValues = xyValues[0].map(elem => parseInt(elem[0]));
        } else {
            this.xValues = xyValues[0].map((_, index) => index);
            this.xValuesString = xyValues[0].map(elem => elem[0]);
        }

        this.yValues = xyValues.map(series => series.map(elem => elem[1]))

        this.maxVal = this.yValues.map(series => series.reduce((acc, elem) => elem > acc ? elem : acc)).reduce((acc, elem) => elem > acc ? elem : acc)
        this.maxX = this.xValues.reduce((acc, elem) => elem > acc ? elem : acc);

        this.formatValues()

        this.graphs = this.yValues.map((series, index) => new LineGraph(series.map((elem, index) => [this.xValues[index], elem]), "", true, this.colours[index % 5]))

        this.yAxis = createSimpleBox(-22,16, 240, 4, 10, 0xFFFFFF);
        this.xAxis = createSimpleBox(132, -102, 4, 308, 10, 0xFFFFFF);

        this.title = document.createElement('h2');
        this.formatTitle(title, 230);

        if (!isNaN(xyValues[0][0][0])) {
            this.xLabels = this.formatLabels();
        } else {
            this.xLabels = this.formatLabelsString();
        }
        this.seriesLabels = this.formatSeriesLabels();
    }

    formatValues () {
        if (this.maxVal < 100) {
            this.ratioY  = 230 / (Math.ceil(this.maxVal/10) * 10);
        } else if (this.maxVal < 1000) {
            this.ratioY  = 230 / (Math.ceil(this.maxVal/100) * 100);
        } else if (this.maxVal < 10000) {
            this.ratioY  = 230 / (Math.ceil(this.maxVal/500) * 500);
        } else {
            this.ratioY  = 230 / (Math.ceil(this.maxVal/5000) * 5000);
        }

        if (this.maxX < 100) {
            this.ratioX = 300 / this.maxX;
        } else {
            this.ratioX = 300 / this.maxX;
        }

        this.xValues = this.xValues.map((x_val) => parseInt(x_val) * this.ratioX - 20)

        this.yValues = this.yValues.map(series => series.map((y_val) => parseInt(y_val) * this.ratioY ))
    }

    display(scene) {
        this.graphs.forEach((graph) => graph.display(scene));
        scene.addToScene(this.xAxis);
        scene.addToScene(this.yAxis);

        this.title.style.visibility = "visible";
        this.xLabels.forEach(label => label.style.visibility = "visible")
        this.seriesLabels.forEach(label => label.style.visibility = "visible")
    }

    hide(scene) {
        this.graphs.forEach((graph) => graph.hide(scene));
        scene.removeFromScene(this.xAxis);
        scene.removeFromScene(this.yAxis);

        this.title.style.visibility = "hidden";
        this.xLabels.forEach(label => label.style.visibility = "hidden")
        this.seriesLabels.forEach(label => label.style.visibility = "hidden")
    }

    update () {
        this.title.style.top =  (35 + translationY) + "px";
        this.title.style.left = (240 + translationX) + "px";

        let xPos = []
            if (isNaN(this.xLabels[0])) {
                xPos = [580, 532, 474, 416, 358, 300]
            } else {
                xPos = [590, 532, 474, 416, 358]
            }
    
        this.xLabels.forEach((shape, index) => {shape.style.top = (317 + translationY) + "px";
                                                shape.style.left = (xPos[index] + translationX) + "px"})

        let seriesPos = [70, 80, 90, 100, 110, 120, 130]
        this.seriesLabels.forEach((shape, index) => {shape.style.left = (305 + translationX) + "px";
                                                shape.style.top = (seriesPos[index] + translationY) + "px"})
    }

    createLabel(label, text, position) {
        label.textContent = text;
        label.style.position = "absolute";
        label.style.top =  (317) + "px";
        label.style.left = (position) + "px";
        label.style.textAlign = "center";
        label.style.color = "white";
        label.style.fontSize = "12px";
        label.style.zIndex = "1500";
        label.style.fontFamily = "Arial, Helvetica, sans-serif";
        label.style.visibility = "hidden";

        document.body.appendChild(label);

        return label;
    }

    createSeriesLabel(label, text, position, colour) {
        const colourList = ["#3EF4FA", "#FF0000", "#32CD32", "#FFFF00", "#6A0DAD", "#FFA500", "#ffc0cb"];

        let label2 = label
        label2.textContent = text;
        label2.style.position = "absolute";
        label2.style.left =  305 + "px";
        label2.style.top = position + "px";
        label2.style.textAlign = "center";
        label2.style.color = colourList[colour];
        label2.style.fontSize = "10px";
        label2.style.zIndex = "1500";
        label2.style.fontFamily = "Arial, Helvetica, sans-serif";
        label2.style.visibility = "hidden";

        document.body.appendChild(label2);

        return label2;
    }

    formatSeriesLabels () {
        let positions = [70, 80, 90, 100, 110, 120, 130]

        var labels = [...Array(this.seriesTitles.length).keys()].map(_ => document.createElement('h6')).map((label, index) => this.createSeriesLabel(label, this.seriesTitles[index], positions[index], index));

        return labels;
    }
    
    formatLabels() {
        let values = [];

        var label = document.createElement('h6');
        values.push(this.createLabel(label, this.maxX, 590))

        label = document.createElement('h6');
        values.push(this.createLabel(label, Math.round(this.maxX - ((1/5) * this.maxX)), 532))

        label = document.createElement('h6');
        values.push(this.createLabel(label, Math.round(this.maxX - ((2/5) * this.maxX)), 474))

        label = document.createElement('h6');
        values.push(this.createLabel(label, Math.round(this.maxX - ((3/5) * this.maxX)), 416))
        label = document.createElement('h6');
        values.push(this.createLabel(label, Math.round(this.maxX - ((4/5) * this.maxX)), 358))


        return values;
    }

    formatLabelsString() {
        let values = [];

        var label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValuesString[this.xValuesString.length - 1], 580))

        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValuesString[Math.round(this.xValuesString.length - ((1/5) * this.xValuesString.length))], 532))

        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValuesString[Math.round(this.xValuesString.length - ((2/5) * this.xValuesString.length))], 474))

        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValuesString[Math.round(this.xValuesString.length - ((3/5) * this.xValuesString.length))], 416))
        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValuesString[Math.round(this.xValuesString.length - ((4/5) * this.xValuesString.length))], 358))

        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValuesString[0], 300))

        return values;
    }

    formatTitle(title, maxY) {
        this.title.textContent = title;
        this.title.style.position = "absolute";
        this.title.style.top =  (35) + "px";
        this.title.style.left = (240) + "px";
        this.title.style.textAlign = "center";
        this.title.style.color = "white";
        this.title.style.fontSize = "28px";
        this.title.style.zIndex = "1500";
        this.title.style.fontFamily = "Arial, Helvetica, sans-serif";
        this.title.style.visibility = "hidden";

        document.body.appendChild(this.title);
    }
}

export class LineGraph {
    constructor (xyValues, title, partOfMulti = false, colour = 0x3EF4FA) {
        this.partOfMulti = partOfMulti;
        this.colour = colour;

        this.yValues = xyValues.map(elem => elem[1])

        if (xyValues.reduce((acc, elem) => isNaN(elem[0]) ? false : acc, true)) {
            this.xValues = xyValues.map(elem => parseInt(elem[0]));
        } else {
            this.xValues = xyValues.map((_, index) => index);
            this.xValuesString = xyValues.map(elem => elem[0]);
        }

        this.maxVal = this.yValues.reduce((acc, currenElem) => currenElem > acc ? currenElem : acc);
        this.maxX = this.xValues.reduce((acc, elem) => elem > acc ? elem : acc);

        this.ratioX;
        this.ratioY;
        

        if (!partOfMulti) {
            this.title = document.createElement('h2');
            this.formatTitle(title);

            this.formatValues();

            this.graph = this.createGraph();
            

            if (!isNaN(xyValues[0][0])) {
                this.xLabels = this.formatLabels();
            } else {
                this.xLabels = this.formatLabelsString();
            }
            
            this.yAxis = createSimpleBox(-22,16, 240, 4, 10, 0xFFFFFF);
            this.xAxis = createSimpleBox(132, -102, 4, 308, 10, 0xFFFFFF);
        } else {
            this.graph = this.createGraph();
        }
        
        
        this.lines = this.xValues.map((x_val, index) => index > 0 ? new JoiningLine(this.xValues[index-1], this.yValues[index-1], this.xValues[index], this.yValues[index], this.colour) : new JoiningLine(0, 0, 0, 0))

    }

    createGraph() {
        return this.xValues.map((elem, i) => new Point(elem, this.yValues[i]))
    }

    formatValues () {
        if (this.maxVal < 100) {
            this.ratioY  = 230 / (Math.ceil(this.maxVal/10) * 10);
        } else if (this.maxVal < 1000) {
            this.ratioY  = 230 / (Math.ceil(this.maxVal/100) * 100);
        } else if (this.maxVal < 10000) {
            this.ratioY  = 230 / (Math.ceil(this.maxVal/500) * 500);
        } else {
            this.ratioY  = 230 / (Math.ceil(this.maxVal/5000) * 5000);
        }

        if (this.maxX < 100) {
            this.ratioX = 300 / this.maxX;
        } else {
            this.ratioX = 300 / this.maxX;
        }

        this.xValues = this.xValues.map((x_val) => parseInt(x_val) * this.ratioX - 20)

        this.yValues = this.yValues.map((y_val) => parseInt(y_val) * this.ratioY )
    }

    formatLabels() {
        let values = [];

        var label = document.createElement('h6');
        values.push(this.createLabel(label, this.maxX, 590))

        label = document.createElement('h6');
        values.push(this.createLabel(label, Math.round(this.maxX - ((1/5) * this.maxX)), 532))

        label = document.createElement('h6');
        values.push(this.createLabel(label, Math.round(this.maxX - ((2/5) * this.maxX)), 474))

        label = document.createElement('h6');
        values.push(this.createLabel(label, Math.round(this.maxX - ((3/5) * this.maxX)), 416))
        label = document.createElement('h6');
        values.push(this.createLabel(label, Math.round(this.maxX - ((4/5) * this.maxX)), 358))


        return values;
    }

    createLabel(label, text, position) {
        label.textContent = text;
        label.style.position = "absolute";
        label.style.top =  (317) + "px";
        label.style.left = (position) + "px";
        label.style.textAlign = "center";
        label.style.color = "white";
        label.style.fontSize = "12px";
        label.style.zIndex = "1500";
        label.style.fontFamily = "Arial, Helvetica, sans-serif";
        label.style.visibility = "hidden";

        document.body.appendChild(label);

        return label;
    }

    formatLabelsString() {
        let values = [];

        var label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValuesString[this.xValuesString.length - 1], 580))

        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValuesString[Math.round(this.xValuesString.length - ((1/5) * this.xValuesString.length))], 532))

        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValuesString[Math.round(this.xValuesString.length - ((2/5) * this.xValuesString.length))], 474))

        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValuesString[Math.round(this.xValuesString.length - ((3/5) * this.xValuesString.length))], 416))
        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValuesString[Math.round(this.xValuesString.length - ((4/5) * this.xValuesString.length))], 358))

        label = document.createElement('h6');
        values.push(this.createLabel(label, this.xValuesString[0], 300))

        return values;
    }

    display(scene) {
        
        this.lines.forEach((line) => line.display(scene));

        if (!this.partOfMulti) {
            this.title.style.visibility = "visible";

            scene.addToScene(this.xAxis);
            scene.addToScene(this.yAxis);

            this.xLabels.forEach(label => label.style.visibility = "visible")
        }
        

    }

    hide(scene) {
        // this.graph.forEach((shape) => shape.hide(scene));
        this.lines.forEach((line) => line.hide(scene));
        if (!this.partOfMulti) {
            this.title.style.visibility = "hidden";

            scene.removeFromScene(this.xAxis);
            scene.removeFromScene(this.yAxis);

            this.xLabels.forEach(label => label.style.visibility = "hidden")
        }
        
    }

    formatTitle(title, maxY) {
        this.title.textContent = title;
        this.title.style.position = "absolute";
        this.title.style.top =  (35) + "px";
        this.title.style.left = (240) + "px";
        this.title.style.textAlign = "center";
        this.title.style.color = "white";
        this.title.style.fontSize = "28px";
        this.title.style.zIndex = "1500";
        this.title.style.fontFamily = "Arial, Helvetica, sans-serif";
        this.title.style.visibility = "hidden";

        document.body.appendChild(this.title);
    }

    update () {
        if (!this.partOfMulti) {
            this.title.style.top =  (35 + translationY) + "px";
            this.title.style.left = (240 + translationX) + "px";
            let xPos = []
            if (isNaN(this.xLabels[0])) {
                xPos = [580, 532, 474, 416, 358, 300]
            } else {
                xPos = [590, 532, 474, 416, 358]
            }
    
            this.xLabels.forEach((shape, index) => {shape.style.top = (317 + translationY) + "px";
                                                    shape.style.left = (xPos[index] + translationX) + "px"})
        }
       
    }
}

class JoiningLine {
    constructor(startingX, startingY, finishingX, finishingY, colour = 0x3EF4FA) {
        this.colour = colour;
        this.startingCoord = [startingX, startingY];
        this.finishCoord = [finishingX, finishingY];

        this.length = this.calculateLength();
        this.roation = this.calculateAngle();

        this.shape = this.createLine();
    }

    calculateLength() {
        return Math.sqrt(Math.pow((this.finishCoord[0] - this.startingCoord[0]), 2) + Math.pow((this.finishCoord[1] - this.startingCoord[1]), 2))
    }

    calculateAngle() {
        return Math.atan((this.finishCoord[1] - this.startingCoord[1]) / (this.finishCoord[0] - this.startingCoord[0]));
    }

    createLine() {
        let box = createSimpleBox(this.startingCoord[0] + ((this.length / 2) * Math.sin((Math.PI/2) - this.roation)), (this.finishCoord[1] + this.startingCoord[1])/2 - 100, 2.5, this.length, 2, this.colour)
        
        box.rotation.z = this.roation;

        //box.material.color = this.colour;

        return box;
    }

    display(scene) {
        //objects.push(this);

        scene.addToScene(this.shape);
    }

    hide(scene) {
        //const index = objects.indexOf(this);
        //objects.splice(index, 1);
        
        scene.removeFromScene(this.shape)
    }

    onHover() {
        //this.shape.material.color.setHex( 0xFF0000);
    }

    offHover() {
        //this.shape.material.color.setHex( this.colour);
    }

    onClick() {
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
        this.shape.material.color.setHex( 0x3EF4FA);
    }

    onClick() {
    }
}

export class Australia {
    constructor (values, title) {
        this.stateObjects = [new State ('VictoriaModel.glb', values[0]), new State('NSWModel.glb', values[1]), new State('QLDModel.glb', values[2]), new State("SAModel.glb", values[3]), new State("NTModel.glb", values[4]), new State('WAModel.glb', values[5]), new State('TasmaniaModel.glb', values[6])]
        
        this.title = document.createElement('h2');
        this.formatTitle(title, 230);
    }

    display (scene) {
        this.stateObjects.forEach(elem => elem.display(scene))
        this.title.style.visibility = "visible";
    }

    hide (scene) {
        this.stateObjects.forEach(elem => elem.hide(scene))
        this.title.style.visibility = "hidden";
    }

    formatTitle(title, maxY) {
        this.title.textContent = title;
        this.title.style.position = "absolute";
        this.title.style.top =  (35) + "px";
        this.title.style.left = (240) + "px";
        this.title.style.textAlign = "center";
        this.title.style.color = "white";
        this.title.style.fontSize = "28px";
        this.title.style.zIndex = "1500";
        this.title.style.fontFamily = "Arial, Helvetica, sans-serif";
        this.title.style.visibility = "hidden";

        document.body.appendChild(this.title);
    }
    update () {
        this.stateObjects.forEach((state) => state.update());
        this.title.style.top =  (35 + translationY) + "px";
        this.title.style.left = (240 + translationX) + "px";
    }
}

class State {
    constructor (name, value) {
        this.filePath = name;
        this.loader = new THREE.GLTFLoader();

        this.state = 0;
        this.load();
        this.test = 0;

        this.geometry = {
            parameters: {
                width: 30,
                height: 30
            }
        };

        this.position = {
            y: 0,
            x: 0
        };

        this.valueLabel = document.createElement('h6');
        this.formatValueLabel(value);
    }

    load () {
        this.loader.load(
            // resource URL
            this.filePath,
            // called when the resource is loaded
            this.load_aux)
    }

    load_aux = (gltf) => {
        var state = gltf.scene;
        
                state.traverse((object) => {
                                if (object.isMesh) {
                                    object.material.color.set( 0x3EF4FA )
                                    object.material.metalness = 0;
                                    object.scale.x = 60;
                                    object.scale.y = 60;
                                    object.scale.z = 60;
                                }
                            })
        
                state.rotation.x = Math.PI / 2;
                

                this.setState(state);

                if (this.filePath === "VictoriaModel.glb") {
                    state.position.x += 195;
                    state.position.y -= 57;
                } else if (this.filePath === "NSWModel.glb") {
                    state.position.x += 202;
                    state.position.y -= 19;
                } else if (this.filePath === "QLDModel.glb") {
                    state.position.x += 188;
                    state.position.y += 46;
                } else if (this.filePath === "SAModel.glb") {
                    state.position.x += 128;
                    state.position.y -= 1;

                } else if (this.filePath === "NTModel.glb") {
                    state.position.x += 118;
                    state.position.y += 70;
                } else if (this.filePath === "WAModel.glb") {
                    state.position.x += 48;
                    state.position.y += 30;
                } else if (this.filePath === "TasmaniaModel.glb") {
                    state.position.x += 200;
                    state.position.y -= 95;
                }
    }

    setState (state) {
        this.state = state
    }

    formatValueLabel(value) {
        const len = String(value).length - 1;

        this.valueLabel.textContent = value;
        this.valueLabel.style.position = "absolute";
        this.valueLabel.style.color = "white";
        this.valueLabel.style.fontSize = "20px";
        this.valueLabel.style.zIndex = "1500";
        this.valueLabel.style.fontFamily = "Arial, Helvetica, sans-serif";
        this.valueLabel.style.visibility = "hidden";

        if (this.filePath === "VictoriaModel.glb") {
            this.valueLabel.style.top =  240 + "px";
            this.valueLabel.style.left = 510 - (len * 5) + "px";
        } else if (this.filePath === "NSWModel.glb") {
            this.valueLabel.style.top =  200 + "px";
            this.valueLabel.style.left = 520 - (len * 5)  + "px";
        } else if (this.filePath === "QLDModel.glb") {
            this.valueLabel.style.top +=  130 + "px";
            this.valueLabel.style.left += 500 - (len * 5)  + "px";
        } else if (this.filePath === "SAModel.glb") {
            this.valueLabel.style.top +=  180 + "px";
            this.valueLabel.style.left += 440 - (len * 5)  + "px";
        } else if (this.filePath === "NTModel.glb") {
            this.valueLabel.style.top +=  115 + "px";
            this.valueLabel.style.left += 435 - (len * 5)  + "px";
        } else if (this.filePath === "WAModel.glb") {
            this.valueLabel.style.top +=  160 + "px";
            this.valueLabel.style.left += 355 - (len * 5)  + "px";
        } else if (this.filePath === "TasmaniaModel.glb") {
            this.valueLabel.style.top +=  275 + "px";
            this.valueLabel.style.left += 515 - (len * 5)  + "px";
        }

        document.body.appendChild(this.valueLabel);
    }

    display (scene) {
        //objects.push(this)
        this.valueLabel.style.visibility = "visible";
        scene.addToScene(this.state);
    }   

    hide (scene) {
        //const index = objects.indexOf(this);
        //objects.splice(index, 1);
        this.valueLabel.style.visibility = "hidden";
        scene.removeFromScene(this.state);
    }

    onHover() {
        // this.state.traverse((object) => {
        //     if (object.isMesh) {
        //         object.material.color.set( 0xFF0000 )
        //     }
        // })
    }

    offHover() {
        // this.state.traverse((object) => {
        //     if (object.isMesh) {
        //         object.material.color.set( 0x3EF4FA )
        //     }
        // })
    }

    update () {
        const len = String(this.valueLabel.textContent).length - 1;
        
        if (this.filePath === "VictoriaModel.glb") {
            this.valueLabel.style.top =  (240 + translationY) + "px";
            this.valueLabel.style.left = (510 + translationX) - (len * 5) + "px";
        } else if (this.filePath === "NSWModel.glb") {
            this.valueLabel.style.top =  (200 + translationY) + "px";
            this.valueLabel.style.left = (520 + translationX) - (len * 5)  + "px";
        } else if (this.filePath === "QLDModel.glb") {
            this.valueLabel.style.top =  (130 + translationY) + "px";
            this.valueLabel.style.left = (500 + translationX) - (len * 5)  + "px";
        } else if (this.filePath === "SAModel.glb") {
            this.valueLabel.style.top =  (180 + translationY) + "px";
            this.valueLabel.style.left = (440 + translationX) - (len * 5)  + "px";
        } else if (this.filePath === "NTModel.glb") {
            this.valueLabel.style.top =  (115 + translationY) + "px";
            this.valueLabel.style.left = (435 + translationX) - (len * 5)  + "px";
        } else if (this.filePath === "WAModel.glb") {
            this.valueLabel.style.top =  (160 + translationY) + "px";
            this.valueLabel.style.left = (355 + translationX) - (len * 5)  + "px";
        } else if (this.filePath === "TasmaniaModel.glb") {
            this.valueLabel.style.top =  (275 + translationY) + "px";
            this.valueLabel.style.left = (515 + translationX) - (len * 5)  + "px";
        }
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
        return createSimpleBox(position.x , position.y - (height / 2), height, width, 10, 0x808080)
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

    resetColour (button){ return () => button.material.color.setHex( 0x808080);}

    onClick() {
        if (this.allowClick) {
            this.scene.nextPane();
            setTimeout(this.resetColour(this.button), 500);
            this.button.material.color.setHex( 0xA9A9A9);

            this.allowClick = false;

            setTimeout(this.resetClick(this), 500);
        }

        
    }

    formatValueLabel(text) {
        this.buttonLabel.textContent = text;
        this.buttonLabel.style.position = "absolute";
        this.buttonLabel.style.top = (240 - this.position.y - (this.height / 2)) + "px";
        this.buttonLabel.style.left = (280 + this.position.x + (this.width / 2)) + "px";
        this.buttonLabel.style.color = "white";
        this.buttonLabel.style.fontSize = "20px";
        this.buttonLabel.style.zIndex = "1500";
        this.buttonLabel.style.visibility = "hidden";

        document.body.appendChild(this.buttonLabel);
    }

    resetClick (buttonObj) {return () => buttonObj.allowClick = true};
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

function createSimpleBox(posX, posY, height = .8, width = 1, depth = .4, color = 0x3EF4FA) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshLambertMaterial({color: color});
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

let positions = []
let fistX = 1000;
let fistY = 1000;
let translationX = 0;
let translationY = 0;

export function fingerPositionProcessor(scene, handValues) {
    const shape = getHandShape(handValues);
    document.getElementById("chartLegend").style.opacity = .4;
    if (shape === "pointing") {
        fistX = 1000;
        fistY = 1000;

        const pointerX = handValues[8][0] - translationX;
        const pointerY = handValues[8][1] + translationY;

        const thumbX = handValues[4][0] - translationX;
        const thumbY = handValues[4][1] + translationY;
        
    
        objects.forEach(elem => isFingerOnShape(elem, pointerX, pointerY) 
                                    ? isFingerOnShape(elem, thumbX, thumbY) 
                                            ? elem.onClick() 
                                            : elem.onHover() 
                                    : isFingerOnShape(elem, thumbX, thumbY)
                                            ? elem.onHover() 
                                            : elem.offHover());
    } else if (shape === "palm") {
        objects.forEach(elem => elem.offHover());
        fistX = 1000;
        fistY = 1000;

        positions.push(handValues[0][0])
        
        if (handValues[0][0] < (positions[1] - 100)) {
            scene.nextPane();
            positions = []
        } else {
            setTimeout(() => positions.shift(), 2000)
        }
 
        
    } else if (shape === "fist") {
        objects.forEach(elem => elem.offHover());
        if (fistX === 1000) {
            fistX = handValues[9][0];
            fistY = handValues[9][1];
        }

        if (scene.timeLine.index >= 0) {
            if (handValues[9][0] > (-95 + translationX) && handValues[9][0] < (245 + translationX)) {
                if (handValues[9][1] > (-65 - translationY) && handValues[9][1] < (190 - translationY)) {
                    document.getElementById("chartLegend").style.opacity = .7;


                    translationX += -1 * (fistX - handValues[9][0]);
                    translationY += fistY - handValues[9][1];

                    fistX = handValues[9][0];
                    fistY = handValues[9][1];

                    if (translationX > 5) {
                        translationX = 5
                    } 
                    if (translationX < -225) {
                        translationX = -225
                    } 
                    if (translationY > 115) {
                        translationY = 115
                    } 
                    if (translationY < -50) {
                        translationY = -50
                    }
                    scene.renderer.domElement.style.top = translationY + "px";
                    scene.renderer.domElement.style.left = translationX + "px";

                    document.getElementById("chartLegend").style.top = (50 + translationY) + "px";
                    document.getElementById("chartLegend").style.left = (225 + translationX) + "px";

                    scene.timeLine.timeLine[scene.timeLine.index].update();
                }
            }
        }
        
    }
    
                        
}

function isFingerOnShape(shape, pointerX, pointerY) {
    console.log(shape)
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

function getHandShape (handPositions) {
    let pointerString = document.getElementById("handDetected");
    if (handPositions[4][0] <= handPositions[17][0]) {
        if (handPositions[3][0] < handPositions[4][0] && handPositions[6][1] <= handPositions[8][1] && handPositions[6][1] <= handPositions[8][1]) {
            pointerString.textContent = "Hand Detected: Pointing";
            return "pointing";
        } else if (handPositions[6][1] > handPositions[8][1]) {
            pointerString.textContent = "Hand Detected: Fist";
            return "fist";
        } else {
            pointerString.textContent = "Hand Detected: Palm";
            return "palm";
        }
    } else {
        if (handPositions[3][0] > handPositions[4][0] && handPositions[6][1] <= handPositions[8][1]) {
            pointerString.textContent = "Hand Detected: Pointing";
            return "pointing";
        } else if (handPositions[6][1] > handPositions[8][1]) {
            pointerString.textContent = "Hand Detected: Fist";
            return "fist";
        } else {
            pointerString.textContent = "Hand Detected: Palm";
            return "palm";
        }
    }
    

}

function distanceBetweenTwoLandmarks(landmark1, landmark2) {
    return Math.sqrt(Math.pow(landmark2[0] - landmark1[0], 2) + Math.pow(landmark2[1] - landmark1[1], 2));
}