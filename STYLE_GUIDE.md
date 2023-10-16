# OpenSearch Project Style Guidelines

Welcome to the content style guide for the OpenSearch Project. This guide covers the style standards to be observed when creating OpenSearch content and will evolve as we implement best practices and lessons learned in order to best serve the community.

Our content is generally edited in accordance with the _AWS Style Guide_, the [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/), [The Chicago Manual of Style](https://www.chicagomanualofstyle.org/home.html), and [Merriam-Webster](https://www.merriam-webster.com/) (listed in order of precedence); however, we may deviate from these style guides in order to maintain consistency and accommodate the unique needs of the community. This is by no means an exhaustive list of style standards, and we value transparency, so we welcome contributions to our style standards and guidelines. If you have a question regarding our standards or adherence/non-adherence to the style guides or would like to make a contribution, please tag @natebower on GitHub.

## Naming conventions, voice, tone, and brand personality traits

The following sections provide guidance on OpenSearch Project naming conventions, voice, tone, and brand personality traits.

### Naming conventions

The following naming conventions should be observed in OpenSearch Project content:

* Capitalize both words when referring to the *OpenSearch Project*.
* *OpenSearch* is the name for the distributed search and analytics engine used by Amazon OpenSearch Service.
* Amazon OpenSearch Service is a managed service that makes it easy to deploy, operate, and scale OpenSearch. Use the full name *Amazon OpenSearch Service* on first appearance. The abbreviated service name, *OpenSearch Service*, can be used for subsequent appearances.
* Amazon OpenSearch Serverless is an on-demand serverless configuration for Amazon OpenSearch Service. Use the full name *Amazon OpenSearch Serverless* on first appearance. The abbreviated service name, *OpenSearch Serverless*, can be used for subsequent appearances. 
* OpenSearch Dashboards is the UI for OpenSearch. On first appearance, use the full name *OpenSearch Dashboards*. *Dashboards* can be used for subsequent appearances.
* *Security Analytics* is a security information and event management (SIEM) solution for OpenSearch. Capitalize both words when referring to the name of the solution.
* Observability is collection of plugins and applications that let you visualize data-driven events by using Piped Processing Language (PPL). Capitalize *Observability* when referring to the name of the solution.
* Refer to OpenSearch Project customers as *users*, and refer to the larger group of users as *the community*. Do not refer to the OpenSearch Project or to the AWS personnel working on the project as a *team*, as this implies differentiation within the community.

#### Product names

Capitalize product names. The OpenSearch Project has three products: OpenSearch, OpenSearch Dashboards, and Data Prepper. For example:

* “To install *OpenSearch*, download the Docker image.”
* “To access *OpenSearch Dashboards*, open your browser and navigate to http://localhost:5601/app/home.”
* “*Data Prepper* contains the following components:”

Capitalize the names of clients and tools. For example:

* “The OpenSearch *Python* client provides a more natural syntax for interacting with your cluster.”
* “The *Go* client retries requests for a maximum of three times by default.”
* “The *OpenSearch Kubernetes Operator* is an open-source Kubernetes operator that helps automate the deployment and provisioning of OpenSearch and OpenSearch Dashboards in a containerized environment.”
* “You can send events to *Logstash* from many different sources.”

#### Features

Features are the individual building blocks of user experiences, reflect the functionality of a product, and are shared across different experiences. For example, the SQL/PPL, reporting, notifications, alerting, and anomaly detection used for observability are the same SQL/PPL, reporting, notifications, alerting, and anomaly detection used for general analytics, security analytics, and search analytics. Components of the user experience such as navigation, credentials management, theming, etc. are also considered to be features.

Use lowercase when referring to features, unless you are referring to a formally named feature that is specific to OpenSearch. For example:

* “The Notifications plugin provides a central location for all of your *notifications* from OpenSearch plugins.”
* “*Remote-backed storage* is an experimental feature. Therefore, we do not recommend the use of *remote-backed storage* in a production environment.”
* “You can take and restore *snapshots* using the snapshot API.”
* “You can use the *VisBuilder* visualization type in OpenSearch Dashboards to create data visualizations by using a drag-and-drop gesture.” (You can refer to VisBuilder alone or qualify the term with “visualization type”.)
* “As of OpenSearch 2.4, the *ML framework* only supports text-embedding models without GPU acceleration.”

#### Plugin names

A plugin is a feature or distinct component that extends the functionality of OpenSearch. For now, capitalize plugin names, but use *plugin* sparingly. The concept of plugins will become obsolete once we re-architect the product. For example:

* “Interaction with the *ML Commons* plugin occurs through either the REST API or [ad](https://opensearch.org/docs/latest/search-plugins/sql/ppl/functions#ad) and [kmeans](https://opensearch.org/docs/latest/search-plugins/sql/ppl/functions#kmeans) Piped Processing Language (PPL) commands.”
* “Use the *Neural Search* plugin to integrate ML language models into your search workloads.”

### Voice and tone

Voice is the point of view or style of a writer. Voice can refer to active or passive but may also refer to verb tense (past, present, future, and so on). Tone is the emotional undercurrent (such as calm or angry) of the voice. We strive to speak to the community with a consistent voice and tone, as if a single writer writes all content. Writing with a common voice also helps to establish the OpenSearch Project identity and brand.

#### Voice

The voice of the OpenSearch Project is people oriented and focused on empowering the user directly. We use language that emphasizes what the user can do with OpenSearch rather than what tasks OpenSearch can perform.

Whenever possible, use the active voice instead of the passive voice. The passive form is typically wordier and can often cause writers to obscure the details of the action. For example, change the agentless passive _it is recommended_ to the more direct _we recommend_.

Refer to the reader as _you_ (second person), and refer to the OpenSearch Project as _we_ (first person). If there are multiple authors for a blog post, you can use _we_ to refer to the authors as individuals. Do not refer to the OpenSearch Project or to the AWS personnel working on the project as a *team*, as this implies differentiation within the community.

Describe the actions that the user takes, rather than contextualizing from the feature perspective. For example, use phrases such as “With this feature, you can...” or “Use this feature to...” instead of saying a feature *allows*, *enables*, or *lets* the user do something.

For procedures or instructions, ensure that action is taken by the user (“Then you can stop the container...”) rather than the writer (“We also have to stop the container...”). Reserve the first-person plural for speaking as the OpenSearch Project, with recommendations, warnings, or explanations.

In general, use the present tense. Use the future tense only when an event happens later than, not immediately after, the action under discussion.

#### Tone

The tone of the OpenSearch Project is conversational, welcoming, engaging, and open. The overall tone is knowledgeable but humble, informal but authoritative, informative but not dry, and friendly without being overly familiar.

We talk to readers in their own words, never assuming that they understand how OpenSearch works. We use precise technical terms where appropriate, but we avoid technical jargon and insider lingo. We speak to readers in simple, plain, everyday language.

Avoid excessive words, such as please. Be courteous but not wordy. Extra detail can often be moved elsewhere. Use humor with caution because it is subjective, can be easily misunderstood, and can potentially alienate your audience.

### Brand personality traits

| Personality trait | Description | Guidance |
| :--------- | :------- | :------ |
| **Clear and precise** | The OpenSearch Project understands that our community works, develops, and builds in roles and organizations that require precise thinking and thorough documentation. We strive to use precise language—to clearly say what we mean without leaving ideas open to interpretation, to support our assertions with facts and figures, and to provide credible and current (third-party) references where called for. <br> <br> We communicate in plain, direct language that is easily understood. Complex concepts are introduced in a concise, unambiguous way. High-level content is supported by links to more in-depth or technical content that users can engage with at their convenience. | - Write with clarity and choose words carefully. Think about the audience and how they might interpret your assertions. <br> - Be specific. Avoid estimates or general claims when exact data can be provided. <br> - Support claims with data. If something is “faster” or “more accurate,” say how much. <br> - When citing third-party references, include direct links. |
| **Transparent and open** | As an open-source project, we exchange information with the community in an accessible and transparent manner. We publish our product plans in the open on GitHub, share relevant and timely information related to the project through our forum and/or our blog, and engage in open dialogues related to product and feature development in the public sphere. Anyone can view our roadmap, raise a question or an issue, or participate in our community meetings. | - Tell a complete story. If you’re walking the reader through a solution or sharing news, don’t skip important information. <br> - Be forthcoming. Communicate time-sensitive news and information in a thorough and timely manner. <br> - If there’s something the reader needs to know, say it up front. Don’t “bury the lede.” |
| **Collaborative and supportive** | We’re part of a community that is here to help. We aim to be resourceful on behalf of the community and encourage others to do the same. To facilitate an open exchange of ideas, we provide forums through which the community can ask and answer one another’s questions. | - Use conversational language that welcomes and engages the audience. Have a dialogue. <br> - Invite discussion and feedback. We have several mechanisms for open discussion, including requests for comment (RFCs), a [community forum](https://forum.opensearch.org/), and [community meetings](https://www.meetup.com/OpenSearch/).
| **Trustworthy and personable** | We stay grounded in the facts and the data. We do not overstate what our products are capable of. We demonstrate our knowledge in a humble but authoritative way and reliably deliver what we promise. We provide mechanisms and support that allow the audience to explore our products for themselves, demonstrating that our actions consistently match our words. <br> <br> We speak to the community in a friendly, welcoming, judgment-free way so that our audience perceives us as being approachable. Our content is people oriented and focused on empowering the user directly. | - Claims and assertions should be grounded in facts and data and supported accordingly. <br> - Do not exaggerate or overstate. Let the facts and results speak for themselves. <br> - Encourage the audience to explore our products for themselves. Offer guidance to help them do so. <br> - Write directly and conversationally. Have a dialogue with your audience. Imagine writing as if you’re speaking directly to the person for whom you’re creating content. <br> - Write from the community, for the community. Anyone creating or consuming content about OpenSearch is a member of the same group, with shared interest in learning about and building better search and analytics solutions. |
| **Inclusive and accessible** | As an open-source project, The OpenSearch Project is for everyone, and we are inclusive. We value the diversity of backgrounds and perspectives in the OpenSearch community and welcome feedback from any contributor, regardless of their experience level. <br> <br> We design and create content so that people with disabilities can perceive, navigate, and interact with it. This ensures that our documentation is available and useful for everyone and helps improve the general usability of content. <br> <br> We understand our community is international and our writing takes that into account. We use plain language that avoids idioms and metaphors that may not be clear to the broader community. | - Use inclusive language to connect with the diverse and global OpenSearch Project audience.- Be careful with our word choices. <br> - Avoid [sensitive terms](https://github.com/opensearch-project/documentation-website/blob/main/STYLE_GUIDE.md#sensitive-terms). <br> - Don't use [offensive terms](https://github.com/opensearch-project/documentation-website/blob/main/STYLE_GUIDE.md#offensive-terms). <br> - Don't use ableist or sexist language or language that perpetuates racist structures or stereotypes. <br> - Links: Use link text that adequately describes the target page. For example, use the title of the target page instead of “here” or “this link.” In most cases, a formal cross-reference (the title of the page you’re linking to) is the preferred style because it provides context and helps readers understand where they’re going when they choose the link. <br> - Images: <br> &nbsp;&nbsp;- Add introductory text that provides sufficient context for each image. <br> &nbsp;&nbsp;- Add ALT text that describes the image for screen readers. <br> - Procedures: Not everyone uses a mouse, so use device-independent verbs; for example, use “choose” instead of “click.” <br> - Location: When you’re describing the location of something else in your content, such as an image or another section, use words such as “preceding,” “previous,” or “following” instead of “above” and “below.”

## Style guidelines

The following guidelines should be observed in OpenSearch Project content.

### Acronyms

Spell out acronyms the first time that you use them on a page and follow them with the acronym in parentheses. Use the format `spelled-out term (acronym)`. On subsequent use, use the acronym alone.

Do not capitalize the spelled-out form of an acronym unless the spelled-out form is a proper noun or the community generally capitalizes it. In all cases, our usage should reflect the community’s usage.

In general, spell out acronyms once on a page. However, you can spell them out more often for clarity.

Make an acronym plural by adding an *s* to the end of it. Do not add an apostrophe.

How an acronym is pronounced determines whether you use the article *an* or *a* before it. If it's pronounced with an initial vowel sound, use *an*. Otherwise, use *a*.

If the first use of an acronym is in a heading, retain the acronym in the heading, and then write out the term in the following body text, followed by the acronym in parentheses. Don't spell out the term in the heading with the acronym included in parentheses. If the first use of the service name is in a title or heading, use the short form of the name in the heading, and then use the long form followed by the short form in parentheses in the following body text.

In general, spell out abbreviations that end with *-bit* or *-byte*. Use abbreviations only with numbers in specific measurements. Always include a space between the number and unit. Abbreviations that are well known and don't need to be spelled out are *KB*, *MB*, *GB*, and *TB*. 

Some acronyms are better known than their spelled-out counterparts or might be used almost exclusively. These include industry-standard protocols, markdown and programming languages, and common file formats. You don't need to spell out these acronyms.

The following table lists acronyms that you don't need to spell out.

| Acronym | Spelled-out term |
| :--------- | :------- |
| 3D | three-dimensional |
| API | application programming interface |
| ASCII | American Standard Code for Information Interchange |
| BASIC | Beginner's All-Purpose Symbolic Instruction Code |
| BM25 | Best Match 25 |
| CPU | central processing unit |
| CRUD | create, read, update, and delete |
| CSV | comma-separated values |
| DNS | Domain Name System |
| DOS | disk operating system |
| FAQ | frequently asked questions |
| FTP | File Transfer Protocol |
| GIF | Graphics Interchange Format |
| HTML | hypertext markup language |
| HTTP | hypertext transfer protocol |
| HTTPS | hypertext transfer protocol secure |
| HTTP(s) | Use to refer to both protocols, HTTP and HTTPS. |
| I/O | input/output |
| ID | identifier |
| IP | Internet protocol |
| JPEG | Joint Photographic Experts Group |
| JSON | JavaScript Object Notation |
| NAT | network address translation |
| NGINX | engine x |
| PDF | Portable Document Format |
| RAM | random access memory |
| REST | Representational State Transfer |
| RGB | red-green-blue |
| ROM | read-only memory |
| SAML | Security Assertion Markup Language |
| SDK | software development kit |
| SSL | Secure Sockets Layer |
| TCP | Transmission Control Protocol |
| TIFF | Tagged Image File Format |
| TLS | Transport Layer Security |
| UI | user interface |
| URI | uniform resource identifier |
| URL | uniform resource locator |
| UTC | Coordinated Universal Time |
| UTF | Unicode Transformation Format |
| XML | Extensible Markup Language |
| YAML | YAML Ain't Markup Language |

### Code examples

Calling out code within a sentence or code block makes it clear to readers which items are code specific. The following is general guidance about using code examples and when to use `code font`:

* In Markdown, use single backticks (`` ` ``) for inline code formatting and triple backticks (```` ``` ````) for code blocks. For example, writing `` `discovery.type` `` in Markdown will render as `discovery.type`. A line containing three backticks should be included both before and after an example code block.
* In sentences, use code font for things relating to code, for example, “The `from` and `size` parameters are stateless, so the results are based on the latest available data.” 
* Use lead-in sentences to clarify the example. Exception: API examples, for which a caption-style lead-in (heading 4) is sufficient. 
* Use the phrase *such as* for brief examples within a sentence.
* Use language-specific indentation in code examples.
* Make code blocks as copy-and-paste friendly as possible. Use either the [`copy` or `copy-curl` buttons](https://github.com/opensearch-project/documentation-website/blob/main/FORMATTING_GUIDE.md#buttons).

#### Code formatting checklist

The following items should be in `code font`:

* Field names, variables (including environment variables), and settings (`discovery.type`, `@timestamp`, `PATH`). Use code font for variable and setting values if it improves readability (`false`, `1h`, `5`, or 5).
* Placeholder variables. Use angle brackets for placeholder variables (`docker exec -it <container-id> /bin/bash`).
* Commands, command-line utilities, and options (`docker container ls -a`, `curl`, `-v`).
* File names, file paths, and directory names (`docker-compose.yml`, `/var/www/simplesamlphp/config/`).
* URLs and URL components (`localhost`, `http://localhost:5601`).
* Index names (`logs-000001`, `.opendistro-ism-config`), endpoints (`_cluster/settings`), and query parameters (`timeout`).
* Language keywords (`if`, `for`, `SELECT`, `AND`, `FROM`).
* Operators and symbols (`/`, `<`, `*`).
* Regular expression, date, or other patterns (`^.*-\d+$`, `yyyy-MM-dd`).
* Class names (`SettingsModule`) and interface names (*`RestHandler`*). Use italics for interface names.
* Text field inputs (Enter the password `admin`).
* Email addresses (`example@example.org`).

#### Caption-style examples

If you use a caption-style example, use the heading **Example**, with a colon, as appropriate. The following are caption-style examples:

   **Example: Retrieve a specified document from an index**

   The following example shows a request that retrieves a specific document and its information from an index:

   `GET sample-index1/_doc/1`

   **Example request**

   `GET sample-index1/_doc/1` 

Sometimes, you might not want to break up the flow of the text with a new heading. In these cases, you can use an example with no heading.

   The following command maps ports 9200 and 9600, sets the discovery type to single-node, and requests the newest image of OpenSearch:

   `docker run -d -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" opensearchproject/opensearch:latest`

#### Lead-in sentences

When using lead-in sentences, summarize, clarify, or refer to the example that follows. A lead-in sentence is a complete sentence that ends in a colon.  

   For example, the following query requests statistics for `docs` and `search`:

   `GET _nodes/stats/indices/docs,search`

#### Referring to a variable or placeholder

When introducing a code or command line example that refers to a variable or placeholder in the example, be direct by including the variable or placeholder name in the text. Surround the variable or placeholder name with angle brackets (`<` and `>`), for example, `<port>`. Don't refer to the variable or placeholder by its color or format because these can change. If variable or placeholder texts have a lot in common and there are several for the user to complete, be direct by including a “template” for the input in the replaceable text.

   In the following example, replace `<component-x>` with your own information:

   `~/workspace/project-name$ eb init --modules <component-a> <component-b>`

### Formatting and organization

- Use a colon to introduce example blocks (for example, code and scripts) and most lists. Do not use a colon to introduce tables or images.

- Use bold text for all UI elements, including pages, panes, and dialog boxes. In all cases, emphasize what the user must do as opposed to talking about the UI element itself.

- Stacked headings should never appear in our content. Stacked headings are any two consecutive headings without intervening text. Even if it is just an introductory sentence, there should always be text under any heading.

- Use italics for the titles of books, periodicals, and reference guides. However, do not use italics when the title of a work is also a hyperlink.

- You can refer to APIs in three ways:
     1. When referring to API names, capitalize all words in the name (example: "Field Capabilities API").
     2. When referring to API operations by the exact name of the endpoint, use lowercase with code format (example: "`_field_caps` API").
     3. When describing API operations but not using the exact name of the endpoint, use lowercase (example: "field capabilities API operations" or "field capabilities operations").

### Images

- Add introductory text that provides sufficient context for each image.

- Add ALT text that describes the image for screen readers.

- When you’re describing the location of an image, use words such as *preceding*, *previous*, or *following* instead of *above* and *below*.

- Text that introduces an image should be a complete sentence and end with a period, not a colon.

### Links

- **Formal cross-references**: In most cases, a formal cross-reference (the title of the page you're linking to) is the preferred style because it provides context and helps readers understand where they're going when they choose the link. Follow these guidelines for formal cross-references:
     - Introduce links with formal introductory text:
          - Use "For information *about*" or "For more information *about*." Don't use "For information *on*."
          - If you are linking to procedures, you can use either "For instructions *on*" or "instructions *for*." Don't use "instructions *about*."
          - Where space is limited (for example, in a table), you can use "*See* [link text]."
     - Ensure that the link text matches the section title text. <br> <br> Example: "To get involved, see [Contributing](https://opensearch.org/source.html) on the OpenSearch website." <br>

- **Embedded links**: Embedded links are woven into a sentence without formal introductory text. They're especially useful in tables or other elements where space is tight. The text around the embedded link must relate to the information in the link so that the reader understands the context. Do not use *here* or *click here* for link text because it creates accessibility problems. <br> <br> Example: "Finally, [delete the index](https://opensearch.org/docs/latest/api-reference/index-apis/delete-index)."

### Lists

The following guidelines apply to all list types:
- Make lists parallel in content and structure. Don’t mix single words with phrases, don’t start some phrases with a noun and others with a verb, and don’t mix verb forms.
- Present the items in alphabetical order if the order of items is arbitrary.
- Capitalize the ﬁrst letter of the ﬁrst word of each list item.
- If the list is simple, you don’t need end punctuation for the list items.
- If the list has a mixture of phrases and sentences, punctuate each list item.
- Punctuate each list item with a period if a list item has more than one sentence.
- Punctuate list items consistently. If at least one item in a list requires a period, use a period for all items in that list.
- Introductory sentences are required for lists.
- Introductory sentences should be complete sentences.
- Introductory sentences should end with a colon.
- Don’t use semicolons, commas, or conjunctions (like and or or) at the end of list items.

### Numbers and measurement

- Spell out cardinal numbers from 1 to 9. For example, one NAT instance. Use numerals for cardinal numbers 10 and higher. Spell out ordinal numbers: first, second, and so on. In a series that includes numbers 10 or higher, use numerals for all. Use a comma separator for numbers of four digits or more—for example, 1,000.

- For descriptions that include time ranges, separate the numbers with an en dash. Avoid extra words such as between or from n to n.
     - Correct: It can take 5–10 minutes before logs are available.
     - Incorrect: It can take between 5 and 10 minutes before logs are available.

- Use numerals for all measurement-based references, including time. Include a space between the number and the abbreviation for the unit of measure.
     - Correct:
        - 100 GB
        - 1 TB
        - 3 minutes
        - 12 subnets (8 public and 4 private)
     - Incorrect
        - One hundred GB
        - 1TB

### Procedures

A procedure is a series of numbered steps that a user follows to complete a specific task. Users should be able to scan for and recognize procedures easily. Make procedures recognizable by using the following:

- Predictable content parts
- Parallel language constructions
- Consistent formatting

Use *example*, not *sample*, to introduce example blocks (for example, code, scripts, and API requests and responses).

#### Describing interactions with the UI

Replace pointer-specific verbs with device-agnostic/generic verbs to accommodate readers with disabilities and users of various input methods and devices, including the pointer, keyboard, and touch screens. Don't use device-specific verbs such as _click_ or _swipe_. However, when the generic language makes it difficult to understand the instructions, you can include pointer-specific hints in parentheses. Use your judgment. If you have a question, ask your editor.

We follow a slightly modified version of the _Microsoft Writing Style Guide_ guidance on describing interactions with a UI, provided here.

| Verb | Use for | Examples |
| :--------- | :------- | :------- |
| **Open** | - Apps and programs <br> - Files and folders <br> - Shortcut menus <br> Use for websites and webpages only when necessary to match the UI. Otherwise, use _go to_. <br> - Don't use for commands and menus. | - Open Photos. <br> - Open the Reader app. <br> - Open the Filename file. <br> - To open the document in Outline view, select **View** > **Outline**. <br> - In WindowName, open the shortcut menu for ItemName. |
| **Close** | - Apps and programs <br> - Dialog boxes <br> - Files and folders <br> - Notifications and alerts <br> - Tabs <br> - The action a program or app takes when it encounters a problem and can't continue. (Don't confuse with _stop responding_). | - Close the Alarms app. <br> - Close Excel. <br> - Save and close the document. <br> - Closing Excel also closes all open worksheets. |
| **Leave** | Websites and webpages | Select **Submit** to complete the survey and leave this page. |
| **Go to** | - Opening a menu. <br> - Going to a tab or another particular place in the UI. <br> - Going to a website or webpage. <br> - It's ok to use _On the **XXX** tab_ if the instruction is brief and continues immediately. | - Go to Search, enter the word **settings**, and then select **Settings**. <br> - Go to **File**, and then select **Close**. <br> - On the ribbon, go to the **Design** tab. <br> - Go to the **Deploy** tab. in the **Configuration** list ... <br> - On the **Deploy** tab, in the **Configuration** list ... <br> - Go to Example.com to register. |
| **Select** | Instructing the user to select a specific item, including: <br> - Selecting an option, such as a button. <br> - Selecting a checkbox. <br> - Selecting a value from a list box. <br> - Selecting link text to go to a link. <br> - Selecting an item on a menu or shortcut menu. <br> - Selecting an item from a gallery. | - Select the **Modify** button. <br> - For **Alignment**, select **Left**. <br> - Select the text, open the shortcut menu, and then select **Font**. <br> - Select **Open in new tab**. <br> - Select the **LinkName** link. |
| **Select and hold, select and hold (or right-click)** | Use to describe pressing and holding an element in the UI. It's OK to use _right-click_ with _select and hold_ when the instruction isn't specific to touch devices. | - To flag a message that you want to deal with later, select and hold it, and then select **Set flag**. <br> - Select and hold (or right-click) the Windows taskbar, and then select **Cascade windows**. <br> - Select and hold (or right-click) the **Start** button, and then select **Device Manager**. |
| **>** | Use a greater-than symbol (>) to separate sequential steps. <br> Only use this approach when there's a clear and obvious path through the UI and the selection method is the same for each step. For example, don't mix things that require opening, selecting, and choosing. <br> Don't bold the greater-than symbol. Include a space before and after the symbol. | Select **Accounts** > **Other accounts** > **Add an account**. |
| **Clear** | Clearing the selection from a checkbox. | Clear the **Header row** checkbox. | 
| **Choose** | Choosing an option, based on the customer's preference or desired outcome. | On the **Font** tab, choose the effects you want. |
| **Switch, turn on, turn off** | Turning a toggle key or toggle switch on or off. | - Use the **Caps lock** key to switch from typing capital letter to typing lowercase letters. <br> - To keep all applied filters, turn on the **Pass all filters** toggle. |
| **Enter** | Instructing the customer to type or otherwise insert a value, or to type or select a value in a combo box. | - In the search box, enter... <br> - In the **Tab stop position** box, enter the location where you want to set the new tab. <br> - In the **Deployment script name** box, enter a name for this script. |
| **Move, drag** | Moving anything from one place to another by dragging, cutting and pasting, or another method. Use for tiles and any open window (including apps, dialog boxes, and files). <br> Use _move through_ to describe moving around on a page, moving through screens or pages in an app, or moving up, down, right, and left in a UI. | - Drag the Filename file to the Foldername folder. <br> - Move the tile to the new section. <br> - Drag the Snipping Tool out of the way, if necessary, and then select the area you want to capture. <br> - If the **Apply Styles** task pane is in your way, just move it. |
| **Press** | Use _press_ to describe single key or key combination entries that users would perform on a keyboard, such as keyboard shortcuts. | - Press **F5**. <br> - Press **Shift+Enter**. <br> - Press **Ctrl+Alt+Delete**. |
| **Zoom, zoom in, zoom out** | Use _zoom_, _zoom in_, and _zoom out_ to refer to changing the magnification of the screen or window. | - Zoom in to see more details on the map. <br> - Zoom out to see a larger geographic area on the map. <br> - Zoom in or out to see more or less detail. |

### Punctuation and capitalization

- Use only one space after a period.

- Use contractions carefully for a more casual tone. Use common contractions. Avoid future tense (I’ll), archaic (‘twas), colloquial (ain’t), or compound (couldn’t’ve) contractions.

- Use sentence case for titles, headings, and table headers. Titles of standalone documents may use title case.

- Use lowercase for nouns and noun phrases that are not proper nouns; for example, *big data*. This style follows the standard rules of American English grammar.

- For plural forms of nouns that end in “s”, form the possessive case by adding only an apostrophe.

- When a colon introduces a list of words, a phrase, or other sentence fragment, the first word following the colon is lowercased unless it is a proper name. When a colon introduces one or more complete sentences, the first word following it is capitalized. When text introduces a table or image, it should be a complete sentence and end with a period, not a colon.

- Use commas to separate the following:
     - Independent clauses separated by coordinating conjunctions (but, or, yet, for, and, nor, so).
     - Introductory clauses, phrases, words that precede the main clause.
     - Words, clauses, and phrases listed in a series. Also known as the Oxford comma.
     - Skip the comma after single-word adverbs of time at the beginning of a sentence, such as *afterward*, *then*, *later*, or *subsequently*.

- An em dash (—) is the width of an uppercase M. Do not include spacing on either side. Use an em dash to set off parenthetical phrases within a sentence or set off phrases or clauses at the end of a sentence for restatement or emphasis.

- An en dash (–) is the width of an uppercase N. In ranges, do not include spacing on either side. Use an en dash to indicate ranges in values and dates, separate a bullet heading from the following text in a list, or separate an open compound adjective (two compounds, only one of which is hyphenated) from the word that it modifies.

- Words with prefixes are normally closed (no hyphen), whether they are nouns, verbs, adjectives, or adverbs. Note that some industry terms don’t follow this hyphenation guidance. For example, *Command Line Interface* and *high performance computing* aren’t hyphenated, and *machine learning* isn’t hyphenated when used as an adjective. Other terms are hyphenated to improve readability. Examples include *non-production*, *post-migration*, and *pre-migration*.

- In general, comparative or superlative modifiers with “more,” “most,” “less,” or “least” don’t require hyphens. Use one only if it’s needed to avoid ambiguity.

- The ampersand (&) should never be used in a sentence as a replacement for the word and. An exception to this is in acronyms where the ampersand is commonly used, such as in Operations & Maintenance (O&M).

- When using a forward slash between words, do not insert space on either side of the slash. For example, *AI/ML* is correct whereas *AI / ML* is incorrect.

- When referring to API parameters, capitalize *Boolean*. Otherwise, primitive Java data types (*byte*, *short*, *int*, *long*, *float*, *double*, and *char*) start with a lowercase letter, while non-primitive types start with an uppercase letter.

### Topic titles

Here are two styles you can use for topic titles:

* *Present participle phrase* + *noun-based phrase* or *present participle phrase* + *preposition* + *noun-based phrase*, used most often for concept or task topics. For example:
     * Configuring security
     * Visualizing your data
     * Running queries in the console

* *Noun-based phrase*, used most often for reference topics. For example:
     * REST API reference
     * OpenSearch CLI
     * Field types
     * Security analytics

Use *example*, not *sample*, in headings that introduce example blocks (for example, code, scripts, and API requests and responses).

## UI text

Consistent, succinct, and clear text is a critical component of a good UI. We help our users complete their tasks by providing simple instructions that follow a logical flow.

### UI best practices

* Follow the OpenSearch Project [naming conventions, voice, tone, and brand personality traits](#naming-conventions-voice-tone-and-brand-personality-traits) guidelines.
* Be consistent with other elements on the page and on the rest of the site.
* Use sentence case in the UI, except for product names and other proper nouns.

### UI voice and tone

Our UI text is people oriented and focused on empowering the user directly. We use language that is conversational, welcoming, engaging, and open and that emphasizes what the user can do with OpenSearch rather than what tasks OpenSearch can perform. The overall tone is knowledgeable but humble, informal but authoritative, informative but not dry, and friendly without being overly familiar.

We talk to readers in their own words, never assuming that they understand how OpenSearch works. We use precise technical terms where appropriate, but we avoid technical jargon and insider lingo. We speak to readers in simple, plain, everyday language.

For more information, see [Voice and tone](#voice-and-tone) and [Brand personality traits](#brand-personality-traits).

### Writing guidelines

UI text is a critical component of a user interface. We help users complete tasks by explaining concepts and providing simple instructions that follow a logical flow. We strive to use language that is consistent, succinct, and clear.

#### What's the purpose of UI text?

UI text includes all words, phrases, and sentences on a screen, and it has the following purposes:

* Describes a concept or defines a term
* Explains how to complete a task
* Describes the purpose of a page, section, table, graph, or dialog box
* Walks users through tutorials and first-run experiences
* Provides context and explanation for individual UI elements that might be unfamiliar to users
* Helps users make a choice or decide if settings are relevant or required for their particular deployment scenario or environment
* Explains an alert or error

#### Basic guidelines

Follow these basic guidelines when writing UI text.

##### Style

* Keep it short. Users don’t want to read dense text. Remember that UI text can expand by 30% when it’s translated into other languages.
* Keep it simple. Try to use simple sentences (one subject, one verb, one main clause and idea) rather than compound or complex sentences.
* Prefer active voice over passive voice. For example, "You can attach up to 10 policies" is active voice, and "Up to 10 policies can be attached" is passive voice.
* Use device-agnostic language rather than mouse-specific language. For example, use _choose_ instead of _click_ (exception: use _select_ for checkboxes).

##### Tone

* Use a tone that is knowledgeable but humble, informal but authoritative, informative but not dry, and friendly without being overly familiar.
* Use everyday language that most users will understand.
* Use second person (you, your) when you address the user.
* Use _we_ if you need to refer to the OpenSearch Project as an organization; for example, "We recommend…."

##### Mechanics

* Use sentence case for all UI text. (Capitalize only the first word in a sentence or phrase as well as any proper nouns, such as service names. All other words are lowercase.)
* Use parallel construction (use phrases and sentences that are grammatically similar). For example, items in a list should start with either all verbs or all nouns.
     
     **Correct**

     Snapshots have two main uses:
     * Recovering from failure
     * Migrating from one cluster to another

     **Incorrect**

     Snapshots have two main uses:
     * Failure recovery
     * Migrating from one cluster to another

* Use the serial (Oxford) comma. For example, “issues, bug fixes, and features”, not “issues, bug fixes and features”.
* Don’t use the ampersand (&).
* Avoid Latinisms, such as _e.g._, _i.e._, or _etc._ Instead of _e.g._, use _for example_ or _such as_. Instead of _i.e._, use _that is_ or _specifically_. Generally speaking, _etc._ and its equivalents (such as _and more_ or _and so on_) aren’t necessary.

## Special considerations for blog posts

Blog posts provide an informal approach to educating or inspiring readers through the personal perspective of the authors. Brief posts generally accompany service or feature releases, and longer posts may note best practices or provide creative solutions. Each post must provide a clear community benefit.

To enhance the strengths of the blogging platform, follow these post guidelines:

**Be conversational and informal.**

Posts tend to be more personable, unlike technical documentation. Ask questions, include relevant anecdotes, add recommendations, and generally try to make the post as approachable as possible. However, be careful of slang, jargon, and phrases that a global audience might not understand.

**Keep it short.**

Deep topics don’t necessarily require long posts. Shorter, more focused posts are easier for readers to digest. Consider breaking a long post into a series, which can also encourage repeat visitors to the blog channel.

**Avoid redundancy.**

Posts should add to the conversation. Instead of repeating content that is already available elsewhere, link to detail pages and technical documentation. Keep only the information that is specific to the post solution or recommendations.

**Connect with other content.**

All posts should contain one or more calls to action that give readers the opportunity to create resources, learn more about services or features, or connect with other community members. Posts should also include metadata tags such as services, solutions, or learning levels to help readers navigate to related content.

## Inclusive content

When developing OpenSearch Project documentation, we strive to create content that is inclusive and free of bias. We use inclusive language to connect with the diverse and global OpenSearch Project audience, and we are careful in our word choices. Inclusive and bias-free content improves clarity and accessibility of our content for all audiences, so we avoid ableist and sexist language and language that perpetuates racist structures or stereotypes. In practical terms, this means that we do not allow certain terms to appear in our content, and we avoid using others, *depending on the context*.

Our philosophy is that we positively impact users and our industry as we proactively reduce our use of terms that are problematic in some contexts. Instead, we use more technically precise language and terms that are inclusive of all audiences.

### Offensive terms

The following terms may be associated with unconscious racial bias, violence, or politically sensitive topics and should not appear in OpenSearch Project content, if possible. Note that many of these terms are still present but on a path to not being supported. For example, `slave` was removed from the Python programming language in 2018, and the open-source community continues to work toward replacing these terms.

| Don’t use      | Guidance/Use instead        |
|----------------|-----------------------------|
| abort          | Don't use because it has unpleasant associations and is unnecessarily harsh sounding. Use *stop*, *end*, or *cancel* instead.                    |
| black day      | blocked day                 |
| blacklist      | deny list                   |
| kill           | Don't use. Replace with *stop*, *end*, *clear*, *remove*, or *cancel*. <br><br> Exception: *Kill* is unavoidable when referring to Linux kill commands. |
| master         | primary, main, leader       |
| master account | management account          |
| slave          | replica, secondary, standby |
| white day      | open day                    |
| whitelist      | allow list                  |

### Sensitive terms

The following terms may be problematic *in some contexts*. This doesn’t mean that you can’t use these terms—just be mindful of their potential associations when using them, and avoid using them to refer to people. 

| Avoid using              | Guidance/Use instead                |
|--------------------------|-------------------------------------|
| blackout                 | service outage, blocked             |
| demilitarized zone (DMZ) | perimeter network, perimeter zone   |
| primitive                | Avoid using *primitive* (especially plural *primitives*) as a colloquial way of referring to the basic concepts or elements that are associated with a feature or to the simplest elements in a programming language. For greatest clarity and to avoid sounding unpleasant, replace with *primitive data type* or *primitive type*. |

## Trademark policy

The “OpenSearch” word mark should be used in its exact form and not abbreviated or combined with any other word or words (e.g., “OpenSearch” software rather than “OPNSRCH” or “OpenSearch-ified”). See the [OpenSearch Trademark Policy](https://opensearch.org/trademark-usage.html) for more information. Also refer to the policy and to the [OpenSearch Brand Guidelines](https://opensearch.org/brand.html) for guidance regarding the use of the OpenSearch logo. When using another party’s logo, refer to that party’s trademark guidelines.

