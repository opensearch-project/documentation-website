---
layout: default
title: Apply changes with securityadmin.sh
parent: Configuration
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/security/configuration/security-admin/
---

# Apply changes using securityadmin.sh

The security plugin stores its configuration---including users, roles, and permissions---in an index on the OpenSearch cluster (`.opendistro_security`). Storing these settings in an index lets you change settings without restarting the cluster and eliminates the need to edit configuration files on every single node.

To initialize the `.opendistro_security` index, however, you must run `plugins/opensearch-security/tools/securityadmin.sh`. This script loads your initial configuration into the index using the configuration files in `plugins/opensearch-security/securityconfig`. After the `.opendistro_security` index is initialized, use OpenSearch Dashboards or the REST API to manage your users, roles, and permissions.


## A word of caution

If you make changes to the configuration files in `plugins/opensearch-security/securityconfig`, OpenSearch does _not_ automatically apply these changes. Instead, you must run `securityadmin.sh` to load the updated files into the index.

Running `securityadmin.sh` **overwrites** one or more portions of the `.opendistro_security` index. Run it with extreme care to avoid losing your existing resources. Consider the following example:

1. You initialize the `.opendistro_security` index.
1. You create ten users using the REST API.
1. You decide to create a new [reserved user]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api/#reserved-and-hidden-resources) using `internal_users.yml`.
1. You run `securityadmin.sh` again to load the new reserved user into the index.
1. You lose all ten users that you created using the REST API.

To avoid this situation, back up your current configuration before making changes and re-running the script:

```bash
./securityadmin.sh -backup my-backup-directory \
  -icl \
  -nhnv \
  -cacert ../../../config/root-ca.pem \
  -cert ../../../config/kirk.pem \
  -key ../../../config/kirk-key.pem
```

If you use the `-f` argument rather than `-cd`, you can load a single YAML file into the index rather than the entire directory of YAML files. For example, if you create ten new roles, you can safely load `internal_users.yml` into the index without losing your roles; only the internal users get overwritten.

```bash
./securityadmin.sh -f ../securityconfig/internal_users.yml \
  -t internalusers \
  -icl \
  -nhnv \
  -cacert ../../../config/root-ca.pem \
  -cert ../../../config/kirk.pem \
  -key ../../../config/kirk-key.pem
```


## Configure the admin certificate

In order to use `securityadmin.sh`, you must add the distinguished names (DNs) of all admin certificates to `opensearch.yml`. If you use the demo certificates, for example, `opensearch.yml` might contain the following lines for the `kirk` certificate:

```yml
plugins.security.authcz.admin_dn:
  - CN=kirk,OU=client,O=client,L=test,C=DE
```

You can't use node certificates as admin certificates. The two must be separate. Also, do not add whitespace between the parts of the DN.
{: .warning }


## Basic usage

The `securityadmin.sh` tool can be run from any machine that has access to the transport port of your OpenSearch cluster (the default port is 9300). You can change the security plugin configuration without having to access your nodes through SSH.

Each node also includes the tool at `plugins/opensearch-security/tools/securityadmin.sh`. You might need to make the script executable before running it:

```bash
chmod +x plugins/opensearch-security/tools/securityadmin.sh
```

To print all available command line options, run the script with no arguments:

```bash
./plugins/opensearch-security/tools/securityadmin.sh
```

To load your initial configuration (all YAML files), you might use the following command:

```bash
./securityadmin.sh -cd ../securityconfig/ -icl -nhnv \
  -cacert ../../../config/root-ca.pem \
  -cert ../../../config/kirk.pem \
  -key ../../../config/kirk-key.pem
```

- The `-cd` option specifies where the security plugin configuration files can be found.
- The `-icl` (`--ignore-clustername`) option tells the security plugin to upload the configuration regardless of the cluster name. As an alternative, you can also specify the cluster name with the `-cn` (`--clustername`) option.
- Because the demo certificates are self-signed, this command disables hostname verification with the `-nhnv` (`--disable-host-name-verification`) option.
- The `-cacert`, `-cert` and `-key` options define the location of your root CA certificate, the admin certificate, and the private key for the admin certificate. If the private key has a password, specify it with the `-keypass` option.

The following table shows the PEM options.

Name | Description
:--- | :---
`-cert` | The location of the PEM file containing the admin certificate and all intermediate certificates, if any. You can use an absolute or relative path. Relative paths are resolved relative to the execution directory of `securityadmin.sh`.
`-key` | The location of the PEM file containing the private key of the admin certificate. You can use an absolute or relative path. Relative paths are resolved relative to the execution directory of `securityadmin.sh`. The key must be in PKCS#8 format.
`-keypass` | The password of the private key of the admin certificate, if any.
`-cacert` | The location of the PEM file containing the root certificate. You can use an absolute or relative path. Relative paths are resolved relative to the execution directory of `securityadmin.sh`.


## Sample commands

Apply all YAML files in `securityconfig` using PEM certificates:

```bash
/usr/share/opensearch/plugins/opensearch-security/tools/securityadmin.sh \
  -cacert /etc/opensearch/root-ca.pem \
  -cert /etc/opensearch/kirk.pem \
  -key /etc/opensearch/kirk-key.pem \
  -cd /usr/share/opensearch/plugins/opensearch-security/securityconfig/
```

Apply a single YAML file (`config.yml`) using PEM certificates:

```bash
./securityadmin.sh \
  -f ../securityconfig/config.yml \
  -icl -nhnv -cert /etc/opensearch/kirk.pem \
  -cacert /etc/opensearch/root-ca.pem \
  -key /etc/opensearch/kirk-key.pem \
  -t config
```

Apply all YAML files in `securityconfig` with keystore and truststore files:

```bash
./securityadmin.sh \
  -cd /usr/share/opensearch/plugins/opensearch-security/securityconfig/ \
  -ks /path/to/keystore.jks \
  -kspass changeit \
  -ts /path/to/truststore.jks \
  -tspass changeit
  -nhnv
  -icl
```


## Using securityadmin with keystore and truststore files

You can also use keystore files in JKS format in conjunction with `securityadmin.sh`:

```bash
./securityadmin.sh -cd ../securityconfig -icl -nhnv
  -ts <path/to/truststore> -tspass <truststore password>
  -ks <path/to/keystore> -kspass <keystore password>
```

Use the following options to control the key and truststore settings.

Name | Description
:--- | :---
`-ks` | The location of the keystore containing the admin certificate and all intermediate certificates, if any. You can use an absolute or relative path. Relative paths are resolved relative to the execution directory of `securityadmin.sh`.
`-kspass` | The password for the keystore.
`-kst` | The key store type, either JKS or PKCS#12/PFX. If not specified, the security plugin tries to determine the type from the file extension.
`-ksalias` | The alias of the admin certificate, if any.
`-ts` | The location of the truststore containing the root certificate. You can use an absolute or relative path. Relative paths are resolved relative to the execution directory of `securityadmin.sh`.
`-tspass` | The password for the truststore.
`-tst` | The truststore type, either JKS or PKCS#12/PFX. If not specified, the security plugin tries to determine the type from the file extension.
`-tsalias` | The alias for the root certificate, if any.


### OpenSearch settings

If you run a default OpenSearch installation, which listens on transport port 9300 and uses `opensearch` as a cluster name, you can omit the following settings altogether. Otherwise, specify your OpenSearch settings by using the following switches.

Name | Description
:--- | :---
`-h` | OpenSearch hostname. Default is `localhost`.
`-p` | OpenSearch port. Default is 9300---not the HTTP port.
`-cn` | Cluster name. Default is `opensearch`.
`-icl` | Ignore cluster name.
`-sniff` | Sniff cluster nodes. Sniffing detects available nodes using the OpenSearch `_cluster/state` API.
`-arc,--accept-red-cluster` | Execute `securityadmin.sh` even if the cluster state is red. Default is false, which means the script will not execute on a red cluster.


### Certificate validation settings

Use the following options to control certificate validation.

Name | Description
:--- | :---
`-nhnv` | Do not validate hostname. Default is false.
`-nrhn` | Do not resolve hostname. Only relevant if `-nhnv` is not set.
`-noopenssl` | Do not use OpenSSL, even if available. Default is to use OpenSSL if it is available.


### Configuration files settings

The following switches define which configuration files you want to push to the security plugin. You can either push a single file or specify a directory containing one or more configuration files.

Name | Description
:--- | :---
`-cd` | Directory containing multiple security plugin configuration files.
`-f` | Single configuration file. Can't be used with `-cd`.
`-t` | File type.
`-rl` | Reload the current configuration and flush the internal cache.

To upload all configuration files in a directory, use this:

```bash
./securityadmin.sh -cd ../securityconfig -ts ... -tspass ... -ks ... -kspass ...
```

If you want to push a single configuration file, use this:

```bash
./securityadmin.sh -f ../securityconfig/internal_users.yml -t internalusers  \
    -ts ... -tspass ... -ks ... -kspass ...
```

The file type must be one of the following:

* config
* roles
* rolesmapping
* internalusers
* actiongroups


### Cipher settings

You probably won't need to change cipher settings. If you need to, use the following options.

Name | Description
:--- | :---
`-ec` | Comma-separated list of enabled TLS ciphers.
`-ep` | Comma-separated list of enabled TLS protocols.


### Backup, restore, and migrate

You can download all current configuration files from your cluster with the following command:

```bash
./securityadmin.sh -backup my-backup-directory -ts ... -tspass ... -ks ... -kspass ...
```

This command dumps the current security plugin configuration from your cluster to individual files in the directory you specify. You can then use these files as backups or to load the configuration into a different cluster. This command is useful when moving a proof-of-concept to production or if you need to add additional [reserved or hidden resources]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api/#reserved-and-hidden-resources):

```bash
./securityadmin.sh \
  -backup my-backup-directory \
  -icl \
  -nhnv \
  -cacert ../../../config/root-ca.pem \
  -cert ../../../config/kirk.pem \
  -key ../../../config/kirk-key.pem
```

To upload the dumped files to another cluster:

```bash
./securityadmin.sh -h production.example.com -p 9301 -cd /etc/backup/ -ts ... -tspass ... -ks ... -kspass ...
```

To migrate configuration YAML files from the Open Distro for Elasticsearch 0.x.x format to the OpenSearch 1.x.x format:

```bash
./securityadmin.sh -migrate ../securityconfig -ts ... -tspass ... -ks ... -kspass ...
```

Name | Description
:--- | :---
`-backup` | Retrieve the current security plugin configuration from a running cluster and dump it to the working directory.
`-migrate` | Migrate configuration YAML files from Open Distro for Elasticsearch 0.x.x to OpenSearch 1.x.x.


### Other options

Name | Description
:--- | :---
`-dci` | Delete the security plugin configuration index and exit. This option is useful if the cluster state is red due to a corrupted security plugin index.
`-esa` | Enable shard allocation and exit. This option is useful if you disabled shard allocation while performing a full cluster restart and need to recreate the security plugin index.
`-w` | Displays information about the used admin certificate.
`-rl` | By default, the security plugin caches authenticated users, along with their roles and permissions, for one hour. This option reloads the current security plugin configuration stored in your cluster, invalidating any cached users, roles, and permissions.
`-i` | The security plugin index name. Default is `.opendistro_security`.
`-er` | Set explicit number of replicas or auto-expand expression for the `opensearch_security` index.
`-era` | Enable replica auto-expand.
`-dra` | Disable replica auto-expand.
`-us` | Update the replica settings.
