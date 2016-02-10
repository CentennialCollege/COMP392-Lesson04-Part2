/// <reference path="_reference.ts"/>
// MAIN GAME FILE
// THREEJS Aliases
var Scene = THREE.Scene;
var WebGLRenderer = THREE.WebGLRenderer;
var CanvasRenderer = THREE.CanvasRenderer;
var Camera = THREE.Camera;
var PerspectiveCamera = THREE.PerspectiveCamera;
var OrthographicCamera = THREE.OrthographicCamera;
var BoxGeometry = THREE.BoxGeometry;
var CubeGeometry = THREE.CubeGeometry;
var PlaneGeometry = THREE.PlaneGeometry;
var SphereGeometry = THREE.SphereGeometry;
var Geometry = THREE.Geometry;
var AxisHelper = THREE.AxisHelper;
var CameraHelper = THREE.CameraHelper;
var LambertMaterial = THREE.MeshLambertMaterial;
var MeshBasicMaterial = THREE.MeshBasicMaterial;
var MeshDepthMaterial = THREE.MeshDepthMaterial;
var Material = THREE.Material;
var Texture = THREE.Texture;
var RepeatWrapping = THREE.RepeatWrapping;
var Mesh = THREE.Mesh;
var Object3D = THREE.Object3D;
var SpotLight = THREE.SpotLight;
var PointLight = THREE.PointLight;
var AmbientLight = THREE.AmbientLight;
var DirectionalLight = THREE.DirectionalLight;
var HemisphereLight = THREE.HemisphereLight;
var Control = objects.Control;
var GUI = dat.GUI;
var Color = THREE.Color;
var Vector3 = THREE.Vector3;
var Face3 = THREE.Face3;
var Point = objects.Point;
var Fog = THREE.Fog;
var LensFlare = THREE.LensFlare;
var AdditiveBlending = THREE.AdditiveBlending;
//Custom Game Objects
var gameObject = objects.gameObject;
var scene;
var renderer;
var webGLRenderer;
var canvasRenderer;
var camera;
var axes;
var directionalLightHelper;
var cube;
var plane;
var sphere;
var ambientLight;
var ambientColour;
var spotLight;
var directionalLight;
var pointColour;
var pointLight;
var hemiLight;
var control;
var gui;
var stats;
var step = 0;
var invert = 1;
var phase = 0;
var target;
var stopMovingLight = false;
var planeMaterial;
var planeGeometry;
var cubeMaterial;
var cubeGeometry;
var sphereMaterial;
var sphereGeometry;
var sphereLight;
var sphereLightMaterial;
var sphereLightMesh;
var groundGeometry;
var groundMaterial;
var groundMesh;
var meshMaterial;
var overrideMaterial;
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
function onResize() {
    if (camera instanceof PerspectiveCamera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function addControl(controlObject) {
    gui.add(controlObject, 'rotationSpeed', 0, 0.5);
    gui.add(controlObject, 'addCube');
    gui.add(controlObject, 'removeCube');
    gui.add(controlObject, 'cameraNear', 0, 50).onChange(function (near) {
        camera.near = near;
    });
    gui.add(controlObject, 'cameraFar', 50, 200).onChange(function (far) {
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
function gameLoop() {
    stats.update();
    // rotate the cubes around its axes
    scene.traverse(function (shape) {
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
function setupRenderer() {
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
function setupCamera() {
    camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 130);
    camera.position.x = -50;
    camera.position.y = 40;
    camera.position.z = 50;
    camera.lookAt(scene.position);
    console.log("Finished setting up Initial Camera...");
}
//# sourceMappingURL=game.js.map