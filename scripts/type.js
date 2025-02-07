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

// Style configurations
const strokeStyles = [
    { name: 'Normal', value: 'normal' },
    { name: 'Bold', value: 'bold' },
    { name: 'Italic', value: 'italic' },
    { name: 'Bold Italic', value: 'bold italic' }
];

// Function to create style controls
function createStyleControls() {
    const controls = document.createElement('div');
    controls.classList.add('style-controls');

    // Style selector (kept for font styles)
    const styleDiv = document.createElement('div');
    styleDiv.classList.add('control-group');
    styleDiv.innerHTML = '<label>Style:</label>';
    const styleSelect = document.createElement('select');
    strokeStyles.forEach(style => {
        const option = document.createElement('option');
        option.value = style.value;
        option.textContent = style.name;
        styleSelect.appendChild(option);
    });
    styleDiv.appendChild(styleSelect);

    controls.appendChild(styleDiv);

    return {
        container: controls,
        getStyles: () => ({
            style: styleSelect.value
        })
    };
}

let styleControls;

// Function to generate font styles and display them as downloadable images
function generateFonts() {
    const textInput = document.getElementById('textInput').value;
    const container = document.getElementById('fontStylesContainer');
    container.innerHTML = ''; // Clear previous fonts

    // Create style controls if they don't exist
    if (!styleControls) {
        styleControls = createStyleControls();
        container.appendChild(styleControls.container);
    }

    fonts.forEach((font, index) => {
        const fontDesignDiv = document.createElement('div');
        fontDesignDiv.classList.add('fontDesign');
        
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');

        // Get current styles (only style is included now)
        const styles = styleControls.getStyles();
        
        // Apply text styles (only style is used)
        ctx.font = `${styles.style} 40px ${font.family}`;  // Fixed size (40px)
        ctx.fillStyle = '#000000';  // Default color (black)
        ctx.fillText(textInput, 10, 50); // Position text

        fontDesignDiv.appendChild(canvas);

        const downloadBtn = document.createElement('button');
        downloadBtn.classList.add('downloadBtn');
        downloadBtn.textContent = 'Download';

        downloadBtn.addEventListener('click', function () {
            const link = document.createElement('a');
            link.download = `fontDesign-${index}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
        
        fontDesignDiv.appendChild(downloadBtn);
        container.appendChild(fontDesignDiv);
    });
}

// Initial color button activation (removed as there is no color option now)
document.addEventListener('DOMContentLoaded', () => {
    generateFonts();
});
