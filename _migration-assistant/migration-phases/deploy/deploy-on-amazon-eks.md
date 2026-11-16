---
layout: default
title: Deploy on Amazon EKS
nav_order: 2
parent: Choose your deployment
has_children: true
has_toc: false
---

# Deploy Migration Assistant on Amazon EKS

Amazon Elastic Kubernetes Service (EKS) is the recommended production path on AWS. Migration Assistant uses the same engine and workflows on EKS as it does on other Kubernetes platforms. The EKS tooling handles much of the AWS-specific setup that would otherwise delay migrations.

## EKS deployment components

The EKS path provisions the AWS infrastructure that the workflow engine depends on. Both provisioning methods provide the following components:

- An EKS cluster deployed into a new or existing virtual private cloud (VPC).
- EKS Pod Identity for the Migration Console and workflow pods.
- A private Amazon Elastic Container Registry (Amazon ECR) repository and VPC endpoints for image access in isolated subnets.
- The Amazon Simple Storage Service (Amazon S3) snapshot role that Amazon OpenSearch Service assumes.
- AWS-aware storage and node pool defaults.

The AWS CloudFormation bootstrap script copies container images into the Amazon ECR repository and always installs the Helm chart, which includes the Amazon CloudWatch dashboards and the default snapshot bucket. The Terraform module creates the repository but does not copy images. It installs the chart only when you set `deploy_helm` to `true`.

If you are migrating to or from Amazon OpenSearch Service, Amazon EKS is usually the shortest path to a working production setup.
{: .tip}

## Choose a provisioning method

Migration Assistant provides the following methods for provisioning the EKS cluster. Both approaches produce equivalent environments. The migration workflow is identical for either approach.

| Method | Best when |
|:-------|:----------|
| [Provision Migration Assistant on Amazon EKS using AWS CloudFormation]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/provisioning-eks-with-cloudformation/) | You need a single bootstrap script that provisions the infrastructure and installs the Helm chart in one step |
| [Provision Migration Assistant on Amazon EKS using Terraform]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/provisioning-eks-with-terraform/) | You manage infrastructure using Terraform and need the cluster defined as code alongside your other modules |

Do not point both provisioning methods at the same `stage` and AWS Region. Both methods use the same cluster and repository naming pattern, so they collide. Use a different `stage` if you are evaluating both methods simultaneously.
{: .warning }

## Authentication on EKS

Migration Assistant supports the following authentication methods on EKS.

### Basic authentication

Configure basic authentication by creating Kubernetes secrets and referencing them in `authConfig.basic.secretName`.

### Authenticate using AWS Signature Version 4

AWS Signature Version 4 authentication is the primary advantage of deploying on EKS.

For sources or targets authenticated using Signature Version 4, the EKS stack uses [EKS Pod Identity](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html) to assign an AWS Identity and Access Management (IAM) identity to the following sets of pods:

- The Migration Console pod (`migration-console-0`), which runs under the `migration-console-access-role` service account.
- The Argo workflow executor pods, which run under the `argo-workflow-executor` service account.

The console and the migration jobs authenticate to Amazon OpenSearch Service and other AWS services without requiring you to distribute long-lived AWS credentials.

## Next steps

- To provision the EKS cluster using the bootstrap script, see [Provision Migration Assistant on Amazon EKS using AWS CloudFormation]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/provisioning-eks-with-cloudformation/).
- To provision the EKS cluster using Terraform, see [Provision Migration Assistant on Amazon EKS using Terraform]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/provisioning-eks-with-terraform/).
- To keep migration traffic off the public internet, see [Private networking]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-eks/).

