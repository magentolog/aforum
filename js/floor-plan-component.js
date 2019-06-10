// die Komponente kann Grundriss auf canvas malen
function FloorPlanComponent(canvas) {
    var _this = this;
    var floorPlanDto = null;

    this.draw = function (plan) {
        floorPlanDto = plan;
        canvas.clear();
        _this.setZoom(1);
        canvas.requestRenderAll();

        floorPlanDto.rooms.forEach(function (data) {
            _this.addRoom(data);
        });

        floorPlanDto.tables.forEach(function (data) {
            _this.addTable(data);
        });

        floorPlanDto.rnames.forEach(function (data) {
            _this.addRoomName(data.text, data);
        });

        floorPlanDto.rids.forEach(function (data) {
            _this.addRoomId(data.text, data);
        });
    };

    this.addRoom = function (data) {
        var template = Object.assign({}, roomTemplate, data);
        var rect = new fabric.Rect(template);
        canvas.add(rect);
        canvas.setActiveObject(rect);
        rect.set(CLASS, CLASS_ROOM);
        return rect;
    };

    this.addTable = function (data) {
        if (!data.hasOwnProperty('width')) {
            data.width = tableGroupTemplate.width;
        }
        if (!data.hasOwnProperty('height')) {
            data.height = tableGroupTemplate.height;
        }
        var rectTemplate = Object.assign({}, tableTemplate, { width: data.width, height: data.height });
        if (data.hasOwnProperty('fill')) {
            rectTemplate.fill = data.fill;
        }
        var rect = new fabric.Rect(rectTemplate);
        var textTemplate = Object.assign({}, tableTextTemplate, { angle: (data.width > data.height) ? 0 : -90 });
        var txt = (data.hasOwnProperty('text')) ? data.text : '';
        var text = new fabric.Text(txt, textTemplate);
        var group = new fabric.Group([rect, text], data);
        group.set(CLASS, CLASS_TABLE);
        canvas.add(group);
        canvas.setActiveObject(group);
        return group;
    };

    this.addRoomName = function (text, data) {
        data.text = text;
        var template = Object.assign({}, roomNameTemplate, data);
        var rect = new fabric.Textbox(text, template);
        canvas.add(rect);
        canvas.setActiveObject(rect);
        rect.set(CLASS, CLASS_ROOM_NAME);
        return rect;
    }

    this.addRoomId = function (text, data) {
        data.text = text;
        var template = Object.assign({}, roomIdTemplate, data);
        var rect = new fabric.Textbox(text, template);
        canvas.add(rect);
        canvas.setActiveObject(rect);
        rect.set(CLASS, CLASS_ROOM_ID);
        return rect;
    };

    this.setZoom = function (zoom) {
        var width = Math.round(floorPlanDto.width * zoom);
        var height = Math.round(floorPlanDto.height * zoom);
        canvas.setWidth(width);
        canvas.setHeight(height);
        canvas.setZoom(zoom);
    }
}