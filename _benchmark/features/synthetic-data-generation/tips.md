---
layout: default
title: Tips and best practices
nav_order: 45
parent: Synthetic data generation
grand_parent: Additional features
---

# Tips and best practices

The following tips help you efficiently generate synthetic data and monitor performance during the process.

### Visualizing generation

The generated URL opens a [Dask dashboard](https://docs.dask.org/en/latest/dashboard.html) that visualizes the data generation process. You can monitor CPU and memory usage for each worker and view a CPU flamegraph of the generation workflow. This helps track resource usage and optimize performance, especially when using a [custom Python module]({{site.url}}{{site.baseurl}}/benchmark/features/synthetic-data-generation/custom-logic-sdg/).

### Use default settings

We recommend starting with the default synthetic data generation settings. These guidelines help you choose appropriate settings for efficient and reliable synthetic data generation:

* Set the number of workers to **no more than the CPU count** on the load generation host.
* Use a **chunk size of 10,000 documents** per chunk.
* Adjust the `max_file_size_gb` setting as needed to control how much data is written to each generated file.
