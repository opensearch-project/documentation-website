---
layout: default
title: Troubleshoot securityadmin.sh
nav_order: 10
---

# securityadmin.sh Troubleshooting

This page includes troubleshooting steps for `securityadmin.sh`. The script can be found at `/plugins/opensearch-security/tools/securityadmin.sh`. For more information about using this tool, see [Applying changes to configuration files]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/).


---

#### Table of contents
- TOC
{:toc}


---

## Cluster not reachable

If `securityadmin.sh` can't reach the cluster, it outputs:

```
OpenSearch Security Admin v6
Will connect to localhost:9300
ERR: Seems there is no opensearch running on localhost:9300 - Will exit
```


### Check hostname

By default, `securityadmin.sh` uses `localhost`. If your cluster runs on any other host, specify the hostname using the `-h` option.


### Check the port

Check that you are running `securityadmin.sh` against the transport port, **not** the HTTP port.

By default, `securityadmin.sh` uses `9300`. If your cluster runs on a different port, use the `-p` option to specify the port number.


## None of the configured nodes are available

If `securityadmin.sh` can reach the cluster, but can't update the configuration, it outputs this error:

```
Contacting opensearch cluster 'opensearch' and wait for YELLOW clusterstate ...
Cannot retrieve cluster state due to: None of the configured nodes are available: [{#transport#-1}{mr2NlX3XQ3WvtVG0Dv5eHw}{localhost}{127.0.0.1:9300}]. This is not an error, will keep on trying ...
```

* Try running `securityadmin.sh` with `-icl` and `-nhnv`.

  If this works, check your cluster name as well as the hostnames in your SSL certificates. If this does not work, try running `securityadmin.sh` with `--diagnose` and see diagnose trace log file.

* Add `--accept-red-cluster` to allow `securityadmin.sh` to operate on a red cluster.


### Check cluster name

By default, `securityadmin.sh` uses `opensearch` as the cluster name.

If your cluster has a different name, you can either ignore the name completely using the `-icl` option or specify the name using the `-cn` option.


### Check hostname verification

By default, `securityadmin.sh` verifies that the hostname in your node's certificate matches the node's actual hostname.

If this is not the case (e.g. if you're using the demo certificates), you can disable hostname verification by adding the `-nhnv` option.


### Check cluster state

By default, `securityadmin.sh` only executes if the cluster state is at least yellow.

If your cluster state is red, you can still execute `securityadmin.sh`, but you need to add the `-arc` option.


### Check the security index name

By default, the Security plugin uses `.opendistro_security` as the name of the configuration index. If you configured a different index name in `opensearch.yml`, specify it using the `-i` option.


## "ERR: DN is not an admin user"

If the TLS certificate used to start `securityadmin.sh` isn't an admin certificate, the script outputs:

```
Connected as CN=node-0.example.com,OU=SSL,O=Test,L=Test,C=DE
ERR: CN=node-0.example.com,OU=SSL,O=Test,L=Test,C=DE is not an admin user
```

You must use an admin certificate when executing the script. To learn more, see [Configuring admin certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/#configuring-admin-certificates).

## Use the diagnose option

For more information on why `securityadmin.sh` is not executing, add the `--diagnose` option:

```
./securityadmin.sh -diagnose -cd ../../../config/opensearch-security/ -cacert ... -cert ... -key ... -keypass ...
```

The script prints the location of the generated diagnostic file.
