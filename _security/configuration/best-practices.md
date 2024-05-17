---
layout: default
title: Best Practices
nav_order: 11
---

# Best Practices for OpenSearch Security

Setting up secure practices in OpenSearch is crucial for protecting your data. Here are 10 best practices that offer clear steps on keeping your system safe.

## 1. Use your own public key infrastructure (PKI) to setup SSL/TLS for OpenSearch

Although using your own PKI, such as [AWS Certificate Manager](https://docs.aws.amazon.com/crypto/latest/userguide/awspki-service-acm.html), requires more effort at the beginning, a custom PKI provides you with all the flexibility needed to set up SSL/TLS in the most secure and performant way.

### Enable SSL/TLS for node and REST layer traffic

The SSL/TLS is enabled by default for the transport layer, which is used by node to node communication. The SSL/TLS on the REST layer is disabled by default.

The following setting is required to enable encryption at REST layer: `plugins.security.ssl.http.enabled: true`

For additional configuration options, such as specifying certificate paths, keys and certificate-authority files you can refer the steps on [configuring TLS certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/)

### Replace all demo certificates with your own PKI
The certificates generated when initializing OpenSearch cluster with `install_demo_configuration.sh` are not suitable for production. These should be replaced with your own certificates.

You can generate custom certificates in a few different ways. One approach is by using OpenSSL, described in detail on [Generating self-signed certificates]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/), alternatively there are tools available online which can simplify the certificate creation process.

## 2. Prefer client certificate authentication for API authentication

Client certificate authentication offers a secure alternative to passwords and is more suitable for machine-to-machine interactions. It also ensures low performance overhead since the authentication occurs at the TLS level. Nearly all client software, such as curl, and client libraries support this authentication method.

For detailed configuration instructions, refer to [Enabling client certificate authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/client-auth/#enabling-client-certificate-authentication).

Details on configuring client certificate authentication can be found at [Enabling client certificate authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/client-auth/#enabling-client-certificate-authentication)

## 3. Prefer Single Sign-on (SSO) using SAML or OpenID for Dashboards authentication

Implementing Single Sign-On (SSO) with protocols like Security Assertion Markup Language (SAML) or OpenID for Dashboards authentication enhances security by delegating credential management to a dedicated system.

This approach minimizes direct interaction with passwords in OpenSearch, streamlines authentication processes, and prevents clutter in the internal user database. For more information, visit the [SAML section of the OpenSearch documentation]({{site.url}}{{site.baseurl}}/security/authentication-backends/saml/).

## 4. Limit the number of roles assigned to a user

Prioritizing fewer, more intricate roles over numerous, simplistic roles for users enhances security and simplifies administration.

Additional best practices for role management might include:

1. Role granularity: Define roles based on specific job functions or access requirements to minimize unnecessary privileges.
2. Regular review: Regularly review and audit assigned roles to ensure alignment with organizational policies and access needs.

For more information about roles, visit the documentation on [defining users and roles in OpenSearch]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/).

## 5. Verify DLS, FLS and field masking

If you have configured Document Level Security (DLS), Field Level Security (FLS), or field masking, make you double-check your role definitions, especially if a user is mapped to multiple roles. It is highly recommended to test this by making a GET request to `_plugins/_security/authinfo`.

Detailed examples and additional configurations are available at:
 - [Document-level security]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security/)
 - [Field-level security]({{site.url}}{{site.baseurl}}/security/access-control/field-level-security/)
 - [Field masking]({{site.url}}{{site.baseurl}}/security/access-control/field-masking/)

## 6. Strip audit logging configuration to essentials only

Extensive audit logging can degrade system performance due to the following reasons:
- Each logged event adds to the processing load.
- Audit logs can quickly grow in size, consuming significant disk space.

To ensure optimal performance, disable unnecessary logging and be selective about which logs are used. If not strictly required by compliance regulations, consider turning off audit logging. If audit logging is essential for your cluster, configure it according to your compliance requirements.

Whenever possible, adhere to these recommendations:

- Set `audit.log_request_body` to `false`.
- Set `audit.resolve_bulk_requests` to `false`.
- Enable `compliance.write_log_diffs`.
- Minimize entries for `compliance.read_watched_fields`.
- Minimize entries for `compliance.write_watched_indices`.

## 7. Explore disabling private tenant

In many cases, the use of private tenants is unnecessary, yet this feature is enabled by default. As a result, every OpenSearch Dashboards user is provided with their own private tenant and a corresponding new index to save objects. This can lead to a large number of unnecessary indexes. Evaluate whether this feature is needed, and if it isn't, disable it by adding the following configuration to the `config.yml` file:

```yaml
config:
  dynamic:
    kibana:
      multitenancy_enabled: true
      private_tenant_enabled: false
```

## 8. Manage the configuration via securityadmin.sh

Use `securityadmin.sh` to manage the configuration of your clusters. `securityadmin.sh` is a command-line tool provided by OpenSearch for managing security configurations. It allows administrators to efficiently manage security settings, including roles, role mappings, and other security-related configurations within an OpenSearch cluster.

Before making changes with `securityadmin.sh`, always create a backup of the current configuration to prevent potential loss. For more detailed information, visit the [security admin configuration](https://opensearch.org/docs/latest/security/configuration/security-admin/) section in the documentation.

### Benefits of using securityadmin.sh

1. Consistency: By using `securityadmin.sh`, administrators can ensure consistency across security configurations within the cluster. This helps maintain a standardized and secure environment.
2. Automation: `securityadmin.sh` enables automation of security configuration tasks, making it easier to deploy and manage security settings across multiple nodes or clusters.
3. Version Control: Security configurations managed through `securityadmin.sh` can be version-controlled using standard version control systems like Git. This facilitates tracking changes, auditing, and reverting to previous configurations if necessary.

To prevent configuration overrides, it's important to note that changes made through the OpenSearch Dashboards UI or using the OpenSearch API provide a convenient way to modify security settings. To ensure these updates are preserved when using the `securityadmin.sh` tool, first create a backup of the current configuration. This ensures all configurations are captured before uploading the modified configuration with `securityadmin.sh`.

For more detailed information on using securityadmin.sh and managing security configurations in OpenSearch, refer to the following resources:
-  [Applying changes to configuration files]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/)
- [Modifying the YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/)

## 9. Replace all default passwords

When initializing OpenSearch with the demo configuration, many default passwords are provided in `internal_users.yml` for internal users such as `admin`, `kibanaserver`, `logstash`, and others.

You should change the passwords for these users to strong, complex passwords either at startup or as soon as possible once the cluster is running. Creating password configurations is a straightforward procedure, especially using the scripts bundled with OpenSearch like `hash.sh` or `hash.bat`, located in the `plugin/OpenSearch security/tools` directory.

The `kibanaserver` user is a crucial component that allows OpenSearch Dashboards to communicate with the OpenSearch cluster. By default, this user is preconfigured with a default password in the demo configuration. This should be replaced with a strong, unique password in the OpenSearch configuration, and the `opensearch_dashboards.yml` file should be updated to reflect this change.


## 10. Stay informed and apply updates

Regularly monitor security advisories and updates from the OpenSearch project to stay informed about potential vulnerabilities or bugs. Promptly apply updates to the Security plugin and it's dependencies to maintain a secure environment.

## Bonus tip: Diagnose permission issues efficiently

Addressing issues promptly will help ensure smooth operations. If you encounter difficulties, you can seek help through various channels:

- Log an issue on GitHub at [OpenSearch-project/security](https://github.com/opensearch-project/security/security) or [OpenSearch-project/OpenSearch](https://github.com/opensearch-project/OpenSearch/security).
- Reach out on the [OpenSearch forums](https://forum.opensearch.org/tag/cve).
