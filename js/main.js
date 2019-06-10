$(document).ready(function () {
    var canvas = new fabric.Canvas('canvas');
    initCanvas(canvas);
    var userService = new UserService();
    var tableService = new TableService(userService);
    var floorPlanService = new FloorPlanService();
    var floorPlanComponent = new FloorPlanComponent(canvas);
    var editor = new FloorEditor(canvas, floorPlanService, floorPlanComponent);
    var demo = new FloorPlanDemo(canvas, floorPlanService, floorPlanComponent, tableService);
    var modeSwitcher = new ModeSwitcher(demo, editor);
    //alertBeforeClose(true);
    runAllTests();
});

function alertBeforeClose(b) {
    if (b) {
        window.onbeforeunload = function (e) {
            const msg = 'Are you sure you want to close the page without saving?';
            e = e || window.event;
            if (e) {
                e.returnValue = msg;
            }
            return msg;
        };
    }
}

Array.prototype.groupBy = function (key) {
    return this.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

Date.prototype.toISODate = function () {
    var year = this.getFullYear();
    var month = this.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    var day = this.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    return `${year}-${month}-${day}`;
}

function rnd(max) {
    return Math.floor(Math.random() * max); // return random integer value 0..max
}

function timeStampToStr(timeStamp) {
    return $.datepicker.formatDate(DATE_FORMAT, new Date(timeStamp));
}

function runAllTests() {
    var smTest = new SmartMatrixSpec();
    smTest.runAllTests();
    var amTest = new AssessmentMatrixSpec();
    amTest.runAllTests();
}