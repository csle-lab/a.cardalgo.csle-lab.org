import Card from './card.js';
import Config from './config.js';
import Grid from './grid.js';
import SortAnimation from './sort_animation.js';
import CounterText from './counter_text.js';
import Line from './line.js';

export default class HeapSortAnimation extends SortAnimation {
    static maxLength = 7;

    constructor(canvas) {
        super(canvas);

        this.posX = [];
        this.posY = [];
        var k = 0;
        for (var i = 0; ; i++) {
            for (var j = 0; j < Math.pow(2, i); j++) {
                this.posX.push(400 + (720 / Math.pow(2, i) * j) + 720 / Math.pow(2, i) / 2);
                this.posY.push(122 + 238 * i);
                k++;
                if (k == HeapSortAnimation.maxLength) break;
            }
            if (k == HeapSortAnimation.maxLength) break;
        }
    }

    build(array) {
        this.canvas.clearAll();
        for (var i = 0; i < HeapSortAnimation.maxLength; i++) {
            var grid = new Grid(i);
            grid.setCoordinate(this.posX[i], this.posY[i]);
            this.canvas.addGrid(grid);
        }
        for (var i = 0; i < array.length; i++) {
            var card = new Card(array[i], 'green', 'red');
            card.setCoordinate(160 + 4 * i, 120);
            card.moveImmediatelyTo(this.posX[i], this.posY[i] + 10);
            this.canvas.addCard(card);
        }
        var compareText = new CounterText(`${Config.wordCompare}: <counter> ${Config.wordTime}`);
        compareText.setCoordinate(200, 640);
        this.canvas.addText(compareText);
        var swapText = new CounterText(`${Config.wordSwap}: <counter> ${Config.wordTime}`);
        swapText.setCoordinate(200, 680);
        this.canvas.addText(swapText);

        for (var i = 0; i < 37; i++) this.canvas.addLine(new Line());
        var lines = this.canvas.getLines();
        var k = 0;
        for (var i = 0; i < 3; i++) {
            for (var j = 2 * i + 1; j <= 2 * i + 2; j++) {
                lines[k].clear();
                lines[k].setCoordinate(this.posX[i], this.posY[i], this.posX[j], this.posY[j]);
                lines[k].setColor('rgb(200, 200, 200)');
                lines[k].dash = true;
                k++;
            }
        }
        k = 6;
        for (var i = 0; i < 3; i++) {
            for (var j = 2 * i + 1; j <= 2 * i + 2; j++) {
                lines[k].clear();
                lines[k].setCoordinate(this.posX[i], this.posY[i], this.posX[j], this.posY[j]);
                k++;
            }
        }
        k = 12;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < Math.pow(2, i); j++) {
                lines[k].setColor('rgb(255, 100, 100)');
                lines[k].clear();
                lines[k].setCoordinate(400 + 720 / Math.pow(2, i) * j, 2 + 240 * i, 400 + 720 / Math.pow(2, i) * (j + 1), 2 + 240 * i);
                k++;
            }
            if (i == 3) break;
            for (var j = 0; j <= Math.pow(2, i); j++) {
                lines[k].setColor('rgb(255, 100, 100)');
                lines[k].clear();
                lines[k].setCoordinate(400 + 720 / Math.pow(2, i) * j, 2 + 240 * i, 400 + 720 / Math.pow(2, i) * j, 2 + 240 * (i + 1));
                k++;
            }
        }
    }

    cardsToDashLine(a, b) {
        if (a > b) [a, b] = [b, a];
        if (b - 1 < 0 || 6 <= b - 1) return -1;
        return b - 1;
    }

    cardsToSolidLine(a, b) {
        if (a > b) [a, b] = [b, a];
        if (b - 1 < 0 || 6 <= b - 1) return -1;
        return 6 + b - 1;
    }

    frameToLines(n) {
        var i = Math.floor(Math.log2(n + 1));
        var j = n - Math.pow(2, i) + 1;
        return [
            12 + Math.pow(2, i) * 2 + i - 2 + j,
            12 + Math.pow(2, i) * 3 + i - 2 + j,
            12 + Math.pow(2, i) * 3 + i - 2 + j + 1,
            12 + Math.pow(2, i) * 4 + i - 2 + j * 2 + 1,
            12 + Math.pow(2, i) * 4 + i - 2 + j * 2 + 2,
        ];
    }

    skipFirstHalf() {
        console.log("yay");
        for (var i = 0; i < this.mid; i++) {
            this.advance();
            this.actions.shift();
            this.step = 0;
        }
    }

    calculateActions(array) {
        var N = array.length;
        var actions = [];

        var a = [];
        var len = 0;

        const lc = function (n) {
            return 2 * n + 1;
        };
        const rc = function (n) {
            return 2 * n + 2;
        };
        const p = function (n) {
            return Math.floor((n - 1) / 2);
        }

        // 前半
        for (var i = 0; i < N; i++) {
            actions.push([
                ['markCard', i],
                ['frameCard', i]
            ]);
            actions.push([
                ['turnCard', i],
                ['toggleLines', this.frameToLines(i)],
                ['showLine', this.cardsToDashLine(i, p(i))]
            ]);
            var v = len++;
            a.push([array[i], i]);
            while (v > 0) {
                actions.push([
                    ['markCard', a[p(v)][1]]
                ]);
                actions.push([
                    ['turnCard', a[p(v)][1]],
                    ['compare']
                ]);
                if (a[p(v)][0] < a[v][0]) {
                    actions.push([
                        ['swapCards', i, a[p(v)][1]],
                        ['showLine', this.cardsToSolidLine(v, p(v))],
                        ['clearLine', this.cardsToSolidLine(p(v), p(p(v)))],
                        ['swap']
                    ]);
                    actions.push([
                        ['turnCard', a[p(v)][1]],
                        ['unmarkCard', a[p(v)][1]]
                    ]);
                    [a[p(v)], a[v]] = [a[v], a[p(v)]];
                    v = p(v);
                }
                else {
                    actions.push([
                        ['turnCard', a[p(v)][1]],
                        ['unmarkCard', a[p(v)][1]],
                        ['showLine', this.cardsToSolidLine(v, p(v))]
                    ]);
                    break;
                }
            }
            actions.push([
                ['turnCard', i],
                ['unmarkCard', i],
                ['frameCard', i]
            ]);
        }

        this.mid = actions.length;

        // 後半
        for (var i = N - 1; i > 0; i--) {
            len--;
            var idx = a[len][1];
            actions.push([
                ['markCard', a[0][1]],
                ['markCard', a[i][1]],
                ['frameCard', a[i][1]]
            ]);
            actions.push([
                ['swapCards', a[0][1], a[i][1]],
                (lc(0) < len ? ['clearLine', this.cardsToSolidLine(0, lc(0))] : ['skip']),
                (rc(0) < len ? ['clearLine', this.cardsToSolidLine(0, rc(0))] : ['skip']),
                ['toggleLines', this.frameToLines(i)],
                ['clearLine', this.cardsToDashLine(i, p(i))],
                ['clearLine', this.cardsToSolidLine(i, p(i))],
                ['swap']
            ]);
            actions.push([
                ['fixCard', a[0][1]],
                ['unmarkCard', a[0][1]],
                ['unmarkCard', a[i][1]]
            ]);
            a[0] = a.pop();
            var v = 0;
            while (true) {
                if (len <= lc(v)) {
                    // 子がいない
                    actions.push([
                        ['frameCard', idx]
                    ]);
                    break;
                }
                else if (len == rc(v)) {
                    // 子が 1 個
                    actions.push([
                        ['markCard', a[v][1]],
                        ['markCard', a[lc(v)][1]]
                    ]);
                    actions.push([
                        ['turnCard', a[v][1]],
                        ['turnCard', a[lc(v)][1]],
                        ['compare']
                    ]);
                    if (a[v][0] < a[lc(v)][0]) {
                        actions.push([
                            ['swapCards', a[v][1], a[lc(v)][1]],
                            ['showLine', this.cardsToSolidLine(v, lc(v))],
                            ['swap']
                        ]);
                        [a[v], a[lc(v)]] = [a[lc(v)], a[v]];
                    }
                    else {
                        actions.push([
                            ['showLine', this.cardsToSolidLine(v, lc(v))]
                        ]);
                    }
                    actions.push([
                        ['turnCard', a[v][1]],
                        ['turnCard', a[lc(v)][1]],
                        ['unmarkCard', a[v][1]],
                        ['unmarkCard', a[lc(v)][1]],
                        ['frameCard', idx]
                    ]);
                    break;
                }
                else {
                    // 子が 2 個
                    actions.push([
                        ['markCard', a[lc(v)][1]],
                        ['markCard', a[rc(v)][1]]
                    ]);
                    actions.push([
                        ['turnCard', a[lc(v)][1]],
                        ['turnCard', a[rc(v)][1]],
                        ['compare']
                    ]);
                    if (a[lc(v)][0] > a[rc(v)][0]) {
                        // 左の子との比較
                        actions.push([
                            ['turnCard', a[rc(v)][1]],
                            ['unmarkCard', a[rc(v)][1]],
                            ['markCard', a[v][1]]
                        ]);
                        actions.push([
                            ['turnCard', a[v][1]],
                            ['compare']
                        ]);
                        if (a[v][0] > a[lc(v)][0]) {
                            // 終了
                            actions.push([
                                ['turnCard', a[v][1]],
                                ['turnCard', a[lc(v)][1]],
                                ['showLine', this.cardsToSolidLine(v, lc(v))],
                                ['showLine', this.cardsToSolidLine(v, rc(v))],
                                //['unmarkCard', a[v][1]],
                                //['unmarkCard', a[lc(v)][1]],
                                ['frameCard', idx]
                            ]);
                            break;
                        }
                        else {
                            // スワップ発生
                            actions.push([
                                ['swapCards', a[v][1], a[lc(v)][1]],
                                ['showLine', this.cardsToSolidLine(v, lc(v))],
                                ['showLine', this.cardsToSolidLine(v, rc(v))],
                                (lc(lc(v)) < len ? ['clearLine', this.cardsToSolidLine(lc(v), lc(lc(v)))] : ['skip']),
                                (rc(lc(v)) < len ? ['clearLine', this.cardsToSolidLine(lc(v), rc(lc(v)))] : ['skip']),
                                ['swap']
                            ]);
                            actions.push([
                                ['turnCard', a[v][1]],
                                ['turnCard', a[lc(v)][1]],
                                ['unmarkCard', a[v][1]],
                                ['unmarkCard', a[lc(v)][1]]
                            ]);
                            [a[v], a[lc(v)]] = [a[lc(v)], a[v]];
                            v = lc(v);
                        }
                    }
                    else {
                        // 右の子との比較
                        actions.push([
                            ['turnCard', a[lc(v)][1]],
                            ['unmarkCard', a[lc(v)][1]],
                            ['markCard', a[v][1]]
                        ]);
                        actions.push([
                            ['turnCard', a[v][1]],
                            ['compare']
                        ]);
                        if (a[v][0] > a[rc(v)][0]) {
                            // 終了
                            actions.push([
                                ['turnCard', a[v][1]],
                                ['turnCard', a[rc(v)][1]],
                                ['showLine', this.cardsToSolidLine(v, lc(v))],
                                ['showLine', this.cardsToSolidLine(v, rc(v))],
                                ['unmarkCard', a[v][1]],
                                ['unmarkCard', a[rc(v)][1]],
                                ['frameCard', idx]
                            ]);
                            break;
                        }
                        else {
                            // スワップ発生
                            actions.push([
                                ['swapCards', a[v][1], a[rc(v)][1]],
                                ['showLine', this.cardsToSolidLine(v, lc(v))],
                                ['showLine', this.cardsToSolidLine(v, rc(v))],
                                (lc(rc(v)) < len ? ['clearLine', this.cardsToSolidLine(rc(v), lc(rc(v)))] : ['skip']),
                                (rc(rc(v)) < len ? ['clearLine', this.cardsToSolidLine(rc(v), rc(rc(v)))] : ['skip']),
                                ['swap']
                            ]);
                            actions.push([
                                ['turnCard', a[v][1]],
                                ['turnCard', a[rc(v)][1]],
                                ['unmarkCard', a[v][1]],
                                ['unmarkCard', a[rc(v)][1]]
                            ]);
                            [a[v], a[rc(v)]] = [a[rc(v)], a[v]];
                            v = rc(v);
                        }
                    }
                }
            }
        }

        len--;
        var idx = a[len][1];
        a = [];
        actions.push([
            ['markCard', idx],
            ['frameCard', idx]
        ]);
        actions.push([
            ['toggleLines', this.frameToLines(0)],
            ['fixCard', idx],
            ['unmarkCard', idx],
            ['frameCard', idx]
        ]);

        return actions;
    }
}
