// ColoredPoint.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'uniform mat4 u_GlobalRotateMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
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
let u_ModelMatrix;
let u_GlobalRotateMatrix;

// Global UI Elements
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let g_selectedColor = [1.0, 0.0, 0.0, 1.0];
let g_selectSize = 10;
let g_selectedType = POINT;

let g_globalAngle = 0;
var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;
let animationIsMove = false;
let altAnimation = false;
let isMouseDown = false;
let prevMouseX = 0;
let prevMouseY = 0;
// Global Joint Elements
let g_legAngle = 0;

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
    gl.enable(gl.DEPTH_TEST);
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

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}



function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return ([x, y]);
}

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

function switchAnimationOn() {
    if (animationIsMove == false) {
        animationIsMove = true
    }
}

function switchAnimationOff() {
    if (animationIsMove == true) {
        animationIsMove = false
    }
}

function switchAltStanceSit() {
    if (altAnimation == false) {
        altAnimation = true;
    }
}

function switchAltStanceStand() {
    if (altAnimation == true) {
        altAnimation = false;
    }
}

function addActionsForHtmlUI() {

    //  document.getElementById('redSlider').addEventListener('mouseup', function () { g_selectedColor[0] = this.value / 100; });
    //  document.getElementById('greenSlider').addEventListener('mouseup', function () { g_selectedColor[1] = this.value / 100; });
    document.getElementById('legJoint').addEventListener('mousemove', function () { g_legAngle = this.value; renderAllShapes(); });

    // document.getElementById('sizeSlider').addEventListener('mouseup', function () { g_selectSize = this.value; });
    // document.getElementById('segmentSlider').addEventListener('mouseup', function () { c_segments = this.value; });
    document.getElementById('angleSlide').addEventListener('mousemove', function () { g_globalAngle = this.value; renderAllShapes(); });

}

function renderAllShapes() {

    // Clear <canvas>

    var startTime = performance.now()

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (animationIsMove == true && altAnimation == false) {

        var body = new Cube();
        body.color = [.5, 0.5, 0.5, 1.0];
        body.matrix.translate(-.4, -.2, -0.0);
        body.matrix.rotate(0, 1, 0, 0);
        body.matrix.scale(.8, .3, .3);
        body.render();

        var leftBackLeg = new Cube();
        leftBackLeg.color = [.5, 0.5, 0.5, 1.0];
        leftBackLeg.matrix.translate(-.25, -.13, .12);
        leftBackLeg.matrix.rotate(45 * -Math.sin(g_seconds), 0, 0, 1)
        leftBackLeg.matrix.scale(-.08, -.3, -.05);
        leftBackLeg.render();

        var rightBackLeg = new Cube();
        rightBackLeg.color = [.5, 0.5, 0.5, 1.0];
        rightBackLeg.matrix.translate(-.25, -.13, .25);
        rightBackLeg.matrix.rotate(45 * Math.sin(g_seconds), 0, 0, 1)
        rightBackLeg.matrix.scale(-.08, -.3, -.05);
        rightBackLeg.render();

        var leftFrontLeg = new Cube();
        leftFrontLeg.color = [.5, 0.5, 0.5, 1.0];
        leftFrontLeg.matrix.translate(.25, -.13, .25);
        leftFrontLeg.matrix.rotate(45 * -Math.sin(g_seconds), 0, 0, 1)
        leftFrontLeg.matrix.scale(-.08, -.3, -.05);
        leftFrontLeg.render();

        var rightFrontLeg = new Cube();
        rightFrontLeg.color = [.5, 0.5, 0.5, 1.0];
        rightFrontLeg.matrix.translate(.25, -.13, .12);
        rightFrontLeg.matrix.rotate(45 * Math.sin(g_seconds), 0, 0, 1)
        rightFrontLeg.matrix.scale(-.08, -.3, -.05);
        rightFrontLeg.render();

        var baseTail = new Cube();
        baseTail.color = [.4, .4, .4, 1.0];
        baseTail.matrix.translate(-.35, .01, .18);
        let rotationAngle = Math.sin(g_seconds) * 0.5 + 0.5;
        let rotoAng = -rotationAngle * (120 - 40) - 40;

        baseTail.matrix.rotate(rotoAng, 0, 0, 1);
        var baseCoords = new Matrix4(baseTail.matrix);
        baseTail.matrix.scale(.04, -.2, -.04);
        baseTail.render();

        var midTail = new Cube();
        midTail.color = [.3, .3, .3, 1.0];
        midTail.matrix = baseCoords;
        midTail.matrix.translate(0, -0.11, 0.002);
        midTail.matrix.rotate(0, 0, 0, 1);
        midTail.matrix.scale(.04, -.18, -.04);
        midTail.render();

        var endTail = new Cube();
        endTail.color = [.2, .2, .2, 1.0];
        endTail.matrix = baseCoords;
        endTail.matrix.translate(0, -0.03, 0.001);
        endTail.matrix.rotate(0, 0, 0, 1);
        endTail.matrix.scale(.04, -.18, -.04);
        endTail.render();

        var baseHead = new Cube();
        baseHead.color = [.3, 0.3, 0.3, 1.0];
        baseHead.matrix.translate(.35, 0, .05);
        baseHead.matrix.rotate(0, 1, 0, 0);
        baseHead.matrix.scale(.2, .2, .2);
        baseHead.render();

        var cone = new Cone(.2, .2, 12);
        cone.color = [.8, .2, .2, 1.0]
        cone.matrix.translate(.45, .195, .15);
        cone.matrix.rotate(90, -90, 0, 1);
        cone.matrix.scale(0.3, 0.3, 0.9);
        cone.render();

        var rightEye = new Cube();
        rightEye.color = [.8, .8, 0, 1.0]
        rightEye.matrix.translate(.53, .115, .12);
        rightEye.matrix.rotate(90, -90, 0, 1);
        rightEye.matrix.scale(0.05, 0.02, .03);
        rightEye.render();

        var leftEye = new Cube();
        leftEye.color = [.8, .8, 0, 1.0]
        leftEye.matrix.translate(.53, .115, .19);
        leftEye.matrix.rotate(90, -90, 0, 1);
        leftEye.matrix.scale(0.05, 0.02, .03);
        leftEye.render();

    }

    else if (animationIsMove == false && altAnimation == true) {
        var body = new Cube();
        body.color = [.5, 0.5, 0.5, 1.0];
        body.matrix.translate(-.4, -.2, -0.0);
        body.matrix.rotate(0, 1, 0, 0);
        body.matrix.scale(.8, .3, .3);
        body.render();

        var leftBackLeg = new Cube();
        leftBackLeg.color = [.5, 0.5, 0.5, 1.0];
        leftBackLeg.matrix.translate(-.25, -.13, .12);
        leftBackLeg.matrix.rotate(90, 0, 0, 1)
        leftBackLeg.matrix.scale(-.08, -.3, -.05);
        leftBackLeg.render();

        var rightBackLeg = new Cube();
        rightBackLeg.color = [.5, 0.5, 0.5, 1.0];
        rightBackLeg.matrix.translate(-.25, -.13, .25);
        rightBackLeg.matrix.rotate(90, 0, 0, 1)
        rightBackLeg.matrix.scale(-.08, -.3, -.05);
        rightBackLeg.render();

        var leftFrontLeg = new Cube();
        leftFrontLeg.color = [.5, 0.5, 0.5, 1.0];
        leftFrontLeg.matrix.translate(.25, -.13, .25);
        leftFrontLeg.matrix.rotate(90, 0, 0, 1)
        leftFrontLeg.matrix.scale(-.08, -.3, -.05);
        leftFrontLeg.render();

        var rightFrontLeg = new Cube();
        rightFrontLeg.color = [.5, 0.5, 0.5, 1.0];
        rightFrontLeg.matrix.translate(.25, -.13, .12);
        rightFrontLeg.matrix.rotate(90, 0, 0, 1)
        rightFrontLeg.matrix.scale(-.08, -.3, -.05);
        rightFrontLeg.render();

        var baseTail = new Cube();
        baseTail.color = [.4, .4, .4, 1.0];
        baseTail.matrix.translate(-.35, .01, .18);
        baseTail.matrix.rotate(-98, 0, 0, 1);
        var baseCoords = new Matrix4(baseTail.matrix);
        baseTail.matrix.scale(.04, -.2, -.04);
        baseTail.render();

        var midTail = new Cube();
        midTail.color = [.3, .3, .3, 1.0];
        midTail.matrix = baseCoords;
        midTail.matrix.translate(0, -0.11, 0.002);
        midTail.matrix.rotate(0, 0, 0, 1);
        midTail.matrix.scale(.04, -.18, -.04);
        midTail.render();

        var endTail = new Cube();
        endTail.color = [.2, .2, .2, 1.0];
        endTail.matrix = baseCoords;
        endTail.matrix.translate(0, -0.03, 0.001);
        endTail.matrix.rotate(0, 0, 0, 1);
        endTail.matrix.scale(.04, -.18, -.04);
        endTail.render();

        var baseHead = new Cube();
        baseHead.color = [.3, 0.3, 0.3, 1.0];
        baseHead.matrix.translate(.35, 0, .05);
        baseHead.matrix.rotate(0, 1, 0, 0);
        baseHead.matrix.scale(.2, .2, .2);
        baseHead.render();

        var cone = new Cone(.2, .2, 12);
        cone.color = [.8, .2, .2, 1.0]
        cone.matrix.translate(.45, .195, .15);
        cone.matrix.rotate(90, -90, 0, 1);
        cone.matrix.scale(0.3, 0.3, 0.9);
        cone.render();

        var rightEye = new Cube();
        rightEye.color = [.8, .8, 0, 1.0]
        rightEye.matrix.translate(.53, .115, .12);
        rightEye.matrix.rotate(90, -90, 0, 1);
        rightEye.matrix.scale(0.05, 0.02, .03);
        rightEye.render();

        var leftEye = new Cube();
        leftEye.color = [.8, .8, 0, 1.0]
        leftEye.matrix.translate(.53, .115, .19);
        leftEye.matrix.rotate(90, -90, 0, 1);
        leftEye.matrix.scale(0.05, 0.02, .03);
        leftEye.render();
    }

    else if (animationIsMove == true && altAnimation == true) {
        var body = new Cube();
        body.color = [.5, 0.5, 0.5, 1.0];
        body.matrix.translate(-.4, -.2, -0.0);
        body.matrix.rotate(0, 1, 0, 0);
        body.matrix.scale(.8, .3, .3);
        body.render();

        var leftBackLeg = new Cube();
        leftBackLeg.color = [.5, 0.5, 0.5, 1.0];
        leftBackLeg.matrix.translate(-.25, -.13, .12);
        leftBackLeg.matrix.rotate(90, 0, 0, 1)
        leftBackLeg.matrix.scale(-.08, -.3, -.05);
        leftBackLeg.render();

        var rightBackLeg = new Cube();
        rightBackLeg.color = [.5, 0.5, 0.5, 1.0];
        rightBackLeg.matrix.translate(-.25, -.13, .25);
        rightBackLeg.matrix.rotate(90, 0, 0, 1)
        rightBackLeg.matrix.scale(-.08, -.3, -.05);
        rightBackLeg.render();

        var leftFrontLeg = new Cube();
        leftFrontLeg.color = [.5, 0.5, 0.5, 1.0];
        leftFrontLeg.matrix.translate(.25, -.13, .25);
        leftFrontLeg.matrix.rotate(90, 0, 0, 1)
        leftFrontLeg.matrix.scale(-.08, -.3, -.05);
        leftFrontLeg.render();

        var rightFrontLeg = new Cube();
        rightFrontLeg.color = [.5, 0.5, 0.5, 1.0];
        rightFrontLeg.matrix.translate(.25, -.13, .12);
        rightFrontLeg.matrix.rotate(90, 0, 0, 1)
        rightFrontLeg.matrix.scale(-.08, -.3, -.05);
        rightFrontLeg.render();

        var baseTail = new Cube();
        baseTail.color = [.4, .4, .4, 1.0];
        baseTail.matrix.translate(-.35, .01, .18);
        let rotationAngle = Math.sin(g_seconds) * 0.5 + 0.5;
        let rotoAng = -rotationAngle * (120 - 40) - 40;

        baseTail.matrix.rotate(rotoAng, 0, 0, 1);
        var baseCoords = new Matrix4(baseTail.matrix);
        baseTail.matrix.scale(.04, -.2, -.04);
        baseTail.render();

        var midTail = new Cube();
        midTail.color = [.3, .3, .3, 1.0];
        midTail.matrix = baseCoords;
        midTail.matrix.translate(0, -0.11, 0.002);
        midTail.matrix.rotate(0, 0, 0, 1);
        midTail.matrix.scale(.04, -.18, -.04);
        midTail.render();

        var endTail = new Cube();
        endTail.color = [.2, .2, .2, 1.0];
        endTail.matrix = baseCoords;
        endTail.matrix.translate(0, -0.03, 0.001);
        endTail.matrix.rotate(0, 0, 0, 1);
        endTail.matrix.scale(.04, -.18, -.04);
        endTail.render();

        var baseHead = new Cube();
        baseHead.color = [.3, 0.3, 0.3, 1.0];
        baseHead.matrix.translate(.35, 0, .05);
        baseHead.matrix.rotate(0, 1, 0, 0);
        baseHead.matrix.scale(.2, .2, .2);
        baseHead.render();

        var cone = new Cone(.2, .2, 12);
        cone.color = [.8, .2, .2, 1.0]
        cone.matrix.translate(.45, .195, .15);
        cone.matrix.rotate(90, -90, 0, 1);
        cone.matrix.scale(0.3, 0.3, 0.9);
        cone.render();

        var rightEye = new Cube();
        rightEye.color = [.8, .8, 0, 1.0]
        rightEye.matrix.translate(.53, .115, .12);
        rightEye.matrix.rotate(90, -90, 0, 1);
        rightEye.matrix.scale(0.05, 0.02, .03);
        rightEye.render();

        var leftEye = new Cube();
        leftEye.color = [.8, .8, 0, 1.0]
        leftEye.matrix.translate(.53, .115, .19);
        leftEye.matrix.rotate(90, -90, 0, 1);
        leftEye.matrix.scale(0.05, 0.02, .03);
        leftEye.render();
    }

    else {
        var body = new Cube();
        body.color = [.5, 0.5, 0.5, 1.0];
        body.matrix.translate(-.4, -.2, -0.0);
        body.matrix.rotate(0, 1, 0, 0);
        body.matrix.scale(.8, .3, .3);
        body.render();

        var leftBackLeg = new Cube();
        leftBackLeg.color = [.5, 0.5, 0.5, 1.0];
        leftBackLeg.matrix.translate(-.25, -.13, .12);
        leftBackLeg.matrix.rotate(g_legAngle, 0, 0, 1)
        leftBackLeg.matrix.scale(-.08, -.3, -.05);
        leftBackLeg.render();

        var rightBackLeg = new Cube();
        rightBackLeg.color = [.5, 0.5, 0.5, 1.0];
        rightBackLeg.matrix.translate(-.25, -.13, .25);
        rightBackLeg.matrix.rotate(-g_legAngle, 0, 0, 1)
        rightBackLeg.matrix.scale(-.08, -.3, -.05);
        rightBackLeg.render();

        var leftFrontLeg = new Cube();
        leftFrontLeg.color = [.5, 0.5, 0.5, 1.0];
        leftFrontLeg.matrix.translate(.25, -.13, .25);
        leftFrontLeg.matrix.rotate(g_legAngle, 0, 0, 1)
        leftFrontLeg.matrix.scale(-.08, -.3, -.05);
        leftFrontLeg.render();

        var rightFrontLeg = new Cube();
        rightFrontLeg.color = [.5, 0.5, 0.5, 1.0];
        rightFrontLeg.matrix.translate(.25, -.13, .12);
        rightFrontLeg.matrix.rotate(-g_legAngle, 0, 0, 1)
        rightFrontLeg.matrix.scale(-.08, -.3, -.05);
        rightFrontLeg.render();

        var baseTail = new Cube();
        baseTail.color = [.4, .4, .4, 1.0];
        baseTail.matrix.translate(-.35, .01, .18);
        baseTail.matrix.rotate(-98, 0, 0, 1);
        var baseCoords = new Matrix4(baseTail.matrix);
        baseTail.matrix.scale(.04, -.2, -.04);
        baseTail.render();

        var midTail = new Cube();
        midTail.color = [.3, .3, .3, 1.0];
        midTail.matrix = baseCoords;
        midTail.matrix.translate(0, -0.11, 0.002);
        midTail.matrix.rotate(0, 0, 0, 1);
        midTail.matrix.scale(.04, -.18, -.04);
        midTail.render();

        var endTail = new Cube();
        endTail.color = [.2, .2, .2, 1.0];
        endTail.matrix = baseCoords;
        endTail.matrix.translate(0, -0.03, 0.001);
        endTail.matrix.rotate(0, 0, 0, 1);
        endTail.matrix.scale(.04, -.18, -.04);
        endTail.render();

        var baseHead = new Cube();
        baseHead.color = [.3, 0.3, 0.3, 1.0];
        baseHead.matrix.translate(.35, 0, .05);
        baseHead.matrix.rotate(0, 1, 0, 0);
        baseHead.matrix.scale(.2, .2, .2);
        baseHead.render();

        var cone = new Cone(.2, .2, 12);
        cone.color = [.8, .2, .2, 1.0]
        cone.matrix.translate(.45, .195, .15);
        cone.matrix.rotate(90, -90, 0, 1);
        cone.matrix.scale(0.3, 0.3, 0.9);
        cone.render();

        var rightEye = new Cube();
        rightEye.color = [.8, .8, 0, 1.0]
        rightEye.matrix.translate(.53, .115, .12);
        rightEye.matrix.rotate(90, -90, 0, 1);
        rightEye.matrix.scale(0.05, 0.02, .03);
        rightEye.render();

        var leftEye = new Cube();
        leftEye.color = [.8, .8, 0, 1.0]
        leftEye.matrix.translate(.53, .115, .19);
        leftEye.matrix.rotate(90, -90, 0, 1);
        leftEye.matrix.scale(0.05, 0.02, .03);
        leftEye.render();
    }

    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "fps");
}

function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

function tick() {
    g_seconds = performance.now() / 500.0 - g_startTime;
    renderAllShapes();

    requestAnimationFrame(tick);
}


var interval;
function randomControl() {
    interval = setInterval(randomDraw, 1000);

}

function stopRandom() {
    clearInterval(interval);
}



function main() {
    setupWebGL();

    connectVariablesToGLSL();

    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.addEventListener('click', function (event) {
        if (event.shiftKey && altAnimation == false) {
            altAnimation = true
        }
        else if (event.shiftKey && altAnimation == true) {
            altAnimation = false
        }
    });

    canvas.addEventListener('mousedown', function (event) {
        isMouseDown = true;
    });

    canvas.addEventListener('mouseup', function (event) {
        isMouseDown = false;
    });

    canvas.addEventListener('mousemove', function (event) {
        if (isMouseDown) {
            let deltaX = event.clientX - prevMouseX;
            let deltaY = event.clientY - prevMouseY;

            g_globalAngle = deltaX % 360;
        }
    });
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    requestAnimationFrame(tick);
}
