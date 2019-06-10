const FLOOR_PLAN_BASE_NAME = "FloorPlan";

function FloorPlanStorage() {
    var _this = this;
    this.loadFloorPlan = function (planId) {
        var st = localStorage.getItem(FLOOR_PLAN_BASE_NAME + planId);
        var plan = (st) ? JSON.parse(st) : floorPlanMocks[planId];
        return plan;
    };

    this.saveFloorPlan = function (planId, plan) {
        fixFloorPlan(plan);
        localStorage.setItem(FLOOR_PLAN_BASE_NAME + planId, JSON.stringify(plan));
    };

    this.resetFloorPlan = function (planId) {
        localStorage.setItem(FLOOR_PLAN_BASE_NAME + planId, "");
    };

    this.getRoomList = function (planId) {
        const plan = _this.loadFloorPlan(planId);
        const result = [];
        plan.rooms.forEach(room => {
            const item = { id: room.id };
            let nameArr = plan.rnames.filter(rname => rname.roomId == room.id);
            item.name = (nameArr.length) ? nameArr[0].text : `Room (id=${room.id})`;
            result.push(item);
        });
        return result;
    };

    this.getTables = function (planId, roomId = null) {
        const plan = _this.loadFloorPlan(planId);
        const tables = (roomId) ? plan.tables.filter(table => table.roomId == roomId) : plan.tables;
        return tables;
    };

    function fixFloorPlan(plan) {
        fixIds(plan.rooms);
        fixIds(plan.tables);
        fixIds(plan.rnames);
        fixRelationIds(plan.tables, plan.rooms, 'roomId');
        fixRelationIds(plan.rnames, plan.rooms, 'roomId');
        fixInGroupId(plan.tables, 'roomId', 'inRoomId');
    };

    function fixInGroupId(arr, key, inGroupKey) {
        const grouped = arr.groupBy(key);
        for (let value in grouped) {
            grouped[value].forEach((item, i) => {
                item[inGroupKey] = i + 1;
            });
        }
    }

    function getMaxValue(arr, key) {
        let maxVal = 0;
        arr.forEach(item => { maxVal = Math.max(maxVal, (item.hasOwnProperty(key)) ? item[key] : 0) });
        return maxVal;
    }

    function fixIds(objArr) {
        let maxId = getMaxValue(objArr, 'id');
        objArr.forEach((obj, i) => {
            if (!obj.hasOwnProperty('id')) {
                obj.id = (++maxId);
            }
        });
    }

    function fixRelationIds(itemsArr, containersArr, sKey) {
        itemsArr.forEach(item => {
            var x = item.left + 2;
            var y = item.top + 2;
            var contArr = containersArr.filter(o => {
                const x1 = o.left;
                const x2 = o.left + o.width;
                const y1 = o.top;
                const y2 = o.top + o.height;
                const b = ((x1 < x) && (x < x2) && (y1 < y) && (y < y2));
                return b;
            });
            var id = (contArr.length) ? contArr[0].id : null;
            item[sKey] = id;
        });
    }
}
