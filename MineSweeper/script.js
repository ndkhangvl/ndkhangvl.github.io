var mineCount = 40;
var rows = 15;
var cols = 20;
var board;
var openedCells=0;
timerVar = setInterval(()=>{},1000)
document.getElementById("btn").onclick = newGame;


function initBoard() {
    let mineNum = 0;
    board = new Array(rows * cols); // Tao bang va gan gia tri mac dinh la 0 
    board.fill(0); 
    do {
        let ran = Math.floor(Math.random() * rows * cols); // Sinh ngau nhien vi tri min
        board[ran] = 9;
        mineNum++;
    } while (mineNum < mineCount);

    for (let i = 0; i < rows; i++) { // Vong lap chay het bang de kiem tra xem o nao co min, va co bao nhieu min trong 8 o co xung quanh 
        for (let j = 0; j < cols; j++) {
            if (board[i * cols + j] == 9)
                continue;
            let minesAround = 0;
            minesAround += check(i - 1, j - 1);
            minesAround += check(i, j - 1);
            minesAround += check(i + 1, j - 1);
            minesAround += check(i - 1, j);
            minesAround += check(i + 1, j);
            minesAround += check(i - 1, j + 1);
            minesAround += check(i, j + 1);
            minesAround += check(i + 1, j + 1);
            board[i * cols + j] = minesAround;
        }
    }
}

function check(i, j) {
    if (i < 0 || i >= rows || j < 0 || j >= cols)
        return 0;
    else if (board[i * cols + j] == 9)
        return 1; //Neu vi tri la bang 9 thi tra ve 1 
    else return 0;

}

function countTimer() {
        totalSeconds++;
        var hour = Math.floor(totalSeconds /3600);
        var minute = Math.floor((totalSeconds - hour*3600)/60);
        var seconds = totalSeconds - (hour*3600 + minute*60);
        if(hour < 10)
        hour = "0"+hour;
        if(minute < 10)
        minute = "0"+minute;
        if(seconds < 10)
        seconds = "0"+seconds;
        document.getElementById("countUp").innerHTML = hour + ":" + minute + ":" + seconds;
 }

function initHTML() {
    var tbody = document.getElementById("board_tbody");
    if (tbody != null)
        tbody.parentNode.removeChild(tbody);
    tbody = document.createElement('tbody');
    tbody.setAttribute("id", "board_tbody");
    document.getElementById("board").appendChild(tbody);
    for (let i = 0; i < rows; i++) {
        var newTr = document.createElement('tr'); //tao bien tao hang cho bang
        for (let j = 0; j < cols; j++) {
            var newTd = document.createElement('td'); //tao bien tao cot cho bang
            newTd.setAttribute("class", "closed");
            newTd.setAttribute("ind", i * cols + j);
            newTd.addEventListener("click", clicked);
            newTd.addEventListener("contextmenu", rightClicked);
            newTr.appendChild(newTd);
        }
        tbody.appendChild(newTr);
    }
}

function clicked(e) {
    var target = e.target;
    var index = target.getAttribute("ind");
    if (target.textContent != "") { return; }
    if (board[index] == 9) {
        gameover(target);
        return;
    }

    open(parseInt(index / cols), index % cols);
}

function rightClicked(e) {
    e.preventDefault();
    var target = e.target;
    var index = target.getAttribute("ind");
    if (target.textContent == "") {
        target.textContent = "🚩"
    }
    else if (target.textContent == "🚩") {
        target.textContent = "?"
    }
    else if (target.textContent == "?") {
        target.textContent = "";
    }
}

function open(row, col) {

    if (row < 0 || row >= rows || col < 0 || col >= cols)
        return;

    var trList = document.getElementById("board_tbody").querySelectorAll('tr'); //Truy xuat cac du lieu cua tr
    var target = trList[row].querySelectorAll('td')[col];

    if (target.textContent != "") { return; }
        console.log(target);
    if (target.getAttribute("class") != "closed")
        return;
    var num = board[row * cols + col];
    if (num == 9) {
    }
    else if (num > 0 && num < 9) {
        target.setAttribute("class", "open");
        target.textContent = num;
        if (num == 1) target.classList.add('one')
        if (num == 2) target.classList.add('two')
        if (num == 3) target.classList.add('three')
        if (num == 4) target.classList.add('four')
        target.innerHTML = num;
    }
    else if (num == 0) {
        target.setAttribute("class", "open");
        if (num == 0) target.classList.add('zero');
        open(row - 1, col - 1);
        open(row, col - 1);
        open(row + 1, col - 1);
        open(row - 1, col);
        open(row + 1, col);
        open(row - 1, col + 1);
        open(row, col + 1);
        open(row + 1, col + 1);
    }
    openedCells++;
    if(openedCells==rows*cols-mineCount){
        win();
        clearInterval(timeVar);
    }
}

function win(){
    clearInterval(timerVar);
    console.log("Bạn đã chiến thắng trò chơi!");
    document.getElementById("notification").style.display = "flex";
    document.getElementById("win-noti").style.display = "flex";
    document.getElementById("win-noti").innerHTML= "Chúc Mừng Bạn Đã Chiến Thắng Với Tổng Thời Gian " + totalSeconds + "s";
}

function gameover(target) {
    console.log("gameover");
    document.getElementById("notification").style.display = "flex";
    document.getElementById("win-noti").style.display = "flex";
    document.getElementById("win-noti").innerHTML= "Bạn đã thua mất rồi!";
    // alert("Bạn đã thua mất rồi !");
    clearInterval(timerVar);
   
    target.setAttribute("class", "mine");
    target.textContent = "¤";

    /*open all*/
    var trList = document.getElementById("board_tbody").querySelectorAll('tr');
    for (let i = 0; i < board.length; i++) {
        var cell = trList[parseInt(i / cols)].querySelectorAll('td')[i % cols];
        var num = board[cell.getAttribute("ind")];
        if (num == 9) {
            cell.setAttribute("class", "mine");
            cell.textContent = "💣";
        }
        else if (num > 0 && num < 9) {
            cell.setAttribute("class", "open");
            cell.textContent = num;
            if (num == 1) cell.classList.add('one')
            if (num == 2) cell.classList.add('two')
            if (num == 3) cell.classList.add('three')
            if (num == 4) cell.classList.add('four')
            if (num == 5) cell.classList.add('five')
            cell.innerHTML = num;
        }
        else if (num == 0) {
            cell.setAttribute("class", "open");
            cell.classList.add('zero')
            cell.innerHTML = "";
        }
    }
}

function closeNoti() {
    document.getElementById("notification").style.display = "none";
}

function newGame() {
    clearInterval(timerVar)
    timerVar = setInterval(countTimer, 1000);
    totalSeconds = 0;
    rows = parseInt(document.getElementById("rows").value);
    cols = parseInt(document.getElementById("cols").value);
    mineCount = parseInt(document.getElementById("mines").value);
    rows = rows > 10 ? rows : 10;
    cols = cols > 10 ? cols : 10;
    mineCount = mineCount > 10 ? mineCount : 10;
    openedCells=0;
    initBoard();
    initHTML();
    document.getElementById("win-noti").style.display = "none";
    document.getElementById("win-noti").innerHTML="";
}