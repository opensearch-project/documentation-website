---
layout: default
title: Active Directory and LDAP
parent: Authentication backends
nav_order: 60
redirect_from:
  - /security/configuration/ldap/
  - /security-plugin/configuration/ldap/
---

# Active Directory and LDAP

Active Directory and LDAP can be used for both authentication and authorization (the `authc` and `authz` sections of the configuration, respectively). Authentication checks whether the user has entered valid credentials. Authorization retrieves any backend roles for the user.

In most cases, you want to configure both authentication and authorization. You can also use authentication only and map the users retrieved from LDAP directly to Security plugin roles.


## Docker example

We provide a fully functional example that can help you understand how to use an LDAP server for both authentication and authorization.

1. Download and unzip [the example zip file]({{site.url}}{{site.baseurl}}/assets/examples/ldap-example.zip).
1. At the command line, run `docker-compose up`.
1. Review the files:

   * `docker-compose.yml` defines a single OpenSearch node, an LDAP server, and a PHP administration tool for the LDAP server.

     You can access the administration tool at https://localhost:6443. Acknowledge the security warning and log in using `cn=admin,dc=example,dc=org` and `changethis`.

   * `directory.ldif` seeds the LDAP server with three users and two groups.

     `psantos` is in the `Administrator` and `Developers` groups. `jroe` and `jdoe` are in the `Developers` group. The Security plugin loads these groups as backend roles.

   * `roles_mapping.yml` maps the `Administrator` and `Developers` LDAP groups (as backend roles) to security roles so that users gain the appropriate permissions after authenticating.

   * `internal_users.yml` removes all default users except `administrator` and `kibanaserver`.

   * `config.yml` includes all necessary LDAP settings.

1. Index a document as `psantos`:

   ```bash
   curl -XPUT 'https://localhost:9200/new-index/_doc/1' -H 'Content-Type: application/json' -d '{"title": "Spirited Away"}' -u 'psantos:password' -k
   ```

   If you try the same request as `jroe`, it fails. The `Developers` group is mapped to the `readall`, `manage_snapshots`, and `kibana_user` roles and has no write permissions.

1. Search for the document as `jroe`:

   ```bash
   curl -XGET 'https://localhost:9200/new-index/_search?pretty' -u 'jroe:password' -k
   ```

   This request succeeds, because the `Developers` group is mapped to the `readall` role.

1. If you want to examine the contents of the various containers, run `docker ps` to find the container ID and then `docker exec -it <container-id> /bin/bash`.


## Connection settings

To enable LDAP authentication and authorization, add the following lines to `config/opensearch-security/config.yml`:

```yml
authc:
  ldap:
    http_enabled: true
    transport_enabled: true
    order: 1
    http_authenticator:
      type: basic
      challenge: false
    authentication_backend:
      type: ldap
      config:
        ...
```

```yml
authz:
  ldap:
    http_enabled: true
    transport_enabled: true
    authorization_backend:
      type: ldap
      config:
      ...
```

The connection settings are identical for authentication and authorization and are added to the `config` sections.


### Hostname and port

To configure the hostname and port of your Active Directory servers, use the following:

```yml
config:
  hosts:
    - primary.ldap.example.com:389
    - secondary.ldap.example.com:389
```

You can configure more than one server here. If the Security plugin cannot connect to the first server, it tries to connect to the remaining servers sequentially.


### Timeouts

To configure connection and response timeouts to your Active Directory server, use the following (values are in milliseconds):

```yml
config:
  connect_timeout: 5000
  response_timeout: 0
```

If your server supports two-factor authentication (2FA), the default timeout settings might result in login errors. You can increase `connect_timeout` to accommodate the 2FA process. Setting `response_timeout` to 0 (the default) indicates an indefinite waiting period.


### Bind DN and password

To configure the `bind_dn` and `password` that the Security plugin uses when issuing queries to your server, use the following:

```yml
config:
  bind_dn: cn=admin,dc=example,dc=com
  password: password
```

If your server supports anonymous authentication, both `bind_dn` and `password` can be set to `null`.


### TLS settings

Use the following parameters to configure TLS for connecting to your server:

```yml
config:
  enable_ssl: <true|false>
  enable_start_tls: <true|false>
  enable_ssl_client_auth: <true|false>
  verify_hostnames: <true|false>
```

Name | Description
:--- | :---
`enable_ssl` | Whether to use LDAP over SSL (LDAPS).
`enable_start_tls` | Whether to use STARTTLS. Can't be used in combination with LDAPS.
`enable_ssl_client_auth` | Whether to send the client certificate to the LDAP server.
`verify_hostnames` | Whether to verify the hostnames of the server's TLS certificate.


### Certificate validation

By default, the Security plugin validates the TLS certificate of the LDAP servers against the root CA configured in `opensearch.yml`, either as a PEM certificate or a truststore:

```
plugins.security.ssl.transport.pemtrustedcas_filepath: ...
plugins.security.ssl.http.truststore_filepath: ...
```

If your server uses a certificate signed by a different CA, import this CA into your truststore or add it to your trusted CA file on each node.

You can also use a separate root CA in PEM format by setting one of the following configuration options:

```yml
config:
  pemtrustedcas_filepath: /full/path/to/trusted_cas.pem
```

```yml
config:
  pemtrustedcas_content: |-
    MIID/jCCAuagAwIBAgIBATANBgkqhkiG9w0BAQUFADCBjzETMBEGCgmSJomT8ixk
    ARkWA2NvbTEXMBUGCgmSJomT8ixkARkWB2V4YW1wbGUxGTAXBgNVBAoMEEV4YW1w
    bGUgQ29tIEluYy4xITAfBgNVBAsMGEV4YW1wbGUgQ29tIEluYy4gUm9vdCBDQTEh
    ...
```


Name | Description
:--- | :---
`pemtrustedcas_filepath` | Absolute path to the PEM file containing the root CAs of your Active Directory/LDAP server.
`pemtrustedcas_content` | The root CA content of your Active Directory/LDAP server. Cannot be used when `pemtrustedcas_filepath` is set.


### Client authentication

If you use TLS client authentication, the Security plugin sends the PEM certificate of the node, as configured in `opensearch.yml`. Set one of the following configuration options:

```yml
config:
  pemkey_filepath: /full/path/to/private.key.pem
  pemkey_password: private_key_password
  pemcert_filepath: /full/path/to/certificate.pem
```

or

```yml
config:
  pemkey_content: |-
    MIID2jCCAsKgAwIBAgIBBTANBgkqhkiG9w0BAQUFADCBlTETMBEGCgmSJomT8ixk
    ARkWA2NvbTEXMBUGCgmSJomT8ixkARkWB2V4YW1wbGUxGTAXBgNVBAoMEEV4YW1w
    bGUgQ29tIEluYy4xJDAiBgNVBAsMG0V4YW1wbGUgQ29tIEluYy4gU2lnbmluZyBD
    ...
  pemkey_password: private_key_password
  pemcert_content: |-
    MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCHRZwzwGlP2FvL
    oEzNeDu2XnOF+ram7rWPT6fxI+JJr3SDz1mSzixTeHq82P5A7RLdMULfQFMfQPfr
    WXgB4qfisuDSt+CPocZRfUqqhGlMG2l8LgJMr58tn0AHvauvNTeiGlyXy0ShxHbD
    ...
```

Name | Description
:--- | :---
`pemkey_filepath` | Absolute path to the file containing the private key of your certificate.
`pemkey_content` | The content of the private key of your certificate. Cannot be used when `pemkey_filepath` is set.
`pemkey_password` | The password of your private key, if any.
`pemcert_filepath` | Absolute path to the client certificate.
`pemcert_content` | The content of the client certificate. Cannot be used when `pemcert_filepath` is set.


### Enabled ciphers and protocols

You can limit the allowed ciphers and TLS protocols for the LDAP connection. For example, you can allow only strong ciphers and limit the TLS versions to the most recent ones:

```yml
ldap:
  http_enabled: true
  transport_enabled: true
  ...
  authentication_backend:
    type: ldap
    config:
      enabled_ssl_ciphers:
        - "TLS_DHE_RSA_WITH_AES_256_CBC_SHA"
        - "TLS_DHE_DSS_WITH_AES_128_CBC_SHA256"
      enabled_ssl_protocols:
        - "TLSv1.1"
        - "TLSv1.2"
```

Name | Description
:--- | :---
`enabled_ssl_ciphers` | Array, enabled TLS ciphers. Only the Java format is supported.
`enabled_ssl_protocols` | Array, enabled TLS protocols. Only the Java format is supported.


---

## Use Active Directory and LDAP for authentication

To use Active Directory/LDAP for authentication, first configure a respective authentication domain in the `authc` section of `config/opensearch-security/config.yml`:

```yml
authc:
  ldap:
    http_enabled: true
    transport_enabled: true
    order: 1
    http_authenticator:
      type: basic
      challenge: true
    authentication_backend:
      type: ldap
      config:
        ...
```

Next, add the [connection settings](#connection-settings) for your Active Directory/LDAP server to the config section of the authentication domain:

```yml
config:
  enable_ssl: true
  enable_start_tls: false
  enable_ssl_client_auth: false
  verify_hostnames: true
  hosts:
    - ldap.example.com:8389
  bind_dn: cn=admin,dc=example,dc=com
  password: passw0rd
```

Authentication works by issuing an LDAP query containing the user name against the user subtree of the LDAP tree.

The Security plugin first takes the configured LDAP query and replaces the placeholder `{0}` with the user name from the user's credentials.

```yml
usersearch: '(sAMAccountName={0})'
```

Then it issues this query against the user subtree. Currently, the entire subtree under the configured `userbase` is searched:

```yml
userbase: 'ou=people,dc=example,dc=com'
```

If the query is successful, the Security plugin retrieves the user name from the LDAP entry. You can specify which attribute from the LDAP entry the Security plugin should use as the user name:

```yml
username_attribute: uid
```

If this key is not set or null, then the distinguished name (DN) of the LDAP entry is used.


### Configuration summary

Name | Description
:--- | :---
`userbase` | Specifies the subtree in the directory where user information is stored.
`usersearch` | The actual LDAP query that the Security plugin executes when trying to authenticate a user. The variable {0} is substituted with the user name.
`username_attribute` | The Security plugin uses this attribute of the directory entry to look for the user name. If set to null, the DN is used (default).


### Complete authentication example

```yml
ldap:
  http_enabled: true
  transport_enabled: true
  order: 1
  http_authenticator:
    type: basic
    challenge: true
  authentication_backend:
    type: ldap
    config:
      enable_ssl: true
      enable_start_tls: false
      enable_ssl_client_auth: false
      verify_hostnames: true
      hosts:
        - ldap.example.com:636
      bind_dn: cn=admin,dc=example,dc=com
      password: password
      userbase: 'ou=people,dc=example,dc=com'
      usersearch: '(sAMAccountName={0})'
      username_attribute: uid
```


---

## Use Active Directory and LDAP for authorization

To use Active Directory/LDAP for authorization, first configure a respective authorization domain in the `authz` section of `config.yml`:

```yml
authz:
  ldap:
    http_enabled: true
    transport_enabled: true
    authorization_backend:
      type: ldap
      config:
      ...
```

Authorization is the process of retrieving backend roles for an authenticated user from an LDAP server. This is typically the same servers that you use for authentication, but you can also use a different server. The only requirement is that the user you use to fetch the roles actually exists on the LDAP server.

Because the Security plugin always checks if a user exists in the LDAP server, you must also configure `userbase`, `usersearch` and `username_attribute` in the `authz` section.

Authorization works similarly to authentication. The Security plugin issues an LDAP query containing the user name against the role subtree of the LDAP tree.

As an alternative, the Security plugin can also fetch roles that are defined as a direct attribute of the user entry in the user subtree.


### Approach 1: Query the role subtree

The Security plugin first takes the LDAP query for fetching roles ("rolesearch") and substitutes any variables found in the query. For example, for a standard Active Directory installation, you would use the following role search:

```yml
rolesearch: '(member={0})'
```

You can use the following variables:

- `{0}` is substituted with the DN of the user.
- `{1}` is substituted with the user name, as defined by the `username_attribute` setting.
- `{2}` is substituted with an arbitrary attribute value from the authenticated user's directory entry.

The variable `{2}` refers to an attribute from the user's directory entry. The attribute that you should use is specified by the `userroleattribute` setting:

```yml
userroleattribute: myattribute
```

The Security plugin then issues the substituted query against the configured role subtree. The entire subtree under `rolebase` is searched:

```yml
rolebase: 'ou=groups,dc=example,dc=com'
```

If you use nested roles (roles that are members of other roles), you can configure the Security plugin to resolve them:

```yml
resolve_nested_roles: false
```

After all roles have been fetched, the Security plugin extracts the final role names from a configurable attribute of the role entries:

```yml
rolename: cn
```

If this is not set, the DN of the role entry is used. You can now use this role name for mapping it to one or more of the Security plugin roles, as defined in `roles_mapping.yml`.


### Approach 2: Use a user's attribute as the role name

If you store the roles as a direct attribute of the user entries in the user subtree, you need to configure only the attribute name:

```yml
userrolename: roles
```

You can configure multiple attribute names:

```yml
userrolename: roles, otherroles
```

This approach can be combined with querying the role subtree. The Security plugin fetches the roles from the user's role attribute and then executes the role search.

If you don't use or have a role subtree, you can disable the role search completely:

```yml
rolesearch_enabled: false
```


### (Advanced) Control LDAP user attributes

By default, the Security plugin reads all LDAP user attributes and makes them available for index name variable substitution and DLS query variable substitution. If your LDAP entries have a lot of attributes, you might want to control which attributes should be made available. The fewer the attributes, the better the performance.

Note that this setting is made in the authentication `authc` section of the config.yml file.

Name | Description
:--- | :---
`custom_attr_allowlist`  | String array. Specifies the LDAP attributes that should be made available for variable substitution.
`custom_attr_maxval_len`  | Integer. Specifies the maximum allowed length of each attribute. All attributes longer than this value are discarded. A value of `0` disables custom attributes altogether. Default is 36.

Example:

```yml
authc:
  ldap:
    http_enabled: true
    transport_enabled: true
    authentication_backend:
      type: ldap
      config:
        custom_attr_allowlist:
          - attribute1
          - attribute2
        custom_attr_maxval_len: 36
      ...
```


### (Advanced) Exclude certain users from role lookup

If you are using multiple authentication methods, it can make sense to exclude certain users from the LDAP role lookup.

Consider the following scenario for a typical OpenSearch Dashboards setup: All OpenSearch Dashboards users are stored in an LDAP/Active Directory server.

However, you also have an OpenSearch Dashboards server user. OpenSearch Dashboards uses this user to manage stored objects and perform monitoring and maintenance tasks. You do not want to add this user to your Active Directory installation, but rather store it in the Security plugin internal user database.

In this case, it makes sense to exclude the OpenSearch Dashboards server user from the LDAP authorization because we already know that there is no corresponding entry. You can use the `skip_users` configuration setting to define which users should be skipped. Wildcards and regular expressions are supported:

```yml
skip_users:
  - kibanaserver
  - 'cn=Jane Doe,ou*people,o=TEST'
  - '/\S*/'
```


### (Advanced) Exclude roles from nested role lookups

If the users in your LDAP installation have a large number of roles, and you have the requirement to resolve nested roles as well, you might run into performance issues.

In most cases, however, not all user roles are related to OpenSearch and OpenSearch Dashboards. You might need only a couple of roles. In this case, you can use the nested role filter feature to define a list of roles that are filtered out from the list of the user's roles. Wildcards and regular expressions are supported.

This has an effect only if `resolve_nested_roles` is `true`:

```yml
nested_role_filter:
  - 'cn=Jane Doe,ou*people,o=TEST'
  - ...
```


### Configuration summary

Name | Description
:--- | :---
`rolebase`  | Specifies the subtree in the directory where role/group information is stored.
`rolesearch` | The actual LDAP query that the Security plugin executes when trying to determine the roles of a user. You can use three variables here (see below).
`userroleattribute`  | The attribute in a user entry to use for `{2}` variable substitution.
`userrolename`  | If the roles/groups of a user are not stored in the groups subtree, but as an attribute of the user's directory entry, define this attribute name here.
`rolename`  | The attribute of the role entry that should be used as the role name.
`resolve_nested_roles`  | Boolean. Whether or not to resolve nested roles. Default is `false`.
`max_nested_depth`  | Integer. When `resolve_nested_roles` is `true`, this defines the maximum number of nested roles to traverse. Setting smaller values can reduce the amount of data retrieved from LDAP and improve authentication times at the cost of failing to discover deeply nested roles. Default is `30`.
`skip_users`  | Array of users that should be skipped when retrieving roles. Wildcards and regular expressions are supported.
`nested_role_filter`  | Array of role DNs that should be filtered before resolving nested roles. Wildcards and regular expressions are supported.
`rolesearch_enabled`  | Boolean. Enable or disable the role search. Default is `true`.
`custom_attr_allowlist`  | String array. Specifies the LDAP attributes that should be made available for variable substitution.
`custom_attr_maxval_len`  | Integer. Specifies the maximum allowed length of each attribute. All attributes longer than this value are discarded. A value of `0` disables custom attributes altogether. Default is 36.


### Complete authorization example

```yml
authz:
  ldap:
    http_enabled: true
    transport_enabled: true
    authorization_backend:
      type: ldap
      config:
        enable_ssl: true
        enable_start_tls: false
        enable_ssl_client_auth: false
        verify_hostnames: true
        hosts:
          - ldap.example.com:636
        bind_dn: cn=admin,dc=example,dc=com
        password: password
        userbase: 'ou=people,dc=example,dc=com'
        usersearch: '(uid={0})'
        username_attribute: uid
        rolebase: 'ou=groups,dc=example,dc=com'
        rolesearch: '(member={0})'
        userroleattribute: null
        userrolename: none
        rolename: cn
        resolve_nested_roles: true
        skip_users:
          - kibanaserver
          - 'cn=Jane Doe,ou*people,o=TEST'
          - '/\S*/'
```

### (Advanced) Configuring multiple user and role bases

To configure multiple user bases in the authc and/or authz section, use the following syntax:

```yml
        ...
        bind_dn: cn=admin,dc=example,dc=com
        password: password
        users:
          primary-userbase:
             base: 'ou=people,dc=example,dc=com'
             search: '(uid={0})'
          secondary-userbase:
             base: 'cn=users,dc=example,dc=com'
             search: '(uid={0})'
        username_attribute: uid
        ...
```

Similarly, use the following setup to configure multiple role bases in the authz section:

```yml
        ...
        username_attribute: uid
        roles:
          primary-rolebase:
            base: 'ou=groups,dc=example,dc=com'
            search: '(uniqueMember={0})'
          secondary-rolebase:
            base: 'ou=othergroups,dc=example,dc=com'
            search: '(member={0})'
        userroleattribute: null
        ...
```

### Complete authentication and authorization with multiple user and role bases example:

```yml
authc:
  ...
  ldap:
    http_enabled: true
    transport_enabled: true
    order: 1
    http_authenticator:
      type: basic
      challenge: true
    authentication_backend:
      type: ldap
      config:
        enable_ssl: true
        enable_start_tls: false
        enable_ssl_client_auth: false
        verify_hostnames: true
        hosts:
          - ldap.example.com:636
        bind_dn: cn=admin,dc=example,dc=com
        password: password
        users:
          primary-userbase:
             base: 'ou=people,dc=example,dc=com'
             search: '(uid={0})'
          secondary-userbase:
             base: 'cn=users,dc=example,dc=com'
             search: '(uid={0})'
        username_attribute: uid
authz:
  ldap:
    http_enabled: true
    transport_enabled: true
    authorization_backend:
      type: ldap
      config:
        enable_ssl: true
        enable_start_tls: false
        enable_ssl_client_auth: false
        verify_hostnames: true
        hosts:
          - ldap.example.com:636
        bind_dn: cn=admin,dc=example,dc=com
        password: password
        users:
          primary-userbase:
             base: 'ou=people,dc=example,dc=com'
             search: '(uid={0})'
          secondary-userbase:
             base: 'cn=users,dc=example,dc=com'
             search: '(uid={0})'
        username_attribute: uid
        roles:
          primary-rolebase:
            base: 'ou=groups,dc=example,dc=com'
            search: '(uniqueMember={0})'
          secondary-rolebase:
            base: 'ou=othergroups,dc=example,dc=com'
            search: '(member={0})'
        userroleattribute: null
        userrolename: none
        rolename: cn
        resolve_nested_roles: true
```
