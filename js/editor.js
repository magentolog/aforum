function FloorEditor(canvas, floorPlanService, floorPlanComponent) {
    var _this = this;

    init();
    function init() {
        var planId = getPlanId();
        setPlan(planId);
        initToolBar();
    }
    this.hide = function () {
        $('.edit').hide();
        saveAll();
    }

    this.show = function () {
        $('.edit').show();
        var planId = getPlanId();
        setPlan(planId);
    }

    this.getPlanId = function () {
        return getPlanId();
    };

    function saveAll() {
        var plan = canvas.exportPlan();
        var planId = getPlanId();
        floorPlanService.save(plan, planId);
    };

    function initToolBar() {
        $("#btn-add-room").click(function () {
            var data = getLastObjData(CLASS_ROOM, INDENT_X, INDENT_Y);
            floorPlanComponent.addRoom(data);
        });

        $("#btn-add-table").click(function () {
            var data = getLastObjData(CLASS_TABLE, INDENT_X, INDENT_Y);
            floorPlanComponent.addTable(data);
        });

        $("#btn-add-room-name").click(function () {
            var text = ($("#ed-room-name").val()).trim();
            if (text) {
                var data = getLastObjData(CLASS_ROOM_NAME, INDENT_X, INDENT_Y);
                floorPlanComponent.addRoomName(text, data);
            }
            $("#ed-room-name").val("");
        });

        $("#btn-add-room-id").click(function () {
            var text = ($("#ed-room-id").val()).trim();
            if (text) {
                var data = getLastObjData(CLASS_ROOM_ID, INDENT_X, INDENT_Y);
                floorPlanComponent.addRoomId(text, data);
            }
            $("#ed-room-id").val("");
        });

        $("#btn-export-data").click(function () {
            var plan = canvas.exportPlan();
            var planId = getPlanId();
            floorPlanService.save(plan, planId);
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
                var planId = getPlanId();
                floorPlanService.reset(planId);
                var plan = floorPlanService.load(planId);
                setFloorPlan(plan);
            }
        });
    }

    function getPlanId() {
        return $("input[name=location]:checked").val();
    }

    function setPlan(planId) {
        var plan = floorPlanService.load(planId);
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
        floorPlanComponent.setZoom(zoom);
        $("#bg-img").attr("width", canvas.getWidth());
        $("#bg-img").attr("height", canvas.getHeight());
    }

    function setFloorPlan(aFloorPlan) {
        floorPlanComponent.draw(aFloorPlan);
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


}
