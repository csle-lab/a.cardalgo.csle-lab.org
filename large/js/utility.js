export default class Utility {
    static shuffleArray(a, l, r) {
        var b = a.slice(l, r).sort(() => Math.random() - 0.5);
        for (var i = l; i < r; i++) {
            a[i] = b[i - l];
        }
    }

    static generateRandomArray(l, r, n) { // [l, r] * n
        var tmp = [];
        for (var i = l; i <= r; i++) {
            tmp.push(i);
        }
        Utility.shuffleArray(tmp, 0, r - l + 1);
        var res = [];
        for (var i = 0; i < n; i++) {
            res.push(tmp[i]);
        }
        return res;
    }
}
