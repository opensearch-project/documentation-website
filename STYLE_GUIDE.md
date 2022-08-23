# OpenSearch style guidelines

Welcome to the content style guide for the OpenSearch project. This guide covers the style standards to be observed when creating OpenSearch content and will evolve as we implement best practices and lessons learned in order to best serve the community.

Our content is generally edited in accordance with the _AWS Style Guide_, the [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/), [The Chicago Manual of Style](https://www.chicagomanualofstyle.org/home.html), and [Merriam-Webster](https://www.merriam-webster.com/) (listed in order of precedence); however, we may deviate from these style guides in order to maintain consistency and accommodate the unique needs of the community. This is by no means an exhaustive list of style standards, and we value transparency, so we welcome contributions to our style standards and guidelines. If you have a question regarding our standards or adherence/non-adherence to the style guides or would like to make a contribution, please tag @natebower on GitHub.

## Voice and tone

Voice is the point of view or style of a writer. Voice can refer to active or passive but may also refer to verb tense (past, present, future, and so on). Tone is the emotional undercurrent (such as calm or angry) of the voice. We strive to speak to the community with a consistent voice and tone, as if a single writer writes all content. Writing with a common voice also helps to establish the OpenSearch identity and brand.

### Voice

The voice of OpenSearch is people-oriented and focused on empowering the end user directly. We use language that emphasizes what the reader can do with the software rather than what tasks the software can perform.

Whenever possible, use the active voice instead of the passive voice. The passive form is typically wordier and can often cause writers to obscure the details of the action. For example, change the agentless passive it is recommended to the more direct we recommend.

Refer to the reader as you (second person) and refer to the OpenSearch organization as we (first person). If there are multiple authors for a blog post, you can use we to refer to the authors as individuals.

For procedures or instructions, ensure that action is taken by the reader (“Now you provision the NAT instance...”) rather than the writer (“We also have to wait for the primary domain controller to...”). Reserve the first-person plural for speaking as OpenSearch, with recommendations, warnings, or explanations.

In general, use the present tense. Use the future tense only when an event happens later than, not immediately after, the action under discussion

### Tone

The tone of OpenSearch is direct and friendly. The overall tone is knowledgeable but humble, informal but authoritative, informative but not dry, and friendly without getting chatty.

We talk to readers in their own words, never assuming that they understand how our technology works. We use precise technical terms where appropriate, but we avoid technical jargon and insider lingo. We speak to readers in simple, plain, everyday language. Our messaging is judgment free; words like simple, easy, and just create a skill judgment that may not apply to everyone in the OpenSearch community.

Avoid excessive words, such as please. Be courteous but not wordy. Extra detail can often be moved elsewhere.

Use humor with caution because it is subjective, can be easily misunderstood, and can potentially alienate your audience.

As you write content, apply the following tone traits.

| **Trait** | **Approachable** | **Authoritative** | **Concise** | **Conversational** | **Directed** | **Respectful** | **Simple** | **Smart** | **Trustworthy** |
|---|---|---|---|---|---|---|---|---|---|
| **What it is** | Personable, Friendly, Welcoming, Genuine | Professional, Expert, Informed, Dependable, Validated | Succinct, Brief, Lean, To the point | Informal, Casual, Familiar, Matter-of-fact | Focused, Guided, Controlled, Purposeful, Predictable, Definitive, Essential | Considerate, Helpful, Supportive, Empathic | Plain, Everyday, Recognizable, Clear, Straightforward, Common | Knowledgeable, Logical, Correct, Consistent, Coherent, Grammatical, Polished | Reliable, Truthful, Fair, Candid |
| **What it isn't** | Chatty, Hyperbolic, Cloying, Insincere | Stuffy, Dictatorial, Smug, Unsure, Untested | Wordy, Lengthy, Verbose, Rambling | Stilted, Pompous, Chummy, Pedantic | Vague, Wandering, Confusing, Ambiguous, Surprising, Indecisive, Redundant | Insulting, Condescending, Insensitive, Indifferent | Fancy, Esoteric, Perplexing, Unintelligible, Complicated, Unusual |  Pedantic, Invalid, Inaccurate, Varying, Disorganized, Careless, Sloppy |  Infallible, Evasive, Devious, Obfuscating |

## Style guidelines

The following guidelines should be observed in OpenSearch content.

### Punctuation and capitalization

- Use lowercase for nouns and noun phrases that are not proper nouns; for example, *big data*. This style follows the standard rules of American English grammar.

- For plural forms of nouns that end in “s”, form the possessive case by adding only an apostrophe.

- When a colon introduces a list of words, a phrase, or other sentence fragment, the first word following the colon is lowercased unless it is a proper name. When a colon introduces one or more complete sentences, the first word following it is capitalized. When text introduces a table, it should be a complete sentence and end with a period, not a colon.

- Use commas to separate the following:
     - Independent clauses separated by coordinating conjunctions (but, or, yet, for, and, nor, so).
     - Introductory clauses, phrases, words that precede the main clause.
     - Words, clauses, and phrases listed in a series. Also known as the Oxford comma.
     - Skip the comma after single-word adverbs of time at the beginning of a sentence, such as *afterward*, *then*, *later*, or *subsequently*.

- An em dash (—) is the width of an uppercase M. Do not include spacing on either side. Use an em dash to set off parenthetical phrases within a sentence or set off phrases or clauses at the end of a sentence for restatement or emphasis.

- An en dash (–) is the width of an uppercase N. In ranges, do not include spacing on either side. Use an en dash to indicate ranges in values and dates, separate a bullet heading from the following text in a list, or separate an open compound adjective (two compounds, only one of which is hyphenated) from the word that it modifies.

- Words with prefixes are normally closed (no hyphen), whether they are nouns, verbs, adjectives, or adverbs. Note that some industry terms don’t follow this hyphenation guidance. For example, *Command Line Interface* and *high performance computing* aren’t hyphenated, and *machine learning* isn’t hyphenated when used as an adjective. Other terms are hyphenated to improve readability. Examples include *non-production*, *post-migration*, and *pre-migration*.

- Use sentence case for topic titles. Titles of guides and references use title case.

- The ampersand (&) should never be used in a sentence as a replacement for the word and. An exception to this is in acronyms where the ampersand is commonly used, such as in Operations & Maintenance (O&M).

- When using a forward slash between words, do not insert space on either side of the slash. For example, *AI/ML* is correct whereas *AI / ML* is incorrect.

- When referring to API parameters, capitalize *Boolean*. Otherwise, primitive Java data types (*byte*, *short*, *int*, *long*, *float*, *double*, and *char*) start with a lowercase letter, while non-primitive types start with an uppercase letter.

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

### Formatting and organization

- Links: In most cases, a formal cross-reference (the title of the page you're linking to) is the preferred style because it provides context and helps readers understand where they're going when they choose the link. Follow these guidelines for formal cross-references:
     - Introduce links with formal introductory text:
          - Use "For information *about*" or "For more information *about*." Don't use "For information *on*."
          - If you are linking to procedures, you can use either "For instructions *on*" or "instructions *for*." Don't use "instructions *about*."
          - Where space is limited (for example, in a table), you can use "*See* [link text]." Don't use "*go to*".

- You can refer to APIs in three ways:
     1. When referring to API names, capitalize all words in the name (example: "Field Capabilities API").
     2. When referring to API operations by the exact name of the endpoint, use lowercase with code format (example: "`_field_caps` API").
     3. When describing API operations but not using the exact name of the endpoint, use lowercase (example: "field capabilities API operations" or "field capabilities operations").

- The following guidelines apply to all list types:
     - Make lists parallel in content and structure. Don’t mix single words with phrases, don’t start some phrases with a noun and others with a verb, and don’t mix verb forms.
     - Present the items in alphabetical order if the order of items is arbitrary.
     - Capitalize the ﬁrst letter of the ﬁrst word of each list item.
     - If the list is simple, you don’t need end punctuation for the list items.
     - If the list has a mixture of phrases and sentences, punctuate each list item.
     - Punctuate each list item with a period if a list item has more than one sentence.
     - Punctuate list items consistently. If at least one item in a list requires a period, use a period for all items in that list.
     - Titles are optional for most lists. If used, the title comes after an introductory sentence.
     - Titles are highly recommended for procedures. Avoid titles for bulleted lists.
     - Introductory sentences are required for lists.
     - Introductory sentences should be complete sentences.
     - Introductory sentences should end with a period if the list has a title.
     - Introductory sentences should end with a colon if the list does not have a title.
     - Don’t use semicolons, commas, or conjunctions (like and or or) at the end of list items.

- Start all task-based headings with an infinitive. For example: “Create an index”. For conceptual sections, use a noun phrase. For example: “Migration to OpenSearch 2.0”

- Stacked headings should never appear in our content. Stacked headings are any two consecutive headings without intervening text. Even if it is just an introductory sentence, there should always be text under any heading.

### Procedures

A procedure is a series of numbered steps that a user follows to complete a specific task. Users should be able to scan for and recognize procedures easily. Make procedures recognizable by using the following:

- Predictable content parts
- Parallel language constructions
- Consistent formatting

Replace pointer-specific language with device-agnostic language to accommodate readers with disabilities and users of various input methods and devices, including the pointer, keyboard, and touch screens.

For example, instead of the term *click*, which is pointer-specific, use *choose*, which is more generic and device-agnostic. However, when the generic language makes it difficult to understand the instructions (for example, in the case of opening a context menu), you can include pointer-specific hints. Use your judgment. If you have a question, ask your editor.

Use the following language to describe UI interactions:

- Use *choose* to describe moving to a UI component such as a tab or pane or taking action on a button or menu.
- Use *select* to describe picking a user-specific resource or enabling one of several options. Contrast with *clear* to turn off previously selected options.
- Use *press* to describe single key or key combination entries that users would perform on a keyboard.
- Use *enter* to describe information that users add using a keyboard.
- Do not use *hit* or *strike*.

The following table provides examples of language to be used to describe interactions with UI elements.

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

### Miscellaneous

- Use contractions carefully for a more casual tone. Use common contractions. Avoid future tense (I’ll), archaic (‘twas), colloquial (ain’t), or compound (couldn’t’ve) contractions.

- Use italics for the titles of books, periodicals, and reference guides. However, do not use italics when the title of a work is also a hyperlink.

- On first use, acronyms should always be defined; for example, _access control list (ACL)_. The acronym itself should be used for subsequent appearances; for example, _ACL_. Some acronyms, like _IT_ and _CPU_, are commonly understood and do not need to be defined. Do not capitalize the spelled-out form of an acronym unless the spelled-out form is a proper noun or the community generally capitalizes it. In all cases, our usage should reflect the community’s usage.

- If the first use of an acronym is in a heading, retain the acronym in the heading, and then write out the term in the following body text, followed by the acronym in parentheses. Don't spell out the term in the heading with the acronym included in parentheses.

- We may not alter quotations in any way. This includes defining acronyms within the quote or altering the quote for context.

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

OpenSearch content strives to be inclusive and free of bias. We use inclusive language to connect with the diverse and global OpenSearch audience. This means we are careful in our word choices. Inclusive and bias-free content improves clarity and accessibility of our content for all audiences. We avoid ableist and sexist language and language that perpetuates racist structures or stereotypes.

### Offensive terms

Do _not_ use the following terms.

| Don’t use      | Use instead                 |
|----------------|-----------------------------|
| abort          | stop                        |
| black day      | blocked day                 |
| blacklist      | deny list                   |
| execute        | start, run                  |
| hang           | stop responding             |
| kill           | end, stop                   |
| master         | primary, main, leader       |
| master account | management account          |
| slave          | replica, secondary, standby |
| white day      | open day                    |
| whitelist      | allow list                  |


### Sensitive terms

Avoid using the following terms.

| Avoid using              | Use instead                         |
|--------------------------|-------------------------------------|
| blackout                 | service outage, blocked             |
| demilitarized zone (DMZ) | perimeter network, perimeter zone   |
| disable                  | turn off, deactivate, stop          |
| enable                   | turn on, activate, start            |
| invalid                  | not valid                           |
| primitive                | primitive data type, primitive type |
| purge                    | delete, clear, remove               |
| segregate                | separate, isolate                   |
| trigger                  | initiate, invoke, launch, start     |
| white day                | open day                            |
| whitelist                | allow list                          |

## Trademark policy

The “OpenSearch” word mark should be used in its exact form and not abbreviated or combined with any other word or words (e.g., “OpenSearch” software rather than “OPNSRCH” or “OpenSearch-ified”). See the [OpenSearch Trademark Policy](https://opensearch.org/trademark-usage.html) for more information. Also refer to the policy and to the [OpenSearch Brand Guidelines](https://opensearch.org/brand.html) for guidance regarding the use of the OpenSearch logo. When using another party’s logo, refer to that party’s trademark guidelines.

