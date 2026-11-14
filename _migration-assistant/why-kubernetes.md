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

Migration Assistant follows these principles:

1. **Declare the migration once** in workflow configuration instead of manually chaining long-lived infrastructure.
2. **Let Kubernetes run the work** so migration tasks can be created, retried, scaled, and cleaned up as normal platform workloads.
3. **Use a managed Kubernetes path in production** because it configures the cloud services and permissions that a production migration requires.

## Kubernetes benefits

Kubernetes serves as the platform layer that makes Migration Assistant more predictable. Running Migration Assistant on Kubernetes provides the following benefits:

- Repeatable execution: the same workflow can be re-run after configuration or environment changes.
- Short-lived migration workers: backfill, replay, validation, and support components run as pods instead of as permanently managed services.
- Better failure recovery: Kubernetes and Argo Workflows restart work, preserve status, and surface failures in a consistent way.
- Clear separation of concerns: you define the migration, while the platform manages pod scheduling, service networking, logs, and resource lifecycle.
- Portability: the same migration engine runs on any production Kubernetes platform---self-managed Kubernetes or a managed service such as Amazon EKS or Google Kubernetes Engine (GKE)---without requiring commitment to a single environment.

## Why deploy infrastructure for a migration

Production migrations are long-running, stateful operations that require durable infrastructure. The infrastructure that Migration Assistant deploys supports the requirements of moving data at scale:

- Checkpoint and resume: if a backfill worker fails during processing, it resumes from its last checkpoint rather than restarting from the beginning.
- Approval gates: production migrations require human decision points between phases, such as verifying metadata before starting backfill or confirming document counts before switching traffic. The workflow engine holds state between these gates indefinitely.
- Parallel workers with coordination: Reindex-from-Snapshot distributes work across multiple workers. Kubernetes manages scheduling, scaling, and restarting failed workers automatically.
- Persistent traffic capture: zero-downtime migrations require Apache Kafka to buffer live traffic continuously between the capture proxy and the Traffic Replayer. Apache Kafka cannot run transiently for this purpose.
- Built-in observability: when an issue occurs on day four of a migration, logs, metrics, and workflow state are available for diagnosis without additional setup.
- Repeatability: the same Helm chart and workflow configuration that ran a pilot migration can run the production migration without manual reconfiguration.

For small datasets where restarting from the beginning is acceptable, a simpler approach may suffice. For production migrations with uptime requirements, the infrastructure is what turns a fragile manual process into an operation that can run unattended and recover from failures automatically.

## Managed cloud paths

For production deployments on managed cloud platforms, a provider-specific deployment path offers the greatest value while minimizing platform-specific setup. Each path provides more than a way to run Kubernetes on the cloud. It also establishes a ready-to-use operating environment for Migration Assistant.

### Amazon EKS on AWS

On AWS, the Amazon EKS path provides:

- Bootstrap automation: deploy into a new VPC or an existing VPC using the bootstrap script.
- AWS identity configuration: pod identity is configured for the service accounts that need AWS access.
- Private image support: the bootstrap path can copy images and charts to private Amazon ECR for isolated environments.
- Snapshot helpers: the deployment provides a default bucket configuration and snapshot role configuration.
- AWS-native observability: logs, metrics, and Amazon CloudWatch dashboards are integrated into the deployment.
- AWS-aware scheduling defaults: Karpenter node pools and Amazon EBS-backed storage defaults are preconfigured for the platform.

For more information, see [Deploy on Amazon EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploy-on-amazon-eks/).

### GKE on GCP

On Google Cloud Platform (GCP), the Terraform module for the GKE path provides the following components:

- Cluster provisioning: deploy a GKE Standard cluster into a new VPC or an existing VPC.
- GCP identity configuration: Workload Identity Federation for GKE is configured for the service accounts that require GCP access, so pods can be authenticated without long-lived keys.
- Private networking options: the source, target, snapshot, and control-plane legs can be made private using Private Service Connect, VPC peering, and Private Google Access.
- Snapshot helpers: the module provisions a Cloud Storage bucket and the access bindings required for snapshots.
- Secure defaults: private nodes with Cloud NAT for outbound access, and configurable IP ranges authorized to access the control plane.

For more information, see [Deploy on Google Kubernetes Engine (GKE)]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-gke/).

On both Amazon EKS and GKE, using a managed cloud path reduces time spent building supporting infrastructure and increases time available for validating the migration.

## Other Kubernetes platforms

Use another Kubernetes platform in the following situations:

- You already have a Kubernetes platform that your team operates.
- Your migration does not involve a managed cloud service as the source or target.
- You are doing local development or evaluation.
- You already have your own logging, storage, registry, and workload-identity model.

All options use the same migration engine. On a managed cloud path, the tooling configures them for you. On another Kubernetes platform, you configure the platform integrations yourself. 

## Related documentation

- If you are looking for the older ECS model, see the [classic Migration Assistant documentation]({{site.url}}{{site.baseurl}}/classic/migration-assistant/).
