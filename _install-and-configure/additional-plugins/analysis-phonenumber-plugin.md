---
layout: default
title: Phone number analysis plugin
parent: Installing plugins
nav_order: 20

---

# Phone number analysis plugin
Introduced 2.18
{: .label .label-purple }

The `analysis-phonenumber` plugin provides analysers and tokenizers for phone numbers.
A dedicated analyser is required since parsing phone numbers is a non-trivial task (even though it might seem trivial at
first glance!), as can be seen in the list [falsehoods programmers believe about phone numbers](https://github.com/google/libphonenumber/blob/master/FALSEHOODS.md).

## Installing the plugin

Install the `analysis-phonenumber` plugin using the following command:

```sh
./bin/opensearch-plugin install analysis-phonenumber
```

## Provided analyzers & tokenizers

There are two analyzers & tokenizers being provided:
* `phone`: use this as the [index analyzer]({{site.url}}{{site.baseurl}}/analyzers/index-analyzers/)
* `phone-search`: use this as the [search analyzer]({{site.url}}{{site.baseurl}}/analyzers/search-analyzers/)

You can optionally specify a default region which it should use when parsing phone numbers. When tokenizing phone numbers
with the international calling prefix `+` this is not relevant, but for phone numbers which either use a national prefix
for international numbers (e.g. `001` instead of `+1` to dial Northern America from most European countries) the region
needs to be known. Furthermore you can also properly index local phone numbers with no international prefix if you specify
the region.

Internally this uses [libphonenumber](https://github.com/google/libphonenumber), thus their parsing rules apply.

Note that these analyzers are not meant to find phone numbers in larger texts, instead you should use them on fields which
contain the phone number.

## Example

Example configuration of an index with one field which ingests phone numbers for Switzerland:
```json
PUT /example-phone
{
  "settings": {
    "analysis": {
      "analyzer": {
        "phone-ch": {
          "type": "phone",
          "phone-region": "CH"
        },
        "phone-search-ch": {
          "type": "phone-search",
          "phone-region": "CH"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "phoneNumber": {
        "type": "text",
        "analyzer": "phone-ch",
        "search_analyzer": "phone-search-ch"
      }
    }
  }
}
```
