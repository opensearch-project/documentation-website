---
layout: default
title: Best practices
parent: Configuration
nav_order: 3
canonical_url: https://docs.opensearch.org/latest/security/configuration/best-practices/
---

# Best practices for OpenSearch security

Setting up security in OpenSearch is crucial for protecting your data. Here are 10 best practices that offer clear steps for keeping your system safe.

## 1. Use your own PKI to set up SSL/TLS

Although using your own public key infrastructure (PKI), such as [AWS Certificate Manager](https://docs.aws.amazon.com/crypto/latest/userguide/awspki-service-acm.html), requires more initial effort, a custom PKI provides you with the flexibility needed to set up SSL/TLS in the most secure and performant way.

### Enable SSL/TLS for node- and REST-layer traffic

SSL/TLS is enabled by default on the transport layer, which is used for node-to-node communication. SSL/TLS is disabled by default on the REST layer.

The following setting is required in order to enable encryption on the REST layer: 

```
plugins.security.ssl.http.enabled: true
```
{% include copy.html %}


For additional configuration options, such as specifying certificate paths, keys, and certificate authority files, refer to [Configuring TLS certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/).

### Replace all demo certificates with your own PKI

The certificates generated when initializing an OpenSearch cluster with `install_demo_configuration.sh` are not suitable for production. These should be replaced with your own certificates.

You can generate custom certificates in a few different ways. One approach is to use OpenSSL, described in detail at [Generating self-signed certificates]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/). Alternatively, there are online tools available that can simplify the certificate creation process, such as the following:

- [SearchGuard TLS Tool](https://docs.search-guard.com/latest/offline-tls-tool)
- [TLSTool by dylandreimerink](https://github.com/dylandreimerink/tlstool)

## 2. Prefer client certificate authentication for API authentication

Client certificate authentication offers a secure alternative to password authentication and is more suitable for machine-to-machine interactions. It also ensures low performance overhead because the authentication occurs on the TLS level. Nearly all client software, such as curl and client libraries, support this authentication method.

For detailed configuration instructions and additional information about client certificate authentication, see [Enabling client certificate authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/client-auth/#enabling-client-certificate-authentication).


## 3. Prefer SSO using SAML or OpenID for OpenSearch Dashboards authentication

Implementing single sign-on (SSO) with protocols like SAML or OpenID for OpenSearch Dashboards authentication enhances security by delegating credential management to a dedicated system.

This approach minimizes direct interaction with passwords in OpenSearch, streamlines authentication processes, and prevents clutter in the internal user database. For more information, go to the [SAML section of the OpenSearch documentation]({{site.url}}{{site.baseurl}}/security/authentication-backends/saml/).

## 4. Limit the number of roles assigned to a user

Prioritizing fewer, more intricate user roles over numerous simplistic roles enhances security and simplifies administration.

Additional best practices for role management include:

1. Role granularity: Define roles based on specific job functions or access requirements to minimize unnecessary privileges.
2. Regular role review: Regularly review and audit assigned roles to ensure alignment with organizational policies and access needs.

For more information about roles, go to the documentation on [defining users and roles in OpenSearch]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/).

## 5. Verify DLS, FLS, and field masking

If you have configured Document Level Security (DLS), Field Level Security (FLS), or field masking, make sure you double-check your role definitions, especially if a user is mapped to multiple roles. It is highly recommended that you test this by making a GET request to `_plugins/_security/authinfo`.

The following resources provide detailed examples and additional configurations:

 - [Document-level security]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security/).
 - [Field-level security]({{site.url}}{{site.baseurl}}/security/access-control/field-level-security/).
 - [Field masking]({{site.url}}{{site.baseurl}}/security/access-control/field-masking/).

## 6. Use only the essentials for the audit logging configuration

Extensive audit logging can degrade system performance due to the following:

- Each logged event adds to the processing load.
- Audit logs can quickly grow in size, consuming significant disk space.

To ensure optimal performance, disable unnecessary logging and be selective about which logs are used. If not strictly required by compliance regulations, consider turning off audit logging. If audit logging is essential for your cluster, configure it according to your compliance requirements.

Whenever possible, adhere to these recommendations:

- Set `audit.log_request_body` to `false`.
- Set `audit.resolve_bulk_requests` to `false`.
- Enable `compliance.write_log_diffs`.
- Minimize entries for `compliance.read_watched_fields`.
- Minimize entries for `compliance.write_watched_indices`.

## 7. Consider disabling the private tenant

In many cases, the use of private tenants is unnecessary, although this feature is enabled by default. As a result, every OpenSearch Dashboards user is provided with their own private tenant and a corresponding new index in which to save objects. This can lead to a large number of unnecessary indexes. Evaluate whether private tenants are needed in your cluster. If private tenants are not needed, disable the feature by adding the following configuration to the `config.yml` file:

```yaml
config:
  dynamic:
    kibana:
      multitenancy_enabled: true
      private_tenant_enabled: false
```
{% include copy.html %}

## 8. Manage the configuration using `securityadmin.sh`

Use `securityadmin.sh` to manage the configuration of your clusters. `securityadmin.sh` is a command-line tool provided by OpenSearch for managing security configurations. It allows administrators to efficiently manage security settings, including roles, role mappings, and other security-related configurations within an OpenSearch cluster.

Using `securityadmin.sh` provides the following benefits:

1. Consistency: By using `securityadmin.sh`, administrators can ensure consistency across security configurations within a cluster. This helps to maintain a standardized and secure environment.
2. Automation: `securityadmin.sh` enables automation of security configuration tasks, making it easier to deploy and manage security settings across multiple nodes or clusters.
3. Version control: Security configurations managed through `securityadmin.sh` can be version controlled using standard version control systems like Git. This facilitates tracking changes, auditing, and reverting to previous configurations.

You can prevent configuration overrides by first creating a backup of the current configuration created using the OpenSearch Dashboards UI or the OpenSearch API by running the `securityadmin.sh` tool with the `-backup` option. This ensures that all configurations are captured before uploading the modified configuration with `securityadmin.sh`.

For more detailed information about using `securityadmin.sh` and managing OpenSearch security configurations, refer to the following resources:
- [Applying changes to configuration files]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/)
- [Modifying YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/)

## 9. Replace all default passwords

When initializing OpenSearch with the demo configuration, many default passwords are provided for internal users in `internal_users.yml`, such as `admin`, `kibanaserver`, and `logstash`.

You should change the passwords for these users to strong, complex passwords either at startup or as soon as possible once the cluster is running. Creating password configurations is a straightforward procedure, especially when using the scripts bundled with OpenSearch, like `hash.sh` or `hash.bat`, located in the `plugin/OpenSearch security/tools` directory.

The `kibanaserver` user is a crucial component that allows OpenSearch Dashboards to communicate with the OpenSearch cluster. By default, this user is preconfigured with a default password in the demo configuration. This should be replaced with a strong, unique password in the OpenSearch configuration, and the `opensearch_dashboards.yml` file should be updated to reflect this change.


## 10. Getting help

If you need additional help, you can do the following:

- Create an issue on GitHub at [OpenSearch-project/security](https://github.com/opensearch-project/security/security) or [OpenSearch-project/OpenSearch](https://github.com/opensearch-project/OpenSearch/security).
- Ask a question on the [OpenSearch forum](https://forum.opensearch.org/tag/cve).
