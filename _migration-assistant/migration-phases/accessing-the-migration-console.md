---
layout: default
title: Accessing the Migration Console
parent: Migration phases
nav_order: 10
---

# Accessing the Migration Console

The Migrations Assistant deployment includes an ECS task that hosts tools to run different phases of the migration and check the progress or results of the migration.

## SSH into the Migration Console

Following the AWS Solutions deployment, the bootstrap box contains a script that simplifies access to the migration console through that instance.

To access the Migration Console, use the following commands:

```sh
export STAGE=dev
export AWS_REGION=us-west-2
/opensearch-migrations/deployment/cdk/opensearch-service-migration/accessContainer.sh migration-console ${STAGE} ${AWS_REGION}
```
When opening the console a message will appear above the command prompt, Welcome to the Migration Assistant Console.
<details>

<summary>
<b>SSH from any machine into Migration Console</b>
</summary>

On a machine with the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) ↗ and the [AWS Session Manager Plugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html) ↗, you can directly connect to the migration console. Ensure you've run `aws configure` with credentials that have access to the environment.

Use the following commands:

```shell
export STAGE=dev
export SERVICE_NAME=migration-console
export TASK_ARN=$(aws ecs list-tasks --cluster migration-${STAGE}-ecs-cluster --family "migration-${STAGE}-${SERVICE_NAME}" | jq --raw-output '.taskArns[0]')
aws ecs execute-command --cluster "migration-${STAGE}-ecs-cluster" --task "${TASK_ARN}" --container "${SERVICE_NAME}" --interactive --command "/bin/bash"
```
</details>

> **Note:** Typically, `STAGE` is `dev`, but this may vary based on what the user specified during deployment.