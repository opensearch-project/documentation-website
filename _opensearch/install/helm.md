---
layout: default
title: Helm
parent: Install OpenSearch
nav_order: 6
canonical_url: https://docs.opensearch.org/latest/install-and-configure/install-opensearch/helm/
---

# Run OpenSearch using Helm

Helm is a package manager that allows you to easily install and manage OpenSearch in a Kubernetes cluster. You can define your OpenSearch configurations in a YAML file and use Helm to deploy your applications in a version-controlled and reproducible way.

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

The default Helm chart deploys a three-node cluster. We recommend that you have at least 8 GiB of memory available for this deployment. You can expect the deployment to fail if, say, you have less than 4 GiB of memory available.

## Install OpenSearch using Helm

1. Clone the [helm-charts](https://github.com/opensearch-project/helm-charts) repository:

   ```bash
   git clone https://github.com/opensearch-project/helm-charts
   ```

1. Change to the `opensearch` directory:

   ```bash
   cd charts/opensearch
   ```

1. Package the Helm chart:

   ```bash
   helm package .
   ```

1. Deploy OpenSearch:

   ```bash
   helm install --generate-name opensearch-1.0.0.tgz
   ```
   The output shows you the specifications instantiated from the install.
   To customize the deployment, pass in the values that you want to override with a custom YAML file:

   ```bash
   helm install --values=customvalues.yaml opensearch-1.0.0.tgz
   ```

#### Sample output

  ```yaml
  NAME: opensearch-1-1629223146
  LAST DEPLOYED: Tue Aug 17 17:59:07 2021
  NAMESPACE: default
  STATUS: deployed
  REVISION: 1
  TEST SUITE: None
  NOTES:
  Watch all cluster members come up.
    $ kubectl get pods --namespace=default -l app=opensearch-cluster-master -w
  ```

To make sure your OpenSearch pod is up and running, run the following command:

```bash
$ kubectl get pods
NAME                                                  READY   STATUS    RESTARTS   AGE
opensearch-cluster-master-0                           1/1     Running   0          3m56s
opensearch-cluster-master-1                           1/1     Running   0          3m56s
opensearch-cluster-master-2                           1/1     Running   0          3m56s
```

To access the OpenSearch shell:

```bash
$ kubectl exec -it opensearch-cluster-master-0 -- /bin/bash
```

You can send requests to the pod to verify that OpenSearch is up and running:

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

## Uninstall using Helm

To identify the OpenSearch deployment that you want to delete:

```bash
$ helm list
NAME  NAMESPACEREVISIONUPDATED  STATUS  CHART APP VERSION
opensearch-1-1629223146 default 1 2021-08-17 17:59:07.664498239 +0000 UTCdeployedopensearch-1.0.0    1.0.0       
```

To delete or uninstall a deployment, run the following command:

```bash
helm delete opensearch-1-1629223146
```

For steps to install OpenSearch Dashboards, see [Helm to install OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/install/helm/).
