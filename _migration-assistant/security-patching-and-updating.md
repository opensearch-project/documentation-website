---
layout: default
title: Security patching & updating
nav_order: 30
parent: Migration Assistant for OpenSearch
permalink: /migration-assistant/security-patching-and-updating/
---

# Security patching and updating

This page describes how to safely update the **bootstrap box** (the EC2 instance you use to build and run Migration Assistant components), clean Docker caches, and rebuild the Migration Assistant container images.

> **Recommended cadence:** Perform these steps only when the Migration Assistant is not actively running.

---

## Step 1: Patch the OS on the bootstrap box

```shell
sudo dnf upgrade --refresh -y
```
{% include copy.html %}

> **Note:** If the kernel or core libraries are updated, a reboot is often required.

Reboot if required:

```shell
sudo reboot
```
{% include copy.html %}

After the box comes back up, reconnect and continue.


## Step 2: Clear Docker build and download caches

Clearing the Docker build and downloaded caches removes **all** unused images, containers, networks, and volumes to free disk space and ensure clean rebuilds:

```shell
docker system prune -a --volumes
```
{% include copy.html %}


## Step 3: Clean prior Gradle outputs

From the repository root, run the following command to clean prior Gradle outputs:

```shell
./gradlew clean
```
{% include copy.html %}


## Step 4: Rebuild Migration Assistant images

Rebuild the Docker images used by the Migration Assistant:

```shell
./gradlew :buildDockerImages -x test
```
{% include copy.html %}


## Step 5: Redeploy the Migration Assistant

Redeploy the Migration Assistant to replace existing container images with the freshly built versions:

```shell
./deploy.sh <contextId>

> **Warning:** Redeployment will interrupt any running migration tasks (for example, Capture Proxy, Replayer, or Reindex-from-Snapshot).
> **Do not** redeploy while actively migrating, as this can cause data loss or inconsistent state.
{: .warning}

cd deployment/cdk/opensearch-service-migration


## Troubleshooting

* **`toomanyrequests: Rate exceeded`**
  Retry the last build command. Some downstream container images are rate-limited and may change over time.

* **Cannot pull base images**
  Ensure the instance has internet egress (NAT/IGW) and access to Docker Hub/ECR as required.

* **Gradle cache corruption**
  If problems persist after `./gradlew clean`, also remove `~/.gradle/caches` and retry.