---
layout: default
title: Audit log field reference
parent: Audit logs
nav_order: 130
redirect_from:
  - /security/audit-logs/field-reference/
  - /security-plugin/audit-logs/field-reference/
---

# Audit log field reference

This page contains descriptions for all audit log fields.


## Common attributes

The following attributes are logged for all event categories, independent of the layer.

Name | Description
:--- | :---
`audit_format_version` | The audit log message format version.
`audit_category` | The audit log category. Values include `FAILED_LOGIN`, `MISSING_PRIVILEGES`, `BAD_HEADERS`, `SSL_EXCEPTION`, `OPENSEARCH_SECURITY_INDEX_ATTEMPT`, `AUTHENTICATED`, `GRANTED_PRIVILEGES`, `CLUSTER_SETTINGS_CHANGED`, and `INDEX_SETTINGS_CHANGED`.
`audit_node_id ` | The ID of the node where the event was generated.
`audit_node_name` | The name of the node where the event was generated.
`audit_node_host_address` | The host address of the node where the event was generated.
`audit_node_host_name` | The host name of the node where the event was generated.
`audit_request_layer` | The layer on which the event has been generated, either TRANSPORT or REST.
`audit_request_origin` | The layer from which the event originated, either TRANSPORT or REST.
`audit_request_effective_user_is_admin` | True if the request was made with a TLS admin certificate, otherwise false.


## REST FAILED_LOGIN attributes

The following attributes are logged for the REST layer failed login events.

Name | Description
:--- | :---
`audit_request_effective_user` | The username that failed to authenticate.
`audit_rest_request_path` | The REST endpoint URI.
`audit_rest_request_params` | The HTTP request parameters, if any.
`audit_rest_request_headers` | The HTTP headers, if any.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_rest_request_method` | The HTTP request method.


## REST AUTHENTICATED attributes

The following attributes are logged for the REST layer successful authentication events.

Name | Description
:--- | :---
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_rest_request_path` | The REST endpoint URI.
`audit_rest_request_params` | The HTTP request parameters, if any.
`audit_rest_request_headers` | The HTTP headers, if any.
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_rest_request_method` | The HTTP request method.


## REST SSL_EXCEPTION attributes

The following attributes are logged for the REST layer SSL exception events.

Name | Description
:--- | :---
`audit_request_exception_stacktrace` | The stack trace of the SSL exception.


## REST BAD_HEADERS attributes

The following attributes are logged for the REST layer bad headers events.

Name | Description
:--- | :---
`audit_rest_request_path` | The REST endpoint URI.
`audit_rest_request_params` | The HTTP request parameters, if any.
`audit_rest_request_headers` | The HTTP headers, if any.
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).


## Transport FAILED_LOGIN attributes

The following attributes are logged for the transport layer failed login events.

Name | Description
:--- | :---
`audit_trace_task_id` | The ID of the request.
`audit_transport_headers` | The headers of the request, if any.
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_transport_request_type` | The request type (for example, `IndexRequest`).
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_trace_indices` | The index name(s) included in the request. Can contain wildcards, date patterns, and aliases. Only logged if `resolve_indices` is true.
`audit_trace_resolved_indices` | The resolved index name(s) affected by the request. Only logged if `resolve_indices` is true.
`audit_trace_doc_types` | The document types affected by the request. Only logged if `resolve_indices` is true.


## Transport AUTHENTICATED attributes

The following attributes are logged for the transport layer successful authentication events.

Name | Description
:--- | :---
`audit_trace_task_id` | The ID of the request.
`audit_transport_headers` | The headers of the request, if any.
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_transport_request_type` | The request type (for example, `IndexRequest`).
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_trace_indices` | The index name(s) included in the request. Can contain wildcards, date patterns, and aliases. Only logged if `resolve_indices` is true.
`audit_trace_resolved_indices` | The resolved index name(s) affected by the request. Only logged if `resolve_indices` is true.
`audit_trace_doc_types` | The document types affected by the request. Only logged if `resolve_indices` is true.


## Transport MISSING_PRIVILEGES attributes

The following attributes are logged for the transport layer missing privileges events.

Name | Description
:--- | :---
`audit_trace_task_id` | The ID of the request.
`audit_trace_task_parent_id` | The parent ID of this request, if any.
`audit_transport_headers` | The headers of the request, if any.
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_transport_request_type` | The request type (for example, `IndexRequest`).
`audit_request_privilege` | The required privilege of the request (for example, `indices:data/read/search`).
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_trace_indices` | The index name(s) included in the request. Can contain wildcards, date patterns, and aliases. Only logged if `resolve_indices` is true.
`audit_trace_resolved_indices` | The resolved index name(s) affected by the request. Only logged if `resolve_indices` is true.
`audit_trace_doc_types` | The document types affected by the request. Only logged if `resolve_indices` is true.


## Transport GRANTED_PRIVILEGES attributes

The following attributes are logged for the transport layer granted privileges events.

Name | Description
:--- | :---
`audit_trace_task_id` | The ID of the request.
`audit_trace_task_parent_id` | The parent ID of this request, if any.
`audit_transport_headers` | The headers of the request, if any.
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_transport_request_type` | The request type (for example, `IndexRequest`).
`audit_request_privilege` | The required privilege of the request (for example, `indices:data/read/search`).
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_trace_indices` | The index name(s) included in the request. Can contain wildcards, date patterns, and aliases. Only logged if `resolve_indices` is true.
`audit_trace_resolved_indices` | The resolved index name(s) affected by the request. Only logged if `resolve_indices` is true.
`audit_trace_doc_types` | The document types affected by the request. Only logged if `resolve_indices` is true.


## Transport SSL_EXCEPTION attributes

The following attributes are logged for the transport layer SSL exception events.

Name | Description
:--- | :---
`audit_request_exception_stacktrace` | The stack trace of the SSL exception.


## Transport BAD_HEADERS attributes

The following attributes are logged for the transport layer bad headers events.

Name | Description
:--- | :---
`audit_trace_task_id` | The ID of the request.
`audit_trace_task_parent_id` | The parent ID of this request, if any.
`audit_transport_headers` | The headers of the request, if any.
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_transport_request_type` | The request type (for example, `IndexRequest`).
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_trace_indices` | The index name(s) included in the request. Can contain wildcards, date patterns, and aliases. Only logged if `resolve_indices` is true.
`audit_trace_resolved_indices` | The resolved index name(s) affected by the request. Only logged if `resolve_indices` is true.
`audit_trace_doc_types` | The document types affected by the request. Only logged if `resolve_indices` is true.


## Transport opensearch_SECURITY_INDEX_ATTEMPT attributes

The following attributes are logged when a request attempts to access the OpenSearch security index.

Name | Description
:--- | :---
`audit_trace_task_id` | The ID of the request.
`audit_transport_headers` | The headers of the request, if any.
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_transport_request_type` | The request type (for example, `IndexRequest`).
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_trace_indices` | The index name(s) included in the request. Can contain wildcards, date patterns, and aliases. Only logged if `resolve_indices` is true.
`audit_trace_resolved_indices` | The resolved index name(s) affected by the request. Only logged if `resolve_indices` is true.
`audit_trace_doc_types` | The document types affected by the request. Only logged if `resolve_indices` is true.


## Transport CLUSTER_SETTINGS_CHANGED attributes

The following attributes are logged when cluster settings are changed.

Name | Description
:--- | :---
`audit_request_effective_user` | The user who made the setting change.
`audit_transport_request_type` | The request type (for example, `ClusterUpdateSettingsRequest`).
`audit_transport_action` | The transport action (for example, `cluster:admin/settings/update`).
`audit_settings_changes` | An array of setting change objects, each containing `setting`, `old_value`, `new_value`, `operation`, and `scope`. Sensitive settings are automatically redacted.

Each object in `audit_settings_changes` contains the following fields.

Name | Description
:--- | :---
`setting` | The full setting name (for example, `cluster.max_shards_per_node`).
`old_value` | The previous value of the setting, or `null` if not previously set.
`new_value` | The new value of the setting, or `null` if the setting was removed.
`operation` | Either `set` (value was assigned) or `removed` (value was reset to the default).
`scope` | Either `persistent` (survives restarts) or `transient` (lost on restart).


## Transport INDEX_SETTINGS_CHANGED attributes

The following attributes are logged when index settings are changed.

Name | Description
:--- | :---
`audit_request_effective_user` | The user who made the setting change.
`audit_transport_request_type` | The request type (for example, `UpdateSettingsRequest`).
`audit_transport_action` | The transport action (for example, `indices:admin/settings/update`).
`audit_trace_indices` | The index name(s) included in the request. Can contain wildcards and aliases.
`audit_trace_resolved_indices` | The resolved concrete index name(s) affected by the request.
`audit_settings_changes` | An array of setting change objects, each containing `setting`, `old_value`, `new_value`, `operation`, and `scope`. Sensitive settings are automatically redacted.

Each object in `audit_settings_changes` contains the following fields.

Name | Description
:--- | :---
`setting` | The full setting name (for example, `index.number_of_replicas`).
`old_value` | The previous value of the setting, or `null` if not previously set.
`new_value` | The new value of the setting, or `null` if the setting was removed.
`operation` | Either `set` (value was assigned) or `removed` (value was reset to the default).
`scope` | Always `index` for index setting changes.
