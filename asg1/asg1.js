// ColoredPoint.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform float u_Size;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = u_Size;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +  // uniform変数
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    //gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return ([x, y]);
}


// Global UI Elements
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let g_selectedColor = [1.0, 0.0, 0.0, 1.0];
let g_selectSize = 10;
let g_selectedType = POINT;
let c_segments = 5;
var g_shapesList = [];
var randomButton = false;
var randValue = 1000;

// Seperate function for Clear button to use
function clearShapes() {
    g_shapesList = [];
    renderAllShapes();
}

function changePoint() {
    g_selectedType = POINT;
}

function changeTriangle() {
    g_selectedType = TRIANGLE;
}

function changeCircle() {
    g_selectedType = CIRCLE;
}

function addActionsForHtmlUI() {

    document.getElementById('redSlider').addEventListener('mouseup', function () { g_selectedColor[0] = this.value / 100; });
    document.getElementById('greenSlider').addEventListener('mouseup', function () { g_selectedColor[1] = this.value / 100; });
    document.getElementById('blueSlider').addEventListener('mouseup', function () { g_selectedColor[2] = this.value / 100; });
    document.getElementById('sizeSlider').addEventListener('mouseup', function () { g_selectSize = this.value; });
    document.getElementById('segmentSlider').addEventListener('mouseup', function () { c_segments = this.value; });

}

function click(ev) {

    let [x, y] = convertCoordinatesEventToGL(ev);

    let point;
    if (g_selectedType == POINT) {
        point = new Point();
    }

    else if (g_selectedType == TRIANGLE) {
        point = new Triangle();
    }

    else {
        point = new Circle();
        point.segments = c_segments;
    }

    point.position = [x, y];
    console.log(x, y);
    point.color = g_selectedColor.slice();
    point.size = g_selectSize;
    g_shapesList.push(point);

    renderAllShapes();
}

function renderAllShapes() {

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // var len = g_points.length;
    var len = g_shapesList.length;
    for (var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
}

function renderDrawing() {
    let pointList = [[0.3, 0.1], [0.5, 0.2]];

    for (let i = 0; i < pointList.length; i++) {
        let point = new Triangle()
        point.position = pointList[i];
        point.color = g_selectedColor.slice();
        point.size = g_selectSize;
        g_shapesList.push(point);
        renderAllShapes();
    }
}
var interval;
function randomControl() {
    interval = setInterval(randomDraw, 1000);

}

function stopRandom() {
    clearInterval(interval);
}


function randomDraw() {
    let shapeChange = [POINT, CIRCLE, TRIANGLE];

    let shapeSelect = shapeChange[(Math.floor(Math.random() * shapeChange.length))];
    let point;
    let negPos = Math.random();
    let negPos1 = Math.random()
    if (negPos < 0.5) {
        negPos *= -1;
    }
    if (negPos1 < 0.5) {
        negPos1 *= -1;
    }
    if (shapeSelect == POINT) {
        point = new Point()
        point.position = [negPos, negPos1];
        point.color = [Math.random(), Math.random(), Math.random(), 1.0];
        point.size = Math.random() * 50;
        g_shapesList.push(point);
        renderAllShapes();
    }

    else if (shapeSelect == CIRCLE) {
        point = new Circle()
        point.position = [negPos, negPos1];
        point.color = [Math.random(), Math.random(), Math.random(), 1.0];
        point.size = Math.random() * 50;
        g_shapesList.push(point);
        renderAllShapes();
    }

    else if (shapeSelect == TRIANGLE) {
        point = new Triangle()
        point.position = [negPos, negPos1];
        point.color = [Math.random(), Math.random(), Math.random(), 1.0];
        point.size = Math.random() * 50;
        g_shapesList.push(point);
        renderAllShapes();
    }


}

function main() {
    setupWebGL();

    connectVariablesToGLSL();

    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function (ev) { if (ev.buttons == 1) { click(ev) } };
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}
