const CLASS_BALL = 'myBall';
const MAX_SEC_DELAY_FOR_MAX_SPEED = 3;

const lockedObj = {
    hasBorders: false,
    hasControls: false,
    hasRotatingPoint: false
    //  selectable: false
};


function BallFactory(ballRadius = 15) {
    const _this = this;
    let lastColorNum = 0;
    const colors = ['red', 'green', 'blue', 'yellow', 'brown', 'orange', 'black'];

    function getNextColor() {
        lastColorNum = (lastColorNum + 1) % colors.length;
        return colors[lastColorNum];
    }

    this.createBall = function (left, top, color = null) {
        if (!color) {
            color = getNextColor()
        }
        let options = {
            originX: 'center',
            originY: 'center',
            radius: ballRadius,
            fill: color,
            left: left + ballRadius,
            top: top + ballRadius,
        }
        const ball = new fabric.Circle(Object.assign({}, options, lockedObj));
        ball.set(CLASS, CLASS_BALL);
        return ball;
    };

    this.getRadius = function () {
        return ballRadius;
    };
}


function MovingObject(obj, width, height) {
    const _this = this;
    const maxSpeed = 600; // 500 px/sec
    const friction = 100;
    let restx = 0;
    let resty = 0;
    let x = obj.left;
    let y = obj.top;
    this.vx = 0;
    this.vy = 0;


    this.setSpeed = function (avx, avy) {
        _this.vx = (typeof avx === "undefined") ? rnd(-maxSpeed, maxSpeed) : avx;
        _this.vy = (typeof avy === "undefined") ? rnd(-maxSpeed, maxSpeed) : avy;
    }

    function rnd(min, max) {
        return min + Math.round(Math.random() * (max - min));
    }

    this.getObj = function () {
        return obj;
    };

    this.shot = function (targetX, targetY, speedRatio = 1) {
        let dx = targetX - x;
        let dy = targetY - y;
        let dv = Math.sqrt(dx * dx + dy * dy);
        if (dv == 0) return;
        _this.vx = dx / dv * speedRatio * maxSpeed;
        _this.vy = dy / dv * speedRatio * maxSpeed;
    };

    this.run = function (dt) {
        // fix dt
        if (dt <= 0) return true;
        dt = dt / 1000;
        let v = Math.sqrt(_this.vx * _this.vx + _this.vy * _this.vy);
        let vnew = Math.max(v - friction * dt / 2, 0);
        let mv = (v > 0) ? vnew / v : 0;

        let dx = (_this.vx + (_this.vx *= mv)) / 2 * dt + restx;
        let dy = (_this.vy + (_this.vy *= mv)) / 2 * dt + resty;

        const result = (_this.vx != 0) || (_this.vy != 0);

        var intDx = Math.round(dx);
        restx = dx - intDx;
        x += intDx;
        if (x > width) {
            x = 2 * width - x;
            restx = -restx;
            _this.vx = -_this.vx;
        } else if (x < 0) {
            x = -x;
            restx = -restx;
            _this.vx = -_this.vx;
        }

        var intDy = Math.round(dy);
        resty = dy - intDy;
        y += intDy;
        if (y > height) {
            y = 2 * height - y;
            resty = -resty;
            _this.vy = -_this.vy;
        } else if (y < 0) {
            y = -y;
            resty = -resty;
            _this.vy = -_this.vy;
        }
        obj.left = x;
        obj.top = y;

        return result;
    };
}

function BilliardTable(canvas, frameSize = 100) {
    const _this = this;
    const timeInterval = 50; // 100ms
    const BALL_RADIUS = 15;
    let lastTimeStamp = 0;
    let mouseDownTimeStamp = 0;
    let movingObjects = [];
    let intervalTimerId = null;
    let whiteBallPos = null;
    let baseBallPos = null;
    let whiteBall = null;
    let exitButton = null;
    const zoom = canvas.getZoom();
    const width = Math.round(canvas.getWidth() / zoom);
    const height = Math.round(canvas.getHeight() / zoom);
    const ballFactory = new BallFactory(BALL_RADIUS);

    this.init = function () {
        foreachCanvasObj(function (obj) {
            obj.visible = false;
        });
        calcBallsPos(width, height);
        createBalls();
        lastTimeStamp = Date.now();
        exitButton = createExitButton();
        intervalTimerId = setTimeout(run, timeInterval);
        setEvents(true);
    }

    function foreachCanvasObj(callbackfn) {
        for (var i = 0, n = canvas.size(); i < n; i++) {
            var item = canvas.item(i);
            if (typeof (callbackfn === 'function')) {
                callbackfn(item);
            }
        }
    }

    function shot(x, y, t) {
        console.log(t);
        let ratio = t / 1000 / MAX_SEC_DELAY_FOR_MAX_SPEED
        whiteBall.shot(x, y, ratio);
        lastTimeStamp = 0;
        run();
    }


    function setEvents(b) {
        if (b) {
            canvas.on('mouse:down', function (options) {
                if (!options.target) {
                    mouseDownTimeStamp = Date.now();
                }
            });
            canvas.on('mouse:up', function (options) {
                if (!options.target) {
                    let t = Date.now() - mouseDownTimeStamp;
                    shot(options.absolutePointer.x, options.absolutePointer.y, t);

                } else if (options.target == exitButton) {
                    restoreAll();
                }
            });
        } else {
            canvas.off('mouse:up');
        }
    }

    function calcBallsPos(deskWidth, deskHeight) {
        let a = Math.max(deskWidth, deskHeight);
        let b = Math.min(deskWidth, deskHeight);
        let bbPos = Math.round(a / 4);
        let wbPos = Math.round(3 * a / 4);
        let b2 = Math.round(b / 2);
        whiteBallPos = {
            x: (deskWidth > deskHeight) ? wbPos : b2,
            y: (deskWidth > deskHeight) ? b2 : wbPos
        };
        baseBallPos = {
            x: (deskWidth > deskHeight) ? bbPos : b2,
            y: (deskWidth > deskHeight) ? b2 : bbPos
        };

    }

    function createBalls() {
        movingObjects = [];
        let ball = ballFactory.createBall(whiteBallPos.x, whiteBallPos.y, 'lightgrey');
        canvas.add(ball);
        whiteBall = new MovingObject(ball, width - BALL_RADIUS, height - BALL_RADIUS);
        movingObjects.push(whiteBall);

        ball = ballFactory.createBall(baseBallPos.x, baseBallPos.y);
        canvas.add(ball);
        const movingBall = new MovingObject(ball, width - BALL_RADIUS, height - BALL_RADIUS);
        movingObjects.push(movingBall);
    }

    function run() {
        const dt = getDt();
        let bThereIsMovingObj = false;
        movingObjects.forEach(obj => {
            bThereIsMovingObj = obj.run(dt) || bThereIsMovingObj;
        });
        canvas.renderAll();
        if (bThereIsMovingObj) {
            checkAll();
            intervalTimerId = setTimeout(run, timeInterval);
        } else {
            resetAll();
        }
    }

    function checkAll() {
        let r2 = 4 * BALL_RADIUS * BALL_RADIUS;
        for (let i = 0, n = movingObjects.length; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                interract(movingObjects[i], movingObjects[j], r2);
            }
        }
    }

    function interract(obj1, obj2, r2) {
        let o1 = obj1.getObj();
        let o2 = obj2.getObj();
        let x1 = o1.left;
        let y1 = o1.top;
        let x2 = o2.left;
        let y2 = o2.top;
        let dx = x2 - x1;
        let dy = y2 - y1;
        let s2 = dx * dx + dy * dy;
        if (s2 < r2) {
            let vx1 = obj1.vx;
            let vy1 = obj1.vy;
            let vx2 = obj2.vx;
            let vy2 = obj2.vy;
            let dvx = vx2 - vx1;
            let dvy = vy2 - vy1;
            let a = dvx * dvx + dvy * dvy;
            let b = -2 * dx * dvx - 2 * dy * dvy;
            let c = s2 - r2;
            let D = b * b - 4 * a * c;
            if (D < 0) {
                // no solution
                return;
            } else {
                let sqrtD = Math.sqrt(D);
                let t1 = (-b - sqrtD) / (2 * a);
                let t2 = (-b + sqrtD) / (2 * a);
                t = Math.max(t1, t2);
                strike = {
                    x1: x1 - vx1 * t,
                    y1: y1 - vy1 * t,
                    x2: x2 - vx2 * t,
                    y2: y2 - vy2 * t,
                    toString: function () {
                        return "(x1=" + x1 + ",y1=" + y1 + ")\n" + "(x2=" + x2 + ",y2=" + y2 + ")\n";
                    }
                };
                console.log("strike: \n " + strike);
            }
        }
    }


    function strike() {
        console.log('strike');

    }

    function getDt() {
        if (lastTimeStamp === 0) {
            lastTimeStamp = Date.now();
        }
        var timeStamp = Date.now();
        var dt = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
        return dt;
    }

    function resetAll() {
        console.log('reset');
    }

    function restoreAll() {
        movingObjects.forEach(obj => canvas.remove(obj.getObj()));
        foreachCanvasObj(function (obj) {
            obj.visible = true;
        });
        movingObjects = [];
        setEvents(false);
        canvas.remove(exitButton);
        exitButton = null;
        canvas.renderAll();
        //canvas.requestRenderAll()
    }

    function createExitButton() {
        const buttonWidth = 60;
        let options = {
            width: buttonWidth,
            height: 30,
            left: Math.round((width - buttonWidth) / 2),
            top: 3,
            strokeWidth: 1,
            stroke: 'rgba(0,0,0,0.5)'
        };
        const exitButton = new fabric.Rect(Object.assign({}, options, lockedObj));
        exitButton.setGradient('fill', {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: exitButton.height,
            colorStops: {
                0: "rgba(250,250,250,0.5)",
                1: "rgba(130,130,130,0.5)"
            }
        });
        canvas.add(exitButton);
        return exitButton;
    }

}


function EasterEgg() {
    const _this = this;
    const timeInterval = 100; // 100ms
    let lastTimeStamp = 0;
    let movingObjects = [];
    let canvas = null;
    let intervalTimerId = null;
    let timeoutTimerId = null;

    this.init = function (aCanvas) {
        resetAll();
        canvas = aCanvas;
        createMovingObjects();
        lastTimeStamp = Date.now();
        intervalTimerId = setTimeout(run, timeInterval);
    }


    function createMovingObjects() {
        const ballFactory = new BallFactory();
        movingObjects = [];
        var zoom = canvas.getZoom();
        var width = Math.round(canvas.getWidth() / zoom);
        var height = Math.round(canvas.getHeight() / zoom);

        /*        
                canvas.forEachObject(CLASS_TABLE, function (table) {
                    table.visible = false;
                    let ball = ballFactory.createBall(table.left, table.top);
                    canvas.add(ball);
                    const obj = new MovingObject(ball, width, height);
                    movingObjects.push(obj);
                });
        */
    }

    function run() {
        const dt = getDt();
        let bThereIsMovingObj = false;
        movingObjects.forEach(obj => {
            bThereIsMovingObj = obj.run(dt) || bThereIsMovingObj;
        });
        canvas.renderAll();
        if (bThereIsMovingObj) {
            intervalTimerId = setTimeout(run, timeInterval);
        } else {
            resetAll();
        }
    }

    function getDt() {
        if (lastTimeStamp === 0) {
            lastTimeStamp = Date.now();
        }
        var timeStamp = Date.now();
        var dt = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
        return dt;
    }

    function resetAll() {
        if (timeoutTimerId) {
            clearTimeout(timeoutTimerId);
            timeoutTimerId = null;
        }
        if (intervalTimerId) {
            clearInterval(intervalTimerId);
            restoreAll();
            intervalTimerId = null;
        }
    }

    function restoreAll() {
        movingObjects.forEach(obj => canvas.remove(obj.getObj()));
        /*
        canvas.forEachObject(CLASS_TABLE, function (table) {
            table.visible = true;
        });
        */
        movingObjects = [];
        canvas.renderAll();
    }

    function commonSectionCircle(x1, y1, x2, y2, xC, yC, R) {
        x1 -= xC;
        y1 -= yC;
        x2 -= xC;
        y2 -= yC;

        let dx = x2 - x1;
        let dy = y2 - y1;

        let a = dx * dx + dy * dy;
        let b = 2. * (x1 * dx + y1 * dy);
        let c = x1 * x1 + y1 * y1 - R * R;

        if (-b < 0)
            return (c < 0);
        if (-b < (2. * a))
            return ((4. * a * c - b * b) < 0);
        return (a + b + c < 0);
    }

    function intersects() {

    }

}