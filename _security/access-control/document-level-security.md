---
layout: default
title: Document-level security
parent: Access control
nav_order: 90
redirect_from:
- /security-plugin/access-control/document-level-security/
---

# Document-level security

Document-level security (DLS) determines the documents that a role can retrieve during read operations, such as search and get. By default, it does not restrict write operations. If a role has permissions to index or delete documents in an index, it can still overwrite or remove documents that are hidden by DLS. Update operations are an exception: the Security plugin rejects them when DLS applies. For more information, see [DLS and write permissions](#dls-and-write-permissions) and [Updating documents](#updating-documents).

To get started with DLS, open OpenSearch Dashboards and choose **Security**. Then select **Roles**, create a new role, and review the **Index permissions** section shown in the following image.

![Document- and field-level security screen in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/security-dls.png)

The maximum size for the document-level security configuration is 1024 KB (1,048,404 characters). When you define a role using the REST API, each DLS query is also limited by the `plugins.security.restapi.max_string_length` setting, which defaults to 4,096 characters. For more information, see [REST management API settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/#rest-management-api-settings).
{: .warning}

## Simple roles

DLS uses OpenSearch query domain-specific language (DSL) to define the documents that a role is allowed to retrieve. In OpenSearch Dashboards, choose an index pattern and provide a query in the **Document-level security** section:

```json
{
  "bool": {
    "must": {
      "match": {
        "genres": "Comedy"
      }
    }
  }
}
```

This query specifies that for the role to have access to a document, its `genres` field must include `Comedy`.

A typical request sent to the `_search` API includes `{ "query": { ... } }` around the query, but in this case, you only need to specify the query itself.

## Updating roles by accessing the REST API 

In the REST API, you provide the query as a string, so you must escape your quotes. This role allows a user to read any document with the field `public` set to `true` in any index that matches the `pub*` pattern:

```json
PUT _plugins/_security/api/roles/public_data
{
  "cluster_permissions": [
    "cluster_composite_ops_ro"
  ],
  "index_permissions": [{
    "index_patterns": [
      "pub*"
    ],
    "dls": "{\"term\": { \"public\": true}}",
    "allowed_actions": [
      "read"
    ]
  }]
}
```

These queries can be as complex as you want, but we recommend keeping them simple to minimize the performance impact that the document-level security feature has on the cluster.
{: .warning }

### A note on Unicode special characters in text fields

Due to word boundaries associated with Unicode special characters, the Unicode standard analyzer cannot index a [text field type]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text/) value as a whole value when it includes one of these special characters. As a result, a text field value that includes a special character is parsed by the standard analyzer as multiple values separated by the special character, effectively tokenizing the different elements on either side of it. This can lead to unintentional filtering of documents and potentially compromise control over their access.

The following examples illustrate values containing special characters that will be parsed improperly by the standard analyzer. In this example, the existence of the hyphen/minus sign in the value prevents the analyzer from distinguishing between the two different users for `user.id` and interprets them as one and the same:

```json
{
  "bool": {
    "must": {
      "match": {
        "user.id": "User-1"
      }
    }
  }
}
```

```json
{
  "bool": {
    "must": {
      "match": {
        "user.id": "User-2"
      }
    }
  }
}
```

To avoid this circumstance when using either Query DSL or the REST API, you can use a custom analyzer or map the field as `keyword`, which performs an exact-match search. See [Keyword field type]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/) for the latter option.

For a list of characters that should be avoided when field type is `text`, see [Word Boundaries](https://unicode.org/reports/tr29/#Word_Boundaries).


## Parameter substitution

A number of variables exist that you can use to enforce rules based on the properties of a user. For example, `${user.name}` is replaced with the name of the current user.

This rule allows a user to read any document where the username is a value of the `readable_by` field:

```json
PUT _plugins/_security/api/roles/user_data
{
  "cluster_permissions": [
    "cluster_composite_ops_ro"
  ],
  "index_permissions": [{
    "index_patterns": [
      "pub*"
    ],
    "dls": "{\"term\": { \"readable_by\": \"${user.name}\"}}",
    "allowed_actions": [
      "read"
    ]
  }]
}
```

The following table lists the available substitutions.

Term | Replaced with
:--- | :---
`${user.name}` | Username.
`${user.roles}` | A comma-separated, quoted list of user backend roles.
`${user.securityRoles}` | A comma-separated, quoted list of user security roles.
`${attr.<TYPE>.<NAME>}` | An attribute with name `<NAME>` defined for a user. `<TYPE>` is `internal`, `jwt`, `proxy`, or `ldap`.

If a variable does not exist, the request fails with an error.

### Fallback values
**Introduced 3.7.0**
{: .label .label-purple }

You can specify a fallback value for a variable that may not exist. The fallback can be either a literal value or another variable.

In the following examples, the `notexists` attribute is not defined and `attr1` is set to `foo`.

 Term                                           | Replacement
:-----------------------------------------------|:--------------
 `${attr.proxy.notexists:-bar}`                 | `bar`
 `${attr.proxy.notexists:-${attr.proxy.attr1}}` | `foo`

## Attribute-based security

You can use roles and parameter substitution with the `terms_set` query to enable attribute-based security. In the following example, a user can read a document only if the user's `permissions` attribute contains every value in the document's `security_attributes` field.

The `security_attributes` field in the index must be of type `keyword`.
{: .note}

First, create a user and specify the user's attributes:

```json
PUT _plugins/_security/api/internalusers/user1
{
  "password": "<password>",
  "backend_roles": ["abac"],
  "attributes": {
    "permissions": "\"att1\", \"att2\", \"att3\""
  }
}
```

Then create a role that substitutes the `permissions` attribute into the DLS query:

```json
PUT _plugins/_security/api/roles/abac
{
  "index_permissions": [{
    "index_patterns": [
      "*"
    ],
    "dls": "{\"terms_set\": {\"security_attributes\": {\"terms\": [${attr.internal.permissions}], \"minimum_should_match_script\": {\"source\": \"doc['security_attributes'].length\"}}}}",
    "allowed_actions": [
      "read"
    ]
  }]
}
```

Finally, map the role to the user's backend role:

```json
PUT _plugins/_security/api/rolesmapping/abac
{
  "backend_roles": ["abac"]
}
```

## Use term-level lookup queries (TLQs) with DLS

DLS queries can contain term-level lookup queries (TLQs), such as a `terms` query that retrieves its terms from a document in another index. To learn more about OpenSearch queries, see [Term-level queries]({{site.url}}{{site.baseurl}}/query-dsl/term/index/).

The following role allows a user to read the `movies` documents in which the `genres` field contains one of the values stored in the `allowed_genres` field of the user's document in the `user-acl` index. The ID of the user's document in `user-acl` is the username:

```json
PUT _plugins/_security/api/roles/genre_acl
{
  "index_permissions": [{
    "index_patterns": [
      "movies"
    ],
    "dls": "{\"terms\": {\"genres\": {\"index\": \"user-acl\", \"id\": \"${user.name}\", \"path\": \"allowed_genres\"}}}",
    "allowed_actions": [
      "read"
    ]
  }]
}
```

The Security plugin evaluates DLS in one of two modes and automatically chooses the mode at runtime, depending on whether the DLS query contains a TLQ. The following table describes the evaluation modes.

| Evaluation mode | When used | Description |
| :--- | :--- | :--- |
| Lucene-level DLS | The DLS query doesn't contain a TLQ. | Lucene-level DLS modifies Lucene queries and data structures directly. This is the most efficient mode but does not allow certain advanced constructs in DLS queries, including TLQs. |
| Filter-level DLS | The DLS query contains a TLQ. | In this mode, OpenSearch applies DLS by modifying queries that OpenSearch receives. This allows for term-level lookup queries in DLS queries, but you can only use the `get`, `search`, `mget`, and `msearch` operations to retrieve data from the protected index. Additionally, cross-cluster searches are limited with this mode. |

## DLS and multiple roles

OpenSearch combines all DLS queries with the logical `OR` operator. However, when a role that uses DLS is combined with another security role that doesn't use DLS, the query results are filtered to display only documents matching the DLS from the first role. This filter rule also applies to roles that do not grant read documents.

### DLS and write permissions

Make sure that a user that has DLS-configured roles does not have write permissions. If write permissions are added, the user can index documents that DLS prevents them from retrieving and can delete documents that DLS hides from them.

To reject all document write operations, such as index and delete operations, for users to whom DLS, field-level security, or field masking applies on the target index, set `plugins.security.dls.write_blocked` to `true`. This setting is `false` by default. You can set it in `opensearch.yml` or update it dynamically using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/):

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.security.dls.write_blocked": true
  }
}
```
{% include copy-curl.html %}

### When to enable `plugins.security.dfm_empty_overrides_all`

When to enable the `plugins.security.dfm_empty_overrides_all` setting depends on whether you want to restrict user access to documents without DLS.

To ensure access is not restricted, you can set the following configuration in `opensearch.yml`:

```yml
plugins.security.dfm_empty_overrides_all: true
```
{% include copy.html %}

The following examples show the level of access that a user has when the user is mapped to both a role with DLS and a role without DLS. These examples can help you decide when to enable the `plugins.security.dfm_empty_overrides_all` setting.

The first example demonstrates that enabling `plugins.security.dfm_empty_overrides_all` is beneficial in scenarios where you need specific users to have unrestricted access to documents despite being part of a broader group with restricted access. Role A is granted to a broad group of users and includes DLS to restrict access to specific documents, as shown in the following permission set:

```json
{
  "index_permissions": [
    {
      "index_patterns": ["example-index"],
      "dls": "[.. some DLS here ..]",
      "allowed_actions": ["indices:data/read/search"]
    }
  ]
}
```

Role B is specifically granted to certain users, such as administrators, and does not include DLS, as shown in the following permission set:

```json
{
  "index_permissions" : [
    {
      "index_patterns" : ["*"],
      "allowed_actions" : ["indices:data/read/search"]
    }
  ]
}
```

Setting `plugins.security.dfm_empty_overrides_all` to `true` ensures that administrators assigned Role B can override any DLS restrictions imposed by Role A. This allows specific Role B users to access all documents, regardless of the restrictions applied by Role A's DLS restrictions.

The second example uses the same Role A, combined with a Role B that doesn't use DLS and only grants access to search templates:

```json
{
  "index_permissions" : [
    {
      "index_patterns" : [ "*" ],
      "allowed_actions" : [ "indices:data/read/search/template" ]
    }
  ]
}
```

When a user has both Role A and Role B permissions, the query results are filtered based on Role A's DLS, even though Role B doesn't use DLS. The DLS settings are retained, and the returned access is appropriately restricted.

When a user is assigned both Role A and Role B and the `plugins.security.dfm_empty_overrides_all` setting is enabled, Role B's permissions override Role A's restrictions, allowing that user to access all documents. This ensures that the role without DLS takes precedence in the search query response.

## Updating documents

The Security plugin rejects update operations (`POST <index>/_update/<id>`), including update operations in bulk requests, when field-level security, document-level security, or field masking is active. This applies both to partial document updates and to updates by script. To update documents, use the index operation (`PUT <index>/_doc/<id>`).
