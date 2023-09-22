---
layout: default
title: Field masking
parent: Access control
nav_order: 95
redirect_from:
 - /security/access-control/field-masking/
 - /security-plugin/access-control/field-masking/
---

# Field masking

If you don't want to remove fields from a document using [field-level security]({{site.url}}{{site.baseurl}}/security/access-control/field-level-security/), you can mask their values. Currently, field masking is only available for string-based fields and replaces the field's value with a cryptographic hash.

Field masking works alongside field-level security on the same per-role, per-index basis. You can allow certain roles to see sensitive fields in plain text and mask them for others. A search result with a masked field might look like this:

```json
{
  "_index": "movies",
  "_source": {
    "year": 2013,
    "directors": [
      "Ron Howard"
    ],
    "title": "ca998e768dd2e6cdd84c77015feb29975f9f498a472743f159bec6f1f1db109e"
  }
}
```


## Set the salt

You set the salt (a random string used to hash your data) in `opensearch.yml`:

```yml
plugins.security.compliance.salt: abcdefghijklmnopqrstuvqxyz1234567890
```

Property | Description
:--- | :---
`plugins.security.compliance.salt` | The salt to use when generating the hash value. Must be at least 32 characters. Only ASCII characters are allowed. Optional.

Setting the salt is optional, but we highly recommend it.


## Configure field masking

You configure field masking using OpenSearch Dashboards, `roles.yml`, or the REST API.

### OpenSearch Dashboards

1. Choose a role.
1. Choose an index permission.
1. For **Anonymization**, specify one or more fields and press Enter.


### roles.yml

```yml
someonerole:
  cluster: []
  indices:
    movies:
      _masked_fields_:
      - "title"
      - "genres"
      '*':
      - "READ"
```


### REST API

See [Create role]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-role).


## (Advanced) Use an alternative hash algorithm

By default, the Security plugin uses the BLAKE2b algorithm, but you can use any hashing algorithm that your JVM provides. This list typically includes MD5, SHA-1, SHA-384, and SHA-512.

To specify a different algorithm, add it after the masked field:

```yml
someonerole:
  cluster: []
  indices:
    movies:
      _masked_fields_:
      - "title::SHA-512"
      - "genres"
      '*':
      - "READ"
```


## (Advanced) Pattern-based field masking

Rather than creating a hash, you can use one or more regular expressions and replacement strings to mask a field. The syntax is `<field>::/<regular-expression>/::<replacement-string>`. If you use multiple regular expressions, the results are passed from left to right, like piping in a shell:

```yml
hr_employee:
  index_permissions:
    - index_patterns:
      - 'humanresources'
      allowed_actions:
        - ...
      masked_fields:
        - 'lastname::/.*/::*'
        - '*ip_source::/[0-9]{1,3}$/::XXX::/^[0-9]{1,3}/::***'
someonerole:
  cluster: []
  indices:
    movies:
      _masked_fields_:
      - "title::/./::*"
      - "genres::/^[a-zA-Z]{1,3}/::XXX::/[a-zA-Z]{1,3}$/::YYY"
      '*':
      - "READ"

```

The `title` statement changes each character in the field to `*`, so you can still discern the length of the masked string. The `genres` statement changes the first three characters of the string to `XXX` and the last three characters to `YYY`.


## Effect on audit logging

The read history feature lets you track read access to sensitive fields in your documents. For example, you might track access to the email field of your customer records. Access to masked fields are excluded from read history, because the user only saw the hash value, not the clear text value of the field.
