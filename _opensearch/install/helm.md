---
layout: default
title: Helm
parent: Install OpenSearch
nav_order: 6
---

# Helm

Helm is a package manager that allows you to easily install and manage Elasticsearch in a Kubernetes cluster. You can define your Elasticsearch configurations in a YAML file and use Helm to deploy your applications in a version-controlled and reproducible way.

The Helm chart contains the resources described in the following table.

Resource | Description
:--- | :---
`Chart.yaml` |  Information about the chart.
`values.yaml` |  Default configuration values for the chart.
`templates` |  Templates that combine with values to generate the Kubernetes manifest files.

The specification in the default Helm chart supports many standard use cases and setups. You can modify the default chart to configure your desired specifications and set Transport Layer Security (TLS) and role-based access control (RBAC).

For information about the default configuration, steps to configure security, and configurable parameters, see the
[README](https://github.com/opensearch-project/opensearch-devops/blob/main/Helm/README.md).

The instructions here assume you have a Kubernetes cluster with Helm preinstalled. See the [Kubernetes documentation](https://kubernetes.io/docs/setup/) for steps to configure a Kubernetes cluster and the [Helm documentation](https://helm.sh/docs/intro/install/) to install Helm.
{: .note }

## Install OpenSearch using Helm

1. Clone the [Helm/opensearch](https://github.com/opensearch-project/opensearch-devops/) repository:

   ```bash
   git clone https://github.com/opensearch-project/opensearch-devops.git
   ```

1. Change to the `opensearch` directory:

   ```bash
   cd Helm/opensearch
   ```

1. Package the Helm chart:

   ```bash
   helm package .
   ```

1. Deploy Elasticsearch:

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
NAME: opensearch-1-1628184200
LAST DEPLOYED: Thu Aug  5 13:23:25 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

To make sure your Elasticsearch pod is up and running, run the following command:

```bash
$ kubectl get pods
NAME                                                  READY   STATUS    RESTARTS   AGE
opensearch-cluster-master-0                           1/1     Running   0          3m56s
opensearch-cluster-master-1                           1/1     Running   0          3m56s
opensearch-cluster-master-2                           1/1     Running   0          3m56s
opensearch-dashboards-1-1628184109-584ff47c54-gghf2   1/1     Running   0          5m25s
```

To access the Elasticsearch shell:

```bash
$ kubectl exec -it opensearch-cluster-master-0 -- /bin/bash
```

You can send requests to the pod to verify that Elasticsearch is up and running:

```bash
$ curl -XGET https://localhost:9200 -u 'admin:admin' --insecure
```

## Install OpenSearch Dashboards using Helm

1. Clone the [Helm/opensearch-dashboards](https://github.com/opensearch-project/opensearch-devops/tree/main/Helm/opensearch) repository:

   ```bash
   git clone https://github.com/opensearch-project/opensearch-devops/tree/main/Helm/opensearch-dashboards
   ```

1. Change to the `opensearch-dashboards` directory:

   ```bash
   cd opensearch-dashboards
   ```

1. Package the Helm chart:

   ```bash
   helm package .
   ```

1. Deploy Elasticsearch:

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
NAME: opensearch-dashboards-1-1628184109
LAST DEPLOYED: Thu Aug  5 13:21:55 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

To get the the application URL, run the following commands:

```
export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=opensearch-dashboards,app.kubernetes.io/instance=opensearch-dashboards-1-1628184109" -o jsonpath="{.items[0].metadata.name}")

export CONTAINER_PORT=$(kubectl get pod --namespace default $POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")

echo "Visit http://127.0.0.1:8080 to use your application"
kubectl --namespace default port-forward $POD_NAME 8080:$CONTAINER_PORT
```

To set up port forwarding to access Kibana, exit the Elasticsearch shell and run the following command:
```bash
$ kubectl port-forward deployment/opensearch-dashboards-1-1628184109 5601
```

You can now access Kibana from your browser at: http://localhost:5601.

## Uninstall using Helm

To identify the opendistro-es deployment to be deleted:

```bash
helm list
```

To delete or uninstall this deployment, run the following command:

```bash
helm delete <opendistro-es deployment>
```
