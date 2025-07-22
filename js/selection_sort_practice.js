import ArraySortPracticeStrict from './array_sort_practice_strict.js';

export default class SelectionSortPractice extends ArraySortPracticeStrict {
    constructor(canvas) {
        super(canvas);
    }

    calculateActions(array) {
        var N = array.length;
        var a = [];
        for (var i = 0; i < N; i++) {
            a.push([array[i], i]);
        }
        var actions = [];
        for (var i = 0; i < N - 1; i++) {
            var idx = i;
            for (var j = i + 1; j < N; j++) {
                actions.push(
                    ['compare', new Set([a[idx][1], a[j][1]])]
                );
                if (a[idx][0] > a[j][0]) {
                    idx = j;
                }
            }
            if (i != idx) {
                actions.push(
                    ['swap', new Set([a[i][1], a[idx][1]])]
                );
                [a[i], a[idx]] = [a[idx], a[i]];
            }
            actions.push(
                ['fix', a[i][1]]
            );
        }
        actions.push(
            ['fix', a[N - 1][1]]
        );
        return actions;
    }
}