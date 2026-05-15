---
layout: default
title: Why Kubernetes and EKS?
nav_order: 12
permalink: /migration-assistant/why-kubernetes-and-eks/
---

# Why Kubernetes and EKS
Migration Assistant moved away from the classic ECS deployment model because users needed a platform-agnostic migration tool that can run anywhere — easier to repeat, easier to operate, and easier to fit into modern platform teams.

The new Migration Assistant is built around three ideas:

1. **Declare the migration once** in workflow configuration instead of stitching together long-lived infrastructure by hand.
2. **Let Kubernetes run the work** so migration tasks can be created, retried, scaled, and cleaned up as normal platform workloads.
3. **Use Amazon EKS as the recommended AWS production path** because it wires up the AWS services and permissions that most users need anyway.

## What changed from classic Migration Assistant

| Classic (ECS) | New Migration Assistant |
|:--------------|:------------------------|
| Focused on a fixed AWS deployment model | Uses the same workflow model on Kubernetes, with Amazon EKS as the recommended AWS path |
| More infrastructure was configured up front and kept around | Migration work is created as Kubernetes workloads only when needed |
| Users had to think more about the platform while thinking about the migration | Users primarily think in terms of workflow configuration, approvals, validation, and cutover |
| AWS-specific deployment details shaped the mental model | The mental model is now: declare, submit, observe, approve, validate, and cut over |

## What users get from Kubernetes

Kubernetes is not the product. It is the platform that makes the product more predictable.

When Migration Assistant runs on Kubernetes, users get:

- **Repeatable execution**: the same workflow can be run again after configuration changes or environment changes.
- **Short-lived migration workers**: backfill, replay, validation, and support components run as pods instead of as permanently managed services.
- **Better failure handling**: Kubernetes and Argo Workflows can restart work, preserve status, and make failures visible in a consistent way.
- **Clear separation of concerns**: the customer defines the migration, while the platform handles pod scheduling, service wiring, logs, and resource lifecycle.
- **Portability**: the same migration engine can run on local development clusters, self-managed Kubernetes, or Amazon EKS.

This is the core philosophy behind the transition: **Migration Assistant should feel like a workflow product, not like a pile of infrastructure that the customer has to manually coordinate.**

## Why deploy infrastructure for a migration
Production migrations are long-running, stateful operations — not one-shot commands. The infrastructure that Migration Assistant deploys exists to handle the realities of moving data at scale:

- **Checkpoint and resume**: If a backfill worker fails partway through hundreds of gigabytes of data, it resumes from its last checkpoint rather than restarting from the beginning.
- **Approval gates**: Production migrations require human decision points between phases — for example, verifying metadata before starting backfill, or confirming document counts before switching traffic. The workflow engine holds state between these gates indefinitely.
- **Parallel workers with coordination**: Reindex-from-Snapshot distributes work across multiple workers. Kubernetes handles scheduling, scaling, and restarting failed workers automatically.
- **Persistent traffic capture**: Zero-downtime migrations require Kafka to buffer live traffic continuously between the capture proxy and the Replayer. This cannot run transiently.
- **Built-in observability**: When an issue occurs on day four of a migration, logs, metrics, and workflow state are available for diagnosis without additional setup.
- **Repeatability**: The same Helm chart and workflow configuration that ran a pilot migration can run the production migration without manual reconfiguration.

For small datasets where restarting from scratch is acceptable, a simpler approach may suffice. For production migrations with uptime requirements, the infrastructure is what turns a fragile manual process into an operation that can run unattended and recover from failures automatically.

## Why Amazon EKS is the recommended AWS path

If you are on AWS and want a production deployment, Amazon EKS is the path that gives customers the most value with the least platform work.

The EKS path does more than "run Kubernetes on AWS." It gives customers a ready-made operating model for Migration Assistant on AWS:

- **Bootstrap automation**: deploy into a new VPC or an existing VPC with the bootstrap script.
- **AWS identity wiring**: pod identity is set up for the service accounts that need AWS access.
- **Private image support**: the bootstrap path can mirror images and charts to private ECR for isolated environments.
- **Snapshot helpers**: the deployment supplies a default bucket configuration and snapshot role wiring.
- **AWS-native observability**: logs, metrics, and CloudWatch dashboards are integrated into the deployment.
- **AWS-aware scheduling defaults**: Karpenter node pools and EBS-backed storage defaults are prewired for the platform.

For AWS customers, that means less time building supporting infrastructure and more time validating the migration itself.

## When generic Kubernetes is the right choice

Generic Kubernetes is still a valid path. It is a good fit when:

- you already have a non-EKS Kubernetes platform that your team operates,
- you are not on AWS,
- you are doing local development or evaluation,
- or you want to bring your own logging, storage, registry, and workload-identity model.

What changes is not the migration engine. What changes is who owns the surrounding platform work.

On generic Kubernetes, **you bring the platform**. On EKS, the tooling brings much more of it for you.

## What this means for the rest of the docs

The new Migration Assistant docs are organized around this idea:

- First decide whether Migration Assistant is the right tool.
- Then decide where to run it.
- Then use the Workflow CLI and playbooks to execute a migration.

That is why the new documentation emphasizes:

- customer outcomes,
- deployment choice,
- workflow-driven operations,
- and path-specific playbooks.

If you are looking for the older ECS model, see the [classic Migration Assistant documentation]({{site.url}}{{site.baseurl}}/classic/migration-assistant/).
