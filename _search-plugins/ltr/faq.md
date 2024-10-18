---
layout: default
title: FAQs
nav_order: 1000
parent: Learning to Rank
has_children: false
---

# FAQs

The following frequently asked questions (FAQS) are common issues you may encounter.

## Negative scores

Lucene does not allow for negative query scores. This can be problematic if your raw features include negative values. To address this, confirm your features are non-negative _before_ training your model. You can achieve this by creating normalized fields with values shifted by the minimum value or by passing the scores through a function that produces a value greater than or equal to `0`.

## Bugs

If you encounter a bug while working with the plugin, you can open an issue on the [open issues Github page](https://github.com/opensearch-project/opensearch-learning-to-rank-base/issues). The project team regularly investigates and resolves issue. If you are seeking general support, the issue may be closed and you may be directed to the relevant support channels.

## Struggling with a problem

If you need further assistance, join the [Relevance Slack Community](https://opensourceconnections.com/slack) and participate in the #opensearch-learn-to-rank channel to receive guidance and support from the community.
