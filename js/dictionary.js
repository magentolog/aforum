Array.prototype.createDictionary = function (isArray, getKeyFn, getValueFn) {
    var hashTable = {};
    this.forEach(item => {
        var key = getKeyFn(item);
        var value = getValueFn(item);
        if (isArray) {
            (hashTable[key] = hashTable[key] || []).push(value);
        } else {
            hashTable[key] = value;
        }
    });

    hashTable.get = function (keyValue) {
        if (this.hasOwnProperty(keyValue)) {
            return this[keyValue];
        } else {
            return (isArray) ? [] : false;
        }
    };

    hashTable.keys = function () {
        var result = [];
        for (let x in this) {
            if (typeof this[x] !== 'function') {
                result.push(x);
            }
        }
        return result;
    };

    hashTable.forEach = function (callbackFn) {
        for (let x in this) {
            if (typeof this[x] !== 'function') {
                callbackFn(this[x], x);
            }
        }
    };

    return hashTable;
};

function createSingleValueDictionary(arr, keyName) {
    return arr.createDictionary(false,
        item => item[keyName],
        item => Object.assign({}, item)
    );
}


function createManyValueDictionary(arr, keyName) {
    return arr.createDictionary(true,
        item => item[keyName],
        item => Object.assign({}, item)
    );
}