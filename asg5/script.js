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

const geometry = new THREE.BoxGeometry(1, 1, 1);

// Creating textured ground
const planeSize = 40;

const flat = new THREE.TextureLoader();
const texture = flat.load('imgs/checker.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
const repeats = planeSize / 2;
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
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
// const helper = new THREE.DirectionalLightHelper(light, 5);
light.position.set(17, 14, -10);
scene.add(light);
// scene.add(helper);



const loader = new THREE.TextureLoader();

const bg_loader = new THREE.TextureLoader();
const bg_texture = loader.load(
    'imgs/eq_background.jpg',
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
const dice = new THREE.Mesh(geometry, materials);
dice.position.x = -1
scene.add(dice);


function loadColorTexture(path) {
    const texture = loader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    cube.position.z = -1.5;

    return cube;
}

const cubes = [
];

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

    requestAnimationFrame(render);

}
requestAnimationFrame(objRender);
requestAnimationFrame(render);
