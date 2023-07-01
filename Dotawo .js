{
	"translatorID": "bfe5f509-55ab-4118-885e-fd1ceea96670",
	"label": "Dotawo ",
	"creator": "Constantinos Miltiadis",
	"target": "https://pages.sandpoints.org/dotawo/",
	"minVersion": "5.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2023-06-29 10:12:12"
}

/*
    ***** BEGIN LICENSE BLOCK *****

    Copyright © 2023 Constantinos Miltiadis

    This file is part of Zotero.

    Zotero is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Zotero is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with Zotero. If not, see <http://www.gnu.org/licenses/>.

    ***** END LICENSE BLOCK *****
*/

/*
Issues: 
- Zotero saves an HTML snapshot of the page locally. 
In the case of downloading citations from the Sitemap or an issue, 
the offline page saved is the Sitemap or the Issue page, not the article page (FIX).   
- Figure out how to expose and scrape publication date. 

What works -- Automatically scraped: 
- Authors 
- Tags 
- Title 
- URL 
- Website snapshot 
- Accessed date
- Library catalogue 

Dynamically scraped: 
- Abstract 
- Issue 

Manually added: 
- Publication - item.publicationTitle="Dotawo - A Journal of Nubian Studies"; 
- Journal abbreviation - item.journalAbbreviation="Dotawo"
- Archive - item.archive="Sandpoints.org"; 

What doesn't work / exist 
- Volume (does not apply)
- Publication date 
*/


function detectWeb(doc, url) {
	if (url.includes('/article/')) { // single articles 
		return 'journalArticle';
	}
	//if issue page or if sitemap 
	else if (url.includes('/issue/') || url =='https://pages.sandpoints.org/dotawo/' ) {
		return 'multiple';
	}
	return false;
}


function getSearchResults(doc, checkOnly) {

	var items = {};
	var found = false;
	// CSS Selector: https://www.w3schools.com/cssref/css_selectors.php

	//gets links with '/article/' in their url inside div.crust (issue pages)
	var rows = doc.querySelectorAll('div.crust > a[href*="/article/"]'); 
	//check for sitemap 
	if (rows.length==0){
		rows = doc.querySelectorAll('a[href*="/article"]'); 
		// Zotero.debug("Sitemap#:"+ rows.length); 
	}
	for (let row of rows) {
		let href = row.href; // get href 
		let title = ZU.trimInternal(row.textContent);// get title 
		if (!href || !title) continue;
		if (title.startsWith("article")){ // this applies to Sitemap items
			title= title.substring(8); //remove 'article/' from beginning of title for Sitemap items
		}

		if (checkOnly) return true;
		found = true;
		items[href] = title;
	}
	return found ? items : false;
}

async function doWeb(doc, url) {
	if (detectWeb(doc, url) == 'multiple') {
		let items = await Zotero.selectItems(getSearchResults(doc, false));
		if (!items) return;
		for (let url of Object.keys(items)) {
			await scrape(await requestDocument(url));
		}
	}
	else {
		await scrape(doc, url);
	}
}

async function scrape(doc, url = doc.location.href) {
	let translator = Zotero.loadTranslator('web');
	// Embedded Metadata
	translator.setTranslator('951c027d-74ac-47d4-a107-9c3069ab7b48');
	translator.setDocument(doc);

	//get abstract via div 
	let abstract = text(doc, 'div.abstract');
	abstract=abstract.substr(9); 
	//get issue via div 
	let issue = text (doc, 'div.article'); 
	// Zotero.debug("ABSTRACT:  "+ abstract); //test 
	
	translator.setHandler('itemDone', (_obj, item) => {
		
		item.publicationTitle="Dotawo - A Journal of Nubian Studies"; 
		item.journalAbbreviation="Dotawo"
		item.archive="Sandpoints.org"; 
		item.issue= issue; 
		item.abstractNote=abstract; 
		item.extra=""; // remove extra ('section: article')
		item.complete();
	});

	let em = await translator.getTranslatorObject();
	em.itemType = 'journalArticle';
	
	// TODO map additional meta tags here, or delete completely
	// em.addCustomFields({
	// 	'twitter:description': 'abstractNote'
	// });
	var thing=	await em.doWeb(doc, url);
	
}


/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://pages.sandpoints.org/dotawo/article/rilly/",
		"detectedItemType": "journalArticle",
		"items": [
			{
				"itemType": "journalArticle",
				"title": "Personal Markers and Verbal Number in Meroitic",
				"creators": [
					{
						"firstName": "Claude",
						"lastName": "Rilly",
						"creatorType": "author"
					}
				],
				"abstractNote": "Thanks to the use of linguistic comparison and analyses of new inscriptions, Meroitic, the extinct language of the kingdom of Meroe, Sudan, has become increasingly well known. The present article deals with the identification of personal markers and verbal number. It shows how Meroitic, like many other languages, used a former demonstrative, qo, as a 3rd person independent pronoun. An in-depth analysis of the royal chronicles of the kings and princes of Meroe, compared with their Napatan counterparts written in Egyptian, further yields the 1st person singular dependent pronoun e- (later variant ye-), which can be compared with 1st person singular pronoun found in related languages. A stela of Candace Amanishakheto found in Naga is the starting point for identifying the 2nd person singular and plural independent pronouns are and deb. These two morphemes are linked with the most recent reconstructions of Proto-Nubian pronouns and confirm the narrow genetic relation between Nubian and Meroitic. Finally, the reassessment of the so-called “verbal dative” ‑xe/‑bxe shows that this morpheme is simply a former verbal number marker with integrated case endings. This makes it a rare instance of transcategorisation in the cross-linguistic typology of verbal number.",
				"archive": "Sandpoints.org",
				"issue": "Dotawo 7: Comparative Northern East Sudanic Linguistics",
				"language": "en-us",
				"libraryCatalog": "pages.sandpoints.org",
				"publicationTitle": "Dotawo",
				"url": "https://pages.sandpoints.org/article/rilly/",
				"attachments": [
					{
						"title": "Snapshot",
						"mimeType": "text/html"
					}
				],
				"tags": [
					{
						"tag": "Ama"
					},
					{
						"tag": "Andaandi"
					},
					{
						"tag": "Egyptian"
					},
					{
						"tag": "Karko"
					},
					{
						"tag": "Kush"
					},
					{
						"tag": "Mattokki"
					},
					{
						"tag": "Meroe"
					},
					{
						"tag": "Meroitic"
					},
					{
						"tag": "Napata"
					},
					{
						"tag": "Nara"
					},
					{
						"tag": "Nobiin"
					},
					{
						"tag": "Old Nubian"
					},
					{
						"tag": "Taman"
					},
					{
						"tag": "comparative linguistics"
					},
					{
						"tag": "decipherment"
					},
					{
						"tag": "person"
					},
					{
						"tag": "pronominal morphology"
					},
					{
						"tag": "pronouns"
					},
					{
						"tag": "verbal morphology"
					}
				],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "https://pages.sandpoints.org/dotawo/issue/dotawo8/",
		"detectedItemType": "multiple",
		"items": "multiple"
	},
	{
		"type": "web",
		"url": "https://pages.sandpoints.org/dotawo/",
		"detectedItemType": "multiple",
		"items": "multiple"
	}
]
/** END TEST CASES **/
