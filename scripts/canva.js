// Get references to the DOM elements
const canvas = document.getElementById('signatureCanvas');  // Canvas element for drawing
const ctx = canvas.getContext('2d');  // 2D context for drawing on the canvas
const clearBtn = document.getElementById('clearBtn');  // Button to clear the canvas
const saveBtn = document.getElementById('saveBtn');  // Button to save the canvas content
const eraserBtn = document.getElementById('eraserBtn');  // Eraser button
const _brushSizeInput = document.getElementById('brushSize');  // Brush size input
const eraserSizeInput = document.getElementById('eraserSize'); //Eraser size input

// Set initial drawing color and properties
let currentColor = '#000000';  // Default color is black
let drawing = false;  // Flag to track if drawing is in progress
let lastX = 0;  // Last X position of the mouse
let lastY = 0;  // Last Y position of the mouse
let lineWidth = 2;  // Line width for drawing
let isEraserActive = false;  // Flag to track if eraser is active
let eraserSize = 10;

// Function to select color
/* exported _selectColor */
function _selectColor(color) {
    currentColor = color;  // Update the current color
    ctx.strokeStyle = currentColor;  // Set the stroke color to the selected color
    isEraserActive = false;  // Deactivate eraser when a color is selected
    canvas.style.cursor = 'crosshair';
}

// Function to update brush size
/* exported _updateBrushSize */
function _updateBrushSize(size) {
    lineWidth = size;  // Update line width based on input
}

function _updateEraserSize(size) {
    eraserSize = size;
}

eraserSizeInput.addEventListener('input', (e) => {
    _updateEraserSize(e.target.value);
});


// Set up the canvas for drawing
function setupCanvas() {
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mousemove', e => {
        if (isEraserActive) drawCursor(e);
    });
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events for mobile/tablets
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
}

function getTouchPos(canvasDom, touchEvent) {
    const rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}

function handleTouchStart(e) {
    e.preventDefault();
    const pos = getTouchPos(canvas, e);
    drawing = true;
    [lastX, lastY] = [pos.x, pos.y];
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!drawing) return;
    const pos = getTouchPos(canvas, e);
    drawLine(pos.x, pos.y);
}

// Start drawing when mouse is pressed
function startDrawing(e) {
    drawing = true;  // Set drawing flag to true
    [lastX, lastY] = [e.offsetX, e.offsetY];  // Set initial drawing coordinates
}

function drawCursor(_e) {
    const cursorCanvas = document.createElement('canvas');
    const cursorCtx = cursorCanvas.getContext('2d');
    const size = eraserSize * 2;
    cursorCanvas.width = size;
    cursorCanvas.height = size;
    cursorCtx.clearRect(0, 0, size, size);
    cursorCtx.beginPath();
    cursorCtx.arc(size / 2, size / 2, eraserSize, 0, Math.PI * 2);
    cursorCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    cursorCtx.fill();
    const cursorURL = cursorCanvas.toDataURL();
    canvas.style.cursor = `url(${cursorURL}) ${eraserSize} ${eraserSize}, auto`;
}

// Stop drawing when mouse is released or moves out of the canvas
function stopDrawing() {
    drawing = false;  // Set drawing flag to false
    ctx.beginPath();  // Begin a new path to prevent connecting to previous paths
}

// Draw on the canvas (Mouse)
function draw(e) {
    if (!drawing) return;
    drawLine(e.offsetX, e.offsetY);
}

function drawLine(x, y) {
    ctx.lineWidth = isEraserActive ? eraserSize : lineWidth;

    if (isEraserActive) {
        ctx.globalCompositeOperation = 'destination-out';
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
    }

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    [lastX, lastY] = [x, y];
}



// Toggle eraser functionality
eraserBtn.addEventListener('click', () => {
    isEraserActive = !isEraserActive; // Toggle eraser state
    if (isEraserActive) {
        eraserBtn.textContent = 'Brush'; // Change button text to indicate brush mode
        canvas.style.cursor = 'none';
        canvas.addEventListener('mousemove', drawCursor);
    } else {
        eraserBtn.textContent = 'Eraser'; // Change button text to indicate eraser mode
        ctx.strokeStyle = currentColor; // Restore stroke color to current color
        canvas.style.cursor = 'crosshair';
        canvas.removeEventListener('mousemove', drawCursor);
    }
});

// Save the canvas content as an image
saveBtn.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png'); // Convert canvas to data URL
    const link = document.createElement('a'); // Create an anchor element
    link.href = dataURL; // Set the data URL as the href
    link.download = 'signature.png'; // Set the download filename
    link.click(); // Trigger the download
});

// Clear the canvas
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
});

// Initialize the canvas setup for drawing
setupCanvas();
