function FloorPlanDemo(canvas, reservationDialog, floorPlan) {
    var _this = this;
    var timeTable = null;
    var absenceTable = null;
    var easterEgg = null;

    init();
    function init() {
        $("#btn-demo-save").click(function () {
            _this.saveAll();
        });

        $("#btn-demo-reset").click(function () {
            if (confirm("Are you sure you want to remove all data?")) {
                deleteAll();
            }
        });

        $("#btn-animate").click(function () {
            if (!easterEgg) {
                easterEgg = new EasterEgg();
            }
            easterEgg.init(canvas);
        });
    }

    this.saveAll = function () {
        timeTable.save();
        absenceTable.save();
    }

    function deleteAll() {
        timeTable.deleteAll();
        absenceTable.deleteAll();
        showUsers();
    }

    function showUsers() {
        $("#users-container").html('<div id="accordion"></div>');
        var $accordion = $("#accordion");
        users.forEach((user) => {
            var $user = $accordion.append(getUserHtml(user));
            addUserRelatedEvents($user);
        });
        $accordion.accordion({
            heightStyle: "content",
        });
    }

    function addUserRelatedEvents($user) {
        $user.find(".btn-timetable-new").click(function () {
            var $userDetails = $(this).parent(".user-details");
            addReservationRequest($userDetails);
        });
        $user.find(".btn-absence-new").click(function () {
            var $userDetails = $(this).parent(".user-details");
            addabsenceItem($userDetails);
        });
        var $timetable = $user.find('.timetable');
        addTimeTableEvents($timetable, timeTable);

        var $absencetable = $user.find('.absencetable');
        addTimeTableEvents($absencetable, absenceTable);
    }

    function addTimeTableEvents($timetable, timeTable) {
        $timetable.find('.fa-trash-alt').off("click").click(function () {
            var $item = $(this).parent(".tt-item");
            var id = +($item.attr("data-id"));
            timeTable.remove(id);
            $item.remove();
        });
        $timetable.find('.fa-edit').off("click").click(function () {
            var $item = $(this).parent(".tt-item");
            var id = +($item.attr("data-id"));
            var item = timeTable.get(id);
            if (item) {
                var user = users.find(user => user.id == item.userId);
                reservationDialog.show(item, function (data) {
                    item.from = data.from;
                    item.to = data.to;
                    $item.find('.from').text(item.from);
                    $item.find('.to').text(item.to);
                });
            }
        });
    }

    function getUserHtml(user) {
        var requests = timeTable.getByUserId(user.id);
        var $tpl = $('#user-template');
        $tpl.find('.user-details').attr('data-user-id', user.id);
        $tpl.find('h3').html(user.name);
        $tpl.find('.position').html(user.position);
        $tpl.find('.base-priority').html(user.base_priority);
        var $timetable = $tpl.find('.timetable');
        $timetable.html("");
        requests.forEach(function (ttItemDto) {
            $timetable.append(getTTItemHtml(ttItemDto));
        });
        return $tpl.html();
    }

    function getTTItemHtml(item) {
        var html = '<div class="tt-item" data-id = "' + item.id + '"><span class="from">' + item.from + '</span>&nbsp;-&nbsp;<span class="to">' + item.to + '</span>&nbsp;&nbsp;' + '<i class="far fa-edit" title="edit item"></i>&nbsp;&nbsp;' + '<i class="far fa-trash-alt" title="delete item"></i>' + '</div>';
        return html;
    }

    function addabsenceItem($user) {
        var $timetable = $user.find(".timetable");
        var userId = +($user.attr('data-user-id'));
        var user = users.find(user => user.id == userId);
        console.log(user);
    }

    function addReservationRequest($user) {
        var $timetable = $user.find(".timetable");
        var userId = +($user.attr('data-user-id'));
        var user = users.find(user => user.id == userId);
        var defaultdata = { name: user.name };
        reservationDialog.show(defaultdata, function (data) {
            data.userId = userId;
            var ttItemDto = timeTable.add(userId, data.from, data.to);
            if (ttItemDto) {
                $timetable.append(getTTItemHtml(ttItemDto));
                addTimeTableEvents($timetable, timeTable);
            } else {
                alert('Invalid data!');
            }
        });
    }

    this.run = function (planId) {
        timeTable = new TimeTable(planId, true);
        absenceTable = new TimeTable(planId, false);
        showUsers();
    }

    function rnd(max) {
        return Math.floor(Math.random() * max); // return random integer value 0..max
    }

    function getRandomUser() {
        var n = users.length;
        return users[rnd(n)];
    }

    function showNextDay() {
        canvas.forEachObject(CLASS_TABLE, function (table) {
            var user = getRandomUser();
            if (rnd(10) < 2) {
                table.setColor(tableTemplate.fill);
                table.setText("");
            } else {
                table.setColor(COLOR_TABLE_RESERVED);
                table.setText(user.name);
            }
            table.off('mousedblclick');
            table.on('mousedblclick', function (e) {
                var tableObj = this;
                var oldName = tableObj.item(1).get('text');
                // var newName = prompt('Enter new user name:', oldName);
                var data = (oldName === "") ? { from: "", to: "", name: oldName } : { from: "01.03.2019", to: "01.05.2019", name: oldName };
                reservationDialog.show(data, function (data) {
                    var newName = data.name;
                    if (newName !== null) {
                        tableObj.setText(newName);
                        table.setColor((newName.length) ? COLOR_TABLE_RESERVED : tableTemplate.fill);
                        canvas.renderAll();
                    }
                });
            });
        });
        canvas.renderAll();
    }
}