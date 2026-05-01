---
layout: default
title: "Elasticsearch 6.8 → OpenSearch 3.5"
nav_order: 1
parent: Playbooks
permalink: /migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3/
redirect_from:
  - /migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3-kubernetes/
---

# Playbook: Elasticsearch 6.8 → OpenSearch 3.5

This playbook assumes **Migration Assistant is already running** on a Kubernetes or EKS cluster and that **source and target clusters already exist** (provisioning those clusters is out of scope here). It focuses on workflow configuration and operational steps for a common path: **self-managed Elasticsearch 6.8** to **OpenSearch 3.5**.

## 1. Confirm the migration path

Your combination must appear in the [migration paths]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/) matrix (Elasticsearch 6.x → OpenSearch 3.5 is supported). Review [Assessment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/) for breaking changes.

> **Targeting Amazon OpenSearch Serverless instead?** This playbook still applies end-to-end. The only differences are the target endpoint and `authConfig.sigv4.service` value (`aoss` instead of `es`), plus a one-time AOSS data access policy. See [Migrate to OpenSearch Serverless]({{site.url}}{{site.baseurl}}/migration-assistant/amazon-opensearch-serverless/) for the target config, then return here.
{: .tip }

## 2. Elasticsearch 6.x and mapping types

Elasticsearch 6.x can still use **multiple mapping types per index**. OpenSearch 3.5 does not support that model. Metadata migration **removes type wrappers** and may require you to declare how to handle multi-type indexes and templates.

- Read [Deprecation of mapping types](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/removal-of-types.html) and the Metadata Migration discussion in the [opensearch-migrations MetadataMigration README](https://github.com/opensearch-project/opensearch-migrations/blob/main/MetadataMigration/README.md#deprecation-of-mapping-types).
- Use `workflow configure sample` and `workflow configure edit` on your Migration Console to see the **exact** metadata migration fields for your release (for example, options related to multi-type behavior). Do not copy stale field names from generic examples if your sample schema differs.

## 3. Cluster `version` strings in workflow JSON

Use values that match what your Workflow CLI / config processor expects for the installed release. Internal tests use forms such as **`ES 6.8`** for the source and a comparable **OpenSearch** label for the target (for example **`OS 3.5`** or the precise string shown in `workflow configure sample`). Always align with **`workflow configure sample`** output for your build.

## 4. Snapshot repository (S3)

For backfill from snapshot you need a repository the **source** can write to and Migration Assistant can read from:

- Register an S3 snapshot repository on the source (Elasticsearch 6.8 requires the `repository-s3` plugin and correct IAM/keys).
- In workflow config, set `snapshotRepos` (or equivalent in your schema) with `awsRegion` and `s3RepoPathUri`.
- On **EKS**, the default `ConfigMap` `migrations-default-s3-config` often supplies bucket, region, and snapshot role ARN — see [Deploying to EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/#snapshot-configuration).

## 5. Document backfill (RFS) and optional transforms

Reindex-from-snapshot may need **additional document or mapping transforms** when source Lucene layouts or types do not map 1:1 to the target. The opensearch-migrations repo documents **type-mapping sanitization** transformers (see [jsonTypeMappingsSanitizationTransformerProvider](https://github.com/opensearch-project/opensearch-migrations/blob/main/transformation/transformationPlugins/jsonMessageTransformers/jsonTypeMappingsSanitizationTransformerProvider/README.md)). For automation-heavy setups, CI uses base64-encoded transformer configs (see `vars/fullES68SourceE2ETest.groovy` in the same repo).

For your environment:

1. Start from `workflow configure sample --load`.
2. Add or adjust `documentBackfillConfig` (and any transform fields) **only as your schema allows**.
3. Run a **small index allowlist** first.

## 6. Sample workflow configuration

The following is a complete workflow configuration for an ES 6.8 → OpenSearch 3.5 migration with both backfill and live traffic capture and replay (CDC). Always start from `workflow configure sample --load` on your Migration Console and adjust — do not copy this verbatim if your schema version differs.

### Backfill only

```json
{
  "sourceClusters": {
    "source": {
      "endpoint": "http://<SOURCE_HOST>:9200",
      "allowInsecure": true,
      "version": "ES 6.8",
      "authConfig": {
        "basic": { "secretName": "source-creds" }
      },
      "snapshotRepos": {
        "migration-repo": {
          "awsRegion": "us-east-2",
          "s3RepoPathUri": "s3://<BUCKET>/snapshots"
        }
      }
    }
  },
  "targetClusters": {
    "target": {
      "endpoint": "https://<TARGET_HOST>:9200",
      "allowInsecure": true,
      "authConfig": {
        "basic": { "secretName": "target-creds" }
      }
    }
  },
  "snapshotMigrationConfigs": [
    {
      "fromSource": "source",
      "toTarget": "target",
      "snapshotExtractAndLoadConfigs": [
        {
          "createSnapshotConfig": {},
          "snapshotConfig": {
            "snapshotNameConfig": { "snapshotNamePrefix": "migration" },
            "repoName": "migration-repo"
          },
          "migrations": [
            {
              "metadataMigrationConfig": {
                "multiTypeBehavior": "UNION"
              },
              "documentBackfillConfig": {
                "podReplicas": 4
              }
            }
          ]
        }
      ]
    }
  ]
}
```
{% include copy.html %}

### Backfill + Capture and Replay (CDC)

This configuration adds live traffic capture via a proxy and replays it to the target after backfill completes:

```json
{
  "sourceClusters": {
    "source": {
      "endpoint": "http://<SOURCE_HOST>:9200",
      "allowInsecure": true,
      "version": "ES 6.8",
      "authConfig": {
        "basic": { "secretName": "source-creds" }
      },
      "snapshotRepos": {
        "migration-repo": {
          "awsRegion": "us-east-2",
          "s3RepoPathUri": "s3://<BUCKET>/snapshots"
        }
      }
    }
  },
  "targetClusters": {
    "target": {
      "endpoint": "https://<TARGET_HOST>:9200",
      "allowInsecure": true,
      "authConfig": {
        "basic": { "secretName": "target-creds" }
      }
    }
  },
  "snapshotMigrationConfigs": [
    {
      "fromSource": "source",
      "toTarget": "target",
      "snapshotExtractAndLoadConfigs": [
        {
          "createSnapshotConfig": {},
          "snapshotConfig": {
            "snapshotNameConfig": { "snapshotNamePrefix": "migration" },
            "repoName": "migration-repo"
          },
          "migrations": [
            {
              "metadataMigrationConfig": {
                "multiTypeBehavior": "UNION"
              },
              "documentBackfillConfig": {
                "podReplicas": 4
              }
            }
          ]
        }
      ]
    }
  ],
  "traffic": {
    "proxies": {
      "capture": {
        "source": "source",
        "proxyConfig": {
          "listenPort": 9200,
          "podReplicas": 2
        }
      }
    },
    "replayers": {
      "replay": {
        "fromProxy": "capture",
        "toTarget": "target",
        "dependsOnSnapshotMigrations": [
          { "source": "source", "snapshot": "migration" }
        ],
        "replayerConfig": {
          "podReplicas": 2,
          "speedupFactor": 2.0
        }
      }
    }
  }
}
```
{% include copy.html %}

With CDC enabled, the workflow:
1. Deploys the capture proxy — route client traffic to the proxy's Kubernetes Service
2. Creates a snapshot and runs backfill in parallel with traffic capture
3. After backfill completes (`dependsOnSnapshotMigrations`), starts the replayer to catch up
4. The replayer reads from the Kafka topic and replays against the target

## 7. End-to-end sequence

1. [Deploy]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/) Migration Assistant.
2. `kubectl exec` into the Migration Console; run `console clusters connection-check` for source and target.
3. `workflow configure sample --load` → `workflow configure edit` → set endpoints, auth, snapshot repo, versions, metadata options, and backfill settings.
4. Create any required Kubernetes secrets for basic auth (`kubectl create secret ...`); for SigV4, ensure the console service account has the right IAM policies.
5. `workflow submit` → `workflow manage` or `workflow status` / `workflow approve` as needed.
6. Verify with `console clusters curl` against source and target (for example `/_cat/indices?v`).

## 8. If you get stuck

- [Troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/) — snapshots, parsing, approvals, PATH inside the console pod.
- Reduce scope (one index, `skipApprovals: true` only in non-production) to isolate metadata vs backfill failures.

## See also

- [Supported migration paths]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/)
- [Workflow CLI getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/)
- [Amazon OpenSearch Service → Serverless playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-amazon-opensearch-service-to-serverless/) (managed AWS sources and targets)
