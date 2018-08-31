var Ground = undefined;
(function() {
    "use strict";
    var groundShader = undefined;
    var groundTex = new Image();
    groundTex.src = "Graphics/Project/Textures/groundTexture.png"
    Ground = function Ground() {
        this.position = [0,0,0];
        this.size = [15,4,10];
        this.buffer = undefined;
        this.sceneryBuffer = undefined;
        this.texture = undefined;
    }


    var createLeaf = function(rot,center,type) {
        var c,s;
        c = Math.cos(rot);
        s = Math.sin(rot);
        var pos = [
            center[0],center[1],center[2],

            0.25*c-.25*s+center[0],.075+center[1],.25*c+.25*s+center[2],
            -0.25*c-.25*s+center[0],.075+center[1],.25*c-.25*s+center[2],

            -.5*s+center[0],.025+center[1],.5*c+center[2],
        ]
        var tex = [
            0.125*type,0.5,    0.125*(type+1),0.5,
            0.125*type,0.625,  0.125*(type+1),0.625,
        ]
        var ind = [
            0,1,2,
            1,2,3,
        ]
        return [pos,tex,ind];
    }

    var createBush2 = function(center) {
        var rot = 0;
        var len;
        var pos = [];
        var tex = [];
        var ind = [];
        var result;
        var i,j;
        for (i =0; i < 4; i++) {
            rot = i*Math.PI/3.0;
            for (j=0;j<8;j++) {
             len = pos.length / 3.0;
             result = createLeaf(rot,
                 [center[0],center[1]+.05*i,center[2]],0);
             result[0].map(x => pos.push(x));
             result[1].map(x => tex.push(x));
             result[2].map(x => ind.push(x + len));
             rot += Math.PI / 4.0;
            }
        }
        /*
        len = pos.length/3.0;
        pos.push(
            center[0],center[1],center[2],
            center[0]-.15,center[1]+.25,center[2]+.25,
            center[0]-.15,center[1]+.25,center[2]-.25,
            center[0]-.25,center[1]+.5,center[2],
        )
        result[1].map(x => tex.push(x));
        result[2].map(x => ind.push(x + len));
        len = pos.length/3.0;
        pos.push(
            center[0],center[1],center[2],
            center[0]+.15,center[1]+.25,center[2]+.25,
            center[0]+.15,center[1]+.25,center[2]-.25,
            center[0]+.25,center[1]+.5,center[2],
        )
        result[1].map(x => tex.push(x));
        result[2].map(x => ind.push(x + len));
        */
        return [pos,tex,ind];
    }
    var createBush = function(center,type) {
        var pos = [];
        var tex = [];
        var ind = [];
        var theta;
        var r = .2;
        var l = 4;
        var nAround = 20;
        var c;
        var s;
        var len;
        var i,j;
        for (i = 0; i < l; i++) {
            r += .02*(i*i/(i+1));
            for ( j = 0; j < nAround; j++) {
                if (i == l-1) {
                    if (j%3)
                        r -= .15*(Math.random());
                    else
                        r += .25*(Math.random());
                }
                theta = j*(2.0*Math.PI)/nAround;
                c = r*Math.cos(theta);
                s = r*Math.sin(theta);
                pos.push(
                    c+center[0],center[1]-(center[1]/(l-1))*i,s+center[2],
                )
                tex.push(0.5+(.5/nAround)*j,(.25/(l-1))*i);
            }
        }
        for (i = 0; i < l-1; i++) {
            for (j = 0; j < nAround; j++) {
                if ((i != l-3 && i != l-4) || j != 7) {
                    if (j < nAround - 1) {
                        ind.push(
                            nAround * i + j, nAround * i + j + 1, nAround * (i + 1) + j,
                            nAround * i + j + 1, nAround * (i + 1) + j, nAround * (i + 1) + j + 1,
                        )
                    } else {
                        ind.push(
                            nAround * i + j, nAround * i, nAround * (i + 1) + j,
                            nAround * i, nAround * (i + 1), nAround * (i + 1) + j,
                        )
                    }
                }
            }
        }
        r = .3;
        l = 10+Math.floor(5*Math.random());
        nAround = 20+Math.floor(10*Math.random());
        for (i = 0; i < l; i++) {
            if (i < l/2) {
                r += .3*Math.random();
            } else {
                r -= .15;
            }
            theta = 2.0*Math.PI*Math.random();
            for (j = 0; j < nAround; j++) {
                theta += 2.0*Math.PI/nAround;
                c = r*Math.cos(-theta);
                s = r*Math.sin(-theta);
                len = pos.length/3.0;
                pos.push(
                    c+center[0],center[1]-.15*i,s+center[2],
                    c+.25*c-.25*s+center[0],center[1]-.125*i+.125,s+.25*c+.25*s+center[2],
                    c-.25*c-.25*s+center[0],center[1]-.125*i-.125,s+.25*c-.25*s+center[2],
                    c-.5*s+center[0],center[1]-.125*i+.05,s+.5*c+center[2],

                    //  c2+center[0],center[1]-.15*i,s2+center[2],
                   // c3+center[0],center[1]-.15*i+.2,s3+center[2],
                   // c4+center[0],center[1]-.15*i+.2,s4+center[2],
                )
                var tmp = type;
                tex.push(
                    0.125*tmp,0.5,    0.125*(tmp+1),0.5,
                    0.125*tmp,0.625,  0.125*(tmp+1),0.625,
              //      -c+s+.0625,-c-s+.5625,
              //      c+s+.0625,-c+s+.5625,
              //      -c-s+.0625,c-s+.5625,
              //      c-s+.0625,c+s+.5625,
                );
                ind.push(
                    len,len+1,len+2,
                    len+1,len+2,len+3,
                )
            }
        }
        return [pos,tex,ind];
    }
    var createBigTree = function() {
        var r = .25;
        var c;
        var s;
        var theta;
        var pos = [];
        var ind = [];
        var tex = [];
        var l = 8;
        var nAround = 10;
        for (var i = 0; i < l; i++) {
            r += .005*(i*i/(i+1));
            for (var j = 0; j < nAround; j++) {
                if (i == l-1) {
                    if (j%2)
                    r -= .15
                    else
                    r += .15;
                }
                theta = j*(2.0*Math.PI)/nAround;
                c = r*Math.cos(theta);
                s = r*Math.sin(theta);
                pos.push(
                    c,2-(2/(l-1))*i,s+.75,
                )
                tex.push(0.5+(.5/nAround)*j,(.25/(l-1))*i);
            }
        }
        for (var i = 0; i < l-1; i++) {
            for (var j = 0; j < nAround; j++) {
                if ((i != l-3 && i != l-4) || j != 7) {
                    if (j < nAround - 1) {
                        ind.push(
                            nAround * i + j, nAround * i + j + 1, nAround * (i + 1) + j,
                            nAround * i + j + 1, nAround * (i + 1) + j, nAround * (i + 1) + j + 1,
                        )
                    } else {
                        ind.push(
                            nAround * i + j, nAround * i, nAround * (i + 1) + j,
                            nAround * i, nAround * (i + 1), nAround * (i + 1) + j,
                        )
                    }
                }
            }
        }
        r = .2;
        l = nAround/2.0;
        var len = Math.floor(pos.length/3.0);
        for (var i = 0; i < l; i++) {
            r += .0175*(i*i/(i+1));
            console.log(pos);
            for (var j = 0; j < nAround; j++) {
                theta = j*(2.0*Math.PI)/nAround;
                c = r*Math.cos(theta);
                s = r*Math.sin(theta);
                pos.push(
                    c,1.25-(1/(l-1))*i,s+.75,
                )
                tex.push(0.5+(.5/nAround)*j,.25+(.175/(l-1))*i);
            }
        }
        pos.push(0,.25,.75);
        tex.push(0.75,0.5);
        var c = Math.floor(pos.length/3.0)-1;
        console.log(c);
        for (var i = 0; i < l; i++) {
            for (var j = 0; j < nAround; j++) {
                if (i == l-1) {
                    console.log(i)
                    if (j < nAround-1) {
                        console.log(nAround*(i-1)+j+len);
                        ind.push(
                            nAround * i + j+len, nAround * i + j + 1+len, c,
                        )
                    } else {
                        ind.push(
                            nAround * i + j+len, nAround * i +len, c,
                        )

                    }
                } else if ((i != (l-2)&& i != (l-3)) || j != 7) {
                    if (j < nAround - 1) {
                        ind.push(
                            nAround * i + j+len, nAround * i + j + 1+len, nAround * (i + 1) + j+len,
                            nAround * i + j + 1+len, nAround * (i + 1) + j+len, nAround * (i + 1) + j + 1+len,
                        )
                    } else {
                        ind.push(
                            nAround * i + j+len, nAround * i+len, nAround * (i + 1) + j+len,
                            nAround * i+len, nAround * (i + 1)+len, nAround * (i + 1) + j+len,
                        )
                    }
                }
            }
        }
        return [pos,ind,tex];
    }
    Ground.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!groundShader) {
            groundShader = twgl.createProgramInfo(gl,["ground-vs","ground-fs"]);
        }
        var pos = [
            -.5,0,.5,   .5,0,.5,
            -.5,0,-.5,  .5,0,-.5,

            -.5,0,-.5,   .5,0,-.5,
            -.5,1,-.5,  .5,1,-.5,
        ]
        var ind = [
            0,1,2,
            1,2,3,
            4,5,6,
            5,6,7,
        ]
        var tex = [
            0.0,0.0,    0.5,0.0,
            0.0,0.25,    0.5,0.25,

            0.0,0.25,    0.5,0.25,
            0.0,0.5,    0.5,0.5,
        ]
        var res;
        var len;
        res = createBigTree();
        len = Math.floor(pos.length/3.0);
      //  res[0].map(x=>pos.push(x));
      //  res[1].map(x=>ind.push(x+len))
      //  res[2].map(x=>tex.push(x));
        var arrays = {
            a_position : {
                numComponents: 3,
                data : pos
            },
            a_tex : {
              numComponents:2,
              data : tex
            },
            indices : {
                numComponents:3,
                data : ind
            }
        }
        pos = [];
        tex = [];
        ind = [];
        var res;
        len = 0;
        var bushPos = [
            [15,3,-1],
            [12,3,2],
            [8.0,3,3],
            [-4,3,4],
            [-5,3,3],
            [10,3,-5],
            [10,3,-3],
            [6,3,-2],
        ]
        var bushTypes = [
            0,0,0,2,1,0,1,0
        ]
        for (var i = 0; i < bushPos.length; i ++) {
            res = createBush(bushPos[i],bushTypes[i]);
            len = pos.length/3.0;
            res[0].map(x=>pos.push(x));
            res[1].map(x=>tex.push(x));
            res[2].map(x=>ind.push(x+len));
        }
        for (var i = 10; i < 15; i++) {
            for (var j = -5; j < 5; j++) {
                if ((i*i+j*j)%5==0) {
                    res = createBush2([i, .01, j]);
                    len = pos.length / 3.0;
                    res[0].map(x => pos.push(x));
                    res[1].map(x => tex.push(x));
                    res[2].map(x => ind.push(x + len));
                }
            }

        }
        this.buffer = twgl.createBufferInfoFromArrays(gl,arrays);
        var sceneryArrays = {
            a_position : {
                numComponents: 3,
                data : pos
            },
            a_tex : {
                numComponents:2,
                data : tex
            },
            indices : {
                numComponents:3,
                data : ind
            }
        }
        this.sceneryBuffer = twgl.createBufferInfoFromArrays(gl,sceneryArrays);
        this.texture = createGLTexture(gl,groundTex,false);
    }

    var setup = false;
    Ground.prototype.draw = function(drawingState) {
        var gl = drawingState.gl;
        var modelM = twgl.m4.scaling(this.size);
        twgl.m4.setTranslation(modelM,[drawingState.offset[0],
            drawingState.offset[1]-1.5,drawingState.offset[2]],modelM);
        gl.useProgram(groundShader.program);
        twgl.setBuffersAndAttributes(gl,groundShader,this.buffer);
        var offset = twgl.v3.create(0.0,0.0,0.0);
        twgl.setUniforms(groundShader, {
            view : drawingState.view,
            proj : drawingState.proj,
            model : modelM,
            offset : offset,
            uTexture : this.texture,
        });
        twgl.drawBufferInfo(gl,this.buffer);
      // gl.disable(gl.DEPTH_TEST);
        modelM = twgl.m4.scaling([1,1,1]);
        twgl.m4.setTranslation(modelM,[drawingState.offset[0]-2,
            drawingState.offset[1]-1.5,drawingState.offset[2]+2],modelM);
            twgl.setBuffersAndAttributes(gl,groundShader,this.sceneryBuffer);
        twgl.setUniforms(groundShader, {
            model : modelM,
        });
       // twgl.drawBufferInfo(gl,this.sceneryBuffer);
        gl.enable(gl.DEPTH_TEST);


    }
})();