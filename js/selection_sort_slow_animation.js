import ArraySortAnimation from './array_sort_animation.js';

export default class SelectionSortSlowAnimation extends ArraySortAnimation {
    constructor(canvas) {
        super(canvas);
    }

    getCardColor() {
        return 'red';
    }

    calculateActions(array) {
        var N = array.length;
        var a = [];
        for (var i = 0; i < N; i++) {
            a.push([array[i], i]);
        }
        var actions = [];
        for (var i = 0; i < N - 1; i++) {
            actions.push([
                ['turnCard', a[i][1]]
            ]);
            for (var j = i + 1; j < N; j++) {
                actions.push([
                    ['turnCard', a[j][1]],
                    ['compare']
                ]);
                if (a[i][0] > a[j][0]) {
                    actions.push([
                        ['swapCards', a[i][1], a[j][1]],
                        ['swap']
                    ]);
                    [a[i], a[j]] = [a[j], a[i]];
                }
                actions.push([
                    ['turnCard', a[j][1]]
                ]);
            }
            actions.push([
                ['turnCard', a[i][1]],
            ]);
            actions.push([
                ['fixCard', a[i][1]]
            ]);
        }
        actions.push([
            ['fixCard', a[N - 1][1]]
        ]);
        return actions;
    }
}