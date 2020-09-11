'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Button = exports.ScatterGraph = exports.BarGraph = exports.TimeLine = exports.Scene = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.fingerPositionProcessor = fingerPositionProcessor;

var _launcher = require('./launcher.js');

var LAUNCHER = _interopRequireWildcard(_launcher);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var objects = [];

Chart.defaults.global.defaultFontFamily = "Arial, Helvetica, sans-serif";
Chart.defaults.global.defaultFontSize = 45;
Chart.defaults.global.defaultFontColor = 'white';

var myChart = document.getElementById('chartLegend').getContext('2d');

var barChart = new Chart(myChart, {
    type: 'bar', //bar, horizontal bar, pie, line, doughnut, radar, polarArea
    data: {
        labels: [],
        datasets: [{
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
    options: {
        legend: {
            display: false
        }
    }
});

var Scene = exports.Scene = function () {
    function Scene() {
        _classCallCheck(this, Scene);

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


    _createClass(Scene, [{
        key: 'createScene',
        value: function createScene() {
            return new THREE.Scene();
        }

        /**
         * Creates a new camera object
         */

    }, {
        key: 'createCamera',
        value: function createCamera() {
            var camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 2000);
            var cam2 = new THREE.OrthographicCamera(-320, 320, 240, -240, -1000000, 1000000);
            cam2.position.z = 318;

            return cam2;
        }

        /**
         * Creates a new renderer object
         */

    }, {
        key: 'createRenderer',
        value: function createRenderer() {
            var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setClearColor("#e5e5e5", 0);
            renderer.setSize(640, 480);

            document.body.appendChild(renderer.domElement);

            return renderer;
        }
    }, {
        key: 'addToScene',
        value: function addToScene(elem) {
            this.scene.add(elem);
            this.scene.matrixWorldNeedsUpdate = true;
            this.renderer.render(this.scene, this.camera);
        }
    }, {
        key: 'addGraph',
        value: function addGraph(graph) {
            graph.display(this);
        }
    }, {
        key: 'removeFromScene',
        value: function removeFromScene(elem) {
            this.scene.remove(elem);
        }
    }, {
        key: 'createLight',
        value: function createLight() {
            var light = new THREE.PointLight(0xFFFFFF, 1, 7000);
            light.position.set(0, 0, 300);

            this.scene.add(light);

            return light;
        }
    }, {
        key: 'addToTimeLine',
        value: function addToTimeLine(graph) {
            this.timeLine.addToTimeLine(graph);

            if (this.buttonHidden) {
                this.nextButton.display(this);
                this.buttonHidden = false;
            }
        }
    }, {
        key: 'nextPane',
        value: function nextPane() {
            if (this.timeLine.next()) {
                this.button.hide(this);
                this.buttonHidden = true;
            };
        }
    }]);

    return Scene;
}();

var TimeLine = exports.TimeLine = function () {
    function TimeLine(scene) {
        _classCallCheck(this, TimeLine);

        this.timeLine = [];
        this.index = -1;
        this.scene = scene;
    }

    _createClass(TimeLine, [{
        key: 'addToTimeLine',
        value: function addToTimeLine(graph) {
            this.timeLine.push(graph);
        }
    }, {
        key: 'next',
        value: function next() {
            //myChart.canvas.style.visibility = "hidden";

            if (this.timeLine[this.index + 1] instanceof BarGraph) {}
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
                var barChart = new Chart(myChart, {
                    type: 'bar', //bar, horizontal bar, pie, line, doughnut, radar, polarArea
                    data: {
                        labels: [],
                        datasets: [{
                            label: "",
                            fillColor: "rgba(220,220,220,0.0)",
                            strokeColor: "rgba(220,220,220,0)",
                            pointColor: "rgba(220,220,220,0)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: [0, this.timeLine[this.index].maxVal]
                        }, {
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
                    options: {
                        legend: {
                            display: false
                        }
                    }
                });
                console.log(barChart.scales);
                if (this.index === this.timeLine.length - 1) {
                    return true;
                }
            }

            return false;
        }
    }]);

    return TimeLine;
}();

var BarGraph = exports.BarGraph = function () {
    function BarGraph(yValues, title) {
        _classCallCheck(this, BarGraph);

        this.title = document.createElement('h2');
        this.maxVal = Math.max.apply(Math, yValues);
        this.formatTitle(title, 230);

        this.yValues = this.formatValues(yValues, this.maxVal);

        this.graph = this.createBarGraph(this.yValues);

        this.yAxis = createSimpleBox(-22, 16, 240, 4, 10, 0xFFFFFF);
        this.xAxis = createSimpleBox(132, -102, 4, 308, 10, 0xFFFFFF);
    }

    _createClass(BarGraph, [{
        key: 'createBarGraph',
        value: function createBarGraph(yValues) {
            var _this = this;

            if (this.maxVal < 100) {
                return yValues.map(function (elem, index) {
                    return new Bar(elem, index, 230 / (Math.ceil(_this.maxVal / 10) * 10), 305 / _this.yValues.length);
                });
            } else {
                return yValues.map(function (elem, index) {
                    return new Bar(elem, index, 230 / (Math.ceil(_this.maxVal / 100) * 100), 305 / _this.yValues.length);
                });
            }
        }
    }, {
        key: 'display',
        value: function display(scene) {
            this.graph.forEach(function (shape) {
                return shape.display(scene);
            });
            this.title.style.visibility = "visible";

            scene.addToScene(this.yAxis);
            scene.addToScene(this.xAxis);
        }
    }, {
        key: 'hide',
        value: function hide(scene) {
            this.graph.forEach(function (shape) {
                return shape.hide(scene);
            });
            this.title.style.visibility = "hidden";

            scene.removeFromScene(this.xAxis);
            scene.removeFromScene(this.yAxis);
        }
    }, {
        key: 'formatValues',
        value: function formatValues(yValues, maxValue) {
            var ratio = 0;
            if (maxValue < 100) {
                ratio = 230 / (Math.ceil(maxValue / 10) * 10);
            } else {
                ratio = 230 / (Math.ceil(maxValue / 100) * 100);
            }

            return yValues.map(function (value) {
                return parseInt(value) * ratio;
            });
        }
    }, {
        key: 'formatTitle',
        value: function formatTitle(title, maxY) {
            this.title.textContent = title;
            this.title.style.position = "absolute";
            this.title.style.top = 35 + "px";
            this.title.style.left = 240 + "px";
            this.title.style.textAlign = "center";
            this.title.style.color = "white";
            this.title.style.fontSize = "28px";
            this.title.style.zIndex = "1500";
            this.title.style.fontFamily = "Arial, Helvetica, sans-serif";
            this.title.style.visibility = "hidden";

            document.body.appendChild(this.title);
        }
    }]);

    return BarGraph;
}();

var Bar = function () {
    function Bar(yVal, index, ratio, width) {
        _classCallCheck(this, Bar);

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

    _createClass(Bar, [{
        key: 'createBar',
        value: function createBar() {
            console.log((this.index - 1) * this.width + this.width / 2 - 10);
            return createSimpleBox(this.index * this.width + this.width / 2 - 20, -100 + this.yVal / 2, this.yVal, this.width, 10);
        }
    }, {
        key: 'display',
        value: function display(scene) {
            objects.push(this);

            scene.addToScene(this.shape);
        }
    }, {
        key: 'hide',
        value: function hide(scene) {
            var index = objects.indexOf(this);
            objects.splice(index, 1);

            scene.removeFromScene(this.shape);
        }
    }, {
        key: 'onHover',
        value: function onHover() {
            this.shape.material.color.setHex(0xFFFFFF);
            this.valueLabel.style.visibility = "visible";
        }
    }, {
        key: 'offHover',
        value: function offHover() {
            this.shape.material.color.setHex(0x3EF4FA);
            this.valueLabel.style.visibility = "hidden";
        }
    }, {
        key: 'onClick',
        value: function onClick() {
            console.log("CLICKED");
        }
    }, {
        key: 'formatValueLabel',
        value: function formatValueLabel() {
            this.valueLabel.textContent = Math.round(this.yVal / this.ratio);
            this.valueLabel.style.position = "absolute";
            this.valueLabel.style.top = 170 + -1 * (-100 + this.yVal) + "px";
            this.valueLabel.style.left = 260 + (45 + ((this.index - 1) * this.width + 3 * this.width / 2 - 20)) + "px";
            this.valueLabel.style.color = "white";
            this.valueLabel.style.fontSize = "20px";
            this.valueLabel.style.zIndex = "1500";
            this.valueLabel.style.visibility = "hidden";

            document.body.appendChild(this.valueLabel);
        }
    }]);

    return Bar;
}();

var ScatterGraph = exports.ScatterGraph = function () {
    function ScatterGraph(xyValues, title) {
        _classCallCheck(this, ScatterGraph);

        this.values = xyValues;
        this.title = document.createElement('h2');
        this.formatTitle(title, 230);

        this.maxVal = this.values.reduce(function (acc, currenElem) {
            return currenElem[1] > acc[1] ? currenElem : acc;
        });

        this.minX = this.values.reduce(function (acc, currenElem) {
            return currenElem[0] < acc[0] ? currenElem : acc;
        });
        this.maxX = this.values.reduce(function (acc, currenElem) {
            return currenElem[0] > acc[0] ? currenElem : acc;
        });

        this.ratioX = 0;
        this.ratioY = 0;

        this.formatValues();

        this.graph = this.createGraph();

        this.trendlineSlope = this.calculateTrendlineSlope();
        this.trendlineIntercept = this.calculateTrendlineIntercept();
        this.trendlineLength = this.calculateTrendlineLength();
        this.trendline = this.createTrendline();

        this.yAxis = createSimpleBox(-22, 16, 240, 4, 10, 0xFFFFFF);
        this.xAxis = createSimpleBox(132, -102, 4, 308, 10, 0xFFFFFF);
    }

    _createClass(ScatterGraph, [{
        key: 'createGraph',
        value: function createGraph() {
            return this.values.map(function (elem) {
                return new Point(elem[0], elem[1]);
            });
        }
    }, {
        key: 'formatValues',
        value: function formatValues() {
            var _this2 = this;

            if (this.maxVal[1] < 100) {
                this.ratioY = 230 / (Math.ceil(this.maxVal[1] / 10) * 10);
            } else {
                this.ratioY = 230 / (Math.ceil(this.maxVal[1] / 100) * 100);
            }

            if (this.maxX[0] < 100) {
                this.ratioX = 280 / (Math.ceil(this.maxX[0] / 10) * 10);
            } else {
                this.ratioX = 280 / (Math.ceil(this.maxX[0] / 100) * 100);
            }

            this.values = this.values.map(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    x_val = _ref2[0],
                    y_val = _ref2[1];

                return [parseInt(x_val) * _this2.ratioX, parseInt(y_val) * _this2.ratioY];
            });
        }
    }, {
        key: 'display',
        value: function display(scene) {
            this.graph.forEach(function (shape) {
                return shape.display(scene);
            });
            this.title.style.visibility = "visible";

            scene.addToScene(this.trendline);

            scene.addToScene(this.xAxis);
            scene.addToScene(this.yAxis);
        }
    }, {
        key: 'hide',
        value: function hide(scene) {
            this.graph.forEach(function (shape) {
                return shape.hide(scene);
            });
            this.title.style.visibility = "hidden";

            scene.removeFromScene(this.trendline);

            scene.removeFromScene(this.xAxis);
            scene.removeFromScene(this.yAxis);
        }
    }, {
        key: 'calculateTrendlineSlope',
        value: function calculateTrendlineSlope() {
            var top = this.values.length * this.values.reduce(function (acc, currentElem) {
                return acc + currentElem[0] * currentElem[1];
            }, 0) - this.values.reduce(function (acc, currentElem) {
                return acc + currentElem[0];
            }, 0) * this.values.reduce(function (acc, currentElem) {
                return acc + currentElem[1];
            }, 0);
            var bottom = this.values.length * this.values.reduce(function (acc, currentElem) {
                return acc + currentElem[0] * currentElem[0];
            }, 0) - Math.pow(this.values.reduce(function (acc, currentElem) {
                return acc + currentElem[0];
            }, 0), 2);
            return top / bottom;
        }
    }, {
        key: 'calculateTrendlineIntercept',
        value: function calculateTrendlineIntercept() {
            return (this.values.reduce(function (acc, currentElem) {
                return acc + currentElem[1];
            }, 0) - this.trendlineSlope * this.values.reduce(function (acc, currentElem) {
                return acc + currentElem[0];
            }, 0)) / this.values.length;
        }
    }, {
        key: 'createTrendline',
        value: function createTrendline() {
            var line = createSimpleBox(this.minX[0] + this.trendlineLength / 2 * Math.sin(Math.PI / 2 - Math.atan(this.trendlineSlope)), 230 * (this.trendlineSlope * ((this.maxX[0] + this.minX[0]) / 2) + this.trendlineIntercept) / 300 - 100, 5, this.trendlineLength, 5);

            line.material.color.setHex(0xffffff);

            line.rotation.z = Math.atan(this.trendlineSlope);
            return line;
        }
    }, {
        key: 'calculateTrendlineLength',
        value: function calculateTrendlineLength() {
            //return (Math.sqrt(Math.pow((this.maxX[0] - this.minX[0]),2) + Math.pow((this.maxY[1] - this.minY[1]),2)))
            return Math.sqrt(Math.pow(this.maxX[0] * this.ratioX - this.minX[0] * this.ratioX, 2) + Math.pow(this.trendlineSlope * (this.maxX[0] * this.ratioX) + this.trendlineIntercept - (this.trendlineSlope * (this.minX[0] * this.ratioX) + this.trendlineIntercept), 2));
        }
    }, {
        key: 'formatTitle',
        value: function formatTitle(title, maxY) {
            this.title.textContent = title;
            this.title.style.position = "absolute";
            this.title.style.top = 35 + "px";
            this.title.style.left = 240 + "px";
            this.title.style.textAlign = "center";
            this.title.style.color = "white";
            this.title.style.fontSize = "28px";
            this.title.style.zIndex = "1500";
            this.title.style.fontFamily = "Arial, Helvetica, sans-serif";
            this.title.style.visibility = "hidden";

            document.body.appendChild(this.title);
        }
    }]);

    return ScatterGraph;
}();

var Point = function () {
    function Point(xVal, yVal) {
        _classCallCheck(this, Point);

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

    _createClass(Point, [{
        key: 'createShape',
        value: function createShape() {
            return createSimpleCircle(this.xVal, this.yVal - 100, 5);
        }
    }, {
        key: 'display',
        value: function display(scene) {
            objects.push(this);

            scene.addToScene(this.shape);
        }
    }, {
        key: 'hide',
        value: function hide(scene) {
            var index = objects.indexOf(this);
            objects.splice(index, 1);

            scene.removeFromScene(this.shape);
        }
    }, {
        key: 'onHover',
        value: function onHover() {
            this.shape.material.color.setHex(0xFF0000);
        }
    }, {
        key: 'offHover',
        value: function offHover() {
            this.shape.material.color.setHex(0x3EF4FA);
        }
    }, {
        key: 'onClick',
        value: function onClick() {
            console.log("CLICKED");
        }
    }]);

    return Point;
}();

var Button = exports.Button = function () {
    function Button(width, height, xPos, yPos, text, scene) {
        _classCallCheck(this, Button);

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

    _createClass(Button, [{
        key: 'createButton',
        value: function createButton(position, width, height) {
            return createSimpleBox(position.x, position.y - height / 2, height, width, 10, 0x808080);
        }
    }, {
        key: 'display',
        value: function display(scene) {
            scene.addToScene(this.button);
            objects.push(this);

            this.buttonLabel.style.visibility = "visible";
        }
    }, {
        key: 'hide',
        value: function hide(scene) {
            var index = objects.indexOf(this);
            objects.splice(index, 1);

            scene.removeFromScene(this.button);

            this.buttonLabel.style.visibility = "hidden";
        }
    }, {
        key: 'onHover',
        value: function onHover() {}
    }, {
        key: 'offHover',
        value: function offHover() {
            //this.button.material.color.setHex( 0xFFCC00);
        }
    }, {
        key: 'resetColour',
        value: function resetColour(button) {
            return function () {
                return button.material.color.setHex(0x808080);
            };
        }
    }, {
        key: 'onClick',
        value: function onClick() {
            if (this.allowClick) {
                this.scene.nextPane();
                setTimeout(this.resetColour(this.button), 500);
                this.button.material.color.setHex(0xA9A9A9);

                this.allowClick = false;

                setTimeout(this.resetClick(this), 500);
            }
        }
    }, {
        key: 'formatValueLabel',
        value: function formatValueLabel(text) {
            this.buttonLabel.textContent = text;
            this.buttonLabel.style.position = "absolute";
            this.buttonLabel.style.top = 240 - this.position.y - this.height / 2 + "px";
            this.buttonLabel.style.left = 280 + this.position.x + this.width / 2 + "px";
            this.buttonLabel.style.color = "white";
            this.buttonLabel.style.fontSize = "20px";
            this.buttonLabel.style.zIndex = "1500";
            this.buttonLabel.style.visibility = "hidden";

            document.body.appendChild(this.buttonLabel);
        }
    }, {
        key: 'resetClick',
        value: function resetClick(buttonObj) {
            return function () {
                return buttonObj.allowClick = true;
            };
        }
    }]);

    return Button;
}();

function createTileInterface(scene) {
    var box = createSimpleBox(0.5, 2);
    addToScene(scene, box);

    var box2 = createSimpleBox(2, 2);
    addToScene(scene, box2);

    var box3 = createSimpleBox(3.5, 2);
    addToScene(scene, box3);

    var box5 = createSimpleBox(0.5, .5);
    addToScene(scene, box5);

    var box6 = createSimpleBox(2, .5);
    addToScene(scene, box6);

    var box7 = createSimpleBox(3.5, .5);
    addToScene(scene, box7);
}

function createSimpleCircle(posX, posY, radius) {
    var geometry = new THREE.CircleGeometry(radius, 32);
    var material = new THREE.MeshLambertMaterial({ color: 0xFFCC00 });
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = posX;
    mesh.position.y = posY;

    return mesh;
}

function createSimpleBox(posX, posY) {
    var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : .8;
    var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var depth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : .4;
    var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0x3EF4FA;

    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshLambertMaterial({ color: color });
    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = posX;
    mesh.position.y = posY;

    return mesh;
}

function createRandomBarGraph(scene) {
    var height = Math.random() * 250 + 20;
    var box = createSimpleBox(50, -50 + height / 2, height, 30, 10);
    addToScene(scene, box);

    height = Math.random() * 250 + 20;
    box = createSimpleBox(90, -50 + height / 2, height, 30, 10);
    addToScene(scene, box);

    height = Math.random() * 250 + 20;
    box = createSimpleBox(130, -50 + height / 2, height, 30, 10);
    addToScene(scene, box);

    height = Math.random() * 250 + 20;
    box = createSimpleBox(170, -50 + height / 2, height, 30, 10);
    addToScene(scene, box);

    height = Math.random() * 250 + 20;
    box = createSimpleBox(210, -50 + height / 2, height, 30, 10);
    addToScene(scene, box);

    height = Math.random() * 250 + 20;
    box = createSimpleBox(250, -50 + height / 2, height, 30, 10);
    addToScene(scene, box);

    height = Math.random() * 250 + 20;
    box = createSimpleBox(290, -50 + height / 2, height, 30, 10);
    addToScene(scene, box);
}

function fingerPositionProcessor(pointerX, pointerY, thumbX, thumbY) {
    objects.forEach(function (elem) {
        return isFingerOnShape(elem, pointerX, pointerY) ? isFingerOnShape(elem, thumbX, thumbY) ? elem.onClick() : elem.onHover() : isFingerOnShape(elem, thumbX, thumbY) ? elem.onHover() : elem.offHover();
    });
}

function isFingerOnShape(shape, pointerX, pointerY) {
    shape.position === undefined ? console.log(shape) : null;
    var shapeX = shape.position.x;
    var shapeY = shape.position.y;

    var shapeWidth = shape.geometry.parameters["width"];
    var shapeHeight = shape.geometry.parameters["height"];

    var shapeStartX = shapeX - shapeWidth / 2;
    var shapeEndX = shapeX + shapeWidth / 2;

    var shapeStartY = shapeY - shapeHeight / 2;
    var shapeEndY = shapeY + shapeHeight / 2;

    if (pointerX > shapeStartX && pointerX < shapeEndX) {
        if (pointerY > shapeStartY && pointerY < shapeEndY) {
            return true;
        }
    }
    return false;
}
