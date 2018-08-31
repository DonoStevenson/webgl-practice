var Person = undefined;
var Rotations = undefined;


(function() {
    "use strict";
    var shaderProgram = undefined;
    var buffers = undefined;

    Person = function Person(name,position) {
        this.name = name;
        this.position = position;
        this.animation = {
            type:1,
            ArmLength:  .35,
            ForearmLength: .15,
            LegLength:  .5,
            lHandLoc:   [0,0,0],
            lHandTar:   [0,0,0],
            rHandLoc:   [0,0,0],
            rHandTar:   [0,0,0],
            lFootLoc:   [0,0,0],
            lFootTar:   [0,0,0],
            rFootLoc:   [0,0,0],
            rFootTar:   [0,0,0],
        };
        this.rotations = {
            head:[0,0,0],
            body:[0,0,0],
            lArm:[0,0,0],
            lForeArm:[0,0,0],
            rArm:[0,0,0],
            rForeArm:[0,0,0],
            lLeg:[0,0,0],
            lLowerLeg:[0,0,0],
            rLeg:[0,0,0],
            rLowerLeg:[0,0,0],
        }
    }

    Person.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ['vs', 'fs']);
            drawingState.program = shaderProgram;
        }
        if (!buffers) {
            var arrays = {
                a_position : {numComponents:3, data: [
                    //Torso 0-7
                        -.15,-.15,.05, .15,-.15,.05,
                        -.15,-.15,-.05, .15,-.15,-.05,

                        -.15,.35,.05, .15,.35,.05,
                        -.15,.35,-.05, .15,.35,-.05,
                    //Head 8-15
                        -.1,.35,.1, .1,.35,.1,
                        -.1,.35,-.1, .1,.35,-.1,

                        -.1,.5,.1, .1,.5,.1,
                        -.1,.5,-.1, .1,.5,-.1,

                    //Left Arm
                    //Upper Arm 16-23
                        -.135,.35,.05, -.135,.35,-.05,
                        -.135,.25,.05, -.135,.25,-.05,

                        -.35,.335,.05, -.35,.335,-.05,
                        -.35,.265,.05, -.35,.265,-.05,
                    //Forearm 24-31
                        -.35,.335,.05, -.35,.335,-.05,
                        -.35,.265,.05, -.35,.265,-.05,

                        -.5,.325,.025, -.5,.325,-.025,
                        -.5,.275,.025, -.5,.275,-.025,
                    //Right Arm
                    //Upper Arm 32-39
                        .135,.35,.05,  .135,.35,-.05,
                        .135,.25,.05,  .135,.25,-.05,

                        .35,.335,.05,  .35,.335,-.05,
                        .35,.265,.05,  .35,.265,-.05,
                    //Forearm 40-47
                        .35,.335,.05, .35,.335,-.05,
                        .35,.265,.05, .35,.265,-.05,

                        .5,.325,.025, .5,.325,-.025,
                        .5,.275,.025, .5,.275,-.025,
                    //Left Leg
                    //Upper Leg 48-55
                        -.15,-.125,.05,  0,-.125,.05,
                        -.15,-.125,-.05, 0,-.125,-.05,

                        -.135,-.4,.035,  -.025,-.4,.035,
                        -.135,-.4,-.035, -.025,-.4,-.035,
                    //Lower Leg 56-63
                        -.135,-.4,.035,  -.025,-.4,.035,
                        -.135,-.4,-.035, -.025,-.4,-.035,

                        -.1,-.65,.015,  -.05,-.65,.015,
                        -.1,-.65,-.015, -.05,-.65,-.015,
                    //Right Leg
                    //Upper Leg 64-71
                        .15,-.125,.05,  0,-.125,.05,
                        .15,-.125,-.05, 0,-.125,-.05,

                        .135,-.4,.035,  .025,-.4,.035,
                        .135,-.4,-.035, .025,-.4,-.035,
                    //Lower Leg 72-79
                        .135,-.4,.035,  .025,-.4,.035,
                        .135,-.4,-.035, .025,-.4,-.035,

                        .1,-.65,.015,  .05,-.65,.015,
                        .1,-.65,-.015, .05,-.65,-.015,
                    ]
                },
                indices : {numComponents:3,data: [
                        0,1,2, 1,2,3, 0,2,4, 2,4,6, 2,6,7, 2,3,7,
                        7,3,5, 1,3,5, 0,1,4, 1,4,5, 4,5,6, 5,6,7,

                        8,9,10, 9,10,11, 8,10,12, 10,12,14, 10,14,15, 10,11,15,
                        15,11,13, 9,11,13, 8,9,12, 9,12,13, 12,13,14, 13,14,15,

                        16,17,18, 17,18,19, 16,18,22, 16,20,22, 16,17,20, 17,20,21,
                        17,21,23, 17,19,23, 19,22,23, 19,18,22,

                        24,25,26, 25,26,27, 24,26,30, 24,28,30, 24,25,28, 25,28,29,
                        25,29,31, 25,27,31, 27,30,31, 27,26,30,

                        32,33,34, 33,34,35, 32,34,38, 32,36,38, 32,33,36, 33,36,37,
                        33,37,39, 33,35,39, 35,38,39, 35,34,38,

                        40,41,42, 41,42,43, 40,42,46, 40,44,46, 40,41,44, 41,44,45,
                        41,45,47, 41,43,47, 43,46,47, 43,42,46,

                        48,50,52, 50,52,54, 50,51,54, 51,54,55,
                        49,51,55, 49,53,55, 48,49,52, 49,52,53,

                        56,58,60, 58,60,62, 58,59,62, 59,62,63,
                        57,59,63, 57,61,63, 56,57,60, 57,60,61,

                        64,66,68, 66,68,70, 66,67,70, 67,70,71,
                        65,67,71, 65,69,71, 64,65,68, 65,68,69,

                        72,74,76, 74,76,78, 74,75,78, 75,78,79,
                        73,75,79, 73,77,79, 72,73,76, 73,76,77,
                    ]}
            }
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }
    }

    Person.prototype.animations = function() {
        //Walk
        var s = .5;
        switch (this.animation.type) {
            case 0 : {
                this.rotations.body[1] = Date.now()*.001;
                this.rotations.lLeg[0] = s*Math.sin(Date.now()*(s/200.0));
                this.rotations.rLeg[0] = s*Math.sin(Date.now()*(-s/200.0));
                this.rotations.lLowerLeg[0] = s + this.rotations.lLeg[0];
                this.rotations.rLowerLeg[0] = s + this.rotations.rLeg[0];
                this.rotations.lArm[2] = .425*Math.PI;
                this.rotations.lArm[0] = this.rotations.rLeg[0];
                this.rotations.rArm[0] = this.rotations.lLeg[0];
                this.rotations.rArm[2] = -.425*Math.PI;
                this.rotations.lForeArm[1] = -1.0*this.rotations.lArm[0];
                break;
            }
            case 1 : {
                var tLoc = [.25*Math.sin(Date.now()*.0001),0,.25*Math.cos(Date.now()*.001)];
                var cLoc = this.animation.lHandLoc;
                var bA = this.animation.ArmLength;
                var sA = this.animation.ForearmLength;
                var aX = Math.acos(
                    tLoc[0]/
                    Math.sqrt(tLoc[0]*tLoc[0]+tLoc[2]*tLoc[2])
                )
                var aY = Math.acos(
                    tLoc[1]/
                    Math.sqrt(tLoc[1]*tLoc[1]+tLoc[2]*tLoc[2])
                )
                var angle = Math.sqrt(
                    tLoc[0]*tLoc[0]+
                    tLoc[1]*tLoc[1]+
                    tLoc[2]*tLoc[2]);
                angle = Math.acos(tLoc[0]/angle);
                var c = Math.cos(angle)
                var s = Math.sin(angle);
                var topA = bA-sA;
                var delta = [
                    cLoc[0]-tLoc[0],
                    cLoc[1]-tLoc[1],
                    cLoc[2]-tLoc[2],
                ]
                var dist = Math.sqrt(delta[0]*delta[0]+delta[1]*delta[1]+delta[2]*delta[2]);
                var c = bA-sA;
                this.rotations.body[0] = Math.cos(Date.now()*.001);
                var thetaFA = (1.0 - dist/bA)*Math.PI;
                var thetaArm = [
                    //X rotates arm around +-25 degrees
                    0,
                    //Y moves arm forward 160 and back 20
                    aX,
                    //Z brings arm up and down +-90 degrees
                    0,
                ]
           //     if (this.rotations.lForeArm[1]/thetaFA < .99)
          //      this.rotations.lForeArm[1] = thetaFA;
                this.rotations.lArm[1] = thetaArm[1];
                this.rotations.lArm[2] = thetaArm[2];
                break;
            }
        }
    }
    Person.prototype.updateRot = function() {
        console.log('hi')
        Object.entries(this.rotations).forEach(function (key,value)
        {
            var x = document.getElementById(value+"0");
            if (x != null)
                x = x.value*Math.PI/180.0;
            else
                x=0;
            var y = document.getElementById(value+"1");
            if (y != null)
                y = y.value*Math.PI/180.0;
            else
                y=0;
            var z = document.getElementById(value+"2");
            if (z != null)
                z = z.value*Math.PI/180.0;
            else
                z=0;
            key[1][0] = x;
            key[1][1] = y;
            key[1][2] = z;
        })
    }
    Person.prototype.draw = function(drawingState) {
        //this.updateRot();
        this.animations();
        var saveM = twgl.m4.scaling([1.0,1.0,1.0]);
        var modelM = twgl.m4.scaling([1.0,1.0,1.0]);
        var cTime = Date.now();
        twgl.m4.rotateY(modelM,this.rotations.body[1],modelM);
        twgl.m4.rotateX(modelM,this.rotations.body[0],modelM);
        twgl.m4.rotateZ(modelM,this.rotations.body[2],modelM);
        twgl.m4.setTranslation(modelM,drawingState.offset,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, model: modelM });
        //Body
        twgl.drawBufferInfo(gl, buffers,gl.TRIANGLES, 36,0);
        //Head
        var tM = twgl.m4.translate(modelM,[0,.425,0]);
        twgl.m4.rotateY(tM,this.rotations.body[1],tM);
        twgl.m4.rotateX(tM,this.rotations.body[0],tM);
        twgl.m4.rotateZ(tM,this.rotations.body[2],tM);
        twgl.m4.translate(tM,[0,-.425,0],tM);
        twgl.setUniforms(shaderProgram,{
            model: tM });
        twgl.drawBufferInfo(gl, buffers,gl.TRIANGLES, 36,72);
        //Arm Left
        twgl.m4.translate(modelM,[-.135,.3,0],tM);
        twgl.m4.rotateY(tM,this.rotations.lArm[1],tM);
        twgl.m4.rotateX(tM,this.rotations.lArm[0],tM);
        twgl.m4.rotateZ(tM,this.rotations.lArm[2],saveM);
        twgl.m4.translate(saveM,[-.215,0,0],tM);
        twgl.m4.rotateY(tM,this.rotations.lForeArm[1],tM);
        twgl.m4.rotateX(tM,this.rotations.lForeArm[0],tM);
        twgl.m4.rotateZ(tM,this.rotations.lForeArm[2],tM);
        twgl.m4.translate(tM,[.215,0,0],tM);
        twgl.m4.translate(tM,[.135,-.3,0],tM);
        twgl.setUniforms(shaderProgram,{
            model: tM });
        twgl.drawBufferInfo(gl, buffers,gl.TRIANGLES, 30,204);
        twgl.m4.translate(saveM,[.135,-.3,0],tM);
        twgl.setUniforms(shaderProgram,{
            model: tM });
        twgl.drawBufferInfo(gl, buffers,gl.TRIANGLES, 30,144);
        twgl.setUniforms(shaderProgram,{
            model: modelM });
        //Arm Right
        twgl.m4.translate(modelM,[.135,.3,0],tM);
        twgl.m4.rotateY(tM,this.rotations.rArm[1],tM);
        twgl.m4.rotateX(tM,this.rotations.rArm[0],tM);
        twgl.m4.rotateZ(tM,this.rotations.rArm[2],saveM);
        twgl.m4.translate(saveM,[.215,0,0],tM);
        twgl.m4.rotateY(tM,this.rotations.rForeArm[1],tM);
        twgl.m4.rotateX(tM,this.rotations.rForeArm[0],tM);
        twgl.m4.rotateZ(tM,this.rotations.rForeArm[2],tM);
        twgl.m4.translate(tM,[-.215,0,0],tM);
        twgl.m4.translate(tM,[-.135,-.3,0],tM);
        twgl.setUniforms(shaderProgram,{
            model: tM });
        twgl.drawBufferInfo(gl, buffers,gl.TRIANGLES, 30,324);
        twgl.m4.translate(saveM,[-.135,-.3,0],tM);
        twgl.setUniforms(shaderProgram,{
            model: tM });
        twgl.drawBufferInfo(gl, buffers,gl.TRIANGLES, 30,264);
        //Leg Left

        twgl.m4.translate(modelM,[-.075,-.125,0],tM);
        twgl.m4.rotateY(tM,this.rotations.lLeg[1],tM);
        twgl.m4.rotateX(tM,this.rotations.lLeg[0],tM);
        twgl.m4.rotateZ(tM,this.rotations.lLeg[2],saveM);
        twgl.m4.translate(saveM,[0,-.275,0],tM);
        twgl.m4.rotateY(tM,this.rotations.lLowerLeg[1],tM);
        twgl.m4.rotateX(tM,this.rotations.lLowerLeg[0],tM);
        twgl.m4.rotateZ(tM,this.rotations.lLowerLeg[2],tM);
        twgl.m4.translate(tM,[0,.275,0],tM);
        twgl.m4.translate(tM,[.075,.125,0],tM);
        twgl.setUniforms(shaderProgram,{
            model: tM });
        twgl.drawBufferInfo(gl, buffers,gl.TRIANGLES, 24,432);
        twgl.m4.translate(saveM,[.075,.125,0],tM);
        twgl.setUniforms(shaderProgram,{
            model: tM });
        twgl.drawBufferInfo(gl, buffers,gl.TRIANGLES, 24,384);


        //Leg Right

        twgl.m4.translate(modelM,[.075,-.125,0],tM);
        twgl.m4.rotateY(tM,this.rotations.rLeg[1],tM);
        twgl.m4.rotateX(tM,this.rotations.rLeg[0],tM);
        twgl.m4.rotateZ(tM,this.rotations.rLeg[2],saveM);
        twgl.m4.translate(saveM,[0,-.275,0],tM);
        twgl.m4.rotateY(tM,this.rotations.rLowerLeg[1],tM);
        twgl.m4.rotateX(tM,this.rotations.rLowerLeg[0],tM);
        twgl.m4.rotateZ(tM,this.rotations.rLowerLeg[2],tM);
        twgl.m4.translate(tM,[0,.275,0],tM);
        twgl.m4.translate(tM,[-.075,.125,0],tM);
        twgl.setUniforms(shaderProgram,{
            model: tM });
        twgl.drawBufferInfo(gl, buffers,gl.TRIANGLES, 24,528);
        twgl.m4.translate(saveM,[-.075,.125,0],tM);
        twgl.setUniforms(shaderProgram,{
            model: tM });
        twgl.drawBufferInfo(gl, buffers,gl.TRIANGLES, 24,480);
    };
})();