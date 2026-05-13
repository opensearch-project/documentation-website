---
layout: default
title: API keys
parent: Access control
nav_order: 126
---

# API keys
**Introduced 3.7**
{: .label .label-purple }

API keys allow security admins to create long-lived, scoped tokens for programmatic access to OpenSearch. Each key carries its own permissions and authenticates via the `Authorization: ApiKey <token>` header, without requiring a username and password.

## Use cases

- CI/CD pipelines that need to index data or run queries
- Monitoring agents that poll cluster health
- Automation scripts with least-privilege access
- Service-to-service communication

## How it works

1. An admin creates a key via the REST API or OpenSearch Dashboards, specifying permissions and a duration.
2. The plaintext token (prefixed with `os_`) is returned **once** and never stored.
3. Clients include the token in the `Authorization: ApiKey <token>` header.
4. The security plugin hashes the incoming token (SHA-256), looks it up in an in-memory cache, and evaluates permissions.
5. Admins can list all keys and revoke them at any time. Revocation is immediate.

## Limitations

- Only security admins can create, list, and revoke API keys (v1).
- API keys **cannot** access system indices (`.opensearch_security*`) or protected indices.
- API keys **cannot** call security REST API endpoints.
- The `indices:data/write/bulk` action is evaluated as a cluster-level permission. If your key needs to index documents, include `indices:data/write/bulk` in the cluster permissions or use a cluster action group that covers it.

## Configuration

Enable API keys in `config/opensearch-security/config.yml` under `config.dynamic`:

```yaml
config:
  dynamic:
    api_tokens:
      enabled: true
      max_duration_seconds: 7776000   # 90 days (maximum)
      max_tokens: 100                 # Maximum outstanding tokens
```

After editing the file, apply the configuration:

```bash
bash tools/securityadmin.sh -cd config/opensearch-security/ -icl -nhnv
```

## Creating an API key

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

The response includes the plaintext token:

```json
{
  "id": "abc123",
  "token": "os_VNsOYN6kDoIgyrD_sBX2jmEIdfcnK5h9zq4u8ddjn8U"
}
```

{: .warning }
Copy the token immediately. It is not stored and cannot be retrieved again.

## Using an API key

Include the token in the `Authorization` header:

```bash
curl -k -H "Authorization: ApiKey os_VNsOYN6kDoIgyrD_sBX2jmEIdfcnK5h9zq4u8ddjn8U" \
  https://localhost:9200/_cluster/health
```

## Listing API keys

```bash
curl -k -u admin:$PASSWORD https://localhost:9200/_plugins/_security/api/apitokens
```

The response includes all keys (active, expired, and revoked) with metadata such as `expires_at`, `revoked_at`, and `created_by`.

## Revoking an API key

```bash
curl -k -u admin:$PASSWORD -X DELETE \
  https://localhost:9200/_plugins/_security/api/apitokens/<id>
```

Revocation is synchronous — the key is immediately unusable across all nodes.

## Security considerations

- **Token entropy**: Tokens use 256 bits from `java.security.SecureRandom` (CSPRNG), making brute-force attacks infeasible.
- **Storage**: Only the SHA-256 hash is stored. The plaintext token is never persisted.
- **Audit logging**: Token creation and revocation are logged under the `API_TOKEN_WRITE` audit category. Authentication events show `token:<name>` as the user.
- **Cache consistency**: Revocation broadcasts synchronously to all nodes. During a network partition, the revoke request will fail and return an error. Tokens expire naturally based on `duration_seconds`.

## OpenSearch Dashboards

If the security dashboards plugin is installed, admins can manage API keys from the **Security > API Keys** page. Enable it in `opensearch_dashboards.yml`:

```yaml
opensearch_security.api_keys.enabled: true
```

The UI supports creating keys with cluster and index permissions, selecting expiration presets, and revoking keys.
