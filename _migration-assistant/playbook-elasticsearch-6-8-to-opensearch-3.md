---
layout: default
title: "Elasticsearch 6.8 → OpenSearch 3.5"
nav_order: 1
parent: Playbooks
permalink: /migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3/
redirect_from:
  - /migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3-kubernetes/
---

# Playbook: Elasticsearch 6.8 to OpenSearch 3.5 on EKS (existing VPC)

This playbook turns a common AWS migration pattern into one concrete runbook: moving from a self-managed Elasticsearch 6.8 cluster running on Amazon EKS to Amazon OpenSearch Service 3.5, with Migration Assistant deployed into an existing VPC.

This is a pattern many customers follow as they move from a self-managed search cluster with self-managed plugins, self-signed certificates, and application-owned credentials to a more managed target with VPC isolation, IAM-based access, and less day-2 operational burden.

The playbook is intentionally end-to-end. It includes source preparation, EKS deployment, workflow configuration, pilot migration, full migration, validation, cutover, and cleanup.

## What this playbook assumes

- your source Elasticsearch 6.8 cluster already exists
- your target OpenSearch Service 3.5 domain already exists
- you want to deploy Migration Assistant on Amazon EKS into an existing VPC
- your source cluster is self-managed and reachable from that VPC

If your environment differs, use this as the primary path and adapt the network and identity details as needed.

## Example placeholders used below

Replace these with values from your environment:

| Placeholder | Meaning |
|:------------|:--------|
| `<ACCOUNT_ID>` | AWS account ID hosting the migration environment |
| `<REGION>` | AWS Region such as `us-east-2` |
| `<STAGE>` | Deployment label such as `dev` or `prod` |
| `<YOUR_VPC_ID>` | Existing VPC where Migration Assistant will be deployed |
| `<SUBNET_1>,<SUBNET_2>` | At least two subnets in different Availability Zones |
| `<SOURCE_ENDPOINT>` | Elasticsearch endpoint or NLB DNS name |
| `<TARGET_DOMAIN_NAME>` | OpenSearch Service domain name |
| `<TARGET_DOMAIN_ENDPOINT>` | OpenSearch Service domain endpoint |
| `<PILOT_INDEX_NAME>` | A small noncritical index for the pilot run |

## Estimated timing

| Phase | Typical duration |
|:------|:-----------------|
| Source preparation (plugin, S3 access, snapshot repo) | 15 to 25 minutes |
| Deploy Migration Assistant on EKS | 15 to 25 minutes |
| Build config and test connectivity | 5 to 10 minutes |
| Pilot migration | 15 to 20 minutes |
| Full backfill-only migration | Depends on data size and target ingest capacity |
| Full zero-downtime migration | Backfill duration plus replay catch-up time |

For zero-downtime migrations, replay catch-up time depends on how much traffic accumulated during backfill and the `speedupFactor` you choose for the replayer. In practice, customers often start around `1.5` to `2.0` and then validate whether the target can absorb that pace safely.

## Before you start

### Source cluster requirements

Your source cluster should meet all of the following:

- it is reachable from the VPC where Migration Assistant will run
- you know the source endpoint
- you know the source authentication method
- it can write snapshots to S3
- it contains the `repository-s3` plugin

If the source uses self-signed certificates, plan to set `allowInsecure: true` in the workflow config.

### Target cluster requirements

Your Amazon OpenSearch Service 3.5 domain should meet all of the following:

- it already exists
- it is reachable from the same VPC, or routable from that VPC
- you know the domain endpoint
- if fine-grained access control is enabled, the Migration Assistant IAM role will be mapped with sufficient permissions

### Infrastructure requirements

- an existing VPC ID
- at least two subnets in different Availability Zones
- AWS CLI v2 and `kubectl`, or AWS CloudShell
- permissions to deploy EKS, CloudFormation, IAM, S3, and OpenSearch resources

If any of the above is missing, prepare it first.
{: .warning }

## Step 1: Choose the migration style

Pick one path before you touch the workflow.

### Option A: Planned downtime

1. Pause writes to Elasticsearch.
2. Create a snapshot.
3. Migrate metadata.
4. Backfill documents.
5. Validate the target.
6. Point clients to OpenSearch.

If you are not sure which path to choose, choose planned downtime first. It is simpler and lower risk.
{: .note }

### Option B: Zero downtime

1. Start capture first.
2. Route clients to the capture proxy.
3. Create a snapshot.
4. Migrate metadata.
5. Backfill documents.
6. Replay captured traffic until the target catches up.
7. Validate the target.
8. Switch clients to OpenSearch.

If your application depends on auto-generated document IDs, do not assume capture and replay will behave the way you want. Validate that path carefully before choosing zero downtime.

## Step 2: Prepare the source cluster

### Verify or install the `repository-s3` plugin

Migration Assistant uses snapshots for backfill, so the source must support S3 snapshots.

Check the current plugin state:

```bash
curl -sk -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> https://<SOURCE_ENDPOINT>:9200/_cat/plugins?v
```
{% include copy.html %}

If `repository-s3` is missing and your source is running in Kubernetes, a common pattern is to install it through an init container so it persists across pod restarts:

```bash
kubectl patch statefulset elasticsearch-master -n elasticsearch --type=strategic -p '{
  "spec": {
    "template": {
      "spec": {
        "initContainers": [
          {
            "name": "install-plugins",
            "image": "docker.elastic.co/elasticsearch/elasticsearch:6.8.22",
            "command": ["sh", "-c", "bin/elasticsearch-plugin install --batch repository-s3 && cp -r /usr/share/elasticsearch/plugins/* /plugins/"],
            "volumeMounts": [{"name": "plugins", "mountPath": "/plugins"}]
          }
        ],
        "containers": [
          {
            "name": "elasticsearch",
            "volumeMounts": [
              {"name": "plugins", "mountPath": "/usr/share/elasticsearch/plugins"}
            ]
          }
        ],
        "volumes": [
          {"name": "plugins", "emptyDir": {}}
        ]
      }
    }
  }
}'
```
{% include copy.html %}

Then wait for the rollout:

```bash
kubectl rollout status statefulset/elasticsearch-master -n elasticsearch --timeout=300s
```
{% include copy.html %}

Verify that the plugin is now loaded:

```bash
curl -sk -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> https://<SOURCE_ENDPOINT>:9200/_cat/plugins?v
```
{% include copy.html %}

### Give the source cluster S3 access

The source cluster needs AWS credentials to write snapshots.

One concrete approach for a self-managed Elasticsearch cluster in EKS is:

1. add S3 permissions to the IAM role used by the source environment
2. retrieve temporary credentials from the node path
3. load those credentials into the Elasticsearch keystore
4. reload secure settings

Add an inline S3 policy to the IAM role:

```bash
aws iam put-role-policy \
  --role-name <ES_EKS_NODE_ROLE_NAME> \
  --policy-name es-snapshot-s3-access \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": ["s3:ListBucket", "s3:GetBucketLocation"],
        "Resource": "arn:aws:s3:::migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>"
      },
      {
        "Effect": "Allow",
        "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
        "Resource": "arn:aws:s3:::migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>/*"
      }
    ]
  }'
```
{% include copy.html %}

Create a short-lived helper pod:

```bash
kubectl apply -f - <<'EOF'
apiVersion: v1
kind: Pod
metadata:
  name: creds-helper
  namespace: elasticsearch
spec:
  hostNetwork: true
  containers:
  - name: helper
    image: amazon/aws-cli:latest
    command: ["sh", "-c", "sleep 300"]
  restartPolicy: Never
EOF

kubectl wait --for=condition=ready pod/creds-helper -n elasticsearch --timeout=60s
```
{% include copy.html %}

Extract the temporary credentials:

```bash
ACCESS_KEY=$(kubectl exec creds-helper -n elasticsearch -- \
  sh -c 'TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"); ROLE=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/); curl -s -H "X-aws-ec2-metadata-token: $TOKEN" "http://169.254.169.254/latest/meta-data/iam/security-credentials/$ROLE" | python3 -c "import json,sys; print(json.load(sys.stdin)[\"AccessKeyId\"])"')

SECRET_KEY=$(kubectl exec creds-helper -n elasticsearch -- \
  sh -c 'TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"); ROLE=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/); curl -s -H "X-aws-ec2-metadata-token: $TOKEN" "http://169.254.169.254/latest/meta-data/iam/security-credentials/$ROLE" | python3 -c "import json,sys; print(json.load(sys.stdin)[\"SecretAccessKey\"])"')

SESSION_TOKEN=$(kubectl exec creds-helper -n elasticsearch -- \
  sh -c 'TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"); ROLE=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/); curl -s -H "X-aws-ec2-metadata-token: $TOKEN" "http://169.254.169.254/latest/meta-data/iam/security-credentials/$ROLE" | python3 -c "import json,sys; print(json.load(sys.stdin)[\"Token\"])"')
```
{% include copy.html %}

Load them into the Elasticsearch keystore on each pod:

```bash
for pod in elasticsearch-master-0 elasticsearch-master-1 elasticsearch-master-2; do
  kubectl exec $pod -n elasticsearch -c elasticsearch -- \
    sh -c "echo '${ACCESS_KEY}' | bin/elasticsearch-keystore add -f s3.client.default.access_key"
  kubectl exec $pod -n elasticsearch -c elasticsearch -- \
    sh -c "echo '${SECRET_KEY}' | bin/elasticsearch-keystore add -f s3.client.default.secret_key"
  kubectl exec $pod -n elasticsearch -c elasticsearch -- \
    sh -c "echo '${SESSION_TOKEN}' | bin/elasticsearch-keystore add -f s3.client.default.session_token"
done
```
{% include copy.html %}

Reload secure settings:

```bash
curl -sk -X POST -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> \
  "https://<SOURCE_ENDPOINT>:9200/_nodes/reload_secure_settings"
```
{% include copy.html %}

Clean up the helper pod:

```bash
kubectl delete pod creds-helper -n elasticsearch --force
```
{% include copy.html %}

For long-lived production setups, prefer a durable identity approach for the source cluster rather than short-lived credential injection.
{: .note }

### Register the snapshot repository

Register a repository on the source cluster with a dedicated `base_path` for this migration:

```bash
curl -sk -X PUT -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> \
  "https://<SOURCE_ENDPOINT>:9200/_snapshot/migration-repo" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "s3",
    "settings": {
      "bucket": "migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>",
      "region": "<REGION>",
      "base_path": "es68-snapshots"
    }
  }'
```
{% include copy.html %}

Verify the repository:

```bash
curl -sk -X POST -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> \
  "https://<SOURCE_ENDPOINT>:9200/_snapshot/migration-repo/_verify?pretty"
```
{% include copy.html %}

Even though the workflow can be pointed at an externally managed snapshot, the recommended path is to let Migration Assistant create the migration snapshot for the production run. That keeps snapshot creation, metadata migration, and backfill in one repeatable workflow and makes approvals, validation, and recovery easier to reason about.
{: .note }

Use externally managed snapshots mainly for rehearsals, troubleshooting, or recovery cases.

## Step 3: Gather your VPC information

Find your VPC:

```bash
aws ec2 describe-vpcs \
  --region <REGION> \
  --query "Vpcs[*].{VpcId:VpcId,Name:Tags[?Key=='Name']|[0].Value,CidrBlock:CidrBlock}" \
  --output table
```
{% include copy.html %}

Find subnets in that VPC:

```bash
aws ec2 describe-subnets \
  --region <REGION> \
  --filters "Name=vpc-id,Values=<YOUR_VPC_ID>" \
  --query "Subnets[*].{SubnetId:SubnetId,AZ:AvailabilityZone,CidrBlock:CidrBlock,Name:Tags[?Key=='Name']|[0].Value}" \
  --output table
```
{% include copy.html %}

Choose at least two subnets in different Availability Zones.

## Step 4: Deploy Migration Assistant on EKS

Download the bootstrap script:

```bash
curl -sL -o aws-bootstrap.sh \
  "https://github.com/opensearch-project/opensearch-migrations/releases/latest/download/aws-bootstrap.sh" \
  && chmod +x aws-bootstrap.sh
```
{% include copy.html %}

Deploy into the existing VPC:

```bash
./aws-bootstrap.sh \
  --deploy-import-vpc-cfn \
  --stack-name MA \
  --stage <STAGE> \
  --vpc-id <YOUR_VPC_ID> \
  --subnet-ids <SUBNET_1>,<SUBNET_2> \
  --region <REGION>
```
{% include copy.html %}

<details>
<summary><strong>For isolated subnets</strong></summary>

If the subnets do not have direct internet egress, add the VPC endpoint flag:

```bash
./aws-bootstrap.sh \
  --deploy-import-vpc-cfn \
  --stack-name MA \
  --stage <STAGE> \
  --vpc-id <YOUR_VPC_ID> \
  --subnet-ids <SUBNET_1>,<SUBNET_2> \
  --create-vpc-endpoints \
  --region <REGION>
```
{% include copy.html %}

</details>

Verify the deployment:

```bash
aws eks update-kubeconfig --region <REGION> --name migration-eks-cluster-<STAGE>-<REGION>
kubectl get pods -n ma
```
{% include copy.html %}

All core pods should be running.

## Step 5: Confirm outputs and map target access

Read the CloudFormation outputs:

```bash
aws cloudformation describe-stacks \
  --region <REGION> \
  --stack-name MA \
  --query "Stacks[0].Outputs[?contains(OutputKey,'MigrationsExportString')].OutputValue" \
  --output text
```
{% include copy.html %}

You are looking for:

- the EKS cluster name
- the snapshot role ARN
- the migration IAM role information
- the EKS cluster security group

If your target domain uses fine-grained access control, map the Migration Assistant IAM role with sufficient permissions. One simple option is to set it as the master user:

```bash
aws opensearch update-domain-config \
  --region <REGION> \
  --domain-name <TARGET_DOMAIN_NAME> \
  --advanced-security-options '{
    "Enabled": true,
    "MasterUserOptions": {
      "MasterUserARN": "arn:aws:iam::<ACCOUNT_ID>:role/migration-eks-cluster-<STAGE>-<REGION>-migrations-role"
    }
  }'
```
{% include copy.html %}

Wait until domain processing returns `false` before continuing.

```bash
aws opensearch describe-domain \
  --region <REGION> \
  --domain-name <TARGET_DOMAIN_NAME> \
  --query "DomainStatus.Processing"
```
{% include copy.html %}

If you need to preserve an existing master-user arrangement, map the role to an appropriate backend role instead of replacing the master user.
{: .warning }

## Step 6: Allow network access

Find the EKS cluster security group:

```bash
aws eks describe-cluster \
  --region <REGION> \
  --name migration-eks-cluster-<STAGE>-<REGION> \
  --query "cluster.resourcesVpcConfig.clusterSecurityGroupId" \
  --output text
```
{% include copy.html %}

Then add inbound rules so Migration Assistant can reach the source and target:

```bash
aws ec2 authorize-security-group-ingress \
  --region <REGION> \
  --group-id <SOURCE_CLUSTER_SG> \
  --protocol tcp \
  --port 9200 \
  --source-group <MA_EKS_CLUSTER_SG>

aws ec2 authorize-security-group-ingress \
  --region <REGION> \
  --group-id <TARGET_DOMAIN_SG> \
  --protocol tcp \
  --port 443 \
  --source-group <MA_EKS_CLUSTER_SG>
```
{% include copy.html %}

If the source and target are in different VPCs, make sure routing and security policies support that path as well.

## Step 7: Connect to the Migration Console and create secrets

Open the console:

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

Check the installed version:

```bash
console --version
```
{% include copy.html %}

If the source uses basic auth, create the Kubernetes secret:

```bash
kubectl create secret generic source-credentials \
  --from-literal=username=<SOURCE_USERNAME> \
  --from-literal=password='<SOURCE_PASSWORD>' \
  -n ma
```
{% include copy.html %}

For an OpenSearch Service target using SigV4, you do not need a target credential secret. The Migration Assistant pods use AWS identity.

## Step 8: Build the pilot workflow configuration

Start from the current schema sample:

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

Use a pilot config like this:

```json
{
  "sourceClusters": {
    "source": {
      "endpoint": "https://<SOURCE_ENDPOINT>:9200",
      "allowInsecure": true,
      "version": "ES 6.8",
      "authConfig": {
        "basic": {
          "secretName": "source-credentials"
        }
      },
      "snapshotInfo": {
        "repos": {
          "migration-repo": {
            "awsRegion": "<REGION>",
            "s3RepoPathUri": "s3://migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>/es68-snapshots"
          }
        },
        "snapshots": {
          "migration-snapshot": {
            "repoName": "migration-repo",
            "config": {
              "createSnapshotConfig": {
                "indexAllowlist": ["<PILOT_INDEX_NAME>"],
                "includeGlobalState": true
              }
            }
          }
        }
      }
    }
  },
  "targetClusters": {
    "target": {
      "endpoint": "https://<TARGET_DOMAIN_ENDPOINT>",
      "authConfig": {
        "sigv4": {
          "region": "<REGION>",
          "service": "es"
        }
      }
    }
  },
  "snapshotMigrationConfigs": [
    {
      "fromSource": "source",
      "toTarget": "target",
      "perSnapshotConfig": {
        "migration-snapshot": [
          {
            "metadataMigrationConfig": {
              "indexAllowlist": ["<PILOT_INDEX_NAME>"],
              "multiTypeBehavior": "UNION"
            },
            "documentBackfillConfig": {
              "indexAllowlist": ["<PILOT_INDEX_NAME>"],
              "podReplicas": 4
            }
          }
        ]
      }
    }
  ]
}
```
{% include copy.html %}

Key points:

- the source uses HTTPS with `allowInsecure: true` because self-managed Elasticsearch on EKS often uses self-signed certificates
- the source version is `ES 6.8`
- the target uses SigV4 with service `es`
- `multiTypeBehavior: "UNION"` is a practical starting point for Elasticsearch 6.8 sources
- the pilot limits snapshot creation, metadata migration, and backfill to one small index

## Step 9: Test connectivity

Run the built-in checks:

```bash
console clusters connection-check
console clusters curl source -- "/"
console clusters curl target -- "/"
```
{% include copy.html %}

Both source and target should connect successfully. If the target returns `403`, the target IAM mapping is not finished.

## Step 10: Run the pilot migration

Submit the workflow:

```bash
workflow submit
workflow manage
```
{% include copy.html %}

Use `workflow manage` as the primary interface. If approvals appear, validate the output and approve them there, or use the CLI directly:

```bash
workflow approve "*.evaluateMetadata"
workflow approve "*.migrateMetadata"
```
{% include copy.html %}

After the pilot completes, validate the target:

```bash
console clusters curl target -- "/_cat/indices?v"
console clusters curl target -- "/<PILOT_INDEX_NAME>/_mapping"
console clusters curl target -- "/<PILOT_INDEX_NAME>/_count"
console clusters curl target -- "/<PILOT_INDEX_NAME>/_search?size=5&pretty"
```
{% include copy.html %}

Do not start the full migration until the pilot looks clean.
{: .note }

## Step 11: Run the full migration

Edit the config and widen the scope:

```bash
workflow configure edit
```
{% include copy.html %}

For a full-cluster backfill-only run, the migration sections usually become:

```json
"config": {
  "createSnapshotConfig": {
    "indexAllowlist": [],
    "includeGlobalState": true
  }
}
```

```json
"metadataMigrationConfig": {
  "indexAllowlist": [],
  "multiTypeBehavior": "UNION"
}
```

```json
"documentBackfillConfig": {
  "indexAllowlist": [],
  "podReplicas": 4
}
```
{% include copy.html %}

An empty metadata or RFS `indexAllowlist` means "all eligible indexes from the snapshot".

### Planned downtime path

1. Stop writes to Elasticsearch.
2. Submit the workflow.
3. Monitor and approve gates as needed.
4. Validate the target.
5. Recreate anything Migration Assistant does not move automatically, such as security configuration, ISM or ILM, dashboards, pipelines, and cluster tuning.
6. Point clients to the target.
7. Resume writes.

### Zero-downtime path

Add a traffic section so the workflow creates the capture proxy and replayer:

```json
"traffic": {
  "proxies": {
    "capture": {
      "source": "source",
      "proxyConfig": {
        "listenPort": 9200,
        "podReplicas": 2,
        "internetFacing": false
      }
    }
  },
  "replayers": {
    "replay": {
      "fromProxy": "capture",
      "toTarget": "target",
      "dependsOnSnapshotMigrations": [
        {
          "source": "source",
          "snapshot": "migration-snapshot"
        }
      ],
      "replayerConfig": {
        "podReplicas": 2,
        "speedupFactor": 2.0
      }
    }
  }
}
```
{% include copy.html %}

If you want the proxy exposed outside the VPC-managed private path, set `internetFacing: true` before submitting instead of patching the Service after the fact.

Then:

1. submit the workflow
2. wait for the capture proxy Service to appear
3. route clients to the proxy before the snapshot/backfill window begins
4. let snapshot, metadata migration, and backfill run
5. wait for replay to catch up
6. validate the target
7. switch clients from the proxy to the final target endpoint

Find the proxy endpoint:

```bash
kubectl get svc -n ma
```
{% include copy.html %}

Replay catch-up time depends on the backlog created during backfill and the configured `speedupFactor`.

## Step 12: Validate and cut over

At minimum, validate:

- target cluster health
- target index list
- document counts
- representative search results
- mapping behavior for migrated multi-type data

Useful commands:

```bash
console clusters curl source -- "/_cat/indices?v"
console clusters curl target -- "/_cat/indices?v"
console clusters curl target -- "/_cat/aliases?v"
console clusters curl target -- "/_cluster/health"
```
{% include copy.html %}

<details>
<summary><strong>Optional: advanced validation on EKS</strong></summary>

On EKS, you can go further by reviewing replay and comparison telemetry in CloudWatch. A practical pattern is to inspect:

- replay heartbeat logs to confirm catch-up is progressing
- `tupleComparison` metrics to compare source and target response behavior
- target-side errors for write mismatches

This is especially useful during zero-downtime migrations where you want more than a simple document-count comparison.

</details>

When the target looks correct, point clients directly to the OpenSearch Service domain endpoint.

## Step 13: Keep the source available as fallback

Do not tear down the source immediately after cutover.

Keep it available long enough to confirm:

- production traffic is stable on the target
- application error rates are normal
- dashboards and operational tooling behave correctly
- no client is still pointing at the capture proxy

A 24 to 72 hour fallback window is a practical default.

## Step 14: Remove migration infrastructure

Only clean up after the rollback window has passed.

Remove the Helm release and namespace:

```bash
helm uninstall -n ma ma
kubectl -n ma delete pvc --all
kubectl delete namespace ma --timeout=120s
```
{% include copy.html %}

Delete the CloudFormation stack:

```bash
aws cloudformation delete-stack --region <REGION> --stack-name MA
aws cloudformation wait stack-delete-complete --region <REGION> --stack-name MA
```
{% include copy.html %}

This removes the Migration Assistant EKS environment. It does not remove your source cluster, target domain, or snapshot data automatically.

If you no longer need the snapshot bucket:

```bash
aws s3 rb s3://migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION> --force
```
{% include copy.html %}

## Troubleshooting

### Bootstrap fails during CloudFormation

```bash
aws cloudformation describe-stacks --region <REGION> --stack-name MA --query "Stacks[0].StackStatus"
```
{% include copy.html %}

If the stack is in `ROLLBACK_COMPLETE` or `CREATE_FAILED`, delete it and rerun the bootstrap script.

### Bootstrap fails after CloudFormation but before a healthy Helm deployment

Rerun the bootstrap script with:

```bash
./aws-bootstrap.sh --skip-cfn-deploy --stage <STAGE> --region <REGION>
```
{% include copy.html %}

### Target returns `403`

The Migration Assistant IAM role is not mapped with sufficient permissions on the target domain.

### Snapshot creation fails with `ExpiredToken`

Refresh the source-side S3 credentials and reload secure settings:

```bash
curl -sk -X POST -u <SOURCE_USERNAME>:<SOURCE_PASSWORD> \
  "https://<SOURCE_ENDPOINT>:9200/_nodes/reload_secure_settings"
```
{% include copy.html %}

### Pilot succeeds from the console, but the workflow fails later

This usually points to a difference between console access and workflow-pod access. On EKS, verify the right service accounts have the required AWS identity and network access.

## Related guides

- [Choose your deployment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/)
- [Workflow CLI getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/)
- [Troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/)
- [Migrate metadata]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/)
