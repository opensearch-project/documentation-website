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

## Generic Kubernetes removal

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

## Snapshot and artifact retention

Be deliberate about S3 removal. The default migrations bucket is often still useful for:

- Audit and rollback investigation
- Preserving snapshots
- Comparing post-cutover behavior

Delete the bucket only after you are certain you no longer need its contents.
{: .warning }

{% include migration-phase-navigation.html %}