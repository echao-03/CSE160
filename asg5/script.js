import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const scene = new THREE.Scene();
// Camera settings
const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 50;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 2;
controls.update();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



// Creating textured ground
const planeSize = 40;

const flat = new THREE.TextureLoader();
const texture = flat.load('imgs/cement.jpg');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
const repeats = planeSize / 16;
texture.repeat.set(repeats, repeats);


const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
mesh.translateZ(-1);
scene.add(mesh);



const color = 0xFFFFFF;
const intensity = 0.2;
const light = new THREE.DirectionalLight(color, intensity);
const helper = new THREE.DirectionalLightHelper(light, 5);
light.position.set(17, 14, -10);
scene.add(light);
scene.add(helper);



const loader = new THREE.TextureLoader();

const bg_loader = new THREE.TextureLoader();
const bg_texture = loader.load(
    'imgs/star_bg.jpg',
    () => {
        bg_texture.mapping = THREE.EquirectangularReflectionMapping;
        bg_texture.colorSpace = THREE.SRGBColorSpace;
        scene.background = bg_texture;
    });

const materials = [
    new THREE.MeshPhongMaterial({ map: loadColorTexture('imgs/dice_1.svg') }),
    new THREE.MeshPhongMaterial({ map: loadColorTexture('imgs/dice_2.svg') }),
    new THREE.MeshPhongMaterial({ map: loadColorTexture('imgs/dice_3.svg') }),
    new THREE.MeshPhongMaterial({ map: loadColorTexture('imgs/dice_4.svg') }),
    new THREE.MeshPhongMaterial({ map: loadColorTexture('imgs/dice_5.svg') }),
    new THREE.MeshPhongMaterial({ map: loadColorTexture('imgs/dice_6.svg') }),


];

const cubeWidth = 1;
const cubeHeight = 1;
const cubeDepth = 1;


const cubeGeometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
const dice = new THREE.Mesh(cubeGeometry, materials);
dice.position.x = -1
scene.add(dice);


const streetMainGeometry = new THREE.BoxGeometry(3, 0.5, 40);
const streetMainMaterial = new THREE.MeshBasicMaterial({ color: 0x222423 });
const streetMain = new THREE.Mesh(streetMainGeometry, streetMainMaterial);
streetMain.position.y = -1;
scene.add(streetMain);

const streetSideGemoetry1 = new THREE.BoxGeometry(1.3, 0.5, 40);
const streetSideMaterial1 = new THREE.MeshPhongMaterial({ map: loadColorTexture('imgs/cement_2.jpg') });
const streetSide1 = new THREE.Mesh(streetSideGemoetry1, streetSideMaterial1);
streetSide1.position.y = -0.8;
streetSide1.position.x = -2;
scene.add(streetSide1);


const streetSideGemoetry2 = new THREE.BoxGeometry(1.3, 0.5, 40);
const streetSideMaterial2 = new THREE.MeshPhongMaterial({ map: loadColorTexture('imgs/cement_2.jpg') });
const streetSide2 = new THREE.Mesh(streetSideGemoetry2, streetSideMaterial2);
streetSide2.position.y = -0.8;
streetSide2.position.x = 2;
scene.add(streetSide2);

const woodStepGeometry1 = new THREE.BoxGeometry(0.4, 0.2, 1);
const woodStepMaterial1 = new THREE.MeshPhongMaterial({ map: loadColorTexture('imgs/wood_1.jpg') });
const woodStep1 = new THREE.Mesh(woodStepGeometry1, woodStepMaterial1);
woodStep1.position.y = -1;
woodStep1.position.x = 5;
woodStep1.position.z = -1.4;
scene.add(woodStep1);

const woodStepGeometry2 = new THREE.BoxGeometry(0.4, 0.2, 1);
const woodStepMaterial2 = new THREE.MeshPhongMaterial({ map: loadColorTexture('imgs/wood_1.jpg') });
const woodStep2 = new THREE.Mesh(woodStepGeometry2, woodStepMaterial2);
woodStep2.position.y = -1;
woodStep2.position.x = 4;
woodStep2.position.z = -1.4;
scene.add(woodStep2);

const rainCount = 2000;
const rain_pos = [];


const rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.1,
    transparent: true,
});

for (let i = 0; i < rainCount; i++) {
    const rainGeometry = new THREE.BufferGeometry();
    rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rain_pos, 3));

    const rain = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rain);
    rain_pos.push();
}





function loadColorTexture(path) {
    const texture = loader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}



const cubes = [];

cubes.push(dice);


const mtlLoader = new MTLLoader();
mtlLoader.load('models/materials.mtl', (mtl) => {

    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('models/bongo_cat.obj', (root) => {
        root.translateZ(1);
        scene.add(root);
        objects.push(root);
    });

});

const mtlLoader_2 = new MTLLoader();
mtlLoader_2.load('models/bottleKetchup.mtl', (mtl) => {

    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('models/bottleKetchup.obj', (root) => {
        root.translateZ(-1);
        root.translateX(0.5);
        scene.add(root);
        objects.push(root);
    });

});

const mtlLoader_3 = new MTLLoader();
mtlLoader_3.load('models/street_lamp.mtl', (mtl) => {

    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('models/street_lamp.obj', (root) => {
        root.translateZ(-3);
        root.translateY(0.65);
        root.translateX(-1.5);
        scene.add(root);
        scene.updateMatrixWorld(true);
        var position = new THREE.Vector3();
        position.setFromMatrixPosition(root.matrixWorld);

        const light = new THREE.PointLight(0xd6be87, 0.8);
        const helper = new THREE.PointLightHelper(light, 1);
        light.position.set(-1, 2, -3);
        scene.add(light);
        scene.add(helper);
    });

});

const mtlLoader_4 = new MTLLoader();
mtlLoader_4.load('models/street_lamp.mtl', (mtl) => {

    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('models/street_lamp.obj', (root) => {
        root.translateZ(8);
        root.translateY(0.65);
        root.translateX(1.5);
        root.rotateY(2.9);
        scene.add(root);
        scene.updateMatrixWorld(true);
        var position = new THREE.Vector3();
        position.setFromMatrixPosition(root.matrixWorld);
        console.log(root.position);
        const light = new THREE.PointLight(0xd6be87, 0.8);
        const helper = new THREE.PointLightHelper(light, 1);
        light.position.set(root.position.x - .5, root.position.y + 1.35, root.position.z);
        scene.add(light);
        scene.add(helper);
    });

});

const mtlLoader_5 = new MTLLoader();
mtlLoader_5.load('models/house_1.mtl', (mtl) => {

    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('models/house_1.obj', (root) => {
        root.translateZ(-1);
        root.translateX(8);
        root.translateY(2.4);
        root.rotateY(1.55);
        root.scale.set(6, 6, 6);
        scene.add(root);
    });

});

const mtlLoader_6 = new MTLLoader();
mtlLoader_6.load('models/bush_1.mtl', (mtl) => {

    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('models/bush_1.obj', (root) => {
        root.translateZ(1);
        root.translateX(4.5);
        root.translateY(-0.8);
        root.rotateY(1.55);
        root.scale.set(12, 12, 12);
        scene.add(root);
    });

});

const mtlLoader_7 = new MTLLoader();
mtlLoader_7.load('models/bush_1.mtl', (mtl) => {

    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('models/bush_1.obj', (root) => {
        root.translateZ(-4);
        root.translateX(4.5);
        root.translateY(-0.8);
        root.rotateY(1.55);
        root.scale.set(12, 12, 12);
        scene.add(root);
    });

});

const mtlLoader_8 = new MTLLoader();
mtlLoader_8.load('models/tree_1.mtl', (mtl) => {

    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('models/tree_1.obj', (root) => {
        root.translateZ(-8);
        root.translateX(4.5);
        root.translateY(3);
        root.rotateY(1.55);
        root.scale.set(4, 4, 4);
        scene.add(root);
    });

});

const objects = [];

function objRender(time) {
    time *= 0.001; // convert time to seconds

    objects.forEach((object, ndx) => {

        const speed = 1 + ndx * .1;
        const rot = time * speed;

        object.rotation.y = rot;

    });

    renderer.render(scene, camera);

    requestAnimationFrame(objRender);
}

function render(time) {

    time *= 0.001; // convert time to seconds

    cubes.forEach((cube, ndx) => {

        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;

    });
    controls.update();
    renderer.render(scene, camera);

    for (let i = 0; i < rain_pos.length; i += 3) {
        positions[i + 1] -= 0.1;  // y position

        // Reset position if below threshold
        if (positions[i + 1] < -250) {
            positions[i + 1] = 250;
        }

    }
    requestAnimationFrame(render);



}
requestAnimationFrame(objRender);
requestAnimationFrame(render);
