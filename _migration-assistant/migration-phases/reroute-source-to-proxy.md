---
layout: default
title: Reroute client traffic
nav_order: 3
parent: Migration phases
grand_parent: Migration Assistant for OpenSearch
permalink: /migration-assistant/migration-phases/reroute-source-to-proxy/
---

# Reroute client traffic to the Traffic Capture Proxy

**Note**: This page is only relevant if you are using Capture and Replay to avoid downtime during a migration. If you are only performing backfill migration, you can skip this step.
{: .note}

## Capture Proxy data replication

If you're interested in capturing live traffic during your migration, Migration Assistant includes an Application Load Balancer for routing traffic to the Capture Proxy and target cluster. Upstream client traffic must be routed through the Capture Proxy in order to replay the requests later. Before using the Capture Proxy, remember the following:

* The layer upstream from the Application Load Balancer is compatible with the certificate for the Application Load Balancer listener, whether it's for clients or a Network Load Balancer. The `albAcmCertArn` in the `cdk.context.json` may need to be provided to ensure that clients trust the Application Load Balancer certificate.
* If a Network Load Balancer is used directly upstream of the Application Load Balancer, it must use a TLS listener.
* Upstream resources and security groups must allow network access to the Migration Assistant Application Load Balancer.

To set up the Capture Proxy, go to the AWS Management Console and navigate to **EC2 > Load Balancers > Migration Assistant Application Load Balancer**. Copy the Application Load Balancer URL. With the URL copied, you can use one of the following options.



### If you are using **Network Load Balancer → Application Load Balancer → Cluster**

1. Ensure that ingress is provided directly to the Application Load Balancer for the Capture Proxy.
2. Create a target group for the Migration Assistant Application Load Balancer on port `9200` and set the health check to `HTTPS`.
3. Associate this target group with your existing Network Load Balancer on a new listener for testing.
4. Verify that the health check is successful and perform smoke testing with some clients through the new listener port.
5. Once you are ready to migrate all clients, detach the Migration Assistant Application Load Balancer target group from the testing Network Load Balancer listener and modify the existing Network Load Balancer listener to direct traffic to this target group.
6. Now client requests will be routed through the proxy (once they establish a new connection). Verify the application metrics.

### If you are using **Network Load Balancer → Cluster**

If you do not want to modify application logic, add an Application Load Balancer in front of your cluster and follow the **Network Load Balancer → Application Load Balancer → Cluster** steps. Otherwise:

1. Create a target group for the Application Load Balancer on port `9200` and set the health check to `HTTPS`.
2. Associate this target group with your existing Network Load Balancer on a new listener.
3. Verify that the health check is successful, and perform smoke testing with some clients through the new listener port.
4. Once you are ready to migrate all clients, deploy a change so that clients hit the new listener.
   

### If you are **not using a Network Load Balancer**

If you're only using backfill as your migration technique, make a client/DNS change to route clients to the Migration Assistant Application Load Balancer on port `9200`.


### Apache Kafka connection

After you have routed the client based on your use case, test adding records against HTTP requests using the following steps.

In the migration console, run the following command:

```bash
console kafka describe-topic-records
```
{% include copy.html %}
   
Note the records in the logging topic.
   
After a short period, re-execute the same command again and compare the increased number of records against the expected HTTP requests.

## Troubleshooting

### Host header routing configuration

Some systems, such as Elastic Cloud and other hosted Elasticsearch services, use the Host header for routing traffic to the appropriate cluster. When using the Capture Proxy with these systems, you need to configure the proxy to set the Host header to match your source cluster's domain.

**Important**: This configuration is required for Elastic Cloud deployments and any system that uses Host header-based routing. Without this setting, requests will fail with an error response like `{"ok":false,"message":"Unknown resource."}` on Elastic Cloud or be misrouted on other systems.
{: .note}

To configure the Host header, add the `captureProxyExtraArgs` parameter to your `cdk.context.json` file:

```json
{
  "captureProxyExtraArgs": "--setHeader Host <domain-host-without-protocol>"
}
```
{% include copy.html %}

For example, if your Elastic Cloud domain is `https://my-cluster.es.us-east-1.aws.found.io`, you would configure:

```json
{
  "captureProxyExtraArgs": "--setHeader Host my-cluster.es.us-east-1.aws.found.io"
}
```
{% include copy.html %}

**Tip**: The Host header value should include only the domain name without the protocol (https://) or port number.
{: .tip}

#### Validating the configuration

Before routing production traffic through the Capture Proxy, validate that the proxy is correctly configured by sending test requests directly to it. You can use `curl` to verify the connection:

```bash
curl -k https://<capture-proxy-endpoint>:9200/
```
{% include copy.html %}

If the Host header configuration is correct, you should receive a successful or authentication failure response from your source cluster. If you receive an error like `{"ok":false,"message":"Unknown resource."}`, verify that:
- The `captureProxyExtraArgs` parameter is correctly set in your `cdk.context.json`
- The Host header value matches your source cluster's domain exactly
- You have redeployed the Capture Proxy service after making configuration changes

{% include migration-phase-navigation.html %}
