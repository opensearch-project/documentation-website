---
layout: default
title: Audit logs
nav_order: 125
has_children: true
has_toc: false
redirect_from:
  - /security/audit-logs/
canonical_url: https://docs.opensearch.org/latest/security/audit-logs/index/
---

# Audit logs

Audit logs let you track access to your OpenSearch cluster and are useful for compliance purposes or in the aftermath of a security breach. You can configure the categories to be logged, the detail level of the logged messages, and where to store the logs.

To enable audit logging:

1. Add the following line to `opensearch.yml` on each node:

   ```yml
   plugins.security.audit.type: internal_opensearch
   ```

   This setting stores audit logs on the current cluster. For other storage options, see [Audit Log Storage Types]({{site.url}}{{site.baseurl}}/security/audit-logs/storage-types/).

2. Restart each node.

After this initial setup, you can use OpenSearch Dashboards to manage your audit log categories and other settings. In OpenSearch Dashboards, choose **Security**, **Audit logs**.


---

#### Table of contents
1. TOC
{:toc}


---

## Tracked events

Audit logging records events in two ways: HTTP requests (REST) and the transport layer.

Event | Logged on REST | Logged on transport | Description
:--- | :--- | :--- | :---
`FAILED_LOGIN` | Yes | Yes | The credentials of a request could not be validated, most likely because the user does not exist or the password is incorrect.
`AUTHENTICATED` | Yes | Yes | A user successfully authenticated.
`MISSING_PRIVILEGES` | No | Yes | The user does not have the required permissions to execute the request.
`GRANTED_PRIVILEGES` | No | Yes | A user made a successful request to OpenSearch.
`SSL_EXCEPTION` | Yes | Yes | An attempt was made to access OpenSearch without a valid SSL/TLS certificate.
`opensearch_SECURITY_INDEX_ATTEMPT` | No | Yes | An attempt was made to modify the security plugin internal user and privileges index without the required permissions or TLS admin certificate.
`BAD_HEADERS` | Yes | Yes | An attempt was made to spoof a request to OpenSearch with the security plugin internal headers.

These default log settings work well for most use cases, but you can change settings to save storage space or adapt the information to your exact needs.


## Exclude categories

To exclude categories, set:

```yml
plugins.security.audit.config.disabled_rest_categories: <disabled categories>
plugins.security.audit.config.disabled_transport_categories: <disabled categories>
```

For example:

```yml
plugins.security.audit.config.disabled_rest_categories: AUTHENTICATED, opensearch_SECURITY_INDEX_ATTEMPT
plugins.security.audit.config.disabled_transport_categories: GRANTED_PRIVILEGES
```

If you want to log events in all categories, use `NONE`:

```yml
plugins.security.audit.config.disabled_rest_categories: NONE
plugins.security.audit.config.disabled_transport_categories: NONE
```


## Disable REST or the transport layer

By default, the security plugin logs events on both REST and the transport layer. You can disable either type:

```yml
plugins.security.audit.enable_rest: false
plugins.security.audit.enable_transport: false
```


## Disable request body logging

By default, the security plugin includes the body of the request (if available) for both REST and the transport layer. If you do not want or need the request body, you can disable it:

```yml
plugins.security.audit.log_request_body: false
```


## Log index names

By default, the security plugin logs all indices affected by a request. Because index names can be aliases and contain wildcards/date patterns, the security plugin logs the index name that the user submitted *and* the actual index name to which it resolves.

For example, if you use an alias or a wildcard, the audit event might look like:

```json
audit_trace_indices: [
  "human*"
],
audit_trace_resolved_indices: [
  "humanresources"
]
```

You can disable this feature by setting:

```yml
plugins.security.audit.resolve_indices: false
```

Disabling this feature only takes effect if `plugins.security.audit.log_request_body` is also set to `false`.
{: .note }


## Configure bulk request handling

Bulk requests can contain many indexing operations. By default, the security plugin only logs the single bulk request, not each individual operation.

The security plugin can be configured to log each indexing operation as a separate event:

```yml
plugins.security.audit.resolve_bulk_requests: true
```

This change can create a massive number of events in the audit logs, so we don't recommend enabling this setting if you make heavy use of the `_bulk` API.


## Exclude requests

You can exclude certain requests from being logged completely, by either configuring actions (for transport requests) and/or HTTP request paths (REST):

```yml
plugins.security.audit.ignore_requests: ["indices:data/read/*", "SearchRequest"]
```


## Exclude users

By default, the security plugin logs events from all users, but excludes the internal OpenSearch Dashboards server user `kibanaserver`. You can exclude other users:

```yml
plugins.security.audit.ignore_users:
  - kibanaserver
  - admin
```

If requests from all users should be logged, use `NONE`:

```yml
plugins.security.audit.ignore_users: NONE
```


## Configure the audit log index name

By default, the security plugin stores audit events in a daily rolling index named `auditlog-YYYY.MM.dd`. You can configure the name of the index in `opensearch.yml`:

```yml
plugins.security.audit.config.index: myauditlogindex
```

Use a date pattern in the index name to configure daily, weekly, or monthly rolling indices:

```yml
plugins.security.audit.config.index: "'auditlog-'YYYY.MM.dd"
```

For a reference on the date pattern format, see the [Joda DateTimeFormat documentation](https://www.joda.org/joda-time/apidocs/org/joda/time/format/DateTimeFormat.html).


## (Advanced) Tune the thread pool

The Search plugin logs events asynchronously, which keeps performance impact on your cluster minimal. The plugin uses a fixed thread pool to log events. You can define the number of threads in the pool in `opensearch.yml`:

```yml
plugins.security.audit.threadpool.size: <integer>
```

The default setting is `10`. Setting this value to `0` disables the thread pool, which means the plugin logs events synchronously. To set the maximum queue length per thread:

```yml
plugins.security.audit.threadpool.max_queue_len: 100000
```
