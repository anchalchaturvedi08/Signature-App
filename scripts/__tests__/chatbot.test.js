const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require('jsdom');

describe('Chatbot UI initialization', () => {
    let window, document;
    beforeEach(() => {
        const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
            runScripts: "dangerously"
        });
        window = dom.window;
        document = window.document;
        // Mock localStorage
        window.localStorage = {
            getItem: jest.fn(() => null),
            setItem: jest.fn()
        };
        // Load the script in the JSDOM context
        const scriptContent = require('fs').readFileSync('C:/Users/hp/Downloads/Signature-App/scripts/chatbot.js', 'utf-8');
        const scriptEl = document.createElement('script');
        scriptEl.textContent = scriptContent;
        document.body.appendChild(scriptEl);
        
        // Trigger DOMContentLoaded so the script starts
        document.dispatchEvent(new window.Event('DOMContentLoaded'));
    });

    test('should inject chat widget into DOM', () => {
        const chatWidget = document.getElementById('quicksign-chat-widget');
        expect(chatWidget).not.toBeNull();
        const fab = document.getElementById('chatFabBtn');
        expect(fab).not.toBeNull();
    });
});
