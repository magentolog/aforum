const SCHEDULE_STORAGE_BASE_NAME = 'Schedule';

function ScheduleStorage() {
    var _this = this;

    this.get = function (planId, date) {
        var schedule = loadAll(planId);
        var key = date.toISODate();
        return (schedule.hasOwnProperty(key)) ? schedule[key] : false;
    }

    this.set = function (planId, date, daySchedule) {
        var schedule = loadAll(planId);
        schedule[date.toISODate()] = daySchedule;
        var value = JSON.stringify(schedule);
        localStorage.setItem(getKey(planId), value);
    }

    this.delete = function (planId, date) {
        var schedule = loadAll(planId);
        var key = date.toISODate();
        if (schedule.hasOwnProperty(key)) {
            delete schedule[key];
        }
        var value = JSON.stringify(schedule);
        localStorage.setItem(getKey(planId), value);
    }

    this.getAll = function (planId) {
        return loadAll(planId);
    }

    this.setAll = function (planId, schedule) {
        var value = JSON.stringify(schedule);
        localStorage.setItem(getKey(planId), value);
    }

    this.deleteAll = function (planId) {
        localStorage.removeItem(getKey(planId));
    }

    // --------------------------------------- //
    function getKey(planId) {
        return SCHEDULE_STORAGE_BASE_NAME + '_' + planId;
    }

    function loadAll(planId) {
        var st = localStorage.getItem(getKey(planId));
        var schedule = (st) ? JSON.parse(st) : {};
        return schedule;
    };


}