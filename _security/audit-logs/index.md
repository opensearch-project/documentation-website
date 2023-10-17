---
layout: default
title: Audit logs
nav_order: 125
has_children: true
has_toc: false
redirect_from:
  - /security/audit-logs/index/
  - /security-plugin/audit-logs/index/
---

# Audit logs

---

<details closed markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

Audit logs let you track access to your OpenSearch cluster and are useful for compliance purposes or in the aftermath of a security breach. You can configure the categories to be logged, the detail level of the logged messages, and where to store the logs.

To enable audit logging:

1. Add the following line to `opensearch.yml` on each node:

   ```yml
   plugins.security.audit.type: internal_opensearch
   ```

   This setting stores audit logs on the current cluster. For other storage options, see [Audit Log Storage Types]({{site.url}}{{site.baseurl}}/security/audit-logs/storage-types/).

2. Restart each node.

After this initial setup, you can use OpenSearch Dashboards to manage your audit log categories and other settings. In OpenSearch Dashboards, select **Security** and then **Audit logs**. 

An alternative is to specify initial settings for audit logging in the `audit.yml` and `opensearch.yml` files (which file depends on the setting---see [Audit log settings](#audit-log-settings)). Thereafter, you can use Dashboards or the [Audit logs]({{site.url}}{{site.baseurl}}/security/access-control/api/#audit-logs) API to manage and update settings.


## Tracked events

Audit logging records events in two ways: HTTP requests (REST) and the transport layer. The following table provides descriptions of tracked events and whether or not they are logged on the REST or transport layer.

Event | Logged on REST | Logged on transport | Description
:--- | :--- | :--- | :---
`FAILED_LOGIN` | Yes | Yes | The credentials of a request could not be validated, most likely because the user does not exist or the password is incorrect.
`AUTHENTICATED` | Yes | Yes | A user successfully authenticated.
`MISSING_PRIVILEGES` | No | Yes | The user does not have the required permissions to make the request.
`GRANTED_PRIVILEGES` | No | Yes | A user made a successful request to OpenSearch.
`SSL_EXCEPTION` | Yes | Yes | An attempt was made to access OpenSearch without a valid SSL/TLS certificate.
`opensearch_SECURITY_INDEX_ATTEMPT` | No | Yes | An attempt was made to modify the Security plugin internal user and privileges index without the required permissions or TLS admin certificate.
`BAD_HEADERS` | Yes | Yes | An attempt was made to spoof a request to OpenSearch with the Security plugin internal headers.


## Audit log settings

The following default log settings work well for most use cases. However, you can change settings to save storage space or adapt the information to your exact needs. 


### Settings in audit.yml

The following settings are stored in the `audit.yml` file.


#### Exclude categories

To exclude categories, list them in the following setting:

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


#### Disable REST or the transport layer

By default, the Security plugin logs events on both REST and the transport layer. You can disable either type:

```yml
plugins.security.audit.config.enable_rest: false
plugins.security.audit.config.enable_transport: false
```


#### Disable request body logging

By default, the Security plugin includes the body of the request (if available) for both REST and the transport layer. If you do not want or need the request body, you can disable it:

```yml
plugins.security.audit.config.log_request_body: false
```


#### Log index names

By default, the Security plugin logs all indexes affected by a request. Because index names can be aliases and contain wildcards/date patterns, the Security plugin logs the index name that the user submitted *and* the actual index name to which it resolves.

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
plugins.security.audit.config.resolve_indices: false
```

This feature is only disabled if `plugins.security.audit.config.log_request_body` is also set to `false`.
{: .note }


#### Configure bulk request handling

Bulk requests can contain many indexing operations. By default, the Security plugin only logs the single bulk request, not each individual operation.

The Security plugin can be configured to log each indexing operation as a separate event:

```yml
plugins.security.audit.config.resolve_bulk_requests: true
```

This change can create an extremely large number of events in the audit logs, so we don't recommend enabling this setting if you frequently use the `_bulk` API.


#### Exclude requests

You can exclude certain requests from being logged by configuring actions for transport requests and/or HTTP request paths (REST):

```yml
plugins.security.audit.config.ignore_requests: ["indices:data/read/*", "SearchRequest"]
```


#### Exclude users

By default, the Security plugin logs events from all users but excludes the internal OpenSearch Dashboards server user `kibanaserver`. You can exclude other users:

```yml
plugins.security.audit.config.ignore_users:
  - kibanaserver
  - admin
```

If requests from all users should be logged, use `NONE`:

```yml
plugins.security.audit.config.ignore_users: NONE
```


#### Exclude headers

You can exclude sensitive headers from being included in the logs---for example, the `Authorization:` header:

```yml
plugins.security.audit.config.exclude_sensitive_headers: true
```


### Settings in opensearch.yml

The following settings are stored in the `opensearch.yml` file.


#### Configure the audit log index name

By default, the Security plugin stores audit events in a daily rolling index named `auditlog-YYYY.MM.dd`:

```yml
plugins.security.audit.config.index: myauditlogindex
```

Use a date pattern in the index name to configure daily, weekly, or monthly rolling indexes:

```yml
plugins.security.audit.config.index: "'auditlog-'YYYY.MM.dd"
```

For a reference on the date pattern format, see the [Joda DateTimeFormat documentation](https://www.joda.org/joda-time/apidocs/org/joda/time/format/DateTimeFormat.html).


#### (Advanced) Tune the thread pool

The Search plugin logs events asynchronously, which minimizes the performance impact on your cluster. The plugin uses a fixed thread pool to log events:

```yml
plugins.security.audit.config.threadpool.size: <integer>
```

The default setting is `10`. Setting this value to `0` disables the thread pool, which means the plugin logs events synchronously. To set the maximum queue length per thread:

```yml
plugins.security.audit.config.threadpool.max_queue_len: 100000
```

