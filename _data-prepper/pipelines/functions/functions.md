---
layout: default
title: Functions
parent: Pipelines
nav_order: 10
has_children: true
redirect_from: 
   - /data-prepper/pipelines/functions/
tutorial_cards:
  - heading: "cidrContains()"
    description: "Checks if an IP is in a CIDR block."
    link: "/data-prepper/pipelines/cidrcontains/"
  - heading: "contains()"
    description: "Checks if a value exists in a string or list."
    link: "/data-prepper/pipelines/contains/"
  - heading: "getMetadata()"
    description: "Retrieves metadata from a record."
    link: "/data-prepper/pipelines/get-metadata/"
  - heading: "hasTags()"
    description: "Checks if a record has specific tags."
    link: "/data-prepper/pipelines/has-tags/"
  - heading: "join()"
    description: "Combines list items into a string."
    link: "/data-prepper/pipelines/join/"
  - heading: "length()"
    description: "Gets the length of a string or list."
    link: "/data-prepper/pipelines/length/"
---

# Functions

OpenSearch Data Prepper offers a range of built-in functions that can be used within expressions to perform common data preprocessing tasks, such as calculating lengths, checking for tags, retrieving metadata, searching for substrings, checking IP address ranges, and joining list elements. 

{% include cards.html cards=page.tutorial_cards %}