import ArraySortAnimation from './array_sort_animation.js';

export default class BubbleSortAnimation extends ArraySortAnimation {
    constructor(canvas) {
        super(canvas);
    }

    getCardColor() {
        return 'blue';
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
                actions.push([
                    ['turnCard', a[j][1]],
                    ['turnCard', a[j + 1][1]],
                    ['compare']
                ]);
                if (a[j][0] > a[j + 1][0]) {
                    actions.push([
                        ['swapCards', a[j][1], a[j + 1][1]],
                        ['swap']
                    ]);
                    [a[j], a[j + 1]] = [a[j + 1], a[j]];
                }
                actions.push([
                    ['turnCard', a[j][1]],
                    ['turnCard', a[j + 1][1]]
                ]);
            }
            actions.push([
                ['fixCard', a[N - 1 - i][1]]
            ]);
        }
        return actions;
    }
}