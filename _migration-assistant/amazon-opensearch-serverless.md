---
layout: default
title: Migrate to OpenSearch Serverless
nav_order: 55
permalink: /migration-assistant/amazon-opensearch-serverless/
---

# Migrate to OpenSearch Serverless

If your target is an Amazon OpenSearch Serverless collection, this page is for you. Serverless works as a target for every source Migration Assistant supports — self-managed Elasticsearch 1.x–8.x, OpenSearch 1.x–2.x, Amazon OpenSearch Service, and Apache Solr 8.x (backfill only). The migration steps are the same as migrating to any other OpenSearch target — follow your source's playbook and plug in the Serverless-specific target configuration from this page.

| Source | Backfill | Capture and Replay |
|:-------|:--------:|:------------------:|
| Self-managed Elasticsearch 5.x–8.x | ✓ | ✓ |
| Self-managed Elasticsearch 1.x–2.x | ✓ | ✗ (not supported on this source version) |
| OpenSearch 1.x–2.x | ✓ | ✓ |
| Amazon OpenSearch Service / legacy Elasticsearch Service | ✓ | ✓ |
| Apache Solr 8.x | ✓ | ✗ (Solr does not support C&R) |

## Collection types

AOSS collections come in three types. Migration Assistant auto-detects the collection type and adjusts behavior accordingly.

| Collection type | Document IDs |
|:---------------|:------------|
| **SEARCH** | Preserves source document IDs |
| **TIMESERIES** | Server-generated IDs (source IDs not preserved) |
| **VECTORSEARCH** | Server-generated IDs (source IDs not preserved) |

If your source data relies on specific document IDs (for example, for lookups or deduplication), use a **SEARCH** collection.

When migrating to a **VECTORSEARCH** collection, `knn_vector` field mappings are automatically converted to Faiss HNSW for serverless compatibility, and `model_id` references are removed (serverless does not support training APIs).

## Connecting your collection to Migration Assistant

Two things are required for Migration Assistant to access your AOSS collection:

1. The migration IAM role must have `aoss:APIAccessAll` in its IAM policy (the EKS deployment handles this automatically)
2. The migration IAM role must be listed as a **principal** in your collection's **data access policy** (you must configure this)

### Step 1: Find the migration role ARN

The EKS deployment creates a role named `<eks-cluster-name>-migrations-role`. Find it with:

```bash
aws iam list-roles --query "Roles[?contains(RoleName,'migrations-role')].{Name:RoleName,Arn:Arn}" --output table
```
{% include copy.html %}

### Step 2: Update your collection's data access policy

Add the migration role as a principal in your collection's data access policy. The role needs both collection-level and index-level permissions.

**Using the AWS CLI:**

```bash
aws opensearchserverless create-access-policy \
  --name migration-access \
  --type data \
  --policy '[{
    "Rules": [
      {
        "ResourceType": "collection",
        "Resource": ["collection/<COLLECTION-NAME>"],
        "Permission": [
          "aoss:CreateCollectionItems",
          "aoss:DeleteCollectionItems",
          "aoss:UpdateCollectionItems",
          "aoss:DescribeCollectionItems"
        ]
      },
      {
        "ResourceType": "index",
        "Resource": ["index/<COLLECTION-NAME>/*"],
        "Permission": [
          "aoss:CreateIndex",
          "aoss:DeleteIndex",
          "aoss:UpdateIndex",
          "aoss:DescribeIndex",
          "aoss:ReadDocument",
          "aoss:WriteDocument"
        ]
      }
    ],
    "Principal": ["<MIGRATION-ROLE-ARN>"]
  }]'
```
{% include copy.html %}

Replace `<COLLECTION-NAME>` with your collection name and `<MIGRATION-ROLE-ARN>` with the ARN from Step 1.

If your collection already has a data access policy, use `update-access-policy` instead to add the migration role to the existing Principal list. See [Data access control for Amazon OpenSearch Serverless](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless-data-access.html) for details.
{: .note }

### Step 3: Configure the workflow

Configure your AOSS collection as the target in your workflow configuration. The key difference from a managed OpenSearch Service target is `service: aoss` (instead of `service: es`):

```bash
workflow configure edit
```
{% include copy.html %}

Set the target cluster:

```json
{
  "targetClusters": {
    "target": {
      "endpoint": "https://<collection-id>.<region>.aoss.amazonaws.com",
      "authConfig": {
        "sigv4": {
          "region": "<region>",
          "service": "aoss"
        }
      }
    }
  }
}
```
{% include copy.html %}

Then follow the standard workflow: [Workflow CLI getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/).

## Per-source playbooks

- **Self-managed / third-party Elasticsearch or OpenSearch** — Follow the [Elasticsearch 6.8 → OpenSearch 3.5 playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3/), then replace the target cluster block with the AOSS snippet above.
- **Amazon OpenSearch Service / legacy Elasticsearch Service** — Follow the [Amazon OpenSearch Service → Amazon OpenSearch Serverless playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-amazon-opensearch-service-to-serverless/).
- **Apache Solr** — Follow the [Apache Solr 8.11 → OpenSearch 3.5 playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-solr-8.11-to-opensearch-3/), then replace the target cluster block with the AOSS snippet above.
