# OpenSearch terms

This is how we use our terms, but we’re always open to hearing your suggestions.

## A

**abort**

Do not use because it has unpleasant associations and is unnecessarily harsh sounding. Use *stop*, *end*, or *cancel* instead.

**above**

Use only for physical space or screen descriptions, for example, "the outlet above the floor" or "the button above the bar pane."

For orientation within a document use *previous*, *preceding*, or *earlier*.

**ad hoc**

Avoid. Use *one-time* instead.

**affect**

Affect as a noun refers to emotion as expressed in face or body language. Affect as a verb means to influence. Do not confuse with effect.

**AI/ML**

On first mention, use artificial intelligence and machine learning (AI/ML).

**Alerting**

A plugin that notifies you when data from one or more OpenSearch indexes meets certain conditions.

**allow**

Use allow when the user must have security permissions in order to complete the task.

Avoid using allow to refer to making something possible for the user. Instead, rewrite to focus on what’s important from the user’s point of view.

**allow list**

Use to describe a list of items that are allowed (not blocked). Do not use as a verb. Do not use whitelist.

**Amazon OpenSearch Service**

Amazon OpenSearch Service is a managed service that makes it easy to deploy, operate, and scale OpenSearch clusters in the AWS Cloud. Amazon OpenSearch Service is the successor to Amazon Elasticsearch Service (Amazon ES) and supports OpenSearch and legacy Elasticsearch OSS (up to 7.10, the final open-source version of the software).

**Anomaly Detection**

A plugin that automatically detects anomalies in your OpenSearch data in near real time.

**API operation**

Use instead of action, method, or function.

OpenSearch style:

- Use the CopySnapshot operation to...
- The following API operations…

Not OpenSearch style

- Use the CopySnapshot action to...
- Use the CopySnapshot method to...
- Use the CopySnapshot function to...

**app or application**

Use app for mobile software, application for all other uses.

**appear, display, and open**

Messages and pop-up boxes appear. Windows, pages, and applications open. The verb display requires a definite object. For example: The system displays the error message.

**application server**

Do not abbreviate as app server.

**artificial intelligence**

On first mention, use *artificial intelligence (AI)*. Use *AI* thereafter. There is no need to redefine *AI* when either *AI/ML* or *GenAI* has already been defined.

**as well as**

Avoid. Replace with in addition to or and as appropriate.

**Asynchronous Search**

A plugin that lets the user send search requests in the background so that the results can be used later.

**auto scaling**

Lower case scaling, auto scaling, and automatic scaling (but not autoscaling) are the preferred descriptive terms when generically describing auto scaling functionality.

Do not use hyphenated auto-scaling as a compound modifier. Instead, use scaling (for example, scaling policy), or scalable (for example, scalable target or scalable, load-balanced environment).

**AWS Signature Version 4**

Use on first appearance. On subsequent appearances, *Signature Version 4* may be used. Only use *SigV4* when space is limited.

## B

**below**

Use only for physical space or screen descriptions, such as “the outlet below the vent,” or “the button below the bar pane.”

For orientation within a document, use *following* or *later*.

**big data**

**black day**

Do not use. Use *blocked day* instead.

**blacklist**

Do not use. Use *deny list* instead.

**blackout**

Avoid using. Use *service outage* or *blocked* instead.

**BM25**

A ranking function used to estimate the relevance of documents to a given search query. BM25 extends [TF–IDF](#t) by normalizing document length.

**Boolean**

Avoid using the name of a Boolean value at the beginning of a sentence or sentence fragment. In general, capitalize the word Boolean. For specific programming languages, follow the usage in that language.

OpenSearch style:

- You can use the Boolean functions with Boolean expressions or integer expressions.
- IsTruncated(): A Boolean value that specifies whether the resolved target list is truncated.

**bottom**

Use only as a general screen reference, such as “scroll to the bottom of the page.” Don’t use for window, page, or pane references to features or controls. Rather, use *lower* instead. For example, you can use the following wording: “Choose the button on the lower left.”

**browse**

Use when referring to scanning information or browsing the web. Don’t use when describing how to navigate to a particular item on our site or a computer. Instead, use *see* or *navigate to*.

**build (n., v.)**

Use as a verb to refer to compiling and linking code. Use as a noun only to refer to a compiled version of a program (for example, *Use the current build of Amazon Linux 2*...) in a programming reference.

## C

**CA**

certificate authority

**certs, certificates**

Use _certificates_ on first mention. It’s OK to use _certs_ thereafter.

**checkbox, checkboxes**

**CI/CD**

Use _continuous integration_ and _continuous delivery (CI/CD)_ or _continuous integration and delivery (CI/CD)_ on first mention.

**cluster**

A collection of one or more nodes.

**cluster manager**

A single node that routes requests for the cluster and makes changes to other nodes. Each cluster contains a single cluster manager.

**command line, command-line**

Two words as a noun. Hyphenate as an adjective.

**console**

A tool inside OpenSearch Dashboards used to interact with the OpenSearch REST API.

**Cross-Cluster Replication**

A plugin that replicates indexes, mappings, and metadata from one OpenSearch cluster to another. Follows an active-passive model where the follower index pulls data from a leader index.

**cyber**

Except when dictated by open standards, use as a prefix in a closed compound: don’t use spaces or hyphens between _cyber_ and the rest of the word.

## D

**data**

Use data is, not data are. Don’t use datas. Use pieces of data or equivalent to describe individual items within a set of data.

**data center**

**dataset**

**data source**

**data store, datastore**

Two words when used generically, but one word when referring to the VMware product.

**data type**

**dates**

Use one of the following date formats:

- When a human-readable date format is preferred, spell out the date using the Month D, YYYY format (for example, _October 1, 2022_). Do not use an ordinal number for the day (use _1_, not _1st_). If the context is clear, you can omit the year on subsequent mention. If the specific day isn’t known, use the Month YYYY format (for example, _October 2022_).
- When a numeric, lexicographically sortable date is required, use the YYYY-MM-DD format (for example, _2022-10-01_). Make sure to add a zero (0) in front of a single-digit month and day. This is the ISO 8601 standard date format. Make sure also that you use a hyphen (-) and avoid omitting the year. Doing so avoids the ambiguity that’s caused by the common, locally used formats of MM/DD and DD/MM.

**demilitarized zone (DMZ)**

Avoid using. Use *perimeter network* or *perimeter zone* instead.

**deny list**

Use to describe a list of items that aren’t allowed (blocked). Do not use _blacklist_.

**disable**

Use *disable* to describe making a feature or command unavailable. For example:

- Clear the checkbox to disable automatic monitoring.
- The feature is disabled by default.

Note that alternatives to *disable*—such as *deactivate*, *turn off*, or *stop*—are acceptable usage where appropriate and may be found in existing documentation. In all cases, use language that corresponds to the language used in the UI, if applicable.

Do not use *disable* to refer to users.

**double-click**

Always hyphenated. Don’t use _double click_.

**dropdown list**

**due to**

Don’t use. Use _because of_ instead.

## E

**easy, easier, easily**

Avoid the use of *easy*, *easier*, or *easily* if possible when describing or comparing an OpenSearch Project product, feature, or procedure in technical content. Use of these terms is audience dependent. These terms are potentially misleading or inaccurate and might be perceived as condescending by some technical users. Instead, describe what the user can do.

On documentation landing pages, it’s acceptable to use *easy*, *easier*, or *easily* within the service description only.

**effect**

_Effect_ as a noun refers to something that’s caused by something else. _Effect_ as a verb means to bring about. Do not confuse with _affect_.

**e.g.**

Avoid. Use for example or such as instead.

**Elastic IP address**

**email**

Use as a singular noun or adjective to refer to the collective concept, and use _message_ or _mail_ for individual items. Use _send email_ as the verb form. Don’t use the plural form because it’s a collective noun.

**enable**

Use *enable* to describe making a feature or command available. For example:

- Select the checkbox to enable automatic monitoring.
- The feature is enabled by default.

Note that alternatives to *enable*—such as *activate*, *turn on*, or *start*—are acceptable usage where appropriate and may be found in existing documentation. In all cases, use language that corresponds to the language used in the UI, if applicable.

Avoid using *enable* to refer to making something possible for the user. Instead, rewrite to focus on what's important from the user's point of view. For example, “With ABC, you can do XYZ” is a stronger statement than “ABC enables you to XYZ.” Additionally, using a task-based statement is usually more clear than the vague “…enables you to….”

**enter**

In general, use in preference to _type_ when a user adds text or other input (such as numbers or symbols).

**etc., et cetera**

Do not use.

Generally speaking, etc. and its equivalents (such as and more or and so on) aren’t necessary.

**execute**

Replace with a more specific verb. In the sense of carrying out an action, use *run*, *process*, or *apply*. In the sense of initiating an operation, use *start*, *launch*, or *initiate*.

Exception: *Execution* is unavoidable for third-party terms for which no alternative was determined, such as SQL execution plans. *Executable* is also unavoidable.

## F 

**fail over (v.), failover (n.)**

**file name**

**frontend (n., adj.)**

Use frontend as an adjective and a noun. Do not use front end or front-end. Do not make frontend possessive except as part of a compound noun, such as frontend system.

## G

**GenAI**

On first mention, use *generative artificial intelligence (GenAI)*. Use *GenAI* thereafter. To avoid the overuse of *GenAI*, *AI/ML-powered applications* may also be used.

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

Do not use. This term is unnecessarily violent for technical documentation. Use *stop responding* instead.

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

Do not use *if* to mean *whether*. It is best to use *whether* in reference to a choice or alternatives ("we're going whether it rains or not") and *if* when establishing a condition ("we will go if it doesn't rain").

**in, on**

Use _in Windows_ or _in Linux_ in reference to components of the OS or work in the OS. Use on Windows in reference to Windows applications. Examples:

- Use the Devices and Printers Control Panel in Windows to install a new printer.
- In Windows, run the setup command.
- Select an application that runs on Windows.

Run applications and instances _in the cloud_, but extend services to the cloud.

Use *on the forum*. Whatever is on the internet (the various websites, etc.), you are *on* because you cannot be *in* it.

**index, indexes**

A collection of JSON documents. Non-hardcoded references to *indices* should be changed to *indexes*.

**Index Management (IM)**

**Index State Management (ISM)**

**inline**

**install in, on**

install in a folder, directory, or path; install on a disk, drive, or instance.

**internet**

Do not capitalize.

**invalid**

Avoid using. Use *not valid* instead.

**IP address**

Don’t abbreviate as _IP only_.

## J

**just**

Use *just* in the sense of *just now* (as in "the resources that you just created"). Otherwise, use *only* in all other contexts (to mean "limited to; nothing more than").

## K

**key store**

**kill**

Do not use. Replace with *stop*, *end*, *clear*, *remove*, or *cancel*.

Exception: *Kill* is unavoidable when referring to Linux kill commands.

**k-means**

A simple and popular unsupervised clustering ML algorithm built on top of Tribuo library that chooses random centroids and calculates iteratively to optimize the position of the centroids until each observation belongs to the cluster with the nearest mean.

**k-NN**

Short for _k-nearest neighbors_, the k-NN plugin enables users to search for the k-nearest neighbors to a query point across an index of vectors.

## L

**launch, start**

You _start_ an application but _launch_ an instance, environment, or cluster.

**let**

Avoid using _let_ to refer to making something in a service or feature possible for the user. Instead, rewrite to focus on what’s important from the user’s point of view.

**leverage**

Replace with _use_.

**lifecycle**

One word in reference to software.

**like (prep.)**

OK to use to call out something for comparison.

As a general rule, if you can replace like with similar to, it’s OK to use like. But, if you can replace _like_ with _such as_, use _such as_.

**locate in, on**

Located _in_ (a folder, directory, path), located on a disk drive or instance.

**log in (v.), login (adj., n.)**

Use with technologies with interfaces that use this verb. Also note that you log in to an instance, not log into. Also use log out and logout.

**Logstash**

A light-weight, open-source, server-side data processing pipeline that allows you to collect data from a variety of sources, transform it on the fly, and send it to your desired destination.

**lower left, lower right**

Hyphenate as adjectives. Use instead of *bottom left* and *bottom right*, unless the field name uses *bottom*. For example, "The lower-right corner."

**LTS**

Long-Term Support

**Lucene**

Apache Lucene™ is a high-performance, full-featured search engine library written entirely in Java. OpenSearch uses a modified version of Lucene as the basis for search operations within OpenSearch.

## M 

**machine learning**

When *machine learning* is used multiple times in a document, use *machine learning (ML)* on first mention and *ML* thereafter. There is no need to redefine *ML* when *AI/ML* has already been defined. If spelled out, write *machine learning* as two words (no hyphen) in all cases, including when used as an adjective before a noun.

**Machine Learning (ML) Commons**

A new plugin that makes it easy to develop new ML features. It allows engineers to leverage existing open-source ML algorithms and reduce the efforts to build them from scratch.

**master**

Do not use. Use *primary*, *main*, or *leader* instead.

**master account**

Do not use. Use *management account* instead.

**may**

Avoid. Use _can_ or _might_ instead.

**multilayer, multilayered**

**must, shall, should**

_Must_ and _shall_ refer to requirements. If the reader doesn’t follow the instruction, something won’t work right.

_Should_ is used with recommendations. If the reader doesn’t follow the instruction, it might be harder or slower, but it’ll work.

## N 

**navigate to**

Not navigate _in_.

**near real time (n.), near real-time (adj.) (NRT)**

Use _near real time_ as a noun; use near real-time as an adjective. Don’t add a hyphen between _near_ and _real time_ or _real-time_.

Spell out _near real time_ on first mention; _NRT_ can be used on subsequent mentions.

**node**

A server that stores your data and processes search requests with OpenSearch, usually as part of a cluster. Do not use _master node_ and avoid using _worker node_.

**non-production**

Hyphenate to make the term easier to scan and read.

## O

**onsite**

**OpenSearch**

OpenSearch is a community-driven, open-source search and analytics suite derived from Apache 2.0 licensed Elasticsearch 7.10.2 and Kibana 7.10.2. It consists of a search engine daemon, OpenSearch, and a visualization and user interface, OpenSearch Dashboards.

**OpenSearch Dashboards**

The default visualization tool for data in OpenSearch. On first appearance, use the full name. *Dashboards* may be used on subsequent appearances.

open source (n.), open-source (adj.)

Use _open source_ as a noun (for example, “The code used throughout this tutorial is open source and can be freely modified”). Use _open-source_ as an adjective _(open-source software)_.

**OpenSearch Playground**

OpenSearch Playground provides a central location for existing and evaluating users to explore features in OpenSearch and OpenSearch Dashboards without downloading or installing any OpenSearch components locally.

**operating system**

When referencing operating systems in documentation, follow these guidelines:

- In general, if your docs or procedures apply to both Linux and macOS, you can also include Unix.
- Unix and UNIX aren’t the same. UNIX is a trademarked name that’s owned by The Open Group. In most cases, you should use Unix.
- When referring to the Mac operating system, use macOS. Don’t say Mac, Mac OS, or OS X.
- When referring to Windows, it’s not necessary to prefix with Microsoft.
- If you need to reference multiple Unix-like operating systems, you should separate by commas and use the following order: Linux, macOS, or Unix.

**or earlier, or later**

OK to use with software versions.

## P 

**Painless**

The default scripting language for OpenSearch, either used inline or stored for repeat use. Similar to Java’s language specification.

**per**

- Do not use to mean _according to_ (for example, per the agreement).
- OK to use in meaning of _to_, _in_, _for_, or _by each_ (one per account) where space is limited and in set terms and phrases, such as any of the following:
     - queries per second (QPS)
     - bits per second (bps)
     - megabytes per second (MBps)
- Consider writing around _per_ elsewhere. _Per_ can sound stuffy and confusing to some global users.

**percent**

Spell out in blog posts (for example, 30 percent).

Use % in headlines, quotations, and tables or in technical copy.

**Performance Analyzer**

An agent and REST API that allows you to query numerous performance metrics for your cluster, including aggregations of those metrics, independent of the Java Virtual Machine (JVM).

**please**

Avoid using except in quoted text.

**plugin**

Tools inside of OpenSearch that can be customized to enhance OpenSearch’s functionality. For a list of core plugins, see the [OpenSearch plugin installation]({{site.url}}{{site.baseurl}}/opensearch/install/plugins/) page. Capitalize if it appears as part of the product name in the UI.

**pop-up**

**premise, premises**

With reference to property and buildings, always form as plural.

Correct: an on-premises solution

Incorrect: an on-premise solution, an on-prem solution

**pretrain**

**primary shard**

A Lucene instance that contains data for some or all of an index.

**primitive**

Avoid using *primitive* (especially plural *primitives*) as a colloquial way of referring to the basic concepts or elements that are associated with a feature or to the simplest elements in a programming language. For greatest clarity and to avoid sounding unpleasant, replace with *primitive data type* or *primitive type*.

**purge**

Use only in reference to specific programming methods. Otherwise, use *delete*, *clear*, or *remove* instead.

## Q 

**query**

A call used to request information about your data.

## R 

**real time (n.) real-time (adj.)**

Use with caution; this term can imply a degree of responsiveness or speed that may not be true. When needed, use _real time_ as a noun (for example “The request is sent in real time”). Use _real-time_ as an adjective (“A real-time feed is displayed...”).

**recall**

The quantity of documents returned from a query.

**replica shard**

Copy of a primary shard. Helps improve performance when using indexes across multiple nodes.

**repo**

Use as a synonym for repository, on second and subsequent use.

**RPM Package Manager (RPM)**

Formerly known as RedHat Package Manager. An open-source package management system for use with Linux distributions.

**rule**

A set of conditions, internals, and actions that create notifications.

## S 

**screenshot**

**segregate**

Avoid using. Use *separate* or *isolate* instead.

**setting**

A key-value pair that creates a mapping in one of the many YAML configuration files used throughout OpenSearch. Sometimes alternatively called parameters, the programming language manipulating the key-value pair usually dictates the name of this mapping in a YAML file. For OpenSearch documentation (Java), they are properly a `Setting` object.

The following examples of settings illustrate key-value pairs with a colon separating the two elements:

`Settings.index.number_of_shards: 4`

`plugins.security.audit.enable_rest: true`

**set up (v.), setup (n., adj.)**

Use _set up_ as a verb (“To set up a new user...”). Use _setup_ as a noun or adjective (“To begin setup...”).

**shard**

A piece of an index that consumes CPU and memory. Operates as a full Lucene index.

**simple, simply**

Don't use. Both *simple* and *simply* are not neutral in tone and might sound condescending to some users. If you mean *only*, use *only* instead.

**since**

Use only to describe time events. Don’t use in place of because.

**slave**

Do not use. Use *replica*, *secondary*, or *standby* instead.

**Snapshot Management (SM)**

**solid state drive (SSD)**

**standalone**

**start, launch**

You _start_ an application but _launch_ an instance, environment, or cluster.

**startup (n.), start up (v.)**

Never hyphenated. Use _startup_ as a noun (for example, “The following startup procedure guides you through...”). Use _start up_ as a verb (“You can start up the instances by...”).

**Stochastic Gradient Descent (SGD)**

## T

**term frequency–inverse document frequency (TF–IDF)**

A numerical statistic that is intended to reflect how important a word is to a document in a collection or corpus.

**time out (verb), timeout (noun, adjective)**

Never hyphenate. Use _time out_ as a verb (“The request will time out if the server doesn’t respond”). Use _timeout_ as a noun or adjective (“You can set the timeout interval by entering a number into...”).

**time frame**

**time-series data**

Data that's provided as part of a metric. The time value is assumed to be when the value occurred.

**timestamp**

**time zone**

**trigger**

Avoid using as a verb to refer to an action that precipitates a subsequent action. It is OK to use when referring to a feature name, such as a *trigger function* or *time-triggered architecture*. As a verb, use an alternative, such as *initiate*, *invoke*, *launch*, or *start*.

**trust store**

**turn on, turn off**

Use *turn on* and *turn off* in reference to a toggle to describe switching a setting or mode on or off.

Don't use *choose*, *select*, *clear*, *slide*, *enable*, or *disable* for a toggle.

For making a feature available or unavailable, use *enable*.

## U 

**UltraWarm**

A storage tier that you can use to store and analyze your data with Elasticsearch and Kibana that is optimized for performance. To learn more about the service, see the introductory [blog post](https://aws.amazon.com/about-aws/whats-new/2020/05/aws-announces-amazon-elasticsearch-service-ultrawarm-general-availability/).

**upper left, upper right**

Hyphenate as adjectives. Use instead of *top left* and *top right*, unless the field name uses *top*. For example, "The upper-right corner."

**US**

No periods, as specified in the Chicago Manual of Style.

**user**

In most cases, replace with the more direct form you. Reserve _user_ for cases where you are referring to a third party (not the audience you are writing for).

**username**

## V

**version**

**v., vs., versus**

Do not use. Use _compared_ to or _compared with_ instead.

**via**

Do not use. Replace with by using, through, or with or a more specific phrase such as by accessing or by choosing.

## W 

**web**

**webpage**

Never _web page_.

**website**

Never _web site_.

**while, although, whereas**

Only use _while_ to mean “during an interval of time.” Don’t use it to mean although because it is often ambiguous. _Whereas_ is a better alternative to although in many cases, but it can sound overly formal.

**white day**

Do not use. Use *open day* instead.

**whitelist**

Do not use. Use *allow list* instead.

**white space**

**wish, want, desire, need**

_Wish_ and _desire_ are indirect and nuanced versions of _want_. Don’t use them. Be direct.

Do not confuse wants with needs. Use the term that’s appropriate to the situation. _Need_ connotes a requirement or obligation, whereas _want_ indicates that you have an intent but still a choice of valid actions.

## Y 

**Yellowdog Updater Modified (YUM)**

An open-source tool for command-line and graphical-based package management for RPM (RedHat Package Manager)-based Linux systems.