---
layout: default
title: Cross-cluster search
parent: Access control
nav_order: 105
redirect_from:
 - /security/access-control/cross-cluster-search/
 - /security-plugin/access-control/cross-cluster-search/
---

# Cross-cluster search

Cross-cluster search is exactly what it sounds like: it lets any node in a cluster execute search requests against other clusters. The Security plugin supports cross-cluster search out of the box.

---

#### Table of contents
1. TOC
{:toc}


---

## Authentication flow

When accessing a *remote cluster* from a *coordinating cluster* using cross-cluster search:

1. The Security plugin authenticates the user on the coordinating cluster.
1. The Security plugin fetches the user's backend roles on the coordinating cluster.
1. The call, including the authenticated user, is forwarded to the remote cluster.
1. The user's permissions are evaluated on the remote cluster.

You can have different authentication and authorization configurations on the remote and coordinating cluster, but we recommend using the same settings on both.


## Permissions

To query indexes on remote clusters, users need to have `READ` or `SEARCH` permissions. Furthermore, when the search request includes the query parameter `ccs_minimize_roundtrips=false` – which tells OpenSearch not to minimize outgoing and ingoing requests to remote clusters – users need to have the following additional permission for the index:

```
indices:admin/shards/search_shards
```

For more information about the `ccs_minimize_roundtrips` parameter, see the list of [URL Parameters]({{site.url}}{{site.baseurl}}/api-reference/search/#url-parameters) for the Search API.

#### Sample roles.yml configuration

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


#### Sample role in OpenSearch Dashboards

![OpenSearch Dashboards UI for creating a cross-cluster search role]({{site.url}}{{site.baseurl}}/images/security-ccs.png)


## Walkthrough

Save this file as `docker-compose.yml` and run `docker-compose up` to start two single-node clusters on the same network:

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

After the clusters start, verify the names of each:

```json
curl -XGET -u 'admin:admin' -k 'https://localhost:9200'
{
  "cluster_name" : "opensearch-ccs-cluster1",
  ...
}

curl -XGET -u 'admin:admin' -k 'https://localhost:9250'
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
curl -k -XPUT -H 'Content-Type: application/json' -u 'admin:admin' 'https://localhost:9250/_cluster/settings' -d '
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

On the remote cluster, index a document:

```bash
curl -XPUT -k -H 'Content-Type: application/json' -u 'admin:admin' 'https://localhost:9200/books/_doc/1' -d '{"Dracula": "Bram Stoker"}'
```

At this point, cross-cluster search works. You can test it using the `admin` user:

```bash
curl -XGET -k -u 'admin:admin' 'https://localhost:9250/opensearch-ccs-cluster1:books/_search?pretty'
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
curl -XPUT -k -u 'admin:admin' 'https://localhost:9200/_plugins/_security/api/internalusers/booksuser' -H 'Content-Type: application/json' -d '{"password":"password"}'
curl -XPUT -k -u 'admin:admin' 'https://localhost:9250/_plugins/_security/api/internalusers/booksuser' -H 'Content-Type: application/json' -d '{"password":"password"}'
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
curl -XPUT -k -u 'admin:admin' -H 'Content-Type: application/json' 'https://localhost:9200/_plugins/_security/api/roles/booksrole' -d '{"index_permissions":[{"index_patterns":["books"],"allowed_actions":["indices:admin/shards/search_shards","indices:data/read/search"]}]}'
curl -XPUT -k -u 'admin:admin' -H 'Content-Type: application/json' 'https://localhost:9200/_plugins/_security/api/rolesmapping/booksrole' -d '{"users" : ["booksuser"]}'
```

Both clusters must have the user, but only the remote cluster needs the role and mapping; in this case, the coordinating cluster handles authentication (i.e. "Does this request include valid user credentials?"), and the remote cluster handles authorization (i.e. "Can this user access this data?").
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
