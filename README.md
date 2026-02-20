# Academic Portfolio

A minimalist, responsive personal website for researchers, integrating resume showcase and podcast sharing. Built with plain HTML, CSS, and JavaScript — no dependencies required.

## Features

- **Homepage Banner** — hero section with tagline, stats, and quick-access CTAs
- **About Me** — biography, research background, podcast origin story, and academic timeline
- **Portfolio** — filterable academic publications, blog posts, photography, and code repositories
- **Podcast** — episode archive with in-page audio player, series filter, and show notes
- **Contact** — form with validation, direct email, office hours, and social links
- **Search** — global keyword search across all content types (navbar)
- **Tag Filtering** — category tags by research field, blog topic, and podcast series
- **Downloads** — CV, research statement, papers, and code repository links
- **Visit Counter** — localStorage-based daily visitor tracking
- **Responsive** — mobile-first design, adapts to all screen sizes

## Design

- **Color scheme:** Black, white, and gray (#000 → #fff)
- **Typography:** Georgia/serif for body text, Helvetica Neue/sans-serif for UI
- **Style:** Minimalist, typographic-first, no unnecessary visual elements

## Structure

```
├── index.html          # Homepage (Banner, Featured Works, About preview, Downloads)
├── about.html          # About Me (Biography, Research Background, Timeline)
├── portfolio.html      # Portfolio (Publications, Blog, Code, Photography)
├── podcast.html        # Podcast (Episodes, Series, Reflections)
├── contact.html        # Contact (Form, Info, Tag Index)
├── css/
│   └── style.css       # Full stylesheet (responsive, variables, components)
├── js/
│   └── main.js         # Navigation, search, tag filter, visit counter, podcast player
└── assets/
    └── downloads/      # CV, papers, and other downloadable files
```

## Tag System

| Category | Tags |
|---|---|
| Research Fields | NLP, Deep Learning, Machine Learning, Multimodal AI, Knowledge Graphs, Graph Learning, Information Retrieval, Foundation Models, Cognitive Science |
| Podcast Series | NLP Series, ML Tools Series, Open Science Series |
| Blog Topics | Research Methods, Open Science, Academic Career, Productivity, Science Communication, AI Policy |

## Customization

1. Replace placeholder text in all HTML files with your actual content.
2. Replace files in `assets/downloads/` with your actual CV, papers, and other documents.
3. Update `js/main.js` → `SITE_DATA` array with your actual works and podcast episodes.
4. Update name, institution, and contact details throughout all pages.
