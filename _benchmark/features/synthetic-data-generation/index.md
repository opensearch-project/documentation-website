---
layout: default
title: Synthetic data generation
nav_order: 5
has_children: true
parent: Additional features
has_toc: false
redirect_from:
  - /benchmark/features/synthetic-data-generation/
cards:
  - heading: "Generate data using index mappings"
    description: "Create synthetic data based on your OpenSearch index mappings."
    link: "/benchmark/features/synthetic-data-generation/mapping-sdg/"
  - heading: "Generate data using custom logic"
    description: "Build synthetic data using your own scripts or domain-specific rules."
    link: "/benchmark/features/synthetic-data-generation/custom-logic-sdg/"
more_cards:
  - heading: "Generating vectors"
    description: "Generate synthetic dense and sparse vectors with configurable parameters for realistic AI/ML benchmarking scenarios."
    link: "/benchmark/features/synthetic-data-generation/generating-vectors/"
tip_cards:
  - heading: "Tips and best practices"
    description: "Learn practical guidance and best practices to optimize your synthetic data generation workflows."
    link: "/benchmark/features/synthetic-data-generation/tips/"
---

# Synthetic data generation
**Introduced 2.0**
{: .label .label-purple }

OpenSearch Benchmark provides a built-in synthetic data generator that can create datasets for any use case at any scale. It currently supports two generation methods: 

* **Random data generation** produces fields with randomized values. This is useful for stress testing and evaluating system performance under load.
* **Rule-based data generation** creates data according to user-defined rules. This is helpful for testing specific scenarios, benchmarking query behavior, or simulating domain-specific patterns.

## Data generation methods

OpenSearch Benchmark currently supports the following data generation methods.

{% include cards.html cards=page.cards %}

For advanced synthetic data generation capabilities, explore vector generation.

{% include cards.html cards=page.more_cards %}

## Tips and best practices

{% include cards.html cards=page.tip_cards %}
