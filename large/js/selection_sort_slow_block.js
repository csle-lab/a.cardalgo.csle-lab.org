import SortAnimationBlock from './sort_animation_block.js';

export default class SelectionSortSlowBlock extends SortAnimationBlock {
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
            this.setAnimation(function (i) {
                a[i].className = 'box marked';
            }, t, i);

            for (var j = i + 1; j < n; j++) {
                this.setAnimation(function (j) {
                    a[j].className = 'box marked';
                    self.compareCountUp();
                }, t++, j);

                if (array[i] > array[j]) {
                    [array[i], array[j]] = [array[j], array[i]];
                    this.setAnimation(function (i, j) {
                        [a[i].innerHTML, a[j].innerHTML] = [a[j].innerHTML, a[i].innerHTML];
                        self.swapCountUp();
                    }, t++, i, j);
                }

                this.setAnimation(function (j) {
                    a[j].className = 'box';
                }, t++, j);
            }

            this.setAnimation(function (i) {
                a[i].className = 'box fixed';
            }, t++, i);
        }
    }
}
