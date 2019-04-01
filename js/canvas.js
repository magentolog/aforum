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
            if (item.get(CLASS) === CLASS_ROOM) {
                item.selectable = false;
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
            if (item.get(CLASS) === CLASS_ROOM) {
                item.selectable = true;
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