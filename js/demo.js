function FloorPlanDemo(canvas, floorPlanService, floorPlanComponent, tableService) {
    var _this = this;
    var timeTable = null;
    var absenceTable = null;
    var billardTable = null;
    var dayNavigatorService = null;
    var scheduleService = null;
    var seatDistributionLogic = null;
    var dayNavigatorComponent = null;
    var userListComponent = null;
    var reservationDialog = null;
    var absenceDialog = null;
    var userService = null;
    var planId = null;

    this.show = function (aPlanId) {
        planId = aPlanId;
        $('.demo').show();
        // show users
        timeTable = new TimeTable(_this, planId, true);
        absenceTable = new TimeTable(_this, planId, false);
        userListComponent = new UserListComponent(_this, userService, timeTable, absenceTable, reservationDialog, absenceDialog, planId);
        // show navigator       
        dayNavigatorService = new DayNavigatorService(timeTable, absenceTable);
        dayNavigatorComponent.show(dayNavigatorService);
        // create logic
        seatDistributionLogic = new SeatDistributionLogic(userService);
        // create schedule
        scheduleService = new ScheduleService(dayNavigatorService, floorPlanService, seatDistributionLogic);
        // scheduleService.createAllDays(planId);
        // show plan
        showPlan();
        // \\
    }

    this.hide = function () {
        dayNavigatorComponent.hide();
        $('.demo').hide();
        $('.warning').hide();
    }

    this.notify = function (msg, sender = null) {
        if (msg.type === MSG_CHANGE_CURRENT_DATE) {
            showPlan();
        } else if (msg.type === MSG_TIME_TABLE_ADD) {
            console.log('add', msg.data);
            showPlan();
        } else if (msg.type === MSG_TIME_TABLE_EDIT) {
            console.log('edit', msg.data);
            showPlan();
        } else if (msg.type === MSG_TIME_TABLE_DELETE) {
            console.log('delete', msg.data);
            showPlan();
        } 
    }

    function init() {
        dayNavigatorComponent = new DayNavigatorComponent(_this);
        reservationDialog = new ReservationDialog(floorPlanService);
        absenceDialog = new AbsenceDialog(floorPlanService);
        userService = new UserService();

        $("#btn-demo-reset").click(function () {
            if (confirm("Are you sure you want to remove all data?")) {
                deleteAll();
            }
        });

        $("#btn-animate").click(function () {
            if (!billardTable) {
                billardTable = new BillardTable(canvas);
            }
            billardTable.init();
        });
    }

    function showPlan() {
        const schedule = scheduleService.getDaySchedule(planId, dayNavigatorComponent.getDate());
        const plan = floorPlanService.load(planId);
        plan.tables = tableService.getTablesWithUserNames(plan.tables, schedule);
        floorPlanComponent.draw(plan);
        showHomelessUsers(schedule);
        canvas.blockAll();
    }

    function showHomelessUsers(schedule) {
        var arrOfUserIds = schedule.filter(item => (item[1] <= 0)).map(item => item[0]);
        if (arrOfUserIds.length) {
            var users = userService.get(arrOfUserIds);
            var html = '';
            users.forEach(user => {
                html += `<li>${user.name} (${user.position})</li>`;
            });
            $('.warning').find('.user-list').html(html);
            $('.warning').show();
        } else {
            $('.warning').hide();
        }
    }

    function deleteAll() {
        timeTable.deleteAll();
        absenceTable.deleteAll();
        userListComponent.redraw();
        showPlan();
    }

    init();
}