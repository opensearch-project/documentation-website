---
layout: default
title: Field-level security
parent: Access control
nav_order: 90
redirect_from:
 - /security/access-control/field-level-security/
 - /security-plugin/access-control/field-level-security/
---

# Field-level security

Field-level security lets you control which document fields a user can see. Just like [document-level security]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security/), you control access by index within a role.

The easiest way to get started with document- and field-level security is open OpenSearch Dashboards and choose **Security**. Then choose **Roles**, create a new role, and review the **Index permissions** section.

---

#### Table of contents
1. TOC
{:toc}


---

## Include or exclude fields

You have two options when you configure field-level security: include or exclude fields. If you include fields, users see *only* those fields when they retrieve a document. For example, if you include the `actors`, `title`, and `year` fields, a search result might look like this:

```json
{
  "_index": "movies",
  "_source": {
    "year": 2013,
    "title": "Rush",
    "actors": [
      "Daniel Brühl",
      "Chris Hemsworth",
      "Olivia Wilde"
    ]
  }
}
```

If you exclude fields, users see everything *but* those fields when they retrieve a document. For example, if you exclude those same fields, the same search result might look like this:

```json
{
  "_index": "movies",
  "_source": {
    "directors": [
      "Ron Howard"
    ],
    "plot": "A re-creation of the merciless 1970s rivalry between Formula One rivals James Hunt and Niki Lauda.",
    "genres": [
      "Action",
      "Biography",
      "Drama",
      "Sport"
    ]
  }
}
```

You can achieve the same outcomes using inclusion or exclusion, so choose whichever makes sense for your use case. Mixing the two doesn't make sense and is not supported.

You can specify field-level security settings using OpenSearch Dashboards, `roles.yml`, and the REST API.

- To exclude fields in `roles.yml` or the REST API, add `~` before the field name.
- Field names support wildcards (`*`).

  Wildcards are especially useful for excluding *subfields*. For example, if you index a document that has a string (e.g. `{"title": "Thor"}`), OpenSearch creates a `title` field of type `text`, but it also creates a `title.keyword` subfield of type `keyword`. In this example, to prevent unauthorized access to data in the `title` field, you must also exclude the `title.keyword` subfield. Use `title*` to match all fields that begin with `title`.


### OpenSearch Dashboards

1. Choose a role and **Add index permission**.
1. Choose an index pattern.
1. Under **Field level security**, use the drop-down to select your preferred option. Then specify one or more fields and press Enter.


### roles.yml

```yml
someonerole:
  cluster: []
  indices:
    movies:
      '*':
      - "READ"
      _fls_:
      - "~actors"
      - "~title"
      - "~year"
```

### REST API

See [Create role]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-role).


## Interaction with multiple roles

If you map a user to multiple roles, we recommend that those roles use either include *or* exclude statements for each index. The Security plugin evaluates field-level security settings using the `AND` operator, so combining include and exclude statements can lead to neither behavior working properly.

For example, in the `movies` index, if you include `actors`, `title`, and `year` in one role, exclude `actors`, `title`, and `genres` in another role, and then map both roles to the same user, a search result might look like this:

```json
{
  "_index": "movies",
  "_source": {
    "year": 2013,
    "directors": [
      "Ron Howard"
    ],
    "plot": "A re-creation of the merciless 1970s rivalry between Formula One rivals James Hunt and Niki Lauda."
  }
}
```


## Interaction with document-level security

[Document-level security]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security/) relies on OpenSearch queries, which means that all fields in the query must be visible in order for it to work properly. If you use field-level security in conjunction with document-level security, make sure you don't restrict access to the fields that document-level security uses.
