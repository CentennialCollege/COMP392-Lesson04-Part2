/// <reference path="../../typings/tsd.d.ts"/>

module objects {
    // CONTROL CLASS ++++++++++++++++++++++++++++++++++++++++++
    export class Control { 
        //PUBLIC INSTANCE VARIABLES +++++++++++++++++++++++++++
       
        // CONSTRUCTOR ++++++++++++++++++++++++++++++++++++++++
        constructor(public cameraNear: number,
            public cameraFar: number,
            public rotationSpeed: number,
            public numberOfObjects: number) {
        }

        public removeCube(): void {
            var allChildren: Object3D[] = scene.children;
            var lastObject: Object3D = allChildren[allChildren.length - 1];
            if (lastObject instanceof Mesh) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        }

        public addCube(): void {
            var cubeSize: number = Math.ceil(3 + (Math.random() * 3));
            var cubeGeometry: CubeGeometry = new CubeGeometry(cubeSize, cubeSize, cubeSize);
            var cubeMaterial: LambertMaterial = new LambertMaterial({ color: Math.random() * 0xffffff });
            var cube: Mesh = new Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;

            // position the cube randomly in the scene
            cube.position.x = -60 + Math.round((Math.random() * 100));
            cube.position.y = Math.round((Math.random() * 10));
            cube.position.z = -100 + Math.round((Math.random() * 150));

            // add the cube to the scene
            scene.add(cube);
            this.numberOfObjects = scene.children.length;
        }

        public outputObjects(): void {
            console.log(scene.children);
        }

    }
}
