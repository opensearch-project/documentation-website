---
layout: default
title: Best Practices
parent: Best Practices
nav_order: 11
---

# Best Practices for OpenSearch Security plugin

Setting up secure practices in OpenSearch is crucial for protecting your data. Here are our top 10 guidelines offer clear steps on keeping your system safe.

## 1. Use your own PKI (public key infrastructure) to setup SSL/TLS for OpenSearch

Although it requires a bit more effort at the beginning, it provides you with all the flexibility to set up SSL/TLS in the most secure and performant way.

### Enable SSL/TLS for node and REST layer traffic
The SSL/TLS is enabled by default for transport layer which is used by node to node communication. The SSL/TLS on REST layer is disabled by default.
The setting needed to enable encryption on the REST layer is `plugins.security.ssl.http.enabled: true`
Additional configuration options, like specifying paths to certificates, keys and certificate authority files are available at [Configuring TLS certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/)

### Replace all demo certificates with your own PKI
The certificates that get generated when initializing OpenSearch cluster with `install_demo_configuration.sh` are not suitable for production. These should be replaced as soon as possible with your own certificates.

There are many ways to create your own certificates and certificate authority. One approach can be using `openssl` described in detail in [Generating self-signed certificates]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/), alternatively there are tools available online which can simplify the certificate creation process.

## 2. Prefer client certificate authentication for API authentication

Using client certificate authentication helps to avoid dealing with (potentially weak) passwords and is more machine-to-machine friendly. Additionally, performance overhead is also low, as the authentication is done on TLS level.

Almost all client software (like curl) or client libraries support this authentication mechanism.

Details on configuring client certificate authentication can be found at [Enabling client certificate authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/client-auth/#enabling-client-certificate-authentication)


## 3. Prefer SSO using SAML or OpenID for Dashboards authentication

Implementing Single Sign-On (SSO) using protocols like Security Assertion Markup Language (SAML) or OpenID for Dashboards authentication enhances security by delegating credentials management to a dedicated system.

This reduces direct involvement with passwords in OpenSearch, streamlining authentication processes and preventing clutter in the internal user database. For more information visit the [SAML section of the OpenSearch documentation]({{site.url}}{{site.baseurl}}/security/authentication-backends/saml/).

## 4. Limit the number of roles assigned to a user

Prioritizing fewer, more intricate roles over numerous, simplistic roles for users enhances security and simplifies administration.

Additional best practices for role management may include:

1. Role granularity: Define roles based on specific job functions or access requirements to minimize unnecessary privileges.
2. Regular review: Regularly review and audit assigned roles to ensure alignment with organizational policies and access needs.

For more information about roles visit the documentation on [defining users and roles in OpenSearch]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/).

## 5. Verify DLS, FLS and field masking

If you have configured DLS (document level security) or FLS (field level security) or field masking, ensure you double check your role definitions. Especially if user is mapped to multiple roles. Testing by making a GET request to `_plugins/_security/authinfo` is highly recommended. 

Detailed examples and additional configurations are available at:
 - [Document-level security]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security/)
 - [Field-level security]({{site.url}}{{site.baseurl}}/security/access-control/field-level-security/)
 - [Field masking]({{site.url}}{{site.baseurl}}/security/access-control/field-masking/)

## 6. Strip audit logging configuration to essentials only

Extensive audit logging can degrade system performance, this is because
- each logged event adds to the processing load
- audit logs can quickly grow in size, consuming significant disk space.

So to ensure optimum use we should disable unneeded logging and be selective in logs that are used. If not strictly required by compliance regulations, consider turning off audit logging. If this feature is indeed essential for your cluster, you should configure it to what is really needed by your compliance regulations.

Whenever possible adhere to these recommendations:
- `audit.log_request_body: false`
- `audit.resolve_bulk_requests: false`
- `compliance.write_log_diffs`
- As few as possible entries for `compliance.read_watched_fields`
- As few as possible entries for `compliance.write_watched_indices`

## 7. Explore disabling private tenant

In many cases the use of private tenants is not needed, however the feature is switched on by default. As a result every OpenSearch Dashboards user is provided with their own private tenant and therefore new index to save objects. This can add up to large number of unnecessary indexes. Determine if this feature is indeed needed and it isn't, disable it with the following configuration in `config.yml` file:
```
config:
  dynamic:
    kibana:
      multitenancy_enabled: true
      private_tenant_enabled: false
```

## 8. Manage the configuration via securityadmin.sh

We recommend to use securityadmin.sh to manage configuration of your clusters, `securityadmin.sh` is a command-line tool provided by OpenSearch for managing security configurations. It allows administrators to efficiently manage security settings, including roles, role mappings, and other security-related configurations, within an OpenSearch cluster.

Before making changes with `securityadmin.sh`, always create a backup of the current configuration to prevent potential loss. For more detailed information, visit the [security admin configuration](https://opensearch.org/docs/latest/security/configuration/security-admin/) section in the documentation.

### Benefits of using securityadmin.sh

1. Consistency: By using securityadmin.sh, administrators can ensure consistency across security configurations within the cluster. This helps maintain a standardized and secure environment.
2. Automation: securityadmin.sh enables automation of security configuration tasks, making it easier to deploy and manage security settings across multiple nodes or clusters.
3. Version Control: Security configurations managed through securityadmin.sh can be version-controlled using standard version control systems like Git. This facilitates tracking changes, auditing, and reverting to previous configurations if necessary.

To prevent any configuration overrides, it is important to note that configuration changes made through the OpenSearch Dashboards UI or using the OpenSearch API provide a convenient way to modify security configurations. To ensure updates made in this way are maintained through the securityadmin.sh tool, a backup of configuration should first be made to ensure all configuration are captured prior to uploading the modified configuration using securityadmin.sh

For more detailed information on using securityadmin.sh and managing security configurations in OpenSearch, refer to the following resources:
- OpenSearch Security Documentation: [Applying changes to configuration files]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/)
- OpenSearch Security Documentation: [Modifying the YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/)

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
