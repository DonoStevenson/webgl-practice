var Cubes = undefined;

(function() {
    "use strict";
    var cubeShader = undefined;
    var blankTexture = new Image();
    blankTexture.src = "Graphics/Project/Textures/blankTexture.png";
    var cubeTexture = new Image();
    cubeTexture.src = "Graphics/Project/Textures/CubeTexture.png";

    var Cube = function(height,pos,id,place) {
        this.height = parseInt(height);
        this.position = pos;
     //   this.position[1] = -2.0+.185*height;
        this.id = id;
        this.state = 0;
        this.place = place;
    }
    var dropPoint = function(id,position,digit,place) {
        this.id = id;
        this.position = position;
        this.position[1] = 0;
        this.digit = digit;
        this.count = 0;
        this.place = place;
    }
    var cubeMap = {
        nCubes : 0,
        coords : [0,0,0,0],
        scale : [.5,.5,.5],
        dropPoints : [],
        selected : new Cube(0,[0,0,0],-1),
        destination : [0,0,0],
        cubes : [],
        problem : [0,0,0],
        setup : false,
        below : undefined,
        fullUpdate : false,
        inside : function(position) {
          if (position[2] < -5.5) {
              if (this.coords[0] < position[0] && position[0] < this.coords[1]) {
                  return true;
              } else {
                  return false;
              }
          } else {
              if (this.coords[2] < position[0] && position[0] < this.coords[3]) {
                  return true;
              } else {
                  return false;
              }
          }
        },
        getClosestPoint : function(cube) {
          var minDist = 10000;
          var cDist;
          var closest = -1;
          var cubePos = [cube.position[0],cube.position[2]];
          var pointPos;
          this.cubes.forEach(function(element) {
              pointPos = [element.position[0],element.position[2]];
              cDist = Math.sqrt(
                  Math.pow(cubePos[0]-pointPos[0],2)+
                  Math.pow(cubePos[1]-pointPos[1],2));
              if (cDist < minDist) {
                  minDist = cDist;
                  closest = element;
              }
          });
          ////console.log(closest.position);
          return [closest,minDist];
        },
        addCube : function(cube) {
            this.cubes.push(cube)
        },
        removeCube : function(id) {
          var c1 = this.getCubeById(id);
          this.cubes.splice(c1[1], 1);
        },
        getCubeById : function(id) {
            var curr;
            for (var i = 0; i < this.cubes.length;i++) {
                curr = this.cubes[i];
                if (curr.id == id) {
                    return [curr,i];
                }
            }
            return [Cube(0,[0,0,0],-1),-1];
        },
        combineCubes : function(id1,id2) {
            var c1 = this.getCubeById(id1);
            var c2 = this.getCubeById(id2);
            if (c1[0].place == c2[0].place) {
                c2[0].height += c1[0].height;
                c2[0].position[1] += c1[0].height * .185;
                this.cubes.splice(c1[1], 1);
            }
        },
        cloneCubes : function(id) {
            var c = this.getCubeById(id)[0];
            cubeMap.addCube(new Cube(c.height, [c.position[0], c.position[1]+.5, c.position[2] - 1.0],
                this.nCubes + 1, c.place));
            this.nCubes++;
            cubeMap.selected = cubeMap.cubes[cubeMap.cubes.length-1];
            cubeMap.selected.id = cubeMap.cubes[cubeMap.cubes.length-1].id;
            cubeMap.selected.state = 1;
            cubeMap.fullUpdate = true;
        },
        promoteCubes : function(id) {
            var c = this.getCubeById(id)[0];
            if (c.height == 10) {
                c.height = 1;
                c.place++;
                cubeMap.fullUpdate = true;
            }
        },
        splitCube : function(id,amount) {
            var c = this.getCubeById(id)[0];
            var up = c.height - Math.floor((amount/32.0)*c.height);
            console.log(c.height + ' ' + amount + ' ' + up);
            c.height -= up;
            c.position[1] -=  up*.185;
            if (up > 0) {
                cubeMap.addCube(new Cube(up, [c.position[0] + 0.0, .185 * 2 * (c.height) - 2.0 + .185 * up, c.position[2] + 0.0],
                    this.nCubes + 1, c.place + 0.0));
                this.nCubes++;
                cubeMap.selected = cubeMap.cubes[cubeMap.cubes.length-1];
                cubeMap.selected.id = cubeMap.cubes[cubeMap.cubes.length-1].id;
            }
            cubeMap.fullUpdate = true;
          //  console.log(cubeMap.cubes);
           // console.log(cubeMap.selected.position[1])
        },
        setupProblem : function(problem) {
            this.cubes = [];
            this.nCubes = 0;
            this.dropPoints = [];
            var c;
            var diff = Math.abs(problem[0].length-problem[1].length);
            var d = [0,0];
            if (problem[0].length > problem[1].length) {
                d[1] = diff;
            } else {
                d[0] = diff;
            }

            this.coords = [
                -8.0+2.75*d[0], -7.0+2.75*(d[0]+problem[0].length),
                -10.75, -7.0+2.75*(d[1]+problem[1].length),
            ]
            for (var i = 0; i < 2; i++) {
                for (var j = 0 + d[i]; j < problem[i].length+d[i]; j++) {
                    c = problem[i].charAt(j-d[i]);
                    this.dropPoints.push(new dropPoint(
                        i * problem[i].length + j + 1,
                        [(-2.0+j)/this.scale[0], 0, (-3.25+2.0*i)/this.scale[2]],
                        c,
                        problem[i].length+d[i]-j-1));
                }
            }
//            this.position[1] = -2.0+.185*height;

            this.dropPoints.forEach(function(element) {
                this.addCube(
                    new Cube(element.digit,
                        [element.position[0],element.digit*.185-2.0,element.position[2]],this.nCubes+1,element.place)
                );
                this.nCubes++;
            },this);
            this.setup = true;
        },
    }
    Cubes = function() {
        this.postion = [0,0,0];
        this.scale = [.5,.5,.5];
        this.buffer = undefined;
        this.texture = undefined;
        this.blankTexture = undefined;
        this.cubeMap = cubeMap;
    }

    var getPlaceColor = function(place) {
        var clr = [];
        switch (place) {
            case 0 : {
                clr.push([.7,.1,.1]);
                break;
            }
            case 1 : {
                clr.push( [.1,.7,.1]);
                break;
            }
            case 2 : {
                clr.push( [.3,.3,.8]);
                break;
            }
            case 3 : {
                clr.push( [.1,.4,.4]);
                break;
            }
            case 4 : {
                clr.push( [1,1,0]);
                break;
            }
            default : {
                clr.push([1,1,1]);
                break;
            }
        }
        return clr;
    }
    var getCubeAttributes = function(height,pos,id,place) {
        var positions = [
            -.175+pos[0],.175*height+pos[1],.175+pos[2],  .175+pos[0],.175*height+pos[1],.175+pos[2],
            -.175+pos[0],.175*height+pos[1],-.175+pos[2],   .175+pos[0],.175*height+pos[1],-.175+pos[2],
            -.175+pos[0],-.175*height+pos[1],.175+pos[2],  .175+pos[0],-.175*height+pos[1],.175+pos[2],
            -.175+pos[0],-.175*height+pos[1],-.175+pos[2],   .175+pos[0],-.175*height+pos[1],-.175+pos[2],

            -.175+pos[0],.175*height+pos[1],.175+pos[2],  .175+pos[0],.175*height+pos[1],.175+pos[2],
            -.175+pos[0],.175*height+pos[1],-.175+pos[2],   .175+pos[0],.175*height+pos[1],-.175+pos[2],
            -.175+pos[0],-.175*height+pos[1],.175+pos[2],  .175+pos[0],-.175*height+pos[1],.175+pos[2],
            -.175+pos[0],-.175*height+pos[1],-.175+pos[2],   .175+pos[0],-.175*height+pos[1],-.175+pos[2],
        ];
        var idColors = [
            0,0.0039*id,0, 0,0.0039*id,0,
            0,0.0039*id,0, 0,0.0039*id,0,
            0,0.0039*id,0, 0,0.0039*id,0,
            0,0.0039*id,0, 0,0.0039*id,0,

            0,0.0039*id,0, 0,0.0039*id,0,
            0,0.0039*id,0, 0,0.0039*id,0,
            0,0.0039*id,0, 0,0.0039*id,0,
            0,0.0039*id,0, 0,0.0039*id,0,
        ]
        var color = getPlaceColor(place)[0];
        var colors = [];
            for (var i = 0; i < 16; i++) {
                color.map(x => colors.push(x));
            }
        var fractY = [
            height, height,
            height, height,
            height, height,
            height, height,
            height, height,
            height, height,
            height, height,
            height, height,
        ]
        var texCoords = [
            0.0,1.0,    1.0,1.0,
            0.0,0.0,    1.0,0.0,
            0.0,0.0,    1.0,0.0,
            0.0,1.0,    1.0,1.0,

            1.0,1.0,    0.0,1.0,
            0.0,1.0,    1.0,1.0,
            1.0,0.0,    0.0,0.0,
            0.0,0.0,    1.0,0.0,

        ]
        var indices = [
            0,1,2,  1,2,3,
            2,3,6,  3,6,7,
            4,5,6,  5,6,7,

            8,10,12, 10,12,14,
            8,9,12,  9,12,13,
            9,11,13, 11,13,15,
        ]
        return[positions,idColors,colors,texCoords,fractY,indices]
    }
    var startXY = [0,0];
    Cubes.prototype.checkHitbox = function(pixels,input) {
        input.selected.id = -1;
        cubeMap.selected = new Cube(0,[0,0,0],-1);
        cubeMap.cubes.forEach(function(ele) {
            if (ele.id == pixels[1]) {
                input.selected.id = ele.id;
                cubeMap.selected = ele;
                startXY = [input.lastXY[0],input.lastXY[1]];
                if (input.mode == 2) {
                    console.log(pixels);
                   cubeMap.splitCube(ele.id,pixels[2]);
                } else if (input.mode == 3) {
                    cubeMap.promoteCubes(ele.id);
                } else if (input.mode == 4) {
                    cubeMap.cloneCubes(ele.id);
                }
                cubeMap.selected.state = 1;
            }
        })
    }

    var checkDroppedBox = function(pos,id) {
        var minDist = 1000;
        var cDist;
        var XZ = [pos[0],pos[2]];
        var currXZ;
        var closest = id;
        cubeMap.cubes.forEach(function(ele) {
                currXZ = [ele.position[0],ele.position[2]];
                cDist = Math.sqrt(Math.pow(currXZ[0]-XZ[0],2) + Math.pow(currXZ[1]-XZ[1],2));
                if (cDist < minDist && ele.id != id) {
                    minDist = cDist;
                    closest = ele.id;
                }
            });
        return [closest,minDist];
    }
    var startPos = [0,0];
    var bottom;

    Cubes.prototype.fullUpdate = function(drawingState) {
        var gl = drawingState.gl;
        var results;
        var pos = [];
        var colors = [];
        var texCoords = [];
        var indices = [];
        cubeMap.cubes.forEach(function(ele) {
            results = getCubeAttributes(ele.height,ele.position,ele.id);
            var dist = pos.length/3.0;
                results[0].map(x => pos.push(x))
                results[1].map(x => colors.push(x))
                results[2].map(x => indices.push(x + dist))
        });
        var arrays = {
            a_position : {
                numComponents : 3,
                data : pos
            },
            a_color : {
                numComponents : 3,
                data : colors
            },
            indices : {
                numComponents : 3,
                data : indices
            }
        }
        this.buffer = twgl.createBufferInfoFromArrays(gl,arrays);
    }
    Cubes.prototype.update = function(drawingState,input) {
        var pos = [];
        var results;
        var res;
        cubeMap.cubes.forEach(function(ele) {
            if (cubeMap.selected.id == ele.id) {
                switch (cubeMap.selected.state) {
                    case 1 : {
                        startPos = [ele.position[0],ele.position[2]];
                        ele.position[1] += .1;
                        //console.log(ele.position[1]);
                        bottom = ele.height*.05;
                        //console.log(bottom + ' ' + ele.position[1]);
                        if (ele.position[1] > bottom) {
                            cubeMap.selected.state = 2;
                        }
                        break;
                    }
                    case 2 : {
                        res = checkDroppedBox(ele.position,ele.id);
                        if (res[1] < .5) {
                            bottom = 1.0+.05*ele.height + .05*(cubeMap.getCubeById(res[0])[0]).height;
                        } else {
                            bottom =.05*ele.height;
                        }
                        if (bottom > ele.position[1]+.05) {
                            ele.position[1] += .03;
                        } else if (bottom < ele.position[1]) {
                            ele.position[1] -= .03;
                        }
                        ele.position[0] = startPos[0]+.02*(input.lastXY[0]-startXY[0]);
                        ele.position[2] = startPos[1]+.02*(startXY[1]-input.lastXY[1]);
                        break;
                    }
                    case 3 : {
                        bottom = 0.0;
                        var dest = cubeMap.getClosestPoint(ele);
                        res = checkDroppedBox(ele.position,ele.id);
                        if (res[1] < .5) {
                            cubeMap.below = res[0];
                            bottom =  -2.0 + .185*ele.height + .37*(cubeMap.getCubeById(res[0])[0]).height;
                            cubeMap.selected.state = 5;
                        } else {
                            bottom = 0.0;
//                            cubeMap.destination = dest[0].position;
                            cubeMap.selected.state = 4;
                        }
                        /*else {
                            bottom = .05*ele.height;
                            cubeMap.selected.state = 6;
                        }
                        */
                        break;
                    }
                    case 4 : {
                        bottom = -2.0 + .185*ele.height;
                        if (ele.position[1] > bottom) {
                                ele.position[1] -= .05;
                            } else {
                            cubeMap.fullUpdate = true;
                                cubeMap.selected.state = 0;
                            }
                        break;
                    }
                    case 5 : {
                        //console.log('!!!!!!!!!!!!!!!')
                        if (ele.position[1] > bottom) {
                         ele.position[1] -= .05;
                        } else {
                            cubeMap.selected = new Cube(0,[0,0,0],-1);
                            cubeMap.combineCubes(ele.id, cubeMap.below);
                            cubeMap.fullUpdate = true;
                        }
                        break;
                    }
                    case 6 : {
                        if (ele.position[1] > bottom + ele.height) {
                            ele.position[1] -= .1;
                        } else if (ele.position[1] > bottom) {
                            ele.position[0] += .05;
                            ele.position[1] -= .1;
                        } else {
                            cubeMap.removeCube(ele.id);
                            cubeMap.selected = new Cube(0,[0,0,0],-1);
                            cubeMap.fullUpdate = true;
                        }
                        break;
                    }
                }
            }
                results = getCubeAttributes(ele.height, ele.position, ele.id,1);
                results[0].map(x => pos.push(x))
        });
        twgl.setAttribInfoBufferFromArray(drawingState.gl,
            this.buffer.attribs.a_position,
            {numComponents:3, data: pos});
        if (cubeMap.fullUpdate) {
            cubeMap.fullUpdate = false;
            this.init(drawingState,cubeMap.problem);
        }
    }
    Cubes.prototype.init = function(drawingState,problem) {
        var gl = drawingState.gl;
        if (!cubeShader) {
            cubeShader = twgl.createProgramInfo(gl,["cube-vs","cube-fs"]);
        }
        this.buffer = null;
        var results;
        var pos = [];
        var idColors = [];
        var colors = [];
        var texCoords = [];
        var fract = [];
        var indices = [];
        if (!cubeMap.setup) {
            cubeMap.setupProblem(problem);
        }
        cubeMap.cubes.forEach(function(ele) {
            results = getCubeAttributes(ele.height,ele.position,ele.id,ele.place);
            var dist = pos.length/3.0;
                results[0].map(x => pos.push(x))
                results[1].map(x => idColors.push(x))
                results[2].map(x => colors.push(x))
                results[3].map(x => texCoords.push(x))
                results[4].map(x => fract.push(x))
                results[5].map(x => indices.push(x + dist))
        });

        var hitboxArrays = {
            a_position : {
                numComponents : 3,
                data : pos
            },
            a_color : {
                numComponents : 3,
                data : idColors
            },
            a_tex : {
                numComponents:2,
                data : texCoords
            },
            a_fractY : {
                numComponents:1,
                data : fract
            },
            indices : {
                numComponents : 3,
                data : indices
            }
        };
        var arrays = {
            a_position : {
                numComponents : 3,
                data : pos
            },
            a_color : {
                numComponents : 3,
                data : colors
            },
            a_tex : {
                numComponents:2,
                data : texCoords
            },
            a_fractY : {
                numComponents:1,
                data : fract
            },
            indices : {
                numComponents : 3,
                data : indices
            }
        };
        this.texture = createGLTexture(gl,cubeTexture,false);
        this.blankTexture = createGLTexture(gl,blankTexture,false);
        this.hitboxBuffer= twgl.createBufferInfoFromArrays(gl,hitboxArrays);
        this.buffer = twgl.createBufferInfoFromArrays(gl,arrays);
    }

    Cubes.prototype.draw = function(drawingState,type) {
        var gl = drawingState.gl;
        var modelM = twgl.m4.scaling(cubeMap.scale);
        twgl.m4.setTranslation(modelM,[-3.0+drawingState.offset[0],
        drawingState.offset[1]-.52,
        drawingState.offset[2]],modelM);
        gl.useProgram(cubeShader.program);
        if (type == 0) {
            twgl.setBuffersAndAttributes(gl,cubeShader,this.buffer);
            twgl.setUniforms(cubeShader,{
                uTexture : this.texture,
            });
        } else if (type == 1) {
            twgl.setBuffersAndAttributes(gl,cubeShader,this.hitboxBuffer);
            twgl.setUniforms(cubeShader,{
                uTexture : this.blankTexture,
            });
        } else {

        }
        twgl.setUniforms(cubeShader,{
            view:drawingState.view,
            proj:drawingState.proj,
            model: modelM,
        });
        twgl.drawBufferInfo(gl,this.buffer);
    }
})();