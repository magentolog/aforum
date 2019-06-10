const TIME_TABLE_BASE_NAME = "TimeTableV1";
const ABSENCE_TABLE_BASE_NAME = "AbsenceTableV1";
const AUTO_MAP_PROPERTIES = ['id', 'from', 'to', 'userId', 'roomId', 'tableId'];
const WEEK_DAYS = [64, 1, 2, 4, 8, 16, 32]; // Mo=1, Di=2, Mi=4, Do=8, Fr=16, Sa=32, So=64
const ALL_DAYS = 31; // 1+2+4+8+16

function TimeTable(mediator, planId, isTimeTable = true) {
    var _this = this;
    var _timeTableArr = [];
    var nextId = 0;

    // public 
    this.toString = function () {
        return JSON.stringify(_timeTableArr);
    };

    this.load = function () {
        var st = localStorage.getItem(getTableName());
        _timeTableArr = (st) ? JSON.parse(st) : [];
        nextId = getLastId() + 1;
    };

    this.save = function () {
        save();
    };

    this.deleteAll = function () {
        localStorage.removeItem(getTableName());
        _this.load();
    };

    this.getByUserId = function (userId) {
        var resultArr = _timeTableArr.filter(item => item.userId == userId);
        return resultArr.map(item => mapTimeTableDtoToData(item));
    };

    this.getByDate = function (timestamp) {
        var date = new Date(timestamp);
        var index = date.getDay();
        var dayOfWeek = WEEK_DAYS[index];
        const items = _timeTableArr.filter(item => {
            var b =
                ((item.from <= timestamp) && (timestamp <= item.to)
                    && (!item.hasOwnProperty('days') || (item.days & dayOfWeek)));
            return b;
        });
        return items;
    };

    this.get = function (id) {
        var resultArr = _timeTableArr.filter(item => item.id === id);
        return (resultArr.length) ? mapTimeTableDtoToData(resultArr[0]) : false;
    };

    this.add = function (data) {
        var id = nextId++;
        var item = Object.assign({ id: id }, mapDataToTimeTableDto(data));
        _timeTableArr.push(item);
        save();
        notify(MSG_TIME_TABLE_ADD, data);
        return item;
    };

    this.edit = function (id, newData) {
        var item = _timeTableArr.find(item => item.id == id);
        if (item) {
            Object.assign(item, mapDataToTimeTableDto(newData));
            notify(MSG_TIME_TABLE_EDIT, item);
        }
        save();
    };

    this.remove = function (id) {
        var result = false;
        for (var i = 0, n = _timeTableArr.length; i < n; i++) {
            var item = _timeTableArr[i];
            if (item.id == id) {
                var arr = _timeTableArr.splice(i, 1);
                result = arr[0];
                save();
                break;
            }
        }
        notify(MSG_TIME_TABLE_DELETE, result);
        return result;

    };

    this.getDayArray = function () {
        var arr = [];
        _timeTableArr.forEach((item) => {
            arr.push(item.from, item.to + 1000 * 24 * 60 * 60);
        });
        return arr;
    };

    // private 

    function init() {
        _this.load();
    }

    function getTableName() {
        var tableName = (isTimeTable) ? TIME_TABLE_BASE_NAME : ABSENCE_TABLE_BASE_NAME;
        return tableName + planId;
    }

    function getLastId() {
        var id = 0;
        _timeTableArr.forEach(function (item) {
            if (item.id > id) {
                id = item.id;
            }
        });
        return id;
    }

    function save() {
        localStorage.setItem(getTableName(), JSON.stringify(_timeTableArr));
    }

    function mapDataToTimeTableDto(data) {
        var result = {};
        AUTO_MAP_PROPERTIES.forEach(prop => {
            if (data.hasOwnProperty(prop)) {
                result[prop] = data[prop];
            }
        });
        if (data.hasOwnProperty('days')) {
            result.days = 0;
            data.days.forEach(x => result.days += parseInt(x, 10));
        } else {
            result.days = ALL_DAYS;
        }
        return result;
    }

    function mapTimeTableDtoToData(item) {
        var result = {};
        AUTO_MAP_PROPERTIES.forEach(prop => {
            result[prop] = item[prop];
        });
        if (!item.hasOwnProperty('days')) {
            item.days = ALL_DAYS;
        }
        result.days = [];
        WEEK_DAYS.forEach((x) => {
            if (x & item.days) {
                result.days.push(x);
            }
        });
        return result;
    }

    function notify(type, data = null) {
        if (mediator) {
            var msg = {
                type: type,
                data: data
            };
            mediator.notify(msg, _this);
        }
    }

    init();
}
