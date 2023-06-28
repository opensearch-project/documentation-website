<img src="https://opensearch.org/assets/img/opensearch-logo-themed.svg" height="64px">

# About the OpenSearch documentation repo

The documentation repository contains the documentation for OpenSearch, the search, analytics, and visualization suite with advanced security, alerting, SQL support, automated index management, deep performance analysis, and more. You can find the rendered documentation at [opensearch.org/docs](https://opensearch.org/docs).

## How the website works

This repository contains [Markdown](https://guides.github.com/features/mastering-markdown/) files organized into Jekyll _collections_ (for example, `_api-reference` or `_dashboards`). Each Markdown file corresponds to one page on the website.

In addition to the content for a given page, each Markdown file contains some Jekyll [front matter](https://jekyllrb.com/docs/front-matter/). Front matter looks like this:

```
---
layout: default
title: Alerting security
nav_order: 10
parent: Alerting
has_children: false
---
```

If you want to reorganize content or add new pages, keep an eye on `has_children`, `parent`, and `nav_order`, which define the hierarchy and order of pages in the left navigation. For more information, see the documentation for [our upstream Jekyll theme](https://pmarsceill.github.io/just-the-docs/docs/navigation-structure/).


## How you can help

Community contributions remain essential in keeping this documentation comprehensive, useful, well-organized, and up-to-date. 

If you are interested in submitting an issue or contributing content, see [CONTRIBUTING](https://github.com/opensearch-project/documentation-website/blob/main/CONTRIBUTING.md).


## Writing tips

The OpenSearch team released [style guidelines](https://github.com/opensearch-project/documentation-website/blob/main/STYLE_GUIDE.md) for our documentation and marketing content. These guidelines cover the style standards and terms to be observed when creating OpenSearch content. We ask that you please adhere to these guidelines whenever contributing content. 

We also provide guidelines on terminology. For a list of OpenSearch terms, see [Terms](https://github.com/opensearch-project/documentation-website/blob/main/TERMS.md).

If you are contributing API content, see the [API Style Guide](API_STYLE_GUIDE) for API documentation guidelines.


## Formatting documentation

The OpenSearch documentation uses a modified version of the [just-the-docs](https://github.com/pmarsceill/just-the-docs) Jekyll theme. For an overview of the commonly used formatted elements, including callouts, videos, and buttons, see the [FORMATTING_GUIDE](FORMATTING_GUIDE.md). 


## Style linting

We use the [Vale](https://github.com/errata-ai/vale) linter to ensure that our documentation adheres to the [OpenSearch Project Style Guidelines](STYLE_GUIDE.md). To install Vale locally, follow these steps:

1. Run `brew install vale`.
2. Run `vale *` from the documentation site root directory to lint all Markdown files. To lint a specific file, run `vale /path/to/file`.

Optionally, you can install the [Vale VSCode](https://github.com/chrischinchilla/vale-vscode) extension that integrates Vale with Visual Studio Code. By default, only _errors_ and _warnings_ are underlined. To change the minimum alert level to include _suggestions_, go to **Vale VSCode** > **Extension Settings** and select **suggestion** in the **Vale > Vale CLI: Min Alert Level** dropdown list. 


## Points of contact

If you encounter problems or have questions when contributing to the documentation, these people can help:

- [cwillum](https://github.com/cwillum)
- [hdhalter](https://github.com/hdhalter)
- [kolchfa-aws](https://github.com/kolchfa-aws)
- [Naarcha-AWS](https://github.com/Naarcha-AWS)
- [vagimeli](https://github.com/vagimeli)


## Code of conduct

This project has adopted an [Open Source Code of Conduct](https://opensearch.org/codeofconduct.html).


## Security

If you discover a potential security issue in this project we ask that you notify AWS/Amazon Security using our [vulnerability reporting page](http://aws.amazon.com/security/vulnerability-reporting/). Please do **not** create a public GitHub issue.


## License

This project is licensed under the [Apache 2.0 License](LICENSE).


## Copyright

Copyright OpenSearch contributors.
