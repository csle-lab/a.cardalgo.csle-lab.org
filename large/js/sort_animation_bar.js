export default class SortAnimationBar {
    constructor(id, compare_id, swap_id) {
        this.id = id;
        this.compare_id = compare_id;
        this.swap_id = swap_id;
        this.actions = [];
        setInterval(this.drawFrame.bind(this), 10);
    }

    set(array) {
        this.actions = [];
        document.getElementById(this.compare_id).innerHTML = '0';
        document.getElementById(this.swap_id).innerHTML = '0';
        this.build(array);
    }

    build() {
        // for override
    }

    setAnimation() {
        this.actions.push(arguments);
    }

    drawFrame() {
        for (var a of this.actions) {
            if (a[1] == 0) {
                continue;
            }
            a[1] -= window.getInterval();
            if (a[1] <= 0) {
                a[1] = 0;
                setTimeout.apply(null, a);
            }
        }
    }

    compareCountUp() {
        var ele = document.getElementById(this.compare_id);
        ele.innerHTML = String(Number(ele.innerHTML) + 1);
    }

    swapCountUp() {
        var ele = document.getElementById(this.swap_id);
        ele.innerHTML = String(Number(ele.innerHTML) + 1);
    }

    swap(a, b, t) {
        var diff = b.getBoundingClientRect().left - a.getBoundingClientRect().left;
        for (var i = 0; i < 30; i++) {
            this.setAnimation(function (a, t, T, x, y) {
                a.style.left = (x * (t + 1) / T) + 'px';
                a.style.top = (t - T / 2) * (t - T / 2) / (T / 2) / (T / 2) * y - y + 'px';
            }, t + i / 10, a, i, 30, diff, 8);
            this.setAnimation(function (a, t, T, x, y) {
                a.style.left = (x * (t + 1) / T) + 'px';
                a.style.top = (t - T / 2) * (t - T / 2) / (T / 2) / (T / 2) * y - y + 'px';
            }, t + i / 10, b, i, 30, -diff, -8);
        }
        this.setAnimation(function (a, b) {
            a.style.left = '0px';
            a.style.top = '0px';
            b.style.left = '0px';
            b.style.top = '0px';
            [a.innerHTML, b.innerHTML] = [b.innerHTML, a.innerHTML];
        }, t + 4, a, b);
    }
}
