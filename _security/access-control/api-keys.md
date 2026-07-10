---
layout: default
title: API keys
parent: Access control
nav_order: 126
---

# API keys
**Introduced 3.7**
{: .label .label-purple }

API keys allow security administrators to create long-lived, scoped tokens for programmatic access to OpenSearch. Each key carries its own permissions and authenticates using the `Authorization: ApiKey <token>` header, without requiring a username and password.

API keys are useful in the following scenarios:

- CI/CD pipelines that need to index data or run queries
- Monitoring agents that poll cluster health
- Automation scripts with least-privilege access
- Service-to-service communication

The following steps describe the API key authentication process:

1. You create a key using the REST API or OpenSearch Dashboards, specifying permissions and a duration.
2. The plain text token (prefixed with `os_`) is returned **once** and never stored.
3. Clients include the token in the `Authorization: ApiKey <token>` header.
4. The Security plugin hashes the incoming token using SHA-256, searches for it in an in-memory cache, and evaluates permissions.

You can list all keys and revoke them at any time. Revocation is immediate.

## Security considerations

The following security properties apply to API keys:

- Tokens are generated using a cryptographically secure random number generator, making brute-force attacks not feasible.
- Only the SHA-256 hash is stored. The plain-text token is never persisted.
- Token creation and revocation are logged under the `API_TOKEN_WRITE` audit category. Authentication events show `token:<name>` as the user.
- Revocation is broadcast synchronously to all nodes. During a network partition, the revoke request fails and returns an error. Tokens expire automatically based on `duration_seconds`.

## Limitations

- Only security administrators can create, list, and revoke API keys.
- Requests authenticated with an API key cannot access system indexes (`.opensearch_security*`) or protected indexes.
- Requests authenticated with an API key cannot call Security API endpoints.
- The `indices:data/write/bulk` action is evaluated as a cluster-level permission. To index documents using an API key, include `indices:data/write/bulk` in the cluster permissions or use a cluster action group that includes it.

## Configuring API keys

Enable API keys in `config/opensearch-security/config.yml` under `config.dynamic`:

```yaml
config:
  dynamic:
    api_tokens:
      enabled: true
      max_duration_seconds: 7776000   # 90 days (maximum)
      max_tokens: 100                 # Maximum outstanding tokens
```
{% include copy.html %}

After editing the file, apply the configuration:

```bash
bash tools/securityadmin.sh -cd config/opensearch-security/ -icl -nhnv
```
{% include copy.html %}

## Creating an API key

The following request creates an API key with cluster monitoring and bulk write permissions for indexes matching `logs-*`:

```bash
curl -k -u admin:$PASSWORD -X POST https://localhost:9200/_plugins/_security/api/apitokens \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "my-pipeline-key",
    "cluster_permissions": ["cluster_monitor", "indices:data/write/bulk"],
    "index_permissions": [
      {
        "index_pattern": ["logs-*"],
        "allowed_actions": ["indices_all"]
      }
    ],
    "duration_seconds": 2592000
  }'
```
{% include copy.html %}

The response includes the plain-text token:

```json
{
  "id": "abc123",
  "token": "os_VNsOYN6kDoIgyrD_sBX2jmEIdfcnK5h9zq4u8ddjn8U"
}
```

Copy the token immediately. It is not stored and cannot be retrieved again.
{: .warning }

## Using an API key

To use an API key, include the token in the `Authorization` header:

```bash
curl -k -H "Authorization: ApiKey os_VNsOYN6kDoIgyrD_sBX2jmEIdfcnK5h9zq4u8ddjn8U" \
  https://localhost:9200/_cluster/health
```
{% include copy.html %}

## Listing API keys

To list all available API keys, send the following request:

```bash
curl -k -u admin:$PASSWORD https://localhost:9200/_plugins/_security/api/apitokens
```
{% include copy.html %}

The response includes all keys (active, expired, and revoked) with metadata such as `expires_at`, `revoked_at`, and `created_by`.

## Revoking an API key

To revoke an API key, send a `DELETE` request containing the key ID:

```bash
curl -k -u admin:$PASSWORD -X DELETE \
  https://localhost:9200/_plugins/_security/api/apitokens/<id>
```
{% include copy.html %}

Revocation is synchronous: the key is immediately unusable across all nodes.

## Managing API keys in OpenSearch Dashboards

If the Security Dashboards plugin is installed, you can manage API keys from the **Security** > **API Keys** page. You can create keys with cluster and index permissions, select expiration presets, and revoke keys.

To enable managing API keys in OpenSearch Dashboards, add the following line to `opensearch_dashboards.yml`:

```yaml
opensearch_security.api_keys.enabled: true
```
{% include copy.html %}
