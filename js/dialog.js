function ReservationDialog(floorPlanService) { // DateIntervalDialog gecorator
    const SELECTOR = "#reservation-dialog";
    const HEIGHT = 400;
    const WIDTH = 350;
    var _dialog = new DateIntervalDialog(SELECTOR, floorPlanService);
    this.show = function (data, planId, aCallbackFn) {
        _dialog.show(data, planId, aCallbackFn);
    }
}

function AbsenceDialog(floorPlanService) {
    const SELECTOR = "#absence-dialog";
    const HEIGHT = 400;
    const WIDTH = 350;
    var _dialog = new DateIntervalDialog(SELECTOR, floorPlanService);
    this.show = function (data, planId, aCallbackFn) {
        _dialog.show(data, planId, aCallbackFn);
    }
}

function DateIntervalDialog(selector, floorPlanService) {
    var _this = this;
    var planId = null;
    var dialog = null;
    var $form = $(selector).find("form");
    var dateFormat = DATE_FORMAT;
    var $from = $(selector).find("[name=from]");
    var $to = $(selector).find("[name=to]");
    var $users = $(selector).find("[name=userId]");
    var $tables = $(selector).find("[name=tableId]");
    var $rooms = $(selector).find("[name=roomId]");
    var dpFrom = null;
    var dpTo = null;
    var callbackfn = null;
    var userService = new UserService();

    init();

    function addReservation() {
        var dateFrom = getDate(dpFrom.get(0));
        var dateTo = getDate(dpTo.get(0));
        var result = (dateFrom && dateTo) && (dateFrom <= dateTo);
        if (result && (typeof callbackfn === "function")) {
            var data = serializeFormToJSON();
            data.from = dateFrom.getTime();
            data.to = dateTo.getTime();
            callbackfn(data);
        }
        return result;
    }

    function serializeFormToJSON() {
        var fields = $form.serializeArray();
        var result = {};
        jQuery.each(fields, function (i, field) {
            var k = field.name.indexOf('[]');
            if (k > 0) {
                field.name = field.name.substr(0, k);
                if (!result.hasOwnProperty(field.name)) {
                    result[field.name] = [];
                }
                result[field.name].push(field.value);
            } else {
                result[field.name] = field.value;
            }
        });
        return result;
    }

    this.show = function (data, aPlanId, aCallbackFn) {
        // add options to "select user"
        planId = aPlanId;
        $users.html('');
        const users = userService.getAll();
        users.forEach(user => {
            $users.append('<option value=' + user.id + '>' + user.name + '</option>');
        });
        // add options to "select room"
        $rooms.find("option").not(":first").remove();
        const rooms = floorPlanService.getRoomList(planId);
        rooms.forEach(room => {
            $rooms.append('<option value=' + room.id + '>' + room.name + '</option>');
        });
        // add options to "select table"        
        $tables.find("option").not(":first").remove();
        if (data.hasOwnProperty('roomId') && data.roomId) {
            $rooms.trigger('change', [data.roomId]);
        }
        // fix from and to
        if (data.hasOwnProperty('from')) {
            data.from = timeStampToStr(data.from);
        }
        if (data.hasOwnProperty('to')) {
            data.to = timeStampToStr(data.to);
        }
        // fill out other fields
        for (var x in data) {
            if (x === 'days') {
                var $input = $form.find('[name="' + x + '[]"]')
                $input.prop('checked', false);
                data[x].forEach(val => {
                    $input.filter('[value=' + val + ']').prop('checked', true);
                });
            } else {
                $form.find('[name=' + x + ']').val(data[x]);
            }
        }
        // disable select
        if (data.hasOwnProperty('userId')) {
            $users.find('option[value=' + data.userId + ']').prop('selected', true);
            $users.find('option:not(:selected)').prop('disabled', true);
            var userArr = users.filter(user => user.id == data.userId);
            if (userArr.length) {
                $form.find('.user-name').text(userArr[0].name);
            }
        }
        // open dialog
        callbackfn = aCallbackFn;
        dialog.dialog("open");
    }

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }

    function init() {
        dpFrom = $from.datepicker({
            minDate: 0,
            defaultDate: "0",
            changeMonth: true,
            numberOfMonths: 1,
            dateFormat: dateFormat
        });
        dpTo = $to.datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            dateFormat: dateFormat
        });

        dpFrom.on("change", function () {
            dpTo.datepicker("option", "minDate", getDate(this));
        });
        dpTo.on("change", function () {
            dpFrom.datepicker("option", "maxDate", getDate(this));
        });

        dialog = $(selector).dialog({
            autoOpen: false,
            //height: 400,
            //width: 350,
            dialogClass: 'reservation-dialog',
            modal: true,
            buttons: {
                "Save": function () {
                    if (addReservation()) {
                        dialog.dialog("close");
                    }
                },
                Cancel: function () {
                    dialog.dialog("close");
                }
            },
            close: function () {
                $form[0].reset();
                dpFrom.datepicker("option", "minDate", new Date());
                dpFrom.datepicker("option", "maxDate", new Date(2050, 1, 1));
                dpTo.datepicker("option", "minDate", new Date());
                dpTo.datepicker("option", "maxDate", new Date(2050, 1, 1));

            }
        });

        $form.on('submit', function (event) {
            event.preventDefault();
            //addReservation();
        });

        $rooms.on('change', function (event, roomId) {
            $tables.find('option').not(':first').remove();
            if (!roomId) {
                roomId = $(this).val();
            }
            if (roomId) {
                const tables = floorPlanService.getTables(planId, roomId);
                tables.forEach(table => {
                    $tables.append('<option value=' + table.id + '>' + table.inRoomId + '</option>');
                });
            }
            $tables.val('');
        });
    }
}
