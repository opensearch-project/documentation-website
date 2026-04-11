---
layout: default
title: Removing Migration Assistant
nav_order: 9
parent: Migration phases
permalink: /migration-assistant/migration-phases/remove-migration-infrastructure/
---

# Removing migration infrastructure

After a migration is complete, remove Migration Assistant resources from your cluster.

## Kubernetes deployment

Remove the Helm release and persistent volumes:

```bash
helm uninstall -n ma ma
kubectl -n ma delete pvc --all
kubectl delete namespace ma
```
{% include copy.html %}

## Amazon EKS deployment

Remove the Helm release, then delete the CloudFormation stack:

```bash
# Remove Helm release
helm uninstall -n ma ma
kubectl -n ma delete pvc --all

# Delete CloudFormation stack
aws cloudformation delete-stack --stack-name <STACK_NAME>
aws cloudformation wait stack-delete-complete --stack-name <STACK_NAME>
```
{% include copy.html %}

The CloudFormation stack deletion removes the EKS cluster, ECR registry, IAM roles, and networking resources.

The S3 bucket created for snapshots (`migrations-default-<ACCOUNT_ID>-<STAGE>-<REGION>`) is not automatically deleted. Remove it manually if no longer needed.
{: .warning }

{% include migration-phase-navigation.html %}
