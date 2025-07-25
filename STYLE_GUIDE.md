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
* OpenSearch Dashboards is the UI for OpenSearch. On first appearance, use the full name *OpenSearch Dashboards*. *Dashboards* can be used for subsequent appearances. 
* Refer to OpenSearch Project customers as *users*, and refer to the larger group of users as *the community*.

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
* “As of OpenSearch 2.4, the *model-serving framework* only supports text embedding models without GPU acceleration.”

#### Plugin names

A plugin is a feature or distinct component that extends the functionality of OpenSearch. For now, capitalize plugin names, but use *plugin* sparingly. The concept of plugins will become obsolete once we re-architect the product. For example:

* “Interaction with the *ML Commons* plugin occurs through either the REST API or [ad](https://docs.opensearch.org/latest/search-plugins/sql/ppl/functions#ad) and [kmeans](https://docs.opensearch.org/latest/search-plugins/sql/ppl/functions#kmeans) Piped Processing Language (PPL) commands.”
* “Use the *Neural Search* plugin to integrate ML language models into your search workloads.”

### Voice and tone

Voice is the point of view or style of a writer. Voice can refer to active or passive but may also refer to verb tense (past, present, future, and so on). Tone is the emotional undercurrent (such as calm or angry) of the voice. We strive to speak to the community with a consistent voice and tone, as if a single writer writes all content. Writing with a common voice also helps to establish the OpenSearch Project identity and brand.

#### Voice

The voice of the OpenSearch Project is people oriented and focused on empowering the user directly. We use language that emphasizes what the user can do with OpenSearch rather than what tasks OpenSearch can perform.

Whenever possible, use the active voice instead of the passive voice. The passive form is typically wordier and can often cause writers to obscure the details of the action. For example, change the agentless passive _it is recommended_ to the more direct _we recommend_.

Refer to the reader as _you_ (second person), and refer to the OpenSearch Project as _we_ (first person). If there are multiple authors for a blog post, you can use _we_ to refer to the authors as individuals.

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
| **Trustworthy and personable** | We stay grounded in the facts and the data. We do not overstate what our products are capable of. We demonstrate our knowledge in a humble but authoritative way and reliably deliver what we promise. We provide mechanisms and support that allow the audience to explore our products for themselves, demonstrating that our actions consistently match our words. <br> <br> We speak to the community in a friendly, welcoming, judgment-free way so that our audience perceives us as being approachable. Our content is people oriented and focused on empowering the user directly. | - Claims and assertions should be grounded in facts and data and supported accordingly. <br> - Do not exaggerate or overstate. Let the facts and results speak for themselves. <br> - Encourage the audience to explore our products for themselves. Offer guidance to help them do so. <br> - Write directly and conversationally. Have a dialogue with your audience. Imagine writing as if you’re speaking directly to the person for whom you’re creating content. <br> - Write from the community, for the community. Anyone creating or consuming content about OpenSearch is a member of the same group, with shared interest in learning about and building better search and analytics solutions. <br> - Use judgment-free language. Words like simple, easy, and just create a skill judgment that may not apply to everyone in the OpenSearch community. |
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

### Formatting and organization

- Use a colon to introduce example blocks (for example, code and scripts) and most lists. Do not use a colon to introduce tables or images.

- Use bold text for all UI elements, including pages, panes, and dialog boxes. In all cases, emphasize what the user must do as opposed to talking about the UI element itself.

- Reference images in the text that precedes them. For example, "..., as shown in the following image."

- Stacked headings should never appear in our content. Stacked headings are any two consecutive headings without intervening text. Even if it is just an introductory sentence, there should always be text under any heading.

- Use italics for the titles of books, periodicals, and reference guides. However, do not use italics when the title of a work is also a hyperlink.

- You can refer to APIs in three ways:
     1. When referring to API names, capitalize all words in the name (example: "Field Capabilities API").
     2. When referring to API operations by the exact name of the endpoint, use lowercase with code format (example: "`_field_caps` API").
     3. When describing API operations but not using the exact name of the endpoint, use lowercase (example: "field capabilities API operations" or "field capabilities operations").

### Links

- **Formal cross-references**: In most cases, a formal cross-reference (the title of the page you're linking to) is the preferred style because it provides context and helps readers understand where they're going when they choose the link. Follow these guidelines for formal cross-references:
     - Introduce links with formal introductory text:
          - Use "For information *about*" or "For more information *about*." Don't use "For information *on*."
          - If you are linking to procedures, you can use either "For instructions *on*" or "instructions *for*." Don't use "instructions *about*."
          - Where space is limited (for example, in a table), you can use "*See* [link text]." Don't use *go to*.
     - Ensure that the link text matches the section title text. <br> <br> Example: "To get involved, see [Contributing](https://opensearch.org/source.html) on the OpenSearch website." <br>

- **Embedded links**: Embedded links are woven into a sentence without formal introductory text. They're especially useful in tables or other elements where space is tight. The text around the embedded link must relate to the information in the link so that the reader understands the context. Do not use *here* or *click here* for link text because it creates accessibility problems. <br> <br> Example: "Finally, [delete the index](https://docs.opensearch.org/latest/api-reference/index-apis/delete-index)."

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

Replace pointer-specific language with device-agnostic language to accommodate readers with disabilities and users of various input methods and devices, including the pointer, keyboard, and touch screens.

For example, instead of the term *click*, which is pointer-specific, use *choose*, which is more generic and device-agnostic. However, when the generic language makes it difficult to understand the instructions (for example, in the case of opening a context menu), you can include pointer-specific hints. Use your judgment. If you have a question, ask your editor.

Use the following language to describe UI interactions:

- Use *choose* to describe moving to a UI component such as a tab or pane or taking action on a button or menu.
- Use *select* to describe picking a user-specific resource or enabling one of several options. Contrast with *clear* to turn off previously selected options.
- Use *press* to describe single key or key combination entries that users would perform on a keyboard.
- Use *enter* to describe information that users add using a keyboard.
- Do not use *hit* or *strike*.

The following table provides examples of language to be used to describe interactions with UI elements. Note that bold text is used for UI elements.

| UI element | Language | Example |
| :--------- | :------- | :------ |
| Menu | On the *menu* menu, choose *command*. | On the **Edit** menu, choose **Copy**. |
| Cascading menu | [For AWS] On the navigation bar, choose *menu*, *submenu*, …, *command*. <br> <br> [For conventional Windows UIs] On the menu bar, choose *menu*, *submenu*, …, *command*. | On the navigation bar, choose **AWS**, **Create a Resource Group**. | 
| Context menu | Open the context (right-click) menu for *item*, and then choose *command*. <br> <br> [Cascading] Open the context (right-click) menu for *item*, and then choose *submenu*, ..., *command*. | Open the context (right-click) menu for an AMI, and then choose **Launch Instance**. <br> <br> Open the context (right-click) menu for the instance, and then choose **Networking**, **Manage Private IP Addresses**. |
| Command button | Choose *command*. | Choose **Next**. |
| Option button | Choose *option*. <br> <br> For *label*, choose *option*. | For **Type of key to generate**, choose **SSH-2 RSA**. | 
| Check box | Select *label*. <br> <br> Clear *label*. | To grant read access to anonymous requests, select **Make everything public**. | 
| List box or dropdown | For *label*, choose *item*. | For **Backup Retention Period**, choose **0**. |
| Text box | For *label*, enter *text*.<br> <br> [Combo box] For *label*, specify *xyz*. | For **Program/script**, enter `Powershell.exe`. <br> <br> For **Source**, specify the table name. |
| Toggle switch | Turn on *text*.<br> <br> Turn off *text*. | Turn on **Expiration date**, and then choose **Confirm**. |
| Other controls | Specify the type of control only if it’s helpful or unavoidable, and use the verb *choose*. | On the **Configure Security Group** page, choose an existing security group, and then choose **Next**. |
| Double-clicking | Replace with menu instructions, or use a generic term such as "open." <br> <br> If double-clicking is the best or most familiar method, include it in parentheses. <br> <br> In general, use your best judgment depending on the context and your audience. | In AWS Explorer, open **Amazon VPC**, **VPCs**. On the **VPCs** tab, choose **Create VPC**. <br> <br> To display the EC2 Instances view, open the context (right-click) menu for the **Instances** node, and then choose **View**. (Or double-click the node.) | 
| Displaying tooltips | Choose *item*. | In the **Your repositories** area, choose the target repository name to display the GitHub user or organization. | 
| Selecting items | Select the *item*. | Select the row of the parameter group that you want to delete. | 

Following is an example of procedure phrasing and formatting from Amazon EC2.

![Procedure example](/images/procedures.PNG)

### Punctuation and capitalization

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
* Use device-agnostic language rather than mouse-specific language. For example, use _choose_ instead of _click_ (exception: use _select_ for check boxes).

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
| execute        | Replace with a more specific verb. In the sense of carrying out an action, use *run*, *process*, or *apply*. In the sense of initiating an operation, use *start*, *launch*, or *initiate*.<br><br> Exception: *Execution* is unavoidable for third-party terms for which no alternative was determined, such as SQL execution plans. *Executable* is also unavoidable.                              |
| hang           | Don't use. This term is unnecessarily violent for technical documentation. Use *stop responding* instead.                                       |
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
| disable                  | You can use *disable* to describe making a feature or command unavailable. Don't use *disable* to refer to users.                                    |
| enable                   | You can use *enable* to describe making a feature or command available. <br><br> Avoid using *enable* to refer to making something possible for the user. Instead, rewrite to focus on what's important from the user's point of view. For example, “With ABC, you can do XYZ” is a stronger statement than “ABC enables you to XYZ.” Additionally, using a task-based statement is usually more clear than the vague “…enables you to….” |
| invalid                  | not valid                           |
| primitive                | Avoid using *primitive* (especially plural *primitives*) as a colloquial way of referring to the basic concepts or elements that are associated with a feature or to the simplest elements in a programming language. For greatest clarity and to avoid sounding unpleasant, replace with *primitive data type* or *primitive type*. |
| purge                    | Use only in reference to specific programming methods. Otherwise, use *delete*, *clear*, or *remove* instead.                                                |
| segregate                | separate, isolate                   |
| trigger                  | Avoid using as a verb to refer to an action that precipitates a subsequent action. It is OK to use when referring to a feature name, such as a *trigger function* or *time-triggered architecture*. As a verb, use an alternative, such as *initiate*, *invoke*, *launch*, or *start*. |

## Trademark policy

The “OpenSearch” word mark should be used in its exact form and not abbreviated or combined with any other word or words (e.g., “OpenSearch” software rather than “OPNSRCH” or “OpenSearch-ified”). See the [OpenSearch Trademark Policy](https://opensearch.org/trademark-usage.html) for more information. Also refer to the policy and to the [OpenSearch Brand Guidelines](https://opensearch.org/brand.html) for guidance regarding the use of the OpenSearch logo. When using another party’s logo, refer to that party’s trademark guidelines.

