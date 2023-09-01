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
`audit_category` | The audit log category. FAILED_LOGIN, MISSING_PRIVILEGES, BAD_HEADERS, SSL_EXCEPTION, OPENSEARCH_SECURITY_INDEX_ATTEMPT, AUTHENTICATED, or GRANTED_PRIVILEGES.
`audit_node_id ` | The ID of the node where the event was generated.
`audit_node_name` | The name of the node where the event was generated.
`audit_node_host_address` | The host address of the node where the event was generated.
`audit_node_host_name` | The host name of the node where the event was generated.
`audit_request_layer` | The layer on which the event has been generated, either TRANSPORT or REST.
`audit_request_origin` | The layer from which the event originated, either TRANSPORT or REST.
`audit_request_effective_user_is_admin` | True if the request was made with a TLS admin certificate, otherwise false.


## REST FAILED_LOGIN attributes

Name | Description
:--- | :---
`audit_request_effective_user` | The username that failed to authenticate.
`audit_rest_request_path` | The REST endpoint URI.
`audit_rest_request_params` | The HTTP request parameters, if any.
`audit_rest_request_headers` | The HTTP headers, if any.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).


## REST AUTHENTICATED attributes

Name | Description
:--- | :---
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_rest_request_path` | The REST endpoint URI.
`audit_rest_request_params` | The HTTP request parameters, if any.
`audit_rest_request_headers` | The HTTP headers, if any.
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).


## REST SSL_EXCEPTION attributes

Name | Description
:--- | :---
`audit_request_exception_stacktrace` | The stack trace of the SSL exception.


## REST BAD_HEADERS attributes

Name | Description
:--- | :---
`audit_rest_request_path` | The REST endpoint URI.
`audit_rest_request_params` | The HTTP request parameters, if any.
`audit_rest_request_headers` | The HTTP headers, if any.
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).


## Transport FAILED_LOGIN attributes

Name | Description
:--- | :---
`audit_trace_task_id` | The ID of the request.
`audit_transport_headers` | The headers of the request, if any.
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_transport_request_type` | The type of request (e.g. `IndexRequest`).
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_trace_indices` | The index name(s) included in the request. Can contain wildcards, date patterns, and aliases. Only logged if `resolve_indices` is true.
`audit_trace_resolved_indices` | The resolved index name(s) affected by the request. Only logged if `resolve_indices` is true.
`audit_trace_doc_types` | The document types affected by the request. Only logged if `resolve_indices` is true.


## Transport AUTHENTICATED attributes

Name | Description
:--- | :---
`audit_trace_task_id` | The ID of the request.
`audit_transport_headers` | The headers of the request, if any.
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_transport_request_type` | The type of request (e.g. `IndexRequest`).
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_trace_indices` | The index name(s) included in the request. Can contain wildcards, date patterns, and aliases. Only logged if `resolve_indices` is true.
`audit_trace_resolved_indices` | The resolved index name(s) affected by the request. Only logged if `resolve_indices` is true.
`audit_trace_doc_types` | The document types affected by the request. Only logged if `resolve_indices` is true.


## Transport MISSING_PRIVILEGES attributes

Name | Description
:--- | :---
`audit_trace_task_id` | The ID of the request.
`audit_trace_task_parent_id` | The parent ID of this request, if any.
`audit_transport_headers` | The headers of the request, if any.
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_transport_request_type` | The type of request (e.g. `IndexRequest`).
`audit_request_privilege` | The required privilege of the request (for example, `indices:data/read/search`).
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_trace_indices` | The index name(s) included in the request. Can contain wildcards, date patterns, and aliases. Only logged if `resolve_indices` is true.
`audit_trace_resolved_indices` | The resolved index name(s) affected by the request. Only logged if `resolve_indices` is true.
`audit_trace_doc_types` | The document types affected by the request. Only logged if `resolve_indices` is true.


## Transport GRANTED_PRIVILEGES attributes

Name | Description
:--- | :---
`audit_trace_task_id` | The ID of the request.
`audit_trace_task_parent_id` | The parent ID of this request, if any.
`audit_transport_headers` | The headers of the request, if any.
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_transport_request_type` | The type of request (for example, `IndexRequest`).
`audit_request_privilege` | The required privilege of the request (e.g. `indices:data/read/search`).
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_trace_indices` | The index name(s) included in the request. Can contain wildcards, date patterns, and aliases. Only logged if `resolve_indices` is true.
`audit_trace_resolved_indices` | The resolved index name(s) affected by the request. Only logged if `resolve_indices` is true.
`audit_trace_doc_types` | The document types affected by the request. Only logged if `resolve_indices` is true.


## Transport SSL_EXCEPTION attributes

Name | Description
:--- | :---
`audit_request_exception_stacktrace` | The stack trace of the SSL exception.


## Transport BAD_HEADERS attributes

Name | Description
:--- | :---
`audit_trace_task_id` | The ID of the request.
`audit_trace_task_parent_id` | The parent ID of this request, if any.
`audit_transport_headers` | The headers of the request, if any.
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_transport_request_type` | The type of request (e.g. `IndexRequest`).
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_trace_indices` | The index name(s) included in the request. Can contain wildcards, date patterns, and aliases. Only logged if `resolve_indices` is true.
`audit_trace_resolved_indices` | The resolved index name(s) affected by the request. Only logged if `resolve_indices` is true.
`audit_trace_doc_types` | The document types affected by the request. Only logged if `resolve_indices` is true.


## Transport opensearch_SECURITY_INDEX_ATTEMPT attributes

Name | Description
:--- | :---
`audit_trace_task_id` | The ID of the request.
`audit_transport_headers` | The headers of the request, if any.
`audit_request_effective_user` | The username that failed to authenticate.
`audit_request_initiating_user` | The user that initiated the request. Only logged if it differs from the effective user.
`audit_transport_request_type` | The type of request (e.g. `IndexRequest`).
`audit_request_body` | The HTTP request body, if any (and if request body logging is enabled).
`audit_trace_indices` | The index name(s) included in the request. Can contain wildcards, date patterns, and aliases. Only logged if `resolve_indices` is true.
`audit_trace_resolved_indices` | The resolved index name(s) affected by the request. Only logged if `resolve_indices` is true.
`audit_trace_doc_types` | The document types affected by the request. Only logged if `resolve_indices` is true.
