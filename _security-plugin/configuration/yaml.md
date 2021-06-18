---
layout: default
title: YAML Files
parent: Configuration
nav_order: 3
redirect_from: /docs/security/configuration/yaml/
---

# YAML files

Before running `securityadmin.sh` to load the settings into the `.opendistro_security` index, configure the YAML files in `plugins/opensearch-security/securityconfig`. You might want to back up these files so that you can reuse them on other clusters.

The best use of these YAML files is to configure [reserved and hidden resources]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api#reserved-and-hidden-resources), such as the `admin` and `kibanaserver` users. You might find it easier to create other users, roles, mappings, action groups, and tenants using OpenSearch Dashboards or the REST API.


## internal_users.yml

This file contains any initial users that you want to add to the security plugin's internal user database.

The file format requires a hashed password. To generate one, run `plugins/opensearch-security/tools/hash.sh -p <new-password>`. If you decide to keep any of the demo users, *change their passwords* and re-run [securityadmin.sh]({{site.url}}{{site.baseurl}}/security-plugin/configuration/security-admin/) to apply the new passwords.

```yml
---
# This is the internal user database
# The hash value is a bcrypt hash and can be generated with plugin/tools/hash.sh

_meta:
  type: "internalusers"
  config_version: 2

# Define your internal users here
new-user:
  hash: "$2y$12$88IFVl6IfIwCFh5aQYfOmuXVL9j2hz/GusQb35o.4sdTDAEMTOD.K"
  reserved: false
  hidden: false
  opensearch_security_roles:
  - "specify-some-security-role-here"
  backend_roles:
  - "specify-some-backend-role-here"
  attributes:
    attribute1: "value1"
  static: false

## Demo users

admin:
  hash: "$2a$12$VcCDgh2NDk07JGN0rjGbM.Ad41qVR/YFJcgHp0UGns5JDymv..TOG"
  reserved: true
  backend_roles:
  - "admin"
  description: "Demo admin user"

kibanaserver:
  hash: "$2a$12$4AcgAt3xwOWadA5s5blL6ev39OXDNhmOesEoo33eZtrq2N0YrU3H."
  reserved: true
  description: "Demo user for the OpenSearch Dashboards server"

kibanaro:
  hash: "$2a$12$JJSXNfTowz7Uu5ttXfeYpeYE0arACvcwlPBStB1F.MI7f0U9Z4DGC"
  reserved: false
  backend_roles:
  - "kibanauser"
  - "readall"
  attributes:
    attribute1: "value1"
    attribute2: "value2"
    attribute3: "value3"
  description: "Demo read-only user for OpenSearch dashboards"

logstash:
  hash: "$2a$12$u1ShR4l4uBS3Uv59Pa2y5.1uQuZBrZtmNfqB3iM/.jL0XoV9sghS2"
  reserved: false
  backend_roles:
  - "logstash"
  description: "Demo logstash user"

readall:
  hash: "$2a$12$ae4ycwzwvLtZxwZ82RmiEunBbIPiAmGZduBAjKN0TXdwQFtCwARz2"
  reserved: false
  backend_roles:
  - "readall"
  description: "Demo readall user"

snapshotrestore:
  hash: "$2y$12$DpwmetHKwgYnorbgdvORCenv4NAK8cPUg8AI6pxLCuWf/ALc0.v7W"
  reserved: false
  backend_roles:
  - "snapshotrestore"
  description: "Demo snapshotrestore user"
```


## roles.yml

This file contains any initial roles that you want to add to the security plugin. Aside from some metadata, the default file is empty, because the security plugin has a number of static roles that it adds automatically.

```yml
---
complex-role:
  reserved: false
  hidden: false
  cluster_permissions:
  - "read"
  - "cluster:monitor/nodes/stats"
  - "cluster:monitor/task/get"
  index_permissions:
  - index_patterns:
    - "opensearch_dashboards_sample_data_*"
    dls: "{\"match\": {\"FlightDelay\": true}}"
    fls:
    - "~FlightNum"
    masked_fields:
    - "Carrier"
    allowed_actions:
    - "read"
  tenant_permissions:
  - tenant_patterns:
    - "analyst_*"
    allowed_actions:
    - "kibana_all_write"
  static: false
_meta:
  type: "roles"
  config_version: 2
```


## roles_mapping.yml

```yml
---
manage_snapshots:
  reserved: true
  hidden: false
  backend_roles:
  - "snapshotrestore"
  hosts: []
  users: []
  and_backend_roles: []
logstash:
  reserved: false
  hidden: false
  backend_roles:
  - "logstash"
  hosts: []
  users: []
  and_backend_roles: []
own_index:
  reserved: false
  hidden: false
  backend_roles: []
  hosts: []
  users:
  - "*"
  and_backend_roles: []
  description: "Allow full access to an index named like the username"
kibana_user:
  reserved: false
  hidden: false
  backend_roles:
  - "kibanauser"
  hosts: []
  users: []
  and_backend_roles: []
  description: "Maps kibanauser to kibana_user"
complex-role:
  reserved: false
  hidden: false
  backend_roles:
  - "ldap-analyst"
  hosts: []
  users:
  - "new-user"
  and_backend_roles: []
_meta:
  type: "rolesmapping"
  config_version: 2
all_access:
  reserved: true
  hidden: false
  backend_roles:
  - "admin"
  hosts: []
  users: []
  and_backend_roles: []
  description: "Maps admin to all_access"
readall:
  reserved: true
  hidden: false
  backend_roles:
  - "readall"
  hosts: []
  users: []
  and_backend_roles: []
kibana_server:
  reserved: true
  hidden: false
  backend_roles: []
  hosts: []
  users:
  - "kibanaserver"
  and_backend_roles: []
```


## action_groups.yml

This file contains any initial action groups that you want to add to the security plugin.

Aside from some metadata, the default file is empty, because the security plugin has a number of static action groups that it adds automatically. These static action groups cover a wide variety of use cases and are a great way to get started with the plugin.

```yml
---
my-action-group:
  reserved: false
  hidden: false
  allowed_actions:
  - "indices:data/write/index*"
  - "indices:data/write/update*"
  - "indices:admin/mapping/put"
  - "indices:data/write/bulk*"
  - "read"
  - "write"
  static: false
_meta:
  type: "actiongroups"
  config_version: 2
```

## tenants.yml

```yml
---
_meta:
  type: "tenants"
  config_version: 2
admin_tenant:
  reserved: false
  description: "Demo tenant for admin user"
```


## nodes_dn.yml

```yml
---
_meta:
  type: "nodesdn"
  config_version: 2

# Define nodesdn mapping name and corresponding values
# cluster1:
#   nodes_dn:
#       - CN=*.example.com
```
