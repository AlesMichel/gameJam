let cols = 10;
let rows = 10;
let matrix = [];

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
    startGame();
    showPath();
    updateGrid();
});


// Initialize matrix with default values (0)
for (let i = 0; i < rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < cols; j++) {
        matrix[i][j] = 0; // Default value is 0
    }
}

initWater();
initHouse();
// generateBarriers(10,4);
initGrid(); // Initialize the grid
initEnemy();

let path = finder.findPath(eOrigin.x,eOrigin.y,hOrigin.x,hOrigin.y,grid); // Find the path with max steps

function initWater() {
    // Choose a random row and column
    // let randomRow = int(Math.random() * rows);
    // let randomCol = int(Math.random() * cols);

    let randomRow = Math.floor(Math.random() * rows);
    let randomCol = Math.floor(Math.random() * cols);

    // Randomly place water in either the first row or the first column
    if (Math.random() > 0.5) {
        matrix[randomRow][0] = 1; // Place water in row 0 at random column
        eOrigin.x = 0;
        eOrigin.y = randomRow;
    } else {
        matrix[0][randomCol] = 1; // Place water in column 0 at random row
        eOrigin.x = randomCol;
        eOrigin.y = 0;
    }
}

function initHouse() {
    let lastCells = [];

    // Collect last 3 rows and last 3 columns positions
    for (let i = rows - 3; i < rows; i++) {
        for (let j = cols - 3; j < cols; j++) {
            lastCells.push({row: i, col: j});
        }
    }

    if (lastCells.length > 0) {
        let randomIndex = Math.floor(Math.random() * lastCells.length);
        let pos = lastCells[randomIndex];
        matrix[pos.row][pos.col] = 'H'; // Set 'H' as the house value
        hOrigin.x = pos.col;
        hOrigin.y = pos.row;
    }
}

function initEnemy(){
    enemy.x = eOrigin.x;
    enemy.y = eOrigin.y;
    console.log(enemy.y)
    console.log(enemy.x)
    matrix[enemy.y][enemy.x] = 'E';
    updateGrid();
}


function moveEnemy() {
    if (path.length === 0) {
        return; // No more path to follow
    }

    // Get the next position from the path
    let temp = path.shift();

    // Clear the enemy's current position in the matrix
    matrix[enemy.y][enemy.x] = 0;

    // Update the enemy's position
    enemy.x = temp[0];
    enemy.y = temp[1];
    matrix[enemy.y][enemy.x] = 'E'; // Update matrix to show enemy at new position

    // Update the grid visually
    updateGrid();

    // Delay before the next movement
    setTimeout(moveEnemy, 500); // Adjust the timeout duration as needed (100 ms in this case)
}

function showPath() {

    console.log(path);

    // Clear previous paths if necessary
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === 2) {
                matrix[i][j] = 0; // Reset path value in matrix
            }
        }
    }

    // Mark new path in the matrix
    if (path) {
        for (let i = 0; i < path.length; i++) {
            if (matrix[path[i][1]][path[i][0]] !== 'H' && matrix[path[i][1]][path[i][0]] !== 1) {
                matrix[path[i][1]][path[i][0]] = 2; // Set path value in matrix
            }
        }
    }
    updateGrid(); // Ensure grid is updated after marking the path
}

function updateGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            Tile.updateValue(i, j); // Correctly update the value of each tile
            if (matrix[i][j] === 'B1') {
                grid.setWalkableAt(i, j, false); // Ensure grid recognizes the barricade
            }

        }
    }
}

function initGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const tile = new Tile(i, j);
            tile.setValue(); // Call setValue to update the button based on matrix
        }
    }
}



function onClick(curr) {
    const x = curr.x;
    const y = curr.y;
    console.log(x, y);
    newBuilding.x = x;
    newBuilding.y = y;
    if (matrix[y][x] !== 'H' && matrix[y][x] !== 1 && matrix[y][x] !== 'E') {

        //now show menu

        const menu = document.createElement('div')

        menu.innerHTML = `
    <div class="build-menu">
    <select id="buildOptions">
        <option value="">Choose building</option>
        <option value="Tower">Tower</option>
        <option value="Trap">Trap</option>
    </select>
    <div class="d-flex">
        <button id="addBtn">Add</button>
        <button id="cancelBtn">Cancel</button>
    </div></div>
`;


        // Add event listeners
        const addBtn = menu.querySelector('#addBtn');
        const cancelBtn = menu.querySelector('#cancelBtn');

        addBtn.onclick = () => {
            placeBuilding(menu);
            document.body.removeChild(menu)
             // Pass the menu to remove it later
        };

        cancelBtn.onclick = () => {
            document.body.removeChild(menu); // Remove menu on cancel
        };


        document.body.appendChild(menu)
        // matrix[x][y] = 'B1';
        // grid.setWalkableAt(y, x, false);
        // console.log(grid)
        updateGrid();
    }
}

function getBuildingType(){
    let buildOption = '';
    buildOption = document.getElementById('buildOptions').value
    console.log(buildOption)
    return buildOption;
}

function placeBuilding(){
    console.log()
    const option = getBuildingType();
    console.log(option)
    switch (option){
        case "Tower":
            matrix[newBuilding.y][newBuilding.x] = 'Tower';
            grid.setWalkableAt(newBuilding.x, newBuilding.y,false);
            break;
        case "Trap":
            matrix[newBuilding.y][newBuilding.x] = 'Trap';
            break;
        case 0:
            break;
    }
    updateGrid();
}

function generateBarriers(count, segmentCount) {
    let barLeft = count;
    let barriersPerSegment = Math.floor(count / segmentCount); // Number of barriers per segment

    // Function to check if a position is valid and walkable
    function isValid(row, col) {
        return (
            row >= 2 && row < rows - 2 && // Avoid edges
            col >= 2 && col < cols - 2 &&
            matrix[row][col] !== 'H' && // Not a house
            matrix[row][col] !== 1 && // Not water
            matrix[row][col] !== 'B1' // Not already a barrier
        );
    }

    // Function to generate a segment of barriers around a starting point
    function generateSegment(startRow, startCol, barriersInSegment) {
        let placedBarriers = [];
        matrix[startRow][startCol] = 'B1';
        grid.setWalkableAt(startCol, startRow, false); // Make this spot unwalkable
        placedBarriers.push([startRow, startCol]);
        barLeft--;
        barriersInSegment--;

        while (barriersInSegment > 0) {
            // Pick a random existing barrier in this segment
            let randomBarrier = placedBarriers[Math.floor(Math.random() * placedBarriers.length)];
            let [r, c] = randomBarrier;

            // Find valid neighboring spots (up, down, left, right)
            let neighbors = [
                [r - 1, c], // Up
                [r + 1, c], // Down
                [r, c - 1], // Left
                [r, c + 1]  // Right
            ];

            // Shuffle neighbors for random selection
            neighbors = neighbors.sort(() => Math.random() - 0.5);

            // Try to place a barrier in one of the neighboring cells
            for (let [newR, newC] of neighbors) {
                if (isValid(newR, newC)) {
                    matrix[newR][newC] = 'B1';
                    grid.setWalkableAt(newC, newR, false); // Make it unwalkable
                    placedBarriers.push([newR, newC]);
                    barriersInSegment--;
                    barLeft--;
                    break; // Stop searching for a neighbor and move on to the next one
                }
            }
        }
    }

    // Generate each segment
    for (let s = 0; s < segmentCount; s++) {
        // Generate random indices for the first barrier in each segment (avoiding edges)
        let startRow = Math.floor(Math.random() * (rows - 4)) + 2;
        let startCol = Math.floor(Math.random() * (cols - 4)) + 2;

        // Generate a segment of barriers starting from this point
        generateSegment(startRow, startCol, barriersPerSegment);
    }

    // If there are any leftover barriers (in case the count isn't divisible by segmentCount)
    if (barLeft > 0) {
        // Place remaining barriers in the last segment
        let startRow = Math.floor(Math.random() * (rows - 4)) + 2;
        let startCol = Math.floor(Math.random() * (cols - 4)) + 2;
        generateSegment(startRow, startCol, barLeft);
    }
}

function mainCharacter() {

    const img = new Image();
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'mainCharacter');
    canvas.width = 80; // Canvas width
    canvas.height = 80; // Canvas height


    gameGrid.appendChild(canvas); // Append the canvas to the body

    const ctx = canvas.getContext('2d');

    // Fetch the image from the assets
    fetch('/assets/mainCharacterWalk.png')
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.blob();
        })
        .then(blob => {
            img.src = URL.createObjectURL(blob);
            img.onload = () => {
                console.log('Image loaded successfully'); // Log when the image loads
                startAnimation(); // Start animation once the image loads
            };
        })
        .catch(error => {
            console.error('Error fetching the image:', error);
        });

    const spriteWidth = 64; // Width of a single sprite frame
    const spriteHeight = 65; // Height of a single sprite frame
    const totalFrames = 9; // Total number of frames in the sprite sheet
    let currentFrame = 0; // Current frame index
    let lastFrameTime = 0; // Time of the last frame
    const fps = 10; // Frames per second



    //get position


    function MatchCharPosition() {
        const refEls = document.querySelectorAll('.tile-main-character');
        if (refEls.length > 0) {
            const lastElement = refEls[refEls.length - 1];

            // Get the last element's position
            const rect = lastElement.getBoundingClientRect();



            // Calculate relative position to the parent
            const parentRect = lastElement.parentElement.getBoundingClientRect();
            const relativeX = rect.left - parentRect.left;
            const relativeY = rect.top - parentRect.top;

            return [relativeX, relativeY];

        } else {
            console.warn('Element tile not found');
            return null; // Returning null to signify no position available
        }
    }

    console.log(MatchCharPosition() + "MatchCharPos")



    let fitChar = {
        x: MatchCharPosition()[0] + 130,
        y: MatchCharPosition()[1] + 300
    }
    console.log(fitChar);

    canvas.style.position = 'absolute'; // Set the canvas to absolute positioning
    canvas.style.left = `${fitChar.x}px`; // Set left position
    canvas.style.top = `${fitChar.y}px`; // Set top position







    function startAnimation(timestamp) {

        if (!lastFrameTime) lastFrameTime = timestamp;

        const deltaTime = timestamp - lastFrameTime;

        if (deltaTime > 1000 / fps) { // Update frame timing condition
            currentFrame = (currentFrame + 1) % totalFrames; // Loop back to the first frame
            lastFrameTime = timestamp; // Update the last frame time

        }

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        // Draw the current frame of the sprite
        ctx.drawImage(
            img,
            currentFrame * spriteWidth, // X position of the frame in the sprite sheet
            0, // Y position of the frame in the sprite sheet (adjust if necessary)
            spriteWidth, // Width of the frame
            spriteHeight, // Height of the frame
            0, // X position to draw on the canvas
            0, // Y position to draw on the canvas
            spriteWidth, // Width to draw on the canvas
            spriteHeight // Height to draw on the canvas
        );

        //now move with the tile



        let fitChar = {
            x: MatchCharPosition()[0],
            y: MatchCharPosition()[1] + 30
        }


        canvas.style.position = 'absolute'; // Set the canvas to absolute positioning
        canvas.style.left = `${fitChar.x}px`; // Set left position
        canvas.style.top = `${fitChar.y}px`; // Set top position



        requestAnimationFrame(startAnimation); // Call the animation function again
    }
}
mainCharacter();




function startGame(){
    moveEnemy()
}


