// DrawRectangle.j

function getCanvasAndContext() {
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return null;
    }
    var ctx = canvas.getContext('2d');
    return { canvas: canvas, ctx: ctx };
}

function main() {
    // Retrieve <canvas> element <- (1)
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Get the rendering context for 2DCG <- (2)
    var ctx = canvas.getContext('2d');
    // Draw a blue rectangle <- (3)
    canvas.style.backgroundColor = "black";
    ctx.fillRect(0, 0, example.width, example.height); // Fill a rectangle with the color
}



function drawVector(v, color) {
    var ctx = getCanvasAndContext().ctx;
    var canvas = getCanvasAndContext().canvas;
    ctx.beginPath();
    ctx.moveTo(canvas.height / 2, canvas.width / 2);
    ctx.lineTo((canvas.width / 2) + v.elements[0] * 20, (canvas.height / 2) - v.elements[1] * 20);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function handleDrawEvent() {
    var ctx = getCanvasAndContext().ctx;
    var canvas = getCanvasAndContext().canvas;
    ctx.fillStyle = 'black'; // Set a blue color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
    var input1 = document.getElementById("input1");
    var input2 = document.getElementById("input2");
    var inputValue = input1.value;
    var inputValue2 = input2.value;
    var input3 = document.getElementById("input3");
    var input4 = document.getElementById("input4");
    var inputValue3 = input3.value;
    var inputValue4 = input4.value;
    var v1 = new Vector3([inputValue, inputValue2, 0]);
    var v2 = new Vector3([inputValue3, inputValue4, 0]);
    drawVector(v1, "red");
    drawVector(v2, "blue");
}

function angleBetween(v1, v2) {
    let output1 = +v1.magnitude() * +v2.magnitude();
    let output2 = Vector3.dot(v1, v2);
    let output3 = +output2 / +output1;
    console.log("Angle: " + Math.acos(output3) * 180 / Math.PI);

}

function areaTriangle(v1, v2) {
    let v3 = Vector3.cross(v1, v2);
    console.log("Area of the triangle: " + v3.magnitude() / +2);
}

function handleDrawOperationEvent() {
    var ctx = getCanvasAndContext().ctx;
    var canvas = getCanvasAndContext().canvas;
    ctx.fillStyle = 'black'; // Set a blue color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
    var input1 = document.getElementById("input1");
    var input2 = document.getElementById("input2");
    var inputValue = input1.value;
    var inputValue2 = input2.value;
    var input3 = document.getElementById("input3");
    var input4 = document.getElementById("input4");
    var inputValue3 = input3.value;
    var inputValue4 = input4.value;

    var dropdown = document.getElementById("operation-select");
    var selectedValue = dropdown.value;

    var v1 = new Vector3([inputValue, inputValue2, 0]);
    var v2 = new Vector3([inputValue3, inputValue4, 0]);
    drawVector(v1, "red");
    drawVector(v2, "blue");

    var magVal1 = 0;
    var magVal2 = 0;

    var scalar_input = document.getElementById("scalar_input");
    var scalarInput = scalar_input.value;

    if (selectedValue == "add") {
        drawVector(v1.add(v2), "green");
    }

    else if (selectedValue == "sub") {
        drawVector(v1.sub(v2), "green");
    }

    else if (selectedValue == "mult") {
        drawVector(v1.mul(scalarInput), "green");
        drawVector(v2.mul(scalarInput), "green");
    }

    else if (selectedValue == "div") {
        drawVector(v1.div(scalarInput), "green");
        drawVector(v2.div(scalarInput), "green");
    }

    else if (selectedValue == "mag") {
        magVal1 = v1.magnitude();
        magVal2 = v2.magnitude();
        console.log("Magnitude v1: " + magVal1);
        console.log("Magnitude v2: " + magVal2);
    }

    else if (selectedValue == "norm") {
        drawVector(v1.normalize(), "green");
        drawVector(v2.normalize(), "green");
    }

    else if (selectedValue == "angle") {
        angleBetween(v1, v2);
    }

    else if (selectedValue == "area") {
        areaTriangle(v1, v2);

    }

}

