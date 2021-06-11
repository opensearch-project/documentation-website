---
layout: default
title: Important settings
parent: Install OpenSearch
nav_order: 70
---

# Important settings

For production workloads, make sure the [Linux setting](https://www.kernel.org/doc/Documentation/sysctl/vm.txt) `vm.max_map_count` is set to at least 262144. On the OpenSearch Docker image, this setting is the default. To check, start a Bash session in the container and run:

```bash
cat /proc/sys/vm/max_map_count
```

To increase this value, you have to modify the Docker image. For other install types, add this setting to the host machine's `/etc/sysctl.conf` file with the following line:

```
vm.max_map_count=262144
```

Then run `sudo sysctl -p` to reload.

The [sample docker-compose.yml]({{site.url}}{{site.baseurl}}/opensearch/install/docker#sample-docker-compose-file) file also contains several key settings:

- `bootstrap.memory_lock=true`

  Disbles swapping (along with `memlock`). Swapping can dramatically decrease performance and stability, so you should ensure it is disabled on production clusters.

- `OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m`

  Sets the size of the Java heap (we recommend half of system RAM).

- `nofile 65536`

  Sets a limit of 65536 open files for the OpenSearch user.

- `port 9600`

  Allows you to access Performance Analyzer on port 9600.
