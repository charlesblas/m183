# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Progressive Web Application (PWA) implementing the M-138 cipher, a historical encryption device. It's built with vanilla JavaScript, HTML5, and CSS3 with no external dependencies or build tools.

## Development Commands

Since this is a vanilla JavaScript application with no build system:

- **Run locally**: 
  - Open `index.html` directly in a browser, OR
  - Use a local server: `python -m http.server 8000` or `npx serve`
- **Test changes**: Refresh browser (clear cache if testing Service Worker changes)
- **Analyze cipher strips**: `python analyze_strips.py` (generates strip_analysis_report.txt)

## Architecture

### Core Files
- `index.html` - Single-page application with encryption/decryption tabs
- `script.js` - Contains M-138 cipher logic, strip data, and UI handlers
- `styles.css` - Responsive design with tab-based interface
- `sw.js` - Service Worker for offline functionality (cache name: 'm138-cipher-v1')
- `manifest.json` - PWA configuration

### Key Components in script.js
- `M138_STRIPS` object: Contains 100 cipher strips (note: only strips 1-25 are valid)
- `encryptMessage()` / `decryptMessage()` - Core cipher operations
- `selectRandomStrips()` - Randomly selects 25 strips for encryption
- `generateValidStrip()` - Generates random valid cipher strips
- Strip visualization with animated scrolling during encryption/decryption
- Interactive offset dial (canvas-based) for setting offset values
- Strip ordering interface with up/down controls
- "Copy from Encryption" feature to transfer settings between tabs

### UI Implementation Details
- Strip numbers are 1-indexed in UI, 0-indexed in arrays
- Dynamic strip visibility (~10 strips shown at once for performance)
- Touch event support for mobile offset dial interaction
- Validation ensures exactly 25 strips selected before encryption/decryption

## Important Notes

1. **Data Quality Issue**: Currently, only cipher strips 1-25 are valid (contain all 26 unique letters A-Z). Strips 26-100 have duplicates or missing letters, making them unusable for proper M-138 cipher operation.

2. **Missing PWA Icons**: The manifest.json references icon-192.png and icon-512.png which are not present in the repository.

3. **No Build Process**: This is a static site - files are served as-is. Any changes take effect immediately upon browser refresh.

4. **Service Worker Testing**: When testing SW changes, use browser DevTools to unregister the old SW and clear cache. The SW uses a cache-first strategy.

5. **Historical Context**: The M-138 cipher was a strip cipher device used by the U.S. military. The implementation follows the historical algorithm where 25 strips are selected and arranged to encrypt/decrypt messages.