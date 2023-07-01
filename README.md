# Dotawo Journal Zotero Translator

Zotero Translator (citation grabber) for [Dotawo - A Journal of Nubian Studies](https://pages.sandpoints.org/dotawo/journal/). 

Issues: 
- Zotero saves an HTML snapshot of the page locally. This works when scraping single items (an article page). In the case of scraping citations from the Sitemap or an issue, the offline page saved is the Sitemap or the Issue page, not the article page (FIX).
- Dotawo does not expose the publication date of its articles! Therefore date (publication date) remains empty. 

# Metadata 
| Metadata field | Status |
|-|-|
| itemType | "journalArticle" | 
| creators (authors) | automatically scraped| 
| tags (keywords) | automatically scraped| 
| title | automatically scraped|
| url |automatically scraped|
| Website snapshot (HTML) |automatically generated (*works properly only for single/article view*)|
| Access date |automatically scraped|
| abstractNote (abstract) | Dynamically scraped| 
| issue | Dynamically scraped |
| publicationTitle (Journal name) | manually added: "Dotawo - A Journal of Nubian Studies" |
| journalAbbreviation | manually added: "Dotawo" |
| archive |manually added: "Sandpoints.org" | 
| libraryCatalog | automatically scraped: "pages.sandpoints.org" | 
| volume | does not apply / null | 
| **date** (publication date) | **is not exposed; remains empty** |   
