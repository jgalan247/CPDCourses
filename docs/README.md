# AI Tools for Teachers - Website

This is the online learning platform for the AI Tools for Teachers CPD programme.

## Viewing the Website

**Live Site:** Once deployed via GitHub Pages, the site will be available at:
`https://jgalan247.github.io/CPDCourses/`

## Local Development

To view the website locally:

1. Navigate to the `docs/` folder
2. Open `index.html` in your web browser
3. Or use a local server:
   ```bash
   cd docs
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## Structure

```
docs/
├── index.html           # Homepage with all modules
├── module1.html         # Module 1: Daily Tasks
├── module2.html         # Module 2: Assessment (coming soon)
├── module3.html         # Module 3: Student AI Literacy (coming soon)
├── css/
│   ├── style.css        # Main styles
│   └── module.css       # Module-specific styles
└── js/
    └── main.js          # Interactive features & progress tracking
```

## Features

- **Responsive Design:** Works on desktop, tablet, and mobile
- **Progress Tracking:** Saves user progress in browser localStorage
- **Interactive Activities:** Hands-on exercises with immediate feedback
- **Module Navigation:** Clear learning pathways
- **Resource Access:** Direct links to all materials

## Deploying to GitHub Pages

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Select "Deploy from a branch"
   - Branch: Select `main` (or your branch name)
   - Folder: Select `/docs`
   - Click Save

2. **Wait for deployment:**
   - GitHub will build and deploy automatically
   - Check Actions tab for deployment status
   - Site will be live at: `https://jgalan247.github.io/CPDCourses/`

3. **Update domain (optional):**
   - Can add custom domain in Settings → Pages

## Technologies Used

- **HTML5:** Semantic markup
- **CSS3:** Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript:** No frameworks needed
- **LocalStorage:** Client-side progress tracking
- **Google Fonts:** Inter font family

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Customization

To customize colors and branding, edit CSS custom properties in `css/style.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #7c3aed;
    --accent-color: #f59e0b;
    /* ... */
}
```

## Future Enhancements

- [ ] Complete Module 2 and 3 pages
- [ ] Add embedded videos
- [ ] Certificate generation
- [ ] Export progress reports
- [ ] Discussion forum integration

## Support

For issues or questions, open an issue on GitHub.

---

**Created:** November 2025
**Last Updated:** November 2025
