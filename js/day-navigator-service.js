function DayNavigatorService(timeTable, absTable) {
    var _this = this;

    this.getPrevDate = function (thisDate) {
        var arr = getDayArray();
        arr.reverse(); // important! array must be reverse sorted 
        var t = thisDate.getTime();
        var prevDate = arr.find((date) => date < t);
        if (!prevDate) {
            var n = arr.length;
            prevDate = (n > 0) ? arr[n - 1] : Date.now();
        }
        return new Date(prevDate);
    }

    this.getNextDate = function (thisDate) {
        var arr = getDayArray();
        var t = thisDate.getTime();
        var nextDate = arr.find((date) => date > t);
        if (!nextDate) {
            var n = arr.length;
            nextDate = (n > 0) ? arr[n - 1] : Date.now();
        }
        return new Date(nextDate);
    }

    function getDayArray() {
        var arr1 = timeTable.getDayArray();
        var arr2 = absTable.getDayArray();
        var arr = arr1.concat(arr2);
        arr.sort();
        var resultArr = arr.filter((value, index, self) => { return self.indexOf(value) === index });
        return resultArr;
    }
}