---
layout: default
title: "Playbook: Amazon OpenSearch/Elasticsearch Service → Serverless"
nav_order: 14
permalink: /migration-assistant/playbook-amazon-opensearch-service-to-serverless/
---

# Playbook: Amazon OpenSearch Service or Elasticsearch Service → OpenSearch Serverless

This playbook assumes **Migration Assistant is already deployed** on Kubernetes or Amazon EKS and that **AWS has already provisioned**:

- A **source** domain: Amazon OpenSearch Service or legacy **Amazon Elasticsearch Service** (for example **Elasticsearch 7.10.2**).
- A **target** **OpenSearch Serverless** collection.
- An **S3 bucket** usable as a snapshot repository for the source domain, plus IAM roles as required by AWS.

Provisioning domains, collections, or buckets is **out of scope** for this document; the steps below are what you configure **inside Migration Assistant** and **IAM** so the workflow can run.

## 1. Endpoints and SigV4

| Role | Typical endpoint | `authConfig.sigv4.service` |
|:-----|:-----------------|:---------------------------|
| Source managed domain | `https://search-<name>-<id>.<region>.es.amazonaws.com` | `es` |
| Target Serverless collection | `https://<collection-id>.<region>.aoss.amazonaws.com` | `aoss` |

Use the **collection endpoint** from the OpenSearch Serverless console (not the OpenSearch Service domain URL).

Both clusters use **IAM SigV4** signing. In workflow JSON, set `authConfig.sigv4` with the correct **`region`** and **`service`** (`es` vs `aoss`) for each cluster. See also the steering examples in [workflow.md](https://github.com/opensearch-project/opensearch-migrations/blob/main/kiro-cli/kiro-cli-config/steering/workflow.md) in the opensearch-migrations repo.

## 2. Migration Console identity (IRSA)

The Migration Console pod must use an **IAM role** (usually via EKS **IRSA**) that can:

- Call the **source domain** APIs (snapshot create, cluster read) as allowed by your domain access policy.
- Call **OpenSearch Serverless** data APIs on the **target collection** (see AWS documentation for data access policies and principal ARNs).
- **Read/write S3** used for snapshots if your setup expects the console or snapshot role to assume S3 access (align with how the EKS stack created `migrations-default-s3-config`).

Verify from the pod:

```bash
kubectl exec -it migration-console-0 -n ma -- aws sts get-caller-identity
```
{% include copy.html %}

## 3. Snapshot repository on the source domain

Register an S3 repository on the **source** domain following AWS documentation. For the workflow:

- Put bucket, region, and **snapshot role ARN** (if used) in the fields shown by **`workflow configure sample`** for your version.
- On EKS, snapshot-related values often come from `kubectl get configmap migrations-default-s3-config -n ma -o yaml` — see [Snapshot configuration]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/#snapshot-configuration).

`createSnapshotConfig` may need an `s3RoleArn` (or equivalent) so the managed domain can write to S3; match the field names from **`workflow configure sample`**, not a hand-rolled guess.

## 4. Serverless data access

OpenSearch Serverless denies requests unless **data access policies** allow your IAM principal. Ensure the same role the Migration Console uses (or a role it assumes) is granted **index read/write** (and any required collection permissions) on the **target collection**.

Symptom of misconfiguration: **403** or authorization errors on bulk or search against the collection endpoint while domain calls succeed.

## 5. RFS / bulk indexing and `aoss` signing

The document migration path must sign requests with service **`aoss`** for Serverless. The [DocumentsFromSnapshotMigration README](https://github.com/opensearch-project/opensearch-migrations/blob/main/DocumentsFromSnapshotMigration/README.md) documents `--target-aws-service-signing-name` (`es` vs `aoss`). Workflow-driven migrations should apply the same distinction via the **target cluster** `authConfig` in your JSON (as generated or validated by your release’s schema).

## 6. Example workflow shape (illustrative)

Always derive the final JSON from **`workflow configure sample --load`** on your cluster. Conceptually:

- **sourceClusters.\***.endpoint** → managed domain URL, **version** such as `ES 7.10`, **authConfig.sigv4** with `service: "es"`, **snapshotRepos** pointing at your S3 repo.
- **targetClusters.\***.endpoint** → Serverless collection URL, **authConfig.sigv4** with `service: "aoss"`.
- **migrationConfigs** → include `createSnapshotConfig`, `snapshotConfig`, and `migrations` with `metadataMigrationConfig` and `documentBackfillConfig` as required (see [Getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/)).

## 7. Operational checklist

- [ ] `console clusters connection-check` succeeds for both endpoints.
- [ ] Snapshot repository registered on source; test snapshot from domain UI or API if possible.
- [ ] Serverless data access policy includes the console IAM role.
- [ ] S3 bucket policy and snapshot role trust match AWS requirements for the source domain.
- [ ] Start with a **narrow** `indexAllowlist` (or equivalent) before full migration.

## 8. Verifying in a specific AWS account

To run this against a dedicated account (for example internal testing in **us-east-2**), refresh credentials the way your organization requires (for example **Isengard** / **`ada`**) before `aws eks update-kubeconfig` and `kubectl`. Without valid credentials, only configuration review and dry runs inside the repo are possible.

## See also

- [Migration paths]({{site.url}}{{site.baseurl}}/migration-assistant/migration-paths/)
- [Workflow CLI getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/)
- [Elasticsearch 6.8 → OpenSearch 3.x (Kubernetes) playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3-kubernetes/)
