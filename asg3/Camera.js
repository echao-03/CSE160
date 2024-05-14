class Camera {
    constructor() {
        this.eye = new Vector3([2.5, 0, 2]);
        this.at = new Vector3([0, 0, -100]);
        this.up = new Vector3([0, 1, 0]);
    }

    forward() {
        let f = new Vector3();
        f = f.set(this.at);
        f = f.sub(this.eye);

        f.normalize();
        f = f.mul(0.2);
        this.eye.add(f);
        this.at.add(f);

    }

    backward() {
        let f = new Vector3();
        f = f.set(this.eye);
        f = f.sub(this.at);

        f.normalize();
        f = f.mul(0.2);
        this.eye.add(f);
        this.at.add(f);

    }

    moveLeft() {
        let f = new Vector3();
        f = f.set(this.at);
        f = f.sub(this.eye);
        let s = Vector3.cross(this.up, f);

        s.normalize();
        s = s.mul(0.2);
        this.eye.add(s);
        this.at.add(s);
    }

    moveRight() {
        let f = new Vector3();
        f = f.set(this.at);
        f = f.sub(this.eye);
        let s = Vector3.cross(f, this.up);

        s.normalize();
        s = s.mul(0.2);
        this.eye.add(s);
        this.at.add(s);
    }

    panLeft() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let g = new Matrix4();
        g.setRotate(30, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = g.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(f_prime);
        // console.log("Eye: ", this.eye.elements[0], this.eye.elements[1], this.eye.elements[2]);
        // console.log("At: ", this.at.elements[0], this.at.elements[1], this.at.elements[2]);
        // console.log("Up: ", this.up.elements[0], this.up.elements[1], this.up.elements[2]);

    }

    panRight() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let g = new Matrix4();
        g.setRotate(-30, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = g.multiplyVector3(f);
        this.at.set(this.eye);
        this.at.add(f_prime);
        // console.log("Eye: ", this.eye.elements[0], this.eye.elements[1], this.eye.elements[2]);
        // console.log("At: ", this.at.elements[0], this.at.elements[1], this.at.elements[2]);
        // console.log("Up: ", this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    panUp() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let g = new Matrix4();
        let xRotate = Vector3.cross(f, this.up).elements;
        g.setRotate(10, xRotate[0], xRotate[1], xRotate[2]);
        let f_prime = g.multiplyVector3(f);
        f_prime.normalize();
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    panDown() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let g = new Matrix4();
        let xRotate = Vector3.cross(f, this.up).elements;
        g.setRotate(-10, xRotate[0], xRotate[1], xRotate[2]);
        let f_prime = g.multiplyVector3(f);
        f_prime.normalize();
        this.at.set(this.eye);
        this.at.add(f_prime);
    }
}