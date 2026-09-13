---
layout: default
title: Deploy on Amazon EKS
nav_order: 2
parent: Choose your deployment
has_children: true
has_toc: false
permalink: /migration-assistant/migration-phases/deploy/amazon-eks/
---

# Deploy on Amazon EKS

This is the recommended production path on AWS. You receive the same Migration Assistant engine and workflows as any other Kubernetes platform, but the Amazon Elastic Kubernetes Service (EKS) tooling removes much of the AWS platform work that otherwise delays migrations.

EKS makes the migration **easier to deploy, easier to secure, and easier to operate** without changing how migrations run.

## EKS deployment components

The EKS path prepares AWS infrastructure around the workflow engine, including:

- EKS cluster deployment into a new or existing virtual private cloud (VPC).
- Pod identity for the Migration Console and workflow pods.
- Image mirroring and VPC endpoint support for isolated subnets.
- Default Amazon Simple Storage Service (Amazon S3) bucket and snapshot-role helpers.
- Amazon CloudWatch logging and dashboards.
- AWS-aware storage and node-pool defaults.

If you are migrating to or from Amazon OpenSearch Service, this is usually the shortest path to a working production setup.

## Choose a provisioning method

Both methods produce an equivalent runtime environment. Everything after provisioning, including the migration workflow itself, is identical.

| Method | Best when |
|:-------|:----------|
| [Provision with CloudFormation]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) | You want a single bootstrap script that provisions the infrastructure and installs the Helm chart in one step |
| [Provision with Terraform]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/provisioning-eks-with-terraform/) | Your organization manages infrastructure with Terraform and you want the cluster defined as code alongside your other modules |

Do not point both methods at the same `stage` and AWS Region. They use the same cluster and repository naming pattern, so they would collide. Use a different `stage` for side-by-side evaluation.
{: .warning }

## Authentication on EKS

Migration Assistant supports the following authentication methods on EKS, regardless of which provisioning method you use.

### Basic authentication

Basic authentication works the same way as on any other Kubernetes platform: create Kubernetes secrets and reference them in `authConfig.basic.secretName`.

### Authenticate with AWS Signature Version 4

AWS Signature Version 4 authentication is the primary advantage of deploying on EKS.

For sources or targets authenticated using AWS Signature Version 4, the EKS stack uses AWS Identity and Access Management (IAM) [Roles for Service Accounts (IRSA)](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html) to assign an AWS identity to two sets of pods:

- The Migration Console pod (`migration-console-0`), which runs under the `migration-console-access-role` service account.
- The Argo workflow executor pods, which run under the `argo-workflow-executor` service account.

This means the console and the migration jobs can authenticate to Amazon OpenSearch Service and other AWS services without you manually distributing long-lived AWS credentials.

This is one of the main reasons EKS is the recommended AWS production path.

## Next steps

- To provision with the bootstrap script, see [Provision with CloudFormation]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/).
- To provision with Terraform, see [Provision with Terraform]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/provisioning-eks-with-terraform/).
- To keep migration traffic off the public internet, see [Private networking]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-eks/).

{% include migration-phase-navigation.html %}
