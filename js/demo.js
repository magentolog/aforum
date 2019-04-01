function FloorPlanDemo(canvas, reservationDialog) {
    var _this = this;
    //var users = ['Patrick', 'Lasse', 'Thilo', 'Robin', 'Björn', 'Svenja', 'Julia', 'John', 'Praktikant', 'Andre', 'Timm', 'Alex', 'Jane', 'Jimm', 'Praktikant'];

    init();
    function init() {
        showUsers();
        $("#accordion").accordion({
            heightStyle: "content",
        });
    }

    function showUsers() {
        $("#accordion").html("");
        users.forEach(user => {
            var html = "<h3>" + user.name + "</h3><div><p>" + user.type + " (priority: " + user.priority + ") </p></div>";
            $("#accordion").append(html);
        });
    }

    this.run = function () {
        showNextDay();
    }

    function rnd(max) {
        return Math.floor(Math.random() * max); // return random integer value 0..max
    }

    function getRandomUser() {
        var n = users.length;
        return users[rnd(n)];
    }

    function getRandomDate() {
        return new Date();
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