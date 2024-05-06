
// Import the drawPicture function from Picture.js
// import { drawPicture } from './Picture.js';

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    uniform float u_Size;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }`

// Fragment shader program

var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
        gl_FragColor = u_FragColor;  // use color
    }else if (u_whichTexture == -1) {
        gl_FragColor = vec4(v_UV, 1.0, 1.0); // use UV debug color
    }else if (u_whichTexture == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV); // use texture0
    }else if (u_whichTexture == 1) {
        gl_FragColor = texture2D(u_Sampler1, v_UV);
    
    } else {
        gl_FragColor = vec4(1,0.2,0.2,1); // error, put redish
    }
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;

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



function setUpWebGL() {
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
    console.log("gl.COMPILE_STATUS:", gl.COMPILE_STATUS);
    if (!gl.COMPILE_STATUS) {
        console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    }
    //    gl.getProgramParameter(program, gl.LINK_STATUS);
    console.log("gl.LINK_STATUS:", gl.LINK_STATUS);

    //  // Specify the depth function, the default is gl.LESS
    //  gl.depthFunc(gl.LEQUAL);

    //  // Clear the depth buffer
    //  gl.clearDepth(1.0);
    //  gl.clear(gl.DEPTH_BUFFER_BIT);

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

    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_ModelMatrix
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

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }

    // get the storage location of u_Sampler
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler1');
        return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_whichTexture');
        return;
    }



    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
    //   gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);

}



// Set up actions for the HTML UI elements

function addActionsForHtmlUI() {

    //  document.getElementById('redSlider').addEventListener('mouseup', function () { g_selectedColor[0] = this.value / 100; });
    //  document.getElementById('greenSlider').addEventListener('mouseup', function () { g_selectedColor[1] = this.value / 100; });
    document.getElementById('legJoint').addEventListener('mousemove', function () { g_legAngle = this.value; renderAllShapes(); });

    // document.getElementById('sizeSlider').addEventListener('mouseup', function () { g_selectSize = this.value; });
    // document.getElementById('segmentSlider').addEventListener('mouseup', function () { c_segments = this.value; });
    document.getElementById('angleSlide').addEventListener('mousemove', function () { g_globalAngle = this.value; renderAllShapes(); });

}


function initTextures() {
    var image1 = new Image();  // Create the image object
    if (!image1) {
        console.log('Failed to create the image1 object');
        return false;
    }

    var image2 = new Image();
    if (!image2) {
        console.log('Failed to create the image2 object');
    }
    // Register the event handler to be called on loading an image
    image1.onload = function () { sendImageToTEXTURE0(image1); };
    image1.src = '/img/sky_1.jpg';

    image2.onload = function () { sendImageToTEXTURE1(image2); };
    image2.src = '/img/grass.jpg';

    // add more textures loading
    return true;
}

// can use switch statements to make it work better for u
function sendImageToTEXTURE0(image) {
    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler0, 0);
    console.log('finished loadTexture1');

}

function sendImageToTEXTURE1(image) {
    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler1, 1);
    console.log('finished loadTexture2');

}

function main() {
    // Set up canvas and get gl variables
    setUpWebGL();

    // Set up GLSL shader programs and connect JS variables to GLSL
    connectVariablesToGLSL();

    // Set up actions for the HTML UI Elements
    addActionsForHtmlUI();

    document.onkeydown = keydown;

    initTextures();

    gl.clearColor(30 / 255, 130 / 255, 76 / 255, 1.0); // make background green

    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // renderAllShapes();
    requestAnimationFrame(tick);

}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;
// called by browser repeatedly whenever it's time

function tick() {
    g_seconds = performance.now() / 500.0 - g_startTime;
    renderAllShapes();

    requestAnimationFrame(tick);
}


var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = []; // The array to store the size of a point



function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return ([x, y]);
}

function keydown(ev) {
    if (ev.keyCode == 39) {
        g_eye[0] += 0.2;
    }
    else if (ev.keyCode == 37) {
        g_eye[0] -= 0.2;
    }

    else if (ev.keyCode == 38) {
        g_eye[2] -= 0.2;
    }

    else if (ev.keyCode == 40) {
        g_eye[2] += 0.2;
    }

    renderAllShapes();
    console.log(ev.keyCode);
}

var g_eye = [0, 0, 2];
var g_at = [0, 0, -100];
var g_head = [0, 1, 0];


function renderAllShapes() {
    // Check the time at the start of the function
    var startTime = performance.now();

    // makes viewing the blocks possible
    var projMat = new Matrix4();
    projMat.setPerspective(50, canvas.width / canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_head[0], g_head[1], g_head[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    // Pass the matrix to u_ModelMatrix.attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw a test triangle
    // drawTriangle3D([-1.0,0.0,0.0, -0.5, -1.0, 0.0, 0.0, 0.0, 0.0]);

    // draw the body cube
    // body.color = [1.0, 0.0, 0.0, 1.0];

    var sky = new Cube();
    sky.textureNum = 0;
    sky.color = [.5, .5, .5, 1.0];
    sky.matrix.scale(20, 20, 20);
    sky.matrix.translate(-.5, -.5, -.5);
    sky.render();

    var ground = new Cube();
    ground.textureNum = 1;
    ground.matrix.translate(0, -0.75, 0);
    ground.matrix.scale(10, 0, 10);
    ground.matrix.translate(-.5, 2, -.5);
    ground.render();

    var body = new Cube();
    body.textureNum = -1;
    body.color = [.5, 0.5, 0.5, 1.0];
    body.matrix.translate(-.4, -.2, -0.0);
    body.matrix.rotate(0, 1, 0, 0);
    body.matrix.scale(.8, .3, .3);
    body.render();

    var leftBackLeg = new Cube();
    leftBackLeg.textureNum = body.textureNum;
    leftBackLeg.color = [.5, 0.5, 0.5, 1.0];
    leftBackLeg.matrix.translate(-.25, -.13, .12);
    leftBackLeg.matrix.rotate(45 * -Math.sin(g_seconds), 0, 0, 1)
    leftBackLeg.matrix.scale(-.08, -.3, -.05);
    leftBackLeg.render();

    var rightBackLeg = new Cube();
    rightBackLeg.textureNum = body.textureNum;
    rightBackLeg.color = [.5, 0.5, 0.5, 1.0];
    rightBackLeg.matrix.translate(-.25, -.13, .25);
    rightBackLeg.matrix.rotate(45 * Math.sin(g_seconds), 0, 0, 1)
    rightBackLeg.matrix.scale(-.08, -.3, -.05);
    rightBackLeg.render();

    var leftFrontLeg = new Cube();
    leftFrontLeg.textureNum = body.textureNum;
    leftFrontLeg.color = [.5, 0.5, 0.5, 1.0];
    leftFrontLeg.matrix.translate(.25, -.13, .25);
    leftFrontLeg.matrix.rotate(45 * -Math.sin(g_seconds), 0, 0, 1)
    leftFrontLeg.matrix.scale(-.08, -.3, -.05);
    leftFrontLeg.render();

    var rightFrontLeg = new Cube();
    rightFrontLeg.textureNum = body.textureNum;
    rightFrontLeg.color = [.5, 0.5, 0.5, 1.0];
    rightFrontLeg.matrix.translate(.25, -.13, .12);
    rightFrontLeg.matrix.rotate(45 * Math.sin(g_seconds), 0, 0, 1)
    rightFrontLeg.matrix.scale(-.08, -.3, -.05);
    rightFrontLeg.render();

    var baseTail = new Cube();
    baseTail.textureNum = body.textureNum;
    baseTail.color = [.4, .4, .4, 1.0];
    baseTail.matrix.translate(-.35, .01, .18);
    let rotationAngle = Math.sin(g_seconds) * 0.5 + 0.5;
    let rotoAng = -rotationAngle * (120 - 40) - 40;

    baseTail.matrix.rotate(rotoAng, 0, 0, 1);
    var baseCoords = new Matrix4(baseTail.matrix);
    baseTail.matrix.scale(.04, -.2, -.04);
    baseTail.render();

    var midTail = new Cube();
    midTail.textureNum = body.textureNum;
    midTail.color = [.3, .3, .3, 1.0];
    midTail.matrix = baseCoords;
    midTail.matrix.translate(0, -0.11, 0.002);
    midTail.matrix.rotate(0, 0, 0, 1);
    midTail.matrix.scale(.04, -.18, -.04);
    midTail.render();

    var endTail = new Cube();
    endTail.textureNum = body.textureNum;
    endTail.color = [.2, .2, .2, 1.0];
    endTail.matrix = baseCoords;
    endTail.matrix.translate(0, -0.03, 0.001);
    endTail.matrix.rotate(0, 0, 0, 1);
    endTail.matrix.scale(.04, -.18, -.04);
    endTail.render();

    var baseHead = new Cube();
    baseHead.textureNum = body.textureNum;
    baseHead.color = [.3, 0.3, 0.3, 1.0];
    baseHead.matrix.translate(.35, 0, .05);
    baseHead.matrix.rotate(0, 1, 0, 0);
    baseHead.matrix.scale(.2, .2, .2);
    baseHead.render();

    var cone = new Cone(.2, .2, 12);
    cone.textureNum = body.textureNum;
    cone.color = [.8, .2, .2, 1.0]
    cone.matrix.translate(.45, .195, .15);
    cone.matrix.rotate(90, -90, 0, 1);
    cone.matrix.scale(0.3, 0.3, 0.9);
    cone.render();

    var rightEye = new Cube();
    rightEye.textureNum = body.textureNum;
    rightEye.color = [.8, .8, 0, 1.0]
    rightEye.matrix.translate(.53, .115, .12);
    rightEye.matrix.rotate(90, -90, 0, 1);
    rightEye.matrix.scale(0.05, 0.02, .03);
    rightEye.render();

    var leftEye = new Cube();
    leftEye.textureNum = body.textureNum;
    leftEye.color = [.8, .8, 0, 1.0]
    leftEye.matrix.translate(.53, .115, .19);
    leftEye.matrix.rotate(90, -90, 0, 1);
    leftEye.matrix.scale(0.05, 0.02, .03);
    leftEye.render();



    // check the time at the end of the function and show on web page
    var duration = performance.now() - startTime;
    // sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");
    // sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration)/10);
    sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(1000 / duration) / 10, "fps");
}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from the HTML");
        return;
    }
    htmlElm.innerHTML = text;
}