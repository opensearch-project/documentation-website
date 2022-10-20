---
layout: default
title: Script APIs
has_children: true
nav_order: 70
redirect_from:
  - /opensearch/rest-api/script-apis/
---

# Script APIs

The script APIs allow you to work with stored scripts. Stored scripts are part of the cluster state and reduce compilation time and enhance search speed. The default scripting language is Painless.

You perform the following operations on stored scripts:
* [create]({{site.url}}{{site.baseurl}}/api-reference/script-apis/create-stored-script/)
* [update]({{site.url}}{{site.baseurl}}/api-reference/script-apis/create-stored-script/)
* [execute]({{site.url}}{{site.baseurl}}/api-reference/script-apis/exec-stored-script/)
* [retrieve]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-stored-script/)
* [delete]({{site.url}}{{site.baseurl}}/api-reference/script-apis/delete-script/)
* You can also retrieve stored [script contexts]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-script-contexts/).