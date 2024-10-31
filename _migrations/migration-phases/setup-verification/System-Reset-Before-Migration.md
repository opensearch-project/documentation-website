


The following steps outline how to reset resources with Migration Assistant before executing the actual migration. At this point all verifications are expected to have been completed. These steps can be performed after [[Accessing the Migration Console]]

## Replayer Stoppage
To stop a running Replayer service, the following command can be executed:
```
console replay stop
```

## Kafka Reset
The clear all captured traffic from the Kafka topic, the following command can be executed. **Note**: This command will result in the loss of any captured traffic data up to this point by the capture proxy and thus should be used with caution.
```
console kafka delete-topic
```

## Target Cluster Reset
To clear non-system indices from the target cluster that may have been created from testing, the following command can be executed. **Note**: This command will result in the loss of all data on the target cluster and should be used with caution.
```
console clusters clear-indices --cluster target
```
