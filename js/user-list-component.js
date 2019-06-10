function UserListComponent(mediator, userService, timeTable, absenceTable, reservationDialog, absenceDialog, planId) {
    var _this = this;
    const $container = $('#users-container');
    var $html = null;
    var collection = null;

    this.redraw = function () {
        init();
    };

    function init() {
        $container.html('<div class="accordion"></div>');
        $html = $container.find('.accordion');
        collection = {};
        const users = userService.getAll();
        users.forEach(user => {
            var userComponent = new UserComponent($html, user, timeTable, absenceTable, reservationDialog, absenceDialog, planId);
            collection[user.id] = userComponent;
        });
        $html.accordion({
            heightStyle: "content",
        });
    }
    init();
}

function UserComponent($container, user, timeTable, absenceTable, reservationDialog, absenceDialog, planId) {
    var _this = this;
    var $html = null;
    var timeTableComponent = null;
    var absenceTableComponent = null;

    function getUserFromTemplate() {
        var $tpl = $('#user-template');
        $tpl.find('.user-details').attr('data-user-id', user.id);
        $tpl.find('h3').html(user.name);
        $tpl.find('.position').html(user.position);
        $tpl.find('.base-priority').html(user.base_priority);
        return $tpl.html();
    }

    function init() {
        var html = getUserFromTemplate();
        $container.append(html);
        $html = $container.find('.user-details[data-user-id=' + user.id + ']');
        timeTableComponent = new TimeTableComponent($html, user.id, timeTable, reservationDialog, planId);
        absenceTableComponent = new AbsenceTableComponent($html, user.id, absenceTable, absenceDialog, planId);
    }

    init();
}

function TimeTableComponent($container, userId, tableService, dialog, planId) {
    var _this = this;
    var $html = null;
    var $table = null;

    function init() {
        $html = $container.find('.time-table');
        $tpl = $('#time-table-template');
        $html.html($tpl.html());
        $table = $html.find('.timetable');
        filloutTable();
        addEvents();
    }

    function addItem() {
        var defaultdata = { userId: userId };
        dialog.show(defaultdata, planId, function (data) {
            var item = tableService.add(data);
            if (item) {
                $table.append(getItemHtml(item));
                addEvents();
            } else {
                alert('Invalid data!');
            }
        });
    }

    function addEvents() {
        $html.find('.btn-timetable-new').off('click').click(function () {
            addItem();
        });
        $table.find('.fa-trash-alt').off('click').click(function () {
            var $item = $(this).parent('.tt-item');
            var id = +($item.attr('data-id'));
            tableService.remove(id);
            $item.remove();
        });
        $table.find('.fa-edit').off('click').click(function () {
            var $item = $(this).parent('.tt-item');
            var id = +($item.attr('data-id'));
            var item = tableService.get(id);
            if (item) {
                dialog.show(item, planId, function (data) {
                    tableService.edit(id, data);
                    $item.find('.from').text(timeStampToStr(data.from));
                    $item.find('.to').text(timeStampToStr(data.to));
                });
            }
        });
    }

    function filloutTable() {
        var itemList = tableService.getByUserId(userId);
        itemList.forEach(function (item) {
            $table.append(getItemHtml(item));
        });
    }

    function getItemHtml(item) {
        var html =
            `<div class="tt-item" data-id = ${item.id}>` +
            `<span class="from">${timeStampToStr(item.from)}</span>&nbsp;-&nbsp;` +
            `<span class="to">${timeStampToStr(item.to)}</span>&nbsp;&nbsp;` +
            `<i class="far fa-edit" title="edit item"></i>&nbsp;&nbsp;` +
            `<i class="far fa-trash-alt" title="delete item"></i>` +
            `</div>`;
        return html;
    }

    init();
}

function AbsenceTableComponent($container, userId, tableService, dialog, planId) {
    var _this = this;
    var $html = null;
    var $table = null;

    function init() {
        $html = $container.find('.absence-table');
        $tpl = $('#absence-table-template');
        $html.html($tpl.html());
        $table = $html.find('.absencetable');
        filloutTable();
        addEvents();
    }

    function addItem() {
        var defaultdata = { userId: userId };
        dialog.show(defaultdata, planId, function (data) {
            var item = tableService.add(data);
            if (item) {
                $table.append(getItemHtml(item));
                addEvents();
            } else {
                alert('Invalid data!');
            }
        });
    }

    function addEvents() {
        $html.find('.btn-absence-new').off('click').click(function () {
            addItem();
        });
        $table.find('.fa-trash-alt').off('click').click(function () {
            var $item = $(this).parent('.tt-item');
            var id = +($item.attr('data-id'));
            tableService.remove(id);
            $item.remove();
        });
        $table.find('.fa-edit').off('click').click(function () {
            var $item = $(this).parent('.tt-item');
            var id = +($item.attr('data-id'));
            var item = tableService.get(id);
            if (item) {
                dialog.show(item, planId, function (data) {
                    tableService.edit(id, data);
                    $item.find('.from').text(timeStampToStr(data.from));
                    $item.find('.to').text(timeStampToStr(data.to));
                });
            }
        });
    }

    function filloutTable() {
        var itemList = tableService.getByUserId(userId);
        itemList.forEach(function (item) {
            $table.append(getItemHtml(item));
        });
    }

    function getItemHtml(item) {
        var html =
            `<div class="tt-item" data-id = ${item.id}>` +
            `<span class="from"> ${timeStampToStr(item.from)} </span>&nbsp;-&nbsp;` +
            `<span class="to"> ${timeStampToStr(item.to)} </span>&nbsp;&nbsp;` +
            `<i class="far fa-edit" title="edit item"></i>&nbsp;&nbsp;` +
            `<i class="far fa-trash-alt" title="delete item"></i>` +
            `</div>`;
        return html;
    }

    init();

}