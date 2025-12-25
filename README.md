# BIM Automation Studio Landing Page

## Quick Setup Guide

### 1. Upload to GitHub
1. Go to https://github.com/BIM-Automation-Studio/BIM-Automation-Studio.github.io
2. Click "Add file" → "Upload files"
3. Drag and drop `index.html` and `styles.css`
4. Scroll down and click "Commit changes"
5. Wait 2-3 minutes
6. Visit: https://bim-automation-studio.github.io

### 2. Things You MUST Customize

#### Demo Video Links

The **only thing** you need to update is replacing the placeholder video links with your actual YouTube video URLs.

**In index.html, find these 5 links (lines 114-142):**

```html
<a href="YOUR_ROOM_DATA_SYNC_VIDEO_LINK" target="_blank" class="demo-button bluish-button">
<a href="YOUR_STANDARDS_AUDIT_VIDEO_LINK" target="_blank" class="demo-button bluish-button">
<a href="YOUR_BULK_SHEET_CREATOR_VIDEO_LINK" target="_blank" class="demo-button bluish-button">
<a href="YOUR_SMARTPLACE_VIEWS_VIDEO_LINK" target="_blank" class="demo-button bluish-button">
<a href="YOUR_MCP_VIDEO_LINK" target="_blank" class="demo-button bluish-button">
```

**Replace each placeholder with your YouTube video URL:**
- Example: `YOUR_ROOM_DATA_SYNC_VIDEO_LINK` → `https://www.youtube.com/watch?v=ABC123XYZ`

**How to get your YouTube video URL:**
1. Go to your video on YouTube
2. Click "Share" button
3. Copy the URL (example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
4. Paste it in place of the placeholder

### 3. Optional: Add Your Logo

**In index.html (lines 14-17)**, there's a placeholder for your logo:

```html
<a href="#" class="nav-brand">
    <!-- TODO: Add your logo image here -->
    <!-- <img src="logo.png" alt="BIM Automation Studio Logo" class="logo"> -->
    <span>BIM Automation Studio</span>
</a>
```

To add your logo:
1. Upload your logo image to the same directory as `index.html`
2. Uncomment the `<img>` line and update the `src` path
3. Add CSS to `styles.css` if needed for logo sizing

### 4. Already Configured ✓

These items are already set up and don't need changes:
- ✅ LinkedIn URL: https://www.linkedin.com/in/ericupshur
- ✅ Email: bimautomationstudio@gmail.com
- ✅ YouTube channel: @BIMAutomationStudio
- ✅ About Me section with your experience
- ✅ Hero stats with qualitative benefits
- ✅ Services section with pyRevit and MCP tools
- ✅ Contact section with proper formatting
- ✅ Footer updated to 2025

## Testing Locally (Optional)

To preview the page before uploading:
1. Double-click `index.html`
2. It will open in your browser
3. Make edits, save, and refresh to see changes

## File Structure

```
/
├── index.html      # Main landing page
├── styles.css      # All styling and CSS
└── README.md       # This file
```

## Need Help?

If something looks off or you need to make changes, reach out!
