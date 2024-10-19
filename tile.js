//tile class
class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        let gameGrid = document.getElementById('grid');

        // Create the button and store it as a property
        this.button = document.createElement('button');
        this.button.setAttribute('id', `tile${this.x}${this.y}`);
        this.button.setAttribute('class', 'tile');

        // Add click event listener using an arrow function to capture 'this'
        this.button.onclick = () => onClick(this);
        gameGrid.appendChild(this.button);
    }

    setValue() {
        switch (matrix[this.y][this.x]) {
            case 0:
                this.button.style.backgroundColor = 'white'; // Default color
                this.button.innerText = ''; // No text for empty
                this.button.setAttribute('class', 'tile');

                break;
            case 1:
                this.button.style.backgroundColor = 'blue'; // Water
                this.button.innerText = 'W'; // Optional label
                break;
            case 2:
                this.button.style.backgroundColor = 'green'; // Path
                this.button.innerText = 'P'; // Optional label
                break;
            case 'H':
                this.button.setAttribute('class', 'tile-house tile');
                break;
            case 'B1':
                this.button.setAttribute('class', 'tile-baricade');
                break;
            case 'E':
                this.button.setAttribute('class', 'tile-main-character tile-rock');
                break;
            case 'Tower':
                this.button.setAttribute('class', 'tile-tower');
                break;
            case 'Trap':
                this.button.setAttribute('class', 'tile-trap');

        }
    }

    static findTile(x, y) {
        const tileId = `tile${x}${y}`; // Construct the ID based on x and y
        return document.getElementById(tileId); // Return the tile element (or null if not found)
    }

    static updateValue(x, y) {
        let temp = this.findTile(x, y);
        if (temp) {
            switch (matrix[y][x]) {
                case 'E':
                    temp.setAttribute('class', 'tile-main-character tile-rock');
                    break;
                case 0:
                    temp.style.backgroundColor = 'white'; // Default color
                    temp.innerText = ''; // No text for empty
                    temp.setAttribute('class', 'tile');
                    break;

                case 2:
                    temp.style.backgroundColor = 'green'; // Path
                    temp.innerText = 'P'; // Optional label
                    break;
                case 'B1':
                    temp.setAttribute('class', 'tile-baricade');
                    break;
                case 'H':
                    temp.setAttribute('class', 'tile-house');
                    break;
                case 'Tower':
                    temp.setAttribute('class', 'tile-tower');
                    break;
                case 'Trap':
                    temp.setAttribute('class', 'tile-trap');
            }
        }
    }
}
