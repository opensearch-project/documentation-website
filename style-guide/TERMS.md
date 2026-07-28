---
title: Terms
nav_order: 80
---

# Terms

This guide provides editorial guidelines for terms commonly used in OpenSearch documentation, including spelling, capitalization, hyphenation, and usage. For definitions of OpenSearch concepts, see [Concepts](https://docs.opensearch.org/latest/getting-started/concepts/).

## A

**abort**

Avoid because it has unpleasant associations and is unnecessarily harsh sounding. Use _stop_, _end_, or _cancel_ instead.

**above**

Use only for physical space or screen descriptions, for example, "the button above the bar pane."

For orientation within a document, use _previous_, _preceding_, or _earlier_.

**ad hoc**

Avoid. Use _one-time_ instead.

**administrator, admin**

Spell out when used as a noun ("contact your administrator"). You can use _admin_ as an adjective ("admin credentials," "admin privileges") and in code font (for example, the `admin` user).

**affect**

Affect as a noun refers to emotion as expressed in face or body language. Affect as a verb means to influence. Do not confuse with effect.

**AI**

No need to define as _artificial intelligence (AI)_.

**AI/ML**

On first mention, use artificial intelligence and machine learning (AI/ML).

**allow**

Use allow when the user must have security permissions in order to complete the task.

Avoid using allow to refer to making something possible for the user. Instead, rewrite to focus on what's important from the user's point of view.

**allow list**

Use to describe a list of items that are allowed (not blocked). Do not use as a verb. Do not use whitelist.

**Amazon Bedrock**

Use _Amazon Bedrock_ on all appearances. The prefix is required; do not use _Bedrock_ alone.

**Amazon CloudWatch**

Use _Amazon CloudWatch_ on first appearance in a page; use _CloudWatch_ on subsequent appearances.

**Amazon Elastic Compute Cloud (Amazon EC2)**

Use _Amazon Elastic Compute Cloud (Amazon EC2)_ on first appearance in a page; use _Amazon EC2_ or _EC2_ on subsequent appearances.

**Amazon Elastic Container Service (Amazon ECS)**

Use _Amazon Elastic Container Service (Amazon ECS)_ on first appearance in a page; use _Amazon ECS_ or _ECS_ on subsequent appearances.

**Amazon Elastic Kubernetes Service (Amazon EKS)**

Use _Amazon Elastic Kubernetes Service (Amazon EKS)_ on first appearance in a page; use _Amazon EKS_ or _EKS_ on subsequent appearances.

**Amazon OpenSearch Serverless**

Use _Amazon OpenSearch Serverless_ on first appearance; _OpenSearch Serverless_ is acceptable for subsequent appearances. Amazon OpenSearch Serverless is an on-demand serverless configuration for Amazon OpenSearch Service.

**Amazon OpenSearch Service**

Use _Amazon OpenSearch Service_ on first appearance; _OpenSearch Service_ is acceptable for subsequent appearances. Amazon OpenSearch Service is a managed service that makes it easy to deploy, operate, and scale OpenSearch clusters in the AWS Cloud. Amazon OpenSearch Service is the successor to Amazon Elasticsearch Service (Amazon ES) and supports OpenSearch and legacy Elasticsearch OSS (up to 7.10, the final open-source version of the software).

**Amazon SageMaker**

Use _Amazon SageMaker_ on first appearance in a page; use _SageMaker_ on subsequent appearances.

**Amazon Simple Queue Service (Amazon SQS)**

Use _Amazon Simple Queue Service (Amazon SQS)_ on first appearance in a page; use _Amazon SQS_ or _SQS_ on subsequent appearances.

**Amazon Simple Storage Service (Amazon S3)**

Use _Amazon Simple Storage Service (Amazon S3)_ on first appearance in a page; use _Amazon S3_ or _S3_ on subsequent appearances.

**API, API operation**

Use _operation_ instead of _action_, _method_, or _function_. Three capitalization rules apply:

1. API names: capitalize all words ("Field Capabilities API").
2. API operations by endpoint name: lowercase with code font ("`_field_caps` API").
3. API operations described generically: lowercase ("field capabilities operations" or "field capabilities API operations").

For more information, see [Formatting and organization](TEXT_FORMATTING_GUIDE.md#formatting-and-organization).

**app or application**

Use app for mobile software, application for all other uses.

**appear, display, and open**

Messages and pop-up boxes appear. Windows, pages, and applications open. The verb display requires a definite object. For example: The system displays the error message.

**as well as**

Avoid. Replace with in addition to or and as appropriate.

**auto scaling**

Use lowercase _scaling_, _auto scaling_, and _automatic scaling_ (but not _autoscaling_) as the preferred descriptive terms when generically describing auto scaling functionality.

Do not use hyphenated auto-scaling as a compound modifier. Instead, use scaling (for example, scaling policy), or scalable (for example, scalable target or scalable, load-balanced environment).

**AWS Identity and Access Management (IAM)**

Use _AWS Identity and Access Management (IAM)_ on first appearance in a page; use _IAM_ on subsequent appearances.

**AWS Secrets Manager**

Use _AWS Secrets Manager_ on first appearance in a page; use _Secrets Manager_ on subsequent appearances.

**AWS Signature Version 4**

Use on first appearance. On subsequent appearances, _Signature Version 4_ may be used. Only use _SigV4_ when space is limited.

## B

**backend (n., adj.)**

Use _backend_ as an adjective and a noun. Do not use _back end_ or _back-end_. Do not make _backend_ possessive except as part of a compound noun, such as _backend system_.

**below**

Use only for physical space or screen descriptions, such as "the outlet below the vent," or "the button below the bar pane."

For orientation within a document, use _following_ or _later_.

**Base64**

Not _base64_, _base-64_, or _Base-64_.

**big data**

**blacklist**

Do not use. Use _deny list_ instead.

**blackout**

Avoid using. Use _service outage_ or _blocked_ instead.

**BM25**

A ranking function used to estimate the relevance of documents to a given search query. BM25 extends [TF–IDF](#t) by normalizing document length.

**boost (v., n.), boosting (n., adj.)**

Use _boost_ as a verb ("boost the field's relevance") and as a noun for the parameter value ("apply a boost of 2.0"). Use _boosting_ as a noun for the concept ("term boosting increases relevance") and as an adjective for the query type ("boosting query"). Do not use _boost_ as a noun to mean the general concept; use _boosting_ instead.

**Boolean**

Avoid using the name of a Boolean value at the beginning of a sentence or sentence fragment. In general, capitalize the word Boolean. For specific programming languages, follow the usage in that language.

OpenSearch style:

- You can use the Boolean functions with Boolean expressions or integer expressions.
- IsTruncated(): A Boolean value that specifies whether the resolved target list is truncated.

**bottom**

Use only as a general screen reference, such as "scroll to the bottom of the page." Don't use for window, page, or pane references to features or controls. Rather, use _lower_ instead. For example, you can use the following wording: "Choose the button on the lower left."

**browse**

Use when referring to scanning information or browsing the web. Don't use when describing how to navigate to a particular item on our site or a computer. Instead, use _see_ or _navigate to_.

**build (n., v.)**

Use as a verb to refer to compiling and linking code. Use as a noun only to refer to a compiled version of a program (for example, _Use the current build of Amazon Linux 2_...) in a programming reference.

## C

**CA**

certificate authority

**certs, certificates**

Use _certificates_ on first mention. It's OK to use _certs_ thereafter.

**checkbox, checkboxes**

**CI/CD**

Use _continuous integration_ and _continuous delivery (CI/CD)_ or _continuous integration and delivery (CI/CD)_ on first mention.

**CLI**

No need to define as _command-line interface (CLI)_.

**cluster manager**

Do not capitalize. A single node that routes requests for the cluster and makes changes to other nodes. Each cluster contains a single cluster manager.

**cluster-manager-eligible node**

Hyphenate _cluster-manager-eligible_ when used as a compound adjective before _node_. Do not use _cluster manager eligible node_.

**coordinating node**

Use _coordinating node_, not _coordinator node_. The coordinating node receives client requests, routes them to the appropriate shards, and aggregates the results.

**command line, command-line**

Two words as a noun. Hyphenate as an adjective.

**Cross-Cluster Replication**

A plugin that replicates indexes, mappings, and metadata from one OpenSearch cluster to another. Hyphenate _Cross-Cluster_. Do not use _Cross Cluster Replication_.

**cut over (v.), cutover (n., adj.)**

Use _cut over_ as a verb ("cut over to the new cluster"). Use _cutover_ as a noun or adjective ("perform the cutover," "the cutover phase"). Do not hyphenate. 

**cyber**

Except when dictated by open standards, use as a prefix in a closed compound: don't use spaces or hyphens between _cyber_ and the rest of the word.

## D

**dashboard, Dashboards, OpenSearch Dashboards**

Use _OpenSearch Dashboards_ (capitalized, full name) on all appearances when referring to the web UI application. Use _Dashboards_ (capitalized) only as a short form for the **Dashboards** application within OpenSearch Dashboards (the tool for assembling visualizations into a single page). Use _dashboard_ (lowercase) when referring to an individual page of visualizations created in that application. Do not use _Dashboards_ as a standalone abbreviation for _OpenSearch Dashboards_.

**data**

Use data is, not data are. Don't use datas. Use pieces of data or equivalent to describe individual items within a set of data.

**data center**

**dataset**

**data source**

**data store, datastore**

Two words when used generically, but one word when referring to the VMware product.

**data type**

**dates**

Use one of the following date formats:

- When a human-readable date format is preferred, spell out the date using the Month D, YYYY format (for example, _October 1, 2022_). Do not use an ordinal number for the day (use _1_, not _1st_). If the context is clear, you can omit the year on subsequent mention. If the specific day isn't known, use the Month YYYY format (for example, _October 2022_).
- When a numeric, lexicographically sortable date is required, use the YYYY-MM-DD format (for example, _2022-10-01_). Make sure to add a zero (0) in front of a single-digit month and day. This is the ISO 8601 standard date format. Make sure also that you use a hyphen (-) and avoid omitting the year. Doing so avoids the ambiguity that's caused by the common, locally used formats of MM/DD and DD/MM.

**deny list**

Use to describe a list of items that aren't allowed (blocked). Do not use _blacklist_.

**Dev Tools console**

A tool in OpenSearch Dashboards used to interact with the OpenSearch REST API. Use _Dev Tools console_ on first appearance; _console_ is acceptable for subsequent appearances. Do not capitalize _console_ on its own.

**disable**

Use _disable_ to describe making a feature or command unavailable. For example:

- Clear the checkbox to disable automatic monitoring.
- The feature is disabled by default.

Note that alternatives to _disable_—such as _deactivate_, _turn off_, or _stop_—are acceptable usage where appropriate and may be found in existing documentation. In all cases, use language that corresponds to the language used in the UI, if applicable.

Do not use _disable_ to refer to users.

**downvote**

**dropdown list**

**due to**

Don't use. Use _because of_ instead.

## E

**easy, easier, easily**

Avoid the use of _easy_, _easier_, or _easily_ if possible when describing or comparing an OpenSearch Project product, feature, or procedure in technical content. Use of these terms is audience dependent. These terms are potentially misleading or inaccurate and might be perceived as condescending by some technical users. Instead, describe what the user can do.

On documentation landing pages, it's acceptable to use _easy_, _easier_, or _easily_ within the service description only.

**effect**

_Effect_ as a noun refers to something that's caused by something else. _Effect_ as a verb means to bring about. Do not confuse with _affect_.

**e.g.**

Avoid. Use _for example_ or _such as_ instead.

**email**

Use as a singular noun or adjective to refer to the collective concept, and use _message_ or _mail_ for individual items. Use _send email_ as the verb form. Don't use the plural form because it's a collective noun.

**enable**

Use _enable_ to describe making a feature or command available. For example:

- Select the checkbox to enable automatic monitoring.
- The feature is enabled by default.

Note that alternatives to _enable_—such as _activate_, _turn on_, or _start_—are acceptable usage where appropriate and may be found in existing documentation. In all cases, use language that corresponds to the language used in the UI, if applicable.

Avoid using _enable_ to refer to making something possible for the user. Instead, rewrite to focus on what's important from the user's point of view. For example, "With ABC, you can do XYZ" is a stronger statement than "ABC enables you to XYZ." Additionally, using a task-based statement is usually more clear than the vague "…enables you to…."

**embedding, embeddings**

A numerical vector representation of data (text, images, or other content) used for similarity search. Use the plural _embeddings_ when referring to multiple vectors. Do not use _vector embedding_ redundantly unless distinguishing from other types of embeddings in a non-search context.

**enter**

In general, use in preference to _type_ when a user adds text or other input (such as numbers or symbols).

**etc., et cetera**

Do not use.

Generally speaking, etc. and its equivalents (such as and more or and so on) aren't necessary.

**execute**

Replace with a more specific verb. In the sense of carrying out an action, use _run_, _process_, or _apply_. In the sense of initiating an operation, use _start_, _launch_, or _initiate_.

Exception: _Execution_ is unavoidable for third-party terms for which no alternative was determined, such as SQL execution plans. _Executable_ is also unavoidable.

## F 

**fail over (v.), failover (n.)**

**Faiss**

Facebook AI Similarity Search. Do not define on first appearance. Faiss is a library that allows developers to quickly search for embeddings of multimedia documents that are similar to each other.

**fine-tune (v.), fine-tuned (adj.), fine-tuning (n.)**

Always hyphenated. Not _finetune_ or _fine tune_.

**file name**

**frontend (n., adj.)**

Use frontend as an adjective and a noun. Do not use front end or front-end. Do not make frontend possessive except as part of a compound noun, such as frontend system.

## G

**generative AI**

Do not use _GenAI_, _Gen AI_, _gen AI_, or _genAI_. To avoid the overuse of _generative AI_, _AI/ML-powered applications_ may also be used.

**geodistance**

**geohash**

**geohex**

**geopoint**

**geopolygon**

**geoshape**

**geospatial**

**geotile**
 
## H

**hang**

Do not use. This term is unnecessarily violent for technical documentation. Use _stop responding_ instead.

**hardcode**

**hard disk drive (HDD)**

**high availability (HA)**

**high performance computing (HPC)**

**hostname**

**Hugging Face**

## I

**i.e.**

Do not use. Use _that_ is or _specifically_ instead.

**if, whether**

Do not use _if_ to mean _whether_. It is best to use _whether_ in reference to a choice or alternatives ("we're going whether it rains or not") and _if_ when establishing a condition ("we will go if it doesn't rain").

**in, on**

Use _in Windows_ or _in Linux_ in reference to components of the OS or work in the OS. Use _on Windows_ in reference to Windows applications. Examples:

- Use the Devices and Printers Control Panel in Windows to install a new printer.
- In Windows, run the setup command.
- Select an application that runs on Windows.

Run applications and instances _in the cloud_, but extend services to the cloud.

Use _on the forum_. Whatever is on the internet (the various websites, etc.), you are _on_ because you cannot be _in_ it.

**index, indexes**

In technical documentation and the UI, use _indexes_ as the plural form of _index_. Use _indices_ only in the context of mathematical expressions. Variable and setting names should not be changed.

In blog posts, use the plural _indexes_ unless there is a domain-specific reason (for example, a mathematical or financial context) to use _indices_.

**Index Management (IM)**

**Index State Management (ISM)**

**ingest (v.), ingestion (n.)**

Use _ingest_ as a verb ("ingest data into OpenSearch") and _ingestion_ as a noun ("data ingestion"). Do not use _ingest_ as a noun; use _ingestion_ instead.

**ingest node**

Not _ingestion node_.

**ingest pipeline**

Not _ingestion pipeline_. The compound uses the verb form as a modifier.

**inline**

**install (v.), installation (n.)**

Use _install_ only as a verb ("install the plugin"). For the noun, use _installation_ ("complete the installation"). Do not use _install_ as a noun.

Use _in_ with folders, directories, or paths; use _on_ with disks, drives, or instances.

**internet**

Do not capitalize.

**invalid**

Avoid using. Use _not valid_ instead.

**IP address**

Always use the full term _IP address_; do not abbreviate to _IP_ alone.

## J

**just**

Use _just_ in the sense of _just now_ (as in "the resources that you just created"). Otherwise, use _only_ in all other contexts (to mean "limited to; nothing more than").

## K

**keystore**

**key-value**

Not _key/value_.

**kill**

Avoid because it has unpleasant associations and is unnecessarily harsh sounding. Replace with _stop_, _end_, _clear_, _remove_, or _cancel_.

Exception: Use `kill` when referring to the UNIX `kill` command.

**k-means**

Lowercase _k_, hyphenated. Do not use _K-means_, _k means_, or _K means_.

**k-NN**

Short for _k-nearest neighbors_. No need to define. Do not use _KNN_, _K-NN_, or _kNN_.

## L

**launch**

You _start_ an application but _launch_ an instance, environment, or cluster.

**let**

Avoid using _let_ to refer to making something in a service or feature possible for the user. Instead, rewrite to focus on what's important from the user's point of view.

**leverage**

Replace with _use_.

**lifecycle**

One word in reference to software.

**like (prep.)**

OK to use to call out something for comparison.

As a general rule, if you can replace like with similar to, it's OK to use like. But, if you can replace _like_ with _such as_, use _such as_.

**LLM**

Define on first appearance as _large language model (LLM)_.

**locate in, on**

Located _in_ (a folder, directory, path), located on a disk drive or instance.

**log in (v.), login (adj., n.)**

Use _log in_ as a verb ("log in to the instance"). Use _login_ as a noun or adjective ("the login page"). Note: _log in to_, not _log into_.

**log out (v.), logout (n., adj.)**

Use _log out_ as a verb ("log out of the session"). Use _logout_ as a noun or adjective ("after logout").

**lower left, lower right**

Hyphenate as adjectives. Use instead of _bottom left_ and _bottom right_, unless the field name uses _bottom_. For example, "The lower-right corner."

**LTS**

Long-Term Support

**Lucene**

Apache Lucene™ is a high-performance, full-featured search engine library written entirely in Java. OpenSearch uses a modified version of Lucene as the basis for search operations within OpenSearch.

## M 

**machine learning**

When _machine learning_ is used multiple times in a document, use _machine learning (ML)_ on first mention and _ML_ thereafter. There is no need to redefine _ML_ when _AI/ML_ has already been defined. If spelled out, write _machine learning_ as two words (no hyphen) in all cases, including when used as an adjective before a noun.

**ML Commons**

The plugin name is _ML Commons_—do not spell out as _Machine Learning Commons_. Use _ML Commons plugin_ on first appearance (for example, "the ML Commons plugin provides a framework for ML features").

**master**

Do not use. Use _primary_, _main_, or _leader_ instead.

**master node**

Do not use. Use _cluster manager node_ instead.

**may**

Avoid. Use _can_ or _might_ instead.

**MS MARCO**

Microsoft Machine Reading Comprehension. Do not define on first appearance. MS MARCO is a collection of datasets focused on deep learning in search.

**multilayer, multilayered**

**multi-tenant, multi-tenancy**

Always hyphenated. Not _multitenant_, _multitenancy_, or _multi tenant_.

**must, shall, should**

_Must_ and _shall_ refer to requirements. If the reader doesn't follow the instruction, something won't work right.

_Should_ is used with recommendations. If the reader doesn't follow the instruction, it might be harder or slower, but it'll work.

## N 

**navigate to**

Not navigate _in_.

**near real time (n.), near real-time (adj.) (NRT)**

Use _near real time_ as a noun; use near real-time as an adjective. Don't add a hyphen between _near_ and _real time_ or _real-time_.

Spell out _near real time_ on first mention; _NRT_ can be used on subsequent mentions.

**NMSLIB**

Non-Metric Space Library. Do not define on first appearance. NMSLIB is an efficient similarity search library and a toolkit for evaluation of k-NN methods for generic non-metric spaces. 

**non-production**

Hyphenate to make the term easier to scan and read.

## O

**onsite**

**OpenSearch**

OpenSearch is a community-driven, open-source search and analytics suite derived from Apache 2.0 licensed Elasticsearch 7.10.2 and Kibana 7.10.2. It consists of a search engine daemon, OpenSearch, and a visualization and user interface, OpenSearch Dashboards.

**OpenSearch Dashboards**

The default visualization tool for data in OpenSearch. Use the full name _OpenSearch Dashboards_ on all appearances. See also [dashboard, Dashboards, OpenSearch Dashboards](#d) for disambiguation.

**OpenSearch UI (Dashboards)**

This is an Amazon OpenSearch Service term for the OpenSearch Dashboards interface within the managed service console. Use _OpenSearch UI (Dashboards)_ on first appearance; on subsequent appearances, use _OpenSearch UI_. Do not use this term in open-source OpenSearch documentation—use _OpenSearch Dashboards_ instead.

**OpenSearch Data Prepper**

Use _OpenSearch Data Prepper_ on first appearance; _Data Prepper_ is acceptable for subsequent appearances. OpenSearch Data Prepper is a server-side data collector capable of filtering, enriching, transforming, normalizing, and aggregating data for downstream analytics and visualization. Data Prepper also lets users build custom pipelines to improve the operational view of applications.

**open source (n.), open-source (adj.)**

Use _open source_ as a noun (for example, "The code used throughout this tutorial is open source and can be freely modified"). Use _open-source_ as an adjective _(open-source software)_.

**OpenSearch Playground**

Do not precede with _the_. OpenSearch Playground provides a central location for users to explore and evaluate features in OpenSearch and OpenSearch Dashboards without downloading or installing any OpenSearch components locally.

**operating system**

When referencing operating systems in documentation, follow these guidelines:

- In general, if your docs or procedures apply to both Linux and macOS, you can also include Unix.
- Unix and UNIX aren't the same. UNIX is a trademarked name that's owned by The Open Group. In most cases, you should use Unix.
- When referring to the Mac operating system, use macOS. Don't say Mac, Mac OS, or OS X.
- When referring to Windows, it's not necessary to prefix with Microsoft.
- If you need to reference multiple Unix-like operating systems, you should separate by commas and use the following order: Linux, macOS, or Unix.

**or earlier, or later**

OK to use with software versions.

## P 

**Painless**

The default scripting language for OpenSearch, either used inline or stored for repeat use. Similar to Java's language specification.

**per**

- Do not use to mean _according to_ (for example, per the agreement).
- OK to use in meaning of _to_, _in_, _for_, or _by each_ (one per account) where space is limited and in set terms and phrases, such as any of the following:
     - queries per second (QPS)
     - bits per second (bps)
     - megabytes per second (MBps)
- Consider writing around _per_ elsewhere. _Per_ can sound stuffy and confusing to some global users.

**percent**

Spell out in blog posts (for example, _30 percent_).

Use % in headlines, quotations, and tables or in technical copy.

**pipeline**

A sequence of processing stages that data passes through. OpenSearch uses this term in multiple contexts: an _ingest pipeline_ processes documents before indexing, a _search pipeline_ processes queries or results, and a _Data Prepper pipeline_ moves data between sources and sinks. Use the qualified form (for example, _ingest pipeline_) to avoid ambiguity.

**plaintext, plain text**

Use _plaintext_ only to refer to nonencrypted or decrypted text in content about encryption. Use _plain text_ to refer to ASCII files.

**please**

Avoid using except in quoted text.

**plugin**

Capitalize the plugin name but not the word _plugin_ (for example, _Query Insights plugin_, _ML Commons plugin_). Do not use the plugin name alone as a proper noun (for example, use _the Anomaly Detection plugin_, not _Anomaly Detection_). For more information about referencing plugins, see [Plugins](STYLE_GUIDE.md#plugins).

**pop-up**

**preaggregate**

**precompute**

**premise, premises**

With reference to property and buildings, always form as plural.

Correct: an on-premises solution

Incorrect: an on-premise solution, an on-prem solution

**pretrain, pretrained, pretraining**

Not _pre-train_, _pre-trained_, or _pre-training_.

**purge**

Use only in reference to specific programming methods. Otherwise, use _delete_, _clear_, or _remove_ instead.

## R

**real time (n.) real-time (adj.)**

Use with caution; this term can imply a degree of responsiveness or speed that may not be true. When needed, use _real time_ as a noun (for example "The request is sent in real time"). Use _real-time_ as an adjective ("A real-time feed is displayed...").

**repo**

Use as a synonym for repository, on second and subsequent use.

**retrieval-augmented generation (RAG)**

**rollover (n., adj.), roll over (v.)**

Use _rollover_ as a noun or adjective ("a rollover operation," "the rollover index"). Use _roll over_ as a verb ("roll over the index"). Do not hyphenate.

**rollup (n., adj.), roll up (v.)**

Use _rollup_ as a noun or adjective ("an index rollup," "rollup jobs"). Use _roll up_ as a verb ("roll up your indexes"). Do not hyphenate.

**RPM**

No need to spell out. Use uppercase _RPM_ when referring to the package format or manager. Use lowercase `rpm` in code font when referring to the command.

## S 

**screenshot**

**segregate**

Avoid using. Use _separate_ or _isolate_ instead.

**setting**

A key-value pair that creates a mapping in one of the many YAML configuration files used throughout OpenSearch. Sometimes alternatively called parameters, the programming language manipulating the key-value pair usually dictates the name of this mapping in a YAML file. For OpenSearch documentation (Java), they are properly a `Setting` object.

The following examples of settings illustrate key-value pairs with a colon separating the two elements:

`Settings.index.number_of_shards: 4`

`plugins.security.audit.enable_rest: true`

**set up (v.), setup (n., adj.)**

Use _set up_ as a verb ("To set up a new user..."). Use _setup_ as a noun or adjective ("To begin setup...").

**shut down (v.), shutdown (n., adj.)**

Use _shut down_ as a verb ("shut down the node"). Use _shutdown_ as a noun or adjective ("a graceful shutdown"). Do not hyphenate.

**simple, simply**

Don't use. Both _simple_ and _simply_ are not neutral in tone and might sound condescending to some users. If you mean _only_, use _only_ instead.

**slave**

Do not use. Use _replica_, _secondary_, or _standby_ instead.

**Snapshot Management (SM)**

**solid-state drive (SSD)**

**standalone**

**start**

You _start_ an application but _launch_ an instance, environment, or cluster.

**startup (n.), start up (v.)**

Never hyphenated. Use _startup_ as a noun (for example, "The following startup procedure guides you through..."). Use _start up_ as a verb ("You can start up the instances by...").

**syslog**

## T

**term frequency–inverse document frequency (TF–IDF)**

Use an en dash (–), not a hyphen (-). Not _TF-IDF_ or _tf-idf_. A numerical statistic that reflects how important a word is to a document in a collection or corpus.

**time out (verb), timeout (noun, adjective)**

Never hyphenate. Use _time out_ as a verb ("The request will time out if the server doesn't respond"). Use _timeout_ as a noun or adjective ("You can set the timeout interval by entering a number into...").

**time frame**

**time-series data**

Always hyphenated. Not _timeseries_ or _time series_. Data that's provided as part of a metric. The time value is assumed to be when the value occurred.

**timestamp**

**time zone**

**trade-off**

**trigger**

Avoid using as a verb to refer to an action that precipitates a subsequent action. It is OK to use when referring to a feature name, such as a _trigger function_ or _time-triggered architecture_. As a verb, use an alternative, such as _initiate_, _invoke_, _launch_, or _start_.

**truststore**

**turn on, turn off**

Use _turn on_ and _turn off_ in reference to a toggle to describe switching a setting or mode on or off.

Don't use _choose_, _select_, _clear_, _slide_, _enable_, or _disable_ for a toggle.

For making a feature available or unavailable, use _enable_.

## U 

**upper left, upper right**

Hyphenate as adjectives. Use instead of _top left_ and _top right_, unless the field name uses _top_. For example, "The upper-right corner."

**upvote**

**US**

No periods, as specified in the Chicago Manual of Style.

**user**

In most cases, replace with the more direct form you. Reserve _user_ for cases where you are referring to a third party (not the audience you are writing for).

**username**

**upsert**

An operation that updates a document if it already exists or inserts a new document if it does not. Use as a noun ("an upsert operation") or verb ("upsert the document"). One word, no hyphen.

## V

**version**

Do not use _version_ between the product name and the version number. Use _OpenSearch 3.6_, not _OpenSearch version 3.6_.

**v., vs., versus**

Do not use. Use _compared to_ or _compared with_ instead.

**via**

Do not use. Replace with by using, through, or with or a more specific phrase such as by accessing or by choosing.

## W

**warm up (v.), warmup (n., adj.)**

Use _warm up_ as a verb ("warm up the cache"). Use _warmup_ as a noun or adjective ("the warmup phase," "warmup settings"). Do not hyphenate.

**web**

**webpage**

Never _web page_.

**website**

Never _web site_.

**while, although, whereas**

Only use _while_ to mean "during an interval of time." Don't use it to mean although because it is often ambiguous. _Whereas_ is a better alternative to although in many cases, but it can sound overly formal.

**whitelist**

Do not use. Use _allow list_ instead.

**white space**

**wish, want, desire, need**

_Wish_ and _desire_ are indirect and nuanced versions of _want_. Don't use them. Be direct.

Do not confuse wants with needs. Use the term that's appropriate to the situation. _Need_ connotes a requirement or obligation, whereas _want_ indicates that you have an intent but still a choice of valid actions.

## Y 

**YUM**

No need to spell out. Use uppercase _YUM_ when referring to the tool name or repository (for example, "a local YUM repository"). Use lowercase `yum` in code font when referring to the command (for example, `sudo yum install`).

## Z

**ZIP Code**

Use _ZIP Code_ (capitalized) when referring to postal codes (ZIP is an acronym for Zone Improvement Plan). 

**zip file**

Use _zip file_ (lowercase) when referring to the compressed archive format. Use `.zip` in code font for the file extension.
