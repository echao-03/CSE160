class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = 0;
    }

    render() {
        var rgba = this.color;

        // Pass the position of a point to a_Position variable
        // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);



        // Draw

        // Front of cube
        drawTriangle3DUV([0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 1, 1, 0]);
        drawTriangle3DUV([0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1]);

        gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
        // Top of cube
        drawTriangle3DUV([0, 1, 0, 0, 1, 1, 1, 1, 1], [0, 0, 1, 1, 1, 0]);
        drawTriangle3DUV([0, 1, 0, 1, 1, 1, 1, 1, 0], [0, 0, 0, 1, 1, 1])
        // Right side of cube
        drawTriangle3DUV([1, 1, 0, 1, 1, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0]);
        drawTriangle3DUV([1, 0, 0, 1, 1, 1, 1, 0, 1], [0, 0, 0, 1, 1, 1]);
        gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
        // Left side of cube
        drawTriangle3DUV([0, 1, 0, 0, 1, 1, 0, 0, 0], [0, 0, 1, 1, 1, 0]);
        drawTriangle3DUV([0, 0, 0, 0, 1, 1, 0, 0, 1], [0, 0, 0, 1, 1, 1]);
        // Bottom side of cube
        drawTriangle3DUV([0, 0, 0, 0, 0, 1, 1, 0, 1], [0, 0, 0, 1, 1, 1]);
        drawTriangle3DUV([0, 0, 0, 1, 0, 1, 1, 0, 0], [0, 0, 1, 1, 1, 0]);

        // Back side of cube
        drawTriangle3DUV([0, 0, 1, 1, 1, 1, 1, 0, 1], [0, 0, 1, 1, 1, 0]);
        drawTriangle3DUV([0, 0, 1, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1]);


    }

    renderfast() {
        var rgba = this.color;

        // Pass the position of a point to a_Position variable
        // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform1i(u_whichTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var allverts = [];

        // Draw
        allverts = allverts.concat([0, 0, 0, 1, 1, 0, 1, 0, 0]);
        allverts = allverts.concat([0, 0, 0, 0, 1, 0, 1, 1, 0]);

        allverts = allverts.concat([0, 1, 0, 0, 1, 1, 1, 1, 1]);
        allverts = allverts.concat([0, 1, 0, 1, 1, 1, 1, 1, 0]);

        allverts = allverts.concat([1, 1, 0, 1, 1, 1, 1, 0, 0]);
        allverts = allverts.concat([1, 0, 0, 1, 1, 1, 1, 0, 1]);

        allverts = allverts.concat([0, 1, 0, 0, 1, 1, 0, 0, 0]);
        allverts = allverts.concat([0, 0, 0, 0, 1, 1, 0, 0, 1]);

        allverts = allverts.concat([0, 0, 0, 0, 0, 1, 1, 0, 1]);
        allverts = allverts.concat([0, 0, 0, 1, 0, 1, 1, 0, 0]);

        allverts = allverts.concat([0, 0, 1, 1, 1, 1, 1, 0, 1]);
        allverts = allverts.concat([0, 0, 1, 0, 1, 1, 1, 1, 1]);

        drawTriangle3D(allverts);
        // Front of cube
        // drawTriangle3DUV([0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 1, 1, 0]);
        // drawTriangle3DUV([0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1]);

        // gl.uniform4f(u_FragColor, rgba[0] * .9, rgba[1] * .9, rgba[2] * .9, rgba[3]);
        // // Top of cube
        // drawTriangle3DUV([0, 1, 0, 0, 1, 1, 1, 1, 1], [0, 0, 1, 1, 1, 0]);
        // drawTriangle3DUV([0, 1, 0, 1, 1, 1, 1, 1, 0], [0, 0, 0, 1, 1, 1])
        // // Right side of cube
        // drawTriangle3DUV([1, 0, 0, 1, 1, 0, 1, 1, 1], [0, 0, 1, 1, 1, 0]);
        // drawTriangle3DUV([1, 0, 0, 1, 1, 1, 1, 0, 1], [0, 0, 0, 1, 1, 1]);
        // gl.uniform4f(u_FragColor, rgba[0] * .8, rgba[1] * .8, rgba[2] * .8, rgba[3]);
        // // Left side of cube
        // drawTriangle3DUV([0, 0, 0, 0, 0, 1, 0, 1, 1], [0, 0, 1, 1, 1, 0]);
        // drawTriangle3DUV([0, 0, 0, 0, 1, 1, 0, 1, 0], [0, 0, 0, 1, 1, 1]);
        // // Bottom side of cube
        // drawTriangle3DUV([0, 0, 0, 1, 0, 0, 1, 0, 1], [0, 0, 0, 1, 1, 1]);
        // drawTriangle3DUV([0, 0, 0, 1, 0, 1, 0, 0, 1], [0, 0, 1, 1, 1, 0]);

        // // Back side of cube
        // drawTriangle3DUV([0, 0, 1, 1, 0, 1, 1, 1, 1], [0, 0, 1, 1, 1, 0]);
        // drawTriangle3DUV([0, 0, 1, 1, 1, 1, 0, 1, 1], [0, 0, 0, 1, 1, 1]);


    }
}
