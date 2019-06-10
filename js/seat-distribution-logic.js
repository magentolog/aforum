const EGAL_VALUE = 1;
const NULL_VALUE = 0;
const PRIORITY_WEIGHT = 10; // you can set it to 0 wenn alle Nutzer sind gleich
const PREFERRED_ROOM_WEIGHT = 1;
const PREFERRED_TABLE_WEIGHT = 1;

function SeatDistributionLogic(userService) {  // director (design pattern)
    var _this = this;
    this.createDaySchedule = function (userRequestDict, tables, previousSchedule = []) {
        var arrOfUserIds = userRequestDict.keys();
        var arrOfTableIds = tables.map(table => table.id);
        var users = userService.get(arrOfUserIds);
        var am = new AssessmentMatrix(arrOfUserIds, arrOfTableIds);
        am.setUserPriorities(users);
        setPreferredRooms(am, userRequestDict, tables);
        setPreferredTables(am, userRequestDict);
        setPreferredUsers(am, previousSchedule);
        var schedule = runHungarian(am);
        return schedule;
    }

    function setPreferredTables(am, userRequestDict) {
        userRequestDict.forEach((items, userId) => {
            var arrOfTableIds = items.filter(item => item.tableId).map(item => item.tableId);
            am.setPreferredTables(userId, arrOfTableIds);
        });
    }

    function setPreferredRooms(am, userRequestDict, tables) {
        userRequestDict.forEach((items, userId) => {
            var arrOfRoomIds = items.filter(item => item.roomId).map(item => item.roomId);
            arrOfRoomIds.forEach(roomId => {
                var arrOfTableIds = tables.filter(table => table.roomId == roomId).map(item => item.id);
                am.setPreferredRoom(userId, arrOfTableIds);
            });
        });
    }

    function setPreferredUsers(am, previousSchedule) {
        previousSchedule.forEach(pair => {
            var userId = pair[0];
            var tableId = pair[1];
            var user = userService.get(userId);
            am.setPreferredUser(userId, tableId);
        });
    }

    function runHungarian(matrix) {
        var hungarianMatrix = matrix.getMatrix();
        var hungarianAlgorithm = new HungarianAdapter();
        var results = hungarianAlgorithm.execute(hungarianMatrix);
        return matrix.mapResultArrToUserTableArr(results);
    };


}

