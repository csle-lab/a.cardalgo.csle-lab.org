import SortPractice from './sort_practice.js';
import Utility from './utility.js';

export default class SortPracticeStrict extends SortPractice {
    constructor(canvas) {
        super(canvas);

        this.correctOperations = [];
        this.step = 0;
    }

    set(array) {
        super.set(array);

        this.correctOperations = this.calculateActions(array);
        this.step = 0;
    }

    turnCard(card) {
        card.turn();
        this.operationLog.push(['turnCard', card]);

        if (this.countOpen() == 2) {
            if (this.step - 1 >= 0
                && (this.correctOperations[this.step - 1][0] == 'compare' || this.correctOperations[this.step - 1][0] == 'swap')
                && Utility.compareSets(this.correctOperations[this.step - 1][1], this.getIndexOfCardsOpen())) {
                return;
            }

            this.canvas.getText(0).countUp();
            this.operationLog.push(['comparePlus']);

            if (this.step < this.correctOperations.length
                && this.correctOperations[this.step][0] == 'compare'
                && Utility.compareSets(this.correctOperations[this.step][1], this.getIndexOfCardsOpen())) {
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

        if (this.step < this.correctOperations.length
            && this.correctOperations[this.step][0] == 'swap'
            && Utility.compareSets(this.correctOperations[this.step][1], new Set([this.getIndexOfCard(card), this.getIndexOfCard(anotherCard)]))) {
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

        if (this.step < this.correctOperations.length
            && this.correctOperations[this.step][0] == 'fix'
            && this.correctOperations[this.step][1] == this.getIndexOfCard(card)) {
            this.step++;
            this.operationLog.push(['stepForward']);
            this.detectCorrectOperation();
        }
        else {
            this.detectWrongOperation();
        }
    }

    unfixCard(card) {
        card.unfix();
        this.operationLog.push(['unfixCard', card]);
        this.detectWrongOperation();
    }

    detectCorrectOperation() {

    }

    detectWrongOperation() {
        setTimeout(function () {
            this.back();
            this.canvas.addCross(640, 360).setSize(40, 400);
        }.bind(this), 200);
    }

    back() {
        if (this.operationLog.length == 0) return;
        var operation = this.operationLog.pop();
        if (operation[0] == 'stepForward') {
            this.step--;
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

    backTurnCard(card) {
        card.turn();
    }

    backSwapCards(card, anotherCard) {
        var tmpX = card.getX(), tmpY = card.getY();
        card.moveTo(anotherCard.getX(), anotherCard.getY());
        anotherCard.moveTo(tmpX, tmpY);

        this.canvas.getText(1).countDown();
    }

    backFixCard(card) {
        card.unfix();
    }

    backUnfixCard(card) {
        card.fix();
    }

    begin() {
        while (this.operationLog.length > 0) this.back();
    }

    build() {
        // オーバーライドすべき
    }

    calculateActions() {
        // 操作列を構成
    }
}
