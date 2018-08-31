var person;
var angle = 0;
window.onload = function() {
    var gl;
    var canvas;
    canvas = document.getElementById("canvas");
    canvas.height = 768;
    canvas.width =  768;
    var nTimes = 4;
    gl = canvas.getContext("webgl2");
    var drawingState = {
        gl: gl,
        proj: twgl.m4.identity(),
        view: twgl.m4.identity(),
        camera: twgl.m4.identity(),
        sunDirection: [0, 1, 0],
        rot : 0,
        offset: [3.5,0,-4],
        time: 0,
        player : undefined,
        startTime : Date.now(),
    }
    var input = {
        startXY : [0,0],
        lastXY : [0,0],
        center : [384,384],
        difference : [0,0],
        mode : 0,
        mousedown : false,
        click : false,
        mouseDownId : undefined,
        mousemoveId : undefined,
        moveReady : false,
        selected : {
            id:null,
            state:0
        },
        handleKeys : function(e) {
            switch (e.keyCode) {
                case (192): {
                    drawingState.offset[1] += .1;
                    break;
                }
                case (32): {
                    drawingState.offset[1] -= .1;
                    break;
                }
                case (16): {
                    if (nTimes > 1.05) {
                        nTimes -= .05;
                    }
                    break;
                }
                case (90): {
                    nTimes += .05;
                    break;
                }
                case (48): {
                    input.mode = e.keyCode-48;
                    break;
                }
                case (49): {
                    input.mode = e.keyCode-48;
                    break;
                }
                case (50): {
                    input.mode = e.keyCode-48;
                    break;
                }
                case (51): {
                    input.mode = e.keyCode-48;
                    break;
                }
                case (52): {
                    input.mode = e.keyCode-48;
                    break;
                }
                case (17): {
                    problem.createProblem();
                    break;
                }
                case (65) : {
                    drawingState.rot += Math.PI/32.0;
                    problem.test.rot += Math.PI/32.0;
                    lookFrom[0] = 3.0*Math.sin(drawingState.rot);
                    lookFrom[2] = -3.0 + 3.0*Math.cos(drawingState.rot);
                    drawingState.camera = twgl.m4.lookAt(lookFrom, lookAt, [0, 1, 0]);
                    drawingState.view = twgl.m4.inverse(drawingState.camera);
                    break;
                }
                case (68) : {
                    problem.test.animation.id = 1;
                    drawingState.rot -= Math.PI/32.0;
                    problem.test.rot -= Math.PI/32.0;
                    lookFrom[0] = 3.0*Math.sin(drawingState.rot);
                    lookFrom[2] = -3.0 + 3.0*Math.cos(drawingState.rot);
                    drawingState.camera = twgl.m4.lookAt(lookFrom, lookAt, [0, 1, 0]);
                    drawingState.view = twgl.m4.inverse(drawingState.camera);
                    break;
                }
                case (69) : {
                    problem.test.animation.id = 1;
                    drawingState.offset[0] -= Math.cos(drawingState.rot)*.1;
                    drawingState.offset[2] -= Math.sin(drawingState.rot)*.1;
                    break;
                }
                case (81) : {
                    problem.test.animation.id = 1;
                    drawingState.offset[0] += Math.cos(drawingState.rot)*.1;
                    drawingState.offset[2] += Math.sin(drawingState.rot)*.1;
                    break;
                }
                case (83) : {
                    problem.test.animation.id = 1;
                    drawingState.offset[0] -= Math.sin(drawingState.rot)*.1;
                    drawingState.offset[2] -= Math.cos(drawingState.rot)*.1;
                    break;
                }
                case (87) : {
                    problem.test.animation.id = 1;

                    drawingState.offset[0] += Math.sin(drawingState.rot)*.1;
                    drawingState.offset[2] += Math.cos(drawingState.rot)*.1;
                    break;
                }
            }
        },
        handleMouseDown : function(e) {
            if (!input.mousedown && input.mode == 0) {
                input.startXY = [
                    e.clientX, e.clientY
                ]
                input.lastXY = [
                    e.clientX, e.clientY
                ]
                input.mousedown = true;
                input.moveReady = true;
            } else {
                input.click = true;
                input.lastXY = [e.pageX,gl.drawingBufferHeight-e.pageY];}
        },
        handleMouseMove : function(e) {
            input.click = false;
            if (input.moveReady) {
                input.lastXY = [e.pageX,gl.drawingBufferHeight-e.pageY];
                input.difference = [
                    e.pageX-input.center[0],
                    e.pageY-input.center[1]
                ]

                input.moveReady = false;
                //console.log(input.mode)
                if (input.mousedown && input.mode == 0) {
                    drawWheel = true;
                    input.lastXY = [
                        e.clientX, e.clientY
                    ];
                    var delta = [
                        input.lastXY[0]-input.startXY[0],
                        -input.lastXY[1]+input.startXY[1]
                    ];
                    var mag = Math.sqrt(delta[0]*delta[0]+delta[1]*delta[1]);
                    delta = [delta[0]/mag,delta[1]/mag];
                    var ang = Math.acos(delta[1]);
                    if (delta[0] < 0)
                        ang = 2*Math.PI-ang;
                    angle = ang;
                }
            }
        },
        handleMouseUp : function(e) {
            console.log(input.startXY)
            console.log(input.lastXY)
            if (input.startXY[0] == input.lastXY[0] && input.mode == 0) {
                input.click = true;
            }
            problem.cubeTest.cubeMap.selected.state = 3;
            problem.test.selectedValue = problem.numberWheel.selected;
            input.mousedown = false;
            if (drawWheel) {
                if (problem.numberWheel.time < 0.0) {
                    drawWheel = false;
                }
            }
        },
    }
    var timer = window.setInterval(function() {
        input.moveReady = true;
    },100)
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }, false);
    document.addEventListener('keydown',input.handleKeys);
    document.addEventListener('mousedown',input.handleMouseDown);
    document.addEventListener('mousemove',input.handleMouseMove);
    document.addEventListener('mouseup',input.handleMouseUp);
    var problem = {
        player : undefined,
        numberWheel : undefined,
        water: undefined,
        fog : undefined,
        scenery: undefined,
        cubeTest: undefined,
        ground : undefined,
        numberTest : [],
        numbers : [],
        question : [0,0,0],
        answer : undefined,
        createProblem : function() {
            var n1 = Math.floor(Math.random()*Math.pow(10,nTimes))+"";
            var n2 = Math.floor(Math.random()*Math.pow(10,nTimes))+"";
            //console.log(n1 + ' ' + n2);
            var op = 0;
            this.question = [n1,n2,op];
            this.numberTest.init(drawingState,this.question,this.answer);
            this.cubeTest.cubeMap.setup = false;
            this.cubeTest.init(drawingState,this.question);
       //    //console.log(this.question)
        },
        setup : function() {
            this.ground = new Ground();
            this.ground.init(drawingState);
            this.numberTest = new Numbers();
            this.cubeTest = new Cubes();
            this.createProblem();
            this.test = new Player();
            this.test.init(drawingState);
            this.numberWheel = new NumberWheel(0);
            this.numberWheel.init(drawingState);
        },
        update : function() {
            this.numberTest.init(drawingState,problem.question);
        },
        draw : function(drawingState) {
            if (input.click && (input.mode > 0)) {
                input.click = false;
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                this.cubeTest.draw(drawingState,1);
                var pixels = new Uint8Array(4);
                gl.readPixels(input.lastXY[0], input.lastXY[1], 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                this.cubeTest.checkHitbox(pixels,input);
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
            } else if (input.click && input.mode == 0) {
                input.click = false;
                this.numberTest.update(drawingState, this.test.selectedValue);
            }
            if (this.cubeTest.cubeMap.selected.state > 0) {
                this.cubeTest.update(drawingState,input);
            }
            gl.disable(gl.DEPTH_TEST);
            if (drawWheel) {
                this.numberWheel.update(drawingState, input);
                if (this.numberWheel.time < 0)
                    drawWheel = false;
            }
            gl.enable(gl.DEPTH_TEST);
            this.ground.draw(drawingState);
            this.numberTest.draw(drawingState);
            this.cubeTest.draw(drawingState,0);
            gl.disable(gl.DEPTH_TEST);
            if (drawWheel) {
                this.numberWheel.draw(drawingState)
            }
            gl.enable(gl.DEPTH_TEST);
            this.test.draw(drawingState);
        }
    }
    var drawWheel = false;
    var lookAt =   [0, -.5, -3.];
    var lookFrom = [0, 0, 0];
    lookFrom[0] = 3.*Math.sin(drawingState.rot);
    lookFrom[2] = -3.0 + 3.*Math.cos(drawingState.rot);
    var fov = 1.0;
    drawingState.proj = twgl.m4.perspective(fov, 1, 0.01, 100);
    drawingState.camera = twgl.m4.lookAt(lookFrom, lookAt, [0, 1, 0]);
    drawingState.view = twgl.m4.inverse(drawingState.camera);
    problem.setup();
    problem.update();
    var nFrames = 0;
    var startTime = Date.now();
    var draw = function() {
        drawingState.camera = twgl.m4.lookAt(lookFrom, lookAt, [0, 1, 0]);
        drawingState.view = twgl.m4.inverse(drawingState.camera);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        problem.draw(drawingState);
        nFrames++;
        if (nFrames > 1000) {
            //console.log(Date.now()-startTime);
            startTime = Date.now();
            nFrames = 0;
        }

        requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)
}


var createGLTexture = function (gl, image, flipY) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if(flipY){
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}