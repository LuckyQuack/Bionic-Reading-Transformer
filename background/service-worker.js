
chrome.commands.onCommand.addListener((command) => {
    if (command === "transform-selection") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "transformSelection" });
            }
        });
    }
});

// Installation listener
chrome.runtime.onInstalled.addListener(() => {
    // Can set default settings here if not using local storage default fallback
});
