# Logo Setup Instructions

## Directory Created
A `public/images/` directory has been created for your logo.

## How to Add Your Logo

1. **Place your logo file** in the `public/images/` directory
   - Recommended formats: PNG (with transparency) or JPG
   - Recommended size: 200-400px width for best quality
   - Example filename: `logo.png`

2. **Update Settings Page** to use the public logo by default:
   - Go to Settings page
   - Upload your logo using the logo upload feature
   - OR manually reference it in code

## Alternative: Use Public Logo Path

If you want to use a logo from the public directory instead of Base64:

### Option 1: Set as Default Logo
In `src/pages/Settings.jsx`, you can set a default logo URL:
```javascript
logoUrl: '/images/logo.png'  // This will load from public/images/logo.png
```

### Option 2: Reference in Templates
All templates already support the `logoUrl` from settings. Just make sure your settings have the logo path set.

## Current Implementation
- All 5 templates (Modern, Classic, Minimal, Bold, Elegant) already display logos
- They use `settings.logoUrl` which can be:
  - A Base64 string (uploaded via Settings page)
  - A public path like `/images/logo.png`
  - An external URL

## Next Steps
1. Add your logo file to `public/images/`
2. Go to Settings page and upload it, OR
3. Manually set the logo URL in your database settings table
