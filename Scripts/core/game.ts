/// <reference path="_reference.ts"/>

// MAIN GAME FILE

// THREEJS Aliases
import Scene = THREE.Scene;
import Renderer = THREE.Renderer;
import WebGLRenderer = THREE.WebGLRenderer;
import CanvasRenderer = THREE.CanvasRenderer;
import Camera = THREE.Camera;
import PerspectiveCamera = THREE.PerspectiveCamera;
import OrthographicCamera = THREE.OrthographicCamera;
import BoxGeometry = THREE.BoxGeometry;
import CubeGeometry = THREE.CubeGeometry;
import PlaneGeometry = THREE.PlaneGeometry;
import SphereGeometry = THREE.SphereGeometry;
import Geometry = THREE.Geometry;
import AxisHelper = THREE.AxisHelper;
import CameraHelper = THREE.CameraHelper;
import LambertMaterial = THREE.MeshLambertMaterial;
import MeshBasicMaterial = THREE.MeshBasicMaterial;
import MeshDepthMaterial = THREE.MeshDepthMaterial;
import Material = THREE.Material;
import Texture = THREE.Texture;
import RepeatWrapping = THREE.RepeatWrapping;
import Mesh = THREE.Mesh;
import Object3D = THREE.Object3D;
import SpotLight = THREE.SpotLight;
import PointLight = THREE.PointLight;
import AmbientLight = THREE.AmbientLight;
import DirectionalLight = THREE.DirectionalLight;
import HemisphereLight = THREE.HemisphereLight;
import Control = objects.Control;
import GUI = dat.GUI;
import Color = THREE.Color;
import Vector3 = THREE.Vector3;
import Face3 = THREE.Face3;
import Point = objects.Point;
import Fog = THREE.Fog;
import LensFlare = THREE.LensFlare;
import AdditiveBlending = THREE.AdditiveBlending;

//Custom Game Objects
import gameObject = objects.gameObject;

var scene: Scene;
var renderer: Renderer;
var webGLRenderer: WebGLRenderer;
var canvasRenderer: CanvasRenderer;
var camera: PerspectiveCamera;
var axes: AxisHelper;
var directionalLightHelper: CameraHelper;
var cube: Mesh;
var plane: Mesh;
var sphere: Mesh;
var ambientLight: AmbientLight;
var ambientColour: string;
var spotLight: SpotLight;
var directionalLight: DirectionalLight;
var pointColour: string;
var pointLight: PointLight;
var hemiLight: HemisphereLight;
var control: Control;
var gui: GUI;
var stats: Stats;
var step: number = 0;
var invert: number = 1;
var phase: number = 0;
var target: Object3D;
var stopMovingLight: boolean = false;
var planeMaterial: LambertMaterial;
var planeGeometry: PlaneGeometry;
var cubeMaterial: LambertMaterial;
var cubeGeometry: CubeGeometry;
var sphereMaterial: LambertMaterial;
var sphereGeometry: SphereGeometry;
var sphereLight: SphereGeometry;
var sphereLightMaterial: MeshBasicMaterial;
var sphereLightMesh: Mesh;
var groundGeometry: PlaneGeometry;
var groundMaterial: MeshBasicMaterial;
var groundMesh: Mesh;
var meshMaterial: MeshBasicMaterial;
var overrideMaterial: MeshDepthMaterial;

function init() {
    // Instantiate a new Scene object
    scene = new Scene();
    scene.overrideMaterial = new MeshDepthMaterial();

    setupRenderer(); // setup the default renderer
	
    setupCamera(); // setup the camera
	
    // add an axis helper to the scene
    axes = new AxisHelper(20);
    scene.add(axes);
    console.log("Added Axis Helper to scene...");
     
    //Add a Plane to the Scene
    groundGeometry = new PlaneGeometry(1000, 100, 4, 4);
    groundMaterial = new MeshBasicMaterial({ color: 0x777777 });
    groundMesh = new Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI * 0.5;
    groundMesh.position.y = -20;
    scene.add(groundMesh);
    console.log("Added Ground Mesh to scene...");

    // Setup Shape Geometries
    sphereGeometry = new SphereGeometry(14, 20, 20);
    cubeGeometry = new CubeGeometry(15, 15, 15);
    planeGeometry = new PlaneGeometry(14, 14, 4, 4);
    
    // Setup Shared MeshBasic Material
    meshMaterial = new MeshBasicMaterial({ color: 0x7777ff });
    
    // Instantiate Meshes
    sphere = new Mesh(sphereGeometry, meshMaterial);
    cube = new Mesh(cubeGeometry, meshMaterial);
    plane = new Mesh(planeGeometry, meshMaterial);
    
    // Set Mesh positions
    sphere.position.set(0, 3, 2);
    cube.position.set(0, 3, 2);
    plane.position.set(0, 3, 2);
    
    // Add Cube Mesh to the scene
    scene.add(cube);
    console.log("Added Cube Mesh to the Scene");
    
    // Add subtle ambient lighting
    ambientLight = new AmbientLight(0x0c0c0c);
    scene.add(ambientLight);
    console.log("Added Ambient Light to the Scene");
    
    // Add spotLight for the shadows
    spotLight = new SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);
    console.log("Added Spot Light to the Scene");
    
    // add controls
    gui = new GUI();
    control = new Control(camera.near, camera.far, 0.02, scene.children.length);
    addControl(control);

    // Add framerate stats
    addStatsObject();
    console.log("Added Stats to scene...");

    document.body.appendChild(renderer.domElement);
    gameLoop(); // render the scene	
    
    window.addEventListener('resize', onResize, false);
}

// Change the Camera Aspect Ratio according to Screen Size changes
function onResize(): void {
    if (camera instanceof PerspectiveCamera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function addControl(controlObject: Control): void {
    gui.add(controlObject, 'rotationSpeed', 0, 0.5);
    gui.add(controlObject, 'addCube');
    gui.add(controlObject, 'removeCube');
    gui.add(controlObject, 'cameraNear', 0, 50).onChange(function(near) {
        camera.near = near;
    })
    gui.add(controlObject, 'cameraFar', 50, 200).onChange(function(far) {
        camera.far = far;
    });
}

// Add Stats Object to the Scene
function addStatsObject() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}

// Setup main game loop
function gameLoop(): void {
    stats.update();

    // rotate the cubes around its axes
    scene.traverse(function(shape) {
        if (shape instanceof THREE.Mesh) {
            shape.rotation.x += control.rotationSpeed;
            shape.rotation.y += control.rotationSpeed;
            shape.rotation.z += control.rotationSpeed;
        }
    });
    
    // render using requestAnimationFrame
    requestAnimationFrame(gameLoop);
	
    // render the scene
    renderer.render(scene, camera);
}

// Setup default renderer
function setupRenderer(): void {
    // setup WebGLRenderer
    webGLRenderer = new WebGLRenderer();
    webGLRenderer.setClearColor(0xEEEEEE, 1.0);
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.shadowMap.enabled = true;
    console.log("Finished setting up WebGLRenderer...");
    
    // setup CanvasRenderer
    /*
    canvasRenderer = new CanvasRenderer();
    canvasRenderer.setSize(window.innerWidth, window.innerHeight);
    console.log("Finished setting up CanvasRenderer...");
    */

    renderer = webGLRenderer;

}

// Setup main camera for the scene
function setupCamera(): void {
    camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 130);
    camera.position.x = -50;
    camera.position.y = 40;
    camera.position.z = 50;
    camera.lookAt(scene.position);
    console.log("Finished setting up Initial Camera...");
}
