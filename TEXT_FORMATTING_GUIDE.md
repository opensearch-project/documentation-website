---
title: Text Formatting Guide
nav_order: 30
---

# Text Formatting Guide

This guide provides conventions for formatting and structuring content elements in OpenSearch documentation, including code examples, lists, links, images, and procedures. For brand identity, naming conventions, and voice and tone, see the [Style Guide](STYLE_GUIDE.md). For grammar, punctuation, and word choice, see the [Writing Guide](WRITING_GUIDE.md). For Markdown and Jekyll syntax, see the [Markdown Formatting Guide](MARKDOWN_FORMATTING_GUIDE.md).

## Code examples

Calling out code within a sentence or code block makes it clear to readers which items are code specific. The following is general guidance about using code examples and when to use `code font`:

- In Markdown, use single backticks (`` ` ``) for inline code formatting and triple backticks (```` ``` ````) for code blocks. For example, writing `` `discovery.type` `` in Markdown will render as `discovery.type`. A line containing three backticks should be included both before and after an example code block.
- In sentences, use code font for things relating to code, for example, "The `from` and `size` parameters are stateless, so the results are based on the latest available data." 
- Use lead-in sentences to clarify the example. Exception: API examples, for which a caption-style lead-in (heading 4) is sufficient. 
- Use the phrase _such as_ for brief examples within a sentence.
- Use language-specific indentation in code examples.
- Use _example_, not _sample_, to introduce example blocks (for example, code, scripts, and API requests and responses).
- Make code blocks as copy-and-paste friendly as possible. Use either the [`copy` or `copy-curl` buttons](MARKDOWN_FORMATTING_GUIDE.md#buttons).

### Code formatting checklist

The following items should be in `code font`:

- Field names, variables (including environment variables), and settings (`discovery.type`, `@timestamp`, `PATH`). Use code font for variable and setting values if it improves readability (`false`, `1h`, `5`). Plain text is also acceptable for simple numeric values, such as 5.
- Placeholder variables:
     - Use angle brackets in command-line examples (`docker exec -it <container-id> /bin/bash`).
     - Use curly braces in API paths (`GET /{index}/_search`, `PUT /_snapshot/{repository}/{snapshot}`).
- Commands, command-line utilities, and options (`docker container ls -a`, `curl`, `-v`).
- File names, file paths, and directory names (`docker-compose.yml`, `/var/www/simplesamlphp/config/`).
- URLs and URL components (`localhost`, `http://localhost:5601`).
- Index names (`logs-000001`, `.opendistro-ism-config`), endpoints (`_cluster/settings`), and query parameters (`timeout`).
- Language keywords (`if`, `for`, `SELECT`, `AND`, `FROM`).
- Operators and symbols (`/`, `<`, `*`).
- Regular expression, date, or other patterns (`^.*-\d+$`, `yyyy-MM-dd`).
- Class names (`SettingsModule`) and interface names (_`RestHandler`_). Use italics for interface names.
- Text field inputs (Enter the password `admin`).
- Email addresses (`example@example.org`).

Do not start a sentence with a word in backticks. Restructure to avoid leading with inline code: "The `validate_action` parameter controls..." (not "`validate_action` controls...").

### Caption-style examples

If you use a caption-style example, use a heading with "Example" followed by a colon. The following are caption-style examples:

> #### Example: Retrieve a specified document from an index
>
> The following example request retrieves a specific document from an index:
>
> ```json
> GET sample-index1/_doc/1
> ```

> #### Example request
>
> ```json
> GET sample-index1/_doc/1
> ```

Sometimes, you might not want to break up the flow of the text with a new heading. In these cases, you can use an example with no heading:

> The following command maps ports 9200 and 9600, sets the discovery type to single-node, and requests the newest image of OpenSearch:
>
> ```bash
> docker run -d -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" opensearchproject/opensearch:latest
> ```

### Lead-in sentences

When using lead-in sentences, summarize, clarify, or refer to the example that follows. A lead-in sentence is a complete sentence that ends in a colon, as shown in the following example.

> For example, the following query requests statistics for `docs` and `search`:
>
> ```json
> GET _nodes/stats/indices/docs,search
> ```

### Referring to a variable or placeholder

When introducing a code or command line example that refers to a variable or placeholder in the example, be direct by including the variable or placeholder name in the text. Surround the variable or placeholder name with angle brackets (`<` and `>`), for example, `<port>`. Don't refer to the variable or placeholder by its color or format because these can change. If variable or placeholder texts have a lot in common and there are several for the user to complete, be direct by including a "template" for the input in the replaceable text.

> In the following example, replace `<component-x>` with your own information:
>
> ```bash
> ~/workspace/project-name$ eb init --modules <component-a> <component-b>
> ```

## Formatting and organization

- Use bold text for all UI elements, including pages, panes, and dialog boxes. In all cases, emphasize what the user must do as opposed to talking about the UI element itself. Do not include punctuation inside the bold formatting. For example, **Management**: (not **Management:**).

- Stacked headings should never appear in our content. Stacked headings are any two consecutive headings without intervening text. Even if it is an introductory sentence, there should always be text under any heading.

- Use italics to define terms on first use. For example, "The term _distributed_ means that you can run OpenSearch on multiple computers."

- You can refer to APIs in three ways:
     1. When referring to API names, capitalize all words in the name (example: "Field Capabilities API").
     2. When referring to API operations by the exact name of the endpoint, use lowercase with code format (example: "`_field_caps` API").
     3. When describing API operations but not using the exact name of the endpoint, use lowercase (example: "field capabilities API operations" or "field capabilities operations").

## Images

- Add introductory text that provides sufficient context for each image.

- Add ALT text that describes the image for screen readers.

- When you're describing the location of an image, use words such as _preceding_, _previous_, or _following_ instead of _above_ and _below_.

- Unlike lead-in sentences for code and lists (which end with a colon), text that introduces an image should be a complete sentence and end with a period.

### Screenshots

Screenshots are difficult to maintain because they become outdated whenever the UI changes. Use your own judgment when deciding whether to include a screenshot: if the UI is self-explanatory or likely to change frequently, a step-by-step procedure with UI elements called out in bold is enough.

When you do include a screenshot, all text must be readable without zooming. If users cannot read labels, field names, or values in the image, resize the browser window or crop tightly around the relevant element before capturing. 

When annotating screenshots, use boxes for callouts and white numbers on a red circle background for numbered annotations. If the screenshot has labeled callouts, describe the components in a list below the image using italicized names for unlabeled components and bold text for labeled UI elements, with the corresponding callout letter in parentheses. This list does not need a lead-in sentence. For example:

> - The _time filter_ (C) provides a graphical interface for selecting data ranges.
> - The **Results** table (H) displays summaries of the selected documents.

If callouts are numeric, use a numbered list instead:

> 1. The query bar (1) accepts search queries in DQL or Lucene syntax.
> 1. The time filter (2) restricts results to a specified date range.

## Links

- **Formal cross-references**: In most cases, a formal cross-reference (the title of the page you're linking to) is the preferred style because it provides context and helps readers understand where they're going when they choose the link. Follow these guidelines for formal cross-references:
     - Introduce links with formal introductory text:
          - Use "For information _about_" or "For more information _about_." Don't use "For information _on_."
          - If you are linking to procedures, you can use either "For instructions _on_" or "instructions _for_." Don't use "instructions _about_."
          - Where space is limited (for example, in a table), you can use "_See_ [link text]."
     - Ensure that the link text matches the section title text.

          > "To get involved, see [Contributing](https://opensearch.org/source.html) on the OpenSearch website."

- **Embedded links**: Embedded links are woven into a sentence without formal introductory text. They're especially useful in tables or other elements where space is tight. The text around the embedded link must relate to the information in the link so that the reader understands the context. Do not use _here_ or _click here_ for link text because it creates accessibility problems.

     > "Finally, [delete the index](https://docs.opensearch.org/latest/api-reference/index-apis/delete-index)."

## Lists

The following guidelines apply to all list types:

- Make lists parallel in content and structure. Don't mix single words with phrases, don't start some phrases with a noun and others with a verb, and don't mix verb forms.
- Present the items in alphabetical order if the order of items is arbitrary.
- Capitalize the first letter of the first word of each list item.
- If the list is simple, you don't need end punctuation for the list items.
- If the list has a mixture of phrases and sentences, punctuate each list item.
- Punctuate each list item with a period if a list item has more than one sentence.
- Punctuate list items consistently. If at least one item in a list requires a period, use a period for all items in that list.
- Introductory sentences are required for lists.
- Introductory sentences should be complete sentences.
- Introductory sentences should end with a colon.
- Don't use semicolons, commas, or conjunctions (like _and_ or _or_) at the end of list items.

## Procedures

A procedure is a series of numbered steps that a user follows to complete a specific task. Users should be able to scan for and recognize procedures easily. Make procedures recognizable by using the following:

- Predictable content parts
- Parallel language constructions
- Consistent formatting

### Describing interactions with the UI

Replace pointer-specific verbs with device-agnostic/generic verbs to accommodate readers with disabilities and users of various input methods and devices, including the pointer, keyboard, and touch screens. Don't use device-specific verbs such as _click_ or _swipe_. However, when the generic language makes it difficult to understand the instructions, you can include pointer-specific hints in parentheses. Use your judgment. If you have a question, ask your editor.

We follow a slightly modified version of the _Microsoft Writing Style Guide_ guidance on describing interactions with a UI, as shown in the following table.

| Verb | Use for | Examples |
| :--------- | :------- | :------- |
| **Open** | - Apps and programs <br> - Files and folders <br> - Shortcut menus <br> Use for websites and webpages only when necessary to match the UI. Otherwise, use _go to_. <br> - Don't use for commands and menus. | - Open Photos. <br> - Open the Reader app. <br> - Open the Filename file. <br> - To open the document in Outline view, select **View** > **Outline**. <br> - In WindowName, open the shortcut menu for ItemName. |
| **Close** | - Apps and programs <br> - Dialog boxes <br> - Files and folders <br> - Notifications and alerts <br> - Tabs <br> - The action a program or app takes when it encounters a problem and can't continue. (Don't confuse with _stop responding_). | - Close the Alarms app. <br> - Close Excel. <br> - Save and close the document. <br> - Closing Excel also closes all open worksheets. |
| **Leave** | Websites and webpages | Select **Submit** to complete the survey and leave this page. |
| **Go to** | - Opening a menu. <br> - Going to a tab or another particular place in the UI. <br> - Going to a website or webpage. <br> - It's ok to use _On the **XXX** tab_ if the instruction is brief and continues immediately. | - Go to Search, enter the word **settings**, and then select **Settings**. <br> - Go to **File**, and then select **Close**. <br> - On the ribbon, go to the **Design** tab. <br> - Go to the **Deploy** tab. In the **Configuration** list ... <br> - Go to Example.com to register. |
| **Select** | Instructing the user to select a specific item, including: <br> - Selecting an option, such as a button. <br> - Selecting a checkbox. <br> - Selecting a value from a list box. <br> - Selecting link text to go to a link. <br> - Selecting an item on a menu or shortcut menu. <br> - Selecting an item from a gallery. | - Select the **Modify** button. <br> - For **Alignment**, select **Left**. <br> - Select the text, open the shortcut menu, and then select **Font**. <br> - Select **Open in new tab**. <br> - Select the **LinkName** link. |
| **Select and hold, select and hold (or right-click)** | Use to describe pressing and holding an element in a UI. It's OK to use _right-click_ with _select and hold_ when the instruction isn't specific to touch devices. | - To flag a message that you want to deal with later, select and hold it, and then select **Set flag**. <br> - Select and hold (or right-click) the Windows taskbar, and then select **Cascade windows**. <br> - Select and hold (or right-click) the **Start** button, and then select **Device Manager**. |
| **>** | Use a greater-than symbol (>) to separate sequential steps. <br> Only use this approach when there's a clear and obvious path through the UI and the selection method is the same for each step. For example, don't mix things that require opening, selecting, and choosing. <br> Don't bold the greater-than symbol. Include a space before and after the symbol. | Select **Accounts** > **Other accounts** > **Add an account**. |
| **Clear** | Clearing the selection from a checkbox. | Clear the **Header row** checkbox. | 
| **Choose** | Choosing an option, based on the customer's preference or desired outcome. | On the **Font** tab, choose the effects you want. |
| **Switch, turn on, turn off** | Turning a toggle key or toggle switch on or off. | - Use the **Caps lock** key to switch from typing capital letter to typing lowercase letters. <br> - To keep all applied filters, turn on the **Pass all filters** toggle. |
| **Enter** | Instructing the customer to type or otherwise insert a value, or to type or select a value in a combo box. | - In the search box, enter... <br> - In the **Tab stop position** box, enter the location where you want to set the new tab. <br> - In the **Deployment script name** box, enter a name for this script. |
| **Move, drag** | Moving anything from one place to another by dragging, cutting and pasting, or another method. Use for tiles and any open window (including apps, dialog boxes, and files). <br> Use _move through_ to describe moving around on a page, moving through screens or pages in an app, or moving up, down, right, and left in a UI. | - Drag the Filename file to the Foldername folder. <br> - Move the tile to the new section. <br> - Drag the Snipping Tool out of the way, if necessary, and then select the area you want to capture. <br> - If the **Apply Styles** task pane is in your way, just move it. |
| **Press** | Use _press_ to describe single key or key combination entries that users would perform on a keyboard, such as keyboard shortcuts. | - Press **F5**. <br> - Press **Shift+Enter**. <br> - Press **Ctrl+Alt+Delete**. |
| **Zoom, zoom in, zoom out** | Use _zoom_, _zoom in_, and _zoom out_ to refer to changing the magnification of the screen or window. | - Zoom in to see more details on the map. <br> - Zoom out to see a larger geographic area on the map. <br> - Zoom in or out to see more or less detail. |
