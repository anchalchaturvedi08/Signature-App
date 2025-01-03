const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
let painting = false;
let undoStack = [];

// Start Drawing
function startPosition(e) {
    painting = true;
    draw(e);
}

// End Drawing
function endPosition() {
    painting = false;
    ctx.beginPath();
}

// Draw on Canvas
function draw(e) {
    if (!painting) return;
    ctx.lineWidth = document.getElementById("fontSize").value;
    ctx.lineCap = "round";
    ctx.strokeStyle = document.getElementById("textColor").value;

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

// Save canvas state for undo
const saveState = () => {
    undoStack.push(canvas.toDataURL());
};

// Undo the last action
const undo = () => {
    if (undoStack.length > 0) {
        const previousState = undoStack.pop();
        const img = new Image();
        img.src = previousState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
};

// Clear Canvas
document.getElementById("clearBtn").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem("savedSignature"); // Clear saved signature from localStorage
});

// Save & Download Canvas
document.getElementById("saveBtn").addEventListener("click", () => {
    const signatureData = canvas.toDataURL(); // Get canvas as image data
    localStorage.setItem("savedSignature", signatureData); // Save signature to localStorage

    const link = document.createElement("a");
    link.download = "signature.png";
    link.href = signatureData;
    link.click();
});

// Retrieve Saved Signature
document.getElementById("retrieveBtn").addEventListener("click", () => {
    const savedSignature = localStorage.getItem("savedSignature");
    if (savedSignature) {
        const img = new Image();
        img.src = savedSignature;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear current canvas
            ctx.drawImage(img, 0, 0); // Draw the saved signature on the canvas
        };
    } else {
        alert("No saved signature found! Draw and save a signature first.");
    }
});

// Change canvas background color
document.getElementById('canvasBgColor').addEventListener('change', (e) => {
    canvas.style.backgroundColor = e.target.value;
});

// Mouse events for drawing
canvas.addEventListener('mousedown', (e) => {
    saveState(); // Save state before starting a new drawing
    startPosition(e);
});
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

// Undo action
document.getElementById('undoBtn').addEventListener('click', undo);
