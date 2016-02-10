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
function init() {
    // Instantiate a new Scene object
    scene = new Scene();
    scene.fog = new Fog(0xaaaaaa, 0.010, 200);
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
    control = new Control(0.02, 0.03, meshMaterial.opacity, meshMaterial.transparent, meshMaterial.overdraw, meshMaterial.visible, "front", meshMaterial.color.getStyle(), meshMaterial.wireframe, meshMaterial.wireframeLinewidth, meshMaterial.wireframeLinejoin, "cube");
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
    var spGui = gui.addFolder("Mesh");
    spGui.add(controlObject, 'opacity', 0, 1).onChange(function (opacity) {
        meshMaterial.opacity = opacity;
    });
    spGui.add(controlObject, 'transparent').onChange(function (transparent) {
        meshMaterial.transparent = transparent;
    });
    spGui.add(controlObject, 'wireframe').onChange(function (wireframe) {
        meshMaterial.wireframe = wireframe;
    });
    spGui.add(controlObject, 'wireframeLinewidth', 0, 20).onChange(function (width) {
        meshMaterial.wireframeLinewidth = width;
    });
    spGui.add(controlObject, 'visible').onChange(function (visible) {
        meshMaterial.visible = visible;
    });
    spGui.add(controlObject, 'side', ["front", "back", "double"]).onChange(function (side) {
        console.log(side);
        switch (side) {
            case "front":
                meshMaterial.side = THREE.FrontSide;
                break;
            case "back":
                meshMaterial.side = THREE.BackSide;
                break;
            case "double":
                meshMaterial.side = THREE.DoubleSide;
                break;
        }
        meshMaterial.needsUpdate = true;
        console.log(meshMaterial);
    });
    spGui.addColor(controlObject, 'colour').onChange(function (color) {
        meshMaterial.color.setStyle(color);
    });
    spGui.add(controlObject, 'selectedMesh', ["cube", "sphere", "plane"]).onChange(function (shape) {
        scene.remove(plane);
        scene.remove(cube);
        scene.remove(sphere);
        console.log("remove plane, cube, and sphere");
        switch (shape) {
            case "cube":
                scene.add(cube);
                console.log("added cube");
                break;
            case "sphere":
                scene.add(sphere);
                console.log("added sphere");
                break;
            case "plane":
                scene.add(plane);
                console.log("added plane");
                break;
        }
        //scene.add(shape);
    });
    //gui.add(controlObject, 'switchRenderer');
    var cvGui = gui.addFolder("Canvas renderer");
    cvGui.add(controlObject, 'overdraw').onChange(function (overdraw) {
        meshMaterial.overdraw = overdraw;
    });
    cvGui.add(controlObject, 'wireFrameLineJoin', ['round', 'bevel', 'miter']).onChange(function (lineJoin) {
        meshMaterial.wireframeLinejoin = lineJoin;
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
    //rotate the shapes
    cube.rotation.y = step += 0.01;
    plane.rotation.y = step;
    sphere.rotation.y = step;
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
    */
    renderer = webGLRenderer;
    console.log("Finished setting up CanvasRenderer...");
}
// Setup main camera for the scene
function setupCamera() {
    camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = -20;
    camera.position.y = 50;
    camera.position.z = 40;
    camera.lookAt(new Vector3(10, 0, 0));
    console.log("Finished setting up Initial Camera...");
}

//# sourceMappingURL=game.js.map
