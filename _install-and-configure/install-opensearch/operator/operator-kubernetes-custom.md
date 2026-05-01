---
layout: default
title: Kubernetes deployment customization
parent: OpenSearch Kubernetes Operator
grand_parent: Installing OpenSearch
nav_order: 40
---

# Kubernetes deployment customization

Besides configuring OpenSearch itself, you can also customize how the operator deploys the OpenSearch and OpenSearch Dashboards pods.

## Data persistence

By default, the operator creates OpenSearch node pools with persistent storage from the default [Storage Class](https://kubernetes.io/docs/concepts/storage/storage-classes/). This behavior can be changed per node pool. You may supply an alternative storage class and access mode, or configure `hostPath` or `emptyDir` storage.

The available storage options are:

### Persistent Volume Claim (PVC)

The default option is persistent storage using PVCs. You can explicitly define the `storageClass`, `annotations`, and `labels` if needed:

```yaml
nodePools:
  - component: masters
    replicas: 3
    diskSize: "30Gi"
    roles:
      - "data"
      - "master"
    persistence:
      pvc:
        storageClass: mystorageclass # Set the name of the storage class to be used
        accessModes: # You can change the accessMode
          - ReadWriteOnce
        annotations: # You can add annotations
          test.io/crypt-key-id: "your-kms-key-id"
        labels: # You can add labels
          team: "backend-data"
```
{% include copy.html %}

### emptyDir

If you do not want to use persistent storage, you can use the `emptyDir` option. Note that this can lead to data loss, so you should only use this option for testing or for data that is otherwise persisted.

```yaml
nodePools:
  - component: masters
    replicas: 3
    diskSize: "30Gi"
    roles:
      - "data"
      - "master"
    persistence:
      emptyDir: {} # This configures emptyDir
```
{% include copy.html %}

If you are using `emptyDir`, set `spec.general.drainDataNodes` to `true`. This ensures that shards are drained from the pods before rolling upgrades or restart operations are performed.

### hostPath

As a last option, you can use `hostPath`. Using `hostPath` is strongly discouraged. By default, the operator applies pod anti-affinity to prevent multiple pods from scheduling on the same node, which helps when using `hostPath`. However, if you need stricter control, configure explicit affinity rules for the node pool to ensure that multiple pods do not schedule to the same Kubernetes host.

```yaml
nodePools:
  - component: masters
    replicas: 3
    diskSize: "30Gi"
    roles:
      - "data"
      - "master"
    persistence:
      hostPath:
        path: "/var/opensearch" # Define the path on the host here
```
{% include copy.html %}

## Security context for pods and containers

You can set the security context for the OpenSearch pods and the OpenSearch Dashboards pod to define privilege and access control settings. To specify security settings for pods, include the `podSecurityContext` field. For containers, include the `securityContext` field.

The structure is the same for both OpenSearch pods (in `spec.general`) and the OpenSearch Dashboards pod (in `spec.dashboards`):

```yaml
spec:
  general:
    podSecurityContext:
      runAsUser: 1000
      runAsGroup: 1000
      runAsNonRoot: true
    securityContext:
      allowPrivilegeEscalation: false
      privileged: false
  dashboards:
    podSecurityContext:
      fsGroup: 1000
      runAsNonRoot: true
    securityContext:
      capabilities:
        drop:
          - ALL
      privileged: false
```
{% include copy.html %}

The OpenSearch pods by default launch an init container to configure the volume. This container needs to run with root permissions and does not use a defined `securityContext`. If your Kubernetes environment does not allow containers with the root user, [disable this init helper](#disabling-the-init-helper). In this situation, set `general.setVMMaxMapCount` to `false` because this feature also launches an init container with root.

The bootstrap pod started during initial cluster setup uses the same pod `securityContext` as the OpenSearch pods (with the same limitations for the init containers).
{: .note}

The bootstrap pod uses persistent storage (PVC) to maintain cluster state across restarts during initialization. This prevents cluster formation failures when the bootstrap pod restarts after the security configuration update job completes. The bootstrap PVC is automatically created and deleted along with the bootstrap pod.

## Labels or annotations on OpenSearch nodes

You can add additional labels or annotations to the node pool configuration. This is useful for integration with other applications, such as a service mesh, or for configuring a Prometheus scrape endpoint.

Additionally, you can configure annotations globally using the `spec.general.annotations` field. These annotations apply not only to the node pool but also to Kubernetes services.

```yaml
spec:
  nodePools:
    - component: masters
      replicas: 3
      diskSize: "5Gi"
      labels: # Add any extra labels as key-value pairs here
        someLabelKey: someLabelValue
      annotations: # Add any extra annotations as key-value pairs here
        someAnnotationKey: someAnnotationValue
      nodeSelector:
      resources:
        requests:
          memory: "2Gi"
          cpu: "500m"
        limits:
          memory: "2Gi"
          cpu: "500m"
      roles:
        - "data"
        - "master"
```
{% include copy.html %}

Any annotations and labels defined are added directly to the node pool pods.

## Add labels or annotations to the OpenSearch Dashboards deployment

You can add labels or annotations to the OpenSearch Dashboards pod specification. This is helpful if you want OpenSearch Dashboards to be part of a service mesh or integrate with other applications that rely on labels or annotations.

```yaml
spec:
  dashboards:
    enable: true
    version: 3.0.0
    replicas: 1
    labels: # Add any extra labels as key-value pairs here
      someLabelKey: someLabelValue
    annotations: # Add any extra annotations as key-value pairs here
      someAnnotationKey: someAnnotationValue
```
{% include copy.html %}

Any annotations and labels defined are added directly to the OpenSearch Dashboards pods.

## Priority class on OpenSearch nodes

You can configure OpenSearch nodes to use a `PriorityClass` by specifying the priority class name. This helps prevent unwanted evictions of your OpenSearch nodes.

```yaml
spec:
  nodePools:
    - component: masters
      replicas: 3
      diskSize: "5Gi"
      priorityClassName: somePriorityClassName
      resources:
        requests:
          memory: "2Gi"
          cpu: "500m"
        limits:
          memory: "2Gi"
          cpu: "500m"
      roles:
        - "master"
```
{% include copy.html %}

## Pod affinity

By default, the operator applies pod anti-affinity rules to prevent multiple pods from the same OpenSearch cluster from being scheduled on the same node. This improves high availability by reducing the risk of multiple pods being affected by a single node failure.

The default anti-affinity uses `PreferredDuringSchedulingIgnoredDuringExecution`, which is a soft preference that won't prevent scheduling if no other nodes are available, but will prefer to spread pods across nodes.

You can override this default behavior by explicitly setting the `affinity` field in your node pool, bootstrap, or OpenSearch Dashboards configuration:

```yaml
spec:
  nodePools:
    - component: masters
      replicas: 3
      diskSize: "30Gi"
      roles:
        - "master"
        - "data"
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchLabels:
                  opensearch.org/opensearch-cluster: my-cluster
              topologyKey: kubernetes.io/hostname
  bootstrap:
    affinity:
      podAntiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchLabels:
                  opensearch.org/opensearch-cluster: my-cluster
              topologyKey: kubernetes.io/hostname
  dashboards:
    enable: true
    affinity:
      podAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchLabels:
                  app: opensearch-dashboards
              topologyKey: kubernetes.io/zone
```
{% include copy.html %}

If you set an explicit `affinity`, it completely replaces the default anti-affinity behavior. To disable anti-affinity entirely, set `affinity: {}`.

## Sidecar containers

You can deploy additional sidecar containers alongside OpenSearch in the same pod. This is useful for log shipping, monitoring agents, or other auxiliary services that need to run alongside OpenSearch nodes.

```yaml
spec:
  nodePools:
    - component: masters
      replicas: 3
      diskSize: "30Gi"
      resources:
        requests:
          memory: "2Gi"
          cpu: "500m"
        limits:
          memory: "2Gi"
          cpu: "500m"
      roles:
        - "master"
        - "data"
      sidecarContainers:
        - name: log-shipper
          image: fluent/fluent-bit:latest
          resources:
            requests:
              memory: "64Mi"
              cpu: "100m"
            limits:
              memory: "128Mi"
              cpu: "200m"
          volumeMounts:
            - name: varlog
              mountPath: /var/log
        - name: monitoring-agent
          image: prometheus/node-exporter:latest
          ports:
            - containerPort: 9100
              name: metrics
```
{% include copy.html %}

Sidecar containers share the same network namespace and storage volumes as the OpenSearch container because they run in the same pod.

## Additional volumes

You can mount additional volumes into the OpenSearch pods to provide additional configuration (for example, plugin config files). Supported volume types include `ConfigMap`, `Secret`, `emptyDir`, projected volumes, and CSI volumes.

Provide an array of additional volumes in either `spec.general.additionalVolumes` or `spec.dashboards.additionalVolumes`:

```yaml
spec:
  general:
    additionalVolumes:
      - name: example-configmap
        path: /path/to/mount/volume
        #subPath: mykey # Add this to mount only a specific key of the configmap/secret
        configMap:
          name: config-map-name
        restartPods: true # Set this to true to restart the pods when the content of the configMap changes
      - name: temp
        path: /tmp
        emptyDir: {}
      - name: example-csi-volume
        path: /path/to/mount/volume
        #subPath: "subpath" # Add this to mount the CSI volume at a specific subpath
        csi:
          driver: csi-driver-name
          readOnly: true
          volumeAttributes:
            secretProviderClass: example-secret-provider-class
      - name: example-projected-volume
        path: /path/to/mount/volume
        projected:
          sources:
            - serviceAccountToken:
                path: "token"
      - name: example-persistentvolumeclaim-volume
        path: /path/to/mount/volume
        persistentVolumeClaim:
          claimName: claim-name
      - name: nfs-volume
        path: /mnt/backups/opensearch
        nfs:
          server: 192.168.1.233
          path: /export/backups/opensearch
          readOnly: false # Optional, defaults to false
  dashboards:
    additionalVolumes:
      - name: example-secret
        path: /path/to/mount/volume
        secret:
          secretName: secret-name
```
{% include copy.html %}

### NFS volume support

NFS volumes can be mounted directly into OpenSearch pods without requiring external provisioners or CSI drivers. This is particularly useful for snapshot repositories stored on NFS shares. To configure an NFS volume, specify the `nfs` field with the required `server` and `path` parameters:

```yaml
spec:
  general:
    additionalVolumes:
      - name: nfs-backups
        path: /mnt/backups/opensearch
        nfs:
          server: 192.168.1.233
          path: /export/backups/opensearch
          readOnly: false # Optional, defaults to false
```
{% include copy.html %}

This can be combined with snapshot repository configuration:

```yaml
spec:
  general:
    additionalVolumes:
      - name: nfs-backups
        path: /mnt/backups/opensearch
        nfs:
          server: 192.168.1.233
          path: /export/backups/opensearch
    snapshotRepositories:
      - name: nfs-repository
        type: fs
        settings:
          location: /mnt/backups/opensearch
```
{% include copy.html %}

The operator adds the defined volumes to all pods of the OpenSearch cluster. It is currently not possible to define them per node pool (`nodePools`).

## Adding environment variables to pods

You can add your own environment variables to the OpenSearch pods and the OpenSearch Dashboards pods. You can provide the value as a string literal or mount it from a secret or `ConfigMap`.

The structure is the same for both OpenSearch and OpenSearch Dashboards:

```yaml
spec:
  dashboards:
    env:
      - name: MY_ENV_VAR
        value: "myvalue"
      - name: MY_SECRET_VAR
        valueFrom:
          secretKeyRef:
            name: my-secret
            key: some_key
      - name: MY_CONFIGMAP_VAR
        valueFrom:
          configMapKeyRef:
            name: my-configmap
            key: some_key
  nodePools:
    - component: nodes
      env:
        - name: MY_ENV_VAR
          value: "myvalue"
        # The other options are supported here as well.
```
{% include copy.html %}

## Custom cluster domain name

If your Kubernetes cluster is configured with a custom domain name (default is `cluster.local`), configure the operator accordingly for internal routing to work properly. Set `manager.dnsBase` in the Helm chart values.

```yaml
manager:
  # ...
  dnsBase: custom.domain
```
{% include copy.html %}

## Custom init helper

During cluster initialization, the operator uses init containers as helpers. For these containers, a `busybox` image is used (specifically `docker.io/busybox:latest`). If you are working in an offline environment and the cluster cannot access the registry or you want to customize the image, you can override the image used by specifying the `initHelper` image in your cluster `spec`:

```yaml
spec:
  initHelper:
    # You can either only specify the version
    version: "1.27.2-buildcustom"
    # Or specify a totally different image
    image: "mycustomrepo.cr/mycustombusybox:myversion"
    # Additionally you can define the imagePullPolicy
    imagePullPolicy: IfNotPresent
    # and imagePullSecrets if needed
    imagePullSecrets:
      - name: docker-pull-secret
```
{% include copy.html %}

## Edit init container resources

Init containers run without any resource constraints, but it's possible to specify resource requests and limits by adding a resources section to the YAML definition. You can control the amount of CPU and memory allocated to the init container, helping to ensure that it doesn't starve other containers, by setting appropriate resource limits.

```yaml
spec:
  initHelper:
    resources:
      requests:
        memory: "128Mi"
        cpu: "250m"
      limits:
        memory: "512Mi"
        cpu: "500m"
```
{% include copy.html %}

## Disabling the init helper

In some cases, you may want to avoid the `chmod` init container (for example, on OpenShift or if your cluster blocks containers running as `root`).
It can be disabled by adding the following to your `values.yaml`:

```yaml
manager:
  extraEnv:
    - name: SKIP_INIT_CONTAINER
      value: "true"
```
{% include copy.html %}

## PodDisruptionBudget

The PDB (Pod Disruption Budget) is a Kubernetes resource that helps ensure the high availability of applications by defining the acceptable disruption level during maintenance or unexpected events.
It specifies the minimum number of pods that must remain available to maintain the desired level of service.
The PDB definition is unique for every node pool (`nodePools`).
Provide either `minAvailable` or `maxUnavailable` to configure PDB, but not both.

```yaml
apiVersion: opensearch.org/v1
kind: OpenSearchCluster
---
spec:
  nodePools:
    - component: masters
      replicas: 3
      diskSize: "30Gi"
      pdb:
        enable: true
        minAvailable: 3
    - component: datas
      replicas: 7
      diskSize: "100Gi"
      pdb:
        enable: true
        maxUnavailable: 2
```
{% include copy.html %}

## Exposing OpenSearch Dashboards

To expose the OpenSearch Dashboards instance of your cluster for users or services outside of your Kubernetes cluster, the recommended way is to use ingress.

A simple example:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: opensearch-dashboards
  namespace: default
spec:
  tls:
    - hosts:
        - dashboards.my.company
  rules:
    - host: dashboards.my.company
      http:
        paths:
          - backend:
              service:
                name: my-cluster-dashboards
                port:
                  number: 5601
            path: "/(.*)"
            pathType: ImplementationSpecific
```
{% include copy.html %}

If you have enabled HTTPS for OpenSearch Dashboards, instruct your ingress controller to use an HTTPS connection internally. This is specific to the controller you are using (for example, nginx-ingress or `traefik`).
{: .note}

## Configuring the OpenSearch Dashboards Kubernetes service

You can customize the Kubernetes Service object that the operator generates for the OpenSearch Dashboards deployment.

Supported Service Types:

- ClusterIP (default)
- NodePort
- LoadBalancer

When using type `LoadBalancer`, you can optionally set the load balancer source ranges.

```yaml
apiVersion: opensearch.org/v1
kind: OpenSearchCluster
---
spec:
  dashboards:
    service:
      type: LoadBalancer # Set one of the supported types
      loadBalancerSourceRanges: "10.0.0.0/24, 192.168.0.0/24" # Optional, add source ranges for a load balancer
```
{% include copy.html %}

## Exposing the OpenSearch cluster REST API

To expose the REST API of OpenSearch outside your Kubernetes cluster, the recommended way is to use ingress.
Internally, use self-signed certificates (you can let the operator generate them) and then let the ingress use a certificate from an accepted CA (for example, Let's Encrypt or a company-internal CA). That way you do not have the hassle of supplying custom certificates to the OpenSearch cluster but your users still see valid certificates.

## Customizing probe timeouts and thresholds

If the cluster nodes do not start before the threshold is reached and the pod restarts, you can configure the timeouts and thresholds per node as needed.

```yaml
apiVersion: opensearch.org/v1
kind: OpenSearchCluster
---
spec:
  nodePools:
    - component: masters
      replicas: 3
      diskSize: "30Gi"
      probes:
        liveness:
          initialDelaySeconds: 10
          periodSeconds: 20
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 10
        startup:
          initialDelaySeconds: 10
          periodSeconds: 20
          timeoutSeconds: 5
          successThreshold: 1
          failureThreshold: 10
        readiness:
          initialDelaySeconds: 60
          periodSeconds: 30
          timeoutSeconds: 30
          successThreshold: 1
          failureThreshold: 5
```
{% include copy.html %}

## Customize startup and readiness probe command

While the `liveness` probe is a TCP check, the startup and readiness probes use the OpenSearch API with curl.

If you need to customize the startup or readiness probe commands, you can override them as shown in the following example:

```yaml
apiVersion: opensearch.org/v1
kind: OpenSearchCluster
...
spec:
  nodePools:
    - component: masters
      ...
      probes:
        startup:
          command:
            - echo
            - "Hello, World!"
        readiness:
          command:
            - echo
            - "Hello, World!"
```
{% include copy.html %}

## Configuring resource limits and requests

In addition to the information provided in the previous sections on how to specify resource requirements for the node pools, you can also specify resources for all entities created by the operator for more advanced use cases.

The operator generates many pods using resources such as jobs, stateful sets, and replica sets that use init containers. The following configuration lets you specify a default resources configuration for all init containers.

```yaml
apiVersion: opensearch.org/v1
kind: OpenSearchCluster
---
spec:
  initHelper:
    resources:
      requests:
        memory: "50Mi"
        cpu: "50m"
      limits:
        memory: "200Mi"
        cpu: "200m"
```
{% include copy.html %}

You can also configure the resources for the security update job as shown in the following example.

```yaml
apiVersion: opensearch.org/v1
kind: OpenSearchCluster
---
spec:
  security:
    config:
      updateJob:
        resources:
          limits:
            cpu: "100m"
            memory: "100Mi"
          requests:
            cpu: "100m"
            memory: "100Mi"
```
{% include copy.html %}

The examples provided here do not reflect actual resource requirements. You may need to conduct further testing to properly adjust the resources based on your specific needs.
{: .note}
