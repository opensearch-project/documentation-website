---
layout: default
title: Tips & Tricks
nav_order: 45
parent: Synthetic Data Generation
grand_parent: Features
---

# Tips & tricks

### Visualizing Generation
The URL outputted takes users to a Dask Dashboard that visualizes the generation process. Users can keep track of CPU and memory of each worker as well as obtain a CPU flamegraph of the generation process. This is helpful for optimizing generation when using a custom python module.

### Use Default Settings
We recommend using the default settings that come with Synthetic Data Generation. Workers should be no more than the CPU count on the load generation host and chunk sizes should be 10,000 docs per chunk. However, users are encouraged to change the max_file_size_gb field as needed. This just changes how much data should be stored in each file generated.
