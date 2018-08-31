var Fog = undefined;

(function() {
    "use strict";
    var fogShader = undefined;
    Fog = function Fog() {
        this.buffers = null;
        this.position = [0,3,0];
    }
    Fog.prototype.init = function(drawingState) {
        if (!fogShader) {
            fogShader = twgl.createProgramInfo(drawingState.gl, ['fog-vs', 'fog-fs']);
        }
        var arrays = {
            a_position : {
                numComponents:3,
                data : [
                    -.5,.25,-1, .5,.25,-1,
                    -1.0,-1.75,-1, 1.0,-1.75,-1,
                ]
            },
            a_scale : {
                numComponents:2,
                data : [
                    1, 1,
                    1, 1,
                    1, 1,
                    1, 1,
                ]
            },
            indices : {
                numComponents:3,
                data: [
                    0,1,2,
                    1,2,3,

                ]
            }
        }
        this.buffer = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
    }
    Fog.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([1,1,1]);
        //  drawingState.gl.enable(drawingState.gl.DEPTH_TEST)
        twgl.m4.setTranslation(modelM,[0,0,0],modelM);
        drawingState.gl.useProgram(fogShader.program);
        // var proj = twgl.m4.perspective(fov, 1, 0.01, 100);
        // var camera = twgl.m4.lookAt(lookFrom, lookAt, [0, 1, 0]);
        var gl = drawingState.gl;

        twgl.setBuffersAndAttributes(gl,fogShader,this.buffer);
        twgl.setUniforms(fogShader,{
            view:drawingState.view,
            proj:drawingState.proj,
            model: modelM,
            time: Date.now()-drawingState.startTime,
        });
        twgl.drawBufferInfo(gl, this.buffer,gl.TRIANGLES);
        //  twgl.drawBufferInfo(gl, this.buffer,gl.TRIANGLES,6,6);
        gl.disable(gl.DEPTH_TEST);
    }
})();
