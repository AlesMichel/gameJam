let cols = 10;
let rows = 10;
let matrix = [];
let path;
let tRange = 3;
let money = 500;
let lvl = 1;

let gameState = 0;
const gameContainer = document.getElementById('gameCon')
if(gameState === 0){
    buildTitleScreen()
}

function buildTitleScreen(){
    console.log(gameState)
    const titleOv = document.createElement('div')
    titleOv.classList.add('titleOv')
    titleOv.innerHTML = `
        <div>
            
            <button class="start-btn" id="continueButton"><span>Continue...</span></button>
        </div>
    `;
    gameContainer.appendChild(titleOv)

    // Add an event listener to the button
    const continueButton = document.getElementById('continueButton');
    continueButton.addEventListener('click', function() {
        // Remove the title overlay
        titleOv.remove();

        // Optionally, call a function to start the game or load the next screen
        console.log('Continue button clicked! Starting the game...');
        // startGame(); // Uncomment this line if you have a startGame function
    });
}

//0 welcome
//1 build
//2 game
//3 next lvl
//4 loss
//5 win


let level1 = [
    ['E',0,0,0,'B1',0,0,0,0,0],
    [0,0,'B1',0,'B1',0,0,0,0,0],
    ['B1','B1','B1',0,'B1',0,0,0,0,0],
    [0,0,0,0,'B1',0,0,'B1',0,0],
    [0,'B1','B1','B1','B1',0,0,'B1',0,0],
    [0,0,0,0,0,0,0,'B1',0,0],
    ['B1','B1','B1','B1','B1','B1','B1','B1',0,0],
    [0,0,0,0,0,0,0,'B1',0,0],
    [0,0,0,0,0,'B1',0,0,0,0],
    ['H',0,0,0,0,0,0,'B1',0,0]]

let level2 =[
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,'B1','B1','B1',0],
    [0,0,0,0,0,0,'B1',0,0,0],
    [0,0,0,'B1','B1',0,'B1',0,0,0],
    [0,0,0,'B1',0,0,0,0,0,0],
    ['E',0,0,0,0,0,0,0,0,0],
    [0,0,0,'B1',0,0,'H',0,0,0],
    [0,0,0,'B1',0,0,0,0,0,0],
    [0,0,0,'B1','B1',0,'B1','B1',0,0],
    [0,0,0,0,0,0,0,0,0,0]]

let level3 =[
    [0,0,0,'B1','B1','B1','B1',0,0,0],
    [0,'B1',0,0,0,0,0,0,'B1',0],
    [0,0,'B1','B1','B1','B1','B1','B1',0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,'B1','B1',0,0,'B1','B1',0,0],
    [0,'B1',0,0,'B1','B1',0,0,'B1',0],
    [0,'B1',0,0,0,0,0,0,'B1',0],
    [0,0,'B1',0,0,0,0,'B1',0,0],
    [0,0,0,'B1',0,0,'B1',0,0,0],
    [0,0,'E',0,'B1','B1',0,'H',0,0]]



let enemy = {
    x:0,
    y:0
}

let eOrigin = {
    x: 0,
    y: 0
};

let hOrigin = {
    x: 0,
    y: 0
};

let newBuilding = {
    x: 0,
    y: 0
}


let gameGrid = document.getElementById('grid');
let grid = new PF.Grid(rows, cols); // Note: PF.Grid takes (width, height)
const finder = new PF.AStarFinder();


let startBtn = document.getElementById('startGame');
startBtn.addEventListener('click', () => {

    if(gameState !== 2) {
        path = finder.findPath(eOrigin.x, eOrigin.y, hOrigin.x, hOrigin.y, grid.clone());
    }
    if (gameState === 1) {
        gameState = 2;
    }else if(gameState === 3){
        if(lvl < 3) {
            lvl += 1;
            gameState = 1;
            initLevel();
        }else {
            gameState = 5;
            console.log("victory");
        }

    }
    //showPath();
    updateGrid();
});

let hp = document.getElementById('health');
document.getElementById("money").innerHTML = "Money: " + money;


startGame();


// Initialize matrix with default values (0)
for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < cols; j++) {
        matrix[i][j] = 0; // Default value is 0
    }
}

initLevel();
initGrid();
updateGrid();


function resetWalkability() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === 'B1' || matrix[i][j] === 'Tower') {
                grid.setWalkableAt(j, i, false);
            } else {
                grid.setWalkableAt(j, i, true);
            }
        }
    }
}



function initLevel(){
   hp.value = 100;
    switch (lvl){
        case 1:
            matrix = level1;
            money = 350;
            break;
        case 2:
            matrix = level2;
            money = 750;
            break;
        case 3:
            matrix = level3;
            money = 500;
            break;
    }


    initHouse();
    initEnemy();// Initialize the grid
    gameState = 1;
    resetWalkability(); // Call before finding the path
    path = finder.findPath(eOrigin.x, eOrigin.y, hOrigin.x, hOrigin.y, grid.clone());

    updateGrid();
}

function initEnemy() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === 'E') {
                enemy.x = j;
                enemy.y = i;
            }
        }
        eOrigin.x = enemy.x;
        eOrigin.y = enemy.y;
        updateGrid();
    }
}

    function initHouse() {

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (matrix[i][j] === 'H') {
                    hOrigin.x = j;
                    hOrigin.y = i;
                }
            }
            updateGrid();
        }
}


        function moveEnemy() {
            if (path.length === 0) {
                return;// No more path to follow
            }

            // Get the next position from the path
            let temp = path.shift();


            // Clear the enemy's current position in the matrix
            matrix[enemy.y][enemy.x] = 0;

            // Update the enemy's position
            enemy.x = temp[0];
            enemy.y = temp[1];
            dmgCheck(enemy.x, enemy.y);
            matrix[enemy.y][enemy.x] = 'E'; // Update matrix to show enemy at new position

            // Update the grid visually
            updateGrid();

            // Delay before the next movement
            // Adjust the timeout duration as needed (100 ms in this case)
        }

        function updateGrid() {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    Tile.updateValue(i, j); // Correctly update the value of each tile
                    if (matrix[i][j] === 'B1' || matrix[i][j] === 'Tower') {
                        grid.setWalkableAt(j, i, false); // Ensure grid recognizes the barricade
                    }

                }
            }
        }

        function initGrid() {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const tile = new Tile(j, i);
                    tile.setValue(); // Call setValue to update the button based on matrix
                }
            }
        }


        let isMenuOpen = false; // Track if a menu is currently open

        function onClick(curr) {
            const mX = event.clientX; // X coordinate
            const mY = event.clientY; // Y coordinate

            const x = curr.x;
            const y = curr.y;

            // Check if a menu is already open
            if (isMenuOpen) {
                console.log("A menu is already open, cannot open another one.");
                return; // Do nothing if a menu is open
            }

            console.log(x, y);
            newBuilding.x = x;
            newBuilding.y = y;

            // Only allow opening a menu if the tile is valid
            if (matrix[y][x] !== 'H' && matrix[y][x] !== 1 && matrix[y][x] !== 'E') {

                // Set flag to indicate the menu is open
                isMenuOpen = true;

                const menu = document.createElement('div');
                menu.classList.add('build-menu-ov');
                menu.style.top = `${mY}px`;
                menu.style.left = `${mX}px`;
                menu.innerHTML = `
                <div style= class="build-menu">                      
                    <button class="trap" id="trapPick"> </button>
                    <button class="tower" id="towerPick"> </button>
                    <button class="btn" id="cancelBtn"></button>
                </div>
        `;

                // Add event listeners
                const trapPick = menu.querySelector('#trapPick');
                const towerPick = menu.querySelector('#towerPick');
                const cancelBtn = menu.querySelector('#cancelBtn')
                cancelBtn.onclick = () => {
                    document.body.removeChild(menu); // Remove the menu from the DOM
                    isMenuOpen = false; // Reset the flag when the menu is closed
                }
                trapPick.onclick = () => {
                    placeBuilding('Trap');
                    document.body.removeChild(menu); // Remove the menu from the DOM
                    isMenuOpen = false; // Reset the flag when the menu is closed
                };

                towerPick.onclick = () => {
                    placeBuilding('Tower');
                    document.body.removeChild(menu); // Remove the menu on cancel
                    isMenuOpen = false; // Reset the flag when the menu is closed
                };

                document.body.appendChild(menu);
                updateGrid(); // Update the grid after opening the menu
            }
        }


        function getBuildingType() {
            let buildOption = '';
            buildOption = document.getElementById('buildOptions').value
            console.log(buildOption)
            return buildOption;
        }

        function placeBuilding(type) {
            switch (type) {
                case "Tower":
                    if (money >= 100) {
                        money -= 100
                        matrix[newBuilding.y][newBuilding.x] = 'Tower';
                        grid.setWalkableAt(newBuilding.x, newBuilding.y, false); // Ensure the grid is updated
                        if(finder.findPath(eOrigin.x, eOrigin.y, hOrigin.x, hOrigin.y, grid.clone()).length === 0){
                            console.log("placement blocks path");
                            money += 100
                            matrix[newBuilding.y][newBuilding.x] = '0';
                            grid.setWalkableAt(newBuilding.x, newBuilding.y, true);
                        }
                    } else {
                        console.log("broke boi");
                    }
                    break;
                case "Trap":
                    if (money >= 50) {
                        money -= 50
                        matrix[newBuilding.y][newBuilding.x] = 'Trap';
                    } else {
                        console.log("broke boi");
                    }
                    break;
                case 0:
                    break;
            }

            updateGrid(); // Update the visual grid
            // Recalculate the path after placing a building
            path = finder.findPath(eOrigin.x, eOrigin.y, hOrigin.x, hOrigin.y, grid.clone());
            //showPath();
            document.getElementById("money").innerHTML = "Money: " + money; // update money

        }

        function gameTick() {

            if (enemy.x === hOrigin.x && enemy.y === hOrigin.y) {
                gameState = 4;
            }

            if (hp.value === 0){
                gameState = 3;
            }


            if(gameState === 2) {
                moveEnemy();
            }



            setTimeout(gameTick, 200);
        }


        let lastHp = 0;
        function dmgCheck(x, y) {

            if(hp.value !== 100 && hp.value%10 === 0 && lastHp !== hp.value){
                path.unshift(path[0]);
            }

            lastHp = hp.value;

            if (matrix[y][x] === "Trap") {
                hp.value -= 10;
                console.log("trap triggered");
                matrix[y][x] = 0;
            }

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    Tile.updateValue(i, j); // Correctly update the value of each tile
                    if (matrix[i][j] === 'Tower') {
                        let d = Math.sqrt(Math.pow(j - x, 2) + Math.pow(i - y, 2));
                        if (d <= tRange) {
                            hp.value -= 2;
                            console.log("tower hit");
                        }
                    }

                }
            }
        }


        function animate() {
//
        }

        function startGame() {

            animate();
            gameTick(); // nefungovalo v animate

            requestAnimationFrame(animate)
        }





