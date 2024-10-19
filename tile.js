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
                this.button.style.backgroundColor = 'red'; // House
                this.button.innerText = 'H'; // Label for house
                break;
            case 'B1':
                this.button.style.backgroundColor = 'brown'; // Barricade
                this.button.innerText = 'B1'; // Label for barricade
                break;
            case 'E':
                this.button.style.backgroundColor = 'brown'; // Default color
                this.button.innerText = 'E'; // No text for empty
                break;
            case 'Tower':
                this.button.style.backgroundColor = 'red'
                this.button.innerText = 'Tow'
                break;
            case 'Trap':
                this.button.style.backgroundColor = 'yellow'
                this.button.innerText = 'Trp'
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
                    temp.style.backgroundColor = 'purple'; // Default color
                    temp.innerText = 'E'; // No text for empty
                    break;
                case 0:
                    temp.style.backgroundColor = 'white'; // Default color
                    temp.innerText = ''; // No text for empty
                    break;

                case 2:
                    temp.style.backgroundColor = 'green'; // Path
                    temp.innerText = 'P'; // Optional label
                    break;
                case 'B1':
                    temp.style.backgroundColor = 'brown'; // Barricade
                    temp.innerText = 'B1'; // Label for barricade
                    break;
                case 'H':
                    temp.style.backgroundColor = 'red'; // House
                    temp.innerText = 'H'; // Label for house
                    break;
                case 'Tower':
                    temp.style.backgroundColor = 'red'
                    temp.innerText = 'Tow'
                    break;
                case 'Trap':
                    temp.style.backgroundColor = 'yellow'
                    temp.innerText = 'Trp'
            }
        }
    }
}
