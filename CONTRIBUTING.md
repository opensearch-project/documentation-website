# Contributing Guidelines

Thank you for your interest in improving the OpenSource documentation! We value and appreciate all feedback and contributions from our community, including requests for additional documentation, corrections to existing content, and reports of technical issues with the documentation site. 

## Finding contributions to work on

If you’d like to contribute but don't know where to start, try browsing existing issues. Our projects use custom GitHub issue labels for status, version, type of request, and so on, but we recommend looking at any issues labeled `good first issue` first. 

## Contributing to the documentation site

There are two ways to contribute: 
1. [Create an issue](#create-an-issue) asking us to change the documentation.
2. [Contribute documentation content](#contribute-content) yourself.

## Create an issue

Use the GitHub issue tracker to describe the change you'd like to make: 

1. Go to https://github.com/opensearch-project/documentation-website/issues and select *New issue*.
2. Enter the requested information, including as much detail as possible, especially which version or versions the request affects.
3. Select *Submit new issue*. 

The `untriaged` label is assigned automatically. During the triage process, the documentation team will add the appropriate labels, assign the issue to a technical writer, and prioritize the request. We may follow up with you for additional information. 

## Contribute content

There are two ways to contribute content:

- [Editing files directly in GitHub](#editing-files-in-github): Best for small changes like fixing a typo or adding a parameter. This approach does not require cloning the repository and does not let you test the documentation.
- [Making changes locally and pushing to GitHub](#making-changes-locally): Best for changes you want to test locally first, like adding a table or section, or reorganizing pages. This approach requires setting up a local version of the repository and lets you test documentation.

The workflow for contributing documentation is no different than the one for contributing code:

- Make your changes
- Build locally to check your work (only possible if you are making changes locally)
- Submit a [pull request](https://github.com/opensearch-project/documentation-website/pulls) (PR)
- Maintainers review and merge your PR

If the change requires significant work, open an issue where we can first discuss your request.

### Before you start

Before contributing content, make sure to read the following resources:
- [README](README)
- [OpenSearch Project Style Guidelines](STYLE_GUIDE)
- [API Style Guide](API_STYLE_GUIDE)
- [Formatting Guide](FORMATTING_GUIDE) 

### Editing files in GitHub

If you want to add a few paragraphs to a file, try this approach:

1. [Fork this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo).

1. In your fork on GitHub, navigate to the file that you want to change.

1. In the upper-right corner, select the dropdown with the pencil icon and select **Edit in place**. Edit the file.

1. In the upper-right corner, select **Commit changes...***. Enter the commit message and optional description and select **Create a new branch for this commit and start a pull request**.


### Making changes locally

If you're making major changes to the documentation and need to see the rendered HTML before submitting a pull request, here's how to make the changes and view them locally:

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

1. Build:

   ```
   sh build.sh    
   ```

1. If the build script doesn't automatically open your web browser (it should), open [http://localhost:4000/docs/](http://localhost:4000/docs/).

1. Create a new branch against the latest source on the main branch. 

1. Edit the Markdown files that you want to change.

1. When you save a file, marvel as Jekyll automatically rebuilds the site and refreshes your web browser. This process can take anywhere from 10 to 30 seconds.

1. When you're happy with how everything looks, commit, [sign off](https://github.com/src-d/guide/blob/9171d013c648236c39faabcad8598be3c0cf8f56/developer-community/fix-DCO.md#how-to-prevent-missing-sign-offs-in-the-future), push your changes to your fork, and submit a pull request.

    Note that a pull request requires DCO sign off before we can merge it. You can use the -s command line option to append this automatically to your commit message, for example $ git commit -s -m 'This is my commit message'. For more information, see https://github.com/apps/dco.


### Review process

We greatly appreciate everyone who takes the time to make a contribution. We will review all contributions as quickly as possible. If it’s a quick fix, we should be able to release the update quickly. Bigger requests might take a bit of time for us to review. 

During the PR process, expect that there will be some back-and-forth. Please try to respond to comments in a timely fashion, and if you don't want to continue with the PR, let us know. 

We use the [Vale](https://github.com/errata-ai/vale) linter to ensure that our documentation adheres to the [OpenSearch Project Style Guidelines](STYLE_GUIDE.md). Addressing Vale comments on the PR expedites the review process. You can also install Vale locally so you can address the comments before creating a PR. For more information, see [Style linting](README#style-linting).

If we accept the PR, we will merge your change and usually take care of backporting it to appropriate branches ourselves.


## Getting help

For help with any step in the contributing process, please reach out to one of the [points of contact](README#points-of-contact).

