
// Default configuration matching the one in content script
const defaultSettings = {
    boldRatio: 0.5,
    minWordLength: 3,
    boldWeight: 700
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('reset').addEventListener('click', resetOptions);

// Range slider value display
document.getElementById('boldRatio').addEventListener('input', (e) => {
    document.getElementById('boldRatioValue').textContent = e.target.value;
});

function saveOptions() {
    const settings = {
        boldRatio: parseFloat(document.getElementById('boldRatio').value),
        minWordLength: parseInt(document.getElementById('minWordLength').value, 10),
        boldWeight: parseInt(document.getElementById('boldWeight').value, 10)
    };

    chrome.storage.sync.set(settings, () => {
        // Notify user
        const status = document.getElementById('status');
        status.textContent = 'Options saved. Reload pages to see changes.';
        status.classList.add('show');
        setTimeout(() => {
            status.classList.remove('show');
        }, 3000);
    });
}

function restoreOptions() {
    chrome.storage.sync.get(defaultSettings, (items) => {
        document.getElementById('boldRatio').value = items.boldRatio;
        document.getElementById('boldRatioValue').textContent = items.boldRatio;
        document.getElementById('minWordLength').value = items.minWordLength;
        document.getElementById('boldWeight').value = items.boldWeight;
    });
}

function resetOptions() {
    document.getElementById('boldRatio').value = defaultSettings.boldRatio;
    document.getElementById('boldRatioValue').textContent = defaultSettings.boldRatio;
    document.getElementById('minWordLength').value = defaultSettings.minWordLength;
    document.getElementById('boldWeight').value = defaultSettings.boldWeight;
}
