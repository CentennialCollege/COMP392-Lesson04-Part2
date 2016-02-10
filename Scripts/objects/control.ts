/// <reference path="../../typings/tsd.d.ts"/>

module objects {
    // CONTROL CLASS ++++++++++++++++++++++++++++++++++++++++++
    export class Control { 
        //PUBLIC INSTANCE VARIABLES +++++++++++++++++++++++++++
        public rotationSpeed: number;
        public bouncingSpeed: number;
        public opacity: number;
        public transparent: boolean;
        public overdraw: number;
        public visible: boolean;
        public side: string;
        public colour: string;
        public wireframe: boolean;
        public wireframeLinewidth: number;
        public wireFrameLineJoin: string;
        public selectedMesh: string;
        // CONSTRUCTOR ++++++++++++++++++++++++++++++++++++++++
        constructor(rotationSpeed: number, bouncingSpeed: number,
            opacity: number, transparent: boolean, overdraw: number,
            visible: boolean, side: string, colour: string, wireframe: boolean,
            wireframeLineWidth: number, wireframeLineJoin: string,
            selectedMesh: string) {
            this.rotationSpeed = rotationSpeed;
            this.bouncingSpeed = bouncingSpeed;
            this.opacity = opacity;
            this.transparent = transparent;
            this.overdraw = overdraw;
            this.visible = visible;
            this.side = side;
            this.colour = colour;
            this.wireframe = wireframe;
            this.wireframeLinewidth = wireframeLineWidth;
            this.wireFrameLineJoin = wireframeLineJoin;
            this.selectedMesh = selectedMesh;
        }
        
       /*
        public switchRenderer():void {
            if(renderer instanceof WebGLRenderer) {
                renderer = canvasRenderer;
                document.body.removeChild(document.body.lastChild);
                document.body.appendChild(renderer.domElement);
            } else {
                renderer = webGLRenderer;
                document.body.removeChild(document.body.lastChild);
                document.body.appendChild(renderer.domElement);
            }
        }
        */
    }
}
