

function mainCharacter() {
    const img = new Image();
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'mainCharacter');
    canvas.width = 80; // Canvas width
    canvas.height = 80; // Canvas height

    gameGrid.appendChild(canvas); // Append the canvas to the body
    const ctx = canvas.getContext('2d');

    const spriteWidth = 64; // Width of a single sprite frame
    const spriteHeight = 65; // Height of a single sprite frame
    const totalFrames = 9; // Total number of frames in the sprite sheet
    let currentFrame = 0; // Current frame index
    let lastFrameTime = 0; // Time of the last frame
    const fps = 10; // Frames per second

    // Function to load image and start animation
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
        });
    }

    // Function for animation
    async function animate() {
        if (!lastFrameTime) lastFrameTime = performance.now();

        const deltaTime = performance.now() - lastFrameTime;
        if (deltaTime > 1000 / fps) {
            currentFrame = (currentFrame + 1) % totalFrames; // Loop back to the first frame
            lastFrameTime = performance.now();
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        // Draw the current frame of the sprite
        ctx.drawImage(
            img,
            currentFrame * spriteWidth,
            0,
            spriteWidth,
            spriteHeight,
            0,
            0,
            spriteWidth,
            spriteHeight
        );

        // Update character position
        updateCharacterPosition();

        // Call the animation function again
        requestAnimationFrame(animate);
    }

    // Function to update character position based on tiles
    function updateCharacterPosition() {
        const charPos = MatchCharPosition();
        if (charPos !== null) { // Ensure position is not null
            const fitChar = {
                x: charPos[0] - 10,
                y: charPos[1] - 20
            };

            canvas.style.position = 'absolute'; // Set the canvas to absolute positioning
            canvas.style.left = `${fitChar.x}px`; // Set left position
            canvas.style.top = `${fitChar.y}px`; // Set top position
        }
    }

    // Function to match character position
    function MatchCharPosition() {
        const refEls = document.querySelectorAll('.tile-main-character');
        if (refEls.length > 0) {
            const lastElement = refEls[refEls.length - 1];

            // Get the last element's position
            const rect = lastElement.getBoundingClientRect();
            const parentRect = lastElement.parentElement.getBoundingClientRect();
            const relativeX = rect.left - parentRect.left;
            const relativeY = rect.top - parentRect.top;

            return [relativeX, relativeY];
        } else {
            console.warn('Element tile not found');
            return null;
        }
    }

    // Function to check damage state and update image accordingly
    async function updateImage() {
        const imageSrc = isTakingDmg ? 'assets/mainCharDmg.png' : 'assets/mainCharacterWalk.png';
        await loadImage(imageSrc);
        animate(); // Start the animation with the loaded image
    }

    // Monitor the isTakingDmg state and update the image accordingly
    setInterval(() => {
        if (isTakingDmg !== (img.src.includes('mainCharDmg.png'))) {
            updateImage();
        }
    }, 100); // Check every 100 milliseconds

    // Initial image load and animation start
    updateImage();
}

mainCharacter();
