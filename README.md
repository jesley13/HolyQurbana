# Holy Qurbana Web Application

A responsive, static web application for the Holy Qurbana of the Syro-Malabar Church.

## Features

- **Daily Readings**: View today's liturgical day, season, and readings.
- **BibleGateway Integration**: Click on any reading to open the passage on BibleGateway (ESV translation).
- **Holy Qurbana Text**: The complete and exact text of the English Qurbana, adapted dynamically based on the liturgical season.
- **Mobile-First Design**: Easy to read on a mobile phone with comfortable typography and spacing.
- **Prayer Mode Controls**: Adjust font size and toggle dark mode during the Qurbana.

## Deployment to GitHub Pages

This application is designed to be hosted entirely as a static website on GitHub Pages. No backend server or database is required.

### Steps to Deploy:

1. **Create a GitHub Repository**: 
   - Create a new repository on your GitHub account.
2. **Upload Files**: 
   - Upload the following files to the root of your new repository:
     - `index.html`
     - `style.css`
     - `app.js`
     - `mass-data.js`
     - `readings.js`
     - `README.md`
3. **Enable GitHub Pages**:
   - Go to your repository's **Settings** tab.
   - Navigate to **Pages** in the left sidebar.
   - Under "Build and deployment", set the **Source** to `Deploy from a branch`.
   - Under **Branch**, select `main` (or `master`) and save.
4. **Access Your Site**:
   - Within a few minutes, GitHub will publish your site. You can access it via the URL provided in the Pages settings (typically `https://<your-username>.github.io/<repository-name>/`).

## Architecture & Data

- `mass-data.js`: Contains the parsed content from the original Qurbana DOCX, structured by section. Seasonal texts are grouped under their respective sections.
- `readings.js`: Contains the date-based readings configuration. To add new readings, simply append a new date object following the established JSON structure.
- `app.js`: Handles routing between screens, seasonal text replacement, and UI state.
- `style.css`: Uses CSS Variables for theming (including dark mode) and ensures the UI scales properly across mobile and desktop.
