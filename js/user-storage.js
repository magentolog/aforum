function UserStorage() {
    var _this = this;
    var users = [
        { id: 1, name: 'Alex', position: 'Praktikant', base_priority: '1' },
        { id: 2, name: 'Björn', position: 'Mitarbeiter', base_priority: '4' },
        { id: 3, name: 'Dominik', position: 'Mitarbeiter', base_priority: '4' },
        { id: 4, name: 'Lasse', position: 'Student', base_priority: '2' },
        { id: 5, name: 'Marvin', position: 'Mitarbeiter', base_priority: '3' },
        { id: 6, name: 'Patrick', position: 'Praktikant', base_priority: '1' },
        { id: 7, name: 'Robin', position: 'Student', base_priority: '2' },
        { id: 8, name: 'Thilo', position: 'Student', base_priority: '2' },
        { id: 9, name: 'Tim', position: 'Praktikant', base_priority: '1' },
    ];

    this.getAll = function () {
        return users;
    };

    this.get = function (userIds) {
        var result = [];
        userIds.forEach(id => {
            var filtered = users.filter(user => user.id == id);
            if (filtered.length) {
                result.push(filtered[0]);
            }
        });
        return result;
    };
}