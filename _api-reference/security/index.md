---
layout: default
title: Security APIs
nav_order: 77
has_children: true
redirect_from:
  - /api-reference/security-api/
  - /api-reference/security/
---

# Security APIs

The Security plugin provides numerous REST APIs for managing its resources. These APIs are similar to the OpenSearch REST APIs and consist of HTTP requests that include the resource path, HTTP method (GET, PUT, POST, DELETE), request body, and output response fields. 

All Security APIs use the base path of `_plugins/_security/` followed by the specific path for each operation. For example, the path for the Upgrade Perform API would be `/_plugins/_security/api/_upgrade_perform`.

Many security API operations are available through both REST API calls and OpenSearch Dashboards settings. This documentation focuses on the REST APIs, which offer the most flexibility for programmatic access and automation.

## API format

Most Security APIs follow a consistent format:

```
<HTTP-METHOD> _plugins/_security/<PATH>
{
  "request": "body"
}
```

For most resource types, the APIs support standard CRUD operations:

- **Create**: PUT or POST with a request body containing the resource definition
- **Read**: GET to retrieve the current configuration 
- **Update**: PUT with a request body containing the new configuration
- **Delete**: DELETE to remove a specific resource


## Authentication

Most Security API calls require HTTP basic authentication with admin credentials. Make sure to include appropriate authentication headers in your requests.

The following example shows a basic HTTP authentication call:

```bash
curl -XGET https://localhost:9200/_plugins/_security/api/roles/ -u admin:admin -k
```

## Demo configuration

The Security plugin ships with a default demo configuration for testing purposes. This configuration should not be used in a production environment. For production deployments, you should generate secure credentials and certificates.

## Next steps

For more information about the Security plugin and security best practices, see the [security documentation]({{site.url}}{{site.baseurl}}/security/).