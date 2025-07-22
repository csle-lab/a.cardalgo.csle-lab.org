import Card from './card.js';
import Config from './config.js';
import Grid from './grid.js';
import Line from './line.js';
import SortPracticeStrict from './sort_practice_strict.js';
import CounterText from './counter_text.js';
import Utility from './utility.js';

export default class HeapSortPractice extends SortPracticeStrict {
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
                if (k == HeapSortPractice.maxLength) break;
            }
            if (k == HeapSortPractice.maxLength) break;
        }
    }

    build(array) {
        this.canvas.clearAll();
        for (var i = 0; i < HeapSortPractice.maxLength; i++) {
            var grid = new Grid(i);
            grid.setCoordinate(this.posX[i], this.posY[i]);
            this.canvas.addGrid(grid);
        }
        for (var i = 0; i < array.length; i++) {
            var card = new Card(array[i], 'gray', 'green');
            card.setCoordinate(626 + 4 * i, 120);
            card.moveImmediatelyTo(this.posX[i], this.posY[i] + 10);
            card.setSmallPinImage('shadow');
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
            var v = len++;
            a.push([array[i], i]);
            actions.push([
                ['open', new Set([i])],
                ['toggleLines', this.frameToLines(i)],
                ['showLine', this.cardsToDashLine(i, p(i))]
            ]);
            while (v > 0) {
                if (a[p(v)][0] < a[v][0]) {
                    actions.push([
                        ['compare', new Set([a[v][1], a[p(v)][1]])]
                    ]);
                    actions.push([
                        ['swap', new Set([i, a[p(v)][1]])],
                        ['showLine', this.cardsToSolidLine(v, p(v))],
                        ['clearLine', this.cardsToSolidLine(p(v), p(p(v)))]
                    ]);
                    [a[p(v)], a[v]] = [a[v], a[p(v)]];
                    v = p(v);
                }
                else {
                    actions.push([
                        ['compare', new Set([a[v][1], a[p(v)][1]])],
                        ['showLine', this.cardsToSolidLine(v, p(v))]
                    ]);
                    break;
                }
            }
        }

        this.mid = actions.length;

        // 後半
        for (var i = N - 1; i > 0; i--) {
            len--;
            var idx = a[len][1];
            actions.push([
                ['swap', new Set([a[0][1], a[i][1]])],
                (lc(0) < len ? ['clearLine', this.cardsToSolidLine(0, lc(0))] : ['skip']),
                (rc(0) < len ? ['clearLine', this.cardsToSolidLine(0, rc(0))] : ['skip']),
                ['toggleLines', this.frameToLines(i)],
                ['clearLine', this.cardsToDashLine(i, p(i))],
                ['clearLine', this.cardsToSolidLine(i, p(i))],
            ]);
            actions.push([
                ['fix', a[0][1]]
            ]);
            a[0] = a.pop();
            var v = 0;
            while (true) {
                if (len <= lc(v)) {
                    // 子がいない
                    break;
                }
                else if (len == rc(v)) {
                    // 子が 1 個
                    if (a[v][0] < a[lc(v)][0]) {
                        actions.push([
                            ['compare', new Set([a[v][1], a[lc(v)][1]])]
                        ]);
                        actions.push([
                            ['swap', new Set([a[v][1], a[lc(v)][1]])],
                            ['showLine', this.cardsToSolidLine(v, lc(v))],
                        ]);
                        [a[v], a[lc(v)]] = [a[lc(v)], a[v]];
                    }
                    else {
                        actions.push([
                            ['compare', new Set([a[v][1], a[lc(v)][1]])],
                            ['showLine', this.cardsToSolidLine(v, lc(v))]
                        ]);
                    }
                    break;
                }
                else {
                    // 子が 2 個
                    actions.push([
                        ['compare', new Set([a[lc(v)][1], a[rc(v)][1]])]
                    ]);
                    if (a[lc(v)][0] > a[rc(v)][0]) {
                        // 左の子との比較
                        if (a[v][0] > a[lc(v)][0]) {
                            // 終了
                            actions.push([
                                ['compare', new Set([a[v][1], a[lc(v)][1]])],
                                ['showLine', this.cardsToSolidLine(v, lc(v))],
                                ['showLine', this.cardsToSolidLine(v, rc(v))]
                            ]);
                            break;
                        }
                        else {
                            // スワップ発生
                            actions.push([
                                ['compare', new Set([a[v][1], a[lc(v)][1]])]
                            ]);
                            actions.push([
                                ['swap', new Set([a[v][1], a[lc(v)][1]])],
                                ['showLine', this.cardsToSolidLine(v, lc(v))],
                                ['showLine', this.cardsToSolidLine(v, rc(v))],
                                (lc(lc(v)) < len ? ['clearLine', this.cardsToSolidLine(lc(v), lc(lc(v)))] : ['skip']),
                                (rc(lc(v)) < len ? ['clearLine', this.cardsToSolidLine(lc(v), rc(lc(v)))] : ['skip'])
                            ]);
                            [a[v], a[lc(v)]] = [a[lc(v)], a[v]];
                            v = lc(v);
                        }
                    }
                    else {
                        // 右の子との比較
                        if (a[v][0] > a[rc(v)][0]) {
                            // 終了
                            actions.push([
                                ['compare', new Set([a[v][1], a[rc(v)][1]])],
                                ['showLine', this.cardsToSolidLine(v, lc(v))],
                                ['showLine', this.cardsToSolidLine(v, rc(v))]
                            ]);
                            break;
                        }
                        else {
                            // スワップ発生
                            actions.push([
                                ['compare', new Set([a[v][1], a[rc(v)][1]])]
                            ]);
                            actions.push([
                                ['swap', new Set([a[v][1], a[rc(v)][1]])],
                                ['showLine', this.cardsToSolidLine(v, lc(v))],
                                ['showLine', this.cardsToSolidLine(v, rc(v))],
                                (lc(rc(v)) < len ? ['clearLine', this.cardsToSolidLine(rc(v), lc(rc(v)))] : ['skip']),
                                (rc(rc(v)) < len ? ['clearLine', this.cardsToSolidLine(rc(v), rc(rc(v)))] : ['skip'])
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
            ['fix', idx],
            ['toggleLines', this.frameToLines(0)]
        ]);

        return actions;
    }

    next() {
        // 操作が 1 つ進んだときのヒント線の更新
        for (var i = 1; i < this.correctOperations[this.step].length; i++) {
            var action = this.correctOperations[this.step][i];
            if (action[0] == 'showLine') {
                if (action[1] >= 0) this.canvas.getLine(action[1]).show();
            }
            if (action[0] == 'clearLine') {
                if (action[1] >= 0) this.canvas.getLine(action[1]).clear();
            }
            if (action[0] == 'toggleLines') {
                for (var j of action[1]) {
                    this.canvas.getLine(j).toggle();
                }
            }
        }
    }

    turnCard(card) {
        // カードを 1 枚だけ開く操作もあるのでオーバーライドが必要
        card.turn();
        this.operationLog.push(['turnCard', card]);

        var operation = this.correctOperations[this.step][0];

        if (card.isOpen() && this.countOpen() == 1) {
            if (this.step < this.correctOperations.length
                && operation[0] == 'open'
                && Utility.compareSets(operation[1], this.getIndexOfCardsOpen())) {
                this.next();
                this.step++;
                this.operationLog.push(['stepForward']);
                this.detectCorrectOperation();
            }
        }

        if (this.countOpen() == 2) {
            if (this.step < this.correctOperations.length
                && operation[0] == 'open'
                && Utility.compareSets(operation[1], new Set([this.getIndexOfCard(card)]))) {
                this.next();
                this.step++;
                this.operationLog.push(['stepForward']);
                this.detectCorrectOperation();

                operation = this.correctOperations[this.step][0];
            }

            this.canvas.getText(0).countUp();
            this.operationLog.push(['comparePlus']);

            if (this.step < this.correctOperations.length
                && operation[0] == 'compare'
                && Utility.compareSets(operation[1], this.getIndexOfCardsOpen())) {
                this.next();
                this.step++;
                this.operationLog.push(['stepForward']);
                this.detectCorrectOperation();
            }
            else {
                this.detectWrongOperation();
            }
        }
    }

    swapCards(card, anotherCard) {
        var tmpX = card.getX(), tmpY = card.getY();
        card.moveImmediatelyTo(anotherCard.getX(), anotherCard.getY());
        anotherCard.moveImmediatelyTo(tmpX, tmpY);

        this.canvas.getText(1).countUp();

        this.operationLog.push(['swapCards', card, anotherCard]);

        var operation = this.correctOperations[this.step][0];

        if (this.step < this.correctOperations.length
            && operation[0] == 'swap'
            && Utility.compareSets(operation[1], new Set([this.getIndexOfCard(card), this.getIndexOfCard(anotherCard)]))) {
            this.next();
            this.step++;
            this.operationLog.push(['stepForward']);
            this.detectCorrectOperation();
        }
        else {
            this.detectWrongOperation();
        }
    }

    fixCard(card) {
        card.fix();
        this.operationLog.push(['fixCard', card]);

        var operation = this.correctOperations[this.step][0];

        if (this.step < this.correctOperations.length
            && operation[0] == 'fix'
            && operation[1] == this.getIndexOfCard(card)) {
            this.next();
            this.step++;
            this.operationLog.push(['stepForward']);
            this.detectCorrectOperation();
        }
        else {
            this.detectWrongOperation();
        }
    }

    back() {
        if (this.operationLog.length == 0) return;
        var operation = this.operationLog.pop();
        if (operation[0] == 'stepForward') {
            this.step--;
            this.prev();
            this.back();
        }
        if (operation[0] == 'comparePlus') {
            this.canvas.getText(0).countDown();
            this.back();
        }
        if (operation[0] == 'turnCard') {
            this.backTurnCard(operation[1]);
        }
        if (operation[0] == 'swapCards') {
            this.backSwapCards(operation[1], operation[2]);
        }
        if (operation[0] == 'fixCard') {
            this.backFixCard(operation[1]);
        }
        if (operation[0] == 'unfixCard') {
            this.backUnfixCard(operation[1]);
        }
    }

    prev() {
        for (var i = 1; i < this.correctOperations[this.step].length; i++) {
            var action = this.correctOperations[this.step][i];
            if (action[0] == 'showLine') {
                if (action[1] >= 0) this.canvas.getLine(action[1]).clear();
            }
            if (action[0] == 'clearLine') {
                if (action[1] >= 0) this.canvas.getLine(action[1]).show();
            }
            if (action[0] == 'toggleLines') {
                for (var j of action[1]) {
                    this.canvas.getLine(j).toggle();
                }
            }
        }
    }

    skipFirstHalf() {
        for (var i = 0; i < this.mid; i++) {
            if (this.correctOperations[this.step][0][0] == 'compare') {
                this.canvas.getText(0).countUp();
            }
            if (this.correctOperations[this.step][0][0] == 'swap') {
                var itr = this.correctOperations[this.step][0][1].values();
                var c1 = this.canvas.getCard(itr.next().value);
                var c2 = this.canvas.getCard(itr.next().value);
                var c1X = c1.getX(), c1Y = c1.getY();
                c1.moveImmediatelyTo(c2.getX(), c2.getY());
                c2.moveImmediatelyTo(c1X, c1Y);
                this.canvas.getText(1).countUp();
            }
            if (this.correctOperations[this.step][0][0] == 'fix') {
                var card = this.canvas.getCard(this.correctOperations[this.step][0][1]);
                card.fix();
            }
            this.next();
            this.step++;
        }
    }

}
