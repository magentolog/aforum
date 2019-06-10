function UserService() {
    var _this = this;
    var userStorage = new UserStorage();

    this.getAll = function () {
        return userStorage.getAll();
    };

    this.get = function (userIdOrIds = null) {
        if (!userIdOrIds) {
            return userStorage.getAll();
        } 
        if (!Array.isArray(userIdOrIds)) {
            userIdOrIds = [userIdOrIds];
        }
        return userStorage.get(userIdOrIds);
    };
}