/// <reference path="../../typings/tsd.d.ts"/>
var objects;
(function (objects) {
    // CONTROL CLASS ++++++++++++++++++++++++++++++++++++++++++
    var Control = (function () {
        // CONSTRUCTOR ++++++++++++++++++++++++++++++++++++++++
        function Control(rotationSpeed, bouncingSpeed, opacity, transparent, overdraw, visible, side, colour, wireframe, wireframeLineWidth, wireframeLineJoin, selectedMesh) {
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
        return Control;
    })();
    objects.Control = Control;
})(objects || (objects = {}));

//# sourceMappingURL=control.js.map
