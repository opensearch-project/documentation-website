# Formatting Guide

This guide provides an overview of the formatted elements commonly used in the OpenSearch documentation. 

* * *

### Table of contents

* [Adding pages or sections](#adding-pages-or-sections)
* [Buttons](#buttons)
* [Callouts](#callouts)
* [Collapsible blocks](#collapsible-blocks)
* [Dashes](#dashes)
* [Horizontal rule](#horizontal-rule)
* [Images](#images)
  * [Images in line with text](#images-in-line-with-text)
* [Labels](#labels)
* [Links](#links)
* [Lists](#lists)
  * [Unordered lists](#unordered-lists)
  * [Ordered lists](#ordered-lists)
  * [Nested lists](#nested-lists) 
  * [Lists with code snippets or images](#lists-with-code-snippets-or-images)
* [Math](#math)
* [Tables](#tables)
* [Text style](#text-style)
* [Variables in curly braces](#variables-in-curly-braces)
* [Videos](#videos)

* * *

## Adding pages or sections

This repository contains [Markdown](https://guides.github.com/features/mastering-markdown/) files organized into Jekyll _collections_ (for example, `_api-reference` or `_dashboards`). Each Markdown file corresponds to one page on the website.

In addition to the content for a given page, each Markdown file contains some Jekyll [front matter](https://jekyllrb.com/docs/front-matter/) similar to the following:

```
---
layout: default
title: Date
nav_order: 25
has_children: false
parent: Date field types
grand_parent: Supported field types
---
```

If you want to reorganize content or add a new page, make sure to set the appropriate `has_children`, `parent`, `grand_parent`, and `nav_order` variables, which define the hierarchy of pages in the left navigation. 

When adding a page or a section, make the `nav_order` of the child pages multiples of 10. For example, if you have a parent page `Clients`, make child pages `Java`, `Python`, and `JavaScript` have a `nav_order` of 10, 20, and 30, respectively. Doing so makes inserting additional child pages easier because it does not require you to renumber existing pages.

Each collection must have an `index.md` file that corresponds to the collection's index page. In the `index.md` file's front matter, specify `nav_excluded: true` so that the page does not appear separately under the collection.

## Buttons

You can use either `copy` or `copy-curl` includes for code snippets. The `copy` include places a **Copy** button on the code snippet, while the `copy-curl` include places both **Copy** and **Copy as cURL** buttons. Use the `copy-curl` include for API requests. If an API request is already in the cURL format, use the `copy` include.

**Example of a `copy` include**

````
```bash
curl -XGET "localhost:9200/_tasks?actions=*search&detailed
```
{% include copy.html %}
````

**Example of a `copy-curl` include**

````
```json
PUT /sample-index1/_clone/cloned-index1
{
  "aliases": {
    "sample-alias1": {}
  }
}
```
{% include copy-curl.html %}
````

## Callouts

You can use four levels of callouts:

*  `{: .note}` blue
*  `{: .tip }` green
*  `{: .important}` yellow
*  `{: .warning}` red

Place a callout directly under the paragraph to which you want to apply the callout style.

**Example**

```
In case of a cluster or node failure, all PIT data is lost.
{: .note}
```

For a callout with multiple paragraphs or lists, use `>`:

```
>   ****PREREQUISITE****
>
>   To use a custom vector map with GeoJSON, install these two required plugins:
>   * OpenSearch Dashboards Maps [`dashboards-maps`](https://github.com/opensearch-project/dashboards-maps_) front-end plugin
>   * OpenSearch [`geospatial`](https://github.com/opensearch-project/geospatial_) backend plugin
{: .note}

```

## Collapsible blocks

To insert a collapsible block, use the `<details>` element as follows:

````html
<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "_nodes" : {
    "total" : 1,
    "successful" : 1,
    "failed" : 0
  }
}
```
</details>
````

Collapsible blocks are useful for long responses and for the Table of Contents at the beginning of a page.

## Dashes

Use one dash for hyphens, two for en dashes, and three for em dashes:

```
upper-right
10--12 nodes per cluster
There is one candidate generator available---`direct_generator`.
```

## Horizontal rule

A horizontal rule is used to separate text sections. Use three asterisks separated by spaces for a horizontal rule:

```
## Why use OpenSearch?

* * *
```

## Images

Place images in the `images` directory of the documentation website. To refer to images, use relative links (see [Internal links](#internal-links) for more information).

Markdown images are responsive by default. To insert a Markdown image, use the `![<alternate text>](link)` syntax:

```
![OS branding]({{site.url}}{{site.baseurl}}/images/brand.png)
```

Markdown uses the image’s actual width to render it. It sets the maximum image width to the width of the main body panel.

If you want to specify the image width or another style, use HTML syntax:

```
<img src="{{site.url}}{{site.baseurl}}/images/brand.png" alt="OS branding" width="700"/>
```

You can specify width as a hard-coded number of pixels, as in the preceding example, or as a percentage of the parent width:

```
<img src="{{site.url}}{{site.baseurl}}/images/brand.png" alt="OS branding" width="70%"/>
```

To stretch the image to fit the width of the main body panel, use width=“100%”.

To take high-resolution screenshots, in Firefox, right-click on the page and choose “Take Screenshot”.

Image borders are automatic; do not manually add a border to an image.

Always **separate an image from the text with a blank line**:

```
To send a query to OpenSearch, select the query by placing the cursor anywhere in the query text. Then choose the triangle on the top right of the request or press `Ctrl/Cmd+Enter`:

<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-send.png" alt="Send request">
```

Do not place an image next to text or insert artificial line breaks using `<br>`. Otherwise, the text might render as aligned to the bottom of the image, with the image on the right. 

If the image is under a list item, place it on a new line with a tab. For more examples, see [Lists with code snippets or images](#lists-with-code-snippets-or-images).

### Images in line with text

When describing an icon, use the icon's name followed by an inline image in parentheses. Insert the image in line with text using the `nomarkdown` extension and an HTML image:

```
Choose the play icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dev-tools/play-icon.png" class="inline-icon" alt="play icon"/>{:/}) on the upper right of the request.
```

## Labels

You can use the following labels:

* label-blue 
* label-green
* label-purple 
* label-red 
* label-yellow 

Use a purple label to specify the version in which an API was introduced:

```
# Alias
Introduced 1.0
{: .label .label-purple }
```

If we introduce a breaking change to an operation, add an additional label with a link to the release note for that breaking change:

```
## Get roles
Introduced 1.0
{: .label .label-purple }
[Last breaking change 2.0](https://example.com)
{: .label .label-red }
```

## Links

To add a link to a document, section, or image, use the `[name](link)` syntax, for example:

```
## Looking for the Javadoc?

See [opensearch.org/javadocs/](https://opensearch.org/javadocs/).
```

### Section links

**Section links** are links to headings in your document. Markdown lowercases the headings for links, drops back ticks, and replaces spaces with hyphens:

```
## The `minimum_should_match` parameter

For more information, see [the `minimum_should_match` parameter](#the-minimum_should_match-parameter).
```

### Internal links

**Internal links** are links to another document or image within the documentation website. Because the documentation website is versioned, do not hard code the version number in the link. Use the relative path, where `{{site.url}}{{site.baseurl}}` refers to the main directory, instead:

```
If you need to use a field for exact-value search, map it as a [`keyword`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/).
```

### GitHub links

When linking to a GitHub issue or PR, refer to the issue or PR number in the following format:

```
For more details, see issue [#1940](https://github.com/opensearch-project/opensearch/issues/1940).
```

## Lists

Markdown supports unordered and ordered lists, nested lists, and lists with code snippets or images.

### Unordered lists

Use asterisks or dashes for unordered lists:

```
* One
* Two
```

or

```
- One 
- Two
```

Lists with dashes render the list items closer to each other vertically, while lists with asterisks have more space between the lines.

Don’t mix and match asterisks and dashes.

### Ordered lists

Use all 1s for ordered lists:

```
1. One 
1. Two
```

Jekyll will automatically correctly number the items, and it will be much easier for you to insert and delete items without renumbering.

If there is a paragraph in the middle of a list, the list will restart with 1 after the paragraph. If you want to continue the list after the paragraph, use `counter-reset: none`:

```
1.  One

Paragraph that breaks the numbering

{:style="counter-reset: none"}
1.  Two
```

### Nested lists

Use tabs to nest lists:

```
1. Parent 1
    - Child 1
    - Child 2
        - Grandchild 1
```

Markdown automatically adjusts numbered lists so that they use numbers and letters, so always use 1s for nested numbered lists. 

### Lists with code snippets or images

If you need to position an image or a code snippet within a list, use tabs to signal to Markdown that the image or code snippet is part of the list item.

**Example with code snippets**

```
1. Run the demo batch script.
   There are two ways of running the batch script:
   1. Run the batch script using the Windows UI:
      1. Navigate to the top directory of your OpenSearch installation and open the `opensearch-{{site.opensearch_version}}` folder.
      1. Run the batch script by double-clicking the `opensearch-windows-install.bat` file. This opens a command prompt with an OpenSearch instance running.
   1. Run the batch script from Command prompt or Powershell:
      1. Open Command Prompt by entering `cmd`, or Powershell by entering `powershell`, in the search box next to ****Start**** on the taskbar. 
      1. Change to the top directory of your OpenSearch installation.
         ```bat
         cd \path\to\opensearch-{{site.opensearch_version}}
         ```
      1. Run the batch script.
         ```bat
         .\opensearch-windows-install.bat
         ```
```

**Example with images**

```
1. To begin, select the rule in the **Rule name** column. The rule details pane opens, as shown in the following image.
    <img src="{{site.url}}{{site.baseurl}}/images/Security/rule-dup2.png" alt="Opening the rule details pane" width="50%">

1. Select the **Duplicate** button in the upper-right corner of the pane. The **Duplicate rule** window opens in Visual Editor view, and all of the fields are automatically populated with the rule's details. Details are also populated in YAML Editor view, as shown in the following image.
    <img src="{{site.url}}{{site.baseurl}}/images/Security/dupe-rule.png" alt="Selecting the duplicate button opens the Duplicate rule window" width="50%">
```

## Math

To add mathematical expressions to a page, add `has_math: true` to the page’s front matter. Then insert LaTeX math into HTML tags with the rest of your Markdown content, as shown in the following example:

```
## Math

Some Markdown paragraph. Here's a formula:

<p>
  When \(a \ne 0\), there are two solutions to \(ax^2 + bx + c = 0\) and they are
  \[x = {-b \pm \sqrt{b^2-4ac} \over 2a}.\]
</p>

And back to Markdown.
```

## Tables

Markdown table columns are automatically sized, and there is no need to specify a different number of dashes in the formatting. 

**Example**

```
Header 1 | Header 2
:--- | :---
Body 1 | Body 2, which is extremely lengthy, but there is no need to specify its width.
```

To insert line breaks within tables, use `<br>`:

```
Header 1 | Header 2
:--- | :---
Body 1 | Body paragraph 1 <br> Body paragraph 2 
```

To use lists within a table, use `<br>` and `-` :

```
Header 1 | Header 2
:--- | :---
Body 1 | List:<br>- One<br>- Two
```


You can also use `&nbsp;` to insert one space, `&ensp;` to insert two spaces, and `&emsp;` to insert four spaces in table cells.

If you need a list with real bullet points, use the bullet point HTML code:

```
Header 1 | Header 2
:--- | :---
Body 1 | List:<br>&ensp;&#x2022; One<br>&ensp;&#x2022; Two
```

## Text style

You can style text in the following ways:

* ```**bold**```
* ```_italic_``` or ```*italic*```

For guidance on using code examples and when to use code font, see [Code examples](https://github.com/opensearch-project/documentation-website/blob/main/STYLE_GUIDE.md#code-examples).

## Variables in curly braces

To correctly display variables that are in curly braces, escape the curly braces with the `{% raw %}{% endraw %}` tags:

````
"message_template": {
    "source": "the index is {% raw %}{{ctx.index}}{% endraw %}"
}
````

The variable `ctx.index` is rendered in double curly braces.

## Videos

To insert a video, add a YouTube player include similar to the following:

```
{% include youtube-player.html id='_g46WiGPhFs' %}
```

Note that the `id` variable refers to the YouTube video ID at the end of the URL. For example, the YouTube video at the URL `https://youtu.be/_g46WiGPhFs` has the ID `_g46WiGPhFs`. The ID must be surrounded with single quotation marks.
