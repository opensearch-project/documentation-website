---
layout: default
title: Helm
parent: Installing OpenSearch Dashboards
nav_order: 15
redirect_from: 
  - /dashboards/install/helm/
---

# Installing OpenSearch Dashboards using Helm

Helm is a package manager that allows you to easily install and manage OpenSearch Dashboards in a Kubernetes cluster. You can define your OpenSearch configurations in a YAML file and use Helm to deploy your applications in a version-controlled and reproducible way.

The [Helm chart](https://github.com/opensearch-project/helm-charts) contains the resources described in the following table.

Resource | Description
:--- | :---
`Chart.yaml` |  Information about the chart.
`values.yaml` |  Default configuration values for the chart.
`templates` |  Templates that combine with values to generate the Kubernetes manifest files.

The specification in the default Helm chart supports many standard use cases and setups. You can modify the default chart to configure your desired specifications and set Transport Layer Security (TLS) and role-based access control (RBAC).

For information about the default configuration, steps to configure security, and configurable parameters, see the
[README](https://github.com/opensearch-project/helm-charts/tree/main/charts).

The instructions here assume you have a Kubernetes cluster with Helm preinstalled. See the [Kubernetes documentation](https://kubernetes.io/docs/setup/) for steps to configure a Kubernetes cluster and the [Helm documentation](https://helm.sh/docs/intro/install/) to install Helm.
{: .note }

## Prerequisites

Install OpenSearch. For more information, see [Installing OpenSearch using Helm]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/helm/).

Before you install OpenSearch Dashboards, make sure that OpenSearch is running. For more information, see [Verify the deployment]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/helm/#verify-the-deployment).

## Install OpenSearch Dashboards using Helm

The following steps use the `opensearch` Helm repository that you added when you installed OpenSearch.

1. Deploy OpenSearch Dashboards. The chart's default CPU limit of `100m` is too low for OpenSearch Dashboards to start before the startup probe fails, so the following command sets the CPU request and limit to 1 CPU:

   ```bash
   helm install my-dashboards opensearch/opensearch-dashboards \
     --set resources.requests.cpu=1 \
     --set resources.limits.cpu=1
   ```
   {% include copy.html %}

   To customize the deployment, pass in the values that you want to override using a custom YAML file. Include the CPU settings in the file:

   ```yaml
   resources:
     requests:
       cpu: "1"
     limits:
       cpu: "1"
   ```
   {% include copy.html %}

   Then deploy OpenSearch Dashboards using the custom file:

   ```bash
   helm install my-dashboards opensearch/opensearch-dashboards -f customvalues.yaml
   ```
   {% include copy.html %}

   The output shows the deployed release:

   ```yaml
   NAME: my-dashboards
   LAST DEPLOYED: Fri Oct  2 02:30:49 2026
   NAMESPACE: default
   STATUS: deployed
   REVISION: 1
   TEST SUITE: None
   NOTES:
   1. Get the application URL by running these commands:
     export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=opensearch-dashboards,app.kubernetes.io/instance=my-dashboards" -o jsonpath="{.items[0].metadata.name}")
     export CONTAINER_PORT=$(kubectl get pod --namespace default $POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
     echo "Visit http://127.0.0.1:8080 to use your application"
     kubectl --namespace default port-forward $POD_NAME 8080:$CONTAINER_PORT
   ```

After the deployment completes, follow these steps to access OpenSearch Dashboards:

1. To ensure that your OpenSearch Dashboards pod is running, use the following command:

   ```bash
   kubectl get pods
   ```
   {% include copy.html %}

   Wait until the OpenSearch Dashboards pod shows `1/1` in the `READY` column:

   ```bash
   NAME                                                   READY   STATUS    RESTARTS   AGE
   my-dashboards-opensearch-dashboards-567b777979-xx8jj   1/1     Running   0          70s
   opensearch-cluster-master-0                            1/1     Running   0          3m
   opensearch-cluster-master-1                            1/1     Running   0          3m
   opensearch-cluster-master-2                            1/1     Running   0          3m
   ```

1. Configure port forwarding from the OpenSearch Dashboards service:

   ```bash
   kubectl port-forward svc/my-dashboards-opensearch-dashboards 5601
   ```
   {% include copy.html %}

1. In a web browser, go to `http://localhost:5601` and log in as the `admin` user using the [custom admin password]({{site.url}}{{site.baseurl}}/security/configuration/passwords/#setting-the-initial-admin-password) that you set when you installed OpenSearch. For more information, see [Accessing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#accessing-opensearch-dashboards).

   OpenSearch Dashboards can take about 1 minute after the pod is ready to finish starting. Until then, requests return a `503` error. If you receive this error, wait and then reload the page.
   {: .note}

## Uninstall using Helm

To identify the OpenSearch Dashboards deployment that you want to delete, run the following command:

```bash
helm list
```
{% include copy.html %}

The response lists the current Helm deployments:

```bash
NAME         	NAMESPACE	REVISION	UPDATED                                	STATUS  	CHART                      	APP VERSION
my-dashboards	default  	1       	2026-10-02 02:30:49.128429961 +0000 UTC	deployed	opensearch-dashboards-{{site.opensearch_dashboards_version}}	{{site.opensearch_dashboards_version}}
my-deployment	default  	1       	2026-10-02 02:28:00.553978943 +0000 UTC	deployed	opensearch-{{site.opensearch_version}}           	{{site.opensearch_version}}
```

To uninstall a deployment, run the following command:

```bash
helm uninstall my-dashboards
```
{% include copy.html %}

## Common issues

The following issues can occur when you install OpenSearch Dashboards using Helm.

### The OpenSearch Dashboards pod restarts repeatedly and never becomes ready

If the OpenSearch Dashboards pod shows `0/1` in the `READY` column and its `RESTARTS` count keeps increasing, the pod might not have enough CPU to start before the startup probe fails. To confirm, run the following command:

```bash
kubectl describe pod -l app.kubernetes.io/instance=my-dashboards
```
{% include copy.html %}

The `Events` section of the output contains `Startup probe failed` messages and the `Container dashboards failed startup probe, will be restarted` message. To fix this issue, increase the CPU request and limit to 1 CPU:

```bash
helm upgrade my-dashboards opensearch/opensearch-dashboards --reuse-values \
  --set resources.requests.cpu=1 \
  --set resources.limits.cpu=1
```
{% include copy.html %}

The `--reuse-values` flag keeps the values that you set when you installed OpenSearch Dashboards. Without this flag, `helm upgrade` resets all values that you do not specify in the command to the chart defaults.

### OpenSearch Dashboards returns "OpenSearch Dashboards server is not ready yet"

If the OpenSearch Dashboards pod shows `1/1` in the `READY` column but OpenSearch Dashboards returns a `503` error with the `OpenSearch Dashboards server is not ready yet` message for more than a few minutes, OpenSearch Dashboards might not be able to reach OpenSearch. To confirm, check the OpenSearch Dashboards logs:

```bash
kubectl logs deploy/my-dashboards-opensearch-dashboards
```
{% include copy.html %}

If the logs contain `ConnectionError` messages and the `Unable to retrieve version information from OpenSearch nodes` message, OpenSearch Dashboards cannot connect to the OpenSearch service. OpenSearch Dashboards connects to OpenSearch at the address specified in the `opensearchHosts` parameter, which defaults to `https://opensearch-cluster-master:9200`. If your OpenSearch service has a different name, set `opensearchHosts` to `https://<service-name>:9200`, replacing `<service-name>` with the name of your OpenSearch service:

```bash
helm upgrade my-dashboards opensearch/opensearch-dashboards --reuse-values \
  --set opensearchHosts=https://<service-name>:9200
```
{% include copy.html %}

For information about how the OpenSearch chart names the service, see [Verify the deployment]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/helm/#verify-the-deployment).

## Related documentation

- [Preparing OpenSearch Dashboards for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#preparing-opensearch-dashboards-for-production)
