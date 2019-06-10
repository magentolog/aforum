function SmartMatrix() {
    var _this = this;
    var rows = {};
    var attributes = {};
    var selectedRowKeys = [];
    var selectedCellKeys = [];

    this.row = function (id) {
        if (!rows.hasOwnProperty(id)) {
            rows[id] = new SmartRow(_this);
        }
        return rows[id];
    };

    this.get = function (key) {
        return (attributes.hasOwnProperty(key)) ? attributes[key] : 0;
    };

    this.set = function (key, value) {
        attributes[key] = value;
    }

    this.setKeys = function (arrOfRowKeys = [], arrOfCellKeys = []) {
        selectedRowKeys = arrOfRowKeys.slice();
        selectedCellKeys = arrOfCellKeys.slice();
    }

    this.getValues = function (keys, callbackFn) {
        var rowKeys = (selectedRowKeys.length) ? selectedRowKeys.slice() : getRowKeys();
        var cellKeys = (selectedCellKeys.length) ? selectedCellKeys.slice() : getCellKeys(rowKeys);
        var matrix = rowKeys.map(i => cellKeys.map(j => {
            return _this.row(i).cell(j).getValue(keys, callbackFn);
        }));
        return matrix;
    }

    function getRowKeys() {
        var result = [];
        for (let key in rows) {
            result.push(key);
        }
        return result;
    }

    function getCellKeys(rowKeys) {
        var result = [];
        var keyDict = {};
        rowKeys.forEach(i => {
            _this.row(i).getKeys().forEach(newKey => keyDict[newKey] = 1);
        });
        for (let key in keyDict) {
            result.push(key);
        }
        return result;
    }
}

function SmartRow(owner) {
    var _this = this;
    var cells = {};
    var attributes = {};

    this.get = function (key) {
        return (attributes.hasOwnProperty(key)) ? attributes[key] : owner.get(key);
    };

    this.set = function (key, value) {
        attributes[key] = value;
    }

    this.cell = function (key) {
        if (!cells.hasOwnProperty(key)) {
            cells[key] = new SmartCell(_this);
        }
        return cells[key];
    };

    this.getKeys = function () {
        var result = [];
        for (let key in cells) {
            result.push(key);
        }
        return result;
    };
}

function SmartCell(owner) {
    var _this = this;
    var attributes = {};

    this.getValue = function (keys, callbackFn) {
        var values = keys.map(key => _this.get(key));
        return callbackFn(...values);
    };

    this.get = function (key) {
        return (attributes.hasOwnProperty(key)) ? attributes[key] : owner.get(key);
    };

    this.set = function (key, value) {
        attributes[key] = value;
    };
}

function SmartMatrixSpec() {
    var _this = this;
    this.testCreation = function () {
        console.log('testCreation');
        var sm = new SmartMatrix();
        var values = sm.getValues();
        if (values.length) {
            console.log(JSON.stringify(values));
            console.error('empty array is expected');
        }
    }

    this.testSetKeys = function () {
        console.log('testSetKeys');
        var sm = new SmartMatrix();
        sm.setKeys([1, 2, 3], [1, 2]);
        var values = sm.getValues([], () => 1);
        if (values.length !== 3) {
            console.log(JSON.stringify(values));
            console.error('expected array with 3 rows');
        }
        sm.setKeys([1, 2], [1, 2, 3]);
        var values = sm.getValues([], () => 1);
        if (values[0].length !== 3) {
            console.log(JSON.stringify(values));
            console.error('expected array with 3 rows');
        }
        sm = new SmartMatrix();
        sm.row(1).cell(1).set('a', 0);
        sm.row(2).cell(2).set('b', 0);
        sm.row('aaa').cell('2').set('c', 0);
        var value = sm.row(1).cell(1).get('a');
        var values = sm.getValues([], () => 0);
        if (values[2].length != 2) {
            console.log(JSON.stringify(values));
            console.error('expected array with 3 rows and 2 columns');
        }
    }

    this.testSetValue = function () {
        console.log('testSetValue');
        var sm = new SmartMatrix();
        sm.row(1).cell(1).set('a', 22);
        sm.row(1).cell(1).set('b', 33);
        sm.row(1).cell(1).set('b', 44);
        var value22 = sm.row(1).cell(1).get('a');
        var value44 = sm.row(1).cell(1).get('b');
        if ((value22 != 22) || (value44 != 44)) {
            console.log(value22, value44);
            console.error('expected 22 and 44');
        }
    }

    this.testGetValue = function () {
        console.log('testGetValue');
        var sm = new SmartMatrix();
        sm.row(1).cell(1).set('a', 1);
        sm.row(1).cell(1).set('b', 2);
        sm.row(1).cell(1).set('c', 4);
        var value1024 = sm.row(1).cell(1).getValue(['a', 'b', 'c'], (a, b, c) => {
            return a * 1000 + b * 10 + c;
        });
        if ((value1024 != 1024)) {
            console.log(value1024);
            console.error('expected 1024');
        }
    }

    this.testGetValues = function () {
        console.log('testGetValues');
        var sm = new SmartMatrix();
        sm.setKeys([1, 2, 3], [1, 2]);
        sm.row(1).cell(1).set('a', 2);
        sm.row(1).cell(1).set('b', 3);
        sm.row(1).cell(1).set('c', 4);
        var values = sm.getValues(['a', 'b', 'c'], (a, b, c) => {
            if (a == 0 && b == 0 && c == 0) return 10;
            return a * 1000 + b * 10 + c;
        });
        if ((values[0][0] != 2034) || (values[2][1] != 10)) {
            console.log(JSON.stringify(values));
            console.error('expected 2034 and 10');
        }
    }

    this.testInheritedValues = function () {
        console.log('testInheritedValues');
        var sm = new SmartMatrix();
        sm.set('a', 1);
        sm.row(1).set('a', 2);
        sm.row(1).cell(1).set('a', 3);
        sm.setKeys([1, 2], [1, 2, 3]);
        var values = sm.getValues(['a'], (a) => {
            return a;
        });
        var realValue = JSON.stringify(values)
        var expectedValue = '[[3,2,2],[1,1,1]]';
        if (realValue != expectedValue) {
            console.log(realValue);
            console.error('expected: ' + expectedValue);
        }
    }

    this.runAllTests = function () {
        console.log('SmartMatrix Tests => {');
        _this.testCreation();
        _this.testSetKeys();
        _this.testSetValue();
        _this.testGetValue();
        _this.testGetValues();
        _this.testInheritedValues();
        console.log('} ');
    }
}
