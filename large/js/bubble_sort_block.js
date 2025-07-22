import SortAnimationBlock from './sort_animation_block.js';

export default class BubbleSortBlock extends SortAnimationBlock {
    constructor(id, compare_id, swap_id) {
        super(id, compare_id, swap_id);
    }

    build(array) {
        var n = array.length;

        document.getElementById(this.id).innerHTML = '';
        for (var a of array) {
            document.getElementById(this.id).innerHTML += '<div class="box">' + String(a) + '</div>';
        }

        var t = 1;
        var a = document.getElementById(this.id).getElementsByClassName('box');
        var self = this;

        for (var i = 0; i < n; i++) {
            for (var j = n - 2; j >= i; j--) {
                this.setAnimation(function (j) {
                    a[j].className = 'box marked';
                    a[j + 1].className = 'box marked';
                    self.compareCountUp();
                }, t++, j);

                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    this.setAnimation(function (j) {
                        [a[j].innerHTML, a[j + 1].innerHTML] = [a[j + 1].innerHTML, a[j].innerHTML];
                        self.swapCountUp();
                    }, t++, j);
                }

                this.setAnimation(function (j) {
                    a[j].className = 'box';
                    a[j + 1].className = 'box';
                }, t++, j);
            }

            this.setAnimation(function (i) {
                a[i].className = 'box fixed';
            }, t++, i);
        }
    }
}
