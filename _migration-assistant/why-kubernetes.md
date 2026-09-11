---
layout: default
title: Why Kubernetes?
nav_order: 12
permalink: /migration-assistant/why-kubernetes/
redirect_from:
  - /migration-assistant/why-kubernetes-and-eks/
---

# Why Kubernetes

Migration Assistant is a platform-agnostic migration tool that runs on Kubernetes, so it can run anywhere, is easy to repeat and operate, and fits into modern platform teams.

Migration Assistant follows three principles:

1. **Declare the migration once** in workflow configuration instead of manually chaining long-lived infrastructure.
2. **Let Kubernetes run the work** so migration tasks can be created, retried, scaled, and cleaned up as normal platform workloads.
3. **Use a managed Kubernetes path in production** because it configures the cloud services and permissions that you typically need anyway.

## Kubernetes benefits

Kubernetes serves as the platform layer that makes Migration Assistant more predictable. Running Migration Assistant on Kubernetes provides the following benefits:

- **Repeatable execution**: The same workflow can be run again after configuration changes or environment changes.
- **Short-lived migration workers**: Backfill, replay, validation, and support components run as pods instead of as permanently managed services.
- **Better failure recovery**: Kubernetes and Argo Workflows can restart work, preserve status, and make failures visible in a consistent way.
- **Clear separation of concerns**: You define the migration, while the platform manages pod scheduling, service networking, logs, and resource lifecycle.
- **Portability**: The same migration engine runs on any production Kubernetes platform---self-managed Kubernetes or a managed service such as Amazon EKS or Google Kubernetes Engine (GKE)---so you are not locked into one environment.

## Why deploy infrastructure for a migration

Production migrations are long-running, stateful operations that require durable infrastructure. The infrastructure that Migration Assistant deploys supports the requirements of moving data at scale:

- **Checkpoint and resume**: If a backfill worker fails during processing, it resumes from its last checkpoint rather than restarting from the beginning.
- **Approval gates**: Production migrations require human decision points between phases, such as verifying metadata before starting backfill or confirming document counts before switching traffic. The workflow engine holds state between these gates indefinitely.
- **Parallel workers with coordination**: Reindex-from-Snapshot distributes work across multiple workers. Kubernetes manages scheduling, scaling, and restarting failed workers automatically.
- **Persistent traffic capture**: Zero-downtime migrations require Kafka to buffer live traffic continuously between the capture proxy and the Replayer. This cannot run transiently.
- **Built-in observability**: When an issue occurs on day four of a migration, logs, metrics, and workflow state are available for diagnosis without additional setup.
- **Repeatability**: The same Helm chart and workflow configuration that ran a pilot migration can run the production migration without manual reconfiguration.

For small datasets where restarting from the beginning is acceptable, a simpler approach may suffice. For production migrations with uptime requirements, the infrastructure is what turns a fragile manual process into an operation that can run unattended and recover from failures automatically.

## Managed-cloud paths

If you want a production deployment on a managed cloud, a provider-specific path provides the most value with the least platform work. Each path does more than "run Kubernetes on that cloud"; it supplies a ready-made operating model for Migration Assistant.

### Amazon EKS on AWS

On AWS, the Amazon EKS path provides:

- **Bootstrap automation**: Deploy into a new VPC or an existing VPC with the bootstrap script.
- **AWS identity configuration**: Pod identity is configured for the service accounts that need AWS access.
- **Private image support**: The bootstrap path can mirror images and charts to private Amazon ECR for isolated environments.
- **Snapshot helpers**: The deployment supplies a default bucket configuration and snapshot role configuration.
- **AWS-native observability**: Logs, metrics, and Amazon CloudWatch dashboards are integrated into the deployment.
- **AWS-aware scheduling defaults**: Karpenter node pools and Amazon EBS-backed storage defaults are preconfigured for the platform.

For details, see [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/).

### GKE on GCP

On Google Cloud Platform (GCP), a Terraform module for the GKE path provides:

- **Cluster provisioning**: Deploy a GKE Standard cluster into a new VPC or an existing VPC.
- **GCP identity configuration**: Workload Identity is configured for the service accounts that need GCP access, so pods authenticate without long-lived keys.
- **Private networking options**: The source, target, snapshot, and control-plane legs can each be made private with Private Service Connect, VPC peering, and Private Google Access.
- **Snapshot helpers**: The module provisions a Cloud Storage bucket and the access bindings that snapshots need.
- **Secure defaults**: Private nodes with Cloud NAT for outbound access, and configurable control-plane authorized ranges.

For details, see [Deploy on Google Kubernetes Engine (GKE)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-gke/).

In both cases, this means less time building supporting infrastructure and more time validating the migration itself.

## Other Kubernetes

Another Kubernetes platform is a valid option when:

- You already have a Kubernetes platform that your team operates.
- Your migration is not centered on a managed-cloud service.
- You are doing local development or evaluation.
- You want to bring your own logging, storage, registry, and workload-identity model.

All options use the same migration engine. On another Kubernetes platform, you configure the platform integrations yourself. On a managed-cloud path, the tooling configures them for you.

## Related documentation

- If you are looking for the older ECS model, see the [classic Migration Assistant documentation]({{site.url}}{{site.baseurl}}/classic/migration-assistant/).
