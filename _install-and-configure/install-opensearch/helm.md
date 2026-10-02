---
layout: default
title: Helm
parent: Installing OpenSearch
nav_order: 15
redirect_from:
  - /opensearch/install/helm/
---

# Installing OpenSearch using Helm

Helm is a package manager that allows you to easily install and manage OpenSearch in a Kubernetes cluster. You can define your OpenSearch configurations in a YAML file and use Helm to deploy your applications in a version-controlled and reproducible way.

The [Helm chart](https://github.com/opensearch-project/helm-charts) contains the resources described in the following table.

Resource | Description
:--- | :---
`Chart.yaml` |  Information about the chart.
`values.yaml` |  Default configuration values for the chart.
`templates` |  Templates that combine with values to generate the Kubernetes manifest files.

The specification in the default Helm chart supports many standard use cases and setups. You can modify the default chart to configure your desired specifications and set Transport Layer Security (TLS) and role-based access control (RBAC).

For information about the default configuration, steps to configure security, and configurable parameters, see the
[`README`](https://github.com/opensearch-project/helm-charts/blob/main/README.md).

The instructions here assume you have a Kubernetes cluster with Helm preinstalled. See the [Kubernetes documentation](https://kubernetes.io/docs/setup/) for steps to configure a Kubernetes cluster and the [Helm documentation](https://helm.sh/docs/intro/install/) to install Helm.
{: .note }

## Prerequisites

The default Helm chart deploys a three-node cluster. We recommend that you have at least 8 GiB of memory available for this deployment. You can expect the deployment to fail if, say, you have less than 4 GiB of memory available.

OpenSearch requires the `vm.max_map_count` kernel setting on each Kubernetes node to be at least `262144`. If the value is lower, the OpenSearch pods fail the bootstrap checks and enter the `CrashLoopBackOff` status. The `values.yaml` file in the following steps sets `sysctlInit.enabled` to `true`, which runs a privileged init container that sets `vm.max_map_count` on the node. If your nodes are already configured or your cluster does not allow privileged containers, remove this setting and configure `vm.max_map_count` on the nodes instead. For more information, see [Important settings]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#important-settings).

For OpenSearch 2.12 or later, you must provide `OPENSEARCH_INITIAL_ADMIN_PASSWORD` to start the cluster. Set the admin password in `values.yaml` under `extraEnvs`, following the [admin password requirements]({{site.url}}{{site.baseurl}}/security/configuration/demo-configuration/#admin-password-requirements).

## Install OpenSearch using Helm

1. Add `opensearch` [`helm-charts`](https://github.com/opensearch-project/helm-charts) repository to Helm:

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

   The available charts are provided in the response:

   ```bash
   NAME                            	CHART VERSION	APP VERSION	DESCRIPTION
   opensearch/opensearch           	{{site.opensearch_version}}        	{{site.opensearch_version}}      	A Helm chart for OpenSearch
   opensearch/opensearch-dashboards	{{site.opensearch_dashboards_version}}        	{{site.opensearch_dashboards_version}}      	A Helm chart for OpenSearch Dashboards
   opensearch/data-prepper         	0.3.1        	2.8.0      	A Helm chart for Data Prepper
   ```

1. Create a minimal `values.yaml` file, replacing `<custom-admin-password>` with your admin password:

   ```yaml
   config:
     opensearch.yml: |-
       cluster.name: opensearch-cluster
       network.host: 0.0.0.0
   extraEnvs:
     - name: OPENSEARCH_INITIAL_ADMIN_PASSWORD
       value: <custom-admin-password>
   sysctlInit:
     enabled: true
   ```
   {% include copy.html %}

1. Deploy OpenSearch:

   ```bash
   helm install my-deployment opensearch/opensearch -f values.yaml
   ```
   {% include copy.html %}

   The output shows the deployed release:

   ```yaml
   NAME: my-deployment
   LAST DEPLOYED: Fri Oct  2 02:28:00 2026
   NAMESPACE: default
   STATUS: deployed
   REVISION: 1
   TEST SUITE: None
   NOTES:
   Watch all cluster members come up.
     $ kubectl get pods --namespace=default -l app.kubernetes.io/component=opensearch-cluster-master -w
   ```

You can also build the `opensearch-<VERSION>.tgz` file manually:

1. Clone the [`helm-charts` repo](https://github.com/opensearch-project/helm-charts/tree/main):

   ```bash
   git clone https://github.com/opensearch-project/helm-charts.git
   ```
   {% include copy.html %}

1. Navigate to the `opensearch` directory:

   ```bash
   cd helm-charts/charts/opensearch
   ```
   {% include copy.html %}

1. Package the Helm chart:

   ```bash
   helm package .
   ```
   {% include copy.html %}

1. Deploy OpenSearch:

   ```bash
   helm install --generate-name opensearch-<VERSION>.tgz -f /path/to/values.yaml
   ```
   {% include copy.html %}

   Helm generates the release name, for example, `opensearch-{{ site.opensearch_version | split: "." | first }}-1790908448`. Use this name instead of `my-deployment` when you uninstall the release.

## Verify the deployment

To make sure your OpenSearch pods are up and running, run the following command:

```bash
kubectl get pods --namespace=default -w
```
{% include copy.html %}

Wait until all pods show `1/1` in the `READY` column and `Running` in the `STATUS` column, which takes about 1 minute:

```bash
NAME                          READY   STATUS    RESTARTS   AGE
opensearch-cluster-master-0   1/1     Running   0          41s
opensearch-cluster-master-1   1/1     Running   0          41s
opensearch-cluster-master-2   1/1     Running   0          41s
```

Once all pods are ready, you can verify that OpenSearch is running. Use one of the following methods.

### Port forwarding from your local machine

To access OpenSearch from your local machine, set up port forwarding from the OpenSearch service:

```bash
kubectl port-forward svc/opensearch-cluster-master 9200:9200
```
{% include copy.html %}

Leave this command running and open a separate terminal session. Then send a request to verify that OpenSearch is running:

```bash
curl -XGET https://localhost:9200 -u 'admin:<custom-admin-password>' --insecure
```
{% include copy.html %}

### Exec into the pod

Alternatively, you can access the OpenSearch shell directly:

```bash
kubectl exec -it opensearch-cluster-master-0 -- /bin/bash
```
{% include copy.html %}

Then send a request from inside the pod:

```bash
curl -XGET https://localhost:9200 -u 'admin:<custom-admin-password>' --insecure
```
{% include copy.html %}

### Expected response

The following is an example response:

```json
{
  "name" : "opensearch-cluster-master-0",
  "cluster_name" : "opensearch-cluster",
  "cluster_uuid" : "72e_wDs1QdWHmwum_E2feA",
  "version" : {
    "distribution" : "opensearch",
    "number" : <version>,
    "build_type" : <build-type>,
    "build_hash" : <build-hash>,
    "build_date" : <build-date>,
    "build_snapshot" : false,
    "lucene_version" : <lucene-version>,
    "minimum_wire_compatibility_version" : "2.19.0",
    "minimum_index_compatibility_version" : "2.0.0"
  },
  "tagline" : "The OpenSearch Project: https://opensearch.org/"
}
```

If you receive an `OpenSearch Security not initialized` error, the cluster is still starting up. Wait a few minutes for all nodes to fully initialize and form the cluster, then try the request again.
{: .note }

## Uninstall using Helm

To identify the OpenSearch deployment that you want to delete, run the following command:

```bash
helm list
```
{% include copy.html %}

The response lists the current Helm deployments:

```bash
NAME         	NAMESPACE	REVISION	UPDATED                                	STATUS  	CHART           	APP VERSION
my-deployment	default  	1       	2026-10-02 02:28:00.553978943 +0000 UTC	deployed	opensearch-{{site.opensearch_version}}	{{site.opensearch_version}}
```

To uninstall a deployment, run the following command:

```bash
helm uninstall my-deployment
```
{% include copy.html %}

Uninstalling the release does not delete the persistent volume claims (PVCs) that store the OpenSearch data. If you reinstall the release, OpenSearch reuses the existing data, including the original admin password. To delete the data, delete the PVCs:

```bash
kubectl delete pvc -l app.kubernetes.io/instance=my-deployment
```
{% include copy.html %}

For instructions to install OpenSearch Dashboards, see [Installing OpenSearch Dashboards using Helm]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/helm/).

## Common issues

Review these common issues and suggested solutions if your pods fail to start.

For issues that can occur with any installation method, such as HTTP requests to an HTTPS endpoint or a rejected admin password, see [Common issues]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#common-issues).

### The admin password in `values.yaml` has no effect

If `values.yaml` contains more than one `extraEnvs` key, Helm uses only the last one. A second `extraEnvs` key silently replaces the list that sets `OPENSEARCH_INITIAL_ADMIN_PASSWORD`, so `helm install` or `helm upgrade` succeeds, but the pods restart repeatedly. Define all environment variables in a single `extraEnvs` list:

```yaml
extraEnvs:
  - name: OPENSEARCH_INITIAL_ADMIN_PASSWORD
    value: <custom-admin-password>
  - name: <another-variable>
    value: <value>
```

## Related documentation

- [Preparing a cluster for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#preparing-a-cluster-for-production)
