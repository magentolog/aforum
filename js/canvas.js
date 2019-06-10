function initCanvas(canvas) {
    // object iterator
    canvas.forEachObject = function (className, callbackfn) {
        for (var i = 0, n = canvas.size(); i < n; i++) {
            var item = canvas.item(i);
            if (item.get(CLASS) == className) {
                callbackfn(item);
            }
        }
    }
    //\\
    canvas.blockAll = function () {
        for (var i = 0, n = canvas.size(); i < n; i++) {
            var item = canvas.item(i);
            item.hasControls = false;
            item.lockMovementX = true;
            item.lockMovementY = true;
            item.selectable = false;
            if (item.get(CLASS) === CLASS_ROOM) {
                // item.selectable = false;
            }
        }
    }
    //\\
    canvas.unblockAll = function () {
        for (var i = 0, n = canvas.size(); i < n; i++) {
            var item = canvas.item(i);
            item.hasControls = true;
            item.lockMovementX = false;
            item.lockMovementY = false;
            item.selectable = true;
            if (item.get(CLASS) === CLASS_ROOM) {
                // item.selectable = true;
            }
        }
    }

    canvas.clearTables = function () {
        canvas.forEachObject(CLASS_TABLE, function (table) {
            table.setText('');
            table.setColor(tableTemplate.fill);
        });
        canvas.renderAll();
    }

    canvas.exportPlan = function () {
        const zoom = canvas.getZoom();
        var newPlan = {
            width: Math.round(canvas.getWidth()),
            height: Math.round(canvas.getHeight()),
            rooms: [],
            tables: [],
            rnames: [],
            rids: []
        };

        canvas.forEachObject(CLASS_ROOM, function (obj) {
            newPlan.rooms.push(getFabricObjData(obj, 0, 0, zoom));
        });

        canvas.forEachObject(CLASS_TABLE, function (obj) {
            newPlan.tables.push(getFabricObjData(obj, 0, 0, zoom));
        });

        canvas.forEachObject(CLASS_ROOM_NAME, function (obj) {
            newPlan.rnames.push(getFabricObjData(obj, 0, 0, zoom));
        });

        canvas.forEachObject(CLASS_ROOM_ID, function (obj) {
            newPlan.rids.push(getFabricObjData(obj, 0, 0, zoom));
        });

        return newPlan;
    }
}

function getFabricObjData(fabricObj, dx = 0, dy = 0, zoom = 1) {
    var result =
    {
        left: Math.round(fabricObj.left * zoom),
        top: Math.round(fabricObj.top * zoom),
        width: Math.round(fabricObj.width * fabricObj.scaleX * zoom),
        height: Math.round(fabricObj.height * fabricObj.scaleY * zoom),
    }
    if (fabricObj.hasOwnProperty('id')) {
        result.id = fabricObj.id;
    }
    if ([CLASS_ROOM_ID, CLASS_ROOM_NAME].indexOf(fabricObj.get(CLASS)) >= 0) {
        result.text = fabricObj.text;
        delete result.width;
        delete result.height;
    }
    if (typeof dx === "number") {
        result.left += dx;
    }
    if (typeof dy === "number") {
        result.top += dy;
    }
    return result;
}

function tableDecorator(table) {
    return {
        setText: function (text) {
            table.item(1).set('text', text);
        },
        setColor: function (color) {
            table.item(0).set("fill", color);
        }
    }
}