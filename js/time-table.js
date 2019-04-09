const TIME_TABLE_BASE_NAME = "TimeTable";
const ABSENCE_TABLE_BASE_NAME = "AbsenceTable";

function TT_Item(userId, id, sFrom, sTo) {
    var _this = this;
    this.id = id;
    this.userId = userId;
    this.from = new Date();
    this.to = new Date();
    Object.defineProperty(this, "sFrom", {
        get: function () { _this.from.toString() },
        set: function (value) { _this.from = new Date(value) }
    });
    this.toString = function () {
        return _this.sFrom;
    }
};

function TimeTable(planId, isTimeTable = true) {
    var _this = this;
    var _timeTableArr = [];
    var nextId = 0;

    function init() {
        _this.load();
    }
    function getTableName() {
        var tableName = (isTimeTable) ? TIME_TABLE_BASE_NAME : ABSENCE_TABLE_BASE_NAME;
        return tableName + planId;
    }

    this.load = function () {
        var st = localStorage.getItem(getTableName());
        _timeTableArr = (st) ? JSON.parse(st) : [];
        nextId = getLastId() + 1;
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

    this.save = function () {
        localStorage.setItem(getTableName(), JSON.stringify(_timeTableArr));
    };

    this.deleteAll = function () {
        localStorage.setItem(getTableName(), "");
        _this.load();
    };

    this.getByUserId = function (userId) {
        var result = _timeTableArr.filter(item => item.userId == userId);
        return result;
    };

    this.add = function (userId, from, to) {
        var dateFrom = $.datepicker.parseDate(DATE_FORMAT, from);
        var dateTo = $.datepicker.parseDate(DATE_FORMAT, to);
        if (dateFrom <= dateTo) {
            var id = nextId++;
            var item = {
                id: id,
                userId: userId,
                from: from,
                to: to
            };
            _timeTableArr.push(item);
            return item;
        }
        else return false;
    };

    this.remove = function (id) {
        for (var i = 0, n = _timeTableArr.length; i < n; i++) {
            var item = _timeTableArr[i];
            if (item.id == id) {
                return _timeTableArr.splice(i, 1);
            }
        }
        return false;
    };

    init();
}
