---
layout: default
title: Installing OpenSearch
nav_order: 2
has_children: true
redirect_from:
  - /opensearch/install/
  - /opensearch/install/compatibility/
  - /opensearch/install/important-settings/
  - /opensearch/install/index/
  - /install-and-configure/install-opensearch/
---

# Installing OpenSearch

You can install OpenSearch using Docker, Helm, the OpenSearch Kubernetes Operator, tarball, RPM, Debian packages, Ansible, or on Windows. Each method requires specific [ports to be open](#network-requirements) and [important settings](#important-settings) to be configured on your host.

To try OpenSearch on your computer, see [Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/).

For operating system compatibility, see [Compatible operating systems]({{site.url}}{{site.baseurl}}/install-and-configure/os-comp/).

## Installation steps

Installation steps vary depending on the deployment method. For steps specific to your deployment, see the following installation guides:

- [Docker]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/)
- [OpenSearch Kubernetes Operator]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/)
- [Helm]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/helm/)
- [Debian]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/debian/)
- [RPM]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/rpm/)
- [Tarball]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/tar/)
- [Ansible playbook]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/ansible/)
- [Windows]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/windows/)

## Preparing a cluster for production

The [Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/) and the default installations in most guides create a cluster that uses the demo security configuration. The demo configuration uses self-signed demo certificates and known passwords for internal users, so it is intended for testing only. Before you use a cluster in production, complete the following tasks:

- Replace the demo certificates with certificates issued by your own certificate authority. For more information, see [Configuring TLS certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/).
- Configure how users authenticate. You can use the internal user database of the Security plugin or connect an external identity provider for single sign-on, such as [SAML]({{site.url}}{{site.baseurl}}/security/authentication-backends/saml/), [OpenID Connect]({{site.url}}{{site.baseurl}}/security/authentication-backends/openid-connect/), or [LDAP]({{site.url}}{{site.baseurl}}/security/authentication-backends/ldap/). For more information, see [Configuring the security backend]({{site.url}}{{site.baseurl}}/security/configuration/configuration/).
- Map users or the backend roles provided by your identity provider to roles that grant access to the cluster. For more information, see [Defining users and roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/).
- Replace the default passwords of the demo internal users, or remove the users that you don't need. For more information, see [Demo configuration passwords]({{site.url}}{{site.baseurl}}/security/configuration/passwords/#demo-configuration-passwords).
- Configure the [important settings](#important-settings) on every host.
- Run multiple nodes, including dedicated cluster manager nodes, so that the cluster remains available when a node fails. For more information, see [Creating a cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/).
- Back up your data using snapshots. For more information, see [Snapshots]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/index/).

For more security recommendations, see [Best practices for OpenSearch security]({{site.url}}{{site.baseurl}}/security/configuration/best-practices/).

## File system recommendations

Avoid using a network file system for node storage in a production workflow. Using a network file system for node storage can cause performance issues in your cluster due to factors such as network conditions (like latency or limited throughput) or read/write speeds. You should use solid-state drives (SSDs) installed on the host for node storage where possible.

## Java compatibility

The OpenSearch distribution for Linux ships with a compatible [Adoptium JDK](https://adoptium.net/) version of Java in the `jdk` directory. To find the JDK version, run `./jdk/bin/java -version`. For example, the OpenSearch 1.0.0 tarball ships with Java 15.0.1+9 (non-LTS), OpenSearch 1.3.0 ships with Java 11.0.14.1+1 (LTS), and OpenSearch 2.0.0 ships with Java 17.0.2+8 (LTS). OpenSearch is tested with all compatible Java versions.

OpenSearch version | Compatible Java versions | Bundled Java version
:---------- | :-------- | :-----------
1.0--1.2.x    | 11, 15     | 15.0.1+9
1.3.x          | 8, 11, 14  | 11.0.25+9
2.0.0--2.11.x    | 11, 17     | 17.0.2+8
2.12.0+        | 11, 17, 21 | 21.0.11+10
3.2.0+        | 21, 24 | 24.0.2+12
3.5.0+        | 21, 25 | 25.0.2+10
3.6.1+        | 21, 25, 26 | 25.0.4.1+1

To use a different Java installation, set the `OPENSEARCH_JAVA_HOME` or `JAVA_HOME` environment variable to the Java installation location. For example:

```bash
export OPENSEARCH_JAVA_HOME=/path/to/opensearch-{{site.opensearch_version}}/jdk
```
{% include copy.html %}

## Network requirements

The following TCP ports need to be open for OpenSearch components.

Port number | OpenSearch component
:--- | :--- 
443 | OpenSearch Dashboards in AWS OpenSearch Service with encryption in transit (TLS)
5601 | OpenSearch Dashboards
9200 | OpenSearch REST API
9300 | Node communication and transport (internal), cross cluster search
9600 | Performance Analyzer

No UDP ports are used.
{: .note}

## Important settings

For production workloads running on Linux, make sure the [Linux setting](https://www.kernel.org/doc/Documentation/sysctl/vm.txt) `vm.max_map_count` is set to at least `262144`. 

Even if you use the Docker image, set this value on the host machine. To check the current value, run this command:

```bash
cat /proc/sys/vm/max_map_count
```
{% include copy.html %}

To increase the value, add the following line to `/etc/sysctl.conf`:

```
vm.max_map_count=262144
```
{% include copy.html %}

Then reload the settings:

```bash
sudo sysctl -p
```
{% include copy.html %}

For Windows workloads, set `vm.max_map_count` in the Docker Desktop WSL distribution. First, open a shell in the distribution:

```bash
wsl -d docker-desktop
```
{% include copy.html %}

Then set the value:

```bash
sysctl -w vm.max_map_count=262144
```
{% include copy.html %}

The [sample `docker-compose.yml`]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#sample-docker-composeyml) file also contains several key settings:

- `bootstrap.memory_lock=true`

  Disables swapping (along with `memlock`). Swapping can dramatically decrease performance and stability, so you should ensure it is disabled on production clusters.

  Enabling the `bootstrap.memory_lock` setting will cause the JVM to reserve any memory it needs. The [Java SE Hotspot VM Garbage Collection Tuning Guide](https://docs.oracle.com/javase/9/gctuning/other-considerations.htm#JSGCT-GUID-B29C9153-3530-4C15-9154-E74F44E3DAD9) documents a default 1 gigabyte (GB) Class Metadata native memory reservation. Combined with Java heap, this may result in an error due to the lack of native memory on VMs with less memory than these requirements. To prevent errors, limit the reserved memory size using `-XX:CompressedClassSpaceSize` or `-XX:MaxMetaspaceSize` and set the size of the Java heap to make sure you have enough system memory.

- `OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m`

  Sets the size of the Java heap (we recommend half of system RAM).
  
 OpenSearch defaults to `-Xms1g -Xmx1g` for heap memory allocation, which takes precedence over configurations specified using percentage notation (`-XX:MinRAMPercentage`, `-XX:MaxRAMPercentage`). For example, if you set `OPENSEARCH_JAVA_OPTS=-XX:MinRAMPercentage=30 -XX:MaxRAMPercentage=70`, the predefined `-Xms1g -Xmx1g` values will override these settings. When using `OPENSEARCH_JAVA_OPTS` to define memory allocation, make sure you use the `-Xms` and `-Xmx` notation.
{: .note}

- `nofile 65536`

  Sets a limit of 65536 open files for the OpenSearch user.

- `port 9600`

  Allows you to access Performance Analyzer on port 9600.

Do not declare the same JVM options in multiple locations because it can result in unexpected behavior or a failure of the OpenSearch service to start. If you declare JVM options using an environment variable, such as `OPENSEARCH_JAVA_OPTS=-Xms3g -Xmx3g`, then you should comment out any references to that JVM option in `config/jvm.options`. Conversely, if you define JVM options in `config/jvm.options`, then you should not define those JVM options using environment variables.
{: .note}

## Important system properties

OpenSearch has a number of system properties, listed in the following table, that you can specify in `config/jvm.options` or `OPENSEARCH_JAVA_OPTS` using `-D` command line argument notation.

Property | Description
:---------- | :-------- 
`opensearch.xcontent.string.length.max=<value>` | By default, OpenSearch does not impose any limits on the maximum length of the JSON/YAML/CBOR/Smile string fields. To protect your cluster against potential distributed denial-of-service (DDoS) or memory issues, you can set the `opensearch.xcontent.string.length.max` system property to a reasonable limit (the maximum is 2,147,483,647), for example, `-Dopensearch.xcontent.string.length.max=5000000`.  | 
`opensearch.xcontent.fast_double_writer=[true|false]` | By default, OpenSearch serializes floating-point numbers using the default implementation provided by the Java Runtime Environment. Set this value to `true` to use the Schubfach algorithm, which is faster but may lead to small differences in precision. Default is `false`. |
`opensearch.xcontent.name.length.max=<value>` | By default, OpenSearch does not impose any limits on the maximum length of the JSON/YAML/CBOR/Smile field names. To protect your cluster against potential DDoS or memory issues, you can set the `opensearch.xcontent.name.length.max` system property to a reasonable limit (the maximum is 2,147,483,647), for example, `-Dopensearch.xcontent.name.length.max=50000`. |
`opensearch.xcontent.depth.max=<value>` | By default, OpenSearch does not impose any limits on the maximum nesting depth for JSON/YAML/CBOR/Smile documents. To protect your cluster against potential DDoS or memory issues, you can set the `opensearch.xcontent.depth.max` system property to a reasonable limit (the maximum is 2,147,483,647), for example, `-Dopensearch.xcontent.depth.max=1000`. |
`opensearch.xcontent.codepoint.max=<value>` | By default, OpenSearch imposes a limit of `52428800` on the maximum size of the YAML documents (in code points). To protect your cluster against potential DDoS or memory issues, you can change the `opensearch.xcontent.codepoint.max` system property to a reasonable limit (the maximum is 2,147,483,647). For example, `-Dopensearch.xcontent.codepoint.max=5000000`. |

## Common issues

The following issues can occur with any installation method.

### Error message: "max virtual memory areas vm.max_map_count [65530] is too low"

OpenSearch fails to start on Linux if the `vm.max_map_count` setting of the host is too low. The OpenSearch log contains the following error:

```
ERROR: [1] bootstrap checks failed
[1]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
```

To fix this error, set `vm.max_map_count` to at least `262144` as described in [Important settings](#important-settings). If you use Docker, set the value on the host machine, not in the container.

### Error message: "NotSslRecordException: not an SSL/TLS record"

The demo security configuration serves the REST API over HTTPS. If a client sends a request over HTTP, the client receives an empty reply, and OpenSearch logs the following error for every request:

```
io.netty.handler.ssl.NotSslRecordException: not an SSL/TLS record: 474554202f20485454502f312e310d0a...
```

To fix this error, send requests to `https://localhost:9200` instead of `http://localhost:9200`. Check every client that connects to OpenSearch, including monitoring tools and other services on the host that send requests on a schedule.

### Error message: "Password failed validation"

OpenSearch does not start if the value of `OPENSEARCH_INITIAL_ADMIN_PASSWORD` is not a strong password. The OpenSearch log contains an error similar to the following:

```
Password admin failed validation: "Password is too short". Please re-try with a minimum 8 character password and must contain at least one uppercase letter, one lowercase letter, one digit, and one special character that is strong.
```

To fix this error, choose a password that meets the [admin password requirements]({{site.url}}{{site.baseurl}}/security/configuration/demo-configuration/#admin-password-requirements).

### Error message: "the default discovery settings are unsuitable for production use"

When OpenSearch binds to an address other than `localhost`, for example, after you set `network.host` to `0.0.0.0` so that other hosts can reach it, OpenSearch enforces bootstrap checks. If the node has no discovery settings, OpenSearch fails to start and logs the following error:

```
bound or publishing to a non-loopback address, enforcing bootstrap checks
ERROR: [1] bootstrap checks failed
[1]: the default discovery settings are unsuitable for production use; at least one of [discovery.seed_hosts, discovery.seed_providers, cluster.initial_cluster_manager_nodes / cluster.initial_master_nodes] must be configured
```

To fix this error, configure discovery in `opensearch.yml`:

- For a single-node cluster, set `discovery.type: single-node`.
- For a multi-node cluster, set `discovery.seed_hosts` and `cluster.initial_cluster_manager_nodes`. For more information, see [Creating a cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/).
