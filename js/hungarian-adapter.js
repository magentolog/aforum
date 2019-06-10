const HUNGARIAN_ON3 = 1;
const MUNKRES = 2;

function HungarianAdapter(algType = 2) {
    this.execute = function (profitMatrix) {
        if (!profitMatrix.length) {
            return [];
        }
        var lowCostMatrix = getInverted(profitMatrix);
        switch (algType) {
            case HUNGARIAN_ON3: return runHungarianOn3(lowCostMatrix);
            case MUNKRES: return runMunkres(lowCostMatrix);
        }
    }

    function runHungarianOn3(matrix) {
        return hungarianOn3(matrix);
    }

    function runMunkres(matrix) {
        var munkres = new Munkres();
        var indices = munkres.compute(matrix);
        var results = matrix.map((row,i)=>[i,-1]);
        indices.forEach(pair => {
            var i = pair[0];
            var value = pair[1];
            results[i] = [i, value];
        });
        return results;
    }

    function getInverted(matrix) {
        // find biggest value;
        var biggest = matrix.reduce((prevMax, row) => Math.max(prevMax, ...row), -Infinity);
        console.log(biggest);
        // clone and invert
        var clone = matrix.map(row => row.map(value => biggest - value));
        console.log(clone);
        return clone;
    }
}   