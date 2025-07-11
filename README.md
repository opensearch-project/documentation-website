<img src="https://opensearch.org/assets/img/opensearch-logo-themed.svg" height="64px">

# About the OpenSearch documentation repo

The documentation repository contains the documentation for OpenSearch, the search, analytics, and visualization suite with advanced security, alerting, SQL support, automated index management, deep performance analysis, and more. You can find the rendered documentation at [opensearch.org/docs](https://opensearch.org/docs).


## How you can help

Community contributions remain essential in keeping this documentation comprehensive, useful, well-organized, and up-to-date. If you are interested in contributing, please see the [Contribution](https://github.com/opensearch-project/documentation-website/blob/main/CONTRIBUTING.md) file.


## Points of contact

If you encounter problems or have questions when contributing to the documentation, these people can help:

- [kolchfa-aws](https://github.com/kolchfa-aws)


## How the website works

This repository contains [Markdown](https://guides.github.com/features/mastering-markdown/) files organized into Jekyll "collections" (e.g., `_search-plugins`, `_opensearch`, etc.). Each Markdown file correlates with one page on the website.

Using plain text on GitHub has many advantages:

- Everything is free, open source, and works on every operating system. Use your favorite text editor, Ruby, Jekyll, and Git.
- Markdown is easy to learn and looks good in side-by-side diffs.
- The workflow is no different than contributing code. Make your changes, build locally to check your work, and submit a pull request. Reviewers check the PR before merging.
- Alternatives like wikis and WordPress are full web applications that require databases and ongoing maintenance. They also have inferior versioning and content review processes compared to Git. Static websites, such as the ones Jekyll produces, are faster, more secure, and more stable.

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

If you want to reorganize content or add new pages, keep an eye on `has_children`, `parent`, and `nav_order`, which define the hierarchy and order of pages in the lefthand navigation. For more information, see the documentation for [our upstream Jekyll theme](https://pmarsceill.github.io/just-the-docs/docs/navigation-structure/).


## Contribute content

There are a few ways to contribute content, depending on the magnitude of the change.

- [Minor changes](#minor-changes)
- [Major changes](#major-changes)
- [Create an issue](https://github.com/opensearch-project/documentation-website/issues)


### Minor changes

If you want to add a few paragraphs across multiple files and are comfortable with Git, try this approach:

1. Fork this repository.

1. Download [GitHub Desktop](https://desktop.github.com), install it, and clone your fork.

1. Navigate to the repository root.

1. Create a new branch.

1. Edit the Markdown files in `/docs`.

1. Commit, [sign off](https://github.com/src-d/guide/blob/9171d013c648236c39faabcad8598be3c0cf8f56/developer-community/fix-DCO.md#how-to-prevent-missing-sign-offs-in-the-future), push your changes to your fork, and submit a pull request.


### Major changes

If you're making major changes to the documentation and need to see the rendered HTML before submitting a pull request, here's how to make the changes and view them locally:

1. Fork this repository.

1. Download [GitHub Desktop](https://desktop.github.com), install it, and clone your fork.

1. Navigate to the repository root.

1. Install [Ruby](https://www.ruby-lang.org/en/) if you don't already have it. We recommend [RVM](https://rvm.io/), but use whatever method you prefer:

   ```
   curl -sSL https://get.rvm.io | bash -s stable
   rvm install 2.6
   ruby -v
   ```

1. Install [Jekyll](https://jekyllrb.com/) if you don't already have it:

   ```
   gem install bundler jekyll
   ```

1. Install dependencies:

   ```
   bundle install
   ```

1. Build:

   ```
   sh build.sh    
   ```

1. If the build script doesn't automatically open your web browser (it should), open [http://localhost:4000/docs/](http://localhost:4000/docs/).

1. Create a new branch.  

1. Edit the Markdown files in each collection (e.g. `_security/`).

   If you're a web developer, you can customize `_layouts/default.html` and `_sass/custom/custom.scss`.

1. When you save a file, marvel as Jekyll automatically rebuilds the site and refreshes your web browser. This process can take anywhere from 10-30 seconds.

1. When you're happy with how everything looks, commit, [sign off](https://github.com/src-d/guide/blob/9171d013c648236c39faabcad8598be3c0cf8f56/developer-community/fix-DCO.md#how-to-prevent-missing-sign-offs-in-the-future), push your changes to your fork, and submit a pull request.


## Writing tips

The OpenSearch team released [style guidelines](https://github.com/opensearch-project/documentation-website/blob/main/STYLE_GUIDE.md) for our documentation and marketing content. These guidelines cover the style standards and terms to be observed when creating OpenSearch content. We ask that you please adhere to these guidelines whenever contributing content. 

We also provide guidelines on terminology. For a list of OpenSearch terms, see [Terms](https://github.com/opensearch-project/documentation-website/blob/main/TERMS.md).


## Formatting documentation

The OpenSearch documentation uses a modified version of the [just-the-docs](https://github.com/pmarsceill/just-the-docs) Jekyll theme. For an overview of the commonly used formatted elements, including callouts, videos, and buttons, see the [FORMATTING_GUIDE](FORMATTING_GUIDE.md). 


## Style linting

We use the [Vale](https://github.com/errata-ai/vale) linter to ensure that our documentation adheres to the [OpenSearch Project Style Guidelines](STYLE_GUIDE.md). To install Vale locally, follow these steps:

1. Run `brew install vale`.
2. Run `vale *` from the documentation site root directory to lint all Markdown files. To lint a specific file, run `vale /path/to/file`.

Optionally, you can install the [Vale VSCode](https://github.com/chrischinchilla/vale-vscode) extension that integrates Vale with Visual Studio Code. By default, only _errors_ and _warnings_ are underlined. To change the minimum alert level to include _suggestions_, go to **Vale VSCode** > **Extension Settings** and select **suggestion** in the **Vale > Vale CLI: Min Alert Level** dropdown list. 

## Code of conduct

This project has adopted an [Open Source Code of Conduct](https://opensearch.org/codeofconduct.html).


## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.


## License

This project is licensed under the Apache-2.0 License.


## Copyright

Copyright OpenSearch contributors.
