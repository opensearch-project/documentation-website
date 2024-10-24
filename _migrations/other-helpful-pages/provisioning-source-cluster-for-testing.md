<!-- Document: Topic -->
This guide walks you through the steps to provision an Elasticsearch cluster on EC2 using AWS CDK. The CDK that provisions this cluster can be found on the `migration-es` branch of the `opensearch-cluster-cdk` GitHub [forked repository](https://github.com/lewijacn/opensearch-cluster-cdk/tree/migration-es).

TODO ^ lewijacn seems like it should be updated?

## 1. Clone the Repository for Source Cluster CDK

```bash
git clone https://github.com/lewijacn/opensearch-cluster-cdk.git
cd opensearch-cluster-cdk
git checkout migration-es
```

## 2. Install NPM Dependencies

```bash
npm install
```

## 3. Configure AWS Credentials

Configure the desired [AWS credentials](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_prerequisites) ↗ for the environment, as these will dictate the region and account used for deployment.

## 4. Configure Cluster Options

The configuration below sets up a single-node Elasticsearch 7.10.2 cluster on EC2 and a VPC to host the cluster. Alternatively, you can specify an existing VPC by providing the `vpcId` parameter. The setup includes an internal load balancer, which should be used when interacting with the cluster.

Copy and paste the following configuration into a `cdk.context.json` file at the root of the repository. Replace the `<STAGE>` placeholders with the desired deployment stage, e.g., `dev`.

```json
{
  "source-single-node-ec2": {
    "suffix": "ec2-source-<STAGE>",
    "networkStackSuffix": "ec2-source-<STAGE>",
    "distVersion": "7.10.2",
    "cidr": "12.0.0.0/16",
    "distributionUrl": "https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-oss-7.10.2-linux-x86_64.tar.gz",
    "captureProxyEnabled": false,
    "securityDisabled": true,
    "minDistribution": false,
    "cpuArch": "x64",
    "isInternal": true,
    "singleNodeCluster": true,
    "networkAvailabilityZones": 2,
    "dataNodeCount": 1,
    "managerNodeCount": 0,
    "serverAccessType": "ipv4",
    "restrictServerAccessTo": "0.0.0.0/0"
  }
}
```

> **Note:** You can specify other versions of Elasticsearch or OpenSearch by modifying the `distributionUrl` parameter.

## 5. Bootstrap CDK in the Region (If Needed)

If this is the first time you're deploying CDK in the region, you'll need to run the following command. **Note:** This only needs to be done once per region.

```bash
cdk bootstrap --c contextId=source-single-node-ec2 --c contextFile=cdk.context.json
```

## 6. Deploy CloudFormation Stacks with CDK

Deploy the infrastructure using the following command:

```bash
cdk deploy "*" --c contextId=source-single-node-ec2 --c contextFile=cdk.context.json
```

Once the deployment is complete, the CDK will output the internal load balancer endpoint, which can be used within the VPC to interact with the Elasticsearch cluster:

```bash
# Stack output
opensearch-infra-stack-ec2-source-dev.loadbalancerurl = opense-clust-owiejfo2345-sdfljsd.elb.us-east-1.amazonaws.com

# Example curl command within the VPC
curl http://opense-clust-owiejfo2345-sdfljsd.elb.us-east-1.amazonaws.com:9200
```

## 7. Clean Up Resources

When you are done using the provisioned source cluster, you can delete the resources by running the following command:

```bash
cdk destroy "*" --c contextId=source-single-node-ec2 --c contextFile=cdk.context.json
```

For a full list of options, refer to the CDK options in the [repository documentation](https://github.com/lewijacn/opensearch-cluster-cdk/tree/migration-es?tab=readme-ov-file#required-context-parameters).

^ TODO: Are we advertising a fork? Seems like this should be fixed up