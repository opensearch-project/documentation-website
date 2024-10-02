---
layout: default
title: FAQs
nav_order: 1000
parent: LTR search
has_children: false
---

# FAQs

The following frequently asked questions (FAQS) are common issues you may encounter.

## Negative scores

Lucene does not allow for negative query scores. This can be problematic if your raw features include negative values. To address this, you will need to ensure your features are non-negative **before** training your model. You can achieve this by creating normalized fields with values shifted by the minimum value or by passing the scores through a function that produces a value greater than or equal to `0`.

## Bugs

If you've encountered a bug while working with the plugin, you can open an issue on the [open issues Github page](https://github.com/opensearch-project/opensearch-learning-to-rank-base/issues). The project team will do its best to investigate and resolve the issue. However, if you are seeking general support, the issue may be closed and you may be directed to the relevant support channels.

## Struggling with a problem

If you are still struggling with a problem, you can join the [Relevance Slack
Community](https://opensourceconnections.com/slack) and participate in the #opensearch-learn-to-rank channel, where you can receive additional guidance and support from the community.
