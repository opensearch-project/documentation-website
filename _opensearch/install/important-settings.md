---
layout: default
title: Important settings
parent: Install OpenSearch
nav_order: 70
---

# Important settings

For production workloads, make sure the [Linux setting](https://www.kernel.org/doc/Documentation/sysctl/vm.txt) `vm.max_map_count` is set to at least 262144. Even if you use the Docker image, set this value on the *host machine*. To check the current value, run this command:

```bash
cat /proc/sys/vm/max_map_count
```

To increase the value, add the following line to `/etc/sysctl.conf`:

```
vm.max_map_count=262144
```

Then run `sudo sysctl -p` to reload.

The [sample docker-compose.yml]({{site.url}}{{site.baseurl}}/opensearch/install/docker#sample-docker-composeyml) file also contains several key settings:

- `bootstrap.memory_lock=true`

  Disables swapping (along with `memlock`). Swapping can dramatically decrease performance and stability, so you should ensure it is disabled on production clusters.

- `OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m`

  Sets the size of the Java heap (we recommend half of system RAM).

- `nofile 65536`

  Sets a limit of 65536 open files for the OpenSearch user.

- `port 9600`

  Allows you to access Performance Analyzer on port 9600.

Do not declare the same JVM options in multiple locations because it can result in unexpected behavior or a failure of the OpenSearch service to start. If you declare JVM options using an environment variable, such as `OPENSEARCH_JAVA_OPTS=-Xms3g -Xmx3g`, then you should comment out any references to that JVM option in `config/jvm.options`. Conversely, if you define JVM options in `config/jvm.options`, then you should not define those JVM options using environment variables.
{: .note}

### Network requirements

  The following ports need to be open for OpenSearch components.

Port number | OpenSearch component
:--- | :--- 
443 | OpenSearch Dashboards in AWS OpenSearch Service with encryption in transit (TLS)
5601 | OpenSearch Dashboards
9200 | OpenSearch REST API
9250 | Cross-cluster search
9300 | Node communication and transport
9600 | Performance Analyzer

