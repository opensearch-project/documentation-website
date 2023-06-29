- [Creating an issue](#creating-an-issue)
- [Finding contributions to work on](#finding-contributions-to-work-on)
- [Contributing content](#contributing-content)
   - [Documentation workflow](#documentation-workflow)
   - [Before you start](#before-you-start)
   - [Making minor changes](#making-minor-changes)
   - [Making major changes](#making-major-changes)
      - [Setting up your local copy of the repository](#setting-up-your-local-copy-of-the-repository)
      - [Making, viewing, and submitting changes](#making-viewing-and-submitting-changes)
- [Review process](#review-process)
- [Getting help](#getting-help)

# Contributing Guidelines

Thank you for your interest in improving the OpenSource documentation! We value and appreciate all feedback and contributions from our community, including requests for additional documentation, corrections to existing content, and reports of technical issues with the documentation site. 

You can [create an issue](#creating-an-issue) asking us to change the documentation or [contribute content](#contributing-content) yourself.

## Creating an issue

Use the GitHub issue tracker to describe the change you'd like to make: 

1. Go to https://github.com/opensearch-project/documentation-website/issues and select **New issue**.
1. Enter the requested information, including as much detail as possible, especially which version or versions the request affects.
1. Select **Submit new issue**. 

The `untriaged` label is assigned automatically. During the triage process, the documentation team will add the appropriate labels, assign the issue to a technical writer, and prioritize the request. We may follow up with you for additional information. 

## Finding contributions to work on

If you’d like to contribute but don't know where to start, try browsing existing [issues](https://github.com/opensearch-project/documentation-website/issues). Our projects use custom GitHub issue labels for status, version, type of request, and so on, but we recommend looking at any issues labeled `good first issue` first. 

## Contributing content

There are two ways to contribute content depending on the magnitude of the change:

- [Minor changes](#making-minor-changes): For small changes like fixing a typo or adding a parameter, you can edit files in GitHub directly. This approach does not require cloning the repository and does not let you test the documentation.
- [Major changes](#making-major-changes): For changes you want to test first, like reorganizing pages or adding a table or section, you can edit files locally and push the changes to GitHub. This approach requires setting up a local version of the repository and lets you test documentation.

### Documentation workflow

The workflow for contributing documentation is no different than the one for contributing code:

- Make your changes
- Build locally to check your work (only possible if you are making changes locally)
- Submit a [pull request](https://github.com/opensearch-project/documentation-website/pulls) (PR)
- Maintainers review and merge your PR

If the change requires significant work, open an issue where we can first discuss your request.

### Before you start

Before contributing content, make sure to read the following resources:
- [README](README.md)
- [OpenSearch Project Style Guidelines](STYLE_GUIDE.md)
- [API Style Guide](API_STYLE_GUIDE.md)
- [Formatting Guide](FORMATTING_GUIDE.md) 

NOTE: Please make sure that any documentation you submit is your work or work you have the rights to submit. We respect the intellectual property rights of others, and as part of contributing, we'll ask you to sign your contribution with a [Developer Certificate of Origin (DCO)](https://github.com/opensearch-project/.github/blob/main/CONTRIBUTING.md#developer-certificate-of-origin) that states you have the rights to submit this work and you understand we'll use your contribution. 

### Making minor changes

If you want to add a few paragraphs to a file, try this approach:

1. [Fork this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo).

1. In your fork on GitHub, navigate to the file that you want to change.

1. In the upper-right corner, select the dropdown with the pencil icon and select **Edit in place**. Edit the file.

1. In the upper-right corner, select **Commit changes...***. Enter the commit message and optional description and select **Create a new branch for this commit and start a pull request**.

### Making major changes

If you're making major changes to the documentation and need to see the rendered HTML before submitting a pull request, you need to work in a local copy of the repository. 

#### Setting up your local copy of the repository

Follow these steps to set up your local copy of the repository:

1. [Fork this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and clone your fork.

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

#### Making, viewing, and submitting changes 

Here's how to build the website, make the changes, and view them locally:

1. Build the website:

   ```
   sh build.sh    
   ```

   The build script should automatically open your web browser, but if it doesn't, open [http://localhost:4000/docs/](http://localhost:4000/docs/).

1. Create a new branch against the latest source on the main branch. 

1. Edit the Markdown files that you want to change.

1. When you save a file, marvel as Jekyll automatically rebuilds the site and refreshes your web browser. This process can take anywhere from 10 to 30 seconds.

1. When you're happy with how everything looks, commit, [sign off](https://github.com/src-d/guide/blob/9171d013c648236c39faabcad8598be3c0cf8f56/developer-community/fix-DCO.md#how-to-prevent-missing-sign-offs-in-the-future), push your changes to your fork, and submit a pull request.

    Note that a pull request requires DCO sign-off before we can merge it. You can use the -s command line option to append this automatically to your commit message, for example `git commit -s -m 'This is my commit message'`. For more information, see https://github.com/apps/dco.

## Review process

We greatly appreciate everyone who takes the time to make a contribution. We will review all contributions as quickly as possible. If it’s a quick fix, we should be able to release the update quickly. Bigger requests might take a bit of time for us to review. 

During the PR process, expect that there will be some back-and-forth. Please try to respond to comments in a timely fashion, and if you don't want to continue with the PR, let us know. 

We use the [Vale](https://github.com/errata-ai/vale) linter to ensure that our documentation adheres to the [OpenSearch Project Style Guidelines](STYLE_GUIDE.md). Addressing Vale comments on the PR expedites the review process. You can also install Vale locally so you can address the comments before creating a PR. For more information, see [Style linting](README.md#style-linting).

If we accept the PR, we will merge your change and usually take care of backporting it to appropriate branches ourselves.

## Getting help

For help with any step in the contributing process, please reach out to one of the [points of contact](README.md#points-of-contact).