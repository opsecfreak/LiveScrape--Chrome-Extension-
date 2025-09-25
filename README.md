# Customer Data Extractor - Chrome Extension

This Chrome extension allows you to automatically scan any webpage for customer contact information (names, emails, and phone numbers). It actively scans the page as you navigate, including through pagination, and compiles a clean, duplicate-free list of contacts.

## Features

- **Automatic Scanning**: Finds contacts as soon as you open the extension.
- **Continuous Monitoring**: Uses a `MutationObserver` to detect and scan new content added to the page, perfect for infinite scrolling and pagination.
- **Duplicate Prevention**: Ensures each unique contact (based on email) is only added once.
- **Data Export**: Export the collected contact list to CSV or HTML format with a single click.
- **Simple UI**: A clean, intuitive interface to start/stop scanning, view contacts, and manage your data.

## How to Install

Since this is not on the Chrome Web Store, you need to load it as an "unpacked extension" in developer mode.

1.  **Download the Code**: Download the source code and unzip it to a location you'll remember.

2.  **Open Chrome Extensions**: Open your Google Chrome browser and navigate to `chrome://extensions`. You can also access this page by clicking the three-dots menu in the top-right corner, selecting **Extensions**, and then **Manage Extensions**.

3.  **Enable Developer Mode**: In the top-right corner of the Extensions page, you'll see a toggle for **Developer mode**. Make sure this is switched **ON**.

4.  **Load the Extension**:
    *   With developer mode enabled, you will see new buttons appear. Click on the **Load unpacked** button.
    *   A file dialog will open. Navigate to the directory where you unzipped the extension's source code.
    *   Select the entire folder (the one containing `manifest.json`) and click **Select Folder**.

5.  **Done!**: The "Customer Data Extractor" extension should now appear in your list of extensions. You can pin it to your toolbar for easy access by clicking the puzzle piece icon next to the address bar and then clicking the pin icon next to the extension's name.

## How to Use

1.  Navigate to a webpage that contains a list of customers or contacts.
2.  Click on the Customer Data Extractor icon in your Chrome toolbar to open the popup.
3.  Click the **Start Scanning** button. The extension will immediately begin searching the page for names, emails, and phone numbers.
4.  As you scroll or navigate to other pages (e.g., page 2, page 3), the extension will continue to find and add new contacts to the list.
5.  Once you have collected the data you need, you can:
    *   **Copy All Emails**: Copies a comma-separated list of all email addresses to your clipboard.
    *   **Export as CSV**: Downloads a `customers.csv` file.
    *   **Export as HTML**: Downloads a styled `customers.html` file.
    *   **Clear Data**: Wipes all collected data from the extension's storage.
    *   **Stop Scanning**: Pauses the active scanning process.
