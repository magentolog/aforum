function FloorEditor(canvas, floorPlan) {
    var _this = this;
    var floorPlanDto = {};

    init();
    function init() {
        var planId = getPlanId();
        setPlan(planId);
        initToolBar();
    }
    this.hide = function() {
        $('.edit').hide();        
        saveAll();
        canvas.blockAll();
    }

    this.show = function() {
        $('.edit').show();        
        canvas.unblockAll();
        canvas.clearTables();        
    }

    this.getPlanId = function() {
        return getPlanId();
    };

    function saveAll() {
        var plan = getFloorPlanObj(canvas.getZoom());
        var planId = getPlanId();
        floorPlan.save(plan, planId);
    };

    function initToolBar() {
        $("#btn-add-room").click(function () {
            var data = getLastObjData(CLASS_ROOM, INDENT_X, INDENT_Y);
            addRoom(data);
        });

        $("#btn-add-table").click(function () {
            var data = getLastObjData(CLASS_TABLE, INDENT_X, INDENT_Y);
            addTable(data);
        });

        $("#btn-add-room-name").click(function () {
            var text = ($("#ed-room-name").val()).trim();
            if (text) {
                var data = getLastObjData(CLASS_ROOM_NAME, INDENT_X, INDENT_Y);
                addRoomName(text, data);
            }
            $("#ed-room-name").val("");
        });

        $("#btn-add-room-id").click(function () {
            var text = ($("#ed-room-id").val()).trim();
            if (text) {
                var data = getLastObjData(CLASS_ROOM_ID, INDENT_X, INDENT_Y);
                addRoomId(text, data);
            }
            $("#ed-room-id").val("");
        });

        $("#btn-export-data").click(function () {
            var plan = getFloorPlanObj(canvas.getZoom());
            var planId = getPlanId();
            floorPlan.save(plan, planId);
            showData(plan);
        });

        $("#btn-import-data").click(function () {
            var text = $("#data").val();
            importData(text);
        });

        $(document).keydown(function (event) {
            if ((document.body === document.activeElement)
                && (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].indexOf(event.key) >= 0)) {
                moveSelectedObject(event.key);
                event.preventDefault();
                event.stopPropagation();
            }
        });

        canvas.on('mouse:wheel', function (opt) {
            var delta = opt.e.deltaY;
            var zoom = canvas.getZoom();
            zoom = zoom + delta / 2000;
            if (zoom > 2) zoom = 2;
            if (zoom < 0.2) zoom = 0.2;
            setZoom(zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });

        $("#cb-show-img").click(function () {
            if (this.checked) {
                $("#bg-img").show();
            } else {
                $("#bg-img").hide();
            }
        });

        $("#btn-delete").click(function () {
            var obj = canvas.getActiveObject();
            if (obj) {
                canvas.remove(obj);
                var n = canvas.size() - 1;
                if (n >= 0) {
                    canvas.setActiveObject(canvas.item(n));
                }
            }
        });

        $("input[name=location]").change(function () {
            var planId = getPlanId();
            if ($(this).val() == planId) {
                setPlan(planId);
            }
        });

        $("#btn-reset").click(function () {
            if (confirm("Are you sure, you want to reset the plan to default?")) {
                floorPlan.reset();
                var plan = floorPlan.load();
                setFloorPlan(plan);       
            }
        });
    }

    function getPlanId() {
        return $("input[name=location]:checked").val();
    }

    function setPlan(planId) {
        var plan = floorPlan.load(planId);
        setFloorPlan(plan);
        showData(plan);
        $("#bg-img").attr("src", floorPlanImgs[planId]);
    }


    function moveSelectedObject(key) {
        var obj = canvas.getActiveObject();
        if (obj) {
            switch (key) {
                case "ArrowLeft": obj.left = obj.left - 1;
                    break;
                case "ArrowRight": obj.left = obj.left + 1;
                    break;
                case "ArrowUp": obj.top = obj.top - 1;
                    break
                case "ArrowDown": obj.top = obj.top + 1;
                    break
            }
            canvas.requestRenderAll();
        }
    }

    function setZoom(zoom) {
        var width = Math.round(floorPlanDto.width * zoom);
        var height = Math.round(floorPlanDto.height * zoom);
        $("#bg-img").attr("width", width);
        $("#bg-img").attr("height", height);
        canvas.setWidth(width);
        canvas.setHeight(height);
        canvas.setZoom(zoom);
    }

    function setFloorPlan(aFloorPlan) {
        floorPlanDto = Object.assign({}, aFloorPlan);
        canvas.clear();
        setZoom(1);
        canvas.requestRenderAll();

        floorPlanDto.rooms.forEach(function (data) {
            addRoom(data);
        });

        floorPlanDto.tables.forEach(function (data) {
            addTable(data);
        });

        floorPlanDto.rnames.forEach(function (data) {
            addRoomName(data.text, data);
        });

        floorPlanDto.rids.forEach(function (data) {
            addRoomId(data.text, data);
        });

    }

    function showData(plan) {
        var text = floorPlanToString(plan);
        $("#data").val(text);
    }

    function importData(text) {
        var newPlan = JSON.parse(text);
        if (newPlan) {
            setFloorPlan(newPlan);
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

    function getFloorPlanObj(zoom = 1) {
        var newPlan = {
            height: Math.round(floorPlanDto.height * zoom),
            width: Math.round(floorPlanDto.width * zoom),
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

    function floorPlanToString(plan) {
        var result = '{\n';
        result += '"height":' + plan.height + ',\n';
        result += '"width":' + plan.width + ',\n';
        result += '"rooms":' + JSON.stringify(plan.rooms) + ',\n';
        result += '"rnames":' + JSON.stringify(plan.rnames) + ',\n';
        result += '"rids":' + JSON.stringify(plan.rids) + ',\n';
        result += '"tables":' + JSON.stringify(plan.tables) + '\n';
        result += '}\n';
        return result;
    }

    function getLastObjData(className, dx = 0, dy = 0) {
        var data = { top: 100, left: 100 };
        var obj = canvas.getActiveObject();
        if (obj && (obj.get(CLASS) === className)) {
            data = getFabricObjData(obj, dx, dy);
        }
        return data;
    }

    function addRoom(data) {
        var template = Object.assign({}, roomTemplate, data);
        var rect = new fabric.Rect(template);
        canvas.add(rect);
        canvas.setActiveObject(rect);
        rect.set(CLASS, CLASS_ROOM);
        return rect;
    }

    function addTable(data) {
        if (!data.hasOwnProperty('width')) {
            data.width = tableTemplate.width;
        }
        if (!data.hasOwnProperty('height')) {
            data.height = tableTemplate.height;
        }
        var rectTemplate = Object.assign({}, tableTemplate, { width: data.width, height: data.height, originX: 'center', originY: 'center' });
        var rect = new fabric.Rect(rectTemplate);
        var textTemplate = Object.assign({}, tableTextTemplate, { angle: (data.width > data.height) ? 0 : -90 });
        var text = new fabric.Text('', textTemplate);
        var group = new fabric.Group([rect, text], data);
        group.set(CLASS, CLASS_TABLE);
        group.setText = function (text) {
            this.item(1).set('text', text);
        }
        group.setColor = function (color) {
            this.item(0).set("fill", color);
        }
        canvas.add(group);
        canvas.setActiveObject(group);
        return group;
    }

    function addRoomName(text, data) {
        data.text = text;
        var template = Object.assign({}, roomNameTemplate, data);
        var rect = new fabric.Textbox(text, template);
        canvas.add(rect);
        canvas.setActiveObject(rect);
        rect.set(CLASS, CLASS_ROOM_NAME);
        return rect;
    }

    function addRoomId(text, data) {
        data.text = text;
        var template = Object.assign({}, roomIdTemplate, data);
        var rect = new fabric.Textbox(text, template);
        canvas.add(rect);
        canvas.setActiveObject(rect);
        rect.set(CLASS, CLASS_ROOM_ID);
        return rect;
    }

}
