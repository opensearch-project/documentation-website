---
layout: default
title: Phone number
parent: Analyzers
nav_order: 140
---

# Phone number analyzers

The `analysis-phonenumber` plugin provides analyzers and tokenizers for parsing phone numbers.
A dedicated analyzer is required because parsing phone numbers is a non-trivial task (even though it might seem trivial at first glance). For common pitfalls in parsing phone numbers, see [Falsehoods programmers believe about phone numbers](https://github.com/google/libphonenumber/blob/master/FALSEHOODS.md).


OpenSearch supports the following phone number analyzers:

* `phone`: An [index analyzer]({{site.url}}{{site.baseurl}}/analyzers/index-analyzers/) to use at indexing time.
* `phone-search`: A [search analyzer]({{site.url}}{{site.baseurl}}/analyzers/search-analyzers/) to use at search time.

Internally, the plugin uses the [`libphonenumber`](https://github.com/google/libphonenumber) library and follows its parsing rules.

The phone number analyzers are not meant to find phone numbers in larger texts. Instead, you should use them on fields which contain phone numbers alone.
{: .note}

## Installing the plugin

Before you can use phone number analyzers, you must install the `analysis-phonenumber` plugin by running the following command:

```sh
./bin/opensearch-plugin install analysis-phonenumber
```

## Specifying a default region

You can optionally specify a default region for parsing phone numbers by providing the `phone-region` parameter within the analyzer. Valid phone regions are ISO 3166 country codes. For more information, see [List of ISO 3166 country codes](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes). 

When tokenizing phone numbers containing the international calling prefix `+`, the default region is irrelevant. However, for phone numbers which either use a national prefix for international numbers (for example,  `001` instead of `+1` to dial Northern America from most European countries), the region needs to be provided. You can also properly index local phone numbers with no international prefix if you specify the region.

## Example

The following request creates an index containing one field, which ingests phone numbers for Switzerland (region code `CH`):

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
{% include copy-curl.html %}