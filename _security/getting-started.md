---
layout: default
title: Getting started with OpenSearch security
nav_order: 1
redirect_from:
  - /getting-started/security/
canonical_url: https://docs.opensearch.org/latest/security/getting-started/
---

# Getting started with OpenSearch security

The demo configuration is the most straightforward way to get started with OpenSearch security. OpenSearch comes bundled with a number of useful scripts, including `install_demo_configuration.sh` (or `install_demo_configuration.bat` for Windows).

This script is located in `plugins/opensearch-security/tools` and performs the following actions:

- Creates demo certificates for TLS encryption on both the transport and REST layers.
- Configures demo users, roles, and role mappings.
- Configures the Security plugin to use an internal database for authentication and authorization.
- Updates the `opensearch.yml` file with the basic configuration needed to start the cluster.

You can find more information about the demo configuration and how to quickly get started at [Setting up a demo configuration]({{site.url}}{{site.baseurl}}/security/configuration/demo-configuration/).
{: .note}

Certain aspects of this configuration, such as demo certificates and default passwords, should never be used in production. These parts of the demo configuration should be replaced with your custom information before proceeding to production.
{: .warning}

## Setting up the demo configuration

Prior to running the `install_demo_configuration.sh` script, you must create an environment variable named `OPENSEARCH_INITIAL_ADMIN_PASSWORD` with a strong password. This will be used as the password for the admin user to authenticate with OpenSearch. Use the online tool [_Zxcvbn_](https://lowe.github.io/tryzxcvbn/) to test the strength of any password. After this, you can execute `install_demo_configuration.sh` and follow the terminal prompt to enter necessary details.

After the script is executed, you can start OpenSearch and test the configuration by running the following command:

```
curl -k -XGET -u admin:<password> https://<opensearch-ip>:9200
```
{% include copy.html %}

You should see output similar to the following:

```
{
  "name" : "smoketestnode",
  "cluster_name" : "opensearch",
  "cluster_uuid" : "0a5DYAk0Rbi14wqT3TqMiQ",
  "version" : {
    "distribution" : "opensearch",
    "number" : "2.13.0",
    "build_type" : "tar",
    "build_hash" : "7ec678d1b7c87d6e779fdef94e33623e1f1e2647",
    "build_date" : "2024-03-26T00:04:51.025238748Z",
    "build_snapshot" : false,
    "lucene_version" : "9.10.0",
    "minimum_wire_compatibility_version" : "7.10.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "The OpenSearch Project: https://opensearch.org/"
}
```

## Setting up OpenSearch Dashboards

In order to quickly get started with OpenSearch Dashboards, you can add the following configuration to `opensearch_dashboards.yml`:

```
opensearch.hosts: [https://localhost:9200]
opensearch.ssl.verificationMode: none
opensearch.username: kibanaserver
opensearch.password: kibanaserver
opensearch.requestHeadersWhitelist: [authorization, securitytenant]

opensearch_security.multitenancy.enabled: true
opensearch_security.multitenancy.tenants.preferred: [Private, Global]
opensearch_security.readonly_mode.roles: [kibana_read_only]
# Use this setting if you are running opensearch-dashboards without https
opensearch_security.cookie.secure: false
```
{% include copy.html %}

You can start the binary or service, depending on which method was used to install OpenSearch and OpenSearch Dashboards.

When using binary, you need to supply `--no-base-path` to `yarn start` command to set a URL without a base path. If this is not set, a random three-letter base path will be added.
{: .note}

After starting OpenSearch Dashboards, you should see the following two log lines:

```
[info][listening] Server running at http://localhost:5601
[info][server][OpenSearchDashboards][http] http server running at http://localhost:5601
```
{% include copy.html %}

You can now access OpenSearch Dashboards using http://localhost:5601 in your browser. Use the username `admin` and the password that was configured in the `OPENSEARCH_INITIAL_ADMIN_PASSWORD` environment variable.

# Adding users

There are three ways to add users, roles, and other security-related configurations:

  - Updating appropriate configuration files (`internal_users.yml` for adding/updating/removing users) 
  - Using the API
  - Using the OpenSearch Dashboards UI

Security configuration files are located in the `config/opensearch-security` directory.
{: .note}

You can add an OpenSearch Dashboards user by updating the `internal_users.yml` file with the following settings:

```
test-user:
  hash: "$2y$12$CkxFoTAJKsZaWv/m8VoZ6ePG3DBeBTAvoo4xA2P21VCS9w2RYumsG"
  backend_roles:
  - "test-backend-role"
  - "kibanauser"
  description: "test user user"
```
{% include copy.html %}

The `hash` string is generated using the `hash.sh` script located in the `plugins/opensearch-security/tools/` directory. In this case, the hash of the string `secretpassword` was used.

Note the use of the built-in backend role `kibanauser`, which provides the user permissions needed to navigate OpenSearch Dashboards.

## Creating roles

Roles contained in `roles.yml` use the following structure:

```
<rolename>:
  cluster_permissions:
    - <cluster permission>
  index_permissions:
    - index_patterns:
      - <index pattern>
      allowed_actions:
        - <index permissions>
```
{% include copy.html %}

Using this structure, you can configure a new role to provide access to specific indexes, such as the role configured in the following example:

```
human_resources:
  index_permissions:
    - index_patterns:
      - "humanresources"
      allowed_actions:
        - "READ"
```
{% include copy.html %}

Note that the cluster permissions are not listed in this example because these are provided by the built-in role `kibana_user`, which is already mapped using the `kibanauser` backend role.


## Mapping users to roles

When a user logs in to OpenSearch, they need to be mapped to the appropriate role in order to obtain the correct permissions. This mapping is performed using the `roles_mapping.yml` file with the following structure:

```
<role_name>:
  users:
    - <username>
    - ...
  backend_roles:
    - <rolename>
```
{% include copy.html %}

In order to map the newly created user `test-user` to the role `human_resources`, you can use the following configuration in the `roles_mapping.yml` file:

```
human_resources:
  backend_roles:
    - test-backend-role
```
{% include copy.html %}

As an additional example, the `roles_mappings.yml` file includes the backend role `kibanauser` that has been mapped to the `kibana_user` role:

```
kibana_user:
  reserved: false
  backend_roles:
  - "kibanauser"
  description: "Maps kibanauser to kibana_user"
```
{% include copy.html %}

## Uploading the configuration to a security index

The final step in configuring a user, role, or any other security configuration is uploading it to a OpenSearch security index. Only updating the files, without uploading them, will not change the configuration of an already running OpenSearch cluster. 

To upload a configuration, the following command can be used with the admin certificate that was generated during `install_demo_configuration.sh` execution:

```
./plugins/opensearch-security/tools/securityadmin.sh -cd "config/opensearch-security" -icl -key "../kirk-key.pem" -cert "../kirk.pem" -cacert "../root-ca.pem" -nhnv
```
{% include copy.html %}

## Next steps

The [Best practices for OpenSearch security]({{site.url}}{{site.baseurl}}/security/configuration/best-practices/)  guide covers 10 things to consider when getting started with OpenSearch security.

The [Security configuration]({{site.url}}{{site.baseurl}}/security/configuration/index/) overview provides the basic steps for setting up security in your OpenSearch implementation and includes links to information about customizing security for your business needs. 