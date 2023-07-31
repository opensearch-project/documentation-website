---
layout: default
title: Download and install the Reporting CLI tool
nav_order: 10
parent: Reporting using the CLI
grand_parent: Reporting
redirect_from:
  - /dashboards/reporting-cli/rep-cli-install/
---

# Download and install the Reporting CLI tool

You can download and install the Reporting CLI tool from either the npm software registry or the OpenSearch.org [Artifacts](https://opensearch.org/artifacts) hub. Refer to the following sections for instructions.

To learn more about the npm software registry, see the [npm](https://docs.npmjs.com/about-npm) documentation.

## Downloading and installing the Reporting CLI from npm

To download and install the Reporting CLI from npm, run the following command to initiate installation:

```
npm i @opensearch-project/reporting-cli
```

## Downloading and installing the Reporting CLI from OpenSearch.org

You can download the `opensearch-reporting-cli` tool from the OpenSearch.org [Artifacts](https://artifacts.opensearch.org/reporting-cli/opensearch-reporting-cli-1.0.0.tgz) hub.

Next, run the following command to install the .tar archive:

```
npm install -g opensearch-reporting-cli-1.0.0.tgz
```

To provide better security for artifacts, we recommend that you verify signatures by downloading the [Reporting CLI signature file](https://artifacts.opensearch.org/reporting-cli/opensearch-reporting-cli-1.0.0.tgz.sig).
{: .important }

To learn more about verifying signatures, see [How to verify signatures for downloadable artifacts](https://opensearch.org/verify-signatures.html).