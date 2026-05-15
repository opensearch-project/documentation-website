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

Cleanup should happen last, not immediately after the first successful run.

Wait until:

- production traffic has been stable on the target
- you no longer need the source for rollback
- you no longer need replay or comparison checks
- any snapshot artifacts you want to keep have been retained intentionally

## Generic Kubernetes cleanup

To remove the Helm deployment and persistent volumes:

```bash
helm uninstall -n ma ma
kubectl -n ma delete pvc --all
kubectl delete namespace ma
```
{% include copy.html %}

## Amazon EKS cleanup

If you used the EKS bootstrap path, clean up the Helm release and then the CloudFormation stack:

```bash
helm uninstall -n ma ma
kubectl -n ma delete pvc --all
aws cloudformation delete-stack --stack-name <STACK_NAME>
aws cloudformation wait stack-delete-complete --stack-name <STACK_NAME>
```
{% include copy.html %}

This removes the EKS platform resources created by the solution stack.

## Check snapshot and artifact retention first

Be deliberate about S3 cleanup. The default migrations bucket is often still useful for:

- audit and rollback investigation
- preserving snapshots
- comparing post-cutover behavior

Delete it only after you are certain you no longer need the contents.
{: .warning }

{% include migration-phase-navigation.html %}
