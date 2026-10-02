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

Install OpenSearch. For more information, see [Installing OpenSearch using Helm]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/helm/). The OpenSearch Dashboards chart connects to the `opensearch-cluster-master` service that the OpenSearch chart creates by default.

Make sure that you can send requests to your OpenSearch pod:

```bash
curl -XGET https://localhost:9200 -u 'admin:<custom-admin-password>' --insecure
```
{% include copy.html %}

The response contains the cluster information:

```json
{
  "name" : "opensearch-cluster-master-0",
  "cluster_name" : "opensearch-cluster",
  "cluster_uuid" : "72e_wDs1QdWHmwum_E2feA",
  "version" : {
    "distribution" : "opensearch",
    "number" : "3.1.0",
    "build_type" : "tar",
    "build_hash" : "8ff7c6ee924a49f0f59f80a6e1c73073c8904214",
    "build_date" : "2025-06-21T08:05:50.445588571Z",
    "build_snapshot" : false,
    "lucene_version" : "10.2.1",
    "minimum_wire_compatibility_version" : "2.19.0",
    "minimum_index_compatibility_version" : "2.0.0"
  },
  "tagline" : "The OpenSearch Project: https://opensearch.org/"
}
```

## Install OpenSearch Dashboards using Helm

The following steps use the `opensearch` Helm repository that you added when you installed OpenSearch.

1. Deploy OpenSearch Dashboards:

   ```bash
   helm install my-dashboards opensearch/opensearch-dashboards
   ```
   {% include copy.html %}

   To customize the deployment, pass in the values that you want to override using a custom YAML file:

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

1. To make sure your OpenSearch Dashboards pod is up and running, run the following command:

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

1. Set up port forwarding from the OpenSearch Dashboards service:

   ```bash
   kubectl port-forward svc/my-dashboards-opensearch-dashboards 5601
   ```
   {% include copy.html %}

1. In a web browser, go to `http://localhost:5601` and log in as the `admin` user using the custom admin password that you set when you installed OpenSearch. For more information, see [Accessing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#accessing-opensearch-dashboards).

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
my-dashboards	default  	1       	2026-10-02 02:30:49.128429961 +0000 UTC	deployed	opensearch-dashboards-3.9.0	3.9.0
my-deployment	default  	1       	2026-10-02 02:28:00.553978943 +0000 UTC	deployed	opensearch-3.9.0           	3.9.0
```

To uninstall a deployment, run the following command:

```bash
helm uninstall my-dashboards
```
{% include copy.html %}

## Related documentation

- [Preparing OpenSearch Dashboards for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#preparing-opensearch-dashboards-for-production)
