<img src="https://opensearch.org/assets/img/opensearch-logo-themed.svg" height="64px">

# OpenSearch documentation

This repository contains the documentation for OpenSearch, the search, analytics, and visualization suite with advanced security, alerting, SQL support, automated index management, deep performance analysis, and more. You can find the rendered documentation at [opensearch.org/docs](https://opensearch.org/docs).

Community contributions remain essential in keeping this documentation comprehensive, useful, well-organized, and up-to-date.


## How you can help

- Do you work on one of the various OpenSearch plugins? Take a look at the documentation for the plugin. Is everything accurate? Will anything change in the near future?

  Often, engineering teams can keep existing documentation up-to-date with minimal effort, thus freeing up the documentation team to focus on larger projects.

- Do you have expertise in a particular area of OpenSearch? Cluster sizing? The query DSL? Painless scripting? Aggregations? JVM settings? Take a look at the [current content](https://opensearch.org/docs/opensearch/) and see where you can add value. The [documentation team](#points-of-contact) is happy to help you polish and organize your drafts.

- Are you an OpenSearch Dashboards expert? How did you set up your visualizations? Why is a particular dashboard so valuable to your organization? We have [very little](https://opensearch.org/docs/opensearch-dashboards/) on how to use OpenSearch Dashboards, only how to install it.

- Are you a web developer? Do you want to add an optional dark mode to the documentation? A "copy to clipboard" button for our code samples? Other improvements to the design or usability? See [major changes](#major-changes) for information on building the website locally.

- Our [issue tracker](https://github.com/opensearch-project/documentation-website/issues) contains documentation bugs and other content gaps, some of which have colorful labels like "good first issue" and "help wanted."


## Points of contact

If you encounter problems or have questions when contributing to the documentation, these people can help:

- [kolchfa-aws](https://github.com/kolchfa-aws)


## How the website works

This repository contains many [Markdown](https://guides.github.com/features/mastering-markdown/) files organized into Jekyll "collections" (e.g. `_search-plugins`, `_opensearch`, etc.). Each Markdown file correlates with one page on the website.

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

If you're making [trivial changes](#trivial-changes), you don't have to worry about front matter.

If you want to reorganize content or add new pages, keep an eye on `has_children`, `parent`, and `nav_order`, which define the hierarchy and order of pages in the lefthand navigation. For more information, see the documentation for [our upstream Jekyll theme](https://pmarsceill.github.io/just-the-docs/docs/navigation-structure/).


## Contribute content

There are three ways to contribute content, depending on the magnitude of the change.

- [Trivial changes](#trivial-changes)
- [Minor changes](#minor-changes)
- [Major changes](#major-changes)


### Trivial changes

If you just need to fix a typo or add a sentence, this web-based method works well:

1. On any page in the documentation, click the **Edit this page** link in the lower-left.

1. Make your changes.

1. Sign off on the commit by including the text "Signed-off by: <GitHub Username> <your-email-here>" in the optional description. Be sure to use an email that's added to your GitHub account.

1. Choose **Create a new branch for this commit and start a pull request** and **Commit changes**.


### Minor changes

If you want to add a few paragraphs across multiple files and are comfortable with Git, try this approach:

1. Fork this repository.

1. Download [GitHub Desktop](https://desktop.github.com), install it, and clone your fork.

1. Navigate to the repository root.

1. Create a new branch.

1. Edit the Markdown files in `/docs`.

1. Commit, [sign off](https://github.com/src-d/guide/blob/9171d013c648236c39faabcad8598be3c0cf8f56/developer-community/fix-DCO.md#how-to-prevent-missing-sign-offs-in-the-future), push your changes to your fork, and submit a pull request.


### Major changes

If you're making major changes to the documentation and need to see the rendered HTML before submitting a pull request, here's how to build locally:

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

1. Try to stay consistent with existing content and consistent within your new content. Don't call the same plugin KNN, k-nn, and k-NN in three different places.

1. Shorter paragraphs are better than longer paragraphs. Use headers, tables, lists, and images to make your content easier for readers to scan.

1. Use **bold** for user interface elements, *italics* for key terms or emphasis, and `monospace` for Bash commands, file names, REST paths, and code.

1. Markdown file names should be all lowercase, use hyphens to separate words, and end in `.md`.

1. Avoid future tense. Use present tense.

   **Bad**: After you click the button, the process will start.

   **Better**: After you click the button, the process starts.

1. "You" refers to the person reading the page. "We" refers to the OpenSearch contributors.

   **Bad**: Now that we've finished the configuration, we have a working cluster.

   **Better**: At this point, you have a working cluster, but we recommend adding dedicated master nodes.

1. Don't use "this" and "that" to refer to something without adding a noun.

   **Bad**: This can cause high latencies.

   **Better**: This additional loading time can cause high latencies.

1. Use active voice.

   **Bad**: After the request is sent, the data is added to the index.

   **Better**: After you send the request, the OpenSearch cluster indexes the data.

1. Introduce acronyms before using them.

   **Bad**: Reducing customer TTV should accelerate our ROIC.

   **Better**: Reducing customer time to value (TTV) should accelerate our return on invested capital (ROIC).

1. Spell out one through nine. Start using numerals at 10. If a number needs a unit (GB, pounds, millimeters, kg, celsius, etc.), use numerals, even if the number if smaller than 10.

   **Bad**: 3 kids looked for thirteen files on a six GB hard drive.

   **Better**: Three kids looked for 13 files on a 6 GB hard drive.


## New releases

1. Branch.
1. Change the `opensearch_version`, `opensearch_major_minor_version`, and `lucene_version` variables in `_config.yml`.
1. Start up a new cluster using the updated Docker Compose file in `docs/install/docker.md`.
1. Update the version table in `version-history.md`.

   Use `curl -XGET https://localhost:9200 -u admin:admin -k` to verify the OpenSearch and Lucene versions.

1. Update the plugin compatibility table in `_opensearch/install/plugin.md`.

   Use `curl -XGET https://localhost:9200/_cat/plugins -u admin:admin -k` to get the correct version strings.

1. Update the plugin compatibility table in `_dashboards/install/plugins.md`.

   Use `docker ps` to find the ID for the OpenSearch Dashboards node. Then use `docker exec -it <opensearch-dashboards-node-id> /bin/bash` to get shell access. Finally, run `./bin/opensearch-dashboards-plugin list` to get the plugins and version strings.

1. Run a build (`build.sh`), and look for any warnings or errors you introduced.
1. Verify that the individual plugin download links in `docs/install/plugins.md` and `docs/opensearch-dashboards/plugins.md` work.
1. Check for any other bad links (`check-links.sh`). Expect a few false positives for the `localhost` links.
1. Submit a PR.

## Formatting documentation

The OpenSearch documentation uses a modified version of the [just-the-docs](https://github.com/pmarsceill/just-the-docs) Jekyll theme. For an overview of the commonly used formatted elements, including callouts, videos, and buttons, see the [FORMATTING_GUIDE](FORMATTING_GUIDE.md). 


## Code of conduct

This project has adopted an [Open Source Code of Conduct](https://opensearch.org/codeofconduct.html).


## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.


## License

This project is licensed under the Apache-2.0 License.


## Copyright

Copyright OpenSearch contributors.
