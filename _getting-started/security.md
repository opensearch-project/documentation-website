---
layout: default
title: Getting started with OpenSearch security
nav_order: 60
---

# Getting started with OpenSearch security
The simplest way to get started with security in OpenSearch is using the demo configuration. Naturally, this is configuration should never be used in production, as it uses demo certificates and default passwords. All of this configuration should be updated with your custom details prior to moving to production.

# Demo configuration
## OpenSearch
OpenSearch comes bundled with a number of useful scripts, one of which is `install_demo_configuration.sh` (or `install_demo_configuration.bat` for windows).
This script is normally located in `plugins/opensearch-security/tools` and can perform the following actions:
- create demo certificates for TLS encryption on transport and REST layer.
- configure demo users, roles, role mappings.
- configure security plugin to use internal database for authentication and authorization.
- update `opensearch.yml` file with basic configuration needed to get the cluster started.

Prior to running the `install_demo_configuration.sh` script you must create environment variable named `OPENSEARCH_INITIAL_ADMIN_PASSWORD` with strong password, as this will be used as password for admin user to authenticate with OpenSearch. Once this is completed, you can execute `install_demo_configuration.sh` and follow the terminal prompt to enter necessary details.

Once this is complete, you can start OpenSearch and test out the configuration by running the below command:
`curl -k -XGET -uadmin:<password> https://<opensearch-ip>:9200`
You should see similar output to the following:
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
## OpenSearch Dashboards
OpenSearch Dashboards comes built in with basic configuration already available in `config/opensearch_dashboards.yml`
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
You can start the binary or service, depending on which method was used to install OpenSearch and OpenSearch Dashboards.
Once OpenSearch Dashboards is started, you should see following two lines in the logs:
```
[info][listening] Server running at http://localhost:5601
[info][server][OpenSearchDashboards][http] http server running at http://localhost:5601
```

You can now access the OpenSearch Dashboards using http://localhost:5601 in your browser. Using username `admin` and password that was configured in `OPENSEARCH_INITIAL_ADMIN_PASSWORD` environment variable.

# Adding users
There are three ways to add users, roles, etc.
  - updating appropriate yaml file (`internal_users.yml` file for adding/updating/removing users) 
  - using API
  - using OpenSearch Dashboards UI

Security configuration files are usually located in `config/opensearch-security` directory
{: .note}

You can add OpenSearch Dashboards user by updating `internal_users.yml` file as follows: 

```
test-user:
  hash: "$2y$12$CkxFoTAJKsZaWv/m8VoZ6ePG3DBeBTAvoo4xA2P21VCS9w2RYumsG"
  backend_roles:
  - "test-backend-role"
  - "kibanauser"
  description: "test user user"
```
The `hash` string is generated using `hash.sh` script located in `plugins/opensearch-security/tools/` directory. In this case password of `secretpassword` was used.
Note the use of build in backend role `kibanauser` which is going to give user permissions needed to navigate OpenSearch Dashboards.

# Creating role

The structure of the role in `roles.yml` file is as follows:
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

Using this structure you can configure a new role to give access to specific indices, see the following configuration:

```
human_resources:
  index_permissions:
    - index_patterns:
      - "humanresources"
      allowed_actions:
        - "READ"
```
Note that the cluster permissions are not listed in this example, as these are provided by built in role `kibana_user` which is already mapped using `kibanauser` backend role.

# Mapping users to roles
When user logs in to OpenSearch, they need to be mapped to appropriate role in order to obtain the correct permissions. This mapping is done via `roles_mapping.yml` file, with the following structure:
```
<role_name>:
  users:
    - <username>
    - ...
  backend_roles:
    - <rolename>
```

In order to map the newly created user `test-user` to the role `human_resources`, you can use the following configuration in `roles_mapping.yml` file:
```
human_resources:
  backend_roles:
    - test-backend-role
```

If you examine the already existing roles_mappings.yml file, you can see the backend role of `kibanauser` is already being mapped to `kibana_user` role, see the following configuration:
```
kibana_user:
  reserved: false
  backend_roles:
  - "kibanauser"
  description: "Maps kibanauser to kibana_user"
```

# Uploading the configuration to security index
The final step in configuring users, roles and any other security configuration is uploading it to OpenSearch security index. Simply updating the files, without uploading, will not have any impact on the configuration that is running in OpenSearch. 
To upload configuration, following command can be used with admin certificate that was generated with demo install:
`plugins/opensearch-security/tools/securityadmin.sh -cd "config/opensearch-security" -icl -key "../kirk-key.pem" -cert "../kirk.pem" -cacert "../root-ca.pem" -nhnv`
