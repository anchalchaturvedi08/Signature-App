const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let painting = false;
let undoStack = [];
let startX, startY, endX, endY, cropping = false;
let cropRect = null;

// --- Drawing Functions ---
const draw = (e) => {
    if (!painting) return;
    ctx.lineWidth = document.getElementById('fontSize').value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = document.getElementById('textColor').value;

    if (!e.buttons && painting) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
};

const startPosition = (e) => {
    const rect = canvas.getBoundingClientRect();
    if (cropping) {
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;

        cropRect = document.createElement('div');
        cropRect.style.position = 'absolute';
        cropRect.style.border = '1px dashed red';
        cropRect.style.left = e.clientX + 'px';
        cropRect.style.top = e.clientY + 'px';
        cropRect.style.pointerEvents = 'none'; // Prevent interference with canvas
        cropRect.style.zIndex = '1000';

        document.body.appendChild(cropRect);
    } else {
        painting = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
};


const finishedPosition = () => {
    painting = false;
    if (cropping) {
        crop();
    }
};


// --- Cropping Logic ---
const crop = () => {
    if (!cropping) return;
    cropping = false;

    const rect = canvas.getBoundingClientRect();
    const width = endX - startX;
    const height = endY - startY;

    if (width <= 0 || height <= 0) {
        if (cropRect) {
            document.body.removeChild(cropRect);
            cropRect = null;
        }
        return;
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(
        canvas,
        startX,
        startY,
        width,
        height,
        0,
        0,
        width,
        height
    );

    const croppedDataURL = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = croppedDataURL;
    link.download = 'signature.png';
    link.click();

    if (cropRect) {
        document.body.removeChild(cropRect);
        cropRect = null;
    }
};


// --- Undo/Redo ---
const saveState = () => {
    undoStack.push(canvas.toDataURL());
};

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


// --- Event Listeners ---
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (cropping) {
        endX = e.clientX - rect.left;
        endY = e.clientY - rect.top;

        if (cropRect) {
            cropRect.style.width = `${endX - startX}px`;
            cropRect.style.height = `${endY - startY}px`;
        }
    } else {
        draw(e);
    }
});

canvas.addEventListener('mouseleave', finishedPosition);
canvas.addEventListener('mouseenter', draw);
canvas.addEventListener('mousedown', saveState);




document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('saveBtn').addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'signature.png';
    link.click();
});

document.getElementById('retrieveBtn').addEventListener('click', () => {
    const savedImage = localStorage.getItem('savedSignature');
    if (savedImage) {
        const img = new Image();
        img.src = savedImage;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
    } else {
        alert('No saved signature found!');
    }
});

document.getElementById('undoBtn').addEventListener('click', undo);

document.getElementById('canvasBgColor').addEventListener('change', (e) => {
    canvas.style.backgroundColor = e.target.value;
});

document.getElementById('cropBtn').addEventListener('click', () => {
    cropping = true;
});


