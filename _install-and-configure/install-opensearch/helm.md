---
layout: default
title: Helm
parent: Installing OpenSearch
nav_order: 6
redirect_from:
  - /opensearch/install/helm/
---

# Helm

Helm is a package manager that allows you to easily install and manage OpenSearch in a Kubernetes cluster. You can define your OpenSearch configurations in a YAML file and use Helm to deploy your applications in a version-controlled and reproducible way.

The Helm chart contains the resources described in the following table.

Resource | Description
:--- | :---
`Chart.yaml` |  Information about the chart.
`values.yaml` |  Default configuration values for the chart.
`templates` |  Templates that combine with values to generate the Kubernetes manifest files.

The specification in the default Helm chart supports many standard use cases and setups. You can modify the default chart to configure your desired specifications and set Transport Layer Security (TLS) and role-based access control (RBAC).

For information about the default configuration, steps to configure security, and configurable parameters, see the
[README](https://github.com/opensearch-project/helm-charts/blob/main/README.md).

The instructions here assume you have a Kubernetes cluster with Helm preinstalled. See the [Kubernetes documentation](https://kubernetes.io/docs/setup/) for steps to configure a Kubernetes cluster and the [Helm documentation](https://helm.sh/docs/intro/install/) to install Helm.
{: .note }

## Prerequisites

The default Helm chart deploys a three-node cluster. We recommend that you have at least 8 GiB of memory available for this deployment. You can expect the deployment to fail if, say, you have less than 4 GiB of memory available.

## Install OpenSearch using Helm

1. Add `opensearch` [helm-charts](https://github.com/opensearch-project/helm-charts) repository to Helm:

   ```bash
   helm repo add opensearch https://opensearch-project.github.io/helm-charts/
   ```
   {% include copy.html %}

1. Update the available charts locally from charts repositories:

   ```bash
   helm repo update
   ```
   {% include copy.html %}

1. To search for the OpenSearch-related Helm charts:

   ```bash
   helm search repo opensearch
   ```
   {% include copy.html %}

   ```bash
   NAME                            	CHART VERSION	APP VERSION	DESCRIPTION                           
   opensearch/opensearch           	1.0.7        	1.0.0      	A Helm chart for OpenSearch           
   opensearch/opensearch-dashboards	1.0.4        	1.0.0      	A Helm chart for OpenSearch Dashboards
   ```

1. Deploy OpenSearch:

   ```bash
   helm install my-deployment opensearch/opensearch
   ```
   {% include copy.html %}

You can also build the `opensearch-1.0.0.tgz` file manually:

1. Change to the `opensearch` directory:

   ```bash
   cd charts/opensearch
   ```
   {% include copy.html %}

1. Package the Helm chart:

   ```bash
   helm package .
   ```
   {% include copy.html %}

1. Deploy OpenSearch:

   ```bash
   helm install --generate-name opensearch-1.0.0.tgz
   ```
   {% include copy.html %}

   The output shows you the specifications instantiated from the install.
   To customize the deployment, pass in the values that you want to override with a custom YAML file:

   ```bash
   helm install --values=customvalues.yaml opensearch-1.0.0.tgz
   ```
   {% include copy.html %}

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
{% include copy.html %}

You can send requests to the pod to verify that OpenSearch is up and running:

```json
$ curl -XGET https://localhost:9200 -u 'admin:admin' --insecure
{
  "name" : "opensearch-cluster-master-1",
  "cluster_name" : "opensearch-cluster",
  "cluster_uuid" : "hP2gq5bPS3SLp8Z7wXm8YQ",
  "version" : {
    "distribution" : "opensearch",
    "number" : <version>,
    "build_type" : <build-type>,
    "build_hash" : <build-hash>,
    "build_date" : <build-date>,
    "build_snapshot" : false,
    "lucene_version" : <lucene-version>,
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
{% include copy.html %}

For steps to install OpenSearch Dashboards, see [Helm to install OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/install/helm/).