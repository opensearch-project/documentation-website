---
layout: default
title: Upgrade OpenSearch - Docker
parent: Install OpenSearch
nav_order: 1000
---

# Upgrade OpenSearch - Docker

Before upgrading, you should create a backup of your cluster's current state using [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/) so you can restore the cluster to its original state if a rollback is necessary.
{:.note}

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. For help with [Docker](https://www.docker.com/) or [Docker Compose](https://github.com/docker/compose), refer to the official documentation on their websites.
{:.note}

The Docker Compose commands used in this guide are written with a hyphen (for example, `docker-compose`). If you installed Docker Desktop on your machine, which automatically installs a bundled version of Docker Compose, then you should remove the hyphen. For example, change `docker-compose` to `docker compose`.
{:.note}

## Minor version upgrade

Upgrading your OpenSearch cluster to a newer **minor** version is straightforward because a minor version upgrade will inherit the configuration and data that already exist in your cluster. You should still create and store a remote backup of your cluster to mitigate any risk of data loss. See [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/) for more information.

1. Stop the cluster.
    ```bash
    docker-compose down
    ```
1. Modify your Compose file by changing the specified `image` to the target upgrade version. You might also want to modify settings or environment variables to enable a newly released feature.
1. Start the cluster with the updated Docker Compose file.
    ```bash
    docker-compose up
    ```
1. Wait for the containers to start, then query the [CAT nodes]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-nodes/) API endpoint to confirm that the version upgrade was successful.
    ```bash
    # This sample response is from a cluster that was upgraded from 2.3.0 to 2.4.0.
    $ curl "https://localhost:9200/_cat/nodes?v&h=name,version&format=json&pretty=true" -ku admin:admin
    [
    {
        "name" : "opensearch-node2",
        "version" : "2.4.0"
    },
    {
        "name" : "opensearch-node1",
        "version" : "2.4.0"
    }
    ]
    ```

## Major version upgrade

There are several methods available for upgrading across major versions of OpenSearch. Which method you choose depends on your specific requirements.

- Snapshot and restore
    - Should be performed for any method because it provides a rollback option
    - Security options don't seem to carry over
- Cluster Restart Upgrade
    - Cluster is taken down and brought back up with new version (same infra)
- Rolling Upgrade
    - Nodes are taken down one at a time, upgraded, and added back to the cluster
- Node replacement
    - Nodes are taken out of service and replaced with a new node running the upgraded version
- Remote reindexing
    - Reindexing is the option to “replay” all of the original source documents into the new cluster. Reindexing needs to be used in conjunction with some of the other approaches in some contexts (e.g. if you are doing a rolling upgrade across multiple major versions, you currently need to reindex within the cluster between major versions), but it can also be used as a standalone method.

Remote reindexing is used in tandem with other methods. Open Q - does remote reindexing force an admin to run two clusters simultaneously?



Test methodology:

Create 1.x OS cluster locally - DONE
Prep remote host (VM) with Docker/Docker Compose and system updates - DONE
Configure local OS cluster (index data and create an internal user) - DONE
Configure snapshot and repository locally - DONE
Save current state of local cluster in snapshot and store in S3 repository - DONE
Restore from snapshot using newer version
Remote reindexing from local machine (can't do it the other way since my laptop isn't accessible from the public internet) (???)



Results/Notes:

Snapshot taken from 1.3.6 cluster cannot be restored to 2.4.0 cluster:
```
$ curl -H 'Content-Type: application/json' -X POST "https://localhost:9200/_snapshot/s3-snapshot-repository/v1-3-6-snapshot/_restore?pretty=true" -ku admin:admin
{
  "error" : {
    "root_cause" : [
      {
        "type" : "security_exception",
        "reason" : "no permissions for [] and User [name=admin, backend_roles=[admin], requestedTenant=null]"
      }
    ],
    "type" : "security_exception",
    "reason" : "no permissions for [] and User [name=admin, backend_roles=[admin], requestedTenant=null]"
  },
  "status" : 403
}
```

Looks like there are issues/conflicts with existing indices. The following command worked for restoring the snapshot, but only because I excluded several indexes:
```bash
$ curl -H 'Content-Type: application/json' -X POST "https://localhost:9200/_snapshot/s3-snapshot-repository/v1-3-6-snapshot/_restore?pretty=true" -d'{"indices":"-.opendistro_security,-.kibana_92668751_admin_1,-security-auditlog-2022.12.06,-.kibana_1","include_global_state":false}' -ku admin:admin
{
  "accepted" : true
}
```

Here's what indexes exist on the vanilla 2.4.0 cluster:
```bash
$ curl "https://localhost:9200/_cat/indices?v&expand_wildcards=all" -ku admin:admin
health status index                        uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   security-auditlog-2022.12.07 CMV0wahaQ-KozeMpaAW9Sg   1   1         11            0      172kb           45kb
green  open   .opendistro_security         PC3HoaAWRLGAA95zPbSI8Q   1   1         10            0    140.1kb         71.8kb
green  open   .kibana_1                    LsTNN5_ZQMuA529Z3q88_Q   1   1          0            0       416b           208b
```

Restoration from the snapshot without excluding indexes fails:
```bash
$ curl -H 'Content-Type: application/json' -X POST "https://localhost:9200/_snapshot/s3-snapshot-repository/v1-3-6-snapshot/_restore?pretty=true" -ku admin:admin
{
  "error" : {
    "root_cause" : [
      {
        "type" : "security_exception",
        "reason" : "no permissions for [] and User [name=admin, backend_roles=[admin], requestedTenant=null]"
      }
    ],
    "type" : "security_exception",
    "reason" : "no permissions for [] and User [name=admin, backend_roles=[admin], requestedTenant=null]"
  },
  "status" : 403
}
```


From docker-compose-2.4.yml, fresh cluster:

$ curl "https://localhost:9200/_cat/indices?v&expand_wildcards=all" -ku admin:admin
health status index                uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   .kibana_1            bLHGoZMWTd-V2ROzPUVAsQ   1   1          0            0       416b           208b
green  open   .opendistro_security FCJr5Hy9THCd22Njv0S_Jw   1   1         10            0    143.6kb         71.8kb

Register S3 Repo (order of steps, must be run on EACH NODE):
./bin/opensearch-plugin install repository-s3
./bin/opensearch-keystore add s3.client.default.access_key
Access key ID: redacted
./bin/opensearch-keystore add s3.client.default.secret_key
Secret access key: redacted
curl -X POST https://localhost:9200/_nodes/reload_secure_settings -ku admin:admin
--restart container--
curl -H 'Content-Type: application/json' -X PUT "https://localhost:9200/_snapshot/s3-snapshot-repository" -ku admin:admin -d'{"type":"s3","settings":{"bucket":"jeffh-snapshots","base_path":"snapshots/"}}'

Ispect the desired snapshot:
$ curl -H 'Content-Type: application/json' -X GET "https://localhost:9200/_snapshot/s3-snapshot-repository/v136-global-state-false?pretty=true" -ku admin:admin
{
  "snapshots" : [
    {
      "snapshot" : "v136-global-state-false",
      "uuid" : "hJGKVGUzQR-kv4ZUjep_dg",
      "version_id" : 135248427,
      "version" : "1.3.6",
      "indices" : [
        "security-auditlog-2022.12.09",
        "security-auditlog-2022.12.06",
        ".opensearch-observability",
        ".kibana_101107607_jhuss_1",
        "ecommerce",
        ".kibana_1",
        ".opendistro_security",
        ".kibana_92668751_admin_1"
      ],
      "data_streams" : [ ],
      "include_global_state" : false,
      "state" : "SUCCESS",
      "start_time" : "2022-12-12T22:01:41.624Z",
      "start_time_in_millis" : 1670882501624,
      "end_time" : "2022-12-12T22:01:42.426Z",
      "end_time_in_millis" : 1670882502426,
      "duration_in_millis" : 802,
      "failures" : [ ],
      "shards" : {
        "total" : 8,
        "failed" : 0,
        "successful" : 8
      }
    }
  ]
}

Copy security plugin YAML files:
docker cp . <containerId>:/usr/share/opensearch/config/opensearch-security/backups/

Restore security config from backed up files (from one of the containers)
./securityadmin.sh -cd /usr/share/opensearch/config/opensearch-security/backups/ -icl -nhnv \
  -cacert ../../../config/root-ca.pem \
  -cert ../../../config/kirk.pem \
  -key ../../../config/kirk-key.pem

  