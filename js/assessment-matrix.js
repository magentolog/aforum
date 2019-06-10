function AssessmentMatrix(arrOfUserIds, arrOfTableIds, options = {}) { // builder + smartMatrix decorator (design patterns)
    var _this = this;
    var smartMatrix = null;
    const sUSER_PRIORITY = 'userPriority';
    const sIS_ROOM_IMPORTANT = 'isRoomImportant';
    const sIS_TABLE_IMPORTANT = 'isTableImportant';
    const sROOM_PRICE = 'roomPrice';
    const sTABLE_PRICE = 'tablePrice';
    const sUSER_PRICE = 'userPrice';
    const cellAttributes = [sUSER_PRIORITY, sIS_ROOM_IMPORTANT, sIS_TABLE_IMPORTANT, sROOM_PRICE, sTABLE_PRICE, sUSER_PRICE];

    this.setUserPriorities = function (users) {
        users.forEach(user => {
            smartMatrix.row(user.id).set(sUSER_PRIORITY, parseInt(user.base_priority));
        });
    };

    this.setPreferredRoom = function (userId, arrOfTableIds) {
        arrOfTableIds.forEach(tableId => {
            smartMatrix.row(userId).cell(tableId).set(sROOM_PRICE, 1);
        });
    };

    this.setPreferredTables = function (userId, arrOfTableIds) {
        arrOfTableIds.forEach(tableId => {
            smartMatrix.row(userId).cell(tableId).set(sTABLE_PRICE, 1);
        });
    };

    this.setPreferredUser = function (userId, tableId){
        smartMatrix.row(userId).cell(tableId).set(sUSER_PRICE, 1);
    };

    this.getMatrix = function () {
        var result = smartMatrix.getValues(cellAttributes,
            (userPriority, isRoomImportant, isTableImportant, roomValue, tableValue, userPrice) => {
                var result;
                if (isTableImportant && (tableValue == 0)) {
                    result = options.nullValue;
                } else if (isRoomImportant && (roomValue == 0) && (tableValue == 0)) {
                    result = options.nullValue;
                } else {
                    result = userPriority * options.priorityWeight + options.egalWeight + roomValue + tableValue + userPrice;
                }
                return result;
            });
        return result;
    };

    this.mapResultArrToUserTableArr = function (results) {
        return results.map(item => {
            let i = item[0];
            let j = item[1];
            let tableId = (j < 0) ? j : arrOfTableIds[j];
            return [arrOfUserIds[i], tableId];
        });
    };

    function setDefaultOptions() {
        if (!options.hasOwnProperty('nullValue')) {
            options.nullValue = 0;
        }
        if (!options.hasOwnProperty('priorityWeight')) {
            options.priorityWeight = 2;
        }
        if (!options.hasOwnProperty('egalWeight')) {
            options.egalWeight = 1;
        }
    }

    function init() {
        setDefaultOptions();
        smartMatrix = new SmartMatrix();
        smartMatrix.setKeys(arrOfUserIds, arrOfTableIds);
    }

    init();
}


function AssessmentMatrixSpec() {
    var _this = this;
    this.testCreation = function () {
        console.log('testCreation');
        var egalValue = 3;
        var am = new AssessmentMatrix([1, 2, 3], [1, 2], { egalWeight: egalValue });
        var matrix = am.getMatrix();
        if ((matrix.length != 3) || (matrix[0].length != 2)) {
            console.log(JSON.stringify(matrix));
            console.error('matrix 3x2 expected');
        }
        if (matrix[0][0] != egalValue) {
            console.log(matrix[0][0]);
            console.error('expected egal value = ' + egalValue);
        }
    }

    this.testUserPriorities = function () {
        console.log('testUserPriorities');
        var priorityWeight = 3;
        var egalWeight = 1;
        var am = new AssessmentMatrix([1, 2, 3], [1, 2], { priorityWeight: priorityWeight, egalWeight: egalWeight });
        var users = [
            { id: 1, name: 'Alex', position: 'Praktikant', base_priority: '1' },
            { id: 2, name: 'Björn', position: 'Mitarbeiter', base_priority: '2' },
            { id: 3, name: 'Dominik', position: 'Mitarbeiter', base_priority: '3' },
        ];
        am.setUserPriorities(users);
        var matrix = am.getMatrix();
        if ((matrix[0][0] != 4) || (matrix[1][0] != 7) || (matrix[2][0] != 10)) {
            console.log(JSON.stringify(matrix));
            console.error(`matrix expected  "3" if priority=${users[0].base_priority}`);
            console.error(`matrix expected  "4" if priority=${users[1].base_priority}`);
        }
    }

    this.testPreferredRoom = function () {
        console.log('testPreferredRoom');
        var priorityWeight = 3;
        var egalWeight = 1;
        var am = new AssessmentMatrix([1, 2], [1, 2, 3], { priorityWeight: priorityWeight, egalWeight: egalWeight });
        am.setPreferredRoom(1, [1, 2]);
        am.setPreferredRoom(2, [3]);
        var matrix = am.getMatrix();
        var expected = '[[2,2,1],[1,1,2]]';
        var actual = JSON.stringify(matrix);
        if (expected != actual) {
            console.log(JSON.stringify(matrix));
            console.error('expected: ' + expected);
        }
    }

    this.testPreferredTables = function () {
        console.log('testPreferredTables');
        var priorityWeight = 3;
        var egalWeight = 1;
        var am = new AssessmentMatrix([1, 2], [1, 2, 3], { priorityWeight: priorityWeight, egalWeight: egalWeight });
        am.setPreferredRoom(1, [1, 2]);
        am.setPreferredTables(1, [1]);
        am.setPreferredRoom(2, [3]);       
        var matrix = am.getMatrix();
        var expected = '[[3,2,1],[1,1,2]]';
        var actual = JSON.stringify(matrix);
        if (expected != actual) {
            console.log(JSON.stringify(matrix));
            console.error('expected: ' + expected);
        }
    }

    this.runAllTests = function () {
        console.log('AssessmentMatrix Tests => {');
        _this.testCreation();
        _this.testUserPriorities();
        _this.testPreferredRoom();
        _this.testPreferredTables();
        console.log('} ');
    }
}

