---
layout: default
title: Accessing the migration console
nav_order: 1
parent: Migration console
permalink: /migration-assistant/migration-console/accessing-the-migration-console/
redirect_from:
  - /migration-console/accessing-the-migration-console/
---

# Accessing the migration console

The bootstrap box deployed through Migration Assistant contains a script that simplifies access to the migration console through that instance.

To access the migration console, use the following commands:

```shell
export STAGE=dev  # Use the same stage value from your cdk.context.json deployment
export AWS_REGION=us-west-2
/opensearch-migrations/deployment/cdk/opensearch-service-migration/accessContainer.sh migration-console ${STAGE} ${AWS_REGION}
```
{% include copy.html %}

**Important:** The `STAGE` value must match the `stage` parameter you used in your CDK context configuration. For example:
- If you deployed with `"stage": "test"`, use `export STAGE=test`.
- If you deployed with `"stage": "prod"`, use `export STAGE=prod`.
- If you deployed with `"stage": "dev"`, use `export STAGE=dev`.

When opening the console a message will appear above the command prompt, `Welcome to the Migration Assistant Console`.

On a machine with the [AWS Command Line Interface (AWS CLI)](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and the [AWS Session Manager plugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html), you can directly connect to the migration console. Ensure that you've run `aws configure` with credentials that have access to the environment.

Use the following commands:

```shell
export STAGE=dev  # Match your deployment stage
export SERVICE_NAME=migration-console
export TASK_ARN=$(aws ecs list-tasks --cluster migration-${STAGE}-ecs-cluster --family "migration-${STAGE}-${SERVICE_NAME}" | jq --raw-output '.taskArns[0]')
aws ecs execute-command --cluster "migration-${STAGE}-ecs-cluster" --task "${TASK_ARN}" --container "${SERVICE_NAME}" --interactive --command "/bin/bash"
```
{% include copy.html %}

### Stage configuration examples

For different deployment environments, adjust the stage accordingly:

```shell
# For test environment deployment
export STAGE=test
./accessContainer.sh migration-console test us-west-2

# For production environment deployment  
export STAGE=prod
./accessContainer.sh migration-console prod us-west-2

# For development environment deployment
export STAGE=dev
./accessContainer.sh migration-console dev us-west-2
```
{% include copy.html %}

The `STAGE` value corresponds to the `stage` parameter you specified in your AWS CDK context configuration during deployment.
