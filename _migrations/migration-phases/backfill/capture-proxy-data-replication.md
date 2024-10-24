


The Migration Assistant includes an Application Load Balancer (ALB) for routing traffic to the capture proxy and/or target. Upstream client traffic must be routed through the capture proxy in order to replay the requests later.

## Assumptions

* The upstream layer from the ALB is compatible with the certificate on the ALB listener (whether it’s clients or a Network Load Balancer, NLB).
    * The `albAcmCertArn` in the `cdk.context.json` may need to be provided to ensure that clients trust the ALB certificate.
* If an NLB is used directly upstream of the ALB, it must use a TLS listener.
* Upstream resources and security groups must allow network access to the Migration Assistant ALB.

## Steps

1. In the AWS Console, navigate to **EC2 > Load Balancers > Migration Assistant ALB**.
2. Note down the ALB URL.
3. If you are using **NLB → ALB → Cluster**:
    1. Ensure ingress is provided directly to the ALB for the capture proxy.
    2. Create a target group for the Migration Assistant ALB on port 9200, and set the health check to HTTPS.
    3. Associate this target group with your existing NLB on a new listener (for testing).
    4. Verify the health check is successful, and perform smoke testing with some clients through the new listener port.
    5. Once ready to migrate all clients, detach the Migration Assistant ALB target group from the testing NLB listener and modify the existing NLB listener to direct traffic to this target group.
    6. Now, client requests will be routed through the proxy (once they establish a new connection). Verify application metrics.
4. If you are using **NLB → Cluster**:
    1. If you do not wish to modify application logic, add an ALB in front of your cluster and follow the **NLB → ALB → Cluster** steps. Otherwise:
    2. Create a target group for the ALB on port 9200 and set the health check to HTTPS.
    3. Associate this target group with your existing NLB on a new listener.
    4. Verify the health check is successful, and perform smoke testing with some clients through the new listener port.
    5. Once ready to migrate all clients, deploy a change so that clients hit the new listener.
5. If you are **not using an NLB**:
    1. Make a client/DNS change to route clients to the Migration Assistant ALB on port 9200.
6. In the Migration Console, execute the following command:
   ```shell
   console kafka describe-topic-records
   ```
   Note the records in the logging topic.
7. After a short period, execute the same command again and compare the increase in records against the expected HTTP requests.

### Troubleshooting

* Investigate the ALB listener security policy, security groups, ALB certificates, and the proxy's connection to Kafka.

### Related Links

- [Migration Console ALB Documentation](https://github.com/opensearch-project/opensearch-migrations/blob/main/docs/ClientTrafficSwinging.md)