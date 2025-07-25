import Card from './card.js';
import Config from './config.js';
import Grid from './grid.js';
import SortAnimation from './sort_animation.js';
import Text from './text.js';
import CounterText from './counter_text.js';

export default class ArraySortAnimation extends SortAnimation {
    static maxLength = 7;

    constructor(canvas) {
        super(canvas);

        this.posX = [];
        this.posY = [];
        for (var i = 0; i < ArraySortAnimation.maxLength; i++) {
            this.posX.push(100 + 180 * i);
            this.posY.push(400);
        }
    }

    build(array) {
        this.canvas.clearAll();
        for (var i = 0; i < ArraySortAnimation.maxLength; i++) {
            var grid = new Grid(i);
            grid.setCoordinate(this.posX[i], this.posY[i]);
            this.canvas.addGrid(grid);
        }
        for (var i = 0; i < array.length; i++) {
            var card = new Card(array[i], this.getCardColor(), 'green');
            card.setCoordinate(626 + 4 * i, 120);
            card.moveImmediatelyTo(this.posX[i], this.posY[i] + 10);
            this.canvas.addCard(card);
        }
        var compareText = new CounterText(`${Config.wordCompare}: <counter> ${Config.wordTime}`);
        compareText.setCoordinate(640, 640);
        this.canvas.addText(compareText);
        var swapText = new CounterText(`${Config.wordSwap}: <counter> ${Config.wordTime}`);
        swapText.setCoordinate(640, 680);
        this.canvas.addText(swapText);
        var smallText = new Text();
        smallText.setText(`${Config.wordSmall}`);
        smallText.setCoordinate(16, 560);
        smallText.setTextAlign('left');
        smallText.setFont('24px Noto Sans JP');
        this.canvas.addText(smallText);
        var largeText = new Text();
        largeText.setText(`${Config.wordLarge}`);
        largeText.setCoordinate(1264, 560);
        largeText.setTextAlign('right');
        largeText.setFont('32px Noto Sans JP');
        this.canvas.addText(largeText);
    }

    calculateActions() {
        // オーバーライドすべき
    }

    getCardColor() {
        return 'gray';
    }
}