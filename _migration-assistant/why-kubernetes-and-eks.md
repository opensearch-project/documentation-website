---
layout: default
title: Why Kubernetes and EKS?
nav_order: 12
permalink: /migration-assistant/why-kubernetes-and-eks/
---

# Why Kubernetes and EKS

Migration Assistant replaced the classic ECS deployment model with a platform-agnostic migration tool that can run anywhere, is easier to repeat and operate, and fits into modern platform teams.

The new Migration Assistant follows three principles:

1. **Declare the migration once** in workflow configuration instead of manually chaining long-lived infrastructure.
2. **Let Kubernetes run the work** so migration tasks can be created, retried, scaled, and cleaned up as normal platform workloads.
3. **Use Amazon EKS as the recommended AWS production path** because it configures the AWS services and permissions that you typically need anyway.

## Changes from classic Migration Assistant

The following table compares the classic and new Migration Assistant models.

| Classic (ECS) | New Migration Assistant |
|:--------------|:------------------------|
| Focused on a fixed AWS deployment model | Uses the same workflow model on Kubernetes, with Amazon EKS as the recommended AWS path |
| More infrastructure was configured up front and kept around | Migration work is created as Kubernetes workloads only when needed |
| Required more platform thinking alongside migration thinking | You primarily think in terms of workflow configuration, approvals, validation, and cutover |
| AWS-specific deployment details shaped the mental model | The mental model is now: declare, submit, observe, approve, validate, and switch traffic to the target |

## Kubernetes benefits

Kubernetes serves as the platform layer that makes Migration Assistant more predictable. Running Migration Assistant on Kubernetes provides the following benefits:

- **Repeatable execution**: The same workflow can be run again after configuration changes or environment changes.
- **Short-lived migration workers**: Backfill, replay, validation, and support components run as pods instead of as permanently managed services.
- **Better failure recovery**: Kubernetes and Argo Workflows can restart work, preserve status, and make failures visible in a consistent way.
- **Clear separation of concerns**: You define the migration, while the platform manages pod scheduling, service networking, logs, and resource lifecycle.
- **Portability**: The same migration engine can run on local development clusters, self-managed Kubernetes, or Amazon EKS.

## Why deploy infrastructure for a migration

Production migrations are long-running, stateful operations that require durable infrastructure. The infrastructure that Migration Assistant deploys supports the requirements of moving data at scale:

- **Checkpoint and resume**: If a backfill worker fails during processing, it resumes from its last checkpoint rather than restarting from the beginning.
- **Approval gates**: Production migrations require human decision points between phases, such as verifying metadata before starting backfill or confirming document counts before switching traffic. The workflow engine holds state between these gates indefinitely.
- **Parallel workers with coordination**: Reindex-from-Snapshot distributes work across multiple workers. Kubernetes manages scheduling, scaling, and restarting failed workers automatically.
- **Persistent traffic capture**: Zero-downtime migrations require Kafka to buffer live traffic continuously between the capture proxy and the Replayer. This cannot run transiently.
- **Built-in observability**: When an issue occurs on day four of a migration, logs, metrics, and workflow state are available for diagnosis without additional setup.
- **Repeatability**: The same Helm chart and workflow configuration that ran a pilot migration can run the production migration without manual reconfiguration.

For small datasets where restarting from the beginning is acceptable, a simpler approach may suffice. For production migrations with uptime requirements, the infrastructure is what turns a fragile manual process into an operation that can run unattended and recover from failures automatically.

## Why Amazon EKS is the recommended AWS path

If you are on AWS and want a production deployment, Amazon EKS provides the most value with the least platform work.

The EKS path does more than "run Kubernetes on AWS." It provides a ready-made operating model for Migration Assistant on AWS:

- **Bootstrap automation**: Deploy into a new VPC or an existing VPC with the bootstrap script.
- **AWS identity configuration**: Pod identity is configured for the service accounts that need AWS access.
- **Private image support**: The bootstrap path can mirror images and charts to private ECR for isolated environments.
- **Snapshot helpers**: The deployment supplies a default bucket configuration and snapshot role configuration.
- **AWS-native observability**: Logs, metrics, and CloudWatch dashboards are integrated into the deployment.
- **AWS-aware scheduling defaults**: Karpenter node pools and EBS-backed storage defaults are preconfigured for the platform.

For AWS deployments, this means less time building supporting infrastructure and more time validating the migration itself.

## Generic Kubernetes

Generic Kubernetes is a valid option when:

- You already have a non-EKS Kubernetes platform that your team operates.
- You are not on AWS.
- You are doing local development or evaluation.
- You want to bring your own logging, storage, registry, and workload-identity model.

Both options use the same migration engine. On generic Kubernetes, you configure the platform integrations yourself. On EKS, the bootstrap tooling configures them for you.

## Related documentation

- If you are looking for the older ECS model, see the [classic Migration Assistant documentation]({{site.url}}{{site.baseurl}}/classic/migration-assistant/).
