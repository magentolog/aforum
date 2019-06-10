function TableService(userService) {
    var _this = this;

    this.getTablesWithUserNames = function (tables, daySchedule) {
        const result = [];
        const users = userService.getAll();
        const usersDict = createSingleValueDictionary(users, 'id');
        const tuDict = createTableUsersDictionary(daySchedule, usersDict);
        tables.forEach(srcTable => {
            const table = Object.assign({}, srcTable);
            const users = tuDict.get(table.id);
            table.text = renderText(table, users);
            table.fill = (users.length) ? TABLE_COLOR_RESERVED : TABLE_COLOR;
            result.push(table);
        });
        return result;
    };

    function renderText(table, users) {
        let result = `${table.inRoomId} `;
        users.forEach((user, index) => {
            result += ((index) ? '\n\r' : '');
            result += user.name;
        });
        return result;
    }
}

function createTableUsersDictionary(daySchedule, usersDict) {    
    return daySchedule.createDictionary(true,
        pair => pair[1],                // pair[1] => tableId
        pair => usersDict.get(pair[0])  // pair[0] => userId
    );
}
