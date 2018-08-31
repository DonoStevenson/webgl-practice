var Cube = undefined;

(function() {
    "use strict";

    Cube = function Cube(name,position) {
        this.name = name;
        this.position = position;
        this.buffers = undefined;
    }

    Cube.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ['vs', 'fs']);
        }
        if (!buffers) {
            var arrays = {
                a_position : {numComponents:3, data: [
                    0,0,0, 1,0,1, 1,0,0,
                    .5,1,.5,
                    ]
                },
                indices : {numComponents:3,data: [
                    0,1,2, 0,1,3, 0,2,3, 1,2,3
                    ]}
            }
            this.buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
    }
    Cube.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([1.0,1.0,1.0]);
        var cTime = Date.now();
        modelM = twgl.m4.rotateY(modelM,cTime*.001,modelM);
        twgl.m4.setTranslation(modelM,[0,5,0],modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, model: modelM });
        twgl.drawBufferInfo(gl, buffers);
    };
})();