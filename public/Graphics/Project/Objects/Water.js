var Water = undefined;
(function() {
    "use strict";
    var waterShader = undefined;
    var water = new Image();
    water.src = "Graphics/Project/Textures/water.png";

    Water = function Water() {
        this.buffers = null;
        this.texture = null;
        this.position = [0,0,0];
    }
    Water.prototype.init = function(drawingState) {
        if (!waterShader) {
            waterShader = twgl.createProgramInfo(drawingState.gl, ['water-vs', 'water-fs']);
        }
        var arrays = {
            a_position : {
                numComponents:3,
                data : [
                    -.5,0,-.5,  .5,0,-.5,
                    -.5,0,.5,   .5,0,.5,
                ]
            },
            a_color : {
                numComponents:3,
                data: [
                    1,1,1,
                    1,1,1,
                    1,1,1,
                    1,1,1,
                ]
            }, tex_coords : {
                numComponents:2,
                data: [
                    0,0,
                    1,0,
                    0,1,
                    1,1,
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
        this.texture = createGLTexture(drawingState.gl,water,false);
        this.buffer = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
    }
    Water.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([20,1,8]);
        drawingState.gl.useProgram(waterShader.program);
        twgl.m4.rotateY(modelM,0,modelM);
        twgl.m4.setTranslation(modelM,[0,-4.275+.05*Math.cos(Date.now()*.0005),-9.0],modelM);
        // var proj = twgl.m4.perspective(fov, 1, 0.01, 100);
        // var camera = twgl.m4.lookAt(lookFrom, lookAt, [0, 1, 0]);
        var gl = drawingState.gl;
        gl.enable(gl.DEPTH_TEST);
        twgl.setBuffersAndAttributes(gl,waterShader,this.buffer);
        twgl.setUniforms(waterShader,{
            view:drawingState.view,
            proj:drawingState.proj,
            model: modelM,
            uTexture : this.texture,
            time: Date.now()-drawingState.startTime,
        });
        twgl.drawBufferInfo(gl, this.buffer,gl.TRIANGLES);
    }
})();