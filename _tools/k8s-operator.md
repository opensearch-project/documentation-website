---
layout: default
title: OpenSearch Kubernetes Operator
nav_order: 80
has_children: false
---

The OpenSearch Kubernetes Operator is an open-source kubernetes operator that helps automate the deployment and provisioning of OpenSearch and OpenSearch Dashboards in a containerized environment. The operator can manage multiple OpenSearch clusters that can be scaled up and down depending on your needs. 


## Installation 

There are two ways to get started with the operator:

- [Use a Helm chart](#use-a-helm-chart).
- [Use a local installation](#use-a-local-installation).

### Use a Helm chart

If you use Helm to manage your Kubernetes cluster, you can use the OpenSearch Kubernetes Operator's Cloud Native Computing Foundation (CNCF) project stored in Artifact Hub, a web-based application for finding, installing, and publishing CNCF packages. 

To begin, log in to your Kubernetes cluster and add the Helm repository (repo) from [Artifact Hub](https://artifacthub.io/packages/helm/opensearch-operator/opensearch-operator/). 

```
helm repo add opensearch-operator https://opster.github.io/opensearch-k8s-operator/
```

Make sure that the repo is included in your Kubernetes cluster. 

```
helm repo list | grep opensearch
```

Both the `opensearch` and `opensearch-operator` repos appear in the list of repos.


Install the manager that operates all of the OpenSearch Kubernetes Operator's actions. 

```
helm install opensearch-operator opensearch-operator/opensearch-operator
```

After the installation completes, the operator returns information on the deployment with `STATUS: deployed`. Then you can configure and start your [OpenSearch cluster](#deploy-a-new-opensearch-cluster).

### Use a local installation

If you want to create a new Kubernetes cluster on your existing machine, use a local installation. 

If this is your first time running Kubernetes and you intend to run through these instructions on your laptop, make sure that you have the following installed: 

- [Kubernetes](https://kubernetes.io/docs/tasks/tools/) 
- [Docker](https://docs.docker.com/engine/install/)
- [minikube](https://minikube.sigs.k8s.io/docs/start/)

Before running through the installation steps, make sure that you have a Kubernetes environment running locally. When using minikube, open a new terminal window and enter `minikube start`. Kubernetes will now use a containerized minikube cluster with a namespace called `default`.

Then install the OpenSearch Kubernetes Operator using the following steps:

1. In your preferred directory, clone the [OpenSearch Kubernetes Operator repo](https://github.com/Opster/opensearch-k8s-operator). Navigate into repo's directory using `cd`.
2. Go to the `opensearch-operator` folder.
3. Enter `make build manifests`.
4. Start a Kubernetes cluster. When using minikube, open a new terminal window and enter `minikube start`. Kubernetes will now use a containerized minikube cluster with a namespace called `default`. Make sure that `~/.kube/config` points to the cluster.

```yml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: /Users/naarcha/.minikube/ca.crt
    extensions:
    - extension:
        last-update: Mon, 29 Aug 2022 10:11:47 CDT
        provider: minikube.sigs.k8s.io
        version: v1.26.1
      name: cluster_info
    server: https://127.0.0.1:61661
  name: minikube
contexts:
- context:
    cluster: minikube
    extensions:
    - extension:
        last-update: Mon, 29 Aug 2022 10:11:47 CDT
        provider: minikube.sigs.k8s.io
        version: v1.26.1
      name: context_info
    namespace: default
    user: minikube
  name: minikube
current-context: minikube
kind: Config
preferences: {}
users:
- name: minikube
  user:
    client-certificate: /Users/naarcha/.minikube/profiles/minikube/client.crt
    client-key: /Users/naarcha/.minikube/profiles/minikube/client.key
```    
   
5. Enter `make install` to create the CustomResourceDefinition that runs in your Kubernetes cluster. 
6. Start the OpenSearch Kubernetes Operator. Enter `make run`. 

## Verify Kubernetes deployment

To ensure that Kubernetes recognizes the OpenSearch Kubernetes Operator as a namespace, enter `k get ns | grep opensearch`. Both `opensearch` and `opensearch-operator-system` should appear as `Active`.

With the operator active, use `k get pod -n opensearch-operator-system` to make sure that the operator's pods are running. 

```
NAME                                              READY   STATUS   RESTARTS   AGE
opensearch-operator-controller-manager-<pod-id>   2/2     Running  0          25m
```

With the Kubernetes cluster running, you can now run OpenSearch inside the cluster.

## Deploy a new OpenSearch cluster

From your cloned OpenSearch Kubernetes Operator repo, navigate to the `opensearch-operator/examples` directory. There you'll find the `opensearch-cluster.yaml` file, which can be customized to the needs of your cluster, including the `clusterName` that acts as the namespace in which your new OpenSearch cluster will reside.

With your cluster configured, run the `kubectl apply` command.

```
kubectl apply -f opensearch-cluster.yaml
```

The operator creates several pods, including a bootstrap pod, three OpenSearch cluster pods, and one Dashboards pod. To connect to your cluster, use the `port-forward` command.

```
kubectl port-forward svc/my-cluster-dashboards 5601
```

Open http://localhost:5601 in your preferred browser and log in with the default demo credentials `admin / admin`. You can also run curl commands against the OpenSearch REST API by forwarding to port 9200.

```
kubectl port-forward svc/my-cluster 9200
```

In order to delete the OpenSearch cluster, delete the cluster resources. The following command deletes the cluster namespace and all its resources.

```
kubectl delete -f opensearch-cluster.yaml
```

## Next steps

To learn more about how to customize your Kubernetes OpenSearch cluster, including data persistence, authentication methods, and scaling, see the [OpenSearch Kubernetes Operator User Guide](https://github.com/Opster/opensearch-k8s-operator/blob/main/docs/userguide/main.md). 

If you want to contribute to the development of the OpenSearch Kubernetes Operator, see the repo [design documents](https://github.com/Opster/opensearch-k8s-operator/blob/main/docs/designs/high-level.md).