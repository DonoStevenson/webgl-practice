var Numbers = undefined;
(function() {
    "use strict";
    var numberShader = undefined;

    var Answer = function(x) {
        this.x = x;
        this.value = 0;
    }
    var ansMap = {
        LR : [0,0],
        z : -3,
        setup : false,
        digits : [],
        getClosestPoint : function(X) {
            console.log(X);
            var minDist = 1000;
            var closest = -1;
            var cDist;
            this.digits.map(function(ele) {
                cDist = Math.abs(X+ele.x);
                if (minDist > cDist) {
                    closest = ele.x;
                    minDist = cDist;
                }
            })
            return closest;
        },
        inside : function(XZ) {
            if (this.z - .5 < XZ[1] && XZ[1] < this.z + .5) {
                if (this.LR[0] < XZ[0] && XZ[0] < this.LR[1]) {
                    return true;
                }
            }
            return false;
        },
        getDigitByX : function(x) {
            var res;
            ansMap.digits.map(function(ele) {
                if (ele.x == x) {
                    res = ele;
                }
            });
            return res;
        }
    }
    Numbers = function Numbers() {
        this.buffers = null;
        this.answerBuffer = null;
        this.position = [0,0,0];
    }
    Numbers.prototype.init = function(drawingState,problem) {
        var gl = drawingState.gl;
        if (!numberShader) {
            numberShader = twgl.createProgramInfo(drawingState.gl, ['number-vs', 'number-fs']);
        }
        var result = createProblem(problem);
        var arrays = {
            a_position : {
                numComponents : 3,
                data : result[0]
            },
            a_color : {
                numComponents : 3,
                data: result[1]
            },
            a_color2 : {
                numComponents : 3,
                data: result[2]
            },
            indices : {
                numComponents : 3,
                data : result[3]
            }
        }
        this.buffers = twgl.createBufferInfoFromArrays(gl,arrays);
        result = createAnswer(problem);
        var ansArrays = {
            a_position : {
                numComponents : 3,
                data : result[0]
            },
            a_color : {
                numComponents : 3,
                data: result[1]
            },
            a_color2 : {
                numComponents : 3,
                data: result[2]
            },
            indices : {
                numComponents : 3,
                data : result[3]
            }
        }
        this.answerBuffer = twgl.createBufferInfoFromArrays(gl,ansArrays);

    }
    Numbers.prototype.draw = function(drawingState) {
        var gl = drawingState.gl;
        var modelM = twgl.m4.scaling([1,1,1]);
        twgl.m4.rotateX(modelM,Math.PI/2.0,modelM);
        gl.useProgram(numberShader.program);
        var off = drawingState.offset;
        twgl.m4.setTranslation(modelM,
            [-5+off[0],
                off[1]+1.,
                -5+off[2]],
            modelM);
        twgl.setBuffersAndAttributes(gl,numberShader,this.buffers);
        twgl.setUniforms(numberShader,{
            view:drawingState.view,
            proj:drawingState.proj,
            model: modelM,
            time : Date.now()-drawingState.startTime,
        });
        twgl.drawBufferInfo(gl, this.buffers);
        twgl.setBuffersAndAttributes(gl,numberShader,this.answerBuffer);
        modelM = twgl.m4.scaling([1,1,1]);
        twgl.m4.setTranslation(modelM,
            [   off[0],
                off[1]-1.45,
                0+off[2]],
            modelM);
        twgl.setUniforms(numberShader,{
            model: modelM,
        });
        twgl.drawBufferInfo(gl, this.answerBuffer);

    }
    Numbers.prototype.update = function(drawingState,selectedValue) {
        if (ansMap.inside([drawingState.offset[0],drawingState.offset[2]])) {
            var res = ansMap.getClosestPoint(drawingState.offset[0]);
            var dig = ansMap.getDigitByX(res);
            dig.value = selectedValue;
            var result;
            var dist;
            var len;
            var j;
            var pos = [];
            var color = [];
            var color2 = [];
            var ind = [];
            var gl = drawingState.gl;
            ansMap.digits.map(function(element) {
                result = getDigitAttributes(element.value,element.x,0)
                dist = Math.floor(pos.length / 3.0);
                len = Math.floor(result[0].length/3.0);
                result[0].map(x => pos.push(x));
                for (j=0; j < len; j++)
                    result[1].map(x=>color.push(x));
                for (j=0; j < len; j++)
                    result[2].map(x=>color2.push(x));
                result[3].map(x => ind.push(x + dist));
            });
            len = Math.floor(pos.length/3.0);
            pos.push(
                -ansMap.LR[0],.05,-1, -ansMap.LR[1],.05,-1,
                -ansMap.LR[0],.05,1, -ansMap.LR[1],.05,1,

                -ansMap.LR[0]+1,-.05,-1.1, -ansMap.LR[1]-1,-.05,-1.1,
                -ansMap.LR[0]+1,-.05,1.1, -ansMap.LR[1]-1,-.05,1.1,

            )
            color.push(
                .1,.1,.1,
                .1,.1,.1,
                .1,.1,.1,
                .1,.1,.1,
                .1,.1,.1,
                .1,.1,.1,
                .1,.1,.1,
                .1,.1,.1,
            )
            color2.push(
                .1,.1,.1,
                .1,.1,.1,
                .1,.1,.1,
                .1,.1,.1,
                .1,.1,.1,
                .1,.1,.1,
                .1,.1,.1,
                .1,.1,.1,
            )
            ind.push(
                len,len+1,len+2,
                len+1,len+2,len+3,

                len,len+1,len+4,
                len+1,len+4,len+5,
                len+2,len+3,len+6,
                len+3,len+6,len+7,

                len,len+2,len+4,
                len+2,len+4,len+6,

                len+1,len+3,len+5,
                len+3,len+5,len+7,
            )
            var ansArrays = {
                a_position : {
                    numComponents : 3,
                    data : pos
                },
                a_color : {
                    numComponents : 3,
                    data: color
                },
                a_color2 : {
                    numComponents : 3,
                    data: color2
                },
                indices : {
                    numComponents : 3,
                    data : ind
                }
            }
            this.answerBuffer = twgl.createBufferInfoFromArrays(gl,ansArrays);
        }
    }
    var createAnswer = function(problem) {
        ansMap.digits = [];
        var ans;
        var n1 = problem[0];
        var n2 = problem[1];
        var i,j;
        var diff;
        var result;
        var pos = [];
        var color = [];
        var color2 = [];
        var ind = [];
        var dist;
        var len;
        switch (problem[2]) {
            case 0 : {
                ans = parseInt(n1)+parseInt(n2);
                break;
            }
            case 1 : {
                if (parseInt(n1) < parseInt(n2)) {
                    var temp = [];
                    temp.push(n1);
                    n1 = n2;
                    n2 = temp.pop();
                }
          //      console.log(n1 + ' ' + n2);

                ans = parseInt(n1)-parseInt(n2);
                break;
            }
            case 2 : {
                ans = parseInt(n1)*parseInt(n2);
                break;
            }
            case 3 : {
                ans = parseInt(n1)/parseInt(n2);
                break;
            }
        }
        ans = ans+"";
        diff = Math.max(n1.length,n2.length)-ans.length;
        if (!ansMap.setup) {
            ansMap.LR[0] = 5.5-diff-ans.length;
            ansMap.LR[1] = 5.5-diff;
            for (var i = 0; i < ans.length;i++) {
                ansMap.digits.push(new Answer(-5+diff+i))
            }
            ansMap.setup = true;
        }
        ansMap.digits.map(function(element) {
            result = getDigitAttributes(element.value,element.x,0)
            dist = Math.floor(pos.length / 3.0);
            console.log(result.length);
            len = Math.floor(result[0].length/3.0);
            result[0].map(x => pos.push(x));
            for (j=0; j < len; j++)
                result[1].map(x=>color.push(x));
            for (j=0; j < len; j++)
                result[2].map(x=>color2.push(x));
            result[3].map(x => ind.push(x + dist));
        });
        len = Math.floor(pos.length/3.0);
        pos.push(
            -ansMap.LR[0],.05,-1, -ansMap.LR[1],.05,-1,
            -ansMap.LR[0],.05,1, -ansMap.LR[1],.05,1,

            -ansMap.LR[0]+1,.0,-1.1, -ansMap.LR[1]-1,.0,-1.1,
            -ansMap.LR[0]+1,.0,1.1, -ansMap.LR[1]-1,.0,1.1,

        )
        color.push(
            .1,.1,.1,
            .1,.1,.1,
            .1,.1,.1,
            .1,.1,.1,
            .1,.1,.1,
            .1,.1,.1,
            .1,.1,.1,
            .1,.1,.1,
        )
        color2.push(
            .1,.1,.1,
            .1,.1,.1,
            .1,.1,.1,
            .1,.1,.1,
            .1,.1,.1,
            .1,.1,.1,
            .1,.1,.1,
            .1,.1,.1,
        )
        ind.push(
            len,len+1,len+2,
            len+1,len+2,len+3,

            len,len+1,len+4,
            len+1,len+4,len+5,
            len+2,len+3,len+6,
            len+3,len+6,len+7,

            len,len+2,len+4,
            len+2,len+4,len+6,

            len+1,len+3,len+5,
            len+3,len+5,len+7,

        )
        return [pos,color,color2,ind];
    }
    var createProblem = function(problem) {
        ansMap.setup = false;
        switch (problem[2]) {
            case 1 : {
                if (parseInt(problem[0]) < parseInt(problem[1])) {
                    var temp = [];
                    temp.push(problem[0]);
                    problem[0] = problem[1];
                    problem[1] = temp.pop();
                }
                break;
            }
            }
        var n1 = problem[0];
        var n2 = problem[1];
        var op = problem[2];
        var result;
        var pos = [];
        var ind = [];
        var color = [];
        var color2 = [];
        var dist;
        var diff = Math.abs(n1.length-n2.length);
        var d1 = 0;
        var d2 = 0;
        var i;
        var j;
        var len;
        if (n1.length > n2.length) {
            d2 = diff;
        } else {
            d1 = diff;
        }
        for (i = 0; i < n1.length; i++) {
            result = getDigitAttributes(parseInt(n1.charAt(i)), d1+i, 0);
            dist = Math.floor(pos.length / 3.0);
            len = Math.floor(result[0].length/3.0);
            result[0].map(x => pos.push(x));
            for (j=0; j < len; j++)
                result[1].map(x=>color.push(x));
            for (j=0; j < len; j++)
                result[2].map(x=>color2.push(x));
            result[3].map(x => ind.push(x + dist));
        }
        result = getDigitAttributes(op+10, -1, 1.5);
        dist = Math.floor(pos.length / 3.0);
        result[0].map(x => pos.push(x));
        len = Math.floor(result[0].length/3.0);
        for (j=0; j < len; j++)
            result[1].map(x=>color.push(x));
        for (j=0; j < len; j++)
            result[2].map(x=>color2.push(x));
        result[3].map(x=>ind.push(x+dist));
        for (i = 0; i < n2.length; i++) {
            result = getDigitAttributes(parseInt(n2.charAt(i)), d2+i, 1.5);
            dist = Math.floor(pos.length / 3.0);
            result[0].map(x => pos.push(x));
            len = Math.floor(result[0].length/3.0);
            for (j=0; j < len; j++)
                result[1].map(x=>color.push(x));
            for (j=0; j < len; j++)
                result[2].map(x=>color2.push(x));
            result[3].map(x=>ind.push(x+dist));
        }
        return [pos,color,color2,ind];
    }
    var getDigitAttributes = function(digit,xOff,yOff) {
        var res;
        var pos;
        var ind;
        var color = [1.0,0.0,0.0];
        var color2 = [.45,.45,.45];
        switch (digit) {
            case 0 : {
                pos = [
                    -.25+xOff,0.1,.49+yOff, -.1+xOff,0.1,.35+yOff,
                    .25+xOff,0.1,.49+yOff,  .1+xOff,0.1,.35+yOff,
                    .49+xOff,0.1,.3+yOff,  .2+xOff,0.1,.25+yOff,
                    .49+xOff,0.1,-.3+yOff, .2+xOff,0.1,-.25+yOff,
                    .25+xOff,0.1,-.49+yOff, .1+xOff,0.1,-.35+yOff,
                    //10
                    -.25+xOff,0.1,-.49+yOff, -.1+xOff,0.1,-.35+yOff,
                    -.49+xOff,0.1,-.3+yOff, -.2+xOff,0.1,-.25+yOff,
                    -.49+xOff,0.1,.3+yOff, -.2+xOff,0.1,.25+yOff,

                    -.25+xOff,-0.1,.49+yOff, -.1+xOff,-0.1,.35+yOff,
                    .25+xOff,-0.1,.49+yOff,  .1+xOff,-0.1,.35+yOff,
                    .49+xOff,-0.1,.3+yOff,  .2+xOff,-0.1,.25+yOff,
                    .49+xOff,-0.1,-.3+yOff, .2+xOff,-0.1,-.25+yOff,
                    .25+xOff,-0.1,-.49+yOff, .1+xOff,-0.1,-.35+yOff,
                    //10
                    -.25+xOff,-0.1,-.49+yOff, -.1+xOff,-0.1,-.35+yOff,
                    -.49+xOff,-0.1,-.3+yOff, -.2+xOff,-0.1,-.25+yOff,
                    -.49+xOff,-0.1,.3+yOff, -.2+xOff,-0.1,.25+yOff,
                ];
                ind = [
                    0,1,2, 1,2,3,
                    2,3,4, 3,4,5,
                    4,5,6, 5,6,7,
                    6,7,8, 7,8,9,
                    8,9,10, 9,10,11,
                    10,11,12, 11,12,13,
                    12,13,14, 13,14,15,
                    14,15,0, 15,0,1,

                    5,7,21, 7,21,23,
                    7,9,23, 9,23,25,
                    9,11,25, 11,25,27,
                    11,13,27, 13,27,29,
                    13,15,29, 15,29,31,
                    4,6,20, 6,20,22,
                    6,8,22, 8,22,24,
                    8,10,24, 10,24,26,
                    10,12,26, 12,26,28,
                    12,14,28, 14,28,30,
                    14,0,30, 0,30,16,
                    0,2,16, 2,16,18,
                    2,4,18, 4,18,20,
                ];
                color = [1.0,1.0,0];
                return [pos,color,color2,ind]
            }
            case 1 : {
                pos = [
                    -0.35+xOff,0.1,-.35+yOff,    -.15+xOff,0.1,-0.49+yOff,
                    -.35+xOff,0.1,-.25+yOff,   -.15+xOff,0.1,-0.3+yOff,
                    .15+xOff,0.1,-0.49+yOff,    -.15+xOff,0.1,.25+yOff,
                    .15+xOff,0.1,.25+yOff,   -.49+xOff,0.1,.25+yOff,
                    .49+xOff,0.1,.25+yOff,    -.49+xOff,0.1,.49+yOff,
                    .49+xOff,0.1,.49+yOff,

                    -0.35+xOff,-0.1,-.35+yOff,    -.15+xOff,-0.1,-0.49+yOff,
                    -0.35+xOff,-0.1,-.2+yOff,   -.15+xOff,-0.1,-0.3+yOff,
                    .15+xOff,-0.1,-0.49+yOff,    -.15+xOff,-0.1,.25+yOff,
                    .15+xOff,-0.1,.25+yOff,   -.49+xOff,-0.1,.25+yOff,
                    .49+xOff,-0.1,.25+yOff,    -.49+xOff,-0.1,.49+yOff,
                    .49+xOff,-0.1,.49+yOff,
                ];
                ind = [
                    0,1,2,  1,2,3,
                    1,4,5,  4,5,6,
                    7,8,9,  8,9,10,

                    0,2,11, 2,11,13,
                    2,3,13, 3,13,14,
                    3,5,14, 5,14,16,
                    7,9,18, 9,18,20,
                    9,10,20, 10,20,21,
                    8,10,19, 10,19,21,
                    4,6,15, 6,15,17,
                ];
                color = [.5,1,0];
                return [pos,color,color2,ind];
            }
            case 2 : {
                pos = [
                    -.35+xOff,.1,-0.25+yOff,    -0.35+xOff,.1,-0.15+yOff,
                    -0.1+xOff,.1,-0.4+yOff,     -.2+xOff,.1,-.2+yOff,
                    .3+xOff,.1,-.4+yOff,        .1+xOff,.1,-.3+yOff,
                    .49+xOff,.1,-.2+yOff,       .25+xOff,.1,-.2+yOff,
                    .4+xOff,.1,.05+yOff,       .2+xOff,.1,yOff,
                    xOff,.1,.3+yOff,         -.3+xOff,.1,.3+yOff,
                    .4+xOff,.1,.3+yOff,        .4+xOff,.1,.49+yOff,
                    -.3+xOff,.1,.49+yOff,

                    -.35+xOff,-0.1,-0.25+yOff,    -0.35+xOff,-0.1,-0.15+yOff,
                    -0.1+xOff,-0.1,-0.4+yOff,     -.2+xOff,-0.1,-.2+yOff,
                    .3+xOff,-0.1,-.4+yOff,        .1+xOff,-0.1,-.3+yOff,
                    .49+xOff,-0.1,-.2+yOff,       .25+xOff,-0.1,-.2+yOff,
                    .4+xOff,-0.1,.05+yOff,       .2+xOff,-0.1,yOff,
                    xOff,-0.1,.3+yOff,         -.3+xOff,-0.1,.3+yOff,
                    .4+xOff,-0.1,.3+yOff,        .4+xOff,-0.1,.49+yOff,
                    -.3+xOff,-0.1,.49+yOff,
                ];
                ind = [
                    0,1,2, 1,2,3,
                    2,3,4, 3,4,5,
                    4,5,6, 5,6,7,
                    6,7,8, 7,8,9,
                    8,9,10, 9,10,11,
                    11,12,14, 12,13,14,

                    0,1,15, 1,15,16,
                    1,3,16, 3,16,18,
                    3,5,18, 5,18,20,
                    5,7,20, 7,20,22,
                    7,9,22, 9,22,24,
                    9,11,24, 11,24,26,
                    11,14,26, 14,26,29,
                    14,13,29, 13,28,29,
                    12,13,27, 13,27,28,
                    8,10,23, 10,23,25,
                    6,8,21, 8,21,23,

                ];
                color = [0,1,0];
                return [pos,color,color2,ind];
            }
            case 3 : {
                pos = [
                    -.49+xOff,.1,.2+yOff,   -.49+xOff,0.1,.35+yOff,
                    -.3+xOff,0.1,.49+yOff,    .3+xOff,0.1,.49+yOff,
                    .49+xOff,0.1,.35+yOff,    .49+xOff,0.1,.1+yOff,
                    .4+xOff,0.1,0+yOff,       .49+xOff,0.1,-.1+yOff,
                    .49+xOff,0.1,-.35+yOff,   .3+xOff,0.1,-.49+yOff,
                    -.3+xOff,0.1,-.49+yOff,   -.49+xOff,.1,-.3+yOff,
                    -.49+xOff,0.1,-.2+yOff,
                    //Inner loop
                    -.2+xOff,0.1,-.2+yOff,
                    -.2+xOff,0.1,-.3+yOff,   .3+xOff,0.1,-.3+yOff,
                    .3+xOff,0.1,-.1+yOff,    -.1+xOff,0.1,-.1+yOff,
                    -.1+xOff,0.1,.1+yOff,         .3+xOff,0.1,.1+yOff,
                    .3+xOff,0.1,.3+yOff,         -.2+xOff,0.1,.3+yOff,
                    -.2+xOff,0.1,.2+yOff,

                    -.49+xOff,-0.1,.2+yOff,   -.49+xOff,-0.1,.35+yOff,
                    -.3+xOff,-0.1,.49+yOff,    .3+xOff,-0.1,.49+yOff,
                    .49+xOff,-0.1,.35+yOff,    .49+xOff,-0.1,.1+yOff,
                    .4+xOff,-0.1,0+yOff,       .49+xOff,-0.1,-.1+yOff,
                    .49+xOff,-0.1,-.35+yOff,   .3+xOff,-0.1,-.49+yOff,
                    -.3+xOff,-0.1,-.49+yOff,   -.49+xOff,.1,-.3+yOff,
                    -.49+xOff,-0.1,-.2+yOff,
                    //Inner loop
                    -.2+xOff,-0.1,-.2+yOff,
                    -.2+xOff,-0.1,-.3+yOff,   .3+xOff,-0.1,-.3+yOff,
                    .3+xOff,-0.1,-.1+yOff,    -.1+xOff,-0.1,-.1+yOff,
                    -.1+xOff,-0.1,.1+yOff,         .3+xOff,-0.1,.1+yOff,
                    .3+xOff,-0.1,.3+yOff,         -.2+xOff,-0.1,.3+yOff,
                    -.2+xOff,-0.1,.2+yOff,
                ];
                ind = [
                    0,21,22,   0,1,21,
                    1,2,21,    2,3,21,
                    3,20,21,   3,4,20,
                    4,5,20,    5,19,20,
                    5,19,16,   7,16,19,
                    16,17,18,  16,18,19,
                    7,8,16,    8,15,16,
                    8,9,15,    9,10,14,
                    9,14,15,   10,11,14,
                    11,12,13, 11,13,14,

                    0,1,23,    1,23,24,
                    1,2,24,    2,24,25,
                    2,3,25,    3,25,26,
                    3,4,26,    4,26,27,
                    4,5,27,    4,27,28,
                    5,6,28,    6,28,29,
                    6,7,29,    7,29,30,
                    7,8,30,    8,30,31,
                    8,9,31,    9,31,32,
                    9,10,32,   10,32,33,
                    10,11,33,  11,33,34,
                    11,12,34,  12,34,35,
                    12,13,35,  13,35,36,
                    13,14,36,  14,36,37,
                    14,15,37,  15,37,38,
                    15,16,38,  16,38,39,
                    16,17,39,  17,39,40,
                    17,18,40,  18,40,41,
                    18,19,41,  19,41,42,
                    19,20,42,  20,42,43,
                    20,21,43,  21,43,44,
                    0,22,23,   22,23,45,


                ];
                color = [0,1,.5];
                return [pos,color,color2,ind];
            }
            case 4 : {
                pos = [
                    xOff,0.1,.49+yOff, -.49+xOff,0.1,.2+yOff,
                    -.49+xOff,0.1,.05+yOff, xOff,0.1,-.49+yOff,
                    .2+xOff,0.1,-.49+yOff, .35+xOff,0.1,.05+yOff,
                    .35+xOff,0.1,.2+yOff, .2+xOff,0.1,.49+yOff,

                    xOff,-0.1,.49+yOff, -.49+xOff,-0.1,.2+yOff,
                    -.49+xOff,-0.1,yOff,  xOff,-0.1,-.49+yOff,
                    .2+xOff,-0.1,-.49+yOff, .35+xOff,-0.1,yOff,
                    .35+xOff,-0.1,.2+yOff, .2+xOff,-0.1,.49+yOff,
                ];
                ind = [
                    0,3,4,    0,4,7,
                    1,2,3,    1,3,4,
                    1,2,5,    1,5,6,

                    0,7,8,    7,8,15,
                    4,7,12,   7,12,15,
                    3,4,11,    4,11,12,
                    2,3,10,    3,10,11,
                    1,2,9,     2,9,10,
                    1,6,9,     6,9,14,
                    0,3,8,     3,8,11,
                ];
                color = [0,0,1];
                return [pos,color,color2,ind];
            }
            case 5 : {
                pos = [
                    .49+xOff,0.1,-.49+yOff,     -.49+xOff,0.1,-.49+yOff,
                    -.49+xOff,0.1,yOff,     .1+xOff,0.1,yOff,
                    .1+xOff,0.1,.3+yOff,     -.2+xOff,0.1,.3+yOff,
                    -.2+xOff,0.1,.1+yOff,     -.49+xOff,0.1,.1+yOff,
                    -0.49+xOff,0.1,.3+yOff,     -.2+xOff,0.1,.49+yOff,
                    .2+xOff,0.1,.49+yOff,     .49+xOff,0.1,.3+yOff,
                    .49+xOff,0.1,-.1+yOff,     .3+xOff,0.1,-.2+yOff,
                    -.2+xOff,0.1,-.2+yOff,     -.2+xOff,0.1,-.3+yOff,
                    .49+xOff,0.1,-.3+yOff,

                ];
                ind = [
                    0,1,16,    1,15,16,
                    1,2,15,    2,14,15,
                    2,14,13,   2,14,3,
                    3,13,14,   3,12,13,
                    3,12,11,   3,4,11,
                    4,10,11,   4,5,9,
                    4,9,10,    5,8,9,
                    5,6,7,     5,7,8,
                ];
                color = [1.0,0,.75]
                return [pos,color,color2,ind];
            }
            case 6 : {
                pos = [
                    .49+xOff,0.1,-.49+yOff, -.25+xOff,0.1,-.49+yOff,
                    -.49+xOff,0.1,-.35+yOff, -.49+xOff,0.1,.35+yOff,
                    -.25+xOff,0.1,.49+yOff, .25+xOff,0.1,.49+yOff,
                    .49+xOff,0.1,.35+yOff, 0.49+xOff,0.1,yOff,
                    .25+xOff,0.1,-0.15+yOff, -.35+xOff,0.1,-0.15+yOff,
                    -.25+xOff,0.1,-.3+yOff, -.3+xOff,0.1,-.3+yOff,
                    .49+xOff,0.1,-.3+yOff,

                    -.35+xOff,0.1,yOff, 0+xOff,0.1,0+yOff,
                    0+xOff,0.1,0+yOff, 0+xOff,0.1,0+yOff,

                ];
                ind = [
                    0,1,11,    0,11,12,
                    1,2,10,    1,10,11,
                    2,3,4,     2,10,4,
                    3,4,6,     4,5,6,
                    5,6,7,     5,7,8,
                    7,9,13,    7,8,9,

                ];
                color = [.5,1.0,.5];
                return [pos,color,color2,ind];
            }
            case 7 : {
                pos = [
                    0.49+xOff,0.1,-.49+yOff, -.49+xOff,0.1,-.49+yOff,
                    -0.49+xOff,0.1,-0.3+yOff, 0.15+xOff,0.1,-0.3+yOff,
                    -0.2+xOff,0.1,.49+yOff, .15+xOff,0.1,.49+yOff,
                ];
                ind = [
                    0,1,2,  0,2,3,
                    0,3,4, 0,4,5,
                ];
                color = [1,0,.25];
                return [pos,color,color2,ind];
            }
            case 8 : {
                pos = [
                    -0.25+xOff,0.1,-0.49+yOff, -0.49+xOff,0.1,-0.35+yOff,
                    -0.49+xOff,0.1,-0.1+yOff, -0.25+xOff,0.1,0+yOff,
                    -0.49+xOff,0.1,0.1+yOff, -0.49+xOff,0.1,0.35+yOff,
                    -0.25+xOff,0.1,.49+yOff, 0.25+xOff,0.1,.49+yOff,
                    0.49+xOff,0.1,0.35+yOff, 0.49+xOff,0.1,0.1+yOff,
                    0.25+xOff,0.1,0+yOff, 0.49+xOff,0.1,-0.1+yOff,
                    0.49+xOff,0.1,-0.35+yOff, 0.25+xOff,0.1,-0.49+yOff,
                ];
                ind = [
                    0,1,3,     1,2,3,
                    3,4,6,     4,5,6,
                    5,8,6,     6,7,8,
                    7,9,10,    7,8,9,
                    3,4,9,     3,9,10,
                    2,3,11,    3,10,11,
                    10,11,13,  11,12,13,
                    0,1,13,    1,12,13,

                ];
                color = [.75,.25,0,];
                return [pos,color,color2,ind];
            }
            case 9 : {
                pos = [
                    -.49+xOff,0.1,.49+yOff, .25+xOff,0.1,.49+yOff,
                    .49+xOff,0.1,.35+yOff, .49+xOff,0.1,-.35+yOff,
                    .25+xOff,0.1,-.49+yOff, -.25+xOff,0.1,-.49+yOff,
                    -.49+xOff,0.1,-.35+yOff, -0.49+xOff,0.1,yOff,
                    -.25+xOff,0.1,0.15+yOff, .35+xOff,0.1,0.15+yOff,
                    .25+xOff,0.1,.3+yOff, .3+xOff,0.1,.3+yOff,
                    -.49+xOff,0.1,.3+yOff,

                    .35+xOff,0.1,yOff, 0+xOff,0.1,0+yOff,
                    0+xOff,0.1,0+yOff, 0+xOff,0.1,0+yOff,

                ];
                ind = [
                    0,1,11,    0,11,12,
                    1,2,10,    1,10,11,
                    2,3,4,     2,10,4,
                    3,4,6,     4,5,6,
                    5,6,7,     5,7,8,
                    7,9,13,    7,8,9,
                ];
                color = [.5,.5,0];
                return [pos,color,color2,ind];
            }
            case 10 : {
                pos = [
                    -.1+xOff,0.1,.35+yOff, .1+xOff,0.1,.35+yOff,
                    -.1+xOff,0.1,-.35+yOff, .1+xOff,0.1,-.35+yOff,
                    -.35+xOff,0.1,.1+yOff, .35+xOff,0.1,.1+yOff,
                    -.35+xOff,0.1,-.1+yOff, .35+xOff,0.1,-.1+yOff,

                ];
                ind = [
                    0,1,2,    1,2,3,
                    4,5,6,    5,6,7,
                ];
                color = [1.0,1.0,1.0];
                return [pos,color,color2,ind];
            }
            case 11 : {
                pos = [
                    -.35+xOff,0.1,.1+yOff, .35+xOff,0.1,.1+yOff,
                    -.35+xOff,0.1,-.1+yOff, .35+xOff,0.1,-.1+yOff,

                ];
                ind = [
                    0,1,2,    1,2,3,
                ];
                color = [0.4,1.0,1.0];
                return [pos,color,color2,ind];
            }
            case 12 : {
                var c = Math.cos(Math.PI/4.0);
                var lC = .1*c;
                var hC = .35*c;
                pos = [
                    -lC-hC+xOff,0.1,-lC+hC+yOff,
                    lC-hC+xOff,0.1,lC+hC+yOff,
                    -lC+hC+xOff,0.1,-lC-hC+yOff,
                    lC+hC+xOff,0.1,lC-hC+yOff,

                    -lC-hC+xOff,0.1,lC-hC+yOff,
                    lC-hC+xOff,0.1,-lC-hC+yOff,
                    -lC+hC+xOff,0.1,lC+hC+yOff,
                    lC+hC+xOff,0.1,-lC+hC+yOff,

                ];
                ind = [
                    0,1,2,    1,2,3,
                    4,5,6,  5,6,7,
                ];
                color = [1.0,1.0,1.0];
                return [pos,color,color2,ind];
            }
            case 13 : {
                pos = [
                    -.35+xOff,0.1,.1+yOff, .35+xOff,0.1,.1+yOff,
                    -.35+xOff,0.1,-.1+yOff, .35+xOff,0.1,-.1+yOff,

                    -.1+xOff,0.1,.25+yOff, .1+xOff,0.1,.25+yOff,
                    -.1+xOff,0.1,.15+yOff, .1+xOff,0.1,.15+yOff,

                    -.1+xOff,0.1,-.25+yOff, .1+xOff,0.1,-.25+yOff,
                    -.1+xOff,0.1,-.15+yOff, .1+xOff,0.1,-.15+yOff,


                ];
                ind = [
                    0,1,2,    1,2,3,
                    4,5,6,    5,6,7,
                    8,9,10,   9,10,11,
                ];
                color = [.25,.25,.25];
                return [pos,color,color2,ind];
            }
            default : {
                res = [];
                break;
            }
                return res;
        }

    }
})();