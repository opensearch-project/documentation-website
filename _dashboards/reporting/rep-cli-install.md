---
layout: default
title: Download and install the Reporting CLI tool
nav_order: 10
parent: Reporting using the CLI
grand_parent: Reporting
redirect_from:
  - /reporting/rep-cli-install/
  - /dashboards/reporting-cli/rep-cli-install/
---

# Download and install the Reporting CLI tool

Install the Reporting CLI tool from either the `npm` software registry or an archive downloaded from OpenSearch.org. The Reporting CLI requires Node.js.

To learn more about the `npm` software registry, see the [`npm`](https://docs.npmjs.com/about-npm) documentation.

## Installing the Reporting CLI from npm

To install the Reporting CLI from `npm`, run the following command:

```bash
npm install -g @opensearch-project/reporting-cli
```
{% include copy.html %}

The `-g` option installs the Reporting CLI globally so that the `opensearch-reporting-cli` command is available in every directory. If you install the package without `-g`, run the command from the installation directory using `npx opensearch-reporting-cli`.

## Installing the Reporting CLI from an archive

Download the [Reporting CLI archive](https://artifacts.opensearch.org/reporting-cli/opensearch-reporting-cli-1.1.0.tgz), and then install the archive by running the following command:

```bash
npm install -g opensearch-reporting-cli-1.1.0.tgz
```
{% include copy.html %}

To confirm that the archive was published by the OpenSearch Project and has not been modified, verify its signature using the [Reporting CLI signature file](https://artifacts.opensearch.org/reporting-cli/opensearch-reporting-cli-1.1.0.tgz.sig).
{: .important }

To learn more about verifying signatures, see [How to verify signatures for downloadable artifacts](https://opensearch.org/verify-signatures/).

## Verifying the installation

To verify the installation and list all available options, run the following command:

```bash
opensearch-reporting-cli -h
```
{% include copy.html %}

## Chromium

The Reporting CLI renders reports using Chromium, which `npm` downloads when it runs the Puppeteer installation script during installation. If your `npm` configuration skips installation scripts, Chromium is not downloaded.

The downloaded Chromium is an x86-64 binary on all macOS computers. On a Mac with Apple silicon, the Reporting CLI fails with the error `spawn Unknown system error -86` unless Rosetta 2 is installed.

To use a different Chromium or Chrome binary, for example, an Arm64 build or a browser installed by your package manager, set the `CHROMIUM_PATH` environment variable to the path of the browser executable:

```bash
export CHROMIUM_PATH=<path-to-chromium-executable>
```
{% include copy.html %}
