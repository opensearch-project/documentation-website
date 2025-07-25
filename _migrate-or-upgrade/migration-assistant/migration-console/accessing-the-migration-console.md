---
layout: default
title: Accessing the migration console
nav_order: 1
parent: Migration console
grand_parent: Migration Assistant for OpenSearch
permalink: /migration-assistant/migration-console/accessing-the-migration-console/
redirect_from:
  - /migration-console/accessing-the-migration-console/
---

# Accessing the migration console

The bootstrap box deployed through Migration Assistant contains a script that simplifies access to the migration console through that instance.

To access the migration console, use the following commands:

```shell
export STAGE=dev
export AWS_REGION=us-west-2
/opensearch-migrations/deployment/cdk/opensearch-service-migration/accessContainer.sh migration-console ${STAGE} ${AWS_REGION}
```
{% include copy.html %}

When opening the console a message will appear above the command prompt, `Welcome to the Migration Assistant Console`.

On a machine with the [AWS Command Line Interface (AWS CLI)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and the [AWS Session Manager plugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html), you can directly connect to the migration console. Ensure that you've run `aws configure` with credentials that have access to the environment.

Use the following commands:

```shell
export STAGE=dev
export SERVICE_NAME=migration-console
export TASK_ARN=$(aws ecs list-tasks --cluster migration-${STAGE}-ecs-cluster --family "migration-${STAGE}-${SERVICE_NAME}" | jq --raw-output '.taskArns[0]')
aws ecs execute-command --cluster "migration-${STAGE}-ecs-cluster" --task "${TASK_ARN}" --container "${SERVICE_NAME}" --interactive --command "/bin/bash"
```
{% include copy.html %}

Typically, `STAGE` is equivalent to a standard `dev` environment, but this may vary based on what the user specified during deployment.
