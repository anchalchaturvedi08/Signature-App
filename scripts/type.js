// Event listener for the generate button, triggering the font generation process
document.getElementById('generateBtn').addEventListener('click', generateFonts);

// Array holding font details including name, class for CSS, and the font family
const fonts = [
    { name: 'Cedarville Cursive', class: 'cedarville-cursive-regular', family: '"Cedarville Cursive", cursive' },
    { name: 'Shadows Into Light Two', class: 'shadows-into-light-two-regular', family: '"Shadows Into Light Two", cursive' },
    { name: 'Aguafina Script', class: 'aguafina-script-regular', family: '"Aguafina Script", cursive' },
    { name: 'Euphoria Script', class: 'euphoria-script-regular', family: '"Euphoria Script", cursive' },
    { name: 'Bad Script', class: 'bad-script-regular', family: '"Bad Script", cursive' },
    { name: 'Bilbo Swash Caps', class: 'bilbo-swash-caps-regular', family: '"Bilbo Swash Caps", cursive' },
    { name: 'Arizonia', class: 'arizonia-regular', family: '"Arizonia", cursive' },
    { name: 'Satisfy', class: 'satisfy-regular', family: '"Satisfy", cursive' },
    { name: 'Dancing Script', class: 'dancing-script-<uniquifier>', family: '"Dancing Script", cursive' },
    { name: 'Allura', class: 'allura-regular', family: '"Allura", cursive' }
];

// Function to generate font styles and display them as downloadable images
function generateFonts() {
    // Get the user input text for the font styles
    const textInput = document.getElementById('textInput').value;
    // Reference the container element where font designs will be displayed
    const container = document.getElementById('fontStylesContainer');
    // Clear the previous font design elements before generating new ones
    container.innerHTML = '';

    // Iterate over each font and create the respective design
    fonts.forEach((font, index) => {
        // Create a new div element to hold each font design
        const fontDesignDiv = document.createElement('div');
        fontDesignDiv.classList.add('fontDesign');

        // Create a canvas element for rendering the text in the selected font
        const canvas = document.createElement('canvas');
        canvas.width = 400;  // Set canvas width
        canvas.height = 150; // Set canvas height
        const ctx = canvas.getContext('2d');  // Get the canvas 2D drawing context

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Ensure transparent background

        // Apply the font-family and font size to the canvas context
        ctx.font = `60px ${font.family}`;
        ctx.fillStyle = '#1e293b'; // Set text color to deep slate
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(textInput, canvas.width / 2, canvas.height / 2);  // Draw the input text on the canvas

        // Append the canvas element to the font design div
        fontDesignDiv.appendChild(canvas);

        // Create a download button for the user to save the font design as an image
        const downloadBtn = document.createElement('button');
        downloadBtn.classList.add('downloadBtn');
        downloadBtn.textContent = 'Download';  // Button text

        // Add click event to the download button to trigger the download process
        downloadBtn.addEventListener('click', function () {
            const dataURL = canvas.toDataURL();
            
            // Persist to local storage
            const userStr = localStorage.getItem("currentUser");
            const email = userStr ? JSON.parse(userStr).email : "guest";
            let docs = JSON.parse(localStorage.getItem(`docs_${email}`)) || [];
            docs.unshift({ date: new Date().toISOString(), data: dataURL });
            if(docs.length > 20) docs.pop(); // limit size
            localStorage.setItem(`docs_${email}`, JSON.stringify(docs));

            const link = document.createElement('a'); // Create an invisible anchor link
            link.download = `fontDesign-${index}.png`; // Set the filename for the image download
            link.href = dataURL;  // Convert the canvas to a base64 image
            link.click();  // Trigger the click event to initiate download
        });

        // Append the download button to the font design div
        fontDesignDiv.appendChild(downloadBtn);
        // Append the font design div to the container for display
        container.appendChild(fontDesignDiv);
    });
}
