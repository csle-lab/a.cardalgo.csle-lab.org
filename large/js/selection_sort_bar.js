import SortAnimationBar from './sort_animation_bar.js';

export default class SelectionSortBar extends SortAnimationBar {
    constructor(id, compare_id, swap_id) {
        super(id, compare_id, swap_id);
    }

    build(array) {
        var n = array.length;

        document.getElementById(this.id).innerHTML = '';
        for (var a of array) {
            document.getElementById(this.id).innerHTML += `<div class="box"><span class="inner_box" style="height: ${String(a / 50)}vh"></span><span class="inner_text">${String(a)}</span></div>`;
        }

        var t = 1;
        var a = document.getElementById(this.id).getElementsByClassName('box');
        var self = this;

        for (var i = 0; i < n; i++) {
            this.setAnimation(function (i) {
                a[i].className = 'box marked';
            }, t, i);
            var idx = i;

            for (var j = i + 1; j < n; j++) {
                this.setAnimation(function (j) {
                    a[j].className = 'box marked';
                    self.compareCountUp();
                }, t++, j);

                if (array[idx] > array[j]) {
                    this.setAnimation(function (idx) {
                        a[idx].className = 'box';
                    }, t++, idx);
                    idx = j;
                }
                else {
                    this.setAnimation(function (j) {
                        a[j].className = 'box';
                    }, t++, j);
                }
            }

            [array[i], array[idx]] = [array[idx], array[i]];
            this.swap(a[i], a[idx], t);
            t += 5;
            this.setAnimation(function (i, idx) {
                a[idx].className = 'box';
                a[i].className = 'box fixed';
                if (i != idx) self.swapCountUp();
            }, t, i, idx);
        }
    }
}
