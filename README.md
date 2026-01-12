# Bionic Reading Extension

A Chrome extension that improves reading speed and comprehension by applying "Bionic Reading" formatting to web pages. This technique bolds the first few letters of each word, guiding the eye through the text.

## Features

-   **Transform Page**: Apply bionic reading formatting to the entire webpage.
-   **Transform Selection**: Apply formatting only to selected text.
-   **Keybindings**: Use `Ctrl+Shift+V` (or `Command+Shift+V` on Mac) to transform selected text instantly.
-   **Customizable Settings**:
    -   **Bold Ratio**: Adjust how much of the word is bolded (10% - 100%).
    -   **Minimum Word Length**: Skip words shorter than a specific length.
    -   **Bold Weight**: Choose between Normal, Semi-Bold, Bold, and Black weights.
-   **Privacy Focused**: All processing happens locally on your device. No data is sent to external servers.

## Installation

1.  Clone or download this repository.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the project folder (`bionic-reading-extension`).

## Usage

### Transforming a Page
1.  Click the extension icon (Letter 'B') in the browser toolbar.
2.  Click **Transform Page**.
3.  The page text will update immediately.

### Transforming a Selection
1.  Select any text on a webpage.
2.  Right-click usage is not currently supported, but you can:
    -   Press `Ctrl+Shift+V` (Windows/Linux) or `Command+Shift+V` (Mac).
    -   OR Open the popup and click **Transform Selection**.

### Changing Settings
1.  Open the extension popup.
2.  Click **Settings** at the bottom.
3.  Adjust your preferences and click **Save**.
4.  **Note**: detailed settings require a page reload to take effect on already open tabs.

## Development

### Prerequisites
-   Node.js and npm (for running tests)

### Running Tests
This project uses **Jest** for unit testing the core transformation algorithm.

```bash
npm install
npm test
```

### Project Structure
-   `content/`: Scripts and styles injected into webpages.
-   `background/`: Service worker for handling commands.
-   `popup/`: The extension popup UI.
-   `options/`: Settings page UI and logic.
-   `utils/`: Shared utilities (tests).
-   `manifest.json`: Extension configuration.

## Limitations
-   Does not work on PDF files (Chrome limitation).
-   May have limited functionality on complex Single Page Applications (SPAs) like Twitter/X that use virtualized lists.
