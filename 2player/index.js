const container = document.getElementById("container");
const player = document.getElementById("player");
const board = []; // 盤面、EMPTY, 0, 1が入ってる
const div_arr = []; // 盤面、各マスを構成するdiv要素が入ってる
const EMPTY = 9;
let turn = 1; // 0か1
let skipped = false;
const img_arr = ["./img/onepiece01_luffy.png", "./img/onepiece02_zoro_bandana.png"];
const H = 8;
const W = 8;
const direction = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
];

/**
 * 画像を置く
 * @param {string} src 画像のパス 
 * @param {HTMLElement} to 画像を配置する場所、div要素
 */
function setImg(src, to) {
    let img = document.createElement("img");
    to.innerHTML = "";
    img.setAttribute("src", src);
    to.appendChild(img);
}
/**
 * オセロを置ければ置く
 * @param {HTMLElement} target クリックされたオブジェクト
 */
function placePiece(y, x, trn) {
    board[y][x] = trn;
    setImg(img_arr[trn], div_arr[y][x]);
}

/**
 * オセロを置ければ置く
 * @param {HTMLElement} target クリックされたオブジェクト
 */
function placePiece_able(y, x) {
    [tf, flip_arr] = placeableCheck(y, x);
    console.log(tf);
    if ((board[y][x] === EMPTY) && (tf)) {
        flip(flip_arr);
        changePlayer();
        showPlaceable();
    }
}

/**
 * 置けるか確認
 * @param {integer} y y座標 
 * @param {integer} x x座標
 * @returns tf, flip_arr
 */
function placeableCheck(y, x) {
    let flip_arr = [
        [y, x]
    ];
    let tf = false;
    for (let i = 0; i < direction.length; i++) {
        let dy = direction[i][0];
        let dx = direction[i][1];
        let ny = y + dy;
        let nx = x + dx;
        let enem = false;
        let flip_arr_temp = []
        while ((0 <= ny) && (ny < H) && (0 <= nx) && (nx < W)) {
            if (enem) {
                if (board[ny][nx] === turn) {
                    Array.prototype.push.apply(flip_arr, flip_arr_temp);
                    tf = true;
                    break;
                }
            } else {
                if ((board[ny][nx] === turn) || (board[ny][nx] === EMPTY)) {
                    break;
                } else {
                    enem = true;
                }
            }
            flip_arr_temp.push([ny, nx]);
            ny += dy;
            nx += dx;
        }
    }
    return [tf, flip_arr];
}
/**
 * ひっくり返す
 * @param {Array} arr ひっくり返す場所の座標
 */
function flip(arr) {
    console.log(board);
    for (let i = 0; i < arr.length; i++) {
        let y = arr[i][0];
        let x = arr[i][1];
        placePiece(y, x, turn);
    }
}

/**
 * 置ける場所をハイライト
 */
function showPlaceable() {
    let skip = true;
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            let [tf, flip_arr] = placeableCheck(i, j);
            if ((board[i][j] !== EMPTY) || (!tf)) {
                div_arr[i][j].classList.remove("placeable");
                continue;
            }
            div_arr[i][j].classList.add("placeable");
            skip = false;
        }
    }
    gameEndCheck(skip);
}

function gameEndCheck(skip) {
    if (skip) {
        if (skipped) {
            console.log("GAME END");
        } else {
            changePlayer();
            skipped = true;
            showPlaceable();
        }
    }

    let [t0, t1] = [0, 0];
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            if (board[i][j] === turn) {
                t0++;
            } else if (board[i][j] !== EMPTY) {
                t1++;
            }
        }
    }
    if ((t0 + t1) === 0) {
        console.log("GAME END");
    } else {
        skipped = false;
    }
}

/**
 * プレイヤーの画像を変更する
 */
function changePlayer() {
    turn ^= 1;
    player.removeAttribute("src");
    player.setAttribute("src", img_arr[turn]);
}


function init() {
    for (let i = 0; i < H; i++) {
        board.push([]);
        div_arr.push([])
        for (let j = 0; j < W; j++) {
            let div_sml = document.createElement("div");
            div_sml.classList.add("square");
            div_sml.x = j;
            div_sml.y = i;
            div_sml.onclick = () => placePiece_able(i, j);
            container.appendChild(div_sml);

            board[i].push(EMPTY);
            div_arr[i].push(div_sml);
        }
    }
    placePiece(3, 3, 1);
    placePiece(4, 4, 1);
    placePiece(3, 4, 0);
    placePiece(4, 3, 0);
    changePlayer();
    showPlaceable();

}
init();