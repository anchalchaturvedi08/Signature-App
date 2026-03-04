document.addEventListener('DOMContentLoaded', () => {
    // Inject Chat UI Skeleton dynamically if not already present
    if (!document.getElementById('quicksign-chat-widget')) {
        const chatHTML = `
            <div id="quicksign-chat-widget">
                <!-- Chat Window -->
                <div class="chat-window" id="chatWindow">
                    <div class="chat-header">
                        <h3><i class="fa-solid fa-robot"></i> QuickSign AI</h3>
                        <button class="close-chat" id="closeChatBtn"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    
                    <!-- API Key Setup State -->
                    <div class="api-key-setup" id="apiKeySetup">
                        <i class="fa-solid fa-key" style="font-size: 32px; color: #6366f1;"></i>
                        <p>To use the real AI chatbot, please provide your free Gemini API key. It will be stored securely in your browser's local storage.</p>
                        <input type="password" id="geminiApiKeyInput" placeholder="Paste your API Key here">
                        <button id="saveApiKeyBtn">Save Configuration</button>
                        <a href="https://aistudio.google.com/app/apikey" target="_blank">Get a free Gemini API key</a>
                    </div>

                    <!-- Active Chat State -->
                    <div id="activeChatContainer" style="display: none; height: 100%; flex-direction: column;">
                        <div class="chat-messages" id="chatMessages">
                            <div class="message bot">Hello! I'm the QuickSign AI assistant. How can I help you today?</div>
                        </div>
                        <div class="chat-input-area">
                            <input type="text" id="chatInputMessage" placeholder="Ask me anything..." autocomplete="off">
                            <button id="sendChatBtn"><i class="fa-solid fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>

                <!-- Floating Action Button -->
                <button class="chat-fab" id="chatFabBtn">
                    <i class="fa-solid fa-message"></i>
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    // DOM Elements
    const chatFabBtn = document.getElementById('chatFabBtn');
    const chatWindow = document.getElementById('chatWindow');
    const closeChatBtn = document.getElementById('closeChatBtn');

    const apiKeySetup = document.getElementById('apiKeySetup');
    const activeChatContainer = document.getElementById('activeChatContainer');
    const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
    const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');

    const chatMessages = document.getElementById('chatMessages');
    const chatInputMessage = document.getElementById('chatInputMessage');
    const sendChatBtn = document.getElementById('sendChatBtn');

    // Toggle Chat Window
    function toggleChat() {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            checkApiKey();
        }
    }

    chatFabBtn.addEventListener('click', toggleChat);
    closeChatBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // API Key Management
    function checkApiKey() {
        const storedKey = localStorage.getItem('quicksign_gemini_api_key');
        if (storedKey) {
            geminiApiKeyInput.value = storedKey;
            showActiveChat();
        } else {
            showSetup();
        }
    }

    function showSetup() {
        apiKeySetup.style.display = 'flex';
        activeChatContainer.style.display = 'none';
    }

    function showActiveChat() {
        apiKeySetup.style.display = 'none';
        activeChatContainer.style.display = 'flex';
        chatInputMessage.focus();
    }

    saveApiKeyBtn.addEventListener('click', () => {
        const key = geminiApiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('quicksign_gemini_api_key', key);
            showActiveChat();
            addSystemMessage("API key saved locally. You can now chat!");
        } else {
            alert("Please enter a valid API key.");
        }
    });

    // Chat Logic
    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addSystemMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message system`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message bot typing-indicator';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatMessages.appendChild(indicator);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Gemini API Request
    async function sendMessageToGemini(message) {
        const apiKey = localStorage.getItem('quicksign_gemini_api_key');
        if (!apiKey) {
            showSetup();
            return;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        // System context to ensure the bot knows its role
        const systemPrompt = "You are the QuickSign AI assistant, built directly into the QuickSign application. QuickSign is an easy-to-use digital signature maker where users can draw or type their signatures and save them as professional PNGs with transparent backgrounds. You should be helpful, concise, and friendly. Answer questions related to signatures, digital documents, or general productivity, but do so concisely.";

        const payload = {
            system_instruction: {
                parts: { text: systemPrompt }
            },
            contents: [{
                parts: [{ text: message }]
            }]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error) throw new Error(data.error.message || "API Error");
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (data.candidates && data.candidates.length > 0) {
                const botReply = data.candidates[0].content.parts[0].text;
                appendMessage(botReply, 'bot');
            } else {
                appendMessage("I didn't quite understand that.", 'bot');
            }

        } catch (error) {
            console.error("Gemini API Error:", error);
            // Handle common invalid key errors
            if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
                localStorage.removeItem('quicksign_gemini_api_key');
                appendMessage("Oops! It looks like your API key is invalid or expired. I've cleared it. Please set it up again.", 'bot');
                setTimeout(() => showSetup(), 2000);
            } else {
                appendMessage("Sorry, I encountered an error communicating with the server.", 'bot');
            }
        }
    }

    function handleSend() {
        const text = chatInputMessage.value.trim();
        if (text) {
            appendMessage(text, 'user');
            chatInputMessage.value = '';

            // Disable input while thinking
            chatInputMessage.disabled = true;
            sendChatBtn.disabled = true;

            showTypingIndicator();

            sendMessageToGemini(text).finally(() => {
                removeTypingIndicator();
                chatInputMessage.disabled = false;
                sendChatBtn.disabled = false;
                chatInputMessage.focus();
            });
        }
    }

    sendChatBtn.addEventListener('click', handleSend);
    chatInputMessage.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
});
