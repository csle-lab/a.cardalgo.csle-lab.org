import SortAnimationBlock from './sort_animation_block.js';

export default class HeapSortBlock extends SortAnimationBlock {
    constructor(id, compare_id, swap_id) {
        super(id, compare_id, swap_id);
    }

    build(array) {
        var n = array.length;
        const sizeOfBox = 54;

        document.getElementById(this.id).innerHTML = '';
        var height = Math.floor(Math.log2(n)) + 1;
        for (var i = 0; i < n; i++) {
            var numOfTheHeight = (Math.pow(2, (height - Math.floor(Math.log2(i + 1)) - 1)));
            document.getElementById(this.id).innerHTML += '<div class="box" style="margin: 4px ' + String(
                ((sizeOfBox + 10) * numOfTheHeight - 10 - sizeOfBox) / 2 + 4
            ) + 'px">' + String(array[i]) + '</div>';
            if (Math.floor(Math.log2(i + 1)) != Math.floor(Math.log2(i + 2))) {
                document.getElementById(this.id).innerHTML += '<br />';
            }
        }

        var t = 1;
        var a = document.getElementById(this.id).getElementsByClassName('box');
        var self = this;

        for (var i = 0; i < n; i++) {
            this.setAnimation(function (k) {
                a[k].className = 'box tree';
            }, t++, i);

            var k = i;
            while (k > 0) {
                this.setAnimation(function (k, p) {
                    a[k].className = 'box tree marked';
                    a[p].className = 'box tree marked';
                    self.compareCountUp();
                }, t++, k, p(k));

                if (array[k] > array[p(k)]) {
                    this.setAnimation(function (k, p) {
                        a[k].className = 'box tree';
                        a[p].className = 'box tree';
                        [a[k].innerHTML, a[p].innerHTML] = [a[p].innerHTML, a[k].innerHTML];
                        self.swapCountUp();
                    }, t++, k, p(k));
                    [array[k], array[p(k)]] = [array[p(k)], array[k]];
                }
                else {
                    this.setAnimation(function (k, p) {
                        a[k].className = 'box tree';
                        a[p].className = 'box tree';
                    }, t++, k, p(k));
                    break;
                }

                k = p(k);
            }
        }

        for (var i = n - 1; i >= 0; i--) {
            this.setAnimation(function (i, j) {
                a[j].className = 'box fixed';
                [a[i].innerHTML, a[j].innerHTML] = [a[j].innerHTML, a[i].innerHTML];
                self.swapCountUp();
            }, t++, 0, i);
            [array[0], array[i]] = [array[i], array[0]];

            var k = 0;
            while (k < i) {
                if (cr(k) < i) {
                    this.setAnimation(function (l, r) {
                        a[l].className = 'box tree marked';
                        a[r].className = 'box tree marked';
                        self.compareCountUp();
                    }, t++, cl(k), cr(k));
                    if (array[cl(k)] < array[cr(k)]) {
                        this.setAnimation(function (l, r, k) {
                            a[l].className = 'box tree';
                            a[r].className = 'box tree marked';
                            a[k].className = 'box tree marked';
                            self.compareCountUp();
                        }, t++, cl(k), cr(k), k);

                        if (array[k] < array[cr(k)]) {
                            this.setAnimation(function (l, r, k) {
                                a[l].className = 'box tree';
                                a[r].className = 'box tree';
                                a[k].className = 'box tree';
                                [a[r].innerHTML, a[k].innerHTML] = [a[k].innerHTML, a[r].innerHTML];
                                self.swapCountUp();
                            }, t++, cl(k), cr(k), k);
                            [array[cr(k)], array[k]] = [array[k], array[cr(k)]];
                        }
                        else {
                            this.setAnimation(function (l, r, k) {
                                a[l].className = 'box tree';
                                a[r].className = 'box tree';
                                a[k].className = 'box tree';
                            }, t++, cl(k), cr(k), k);
                            break;
                        }
                        k = cr(k);
                    }
                    else {
                        this.setAnimation(function (l, r, k) {
                            a[l].className = 'box tree marked';
                            a[r].className = 'box tree';
                            a[k].className = 'box tree marked';
                            self.compareCountUp();
                        }, t++, cl(k), cr(k), k);

                        if (array[k] < array[cl(k)]) {
                            this.setAnimation(function (l, r, k) {
                                a[l].className = 'box tree';
                                a[r].className = 'box tree';
                                a[k].className = 'box tree';
                                [a[l].innerHTML, a[k].innerHTML] = [a[k].innerHTML, a[l].innerHTML];
                                self.swapCountUp();
                            }, t++, cl(k), cr(k), k);
                            [array[cl(k)], array[k]] = [array[k], array[cl(k)]];
                        }
                        else {
                            this.setAnimation(function (l, r, k) {
                                a[l].className = 'box tree';
                                a[r].className = 'box tree';
                                a[k].className = 'box tree';
                            }, t++, cl(k), cr(k), k);
                            break;
                        }
                        k = cl(k);
                    }
                }
                else if (cl(k) < i) {
                    this.setAnimation(function (k, c) {
                        a[k].className = 'box tree marked';
                        a[c].className = 'box tree marked';
                        self.compareCountUp();
                    }, t++, k, cl(k));
                    if (array[k] < array[cl(k)]) {
                        this.setAnimation(function (k, c) {
                            [a[k].innerHTML, a[c].innerHTML] = [a[c].innerHTML, a[k].innerHTML];
                            self.swapCountUp();
                        }, t++, k, cl(k));
                        [array[k], array[cl(k)]] = [array[cl(k)], array[k]];

                        this.setAnimation(function (k, c) {
                            a[k].className = 'box tree';
                            a[c].className = 'box tree';
                        }, t++, k, cl(k));

                        k = cl(k);
                    }
                    else {
                        this.setAnimation(function (k, c) {
                            a[k].className = 'box tree';
                            a[c].className = 'box tree';
                        }, t++, k, cl(k));
                        break;
                    }
                }
                else {
                    this.setAnimation(function (k) {
                        a[k].className = 'box tree marked';
                    }, t++, k);
                    this.setAnimation(function (k) {
                        a[k].className = 'box tree';
                    }, t++, k);
                    break;
                }
            }
        }
    }
}

function cl(k) {
    return 2 * k + 1;
}
function cr(k) {
    return 2 * k + 2;
}
function p(k) {
    return Math.floor((k - 1) / 2);
}
