- [Creating an issue](#creating-an-issue)
- [Contributing content](#contributing-content)
   - [Contribution workflow](#contribution-workflow)
   - [Before you start](#before-you-start)
   - [Making minor changes](#making-minor-changes)
   - [Making major changes](#making-major-changes)
      - [Setting up your local copy of the repository](#setting-up-your-local-copy-of-the-repository)
      - [Making, viewing, and submitting changes](#making-viewing-and-submitting-changes)
- [Review process](#review-process)
   - [Style linting](#style-linting)
- [Getting help](#getting-help)

# Contributing guidelines

Thank you for your interest in improving the OpenSearch documentation! We value and appreciate all feedback and contributions from our community, including requests for additional documentation, corrections to existing content, and reports of technical issues with the documentation site. 

You can [create an issue](#creating-an-issue) asking us to change the documentation or [contribute content](#contributing-content) yourself.

NOTE: If you’d like to contribute but don't know where to start, try browsing existing [issues](https://github.com/opensearch-project/documentation-website/issues). Our projects use custom GitHub issue labels for status, version, type of request, and so on. We recommend starting with any issue labeled "good first issue" if you're a beginner or "help wanted" if you're a more experienced user. 

## Creating an issue

Use the documentation issue template to describe the change you'd like to make:

1. Go to https://github.com/opensearch-project/documentation-website/issues and select **New issue**.
1. Enter the requested information, including as much detail as possible, especially which version or versions the request affects.
1. Select **Submit new issue**. 

The `untriaged` label is assigned automatically. During the triage process, the Documentation team will add the appropriate labels, assign the issue to a technical writer, and prioritize the request. We may follow up with you for additional information. 

## Contributing content

There are two ways to contribute content, depending on the magnitude of the change:

- [Minor changes](#making-minor-changes): For small changes to existing files, like fixing typos or adding parameters, you can edit files in GitHub directly. This approach does not require cloning the repository and does not allow you to test the documentation.
- [Major changes](#making-major-changes): For changes you want to test first, like adding new or reorganizing pages or adding a table or section, you can edit files locally and push the changes to GitHub. This approach requires setting up a local version of the repository and allows you to test the documentation.

### Contribution workflow

The workflow for contributing documentation is the same as the one for contributing code:

- Make your changes.
- Build the documentation website to check your work (only possible if you are making changes locally).
- Submit a [pull request](https://github.com/opensearch-project/documentation-website/pulls) (PR).
- A maintainer reviews and merges your PR.

### Before you start

Before contributing content, make sure to read the following resources:
- [README](README.md)
- [OpenSearch Project Style Guidelines](STYLE_GUIDE.md)
- [API Style Guide](API_STYLE_GUIDE.md)
- [Formatting Guide](FORMATTING_GUIDE.md) 

NOTE: Make sure that any documentation you submit is your own work or work that you have the right to submit. We respect the intellectual property rights of others, and as part of contributing, we'll ask you to sign your contribution with a [Developer Certificate of Origin (DCO)](https://github.com/opensearch-project/.github/blob/main/CONTRIBUTING.md#developer-certificate-of-origin) stating that you have the right to submit your contribution and that you understand that we will use your contribution. 

### Making minor changes

If you want to make minor changes to an existing file, you can use this approach:

1. [Fork this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo).

1. In your fork on GitHub, navigate to the file that you want to change.

1. In the upper-right corner, select the pencil icon and edit the file.

1. In the upper-right corner, select **Commit changes...***. Enter the commit message and optional description and select **Create a new branch for this commit and start a pull request**.

### Making major changes

If you're adding a new page or making major changes to the documentation, such as adding new images, sections, or styling, we recommend that you work in a local copy of the repository and test the rendered HTML before submitting a PR. 

#### Setting up your local copy of the repository

Follow these steps to set up your local copy of the repository:

1. [Fork this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and clone your fork.

1. Navigate to your cloned repository.

##### Building by using locally installed packages 

1. Install [Ruby](https://www.ruby-lang.org/en/) if you don't already have it. We recommend [RVM](https://rvm.io/), but you can use any method you prefer:

   ```
   curl -sSL https://get.rvm.io | bash -s stable
   rvm install 3.4.5
   ruby -v
   ```

1. Install [Bundler](https://bundler.io/) if you don't already have it:

   ```
   gem install bundler
   ```

1. Install Jekyll and all the dependencies:

   ```
   bundle install
   ```

##### Building by using containerization

Assuming you have Docker installed, run the following command:

   ```
   docker compose -f docker-compose.dev.yml up
   ```

#### Troubleshooting

Try the following troubleshooting steps if you encounter an error when trying to build the documentation website:  

- If you see the `Error running '__rvm_make -j10'` error when running `rvm install 3.4.5`, you can resolve it by running `rvm install 3.4.5 -C --with-openssl-dir=$(brew --prefix openssl@3)` instead of `rvm install 3.4.5`.
- If you see the `bundle install`: `An error occurred while installing posix-spawn (0.3.15), and Bundler cannot continue.` error when trying to run `bundle install`, you can resolve it by running `gem install posix-spawn -v 0.3.15 -- --with-cflags=\"-Wno-incompatible-function-pointer-types\"` and then `bundle install`.
 


#### Making, viewing, and submitting changes 

Here's how to build the website, make changes, and view them locally:

1. Build the website:

   ```
   sh build.sh    
   ```

   The build script should automatically open your web browser, but if it doesn't, open [http://localhost:4000/docs/](http://localhost:4000/docs/).

1. Create a new branch against the latest source on the main branch. 

1. Edit the Markdown files that you want to change.

1. When you save a file, Jekyll automatically rebuilds the site and refreshes your web browser. This process can take 60--90 seconds.

1. When you're happy with how everything looks, commit, [sign off](https://github.com/src-d/guide/blob/9171d013c648236c39faabcad8598be3c0cf8f56/developer-community/fix-DCO.md#how-to-prevent-missing-sign-offs-in-the-future), push your changes to your fork, and submit a PR.

    Note that a PR requires DCO sign-off before we can merge it. You can use the -s command line option to append this automatically to your commit message, for example, `git commit -s -m 'This is my commit message'`. For more information, see https://github.com/apps/dco.

## Review process

We greatly appreciate all contributions to the documentation and will review them as quickly as possible. Documentation can be updated at any time and does not require waiting for a release. Once you have created a PR, the documenation review process is as follows:

1. Ensure that the submitted documentation is technically accurate and all examples are working. If you are a developer implementing the feature, you can optionally ask one of your peers to conduct a technical review. If you need help finding a tech reviewer, tag a [maintainer](https://github.com/opensearch-project/documentation-website/blob/main/MAINTAINERS.md).
2. When you submit a PR, it's assigned to one of the doc reviewers. Once you have verified technical accuracy and all technical reviews are completed, tag the assignee of the PR for a doc review.
3. A doc reviewer (technical writer) performs a doc review. The doc reviewer may push edits to the PR directly or leave comments and suggestions for you to address (let us know in a comment if you have a preference). The doc reviewer will arrange for an editorial review.
4. The editor performs an editorial review. The editor may push edits to the PR directly or leave comments and editorial suggestions for you to address (let us know in a comment if you have a preference).
5. When you have addressed all comments, the PR is merged. It is important that you specify to which versions the PR is applicable when you create the PR so it can be backported to the correct branches. We support updates only for the latest documentation version; the previous versions are not updated. Once the PR is merged, the documentation is published on the documentation site.

During the PR process, expect that there will be some back-and-forth. If you want your contribution to be merged quickly, try to respond to comments in a timely fashion, and let us know if you don't want to continue with the PR. 

We use the [Vale](https://github.com/errata-ai/vale) linter to ensure that our documentation adheres to the [OpenSearch Project Style Guidelines](STYLE_GUIDE.md). Addressing Vale comments on the PR expedites the review process. You can also install Vale locally so you can address the comments before creating a PR. For more information, see [Style linting](#style-linting).


### Style linting

To ensure that our documentation adheres to the [OpenSearch Project Style Guidelines](STYLE_GUIDE.md), we use the [Vale](https://github.com/errata-ai/vale) linter. Addressing Vale comments on the PR expedites the review process. You can also install Vale locally as follows so you can address the comments before creating a PR:

1. Download and install [Vale version 2.28.0](https://github.com/errata-ai/vale/releases/tag/v2.28.0).
2. Run `vale *` from the documentation site root directory to lint all Markdown files. To lint a specific file, run `vale /path/to/file`.

Optionally, you can install the [Vale VSCode](https://github.com/chrischinchilla/vale-vscode) extension, which integrates Vale with Visual Studio Code. By default, only _errors_ and _warnings_ are underlined. To change the minimum alert level to include _suggestions_, go to **Vale VSCode** > **Extension Settings** and select **suggestion** in the **Vale > Vale CLI: Min Alert Level** dropdown list. 

## Troubleshooting

This section provides information about potential solutions for known issues.

### Installing Ruby on an Apple silicon machine

If you're having trouble installing Ruby with `rvm` on an Apple silicon machine, it could be because of an OpenSSL version misalignment. To fix this issue, use the following command, replacing `<openssl-version>` with your [desired version](https://github.com/ruby/openssl/blob/master/README.md):

```
# Assumes Brew is installed
curl -sSL https://get.rvm.io | bash -s stable
rvm install 3.4.5 --with-openssl-dir=$(brew --prefix openssl@<openssl-version>)
ruby -v
```

## Getting help

For help with the contribution process, reach out to one of the [points of contact](README.md#points-of-contact).


