


After a migration is complete all resources should be removed except for the target cluster, and optionally your Cloudwatch Logs, and Replayer logs.

## Remove Migration Assistant Infrastructure
To remove all the CDK stack(s) which get created during a deployment you can execute a command similar to below within the CDK directory

```
cdk destroy "*" --c contextId=<CONTEXT_ID>
```

Follow the instructions on the command-line to remove the deployed resources from the AWS account.

> [!Note] 
> The AWS Console can also be used to verify, remove, and confirm resources for the Migration Assistant are no longer in the account.