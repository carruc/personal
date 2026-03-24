# AI Agent Guide: Creating a Personal Website with the Clarity Template

This guide provides instructions for AI agents on how to modify the "Clarity" template (a GitHub Pages preset originally designed for AI research) into a personal website featuring a custom header, a homepage with recent articles, and individual article pages.

## Overview of the Clarity Template
The Clarity template uses a highly modular structure based on HTML containers and CSS. The layout relies heavily on `<div class="container blog ...">` blocks for structuring content.
- Code style features: `highlight.js` for code blocks, `MathJax` for LaTeX math.
- Icons: Uses `FontAwesome` (free version linked in the `<head>`).

## Step-by-Step Implementation Guide

### 1. Building the Homepage (`index.html`)
Use the `minimal.html` file as your baseline to create `index.html`. 

#### A. The Header / Hero Section
Locate the first content container: `<div class="container blog" id="first-content" ...>`. This will be the user's profile header.
1. **Name & Surname:** Update `<h1 class="title">` with the user's full name.
2. **Bio / Intro:** Update `<p class="abstract">` with a brief introduction or bio.
3. **Remove Academic Fluff:** Delete academic-specific paragraphs like `<p class="author">` and affiliations if not relevant.
4. **Social Links:** Find the `<div class="info">` block containing link buttons (`<a class="button icon">`).
   - Modify the `href` to point to the user's LinkedIn, GitHub, Resume, Email, etc.
   - Update the text (e.g., "LinkedIn").
   - Update the FontAwesome icons (e.g., `<i class="fa-brands fa-linkedin"></i>`, `<i class="fa-brands fa-github"></i>`, `<i class="fa-solid fa-file-lines"></i>`).
   - *Note: Ensure you are using classes compatible with FontAwesome Free 6.6.0 (which is imported in the template).*
5. **Profile Picture:** If the user provides a picture, replace the `assets/figures/clarity.png` images in the `<div class="blog-cover">` section. If no picture is needed, change the container class from `blog-title` to `blog-title no-cover` and delete the `<div class="blog-cover">` block entirely.

#### B. The Recent Articles Section
Delete the existing placeholder content blocks below the hero section in `minimal.html` and replace them with a new container for articles:
```html
<div class="container blog main" id="recent-articles">
    <h1>Recent Articles</h1>
    
    <!-- Example Article Entry -->
    <div style="margin-bottom: 2.5rem;">
        <h2 style="margin-bottom: 0.5rem;">
            <a href="articles/my-first-article.html" style="text-decoration: none; color: inherit;">
                Article Title Goes Here
            </a>
        </h2>
        <p class="text" style="color: #666; font-size: 0.9em; margin-top: 0;">October 28, 2024 &bull; 5 min read</p>
        <p class="text">A brief summary, excerpt, or description of what this article covers goes here...</p>
        <a href="articles/my-first-article.html" style="font-weight: bold;">Read Article &rarr;</a>
    </div>

    <!-- Additional articles follow the same structure -->
</div>
```

---

### 2. Creating Article Pages
For the actual articles, create separate HTML files (e.g., `articles/my-article.html`). You should copy the `<head>` and script imports from `index.html` to maintain styling.

#### A. Article Header
Adapt the hero section to serve as the article's title block:
```html
<div class="container blog" id="first-content" style="background-color: #E0E4E6;">
    <div class="blog-title no-cover">
        <div class="blog-intro">
            <div>
                <a href="../index.html" style="text-decoration: none;">&larr; Back to Home</a>
                <h1 class="title">The Title of the Article</h1>
                <p class="author">Date &bull; Author Name</p>
            </div>
        </div>
    </div>
</div>
```

#### B. Article Content
Use `<div class="container blog main">` blocks for paragraphs of text.
- **Text:** Wrap paragraphs in `<p class="text">`. Use `<h1>`, `<h2>`, `<h3>` for headings.
- **Code Snippets:** Wrap code inside `<pre><code class="python">...</code></pre>`.
- **Math:** Use `$...$` for inline equations, and `$$...$$` for block equations.
- **Images/Visuals:** Insert images natively. For figures with varied background treatments, use the pre-built `gray` or `gray-linear` container classes (e.g., `<div class="container blog main gray">`). Don't forget `<p class="caption">` underneath images.

---

### 3. Final Polish and Meta Tags
For any page created or modified:
1. **Meta Data:** Update the `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:url`, and `twitter:` meta tags in the `<head>` so that link previews look professional when shared.
2. **Table of Contents:** If an article is long, ensure `<script src="assets/scripts/navbar.js"></script>` is uncommented in the `<head>`, which beautifully auto-generates a floating table of contents on the left side based on heading tags.
3. **Footer:** Keep the `<div class="container">` footer at the bottom of all files, ensuring proper attribution to the template creator while adding the user's copyright notice.
4. **Paths:** Pay careful attention to relative paths for CSS, JS, and image assets (e.g., changing `assets/` to `../assets/` if moving the article file to a sub-directory).
