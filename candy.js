var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;
var timeLeft = 30; // 30 seconds timer
var timerStarted = false;

var currTile;
var otherTile;

var gameInterval; // To store the game interval
var timerInterval; // To store the timer interval

window.onload = function () {
    startGame();

    // Set up the retry button
    const retryButton = document.createElement("button");
    retryButton.id = "retry";
    retryButton.innerText = "Retry";
    retryButton.style.display = "none";
    retryButton.onclick = resetGame;
    document.body.appendChild(retryButton);
};

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function startGame() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = ""; // Clear the board
    board = [];
    score = 0;
    timeLeft = 30;
    timerStarted = false;
    document.getElementById("score").innerText = score;
    document.getElementById("timer").innerText = `Time: ${timeLeft}s`;

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            // DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            boardElement.append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function startTimer() {
    if (!timerStarted) {
        timerStarted = true;

        // Start the game loop (every 1/10th of a second)
        gameInterval = window.setInterval(function () {
            crushCandy();
            slideCandy();
            generateCandy();
        }, 100);

        // Start the timer
        timerInterval = window.setInterval(updateTimer, 1000);
    }
}

function dragStart() {
    startTimer(); // Start the timer on the first move
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c - 1 && r == r2;
    let moveRight = c2 == c + 1 && r == r2;

    let moveUp = r2 == r - 1 && c == c2;
    let moveDown = r2 == r + 1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        let validMove = checkValid();
        if (!validMove) {
            currTile.src = otherImg;
            otherTile.src = currImg;
        }
    }
}

function crushCandy() {
    crushThree();
    document.getElementById("score").innerText = score;
}

function crushThree() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            if (
                candy1.src == candy2.src &&
                candy2.src == candy3.src &&
                !candy1.src.includes("blank")
            ) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            if (
                candy1.src == candy2.src &&
                candy2.src == candy3.src &&
                !candy1.src.includes("blank")
            ) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }
}

function checkValid() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            if (
                candy1.src == candy2.src &&
                candy2.src == candy3.src &&
                !candy1.src.includes("blank")
            ) {
                return true;
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            if (
                candy1.src == candy2.src &&
                candy2.src == candy3.src &&
                !candy1.src.includes("blank")
            ) {
                return true;
            }
        }
    }

    return false;
}

function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = rows - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}

function updateTimer() {
    timeLeft -= 1;
    document.getElementById("timer").innerText = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);

        board.forEach((row) => {
            row.forEach((tile) => {
                tile.setAttribute("draggable", false);
            });
        });

        const retryButton = document.getElementById("retry");
        retryButton.style.display = "block";

        if (score >= 1500) {
            alert("You won!");
        } else {
            alert("You lost!");
        }
    }
}

function resetGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    document.getElementById("retry").style.display = "none";
    startGame();
}
// After your game logic, add this part to handle the retry functionality

document.getElementById("retry").addEventListener("click", function() {
    location.reload(); // This will reload the entire page
});
// After checking the result (win or lose), show the retry button
function showResultMessage() {
    const retryButton = document.getElementById("retry");
    const message = document.createElement("div");
    
    if (score >= 1500) {
        message.innerHTML = "You won!";
        retryButton.style.display = "block";
    } else {
        message.innerHTML = "You lost!";
        retryButton.style.display = "block";
    }

    document.body.append(message); // Append message to the body
}
