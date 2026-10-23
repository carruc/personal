# Archived article migration

Source: https://github.com/carruc/carruc-eu, commit `703eb9638172d43fff6d272b252c6576da1fd7d8`.

| Original post | New URL | Original date |
| --- | --- | --- |
| Contro il Gene Egoista | /articles/contro-teoria-gene-egoista/ | 2025-07-09 |
| Sulla Ruminazione | /articles/sulla-ruminazione/ | 2025-09-07 |
| Be CREACTIVE | /articles/creactive-guide/ | 2025-10-22 |

The former root-level slug URLs redirect to the new article URLs using static HTML redirects with canonical links and a visible fallback link. No server-side redirects are available on GitHub Pages.

Original titles, introductory descriptions, dates (from Jekyll filenames), categories, Markdown prose, and bibliography links are retained. Markdown headings move down one level to sit beneath the page title and populate the section index. The three article illustrations are copied byte-for-byte into their original `/assets/images/` paths and used in the detail sidebar. The external Denis Noble image remains at its original URL; external resource availability has not been checked.

At the author's request, the eight notes in “Contro il Gene Egoista” are retained as a numbered “Note” section at the end of the article. Their wording and links are unchanged; the original inline footnote markers and Markdown footnote definitions have been removed. There is no footnote plugin or floating sidenote system.

Italian articles declare `lang: it`; the English guide declares `lang: en-GB`. The articles are imported as published content (`draft: false`) because they were already published on the archived site. No substantive editing or factual review was performed. Legacy analytics, comments, fonts, and scripts are not imported.
