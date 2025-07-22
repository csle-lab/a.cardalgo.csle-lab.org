import Card from './card.js';
import Config from './config.js';
import Grid from './grid.js';
import SortPractice from './sort_practice.js';
import CounterText from './counter_text.js';

export default class TreeSortPractice extends SortPractice {
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
                if (k == TreeSortPractice.maxLength) break;
            }
            if (k == TreeSortPractice.maxLength) break;
        }
    }

    build(array) {
        this.canvas.clearAll();
        for (var i = 0; i < TreeSortPractice.maxLength; i++) {
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
    }
}
