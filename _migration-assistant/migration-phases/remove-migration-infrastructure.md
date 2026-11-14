---
layout: default
title: Removing Migration Assistant
nav_order: 90
parent: Migration workflows
permalink: /migration-assistant/migration-phases/remove-migration-infrastructure/
redirect_from:
  - /migration-assistant/migration-phases/removing-migration-infrastructure/
  - /migration-phases/removing-migration-infrastructure/

---

# Removing migration infrastructure

Do not remove migration infrastructure immediately after a successful migration.

Before proceeding with removal, confirm the following conditions:

- Production traffic has been stable on the target.
- You no longer need the source for rollback.
- You no longer need replay or comparison checks.
- Any snapshot artifacts you want to keep have been retained intentionally.

## Removing deployments on other Kubernetes platforms

To remove the Helm deployment and persistent volumes, run the following commands.

Uninstall the Helm release:

```bash
helm uninstall -n ma ma
```
{% include copy.html %}

Delete the persistent volume claims:

```bash
kubectl -n ma delete pvc --all
```
{% include copy.html %}

Delete the namespace:

```bash
kubectl delete namespace ma
```
{% include copy.html %}

## Removing Amazon EKS deployments

If you used the [EKS bootstrap path]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/), remove the Helm release and then the AWS CloudFormation stack.

Uninstall the Helm release and delete the persistent volume claims:

```bash
helm uninstall -n ma ma
kubectl -n ma delete pvc --all
```
{% include copy.html %}

Delete the CloudFormation stack:

```bash
aws cloudformation delete-stack --stack-name <STACK_NAME>
```
{% include copy.html %}

Wait for the deletion to complete:

```bash
aws cloudformation wait stack-delete-complete --stack-name <STACK_NAME>
```
{% include copy.html %}

This removes the EKS platform resources created by the solution stack.

## Removing Google Kubernetes Engine deployments

The GKE module creates the snapshot bucket with `force_destroy = true`, so `terraform destroy` deletes the bucket and every snapshot in it without prompting. Save any snapshots you still need before running the command.
{: .warning }

If you used the [Google Kubernetes Engine (GKE) Terraform path]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-gke/), uninstall the Helm release, delete the persistent volume claims, and then destroy the Terraform infrastructure.

Uninstall the Helm release:

```bash
helm uninstall -n ma ma
```
{% include copy.html %}

Delete the persistent volume claims while the cluster still exists:

```bash
kubectl -n ma delete pvc --all
```
{% include copy.html %}

Destroy the Terraform infrastructure:

```bash
terraform destroy \
  -var="project=<PROJECT_ID>" \
  -var="region=<REGION>"
```
{% include copy.html %}

This removes the GKE cluster, networking, and snapshot resources that Terraform created.

## Retaining snapshots and artifacts

Be deliberate about removing the snapshot bucket in object storage, such as Amazon S3 or Google Cloud Storage. The default migrations bucket is often still useful for:

- Audit and rollback investigation
- Preserving snapshots
- Comparing post-cutover behavior

Delete the bucket only after you are certain you no longer need its contents.
{: .warning }

{% include migration-phase-navigation.html %}