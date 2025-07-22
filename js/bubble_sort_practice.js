import ArraySortPracticeStrict from './array_sort_practice_strict.js';

export default class BubbleSortPractice extends ArraySortPracticeStrict {
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
        for (var i = N - 1; i >= 0; i--) {
            for (var j = N - 2; j >= N - 1 - i; j--) {
                actions.push(
                    ['compare', new Set([a[j][1], a[j + 1][1]])]
                );
                if (a[j][0] > a[j + 1][0]) {
                    actions.push(
                        ['swap', new Set([a[j][1], a[j + 1][1]])]
                    );
                    [a[j], a[j + 1]] = [a[j + 1], a[j]];
                }
            }
            actions.push(
                ['fix', a[N - 1 - i][1]]
            );
        }
        return actions;
    }
}