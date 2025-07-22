export default class SortAnimationBlock {
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
}
