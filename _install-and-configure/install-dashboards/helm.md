---
layout: default
title: Helm
parent: Installing OpenSearch Dashboards
nav_order: 35
redirect_from: 
  - /dashboards/install/helm/
---

# Run OpenSearch Dashboards using Helm

Helm is a package manager that allows you to easily install and manage OpenSearch Dashboards in a Kubernetes cluster. You can define your OpenSearch configurations in a YAML file and use Helm to deploy your applications in a version-controlled and reproducible way.

The Helm chart contains the resources described in the following table.

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

Before you get started, you must first use [Helm to install OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/install/helm/).

Make sure that you can send requests to your OpenSearch pod:

```json
$ curl -XGET https://localhost:9200 -u 'admin:admin' --insecure
{
  "name" : "opensearch-cluster-master-1",
  "cluster_name" : "opensearch-cluster",
  "cluster_uuid" : "hP2gq5bPS3SLp8Z7wXm8YQ",
  "version" : {
    "distribution" : "opensearch",
    "number" : "1.0.0",
    "build_type" : "tar",
    "build_hash" : "34550c5b17124ddc59458ef774f6b43a086522e3",
    "build_date" : "2021-07-02T23:22:21.383695Z",
    "build_snapshot" : false,
    "lucene_version" : "8.8.2",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "The OpenSearch Project: https://opensearch.org/"
}
```

## Install OpenSearch Dashboards using Helm

1. Change to the `opensearch-dashboards` directory:

   ```bash
   cd opensearch-dashboards
   ```

1. Package the Helm chart:

   ```bash
   helm package .
   ```

1. Deploy OpenSearch Dashboards:

   ```bash
   helm install --generate-name opensearch-dashboards-1.0.0.tgz
   ```
   The output shows you the specifications instantiated from the install.
   To customize the deployment, pass in the values that you want to override with a custom YAML file:

   ```bash
   helm install --values=customvalues.yaml opensearch-dashboards-1.0.0.tgz
   ```

#### Sample output

```yaml
NAME: opensearch-dashboards-1-1629223356
LAST DEPLOYED: Tue Aug 17 18:02:37 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
1. Get the application URL by running these commands:
  export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=opensearch-dashboards,app.kubernetes.io/instance=op
ensearch-dashboards-1-1629223356" -o jsonpath="{.items[0].metadata.name}")
  export CONTAINER_PORT=$(kubectl get pod --namespace default $POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
  echo "Visit http://127.0.0.1:8080 to use your application"
  kubectl --namespace default port-forward $POD_NAME 8080:$CONTAINER_PORT
```

To make sure your OpenSearch Dashboards pod is up and running, run the following command:

```bash
$ kubectl get pods
NAME                                                  READY   STATUS    RESTARTS   AGE
opensearch-cluster-master-0                           1/1     Running   0          4m35s
opensearch-cluster-master-1                           1/1     Running   0          4m35s
opensearch-cluster-master-2                           1/1     Running   0          4m35s
opensearch-dashboards-1-1629223356-758bd8747f-8www5   1/1     Running   0          66s
```

To set up port forwarding to access OpenSearch Dashboards, exit the OpenSearch shell and run the following command:

```bash
$ kubectl port-forward deployment/opensearch-dashboards-1-1629223356 5601
```

You can now access OpenSearch Dashboards from your browser at: http://localhost:5601.


## Uninstall using Helm

To identify the OpenSearch Dashboards deployment that you want to delete:

```bash
$ helm list
NAME  NAMESPACE REVISION  UPDATED STATUS  CHART APP VERSION
opensearch-1-1629223146 default 1 2021-08-17 17:59:07.664498239 +0000 UTCdeployedopensearch-1.0.0           1.0.0      
opensearch-dashboards-1-1629223356 default  1 2021-08-17  18:02:37.600796946 +0000  UTCdepl
oyedopensearch-dashboards-1.0.0 1.0.0        
```

To delete or uninstall a deployment, run the following command:

```bash
helm delete opensearch-dashboards-1-1629223356
```
