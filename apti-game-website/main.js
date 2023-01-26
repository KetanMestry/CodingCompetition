import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { Mesh, Side } from 'three';
// import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { ques } from '/queList.js'


//Path to file
const testBldg = new URL('assets/test/Level01.glb', import.meta.url);
const testChar = new URL('assets/test/EnemyOne.glb', import.meta.url);



const renderer = new THREE.WebGL1Renderer();

//Scene renderer
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Creating new scene
const scene = new THREE.Scene();

// Creating camera
const camera = new THREE.PerspectiveCamera(
    75, //FOV
    window.innerWidth / window.innerHeight, // aspect ration (currently same as renderer)
    0.1, // near clipping plane
    1000, // far clipping plane
);


// //Instance of orbit control
const orbit = new OrbitControls(camera, renderer.domElement);


//Axis helper
const axesHelper = new THREE.AxesHelper(3); // 3 is length of axis

scene.add(axesHelper);

camera.position.set(0, 1.5, 15);

// //update position of camera on mouse update
orbit.update();

//Creating 3d box
// const boxGeometry = new THREE.PlaneGeometry(10, 10, 10);
// const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
// const box = new THREE.Mesh(boxGeometry, boxMaterial);
// box.rotation.set(90,0,0);
// scene.add(box);


//Adding grid helper
// const gridHelper = new THREE.GridHelper(20) // argument is size of grid
// scene.add(gridHelper)




//Instance of GLTF loader
const assetLoader = new GLTFLoader();
// let enemyModel;

assetLoader.load(testBldg.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(0, 1, 0)
    model.rotation.y = -1 * Math.PI;
},
    undefined,
    function (error) {
        console.log(error);
    }

)

let mixer;
let xPos = -3.5

assetLoader.load(testChar.href, function (gltf) {
    let enemyModel = gltf.scene;
    scene.add(enemyModel);

    mixer = new THREE.AnimationMixer(enemyModel);

    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, "shoot");
    const action = mixer.clipAction(clip);
    action.play();

    enemyModel.position.set(xPos, -0.2, 8);
    enemyModel.rotation.set(0, 0.6, 0)
    // enemyModel.lookAt(camera.position)
},
    undefined,
    function (error) {
        console.log(error);
    }
)




function getOptionText(opt, xPos) {
    //Font loader
    const fontLoader = new FontLoader();
    fontLoader.load('assets/fonts/Unbounded_Regular.json', function (ufont) {
        const fontGeometry = new TextGeometry(opt, {
            font: ufont,
            size: 0.3,
            height: 0.2,

        })

        const textMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const textMesh = new THREE.Mesh(fontGeometry, textMat);


        textMesh.position.set(xPos, 1.8, 8)
        scene.add(textMesh);
    });
}


//lights
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2);
scene.add(directionalLight);
directionalLight.position.set(0, 40, 20);
directionalLight.target.position.set(0, 0, 0);

const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 2);
scene.add(directionalLight2);
directionalLight2.position.set(20, 40, 20);
// directionalLight2.rotation.y = -0.5 * Math.PI;
directionalLight2.target.position.set(0, 0, 0);

const directionalLight3 = new THREE.DirectionalLight(0xFFFFFF, 2);
scene.add(directionalLight3);
directionalLight3.position.set(-20, 40, 20);
// directionalLight2.rotation.y = -0.5 * Math.PI;
directionalLight3.target.position.set(0, 0, 0);


//light helper
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight3);
scene.add(dLightHelper);


const clock = new THREE.Clock();
// let step = 0;
//Function to move camera (updates camera pos at every frame)
// function moveCamera(){

//     mixer.update(clock.getDelta());

//     requestAnimationFrame(moveCamera);
//     orbit.update();
//     renderer.render(scene, camera)  

//     // step += 0.01;
//     // enemyModel.position.z = 10* Math.abs(Math.sin(step));

// }
// moveCamera();


let shoot = false;

function animate() {

    if (shoot)
        if (mixer)
            mixer.update(clock.getDelta());
    renderer.render(scene, camera);
}

// renderer.render(scene,camera);

renderer.setAnimationLoop(animate);


const cont = document.getElementById("que_container");

cont.innerHTML = ques[0].que


// animating que container
const animateContStart =    [
    {transform: ' translateY(-100px)'},
    {transform: ' translateY(7px)'}];


const animateContEnd =  [
    {transform: ' translateY(6px)'},
    {transform: ' translateY(-100px)'}];
const animateTime=
    {
        //duration
        duration:1000,
        iteration:1
    }





const btn = document.getElementById("btn");

btn.addEventListener('click', () => {
    shoot ? shoot = false : shoot = true;
    cont.animate(animateContStart, animateTime);
})