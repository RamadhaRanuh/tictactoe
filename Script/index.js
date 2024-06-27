const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const player = document.querySelector("#player");
const difficulty = document.querySelector("#difficultySelect");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let options = ["","","","","","","","",""];
let currentPlayer = "X";
let running = false;


document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('player').value = 'human';
    document.getElementById('difficultySelect').value = 'easy';
});

initializeGame();

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked()
{   
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this,cellIndex);
    checkWinner();
    if(player.value === "AI" && difficulty.value === "easy")
        {
            makeRandomMove("O");
            checkWinner();
        }

    else if(player.value === "AI" && difficulty.value === "hard")
        {
            makeMiniMaxMove("O");
            checkWinner();
        }
}

function makeRandomMove(player) 
{
    let emptySpaces = options.map((value, index) => value === "" ? index : null).filter(v => v !== null);
  
    if (emptySpaces.length === 0) 
    {
        return false; 
    }
  
    let randomIndex = Math.floor(Math.random() * emptySpaces.length);
    let chosenIndex = emptySpaces[randomIndex];
    options[chosenIndex] = player;
    let chosenCell = cells[chosenIndex];
    chosenCell.textContent = player;
    return true;
}

function makeMiniMaxMove(player) 
{
    
    let board = 
    [
        options.slice(0, 3),
        options.slice(3, 6),
        options.slice(6, 9)
    ];

    
    function miniMax(board, depth, isMaximizing) 
    {
        let scores = 
        {
            "X": -10,
            "O": 10,
            "Tie": 0
        };

        let result = checkWinnerMiniMax(board);
        if (result !== null) 
        {
            return scores[result];
        }

        if (isMaximizing) 
            {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) 
                    {
                    
                    if (board[i][j] === "") 
                    {
                        board[i][j] = "O";
                        let score = miniMax(board, depth + 1, false);
                        board[i][j] = "";
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } 
        else 
        {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) 
                {
                for (let j = 0; j < 3; j++) 
                    {
                    if (board[i][j] === "") 
                    {
                        board[i][j] = "X";
                        let score = miniMax(board, depth + 1, true);
                        board[i][j] = "";
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }

            return bestScore;
        }
    }

    
    function checkWinnerMiniMax(board) 
    {
        for (let i = 0; i < winConditions.length; i++) 
        {
            const [a, b, c] = winConditions[i];
            if (board[Math.floor(a / 3)][a % 3] !== "" &&
                board[Math.floor(a / 3)][a % 3] === board[Math.floor(b / 3)][b % 3] &&
                board[Math.floor(a / 3)][a % 3] === board[Math.floor(c / 3)][c % 3]) 
            {
                return board[Math.floor(a / 3)][a % 3];
            }
        }

        if (board.flat().every(cell => cell !== "")) 
        {
            return "Tie";
        }

        return null;
    }

    
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) 
    {
        for (let j = 0; j < 3; j++) 
        {
            if (board[i][j] === "") 
            {
                board[i][j] = "O";
                let score = miniMax(board, 0, false);
                board[i][j] = "";
                if (score > bestScore) 
                {
                    bestScore = score;
                    move = { i, j };
                }
            }
        }
    }

    
    if (move != null) 
    {
        options[move.i * 3 + move.j] = player;
        cells[move.i * 3 + move.j].textContent = player;
    }
}

function updateCell(cell , index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner(){
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        statusText.textContent = `${currentPlayer} menang!`;
        running = false;
    }

    else if(!options.includes("")){
        statusText.textContent = `Seri`; 
        running = false;
    }

    else{
        changePlayer();
    }

}

function restartGame(){
    currentPlayer = "X";
    options = ["","","","","","","","",""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}



player.addEventListener('change', function() {
    
    if (this.value === 'AI') 
        {
        
            difficulty.style.display = 'flex';
            restartGame();
        } 
    else 
    {
        
        difficulty.style.display = 'none';
        restartGame();
    }


});

difficulty.addEventListener('change', function()
{
    restartGame();
});
