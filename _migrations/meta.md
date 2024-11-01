<!-- Document: Meta -->
This page is meant to describe how the Migration Assistant (MA) documentation is organization and used.

## Organization
1. All pages should have a commented out section with metadata information used for determining what styles should be applied, eg. `<!-- Document: Meta -->`.
   - **Meta** these follow unique conventions to the documentation's implementation.
   - **Home** This is the primary entry point to the project, there should only be one such page.
   - **Guide** take a user through an substantial part of the MA workflow.  Duplicated information is OK.  They should be styled simaliarally to one another.
   - **Topic** describe a specific area of functionality in MA and are meant to be digestible from top to bottom in a single sitting.  After the user has read the topic they would use a sidebar navigate to pick the next topic.
2. Sidebar navigation should include all guides and topics.
3. There is no hierarchy in project all files are off of the root.
4. All internal links should use the `[[<DISPLAY-NAME>|<PAGE-NAME>]]` format so testing on forks is easy and broken page links are easier to detect.

## Style

### Links
1. Links to any external documentation that isn't directly under the purview of the migrations team should be followed with a space and the `↗` character, eg. `[link](...) ↗`.

### Format
1. Only the home page is has level 1 `#` headers, all other pages should start with a paragraph and the first header start at `##`.
2. Standard sections
   - `## Troubleshooting`
      1. No summary should be included.
      2. Call out a clear problem or resolution, eg. `### Slow Snapshot Speed`.
   - `## Related Links`
     - All links should be bulleted and labeled `- [Migration Console ALB Documentation](...)`
