function MovingObject(obj, width, height) {
    const maxSpeed = 500; // 500 px/sec
    const friction = 90; // 10 px/sec
    var _this = this;
    var saveprop = {
        left: obj.left,
        top: obj.top,
    }
    var restx = 0;
    var resty = 0;
    var x = obj.left;
    var y = obj.top;
    var vx = 0;
    var vy = 0;

    init();

    function rnd(min, max) {
        return min + Math.round(Math.random() * (max - min));
    }

    function init() {
        vx = rnd(-maxSpeed, maxSpeed);
        vy = rnd(-maxSpeed, maxSpeed);
    }

    this.run = function (dt) {
        // fix dt
        dt = dt / 1000;
        // x        
        var ax = friction * dt / 2;
        if (vx < 0) {
            ax = -ax;
        }
        // var dx = (vx -= ax) * dt + restx;
        var dx = (vx -= ax) * dt;
        var intDx = Math.round(dx);
        restx = dx - intDx;
        x += intDx;
        if (x > width) {
            x = 2 * width - x;
            restx = -restx;
            vx = -vx;
        } else if (x < 0) {
            x = -x;
            restx = -restx;
            vx = -vx;
        }

        // y 
        var ay = friction * dt / 2;
        if (vy < 0) {
            ay = -ay;
        }
        // var dy = (vy -= ay) * dt + resty;
        var dy = (vy -= ay) * dt;
        var intDy = Math.round(dy);
        resty = dy - intDy;
        y += intDy;
        if (y > height) {
            y = 2 * height - y;
            resty = -resty;
            vy = -vy;
        } else if (y < 0) {
            y = -y;
            resty = -resty;
            vy = -vy;
        }
        obj.left = x;
        obj.top = y;
    };
    this.restore = function () {
        obj.left = saveprop.left;
        obj.top = saveprop.top;
    };
}


function EasterEgg() {
    var _this = this;
    var timeInterval = 20; // 100ms
    var totalDuration = 15000; // 10s
    var lastTimeStamp = 0;
    var movingObjects = [];
    var canvas = null;
    var intervalTimerId = null;
    var timeoutTimerId = null;

    this.init = function (aCanvas) {
        resetAll();
        canvas = aCanvas;
        createMovingObjects();
        lastTimeStamp = Date.now();
        intervalTimerId = setInterval(run, timeInterval);
        timeoutTimerId = setTimeout(function () {
            resetAll();
        }, totalDuration);
    }

    function createMovingObjects() {
        movingObjects = [];
        var zoom = canvas.getZoom();
        var width = Math.round(canvas.getWidth() / zoom);
        var height = Math.round(canvas.getHeight() / zoom);
        canvas.forEachObject(CLASS_TABLE, function (table) {
            var obj = new MovingObject(table, width, height);
            movingObjects.push(obj);
        });
    }

    function run() {
        var dt = getDt();
        movingObjects.forEach(obj => obj.run(dt));
        canvas.renderAll();
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
        movingObjects.forEach(obj => obj.restore());
        canvas.renderAll();
    }

}