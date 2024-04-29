class Cone {
    constructor(radius, height, segments) {
        this.type = 'cone';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.radius = radius;
        this.height = height;
        this.segments = segments;
    }

    render() {
        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Define vertices for the base circle
        const baseVertices = [];
        for (let i = 0; i < this.segments; i++) {
            const theta = (i / this.segments) * 2 * Math.PI;
            const x = this.radius * Math.cos(theta);
            const y = this.radius * Math.sin(theta);
            baseVertices.push(x, y, 0);
        }

        // Define apex vertex
        const apexVertex = [0, 0, this.height];

        // Draw triangles connecting apex to base vertices
        for (let i = 0; i < this.segments; i++) {
            const nextIndex = (i + 1) % this.segments;
            const baseVertex1 = baseVertices.slice(i * 3, i * 3 + 3);
            const baseVertex2 = baseVertices.slice(nextIndex * 3, nextIndex * 3 + 3);
            drawTriangle3D(apexVertex.concat(baseVertex1, baseVertex2));
        }

        // Draw base triangles
        for (let i = 0; i < this.segments; i++) {
            const nextIndex = (i + 1) % this.segments;
            const baseVertex1 = baseVertices.slice(i * 3, i * 3 + 3);
            const baseVertex2 = baseVertices.slice(nextIndex * 3, nextIndex * 3 + 3);
            drawTriangle3D([0, 0, 0].concat(baseVertex1, baseVertex2));
        }
    }
}