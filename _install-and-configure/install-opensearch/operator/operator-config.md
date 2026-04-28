---
layout: default
title: Operator configuration
parent: OpenSearch Kubernetes Operator
grand_parent: Installing OpenSearch
nav_order: 10
---

# Operator configuration

You can configure general options for the operator itself using Helm values you provide during installation: `helm install opensearch-operator opensearch-operator/opensearch-operator -f values.yaml`.

For a list of all supported values, see the default chart [`values.yaml`](https://github.com/opensearch-project/opensearch-k8s-operator/blob/main/charts/opensearch-operator/values.yaml). The following are some important configuration options:

```yaml
manager:
  # Log level of the operator. Possible values: debug, info, warn, error
  loglevel: info

  # If specified, the operator will be restricted to watch objects only in the desired namespace. The default is to watch all namespaces.
  # To watch multiple namespaces, either separate their names using commas or define them as a list.
  # Examples:
  # watchNamespaces: 'ns1,ns2'
  # watchNamespace: [ns1, ns2]
  watchNamespace:

  # Configure extra environment variables for the operator. You can also pull them from secrets or ConfigMaps.
  extraEnv: []
  #  - name: MY_ENV
  #    value: somevalue
```
{% include copy.html %}

The operator uses admission controller webhooks to validate OpenSearch Custom Resource Definitions (CRDs).
{: .note}

## pprof endpoints

To diagnose memory issues, you can enable the standard Go [`pprof`](https://pkg.go.dev/net/http/pprof) endpoints by adding the following to your `values.yaml`:

```yaml
manager:
  pprofEndpointsEnabled: true
```
{% include copy.html %}

For security reasons, the endpoints are only exposed on `localhost` inside the pod. To access them, use port-forwarding:

```bash
kubectl port-forward deployment/opensearch-operator-controller-manager 6060
```
{% include copy.html %}

Then use the Go `pprof` tool from another terminal:

```bash
go tool pprof http://localhost:6060/debug/pprof/heap
```
{% include copy.html %}

## Custom operator communication URL

You can configure the operator to use a custom URL when communicating with OpenSearch by setting the `operatorClusterURL` field:

```yaml
spec:
  general:
    serviceName: my-cluster
    version: "3.0.0"
    httpPort: 9200
    vendor: "opensearch"
    operatorClusterURL: "opensearch.example.com"  # Optional: custom FQDN for operator communication
```
{% include copy.html %}

Use this configuration when you have external certificates (for example, from cert-manager) valid for a specific FQDN. The operator uses this custom URL instead of the default internal Kubernetes DNS name, allowing you to use the same certificate for both external access and operator communication.
