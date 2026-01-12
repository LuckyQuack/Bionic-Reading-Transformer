document.addEventListener('DOMContentLoaded', () => {
    const transformBtn = document.getElementById('transform-page');
    const restoreBtn = document.getElementById('restore-page');
    const statusText = document.getElementById('status-text');

    // Check current state
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0] || !tabs[0].url || tabs[0].url.startsWith('chrome://')) {
            statusText.textContent = 'Not available';
            transformBtn.disabled = true;
            return;
        }

        chrome.tabs.sendMessage(tabs[0].id, { action: "getState" }, (response) => {
            // Ignore errors if content script not loaded
            if (chrome.runtime.lastError) return;

            if (response) {
                updateUI(response);
            }
        });
    });

    document.getElementById('transform-selection').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "transformSelection" }, (response) => {
                // Optional: feedback
            });
            // Close popup to let user see selection? Or keep open?
            // Usually selection transform is quick.
            // window.close();
        });
    });

    transformBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "transformPage" }, (response) => {
                if (response && response.success) {
                    updateUI({ isTransformed: true, count: response.count });
                }
            });
        });
    });

    restoreBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "restorePage" }, (response) => {
                if (response && response.success) {
                    updateUI({ isTransformed: false, count: 0 });
                }
            });
        });
    });

    document.getElementById('open-options').addEventListener('click', (e) => {
        e.preventDefault();
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options/options.html'));
        }
    });

    function updateUI(state) {
        if (state.isTransformed || state.count > 0) {
            statusText.textContent = `${state.count} items`;
            transformBtn.style.display = 'none';
            restoreBtn.style.display = 'block';
            restoreBtn.disabled = false;
        } else {
            statusText.textContent = 'Ready';
            transformBtn.style.display = 'block';
            restoreBtn.style.display = 'none'; // Use display:none to swap
            restoreBtn.disabled = true;
        }
    }
});
