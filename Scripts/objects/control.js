/// <reference path="../../typings/tsd.d.ts"/>
var objects;
(function (objects) {
    // CONTROL CLASS ++++++++++++++++++++++++++++++++++++++++++
    var Control = (function () {
        //PUBLIC INSTANCE VARIABLES +++++++++++++++++++++++++++
        // CONSTRUCTOR ++++++++++++++++++++++++++++++++++++++++
        function Control(cameraNear, cameraFar, rotationSpeed, numberOfObjects) {
            this.cameraNear = cameraNear;
            this.cameraFar = cameraFar;
            this.rotationSpeed = rotationSpeed;
            this.numberOfObjects = numberOfObjects;
        }
        Control.prototype.removeCube = function () {
            var allChildren = scene.children;
            var lastObject = allChildren[allChildren.length - 1];
            if (lastObject instanceof Mesh) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        };
        Control.prototype.addCube = function () {
            var cubeSize = Math.ceil(3 + (Math.random() * 3));
            var cubeGeometry = new CubeGeometry(cubeSize, cubeSize, cubeSize);
            var cubeMaterial = new LambertMaterial({ color: Math.random() * 0xffffff });
            var cube = new Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            // position the cube randomly in the scene
            cube.position.x = -60 + Math.round((Math.random() * 100));
            cube.position.y = Math.round((Math.random() * 10));
            cube.position.z = -100 + Math.round((Math.random() * 150));
            // add the cube to the scene
            scene.add(cube);
            this.numberOfObjects = scene.children.length;
        };
        Control.prototype.outputObjects = function () {
            console.log(scene.children);
        };
        return Control;
    })();
    objects.Control = Control;
})(objects || (objects = {}));

//# sourceMappingURL=control.js.map
