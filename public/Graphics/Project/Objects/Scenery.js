var NumberRow = undefined;
var AbacusPole = undefined;
var Scenery = undefined;
var Background = undefined;
var maxLength;
(function() {
    "use strict";
    var baseTex;
    var abBase;


    Background = function Background() {
        this.buffers = null;
        this.texture = null;
        this.position = [0,0,0];
    }

    Background.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        var arrays = {
            a_position : {
                numComponents:3,
                data: [
                    //Platform 0-3
                    -2.75,-3,-4,    2.75,-3,-4,
                    -2,-3,-2.75,     2,-3,-2.75,

                    //Before River Ground
                    -5,-3.5,-4,
                    -0,-3.5,-5.5,     5,-3.5,-4,

                    //RiverBed
                    -11,-4,-20,    -3,-4,-15,
                    -10,-4,-5,     -3,-4,-5,

                    -5,-6,-20,    15,-6,-20,
                    -5,-6,-5,     10,-6,-5,

                    -4,-5,-15,    15,-5,-15,
                    -4,-5,-5,     10,-5,-5,
                ]
            },
            a_color : {
                numComponents:3,
                data: [
                    1,1,1,
                    1,1,1,
                    1,1,1,
                    1,1,1,

                    1,1,1,
                    1,1,1,
                    1,1,1,
                    1,1,1,

                    1,1,1,
                    1,1,1,
                    1,1,1,
                    1,1,1,

                    1,1,1,
                    1,1,1,
                    1,1,1,
                    1,1,1,
                ]
            },
            tex_coords : {
                numComponents:2,
                data: [
                    0.0,0.0,    0.5,0.0,
                    0.0,0.5,    0.5,0.5,

                    0.0,0.5,    0.25,0.75,
                    0.5,0.5,

                    0.0,0.75,   0.5,0.75,
                    0.0,1.0,    0.5,1.0,

                    0.0,0.75,   0.5,0.75,
                    0.0,1.0,    0.5,1.0,

                ]
            },
            indices : {
                numComponents:3,
                data: [


                    4,5,6,

                    0,1,2,
                    1,2,3,

                ]
            }
        }
        this.buffers = twgl.createBufferInfoFromArrays(gl,arrays);
    }
    Background.prototype.draw = function(drawingState) {
        var gl = drawingState.gl;
        var modelM = twgl.m4.scaling([1,1,1]);
        gl.useProgram(shaderProgram.program);
        twgl.m4.setTranslation(modelM,[0,0,0],modelM);

        twgl.setBuffersAndAttributes(gl,shaderProgram,this.buffers);

        twgl.setUniforms(shaderProgram,{
            view:drawingState.view,
            proj:drawingState.proj,
            model: modelM,
            uTexture : this.texture,
        });

        twgl.drawBufferInfo(gl, this.buffers);

    }

    Scenery = function Scenery() {
        this.buffers = null;
        this.texture = null;
        this.position = [0,0,0];
    }

    Scenery.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ['vs', 'fs']);
        }
        var arrays = {
            a_position : {
                numComponents:3,
                data: [

                    //Platform 0-3
                    -2.75,-3,-4,    2.75,-3,-4,
                    -2,-3,-2.75,     2,-3,-2.75,

                    //Before River Ground
                    -5,-3.5,-4,
                    -0,-3.5,-5.5,     5,-3.5,-4,

                    //RiverBed
                    -11,-4,-20,    -3,-4,-15,
                    -10,-4,-5,     -3,-4,-5,

                    -5,-6,-20,    15,-6,-20,
                    -5,-6,-5,     10,-6,-5,

                    -4,-5,-15,    15,-5,-15,
                    -4,-5,-5,     10,-5,-5,
                ]
            },
            a_color : {
                numComponents:3,
                data: [
                    1,1,1,
                    1,1,1,
                    1,1,1,
                    1,1,1,

                    1,1,1,
                    1,1,1,
                    1,1,1,
                    1,1,1,

                    1,1,1,
                    1,1,1,
                    1,1,1,
                    1,1,1,

                    1,1,1,
                    1,1,1,
                    1,1,1,
                    1,1,1,
                ]
            },
            tex_coords : {
                numComponents:2,
                data: [
                    0.0,0.0,    0.5,0.0,
                    0.0,0.5,    0.5,0.5,

                    0.0,0.5,    0.25,0.75,
                    0.5,0.5,

                    0.0,0.75,   0.5,0.75,
                    0.0,1.0,    0.5,1.0,

                    0.0,0.75,   0.5,0.75,
                    0.0,1.0,    0.5,1.0,

                ]
            },
            indices : {
                numComponents:3,
                data: [


                    4,5,6,

                    0,1,2,
                    1,2,3,

                ]
            }
        }
        this.texture = createGLTexture(gl,sceneryTex,false);
        this.buffers = twgl.createBufferInfoFromArrays(gl,arrays);
    }
    Scenery.prototype.draw = function(drawingState) {
        var gl = drawingState.gl;
        var modelM = twgl.m4.scaling([1,1,1]);
        gl.useProgram(shaderProgram.program);
        twgl.m4.setTranslation(modelM,[0,0,0],modelM);

        twgl.setBuffersAndAttributes(gl,shaderProgram,this.buffers);

        twgl.setUniforms(shaderProgram,{
            view:drawingState.view,
            proj:drawingState.proj,
            model: modelM,
            uTexture : this.texture,
        });

        twgl.drawBufferInfo(gl, this.buffers);

    }

    AbacusPole = function AbacusPole(id,position) {
        this.id = id;
        this.position = position;
        this.value = id;
        this.buffer = null;
        this.texture = null;
        this.yPositions = null;
    }
    AbacusPole.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        var basePos = [];
        var col = [];
        var tex = [];
        var ind = [];
        this.yPositions = [];
        basePos.push (
            -0.1,0.0,0.0,    0.1,0.0,0.0,
            -0.1, 5.0,0.0,    0.1,5.0,0.0,
        )
        tex.push (
            0,0, 1,0,
            0,1, 1,1,
        )
        ind.push(
            0,1,2, 1,2,3,
        )
        col.push(
            .3,.3,.3, .3,.3,.3,
            .3,.3,.3, .3,.3,.3
        )
        for (var i = 0; i < 10; i++) {
            this.yPositions.push(.5*i)
            basePos.push(
                -0.3,.5*i,0.0,             0.3,.5*i,0.0,
                -0.3,-0.2+.5*(i+1),0.0,    0.3,-0.2+.5*(i+1),0.0,
            )
            tex.push(
                0,0, 1,0,
                0,1, 1,1,
            )
            ind.push(
                4*i,4*i+1,4*i+2, 4*i+1,4*i+2,4*i+3,
            )
            col.push(
                .3,.3,.3, .3,.3,.3,
                .3,.3,.3, .3,.3,.3
            )
        }
        abBase = basePos;
        var arrays = {
            a_position : {
              numComponents:3, data: basePos
            },
            tex_coords : {numComponents:2, data: tex
            },
            a_color : {numComponents:3, data: col},
            indices : {
                numComponents:3, data: ind
            }
        }
        this.texture = createGLTexture(gl,testImg2,false);
        this.buffer = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
    }
    AbacusPole.prototype.update = function(drawingState) {
        this.value = (this.id+Math.floor(Math.abs(9*Math.cos(Date.now()*.0005))))%10;
        var gl = drawingState.gl;
        var abValue = this.value;
        this.yPositions = this.yPositions.map((x,ind) => {
            var res;
            if (ind >= abValue) {
                res = Math.min(x+.01,1.5+.3*ind);
            } else {
                res = Math.max(x-.01,ind*.3);
            }
            return res;
        })
        var temp = this.yPositions.reduce(function(r,e,index) {
            r.push(
                -.3,e,0,
                .3,e,0,
                -.3,e+.25,0,
                .3,e+.25,0
            );
            return r;
        },[-0.1,0.0,0.0,    0.1,0.0,0.0,
            -0.1, 5.0,0.0,    0.1,5.0,0.0]);
        twgl.setAttribInfoBufferFromArray(gl,
            this.buffer.attribs.a_position,
            {numComponents:3, data: temp}
        )
        return temp;
    }
    AbacusPole.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([1.5,1.5,1.5]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;
        gl.enable(gl.DEPTH_TEST);
     //   this.update(drawingState);
        twgl.setBuffersAndAttributes(gl,shaderProgram,this.buffer);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view,
            proj:drawingState.proj,
            model: modelM,
            uTexture : this.texture,
        });
        twgl.drawBufferInfo(gl, this.buffer);
    }

    NumberRow = function NumberRow(name,id,position,length) {
        this.name = name;
        this.id = id;
        this.state = 0;
        this.position = position;
        this.texture = null;
        this.length = length;
        this.nums = [];
    }
    NumberRow.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        this.texture = createGLTexture(gl,testImg,false);
        this.nums = Array(this.length).fill(0);
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ['vs', 'fs']);
            gl.useProgram(shaderProgram.program);
        }
        var aPos = [];
        var aTex = [];
        var aCol = [];
        var ind = [];
        var cX = 0;
        var dist = 1.0;
        for (var i = 0; i < this.length; i++) {
            aPos.push(-0.5+cX,0,-1.0);
            aPos.push(-0.5+cX,0,1.0);
            aPos.push(-0.5+cX+dist,0,-1.0);
            aPos.push(-0.5+cX+dist,0,1.0);
            aTex.push(0,0, 0,.25, .25,0, .25,.25);
            ind.push(i*4,1+i*4,2+i*4, 1+i*4,2+i*4,3+i*4);
            aCol.push(.25,.25,.5, .25,.25,.5, .25,.25,.5, .25,.25,.5);
            cX += dist;
        }
        if (!this.buffer) {
            baseTex = aTex;
            var arrays = {
                a_position: {
                    numComponents: 3, data: aPos
                },
                tex_coords: {
                    numComponents: 2, data: aTex
                },
                a_color : {
                    numComponents:3, data:aCol
                },
                indices: {
                    numComponents: 3, data: ind
                }
            }
            this.buffer = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
    }
    NumberRow.prototype.updateAnswer = function(drawingState,index,value) {
        var gl = drawingState.gl;
        var len = maxLength;
        var offset = 12*Math.floor((10-len)/2);
        if (index == len+offset/12) {
            this.state = 1;
        } else {
            this.nums[index] = value;
        }
        var temp = this.nums.reduce(function(r,e,ind) {
            r.push(
                0.2*e,0.25*Math.floor(e/5),
                0.2*e,0.25*(Math.floor(e/5)+1),
                0.2*(e+1),0.25*Math.floor(e/5),
                0.2*(e+1),0.25*(Math.floor(e/5)+1),
            );
            return r;
        }, []);
        twgl.setAttribInfoBufferFromArray(gl,
            this.buffer.attribs.tex_coords,
            {numComponents:2, data: temp}
        )
        temp = this.nums.reduce(function(r,e,ind) {
            switch (e) {
                case 0 :
                    r.push(
                        .75,.75,0,
                        .75,.75,0,
                        .75,.75,0,
                        .75,.75,0,
                    );
                    break;
                case 1 :
                    r.push(
                        .5,1,0,
                        .5,1,0,
                        .5,1,0,
                        .5,1,0,
                    );
                    break;
                case 2 :
                    r.push(
                        0,1,0,
                        0,1,0,
                        0,1,0,
                        0,1,0,
                    );
                    break;
                case 3 :
                    r.push(
                        0,1,.5,
                        0,1,.5,
                        0,1,.5,
                        0,1,.5,
                    );
                    break;
                case 4 :
                    r.push(
                        0,0,1,
                        0,0,1,
                        0,0,1,
                        0,0,1,
                    );
                    break;
                case 5  :
                    r.push(
                        .25,0,.75,
                        .25,0,.75,
                        .25,0,.75,
                        .25,0,.75,
                    );
                    break;
                case 6  :
                    r.push(
                        .5,0,.5,
                        .5,0,.5,
                        .5,0,.5,
                        .5,0,.5,
                    );
                    break
                case 7 :
                    r.push(
                        1,0,.25,
                        1,0,.25,
                        1,0,.25,
                        1,0,.25,
                    );
                    break;
                case 8 :
                    r.push(
                        .75,.25,0,
                        .75,.25,0,
                        .75,.25,0,
                        .75,.25,0,
                    );
                    break;
                case 9 :
                    r.push(
                        .5,.5,0,
                        .5,.5,0,
                        .5,.5,0,
                        .5,.5,0,
                    );
                    break;
                default :
                    r.push(
                        .25,.5,.25,
                        .25,.5,.25,
                        .25,.5,.25,
                        .25,.5,.25,
                    );
            }
            return r;
        }, []);
        twgl.setAttribInfoBufferFromArray(gl,
            this.buffer.attribs.a_color,
            {numComponents:2, data: temp}
        )
    }
    NumberRow.prototype.update = function(drawingState) {
        var gl = drawingState.gl;
        var len = maxLength;
        var offset = 12*Math.floor((10-len)/2);
        switch(this.id) {
            case 1 : {
                offset-=12;
                this.nums[offset/12]=10;
                break;
            }
            case 2 : {
                offset-=12;
                len = len+1;
                this.nums[len]=14;
            }
        }
        var temp = this.nums.reduce(function(r,e) {
            r.push(
                0.2*e,0.25*Math.floor(e/5),
                0.2*e,0.25*(Math.floor(e/5)+1),
                0.2*(e+1),0.25*Math.floor(e/5),
                0.2*(e+1),0.25*(Math.floor(e/5)+1),
            );
            return r;
        }, []);
        twgl.setAttribInfoBufferFromArray(gl,
            this.buffer.attribs.tex_coords,
            {numComponents:2, data: temp}
        )
        temp = this.nums.reduce(function(r,e,ind) {
            switch (e) {
                case 0 :
                    r.push(
                        .75,.75,0,
                        .75,.75,0,
                        .75,.75,0,
                        .75,.75,0,
                    );
                    break;
                case 1 :
                    r.push(
                        .5,1,0,
                        .5,1,0,
                        .5,1,0,
                        .5,1,0,
                    );
                    break;
                case 2 :
                    r.push(
                        0,1,0,
                        0,1,0,
                        0,1,0,
                        0,1,0,
                    );
                    break;
                case 3 :
                    r.push(
                        0,1,.5,
                        0,1,.5,
                        0,1,.5,
                        0,1,.5,
                    );
                    break;
                case 4 :
                    r.push(
                        0,0,1,
                        0,0,1,
                        0,0,1,
                        0,0,1,
                    );
                    break;
                case 5  :
                    r.push(
                        .25,0,.75,
                        .25,0,.75,
                        .25,0,.75,
                        .25,0,.75,
                    );
                    break;
                case 6  :
                    r.push(
                        .5,0,.5,
                        .5,0,.5,
                        .5,0,.5,
                        .5,0,.5,
                    );
                    break
                case 7 :
                    r.push(
                        1,0,.25,
                        1,0,.25,
                        1,0,.25,
                        1,0,.25,
                    );
                    break;
                case 8 :
                    r.push(
                        .75,.25,0,
                        .75,.25,0,
                        .75,.25,0,
                        .75,.25,0,
                    );
                    break;
                case 9 :
                    r.push(
                        .5,.5,0,
                        .5,.5,0,
                        .5,.5,0,
                        .5,.5,0,
                    );
                    break;
                default :
                    r.push(
                        .25,.5,.25,
                        .25,.5,.25,
                        .25,.5,.25,
                        .25,.5,.25,
                    );
            }
            return r;
        }, []);
        twgl.setAttribInfoBufferFromArray(gl,
            this.buffer.attribs.a_color,
            {numComponents:2, data: temp}
        )
    }
    NumberRow.prototype.draw = function(drawingState) {
        drawingState.gl.useProgram(shaderProgram.program);
        var len = maxLength;
        var offset = 12*Math.floor((10-len)/2);
        var scaleZ = 1.5;
        if (this.id < 2)
            scaleZ = 2.5;
        var modelM = twgl.m4.scaling([1.5,1.0,scaleZ]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var gl = drawingState.gl;

        switch (this.id) {
            case 1 : {
                offset -= 12;
                len++;
                this.nums[offset/12] = 10;
                break;
            }
            case 2 : {
                if (this.nums[(offset-12)/12] > 0) {
                    offset-=12;
                    len++;
                }
                len++;
                break;
            }
        }
        twgl.setBuffersAndAttributes(gl,shaderProgram,this.buffer);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view,
            proj:drawingState.proj,
            model: modelM,
            uTexture : this.texture,
        });
        twgl.drawBufferInfo(gl, this.buffer,gl.TRIANGLES,len*6,offset);
    }
})();