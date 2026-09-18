---
layout: default
title: Removing Migration Assistant
nav_order: 9
parent: Migration workflows
permalink: /migration-assistant/migration-phases/remove-migration-infrastructure/
redirect_from:
  - /migration-assistant/migration-phases/removing-migration-infrastructure/
  - /migration-phases/removing-migration-infrastructure/

---

# Removing migration infrastructure

Do not remove migration infrastructure immediately after a successful migration.

Before proceeding with removal, confirm the following:

- Production traffic has been stable on the target.
- You no longer need the source for rollback.
- You no longer need replay or comparison checks.
- Any snapshot artifacts you want to keep have been retained intentionally.

## Other Kubernetes removal

To remove the Helm deployment and persistent volumes, run the following commands:

```bash
helm uninstall -n ma ma
kubectl -n ma delete pvc --all
kubectl delete namespace ma
```
{% include copy.html %}

## Amazon EKS removal

If you used the EKS bootstrap path, remove the Helm release and then the CloudFormation stack:

```bash
helm uninstall -n ma ma
kubectl -n ma delete pvc --all
aws cloudformation delete-stack --stack-name <STACK_NAME>
aws cloudformation wait stack-delete-complete --stack-name <STACK_NAME>
```
{% include copy.html %}

This removes the EKS platform resources created by the solution stack.

## Google Kubernetes Engine (GKE) removal

If you used the GKE Terraform path, uninstall the Helm release and then destroy the Terraform-managed infrastructure:

```bash
helm uninstall migration-assistant -n ma
kubectl -n ma delete pvc --all
terraform destroy \
  -var="project=<your-gcp-project>" \
  -var="region=<your-gcp-region>"
```
{% include copy.html %}

This removes the GKE cluster, networking, and snapshot resources that Terraform created.

## Snapshot and artifact retention

Be deliberate about removing the snapshot bucket in object storage, such as Amazon S3 or Google Cloud Storage. The default migrations bucket is often still useful for:

- Audit and rollback investigation
- Preserving snapshots
- Comparing post-cutover behavior

Delete the bucket only after you are certain you no longer need its contents.
{: .warning }

{% include migration-phase-navigation.html %}