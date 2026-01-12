
// State management
const transformedElements = new Map(); // element -> { originalNode, parent }

// Configuration (can be loaded from storage later, default for now)
// Configuration
let config = {
    boldRatio: 0.5,
    minWordLength: 3,
    boldWeight: 700
};

// Initiate config load
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(config, (items) => {
        config = { ...config, ...items };
        console.log('Bionic Reading: Settings loaded', config);
    });
}

// --- Embedded Transformation Logic (was in text-transform.js) ---
const transformationConfig = {
    boldRatio: 0.5,
    minWordLength: 3,
    boldWeight: 700
};

function getBionicText(text, config = transformationConfig) {
    if (!text) return text;
    // Merge config with defaults
    const finalConfig = { ...transformationConfig, ...config };

    // Split by whitespace while preserving it
    const tokens = text.split(/(\s+)/);

    return tokens.map(token => {
        // Skip whitespace tokens
        if (/^\s+$/.test(token)) return token;

        // Extract word and surrounding punctuation
        const match = token.match(/^([^\w]*)(\w+)([^\w]*)$/);
        if (!match) return token;

        const [, prefix, word, suffix] = match;

        // Apply skip rules
        if (word.length < finalConfig.minWordLength) return token;

        // Calculate split point
        const splitPoint = Math.ceil(word.length * finalConfig.boldRatio);
        const boldPart = word.slice(0, splitPoint);
        const normalPart = word.slice(splitPoint);

        // Apply formatting style based on config
        const style = `font-weight: ${finalConfig.boldWeight}`;
        return `${prefix}<strong class="bionic-bold" style="${style}">${boldPart}</strong>${normalPart}${suffix}`;
    }).join('');
}
// --- End Embedded Logic ---

console.log('Bionic Reading Extension: Content script loaded (merged version)');

/**
 * Traverses and transforms text nodes
 */
function transformNode(node) {
    // Only process text nodes
    if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentElement;

        // Skip if already transformed or in excluded tags
        if (parent.closest('.bionic-transformed, script, style, code, pre, noscript, iframe, textarea, input, [contenteditable]')) {
            return;
        }

        // Skip empty text
        if (!node.textContent.trim()) return;

        const originalText = node.textContent;
        const bionicHTML = getBionicText(originalText, config);

        if (bionicHTML !== originalText) {
            // Create wrapper span
            const wrapper = document.createElement('span');
            wrapper.className = 'bionic-transformed';
            wrapper.innerHTML = bionicHTML;

            // Store original state
            transformedElements.set(wrapper, {
                originalNode: node.cloneNode(true),
                parent: parent
            });

            // Replace text node with wrapper
            node.replaceWith(wrapper);
        }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Recursively process child nodes
        Array.from(node.childNodes).forEach(transformNode);
    }
}

/**
 * Transforms the current user selection
 */
function transformSelection() {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) {
        // Attempt to notify user even if filtered
        showNotification("Please select some text first");
        return;
    }

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    let topElement = container.nodeType === Node.ELEMENT_NODE
        ? container
        : container.parentElement;

    const existingTransform = topElement.closest('.bionic-transformed');
    if (existingTransform) {
        restoreElement(existingTransform);
        return;
    }

    const walker = document.createTreeWalker(
        topElement,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                if (selection.containsNode(node, true)) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        }
    );

    const nodesToTransform = [];
    let currentNode = walker.nextNode();
    while (currentNode) {
        nodesToTransform.push(currentNode);
        currentNode = walker.nextNode();
    }

    if (nodesToTransform.length === 0 && container.nodeType === Node.TEXT_NODE) {
        nodesToTransform.push(container);
    }

    nodesToTransform.forEach(transformNode);
    selection.removeAllRanges();
}

function restoreElement(element) {
    const state = transformedElements.get(element);
    if (state) {
        if (state.parent.contains(element)) {
            element.replaceWith(state.originalNode);
        }
        transformedElements.delete(element);
    }
}

function restoreAll() {
    Array.from(transformedElements.keys()).forEach(element => {
        restoreElement(element);
    });
    transformedElements.clear();
}

function showNotification(message) {
    console.log('Bionic Notification:', message);
    const notif = document.createElement('div');
    notif.className = 'bionic-notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// Message Listening
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Bionic Reading Extension: Received message', message.action);
    switch (message.action) {
        case "transformSelection":
            transformSelection();
            sendResponse({ success: true });
            break;

        case "transformPage":
            showNotification('Analyzing page...');
            setTimeout(() => {
                transformNode(document.body);
                sendResponse({
                    success: true,
                    count: transformedElements.size
                });
                showNotification(`Transformed ${transformedElements.size} items`);
            }, 50); // Small delay to let notification show
            break;

        case "restorePage":
            restoreAll();
            sendResponse({ success: true });
            break;

        case "getState":
            sendResponse({
                isTransformed: transformedElements.size > 0,
                count: transformedElements.size
            });
            break;
    }
    return true;
});
