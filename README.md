# Signature-App

A simple and interactive **Signature App** that allows users to draw their signature, customize its appearance, save it as an image, and retrieve saved signatures.  

---

## 🌟 Features
- **Draw your signature**: Draw your custom signature using your mouse or touch screen.
- **Customization options**: Choose the text color, canvas background color, and font size.
- **Clear canvas**: Clear the drawing and start a new signature.
- **Undo**: Undo the signature.
- **Save & Download**: Save the drawn signature as a PNG file and download it to your device.
- **Retrieve Saved Signature**: This feature retrieves your last saved signature from the browser storage (localStorage) after refreshing the page.
  - When you save your signature, it is stored in the browser's local storage.
  - Upon refreshing the page, your saved signature will be automatically restored on the canvas, so you can continue working on it.
- **User-friendly interface**: Simple and intuitive controls for customizing the signature.

## Retrieve Saved Signature
The **Retrieve Saved Signature** feature works as follows:
1. Draw your signature on the canvas and save it.
2. Once saved, the signature is stored in the browser's localStorage.
3. After a page refresh, the saved signature will be automatically retrieved and displayed on the canvas.

**Important Notes**:
- This feature works even after refreshing the page, as long as the browser's localStorage is not cleared.
- The canvas is restored with the last saved signature without requiring any additional user interaction.
- If you want to clear the saved signature, click the "Clear" button, which will remove it from the canvas and reset the storage.