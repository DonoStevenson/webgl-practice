var Player = undefined;
var NumberWheel = undefined;
(function() {
    "use strict"
    var testImg3 = new Image();
    var numberWheel = new Image();
    var shaderProgram = undefined;
    numberWheel.src = "Graphics/Project/Textures/numberWheel.png";
    testImg3.src = "Graphics/Project/Textures/testImg8.png";
    Player = function Player() {
        this.buffers = null;
        this.texture = null;
        this.scale = [.5,.5,.5];
        this.rot = 0.0;
        this.selectedValue = 0;
        this.height = 1.0;
        this.width = .75;
        this.position = [0,-1.5,-3.];
        this.rotations = {
            lArm : [0,0,0],
            lForeArm : [0],
            rArm : [0,0,0],
            rForeArm : [0],
            lLeg : [0,0,0],
            lLowerLeg : [0],
            rLeg : [0,0,0],
            rLowerLeg : [0],
        }
        this.rotationDeltas = {
            lArm : [0,0,0],
            lForeArm : [0],
            rArm : [0,0,0],
            rForeArm : [0],
            lLeg : [0,0,0],
            lLowerLeg : [0],
            rLeg : [0,0,0],
            rLowerLeg : [0],
        }
        this.animation = {
            id : 0,
            state : 0,
            time : 0,
            slice : 30.0,
        }
    }

    Player.prototype.getBodyAttributes = function() {
        var pos = [
        ]
        var r = 0.0;
        var theta = 0;
        var cos,sin;
        var col = [
        ]
        var tex = [
        ]
        var ind = [
        ]
        var boneIds = [];
        var i,j;
        var l = 20;
        var nAround = 10;
        var d = 0.0;
        for (i = 0; i < l; i++) {
            if (i < l/2.0)  {
                d += Math.PI/l;
            } else {
                d -= Math.PI/l;
            }
            r = (this.width/2.0)*Math.sin(d);
            for (j = 0; j < nAround; j++) {
                theta = j*(2.0*Math.PI)/nAround + Math.PI/2.0;
                cos = r*Math.cos(theta);
                sin = r*Math.sin(theta);
                pos.push(
                    cos,this.height/3.0+i*(this.height/(l-1)),sin,
                )
                col.push(
                    .75,.75,.75,
                )
                tex.push(
                    (0.95/(nAround-1))*j,.5-(.5/(l-1))*i,
                )
                boneIds.push(0);
            }
        }
        for (i = 0; i < l-1; i++) {
            for (j = 0; j < nAround; j++) {
                ind.push(
                    nAround*i+j,nAround*i+j+1,nAround*i+j+nAround,
                    nAround*i+j+1,nAround*i+j+nAround,nAround*(i+1)+j+1,
                )
            }
        }
        return [pos,col,tex,ind,boneIds];
    }
    Player.prototype.getArmAttributes = function() {
        var boneIds = [
            1,1,1,1,
            1,1,1,1,
            2,2,2,2,
            2,

            3,3,3,3,
            3,3,3,3,
            4,4,4,4,
            4,

            5,
            5,5,5,5,
            6,6,6,6,
            6,

            7,
            7,7,7,7,
            8,8,8,8,
            8,

        ];
        var r = this.width/2.0;
        var l = this.height/3.0;
        var aH = this.height-this.height/4.0;
        var lS = this.height/3.0+.2;
        var lW = .05 + this.height/64.0;
        var pos = [
            //0-7 LArm
            r-.1,aH,-.05,     r-.1,aH+.05,.0,

            r-.1,aH,.05,   r-.1,aH-.05,.0,

            r+l/2.0,aH,-.075,    r+l/2.0,aH+.075,.0,
            r+l/2.0,aH,.075,     r+l/2.0,aH-.075,.0,
            //8-11 Forearm
            r+l/2.0,aH,-.075,   r+l/2.0,aH+.075,.0,
            r+l/2.0,aH,.075,        r+l/2.0,aH-.075,.0,
            //12 End Point
            r+l,aH,0.0,


            //13-20 LArm
            -r+.1,aH,-.05,     -r+.1,aH+.05,.0,

            -r+.1,aH,.05,   -r+.1,aH-.05,.0,

            -r-l/2.0,aH,-.075,    -r-l/2.0,aH+.075,.0,
            -r-l/2.0,aH,.075,     -r-l/2.0,aH-.075,.0,
            //8-11 Forearm
            -r-l/2.0,aH,-.075,   -r-l/2.0,aH+.075,.0,
            -r-l/2.0,aH,.075,        -r-l/2.0,aH-.075,.0,
            //12 End Point
            -r-l,aH,0.0,

            //26
            // center = (0.1,-.4,0.1)
            -0.1,lS-.1,.0,
            //27-30
            -.1-lW,lS-lS/2.0,-lW,      -.1+lW, lS-lS/2.0,-lW,
            -.1-lW,lS-lS/2.0,lW,      -.1+lW, lS-lS/2.0,lW,
            //31-34 Forearm
            -.1-lW,lS-lS/2.0,-lW,      -.1+lW, lS-lS/2.0,-lW,
            -.1-lW,lS-lS/2.0,lW,      -.1+lW, lS-lS/2.0,lW,
            //35 End Point
            -0.1,0.0,0.0,

             0.1,lS-.1,.0,
            //27-30
             .1-lW,lS-lS/2.0,-lW,       .1+lW, lS-lS/2.0,-lW,
             .1-lW,lS-lS/2.0,lW,       .1+lW, lS-lS/2.0,lW,
            //31-34 Forearm
             .1-lW,lS-lS/2.0,-lW,       .1+lW, lS-lS/2.0,-lW,
             .1-lW,lS-lS/2.0,lW,       .1+lW, lS-lS/2.0,lW,
            //35 End Point
             0.1,0.0,0.0,
        ];
        var indBase = [
            0,1,4,
            1,4,5,
            1,2,5,
            2,5,6,
            2,3,6,
            3,6,7,
            0,3,4,
            3,4,7,
            8,9,12,
            9,10,12,
            10,11,12,
            11,8,12,
            8,9,4,
            4,5,9,
            9,10,5,
            5,6,10,
            10,11,6,
            6,7,11,
            11,8,7,
            7,4,8,
        ];
        var ind = [];
        indBase.map(x=>ind.push(x));
        indBase.map(x=>ind.push(x+13));
        ind.push(
            26,27,28,   26,28,30,
            26,29,30,   26,27,29,

            27,28,31, 28,31,32,
            28,30,32,   30,32,34,
            29,30,33,   30,33,34,
            27,29,31,   29,31,33,
            31,32,35,   32,34,35,
            33,34,35,   31,33,35,

            36,37,38,   36,38,40,
            36,39,40,   36,37,39,

            37,38,41, 38,41,42,
            38,40,42,   40,42,44,
            39,40,43,   40,43,44,
            37,39,41,   39,41,43,
            41,42,45,   42,44,45,
            43,44,45,   41,43,45,
        );
        var tex = [
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,
            0.95,0.95,



        ];

        var col = [
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,

            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,

            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,

            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
            .5,.5,.5,
        ];
        return [pos,col,tex,ind,boneIds];
    }
    Player.prototype.getPlantAttributes = function() {
        var pS = .9*this.height+this.height/3.0;
        var pos = [
            0,pS,0,
            -.5,-.1+pS,-.5,
            0,.1+pS,-.5,
            .4,-.1+pS,-.5,
            -.5,.1+pS,0,
            .5,.1+pS,0,
            -.5,-.1+pS,.5,
            0,.1+pS,.5,
            .5,-.1+pS,.5,

            0,.05+pS,0,
            -.5,-.05+pS,-.5,
            0,.15+pS,-.5,
            .4,-.05+pS,-.5,
            -.5,.15+pS,0,
            .5,.15+pS,0,
            -.5,-.05+pS,.5,
            0,.15+pS,.5,
            .5,-.05+pS,.5,

            0,.1+pS,0,
            -.5,pS,-.5,
            0,.2+pS,-.5,
            .4,pS,-.5,
            -.5,.2+pS,0,
            .5,.2+pS,0,
            -.5,pS,.5,
            0,.2+pS,.5,
            .5,pS,.5,
        ];
        var tex = [
            .25,.75,
            0,.5,
            .25,.5,
            .5,.5,
            0,.75,
            .5,.75,
            0,.99,
            .25,.99,
            .5,.99,

            .25,.75,
            0,.5,
            .25,.5,
            .5,.5,
            0,.75,
            .5,.75,
            0,.99,
            .25,.99,
            .5,.99,

            .25,.75,
            0,.5,
            .25,.5,
            .5,.5,
            0,.75,
            .5,.75,
            0,.99,
            .25,.99,
            .5,.99,
        ];
        var col = [
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
        ];
        var ind = [
            0,2,4,
            1,2,4,

            0,2,5,
            3,2,5,

            0,5,7,
            5,7,8,

            0,4,7,
            4,6,7,
        ];
        var ind2 = [
        ]
        for (var i = 0; i < 3; i++) {
            ind.map(x=>(ind2.push(x+9*i)))
        }
        var boneIds = [
            10,11,10,
            11,10,10,
            11,10,11,
            12,13,12,
            13,12,12,
            13,12,13,
            14,15,14,
            15,14,14,
            15,14,15,

        ];
        return [pos,col,tex,ind2,boneIds];
    }
    Player.prototype.update = function() {
        var boneArray = [];
        this.getAnimation();
        /*
            Bones Ordering
            0 - Body
            1 - L Arm
            2 - L ForeArm
            3 - R Arm
            4 - R ForeArm
            5 - L Leg
            6 - L Lower Leg
            7 - R Leg
            8 - R Lower Leg
            9 - Plant 0
            10 - Plant 1
            11 - Plant 2
            12 - Plant 3

            -.075,.0,.1,    0.0, .075,.1,
            .075,-.0,.1,     0.0,-0.075,.1,
            -.075,.0,.5,    0.0, .075,.5,
            .075,.0,.5,     0.0,-0.075,.5,

            -.075,.0,.5,    0.0, .075,.5,
            .075,.0,.5,     0.0,-0.075,.5,

            0.0,0.0,.7,
         */
        var r = this.width/2.0;
        var l = this.height/3.0;
        var aH = this.height-this.height/4.0;
        var lS = this.height/3.0+.2;
        var lW = .05 + this.height/64.0;
        var modelM = twgl.m4.scaling(this.scale);
        twgl.m4.rotateY(modelM,this.rot,modelM);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var lArm = twgl.m4.copy(modelM);
        twgl.m4.translate(lArm,[r-.1,aH,0.0],lArm);
        twgl.m4.rotateX(lArm,this.rotations.lArm[0],lArm);
        twgl.m4.rotateY(lArm,this.rotations.lArm[1],lArm);
        twgl.m4.rotateZ(lArm,this.rotations.lArm[2],lArm);
        twgl.m4.translate(lArm,[-r+.1,-aH,0.0],lArm);
        var lForearm = twgl.m4.copy(lArm);
        twgl.m4.translate(lForearm,[r+l/2.0,aH,0.0],lForearm);
        twgl.m4.rotateY(lForearm,this.rotations.lForeArm[0],lForearm);
        twgl.m4.translate(lForearm,[-(r+l/2.0),-aH,0.0],lForearm);
        var rArm = twgl.m4.copy(modelM);
        twgl.m4.translate(rArm,[-r+.1,aH,0.0],rArm);
        twgl.m4.rotateX(rArm,this.rotations.rArm[0],rArm);
        twgl.m4.rotateY(rArm,this.rotations.rArm[1],rArm);
        twgl.m4.rotateZ(rArm,this.rotations.rArm[2],rArm);
        twgl.m4.translate(rArm,[r-.1,-aH,0.0],rArm);
        var rForearm = twgl.m4.copy(rArm);
        twgl.m4.translate(rForearm,[-r-l/2.0,aH,0.0],rForearm);
        twgl.m4.rotateY(rForearm,this.rotations.rForeArm[0],rForearm);
        twgl.m4.translate(rForearm,[-(-r-l/2.0),-aH,0.0],rForearm);
        var lLeg = twgl.m4.copy(modelM);
        twgl.m4.translate(lLeg,[-.1,lS-.1,0.0],lLeg);
        twgl.m4.rotateX(lLeg,this.rotations.lLeg[0],lLeg);
        twgl.m4.rotateY(lLeg,this.rotations.lLeg[1],lLeg);
        twgl.m4.rotateZ(lLeg,this.rotations.lLeg[2],lLeg);
        twgl.m4.translate(lLeg,[.1,-(lS-.1),0.0],lLeg);
        var lLowerLeg =  twgl.m4.copy(lLeg);
        twgl.m4.translate(lLowerLeg,[-.1,lS-lS/2.0,0.0],lLowerLeg);
        twgl.m4.rotateX(lLowerLeg,this.rotations.lLowerLeg[0],lLowerLeg);
        twgl.m4.translate(lLowerLeg,[.1,-(lS-lS/2.0),0.0],lLowerLeg);
        var rLeg = twgl.m4.copy(modelM);
        twgl.m4.translate(rLeg,[.1,lS-.1,0.0],rLeg);
        twgl.m4.rotateX(rLeg,this.rotations.rLeg[0],rLeg);
        twgl.m4.rotateY(rLeg,this.rotations.rLeg[1],rLeg);
        twgl.m4.rotateZ(rLeg,this.rotations.rLeg[2],rLeg);
        twgl.m4.translate(rLeg,[-.1,-(lS-.1),0.0],rLeg);
        var rLowerLeg =  twgl.m4.copy(rLeg);
        twgl.m4.translate(rLowerLeg,[.1,lS-lS/2.0,0.0],rLowerLeg);
        twgl.m4.rotateX(rLowerLeg,this.rotations.rLowerLeg[0],rLowerLeg);
        twgl.m4.translate(rLowerLeg,[-.1,-(lS-lS/2.0),0.0],rLowerLeg);
        modelM.map(x=>boneArray.push(x));
        lArm.map(x=>boneArray.push(x));
        lForearm.map(x=>boneArray.push(x));
        rArm.map(x=>boneArray.push(x));
        rForearm.map(x=>boneArray.push(x));
        lLeg.map(x=>boneArray.push(x));
        lLowerLeg.map(x=>boneArray.push(x));
        rLeg.map(x=>boneArray.push(x));
        rLowerLeg.map(x=>boneArray.push(x));
        modelM.map(x=>boneArray.push(x));
        var i;
        var plant;
        for (i = 0; i < 4; i++) {
            plant = twgl.m4.copy(modelM);
            twgl.m4.translate(plant,[0,this.height*(3.0/2.0),0],plant);
            twgl.m4.rotateX(plant,.05*Math.cos(Date.now()*.001),plant);
            twgl.m4.rotateY(plant,i*.5+.05*Math.cos(Date.now()*.001),plant);
            twgl.m4.rotateZ(plant,.05*Math.sin(Date.now()*.001),plant);
            twgl.m4.translate(plant,[0,-this.height*(3.0/2.0),0],plant);
            plant.map(x=>boneArray.push(x));
            twgl.m4.rotateY(plant,i*.5+.05*Math.cos(Date.now()*.001),plant);
            plant.map(x=>boneArray.push(x));

        }
        return boneArray;
    }
    Player.prototype.getAnimation = function() {
        //Walking
        switch (this.animation.id) {
            //Idle
            case 0 : {
                switch (this.animation.state) {
                    case 0 : {
                        /*
                        var rot = this.rotations;
                        this.rotationDeltas = {
                            lArm : -1.0*rot.lArm,
                            lForeArm : -1.0*rot.lForeArm,
                            rArm : -1.0*rot.rArm,
                            rForeArm : -1.0*rot.rForeArm,
                            lLeg : -1.0*rot.lLeg,
                            lLowerLeg : -1.0*rot.lLowerLeg,
                            rLeg : -1.0*rot.rLeg,
                            rLowerLeg : -1.0*rot.rLowerLeg,
                        }
                        */
                        break;
                    }
                    case 1 : {
                        /*
                        this.rotations.lArm = [
                            this.rotations.lArm[0]
                        ];
                        this.rotations.lForeArm = [];
                        this.rotations.rArm = [];
                        this.rotations.rForeArm = [];
                        this.rotations.lLeg = [];
                        this.rotations.lLowerLeg = [];
                        this.rotations.rLeg = [];
                        this.rotations.rLowerLeg = [];
                                            */
                        break;
                    }
                }
                break;
            }
            //Walking
            case 1 : {
                switch (this.animation.state) {
                    //Get Difference from Animation Start
                    case 0 : {
                        this.rotationDeltas.lArm[2] =
                            this.rotations.lArm[2] - Math.PI/3.0;
                        this.rotationDeltas.rArm[2] =
                            this.rotations.rArm[2] + Math.PI/3.0;
                        this.animation.state = 1;
                        this.animation.time = 0;
                        break;
                    }
                    //Move to Start
                    case 1 : {
                        this.rotations.lArm[2] += this.rotationDeltas.lArm[2]/this.animation.slice;
                        this.rotations.rArm[2] += this.rotationDeltas.rArm[2]/this.animation.slice;
                        if (this.animation.time == this.animation.slice) {
                            this.animation.state = 2;
                            this.animation.time = 0;
                        } else {
                            this.animation.time++;
                        }
                        break;
                    }
                    //Repeat Animation
                    case 2 : {
                        var s = Math.sin(this.animation.time);
                        this.rotations.lArm[0] = s;
                        this.rotations.rArm[0] = -s;
                        this.rotations.lLeg[0] = s;
                        this.rotations.rLeg[0] = -s;
                        this.rotations.lForeArm[0] = Math.max(s,0.0);
                        this.rotations.rForeArm[0] = Math.min(s,0.0);
                        this.rotations.lLowerLeg[0] = Math.min(-s,0.0);
                        this.rotations.rLowerLeg[0] = Math.min(s,0.0);

                        if (this.animation.time == 2.0*Math.PI) {
                            this.animation.time = 0;
                        } else {
                            this.animation.time += Math.PI/60.0;
                        }
                        break;
                    }
                }
                break;
            }
        }
    }
    Player.prototype.init = function(drawingState) {
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(drawingState.gl, ['vs', 'fs']);
        }
        var pos = [];
        var col = [];
        var tex = [];
        var ind = [];
        var boneIds = [];
        var len;
        var result;
        for (var i = 0; i < 3; i++) {
            len = pos.length/3.0;
            switch (i) {
                case 0 : {
                    result = this.getBodyAttributes();
                    break;
                }
                case 1 : {
                    result = this.getArmAttributes();
                    break;
                }
                case 2 : {
                    result = this.getPlantAttributes();
                    break;
                }
            }
            result[0].map(x=>pos.push(x));
            result[1].map(x=>col.push(x));
            result[2].map(x=>tex.push(x));
            result[3].map(x=>ind.push(x+len));
            result[4].map(x=>boneIds.push(x));
        }
        var arrays = {
            a_position : {
                numComponents:3,
                data : pos
            },
            bone_id : {
                numComponents:1,
                data : boneIds
            },
            a_color : {
                numComponents:3,
                data: col
            },
            tex_coords : {
                numComponents:2,
                data: tex
            },
            indices : {
                numComponents:3,
                data: ind
            }
        }
        this.texture = createGLTexture(drawingState.gl,testImg3,false);
        this.buffer = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
    }
    var t = true;
    Player.prototype.draw = function(drawingState) {
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        var boneArray = this.update(drawingState);
        twgl.setBuffersAndAttributes(gl,shaderProgram,this.buffer);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view,
            proj:drawingState.proj,
            uTexture : this.texture,
            bone : boneArray,
        });
        twgl.drawBufferInfo(gl,this.buffer);

    }
    NumberWheel = function NumberWheel(id) {
        this.position = [0,0,0];
        this.id = id;
        this.buffers = null;
        this.basePos = null;
        this.selected = 0;
        this.time = 0;
    }
    NumberWheel.prototype.init = function(drawingState) {
        var pos = [];
        var tex = [];
        var ind = [];
        var col = [];
        var x = 0;
        var y = 1;
        var row = 0;
        for (var i = 0; i < 10; i++) {
            if (i==5)
                row = .5;
            var theta1 = (-Math.PI*i)/5;
            var theta2 = (-Math.PI*(i+1))/5
            var c1 = Math.cos(theta1);
            var s1 = Math.sin(theta1);
            var c2 = Math.cos(theta2)
            var s2 = Math.sin(theta2);
            pos.push(
                .25*(x*c1-y*s1),
                .25*(y*c1+x*s1),
                0,
                .5*(x*c1-y*s1),
                .5*(y*c1+x*s1),
                0,

                .25*(x*c2-y*s2),
                .25*(y*c2+x*s2),
                0,
                .5*(x*c2-y*s2),
                .5*(y*c2+x*s2),
                0,
            );
            tex.push(
                0.2*(i%5),.5+row, 0.2*(i%5),0+row,
                .2+0.2*(i%5),.5+row, .2+0.2*(i%5),0+row,
            )
            col.push(
                .25,.25,1,
                .25,.25,1,
                .25,.25,1,
                .25,.25,1,
            )
            ind.push(
                4*i,4*i+1,4*i+2,
                4*i+1,4*i+2,4*i+3
            )
        }
        var boneIds = [
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
        ]
        col = [
            .75,.75,0,
            .75,.75,0,
            .75,.75,0,
            .75,.75,0,

            .5,1,0,
            .5,1,0,
            .5,1,0,
            .5,1,0,

            0,1,0,
            0,1,0,
            0,1,0,
            0,1,0,

            0,1,.5,
            0,1,.5,
            0,1,.5,
            0,1,.5,

            0,0,1,
            0,0,1,
            0,0,1,
            0,0,1,

            .25,0,.75,
            .25,0,.75,
            .25,0,.75,
            .25,0,.75,

            .5,0,.5,
            .5,0,.5,
            .5,0,.5,
            .5,0,.5,

            1,0,.25,
            1,0,.25,
            1,0,.25,
            1,0,.25,

            .75,.25,0,
            .75,.25,0,
            .75,.25,0,
            .75,.25,0,

            .5,.5,0,
            .5,.5,0,
            .5,.5,0,
            .5,.5,0,

        ]
        var arrays = {
            a_position : {
                numComponents:3,
                data:pos
            },
            bone_id : {
                numComponents:1,
                data : boneIds
            },
            tex_coords : {
                numComponents:2,
                data:tex
            },
            a_color: {
                numComponents:3,
                data:col
            },
            indices : {
                numComponents:3,
                data:ind},
        }
        this.basePos = pos;
        this.texture = createGLTexture(drawingState.gl,numberWheel,false);
        this.buffer = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
    }
    NumberWheel.prototype.update = function(drawingState,inputState) {
        var temp = [];
        var curr = Math.floor(angle/.628);
        this.selected = curr;
        var x = 0;
        var y = 1;
        var dist;
        if (inputState.mousedown && this.time < 1.75) {
            this.time += .03;
        } else if (!inputState.mousedown && this.time >= 0.0) {
            this.time -= .03;
        } else {

        }
        for (var i = 0; i < 10; i++) {
            if (i == curr)
                dist = .05+.05*Math.cos(Date.now()*.01);
            else dist = 0;
            var theta1 = (-Math.PI*i)/5;
            var theta2 = (-Math.PI*(i+1))/5
            var c1 = Math.cos(theta1);
            var s1 = Math.sin(theta1);
            var c2 = Math.cos(theta2)
            var s2 = Math.sin(theta2);
            switch (i==curr) {
                case true : {
                    temp.push(
                        (dist+.2)*(x*c1-y*s1),
                        (dist+.2)*(y*c1+x*s1),
                        0,
                        (dist+.5)*(x*c1-y*s1),
                        (dist+.5)*(y*c1+x*s1),
                        0,

                        (dist+.2)*(x*c2-y*s2),
                        (dist+.2)*(y*c2+x*s2),
                        0,
                        (dist+.5)*(x*c2-y*s2),
                        (dist+.5)*(y*c2+x*s2),
                        0,
                    );
                    break;
                }
                case false : {
                    temp.push(
                        .2*(x*c1-y*s1),
                        .2*(y*c1+x*s1),
                        0,
                        .5*(x*c1-y*s1),
                        .5*(y*c1+x*s1),
                        0,

                        .2*(x*c2-y*s2),
                        .2*(y*c2+x*s2),
                        0,
                        .5*(x*c2-y*s2),
                        .5*(y*c2+x*s2),
                        0,
                    );
                    break;
                }
            }
        }
        twgl.setAttribInfoBufferFromArray(drawingState.gl,
            this.buffer.attribs.a_position,
            {numComponents:3, data: temp}
        )
    }
    NumberWheel.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.time,this.time,this.time]);
        twgl.m4.rotateY(modelM,drawingState.rot,modelM);
        twgl.m4.rotateX(modelM,-.155*Math.PI,modelM);
        twgl.m4.setTranslation(modelM,[0,-1.2,-3.],modelM);
        // var proj = twgl.m4.perspective(fov, 1, 0.01, 100);
        // var camera = twgl.m4.lookAt(lookFrom, lookAt, [0, 1, 0]);

        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program)
        twgl.setBuffersAndAttributes(gl,shaderProgram,this.buffer);
        var modelArray = [];
        modelM.map(x=>modelArray.push(x));
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view,
            proj:drawingState.proj,
            model: modelM,
            uTexture : this.texture,
            bone :  modelArray
        });
        twgl.drawBufferInfo(gl, this.buffer);
    }
})();