---
layout: default
title: OpenSearch Kubernetes Operator
parent: Installing OpenSearch
nav_order: 10
has_children: true
redirect_from:
  - /clients/k8s-operator/
  - /tools/k8s-operator/
  - /install-and-configure/install-opensearch/operator/
---

# OpenSearch Kubernetes Operator

The OpenSearch Kubernetes Operator is an open-source Kubernetes operator that helps automate the deployment and provisioning of OpenSearch and OpenSearch Dashboards in a containerized environment. The operator can manage multiple OpenSearch clusters that can be scaled up and down depending on your needs.

## Installing the operator

The operator Helm chart installs a validation webhook whose certificate is issued by [cert-manager](https://cert-manager.io/), so cert-manager must be installed in your Kubernetes cluster before you install the operator. If cert-manager is not installed, the operator installation fails. For other options, see [Webhooks](https://github.com/opensearch-project/opensearch-k8s-operator/blob/main/docs/userguide/webhooks.md).

To install the operator using Helm, follow these steps:

1. Install `cert-manager`. First, add the `cert-manager` Helm repository:

   ```bash
   helm repo add jetstack https://charts.jetstack.io
   ```
   {% include copy.html %}

   Then install `cert-manager` and its custom resource definitions:

   ```bash
   helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --set crds.enabled=true
   ```
   {% include copy.html %}

1. Add the operator Helm repository:

   ```bash
   helm repo add opensearch-operator https://opensearch-project.github.io/opensearch-k8s-operator/
   ```
   {% include copy.html %}

1. Update your local Helm chart information. If you added the repository previously, this step ensures that Helm installs the latest operator version:

   ```bash
   helm repo update
   ```
   {% include copy.html %}

1. Install the operator:

   ```bash
   helm install opensearch-operator opensearch-operator/opensearch-operator
   ```
   {% include copy.html %}


## Quickstart

After you have successfully installed the operator, you can deploy your first OpenSearch cluster by creating a custom `OpenSearchCluster` object in Kubernetes.

The following steps show you how to deploy a minimal cluster and are only intended for demonstration purposes. To learn how to configure and manage your cluster for production environments, see [Configuration and management](#configuration-and-management).
{: .important}

Follow these steps to deploy the cluster, verify that it is running, access it, and clean up resources when finished:

1. Create a `cluster.yaml` file containing the following content:

    ```yaml
    apiVersion: opensearch.org/v1
    kind: OpenSearchCluster
    metadata:
      name: my-first-cluster
      namespace: default
    spec:
      security:
        tls:
          transport:
            generate: true
          http:
            generate: true
      general:
        serviceName: my-first-cluster
        version: "3"
      dashboards:
        enable: true
        version: "3"
        replicas: 1
        resources:
          requests:
            memory: "512Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "200m"
      nodePools:
        - component: nodes
          replicas: 3
          diskSize: "5Gi"
          nodeSelector:
          resources:
            requests:
              memory: "2Gi"
              cpu: "500m"
            limits:
              memory: "2Gi"
              cpu: "500m"
          roles:
            - "cluster_manager"
            - "data"
    ```
    {% include copy.html %}

    The `version` values must be quoted strings. The `security.tls` section is required: if you omit it, the OpenSearch pods never become ready. The `security.tls` section enables the Security plugin, and `generate: true` instructs the operator to generate self-signed TLS certificates. The operator also creates the `my-first-cluster-admin-password` and `my-first-cluster-dashboards-password` secrets containing randomly generated passwords. For more information, see [TLS]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-opensearch-config/#tls) and [User and role management]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-security/).
    {: .note}

1. Create the cluster by running the following command:

    ```bash
    kubectl apply -f cluster.yaml
    ```
    {% include copy.html %}

1. (Optional) Monitor the cluster status by running the following command:

    ```bash
    watch -n 2 kubectl get pods
    ```
    {% include copy.html %}

    The operator creates several pods:

    - A bootstrap pod (`my-first-cluster-bootstrap-0`) that helps with initial cluster manager discovery.
    - Three pods for the OpenSearch cluster (`my-first-cluster-nodes-0`, `my-first-cluster-nodes-1`, and `my-first-cluster-nodes-2`), named after the `nodes` node pool.
    - A pod for the OpenSearch Dashboards instance (`my-first-cluster-dashboards-<id>`).
    - A job pod (`my-first-cluster-securityconfig-update-<id>`) that applies the security configuration and then shows the `Completed` status.

    The cluster is ready when the three OpenSearch pods and the OpenSearch Dashboards pod show `1/1` in the `READY` column, which takes about 3 minutes. The operator then removes the bootstrap pod. You can now connect to your cluster using port forwarding.

1. Retrieve the generated password for the `admin` user from the `my-first-cluster-admin-password` secret:

    ```bash
    kubectl get secret my-first-cluster-admin-password -o jsonpath='{.data.password}' | base64 -d; echo
    ```
    {% include copy.html %}

1. Access OpenSearch Dashboards or use the OpenSearch REST API:

    - To access OpenSearch Dashboards, start port forwarding by running the following command:

        ```bash
        kubectl port-forward svc/my-first-cluster-dashboards 5601
        ```
        {% include copy.html %}

        Then go to [http://localhost:5601](http://localhost:5601) in your browser and log in as the `admin` user using the password that you retrieved in the previous step.

    - To use the OpenSearch REST API, start port forwarding by running the following command:

        ```bash
        kubectl port-forward svc/my-first-cluster 9200
        ```
        {% include copy.html %}

        Then open a second terminal and run the following command, replacing `<admin-password>` with the password that you retrieved in the previous step:

        ```bash
        curl -k -u 'admin:<admin-password>' "https://localhost:9200/_cat/nodes?v"
        ```
        {% include copy.html %}

        The response lists the three deployed nodes.

1. To delete your cluster, run the following command:

    ```bash
    kubectl delete -f cluster.yaml
    ```
    {% include copy.html %}

    This removes Kubernetes resources created by the operator but does not delete the persistent volumes. For a complete cleanup, delete the PVCs:

    ```bash
    kubectl delete pvc -l opensearch.org/opensearch-cluster=my-first-cluster
    ```
    {% include copy.html %}

Single-node clusters are not supported. Your cluster must have at least 3 nodes with the `master` or `cluster_manager` role configured.
{: .note}

## Configuration and management

After deploying your cluster, you can configure and manage it using the following guides:

- [Operator configuration]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-config/): Operator-level settings such as log levels, namespaces, and `pprof` endpoints.
- [OpenSearch cluster configuration]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-opensearch-config/): OpenSearch-specific settings including node pools, TLS, plugins, and keystore management.
- [OpenSearch Dashboards configuration]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-dashboards-config/): OpenSearch Dashboards settings, including authentication, base path, and TLS.
- [Kubernetes deployment customization]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-kubernetes-custom/): Kubernetes-level settings such as persistence, security contexts, volumes, and probes.
- [Cluster operations]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-cluster-ops/): Cluster lifecycle operations including recovery, upgrades, and volume expansion.
- [User and role management]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-security/): Security settings, users, roles, and access control.
- [Advanced management]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/operator-advanced/): Monitoring, ISM policies, index templates, and snapshot policies.

## Operator releases

Note the following about operator releases:

- For a compatibility matrix of the operator and OpenSearch releases, see [Compatibility](https://github.com/opensearch-project/opensearch-k8s-operator/blob/main/README.md#compatibility).
- The [OpenSearch Operator User Guide](https://github.com/opensearch-project/opensearch-k8s-operator/blob/main/docs/userguide/main.md) in the repository corresponds to the current development state of the code. To view the documentation for a specific released version, switch to the version tag in the GitHub menu.
- Feature requests are tracked as GitHub issues. If you would like a feature implemented and find a corresponding issue, note that an issue closed as completed means that the feature has been implemented in the development version. It may still take time before the feature is included in an official release. If you're unsure, review the project's release list on GitHub to see whether the feature appears in the release notes.

## Next steps

- Before you use the cluster in production, see [Preparing a cluster for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#preparing-a-cluster-for-production) and [Preparing OpenSearch Dashboards for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#preparing-opensearch-dashboards-for-production).

- For more information about customizing your OpenSearch cluster on Kubernetes, including data persistence, authentication methods, and scaling, see the [OpenSearch Kubernetes Operator User Guide](https://github.com/opensearch-project/opensearch-k8s-operator/blob/main/docs/userguide/main.md).

- To contribute to the development of the OpenSearch Kubernetes Operator, see the repository [design documents](https://github.com/opensearch-project/opensearch-k8s-operator/blob/main/docs/designs/high-level.md).

- For more information, see [OpenSearch Operator](https://operatorhub.io/operator/opensearch-operator).
