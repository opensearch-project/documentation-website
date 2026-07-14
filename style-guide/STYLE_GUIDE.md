---
title: Style Guide
nav_order: 10
---

# Style Guide

This guide describes the style standards for creating OpenSearch content. For complementary information, see the [Writing Guide](WRITING_GUIDE.md), [Text Formatting Guide](TEXT_FORMATTING_GUIDE.md), and [Markdown Formatting Guide](MARKDOWN_FORMATTING_GUIDE.md).

Our content follows the [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/), [The Chicago Manual of Style](https://www.chicagomanualofstyle.org/home.html), and [Merriam-Webster](https://www.merriam-webster.com/). However, this guide and [Terms](TERMS.md) take precedence over those references.

## Naming conventions, voice and tone, and brand personality traits

The following sections provide guidance on OpenSearch Project naming conventions, voice and tone, and brand personality traits.

### Naming conventions

Follow these naming conventions in OpenSearch Project content:

- Capitalize both words when referring to the _OpenSearch Project_.
- _OpenSearch_ is the name for the distributed search and analytics engine used by Amazon OpenSearch Service.
- Amazon OpenSearch Service is a managed service that makes it easy to deploy, operate, and scale OpenSearch. Use the full name _Amazon OpenSearch Service_ on first appearance. You can use the abbreviated name, _OpenSearch Service_, for subsequent appearances.
- Amazon OpenSearch Serverless is an on-demand serverless configuration for Amazon OpenSearch Service. Use the full name _Amazon OpenSearch Serverless_ on first appearance. You can use the abbreviated name, _OpenSearch Serverless_, for subsequent appearances.
- OpenSearch Dashboards is the UI for OpenSearch. Use the full name _OpenSearch Dashboards_ on all appearances.
- _Security Analytics_ is a security information and event management (SIEM) solution for OpenSearch. Capitalize both words when referring to the name of the solution.
- Observability is a collection of plugins and applications that let you visualize data-driven events by using Piped Processing Language (PPL). Capitalize _Observability_ when referring to the name of the solution.
- Refer to OpenSearch Project customers as _users_, and refer to the larger group of users as _the community_. Do not refer to the OpenSearch Project or to the AWS personnel working on the project as a _team_, as this implies differentiation within the community.

#### Product names

Capitalize product names. The OpenSearch Project has three products: OpenSearch, OpenSearch Dashboards, and OpenSearch Data Prepper. For example:

- "To install _OpenSearch_, download the Docker image."
- "To access _OpenSearch Dashboards_, open your browser and navigate to http://localhost:5601/app/home."
- "_OpenSearch Data Prepper_ contains the following components:"

Capitalize the names of clients and tools. For example:

- "The OpenSearch _Python_ client provides a more natural syntax for interacting with your cluster."
- "The _Go_ client retries requests for a maximum of three times by default."
- "The _OpenSearch Kubernetes Operator_ is an open-source Kubernetes operator that helps automate the deployment and provisioning of OpenSearch and OpenSearch Dashboards in a containerized environment."

#### Features

Features are the individual building blocks of user experiences, reflect the functionality of a product, and are shared across different experiences. For example, the SQL/PPL, reporting, notifications, alerting, and anomaly detection used for observability are the same SQL/PPL, reporting, notifications, alerting, and anomaly detection used for general analytics, security analytics, and search analytics. Components of the user experience, such as navigation, credentials management, and theming, are also considered to be features.

Use lowercase when referring to features, unless you are referring to a formally named feature that is specific to OpenSearch. For example:

- "_Remote-backed storage_ is an experimental feature. Therefore, we do not recommend the use of _remote-backed storage_ in a production environment."
- "You can take and restore _snapshots_ using the Snapshot API."
- "Use _VisBuilder_ for rapid exploration of data relationships through an intuitive drag-and-drop interface." (You can refer to VisBuilder alone or qualify the term with "visualization type".)

#### Plugins

A plugin is a distinct component that extends the functionality of OpenSearch. Describe features from the user's perspective rather than referencing the plugin that implements them. 

| Correct | Incorrect |
| :--- | :--- |
| "OpenSearch offers two distinct approaches to machine learning (ML)." | "The ML Commons plugin provides two distinct approaches to machine learning (ML)." |
| "AI search streamlines your workflow by generating embeddings automatically." | "The Neural Search plugin lets you generate embeddings automatically." |

It's preferable to refer to settings by the functionality they provide. For example, instead of "Neural Search plugin settings" and "k-NN plugin settings", you can use "vector search settings" because these settings support vector search functionality. Only mention a plugin by name if necessary when describing the plugin settings. 

| Preferred | Acceptable |
| :--- | :--- |
| "To enable query metrics, configure the following settings:" | "To enable query metrics, configure the following Query Insights plugin settings:" |
| "You can customize vector search by modifying the following settings." | "The Neural Search plugin supports the following settings." |

Most plugins are bundled with the standard OpenSearch distribution. Do not include installation steps for bundled plugins. Instead, describe how to configure or use the feature directly. Plugins that are _not_ bundled by default (such as the `analysis-icu` plugin) do require an installation step.

When referring to a plugin by name, always include the word "plugin" after the name and capitalize the plugin name but not the word "plugin" (for example, "Query Insights plugin," "ML Commons plugin," or "Notifications plugin"). Do not use the plugin name alone as a proper noun (for example, use "the Anomaly Detection plugin," not "Anomaly Detection").

### Voice and tone

Voice is the point of view or style of a writer. Voice can refer to active or passive but may also refer to verb tense (past, present, future, and so on). Tone is the emotional undercurrent (such as calm or angry) of the voice. We strive to speak to the community with a consistent voice and tone, as if a single writer writes all content. Writing with a common voice also helps to establish the OpenSearch Project identity and brand.

#### Voice

The voice of the OpenSearch Project is people oriented and focused on empowering the user directly. We use language that emphasizes what the user can do with OpenSearch rather than what tasks OpenSearch can perform.

In most cases, try to describe the actions that the user takes rather than contextualizing from the feature perspective. For example, use phrases such as "You can _do X_ by using _this feature_" or "Use _this feature_ to _do X_" instead of saying a feature _allows_, _enables_, or _lets_ the user do something.

Refer to the reader as _you_ (second person), and refer to the OpenSearch Project as _we_ (first person). If there are multiple authors for a blog post, you can use _we_ to refer to the authors as individuals. 

For procedures or instructions, ensure that action is taken by the user ("Then you can stop the container...") rather than the writer ("We also have to stop the container..."). Reserve the first-person plural for speaking as the OpenSearch Project, with recommendations, warnings, or explanations.

Whenever possible, use the active voice instead of the passive voice. The passive form is typically wordier and can often cause writers to obscure the details of the action. For example, change the agentless passive _it is recommended_ to the more direct _we recommend_. For more information and examples, see [Active and passive voice](WRITING_GUIDE.md#active-and-passive-voice).

In general, use the present tense. Use the future tense only when an event happens later than, not immediately after, the action under discussion. For more information and examples, see [Tense](WRITING_GUIDE.md#tense).

#### Tone

The tone of the OpenSearch Project is conversational, welcoming, engaging, and open. The overall tone is knowledgeable but humble, informal but authoritative, informative but not dry, and friendly without being overly familiar.

We talk to readers in their own words, never assuming that they understand how OpenSearch works. We use precise technical terms where appropriate, but we avoid technical jargon and insider lingo. We speak to readers in simple, plain, everyday language.

Avoid excessive words, such as please. Be courteous but not wordy. Extra detail can often be moved elsewhere. Use humor with caution because it is subjective, can be easily misunderstood, and can potentially alienate your audience.

### Brand personality traits

| Personality trait | Description | Guidance |
| :--------- | :------- | :------ |
| **Clear and precise** | The OpenSearch Project understands that our community works, develops, and builds in roles and organizations that require precise thinking and thorough documentation. We strive to use precise language—to clearly say what we mean without leaving ideas open to interpretation, to support our assertions with facts and figures, and to provide credible and current (third-party) references where called for. <br> <br> We communicate in plain, direct language that is easily understood. Complex concepts are introduced in a concise, unambiguous way. High-level content is supported by links to more in-depth or technical content that users can engage with at their convenience. | - Write with clarity and choose words carefully. Think about the audience and how they might interpret your assertions. <br> - Be specific. Avoid estimates or general claims when exact data can be provided. <br> - Support claims with data. If something is "faster" or "more accurate," say how much. <br> - When citing third-party references, include direct links. |
| **Transparent and open** | As an open-source project, we exchange information with the community in an accessible and transparent manner. We publish our product plans in the open on GitHub, share relevant and timely information related to the project through our forum and/or our blog, and engage in open dialogues related to product and feature development in the public sphere. Anyone can view our roadmap, raise a question or an issue, or participate in our community meetings. | - Tell a complete story. If you're walking the reader through a solution or sharing news, don't skip important information. <br> - Be forthcoming. Communicate time-sensitive news and information in a thorough and timely manner. <br> - If there's something the reader needs to know, say it up front. Don't "bury the lede." |
| **Collaborative and supportive** | We're part of a community that is here to help. We aim to be resourceful on behalf of the community and encourage others to do the same. To facilitate an open exchange of ideas, we provide forums through which the community can ask and answer one another's questions. | - Use conversational language that welcomes and engages the audience. Have a dialogue. <br> - Invite discussion and feedback. We have several mechanisms for open discussion, including requests for comment (RFCs), a [community forum](https://forum.opensearch.org/), and [community meetings](https://www.meetup.com/OpenSearch/). |
| **Trustworthy and personable** | We stay grounded in the facts and the data. We do not overstate what our products are capable of. We demonstrate our knowledge in a humble but authoritative way and reliably deliver what we promise. We provide mechanisms and support that allow the audience to explore our products for themselves, demonstrating that our actions consistently match our words. <br> <br> We speak to the community in a friendly, welcoming, judgment-free way so that our audience perceives us as being approachable. Our content is people oriented and focused on empowering the user directly. | - Claims and assertions should be grounded in facts and data and supported accordingly. <br> - Do not exaggerate or overstate. Let the facts and results speak for themselves. <br> - Encourage the audience to explore our products for themselves. Offer guidance to help them do so. <br> - Write directly and conversationally. Have a dialogue with your audience. Imagine writing as if you're speaking directly to the person for whom you're creating content. <br> - Write from the community, for the community. Anyone creating or consuming content about OpenSearch is a member of the same group, with shared interest in learning about and building better search and analytics solutions. |
| **Inclusive and accessible** | As an open-source project, the OpenSearch Project is for everyone, and we are inclusive. We value the diversity of backgrounds and perspectives in the OpenSearch community and welcome feedback from any contributor, regardless of their experience level. <br> <br> We design and create content so that people with disabilities can perceive, navigate, and interact with it. This ensures that our documentation is available and useful for everyone and helps improve the general usability of content. <br> <br> We understand our community is international and our writing takes that into account. We use plain language that avoids idioms and metaphors that may not be clear to the broader community. | - Use inclusive language to connect with the diverse and global OpenSearch Project audience. <br> - Be careful with our word choices. <br> - Avoid [sensitive terms](#sensitive-terms). <br> - Don't use [offensive terms](#offensive-terms). <br> - Don't use ableist or sexist language or language that perpetuates racist structures or stereotypes. <br> - Links: Use link text that adequately describes the target page. For example, use the title of the target page instead of "here" or "this link." In most cases, a formal cross-reference (the title of the page you're linking to) is the preferred style because it provides context and helps readers understand where they're going when they choose the link. <br> - Images: <br> &nbsp;&nbsp;- Add introductory text that provides sufficient context for each image. <br> &nbsp;&nbsp;- Add ALT text that describes the image for screen readers. <br> - Procedures: Not everyone uses a mouse, so use device-independent verbs; for example, use "choose" instead of "click." <br> - Location: When you're describing the location of something else in your content, such as an image or another section, use words such as "preceding," "previous," or "following" instead of "above" and "below."

## Inclusive content

When developing OpenSearch Project documentation, we strive to create content that is inclusive and free of bias. We use inclusive language to connect with the diverse and global OpenSearch Project audience, and we are careful in our word choices. Inclusive and bias-free content improves clarity and accessibility of our content for all audiences, so we avoid ableist and sexist language and language that perpetuates racist structures or stereotypes. In practical terms, this means that we do not allow certain terms to appear in our content, and we avoid using others, _depending on the context_.

Our philosophy is that we positively impact users and our industry as we proactively reduce our use of terms that are problematic in some contexts. Instead, we use more technically precise language and terms that are inclusive of all audiences.

### Offensive terms

The following offensive terms should not appear in OpenSearch Project content, if possible. Note that many of these terms are still present in existing code but are being replaced. For example, `slave` was removed from the Python programming language in 2018, and the open-source community continues to work toward replacing these terms.

| Don't use      | Use instead                 |
|----------------|-----------------------------|
| blacklist      | deny list                   |
| master         | primary, main, leader       |
| master node    | cluster manager node        |
| slave          | replica, secondary, standby |
| whitelist      | allow list                  |

### Sensitive terms

The following terms may be problematic _in some contexts_. This doesn't mean that you can't use these terms—just be mindful of their potential associations when using them, and avoid using them to refer to people. 

| Avoid using              | Use instead                |
|--------------------------|-------------------------------------|
| abort          | stop, end, cancel                    |
| blackout                 | service outage, blocked             |
| kill           | stop, end, clear, remove, cancel <br><br> Exception: Use `kill` when referring to the UNIX `kill` command. |

## Trademark policy

The "OpenSearch" word mark should be used in its exact form and not abbreviated or combined with any other word or words (for example, "OpenSearch" software rather than "OPNSRCH" or "OpenSearch-ified"). See the [OpenSearch Trademark Policy](https://opensearch.org/trademark-usage.html) for more information. Also refer to the policy and to the [OpenSearch Brand Guidelines](https://opensearch.org/brand.html) for guidance regarding the use of the OpenSearch logo. When using another party's logo, refer to that party's trademark guidelines.

