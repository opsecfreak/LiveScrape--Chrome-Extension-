# Customer Data Extractor - Chrome Extension

This Chrome extension allows you to automatically scan any webpage for customer contact information (names, emails, and phone numbers). It actively scans the page as you navigate, including through pagination, and compiles a clean, duplicate-free list of contacts.

## Features

- **Automatic Scanning**: Finds contacts on the page with the click of a button.
- **Continuous Monitoring**: Detects and scans new content added to the page, perfect for infinite scrolling and pagination.
- **Duplicate Prevention**: Ensures each unique contact (based on email) is only added once.
- **Visual Highlighting**: Temporarily highlights detected contacts on the page for confirmation.
- **Data Export**: Export the collected contact list to CSV or HTML format.

## Installation and Setup

Because this extension uses modern web development tools, you need to "build" it from the source code before you can install it in Chrome. This process compiles all the code into a format Chrome can understand.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (which includes `npm`) installed on your computer. You can download it from the official website.

### Step 1: Set Up the Project

1.  **Download the Code**: Download the source code and unzip it to a folder on your computer.
2.  **Open a Terminal**: Open a terminal or command prompt window.
3.  **Navigate to the Folder**: Use the `cd` command to navigate into the folder you just unzipped. For example: `cd path/to/your/folder`
4.  **Install Dependencies**: Run the following command. This will download all the necessary tools for the project.
    ```bash
    npm install
    ```
5.  **Build the Extension**: Run the following command. This will compile the code and create a new folder named `dist` inside your project directory.
    ```bash
    npm run build
    ```

### Step 2: Load the Extension in Chrome

Now you will load the compiled code from the `dist` folder into Chrome.

1.  **Open Chrome Extensions**: Open Google Chrome and navigate to `chrome://extensions`.
2.  **Enable Developer Mode**: In the top-right corner of the Extensions page, find the toggle for **Developer mode** and turn it **ON**.
3.  **Load the Extension**:
    *   Click the **Load unpacked** button that appeared when you enabled Developer Mode.
    *   A file dialog will open. Navigate to your project folder and select the **`dist`** folder inside it.
    *   Click **Select Folder**.

4.  **Done!**: The "Customer Data Extractor" extension will now appear in your list. Pin it to your toolbar for easy access!

## How to Use

1.  Navigate to a webpage containing contact information.
2.  Click the extension's icon in your Chrome toolbar.
3.  Click **Start Scanning**. The extension will search the page and highlight what it finds.
4.  As you scroll or navigate, the extension will continue to find new contacts.
5.  Use the buttons in the popup to export your data as a CSV or HTML file, copy emails, or clear the list.
