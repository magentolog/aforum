function FloorPlanDemo(canvas) {
    var _this = this;
    var timeTable = null;
    var absenceTable = null;
    var billiardTable = null;
    var dayNavigatorService = null;
    var dayNavigatorComponent = new DayNavigatorComponent;
    var reservationDialog = new ReservationDialog();
    var absenceDialog = new AbsenceDialog();

    init();

    this.show = function (planId) {
        $('.demo').show();
        timeTable = new TimeTable(planId, true);
        absenceTable = new TimeTable(planId, false);
        dayNavigatorService = new DayNavigatorService(timeTable, absenceTable);
        dayNavigatorComponent.show(dayNavigatorService);
        showUsers();
    }

    this.hide = function () {
        saveAll();
        dayNavigatorComponent.hide();
        $('.demo').hide();
    }

    function init() {
        $("#btn-demo-save").click(function () {
            saveAll();
        });

        $("#btn-demo-reset").click(function () {
            if (confirm("Are you sure you want to remove all data?")) {
                deleteAll();
            }
        });

        $("#btn-animate").click(function () {
            if (!billiardTable) {
                billiardTable = new BilliardTable(canvas);
            }
            billiardTable.init();
        });

        $("#btn-show-png").click(function () {
            const bgColorOld = canvas.get('backgroundColor');
            canvas.set('backgroundColor', 'white');
            url = canvas.toDataURL({
                format: 'png',
                multiplier: 2,
            });
            console.log(url);
            var arr = timeTable.getDayArray();
            console.log(arr);

        });
    }

    function saveAll() {
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
            $accordion.append(getUserHtml(user));
        });
        addUserRelatedEvents($accordion);
        $accordion.accordion({
            heightStyle: "content",
        });
    }

    function addUserRelatedEvents($user) {
        $user.find(".btn-timetable-new").click(function () {
            var $userDetails = $(this).parent(".user-details");
            addTimeTableItem($(this), timeTable);
        });
        $user.find(".btn-absence-new").click(function () {
            addTimeTableItem($(this), absenceTable);
        });
        var $timetable = $user.find('.timetable');
        addTimeTableEvents($timetable, timeTable, reservationDialog);

        var $absencetable = $user.find('.absencetable');
        addTimeTableEvents($absencetable, absenceTable, absenceDialog);
    }

    function addTimeTableEvents($timetable, aTimeTable, aDialog) {
        $timetable.find('.fa-trash-alt').off("click").click(function () {
            var $item = $(this).parent(".tt-item");
            var id = +($item.attr("data-id"));
            aTimeTable.remove(id);
            $item.remove();
        });
        $timetable.find('.fa-edit').off("click").click(function () {
            var $item = $(this).parent(".tt-item");
            var id = +($item.attr("data-id"));
            var item = aTimeTable.get(id);
            if (item) {
                var user = users.find(user => user.id == item.userId);
                aDialog.show(item, function (data) {
                    item.from = data.from;
                    item.to = data.to;
                    $item.find('.from').text(item.from);
                    $item.find('.to').text(item.to);
                });
            }
        });
    }

    function getUserHtml(user) {
        var $tpl = $('#user-template');
        $tpl.find('.user-details').attr('data-user-id', user.id);
        $tpl.find('h3').html(user.name);
        $tpl.find('.position').html(user.position);
        $tpl.find('.base-priority').html(user.base_priority);
        filloutTimeTable($tpl.find('.timetable'), timeTable.getByUserId(user.id));
        filloutTimeTable($tpl.find('.absencetable'), absenceTable.getByUserId(user.id));
        return $tpl.html();
    }

    function filloutTimeTable($timetable, ttItemDtoList) {
        $timetable.html("");
        ttItemDtoList.forEach(function (ttItemDto) {
            $timetable.append(getTTItemHtml(ttItemDto));
        });
    }

    function getTTItemHtml(item) {
        var html = '<div class="tt-item" data-id = "' + item.id + '"><span class="from">' + item.from + '</span>&nbsp;-&nbsp;<span class="to">' + item.to + '</span>&nbsp;&nbsp;' + '<i class="far fa-edit" title="edit item"></i>&nbsp;&nbsp;' + '<i class="far fa-trash-alt" title="delete item"></i>' + '</div>';
        return html;
    }

    function addTimeTableItem($button, aTimeTable) {
        var $user = $button.parent(".user-details");
        var userId = +($user.attr('data-user-id'));
        if (aTimeTable === timeTable) {
            var $timetable = $user.find(".timetable");
            var aDialog = reservationDialog;
        } else {
            var $timetable = $user.find(".absencetable");
            var aDialog = absenceDialog;
        }
        var user = users.find(user => user.id == userId);
        var defaultdata = { name: user.name };
        aDialog.show(defaultdata, function (data) {
            data.userId = userId;
            var ttItemDto = aTimeTable.add(userId, data.from, data.to);
            if (ttItemDto) {
                $timetable.append(getTTItemHtml(ttItemDto));
                addTimeTableEvents($timetable, aTimeTable, aDialog);
            } else {
                alert('Invalid data!');
            }
        });
    }

    function rnd(max) {
        return Math.floor(Math.random() * max); // return random integer value 0..max
    }

    function getRandomUser() {
        var n = users.length;
        return users[rnd(n)];
    }

    function showRandomUsers() {
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