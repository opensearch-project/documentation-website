---
title: Writing Guide
nav_order: 20
---

# Writing Guide

This guide provides writing standards for OpenSearch Project contributors, covering grammar, punctuation, and language mechanics. For brand identity, naming conventions, and voice and tone, see the [Style Guide](STYLE_GUIDE.md). For content formatting conventions, see the [Text Formatting Guide](TEXT_FORMATTING_GUIDE.md). For Markdown and Jekyll syntax, see the [Markdown Formatting Guide](MARKDOWN_FORMATTING_GUIDE.md).

## Grammar

Use the following guidelines to write clear, grammatically correct content.

### Active and passive voice

Use the active voice in most cases. Active voice makes it clear who is doing what and is more concise.

To identify passive voice, look for a form of "to be" (is, was, are, were) followed by a past participle (usually ending in _-ed_ or an irregular form like _written_, _created_, _deleted_).

| Passive | Active |
| :--- | :--- |
| It is recommended that you use ISM policies to automate index operations. | We recommend using ISM policies to automate index operations. |
| The configuration file can be edited to change the settings. | To change the settings, edit the configuration file. |

Every sentence must have an explicit subject. Active voice helps enforce this by requiring the actor to be named. Do not omit the subject, especially after conditional clauses.

| Correct | Incorrect |
| :--- | :--- |
| If the path doesn't exist, the processor attempts to create it. | If the path doesn't exist, attempts to create it. |
| When enabled, the shard request cache stores frequently accessed results. | When enabled, stores frequently accessed results. |

Exception: In parameter tables, you can omit the subject for Boolean parameter descriptions because the parameter name in the first column serves as the subject. For example: "If `true`, the response includes detailed information about shard recovery."

Use the passive voice when:

- The receiver of the action is more important than the doer: "User data was encrypted before it was stored." 
- You are describing a system behavior in which there is no human actor: "The request is routed to the primary shard." 

### Tense

Use the present tense for system behavior, API responses, and feature descriptions. 

| Correct | Incorrect |
| :--- | :--- |
| If you set this parameter, OpenSearch uses the custom analyzer. | If you set this parameter, OpenSearch will use the custom analyzer. |
| The response contains the matching documents. | The response will contain the matching documents. |

Use the future tense only when referring to an event that happens later than the current action: "Note the model ID; you'll use it in the following steps."

### Articles

Use articles to specify whether you're referring to something specific (_the_) or something general (_a/an_):

- Use _a_ or _an_ (indefinite articles) when introducing something for the first time or referring to any one of a group. For example, "send _a_ query." 
- Use _the_ (definite article) when referring to something specific, previously mentioned, or commonly understood. For example, "the response contains the matching documents." This includes:
     - Parameter and field descriptions in tables: "_The_ request-level parameter takes precedence over..." (not "Request-level parameter takes precedence over...").
     - API names in running text: "use _the_ Create Channel Configuration API" (not "use Create Channel Configuration API").
- Don't use an article when referring to abstract ideas or plural nouns used generally. For example, "users have access to logs." 

### Noun modifiers

When a noun modifies another noun (noun adjunct), use the singular form without a possessive. Do not use `'s` when a simple noun modifier works.

| Correct | Incorrect |
| :--- | :--- |
| snapshot files | snapshots files, snapshot's files |
| shard allocation | shard's allocation |
| cluster health | cluster's health |

### That versus which

Use _that_ for essential (restrictive) clauses and _which_ for nonessential (nonrestrictive) clauses. If you can remove the clause without changing the meaning of the sentence, use _which_ with a comma. If the clause is essential to the meaning, use _that_ without a comma.

**Essential clauses** provide information necessary to the meaning of the sentence. Do not separate them with a comma:

> Each document is assigned a relevance score _that_ tells you how well the document matched the query.

Removing "that tells you how well the document matched the query" changes the meaning—without it, the reader does not know what the relevance score does.

> OpenSearch provides various analyzers _that_ let you customize the way text is split into terms.

"That let you customize..." is essential—it defines what these analyzers do. Without it, the sentence just conveys that OpenSearch provides analyzers, which is too vague. Using ", which" here would incorrectly imply the customization ability is a parenthetical aside rather than the main point.

**Nonessential clauses** provide additional information that can be removed without changing the meaning. Separate them with a comma:

> In each cluster, there is an elected cluster manager node, _which_ orchestrates cluster-level operations, such as creating an index.

Removing "which orchestrates cluster-level operations such as creating an index" does not change the core meaning—the sentence still identifies the cluster manager node.

**Use "which" when there is only one of something**: When the noun is unique (identified by name, link, or context), additional information about it is always nonessential because the reader can already identify it. Use ", which":

> `IB` similarity uses the [information-based model](...), _which_ analyzes the repetitive usage of basic elements in symbolic distributions.

There is only one information-based model being referenced (it's linked). The clause adds information but doesn't help identify _which_ model—so it's nonessential.

> This analyzer is part of the `analysis-stempel` plugin, _which_ must be installed before use.

There is only one `analysis-stempel` plugin. The clause "which must be installed before use" adds important information but doesn't help identify the plugin, so it's nonessential. Using "that" here would incorrectly imply there are multiple `analysis-stempel` plugins and you're specifying which one.

> Only documents 1 and 2, _which_ contain values for both `rating` and `num_reviews`, are considered.

Documents 1 and 2 are already identified by number. The clause explains _why_ they're considered but doesn't help identify _which_ documents—so it's nonessential.

**Prefer "the X that" over "which X"**: When you can identify the subject directly, avoid using "which" as a vague reference.

| Correct | Incorrect |
| :--- | :--- |
| Determine the indexes that match the pattern. | Determine which indexes match the pattern. |

**Use "that" after verbs taking a clause object**: Verbs like _detect_, _ensure_, _verify_, _confirm_, _indicate_, and _specify_ need "that" before a clause to avoid ambiguity.

| Correct | Incorrect |
| :--- | :--- |
| If the cluster manager detects _that_ a node has disconnected... | If the cluster manager detects a node has disconnected... |
| The system ensures _that_ the setting is enabled. | The system ensures the setting is enabled. |

Exception: In imperative sentences (commands to the reader), "that" is optional because there is no ambiguity: "Ensure a majority of voting nodes remain available."

### Dangling modifiers

A dangling modifier is a participial phrase at the start of a sentence whose implied subject does not match the actual subject of the main clause. The reader expects the subject immediately after the comma to be the one performing the action in the introductory phrase.

| Correct | Incorrect |
| :--- | :--- |
| After you select the use case, the page appears. | After selecting the use case, the page appears. |
| After you configure the cluster, the nodes restart. | After configuring the cluster, the nodes restart. |
| After enabling the setting, you see the results change. | After enabling the setting, the results change. |

This is common in technical writing when describing user actions followed by system responses. To fix a dangling modifier, either add an explicit subject to the introductory phrase ("After you select...") or make the subject of the main clause match the implied actor ("After selecting..., you see...").

## Punctuation

Use the following guidelines for punctuation.

### Periods

- Use only one space after a period.

### Exclamation points

Do not use exclamation points in documentation. Technical content should be matter-of-fact, not enthusiastic.

### Ellipses

Do not use ellipses in prose. In code blocks and output examples, ellipses (`...`) are acceptable to indicate omitted or truncated content.

### Commas

- Use commas to separate independent clauses joined by coordinating conjunctions (but, or, yet, for, and, nor, so). Both sides of the conjunction must have a subject and verb to require a comma: "The settings are dynamic, so you can change the default behavior without restarting your cluster."
- Use a comma between two adjectives that precede a noun if the adjectives can be reordered or separated by "and": "a scalable, distributed search engine."
- Use commas after introductory clauses, phrases, and words: "If the cluster is unhealthy, check the node logs."
- Use the Oxford comma in series of three or more items: "OpenSearch supports snapshots, replication, and cross-cluster search." Do not use a comma before "or" or "and" when joining only two items: "OpenSearch supports snapshots and replication."
- Use a comma before "such as" when the examples are nonrestrictive (removable without changing meaning): "Update a memory container's properties, such as name, description, and access permissions." Omit the comma when "such as" restricts the meaning: "Plugins such as `analysis-icu` require separate installation."
- Do not use a comma between verbs in a compound predicate (two verbs with one subject): "OpenSearch evaluates the query and then returns the matching documents."
- Do not use a comma before "but" when it does not join two independent clauses: "Similar to `external` but only updates documents if the source version is greater."
- Do not use a comma before "so that" when it introduces a purpose clause: "Only the top tokens are kept so that fewer posting lists are visited."
- Do not use a comma before "because" when it introduces an essential reason: "We recommend mapping the vector field as an object because it stores raw vectors without parsing."
- Do not use a comma before a participial phrase that is essential to the action: "Send a request to the endpoint specifying an ordered list of processors" (not "...endpoint, specifying...").
- Do not join two independent clauses with a comma alone (comma splice). Use a semicolon or rewrite as two sentences: "You cannot change the mapping of an existing field; you can only modify its mapping parameters" (not "...existing field, you can only...").

### Colons

- Use a colon to introduce example blocks (for example, code and scripts) and most lists. Do not use a colon to introduce tables or images.
- When a colon introduces a fragment, the first word following the colon is lowercased unless it is a proper name.
- When a colon introduces one or more complete sentences, the first word following it is capitalized.
- When text introduces a table or image, it should be a complete sentence and end with a period, not a colon.

### Dashes

- **Em dash** (—): Do not include spacing on either side. Use to set off parenthetical phrases within a sentence or to set off phrases at the end of a sentence for restatement or emphasis. In Markdown, use three dashes (`---`).
- **En dash** (–): Do not include spacing on either side in ranges. Use for ranges in values and dates (for example, "2–6") or to separate a bullet heading from the following text in a list (for example, "Full-text query – performs a full-text search"). In Markdown, use two dashes (`--`).

### Hyphenation

Use a hyphen to separate compound adjectives, nouns, or numbers. Compound adjectives are hyphenated when they come before the noun they modify but not when they follow the noun.

| Before the noun (hyphenated) | After the noun (no hyphen) |
| :--- | :--- |
| Nodes have case-sensitive names. | Node names are case sensitive. |
| These addresses specify cluster-manager-eligible nodes. | Nodes at those addresses are cluster manager eligible. |
| A real-time dashboard shows current data. | The dashboard is updated in real time. |
| Configure index-level permissions. | Configure permissions at the index level. |

Additional hyphenation rules:

- **Always hyphenated**: Some compounds are always hyphenated regardless of position (cross-cluster, read-only, built-in, key-value, self-signed, end-to-end, lock-free, schema-free).
- **Adverbs ending in -ly**: Do not hyphenate ("a highly available cluster," not "a highly-available cluster").
- **Comparative or superlative modifiers**: Do not hyphenate phrases with _more_, _most_, _less_, or _least_ unless ambiguous ("more accurate result," "less useful method").
- **Single-letter prefixes**: Always hyphenate (n-gram, k-NN, e-commerce).
- **Spelled-out fractions**: Always hyphenate (one-third of nodes).
- **Prefixes (pre, post, non)**: Usually closed (pretrained, preconfigured, predefined). Hyphenate when the base word starts with a vowel, a capital letter, or when the closed form is ambiguous (pre-filtering, post-processing, non-production, pre-migration, post-migration).
- **Multi-**: Always hyphenate (multi-tenancy, multi-node, multi-search, multi-match).
- **Industry exceptions**: Some industry terms don't follow standard hyphenation rules. For example, _high performance computing_ isn't hyphenated, and _machine learning_ isn't hyphenated when used as an adjective. 

When in doubt, check [Merriam-Webster](https://www.merriam-webster.com/) or refer to [Terms](TERMS.md) for OpenSearch-specific usage.

### Quotation marks and apostrophes

- Use straight quotation marks (") and apostrophes (') instead of curly ones (”, ’).
- Place commas and periods inside closing quotation marks. When the quoted text represents an exact value or phrase that must not include extraneous punctuation, place commas and periods outside.
- Use code font instead of quotation marks for commands, parameters, and values that the user enters or the system returns. For placeholder conventions (angle brackets vs. curly braces), see [Code examples](TEXT_FORMATTING_GUIDE.md#code-examples) in the Text Formatting Guide.
- Use common contractions (don't, isn't, you're, it's) for a more casual tone, but avoid future tense (I'll), archaic ('twas), colloquial (ain't), or compound (couldn't've) contractions.
- For plural forms of nouns that end in "s," form the possessive case by adding only an apostrophe.

### Semicolons

- Use a semicolon to join two closely related independent clauses without a conjunction: "You cannot change the mapping of an existing field; you can only modify its mapping parameters."
- Use a semicolon before conjunctive adverbs (however, therefore, consequently, otherwise) that join two independent clauses: "The index was deleted; therefore, the data is no longer available."
- Do not use a semicolon when a comma is sufficient.

### Ampersand

- Do not use the ampersand (&) in a sentence or heading as a replacement for the word "and."

### Forward slash

- Do not insert space on either side of a forward slash (_AI/ML_ is correct, _AI / ML_ is incorrect).
- Do not use forward slashes to separate actions or list items; use commas with a conjunction instead ("create, update, or manage" not "create/update/manage").

### Parentheses

- Use parentheses to introduce an abbreviation or acronym on first use: "machine learning (ML)."
- Use parentheses for supplementary information that is helpful but not essential to the main sentence. If the parenthetical is a full sentence, place the period inside the closing parenthesis. Otherwise, place the period outside.
- Prefer em dashes for stronger emphasis or commas for lighter parenthetical insertions. Reserve parentheses for genuinely supplementary content that would otherwise interrupt the flow.

## Capitalization

Use the following guidelines for capitalization:

- Use sentence case for titles, headings, and table headers. Titles of standalone documents may use title case.
- Use lowercase for nouns and noun phrases that are not proper nouns; for example, _big data_.
- When referring to API parameters, capitalize _Boolean_. Otherwise, primitive Java data types (_byte_, _short_, _int_, _long_, _float_, _double_, and _char_) start with a lowercase letter, while non-primitive types start with an uppercase letter.

## Word choice

Use the following guidelines for word choice:

- Use clear, direct language. For more information, see the [Plain language guide series](https://digital.gov/guides/plain-language).
- Avoid jargon, phrasal verbs, colloquialisms, and business buzzwords.
- Use American English spelling (for example, "organize," not "organise").

### Use single-word verbs

Replace multi-word verbs (phrasal verbs) with precise single-word alternatives.

| Correct | Incorrect |
| :--- | :--- |
| configure or initialize | set up |
| provision or start | spin up |
| stop or terminate | shut down |
| deploy or release | roll out |
| determine or identify | figure out |
| import or retrieve | pull in |

### Use translation-friendly language

Replace colloquialisms and idioms that may not translate across cultures or languages.

| Correct | Incorrect |
| :--- | :--- |
| by default, natively, or built-in | out of the box |
| internally | under the hood |
| manually or without a template | from scratch |
| configuration or infrastructure | plumbing |

### Use plain language

Replace business buzzwords with plain alternatives.

| Correct | Incorrect |
| :--- | :--- |
| use | leverage |
| use | utilize |
| help or enable | facilitate |
| collaboration | synergy |

### Use precise verbs

Replace vague verbs with specific alternatives.

| Correct | Incorrect |
| :--- | :--- |
| receive, retrieve, or obtain | get |
| manage, process, or resolve | handle |
| view | see |
| specify or configure | tell |
| require or expect | want |
| detect or recognize | know about |
| communicate with or connect to | talk to |

### Use neutral language for software

Do not attribute human qualities or actions to software or systems.

| Correct | Incorrect |
| :--- | :--- |
| OpenSearch receives the request | OpenSearch sees the request |
| The file is located in this directory | The file lives in this directory |
| The cluster tracks node health | The cluster knows which nodes are healthy |

### Use "where" only for locations

Use "where" only for physical or logical locations. For other contexts, use "in which": "the request in which the parameter is specified" (not "the request where the parameter is specified").

### Provide information directly

Avoid describing the document structure, for example, "This section describes..." Instead, provide useful information directly.

### Write for all skill levels

Do not use words that assume that a task is easy for the reader. Avoid words such as "easily," "simply," or "just." What is simple for one reader may not be for another.

## Acronyms

Use the following guidelines for acronyms and abbreviations:

- Spell out acronyms the first time you use them on a page and follow them with the acronym in parentheses. Use the format `spelled-out term (acronym)`. On subsequent use, use the acronym alone.
- Do not capitalize the spelled-out form of an acronym unless it is a proper noun or the community generally capitalizes it.
- In general, spell out acronyms once on a page. You can spell them out more often for clarity.
- Make an acronym plural by adding an _s_ to the end of it. Do not add an apostrophe.
- How an acronym is pronounced determines whether you use the article _an_ or _a_ before it. If it's pronounced with an initial vowel sound, use _an_. Otherwise, use _a_.
- If the first use of an acronym is in a heading, retain the acronym in the heading, and then write out the term in the following body text, followed by the acronym in parentheses.
- In general, spell out abbreviations that end with _-bit_ or _-byte_. Use abbreviations only with numbers in specific measurements (for example, "100 GB"). Always include a space between the number and unit (see [Numbers and measurement](#numbers-and-measurement)). Abbreviations that are well known and don't need to be spelled out are _KB_, _MB_, _GB_, and _TB_.

The following table lists acronyms that you don't need to spell out.

| Acronym | Spelled-out term |
| :--- | :--- |
| 3D | three-dimensional |
| AI | artificial intelligence |
| API | application programming interface |
| ASCII | American Standard Code for Information Interchange |
| BASIC | Beginner's All-Purpose Symbolic Instruction Code |
| BM25 | Best Match 25 |
| CLI | command-line interface |
| CPU | central processing unit |
| CRUD | create, read, update, and delete |
| CSV | comma-separated values |
| DNS | Domain Name System |
| DOS | disk operating system |
| Faiss | Facebook AI Similarity Search |
| FAQ | frequently asked questions |
| FTP | File Transfer Protocol |
| GIF | Graphics Interchange Format |
| HTML | hypertext markup language |
| HTTP | hypertext transfer protocol |
| HTTPS | hypertext transfer protocol secure |
| HTTP(S) | HTTP and HTTPS (use to refer to both protocols) |
| I/O | input/output |
| ID | identifier |
| IP | Internet protocol |
| JPEG | Joint Photographic Experts Group |
| JSON | JavaScript Object Notation |
| k-NN | k-nearest neighbors |
| MS MARCO | Microsoft Machine Reading Comprehension |
| NAT | network address translation |
| NGINX | engine x |
| NMSLIB | Non-Metric Space Library |
| PDF | Portable Document Format |
| RAM | random access memory |
| REST | Representational State Transfer |
| RGB | red-green-blue |
| ROM | read-only memory |
| RPM | RPM Package Manager |
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
| YUM | Yellowdog Updater Modified |

## Numbers and measurement

- Spell out cardinal numbers from 1 to 9 (for example, "one NAT instance"). Use numerals for 10 and higher.
- Spell out ordinal numbers: first, second, and so on.
- In a series that includes numbers 10 or higher, use numerals for all.
- Use a comma separator for numbers of four digits or more (for example, 1,000).
- Exception: use numerals when the number directly references a parameter value or appears alongside other numerals in the same sentence (for example, "return the 3 hotels" when `k=3` in the query, or "a rating between 8 and 10... the 3 hotels").
- For time ranges, separate the numbers with an en dash. Avoid extra words such as "between" or "from n to n": "It can take 5–10 minutes before logs are available" (not "between 5 and 10 minutes").
- Use numerals for all measurement-based references, including time. Include a space between the number and the unit of measure: "100 GB," "1 TB," "3 minutes" (not "One hundred GB" or "1TB").

## Topic titles

Use one of the following styles for topic titles:

- _Present participle phrase_, used most often for concept or task topics: "Configuring security," "Visualizing your data," "Running queries in the console." 
- _Noun-based phrase_, used most often for reference topics: "REST API reference," "OpenSearch CLI," "Field types." 

Use _example_, not _sample_, in headings that introduce example blocks (for example, code, scripts, and API requests and responses).
