import Utility from './utility.js';
import BubbleSortBlock from './bubble_sort_block.js';
import SelectionSortSlowBlock from './selection_sort_slow_block.js';
import HeapSortBlock from './heap_sort_block.js';

var array;
var bubble_sort, selection_sort, heap_sort;

window.onload = function () {
    window.begin = begin;
    window.play = play;
    window.getInterval = getInterval;
    window.set = set;

    bubble_sort = new BubbleSortBlock('animation_bubble', 'compare_bubble', 'swap_bubble');
    selection_sort = new SelectionSortSlowBlock('animation_selection', 'compare_selection', 'swap_selection');
    heap_sort = new HeapSortBlock('animation_heap', 'compare_heap', 'swap_heap');

    set();
};

function set() {
    document.getElementById('btn_play').value = '▶';

    var input = document.getElementById('my_input').value;
    if (input == '') {
        alert('入力を選択してください');
        return;
    }
    if (isNaN(input)) {
        alert('入力の形式が正しくありません');
        return;
    }
    document.getElementById('my_input').value = '';

    var n = Number(input);
    array = Utility.generateRandomArray(100, 999, n);

    bubble_sort.set(array.slice());
    selection_sort.set(array.slice());
    heap_sort.set(array.slice());
}

function play() {
    if (document.getElementById('btn_play').value == '▶')
        document.getElementById('btn_play').value = '⬛︎';
    else
        document.getElementById('btn_play').value = '▶';
}

function begin() {
    document.getElementById('btn_play').value = '▶';
    setTimeout(function () {
        bubble_sort.set(array.slice());
        selection_sort.set(array.slice());
        heap_sort.set(array.slice());
    }, 15);
}

function getInterval() {
    if (document.getElementById('btn_play').value == '▶')
        return 0;
    switch (document.getElementById('interval').value) {
        case '1':
            return 0.05;
        case '2':
            return 0.1;
        case '3':
            return 0.5;
        case '4':
            return 1;
    }
}
