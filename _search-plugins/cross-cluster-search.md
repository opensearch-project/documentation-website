---
layout: default
title: Cross-cluster search
nav_order: 65
redirect_from:
 - /security/access-control/cross-cluster-search/
 - /security-plugin/access-control/cross-cluster-search/
canonical_url: https://docs.opensearch.org/latest/search-plugins/cross-cluster-search/
---

# Cross-cluster search

You can use cross-cluster search (CCS) in OpenSearch to search and analyze data across multiple clusters, enabling you to gain insights from distributed data sources. Cross-cluster search is available by default with the Security plugin, but you need to configure each cluster to allow remote connections from other clusters. This involves setting up remote cluster connections and configuring access permissions.

---

#### Table of contents
1. TOC
{:toc}


---

## Authentication flow

The following sequence describes the authentication flow when using cross-cluster search to access a *remote cluster* from a *coordinating cluster*. You can have different authentication and authorization configurations on the remote and coordinating clusters, but we recommend using the same settings on both.

1. The Security plugin authenticates the user on the coordinating cluster.
1. The Security plugin fetches the user's backend roles on the coordinating cluster.
1. The call, including the authenticated user, is forwarded to the remote cluster.
1. The user's permissions are evaluated on the remote cluster.


## Setting permissions

To query indexes on remote clusters, users must have `READ` or `SEARCH` permissions. Furthermore, when the search request includes the query parameter `ccs_minimize_roundtrips=false`---which tells OpenSearch not to minimize outgoing and incoming requests to remote clusters---users need to have the following additional index permission:

```
indices:admin/shards/search_shards
```

For more information about the `ccs_minimize_roundtrips` parameter, see the list of [URL Parameters]({{site.url}}{{site.baseurl}}/api-reference/search/#url-parameters) for the Search API.

#### Example roles.yml configuration

```yml
humanresources:
  cluster:
    - CLUSTER_COMPOSITE_OPS_RO
  indices:
    'humanresources':
      '*':
        - READ
        - indices:admin/shards/search_shards # needed when the search request includes parameter setting 'ccs_minimize_roundtrips=false'.
```


#### Example role in OpenSearch Dashboards

![OpenSearch Dashboards UI for creating a cross-cluster search role]({{site.url}}{{site.baseurl}}/images/security-ccs.png)


## Sample Docker setup

To define Docker permissions, save the following sample file as `docker-compose.yml` and run `docker-compose up` to start two single-node clusters on the same network:

```yml
version: '3'
services:
  opensearch-ccs-node1:
    image: opensearchproject/opensearch:{{site.opensearch_version}}
    container_name: opensearch-ccs-node1
    environment:
      - cluster.name=opensearch-ccs-cluster1
      - discovery.type=single-node
      - bootstrap.memory_lock=true # along with the memlock settings below, disables swapping
      - "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" # minimum and maximum Java heap size, recommend setting both to 50% of system RAM
      - "OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>" # The initial admin password used by the demo configuration
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - opensearch-data1:/usr/share/opensearch/data
    ports:
      - 9200:9200
      - 9600:9600 # required for Performance Analyzer
    networks:
      - opensearch-net

  opensearch-ccs-node2:
    image: opensearchproject/opensearch:{{site.opensearch_version}}
    container_name: opensearch-ccs-node2
    environment:
      - cluster.name=opensearch-ccs-cluster2
      - discovery.type=single-node
      - bootstrap.memory_lock=true # along with the memlock settings below, disables swapping
      - "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" # minimum and maximum Java heap size, recommend setting both to 50% of system RAM
      - "OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>" # The initial admin password used by the demo configuration
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - opensearch-data2:/usr/share/opensearch/data
    ports:
      - 9250:9200
      - 9700:9600 # required for Performance Analyzer
    networks:
      - opensearch-net

volumes:
  opensearch-data1:
  opensearch-data2:

networks:
  opensearch-net:
```

After the clusters start, verify the names of each cluster using the following commands:

```json
curl -XGET -u 'admin:<custom-admin-password>' -k 'https://localhost:9200'
{
  "cluster_name" : "opensearch-ccs-cluster1",
  ...
}

curl -XGET -u 'admin:<custom-admin-password>' -k 'https://localhost:9250'
{
  "cluster_name" : "opensearch-ccs-cluster2",
  ...
}
```

Both clusters run on `localhost`, so the important identifier is the port number. In this case, use port 9200 (`opensearch-ccs-node1`) as the remote cluster, and port 9250 (`opensearch-ccs-node2`) as the coordinating cluster.

To get the IP address for the remote cluster, first identify its container ID:

```bash
docker ps
CONTAINER ID    IMAGE                                       PORTS                                                      NAMES
6fe89ebc5a8e    opensearchproject/opensearch:{{site.opensearch_version}}   0.0.0.0:9200->9200/tcp, 0.0.0.0:9600->9600/tcp, 9300/tcp   opensearch-ccs-node1
2da08b6c54d8    opensearchproject/opensearch:{{site.opensearch_version}}   9300/tcp, 0.0.0.0:9250->9200/tcp, 0.0.0.0:9700->9600/tcp   opensearch-ccs-node2
```

Then get that container's IP address:

```bash
docker inspect --format='{% raw %}{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}{% endraw %}' 6fe89ebc5a8e
172.31.0.3
```

On the coordinating cluster, add the remote cluster name and the IP address (with port 9300) for each "seed node." In this case, you only have one seed node:

```json
curl -k -XPUT -H 'Content-Type: application/json' -u 'admin:<custom-admin-password>' 'https://localhost:9250/_cluster/settings' -d '
{
  "persistent": {
    "cluster.remote": {
      "opensearch-ccs-cluster1": {
        "seeds": ["172.31.0.3:9300"]
      }
    }
  }
}'
```
All of the cURL requests can also be sent using OpenSearch Dashboards Dev Tools.
{: .tip }
The following image shows an example of a cURL request using Dev Tools.
![OpenSearch Dashboards UI for configuring remote cluster for Cross-cluster search]({{site.url}}{{site.baseurl}}/images/ccs-devtools.png)

On the remote cluster, index a document:

```bash
curl -XPUT -k -H 'Content-Type: application/json' -u 'admin:<custom-admin-password>' 'https://localhost:9200/books/_doc/1' -d '{"Dracula": "Bram Stoker"}'
```

At this point, cross-cluster search works. You can test it using the `admin` user:

```bash
curl -XGET -k -u 'admin:<custom-admin-password>' 'https://localhost:9250/opensearch-ccs-cluster1:books/_search?pretty'
{
  ...
  "hits": [{
    "_index": "opensearch-ccs-cluster1:books",
    "_id": "1",
    "_score": 1.0,
    "_source": {
      "Dracula": "Bram Stoker"
    }
  }]
}
```

To continue testing, create a new user on both clusters:

```bash
curl -XPUT -k -u 'admin:<custom-admin-password>' 'https://localhost:9200/_plugins/_security/api/internalusers/booksuser' -H 'Content-Type: application/json' -d '{"password":"password"}'
curl -XPUT -k -u 'admin:<custom-admin-password>' 'https://localhost:9250/_plugins/_security/api/internalusers/booksuser' -H 'Content-Type: application/json' -d '{"password":"password"}'
```

Then run the same search as before with `booksuser`:

```json
curl -XGET -k -u booksuser:password 'https://localhost:9250/opensearch-ccs-cluster1:books/_search?pretty'
{
  "error" : {
    "root_cause" : [
      {
        "type" : "security_exception",
        "reason" : "no permissions for [indices:admin/shards/search_shards, indices:data/read/search] and User [name=booksuser, roles=[], requestedTenant=null]"
      }
    ],
    "type" : "security_exception",
    "reason" : "no permissions for [indices:admin/shards/search_shards, indices:data/read/search] and User [name=booksuser, roles=[], requestedTenant=null]"
  },
  "status" : 403
}
```

Note the permissions error. On the remote cluster, create a role with the appropriate permissions, and map `booksuser` to that role:

```bash
curl -XPUT -k -u 'admin:<custom-admin-password>' -H 'Content-Type: application/json' 'https://localhost:9200/_plugins/_security/api/roles/booksrole' -d '{"index_permissions":[{"index_patterns":["books"],"allowed_actions":["indices:admin/shards/search_shards","indices:data/read/search"]}]}'
curl -XPUT -k -u 'admin:<custom-admin-password>' -H 'Content-Type: application/json' 'https://localhost:9200/_plugins/_security/api/rolesmapping/booksrole' -d '{"users" : ["booksuser"]}'
```

Both clusters must have the user role, but only the remote cluster needs both the role and mapping. In this case, the coordinating cluster handles authentication (that is, "Does this request include valid user credentials?"), and the remote cluster handles authorization (that is, "Can this user access this data?").
{: .tip }

Finally, repeat the search:

```bash
curl -XGET -k -u booksuser:password 'https://localhost:9250/opensearch-ccs-cluster1:books/_search?pretty'
{
  ...
  "hits": [{
    "_index": "opensearch-ccs-cluster1:books",
    "_id": "1",
    "_score": 1.0,
    "_source": {
      "Dracula": "Bram Stoker"
    }
  }]
}
```

## Sample bare metal/virtual machine setup

If you are running OpenSearch on a bare metal server or using a virtual machine, you can run the same commands, specifying the IP (or domain) of the OpenSearch cluster.
For example, in order to configure a remote cluster for cross-cluster search, find the IP of the remote node or domain of the remote cluster and run the following command:

```json
curl -k -XPUT -H 'Content-Type: application/json' -u 'admin:<custom-admin-password>' 'https://opensearch-domain-1:9200/_cluster/settings' -d '
{
  "persistent": {
    "cluster.remote": {
      "opensearch-ccs-cluster2": {
        "seeds": ["opensearch-domain-2:9300"]
      }
    }
  }
}'
```
It is sufficient to point to only one of the node IPs on the remote cluster because all nodes in the cluster will be queried as part of the node discovery process.
{: .tip }

You can now run queries across both clusters:

```bash
curl -XGET -k -u 'admin:<custom-admin-password>' 'https://opensearch-domain-1:9200/opensearch-ccs-cluster2:books/_search?pretty'
{
  ...
  "hits": [{
    "_index": "opensearch-ccs-cluster2:books",
    "_id": "1",
    "_score": 1.0,
    "_source": {
      "Dracula": "Bram Stoker"
    }
  }]
}
```

## Sample Kubernetes/Helm setup
If you are using Kubernetes clusters to deploy OpenSearch, you need to configure the remote cluster using either the `LoadBalancer` or `Ingress`. The Kubernetes services created using the following [Helm]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/helm/) example are of the `ClusterIP` type and are only accessible from within the cluster; therefore, you must use an externally accessible endpoint:

```bash
curl -k -XPUT -H 'Content-Type: application/json' -u 'admin:<custom-admin-password>' 'https://opensearch-domain-1:9200/_cluster/settings' -d '
{
  "persistent": {
    "cluster.remote": {
      "opensearch-ccs-cluster2": {
        "seeds": ["ingress:9300"]
      }
    }
  }
}'
```

## Proxy settings

You can configure cross-cluster search on a cluster running behind a proxy. There are many ways to configure a reverse proxy and various proxies to choose from. The following example demonstrates the basic NGINX reverse proxy configuration without TLS termination, though there are many proxies and reverse proxies to choose from. For this example to work, OpenSearch must have both transport and HTTP TLS encryption enabled. For more information about configuring TLS encryption, see [Configuring TLS certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/).

### Prerequisites

To use proxy mode, fulfill the following prerequisites:

- Make sure that the source cluster's nodes are able to connect to the configured `proxy_address`. 
- Make sure that the proxy can route connections to the remote cluster nodes.

### Proxy configuration

The following is the basic NGINX configuration for HTTP and transport communication:

```
stream {
    upstream opensearch-transport {
        server <opensearch>:9300;
    }
    upstream opensearch-http {
        server <opensearch>:9200;
    }
    server {
        listen 8300;
        ssl_certificate /.../{{site.opensearch_version}}/config/esnode.pem;
        ssl_certificate_key /.../{{site.opensearch_version}}/config/esnode-key.pem;
        ssl_trusted_certificate /.../{{site.opensearch_version}}/config/root-ca.pem;
        proxy_pass opensearch-transport;
        ssl_preread on;
    }
    server {
        listen 443;
        listen [::]:443;
        ssl_certificate /.../{{site.opensearch_version}}/config/esnode.pem;
        ssl_certificate_key /.../{{site.opensearch_version}}/config/esnode-key.pem;
        ssl_trusted_certificate /.../{{site.opensearch_version}}/config/root-ca.pem;
        proxy_pass opensearch-http;
        ssl_preread on;
    }
}
```

The listening ports for HTTP and transport communication are set to `443` and `8300`, respectively. 

### OpenSearch configuration

The remote cluster can be configured to point to the `proxy` by using the following command:

```bash
curl -k -XPUT -H 'Content-Type: application/json' -u 'admin:<custom-admin-password>' 'https://opensearch:9200/_cluster/settings' -d '
{
  "persistent": {
    "cluster.remote": {
      "opensearch-remote-cluster": {
        "mode": "proxy",
        "proxy_address": "<remote-cluster-proxy>:8300"
      }
    }
  }
}'
```

Note the previously configured port `8300` in the [Proxy configuration]({{site.url}}{{site.baseurl}}/search-plugins/cross-cluster-search/#proxy-configuration) section.
