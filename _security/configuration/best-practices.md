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

- Enable SSL/TLS for node and REST layer traffic
- Replace all demo certificates with your own PKI

[Additional information being added]

## 2. Prefer Client certificate authentication for API authentication

This helps to avoid dealing with (potentially weak) passwords and is more machine-to-machine friendly. Additionally performance overhead is also low because authentication is done on TLS level whereas a TLS connection needs to be negotiated anyhow.

Almost all client software (like curl) or client libraries support this authentication mechanism.


## 3. Prefer SSO via SAML or OpenID for Dashboards authentication

Implementing Single Sign-On (SSO) via protocols like Security Assertion Markup Language (SAML) or OpenID for Dashboards authentication enhances security by delegating credentials management to a dedicated system.

This reduces direct involvement with passwords in OpenSearch, streamlining authentication processes and preventing clutter in the internal user database. For more information visit the [SAML section of the OpenSearch documentation](https://opensearch.org/docs/latest/security/authentication-backends/saml/).

## 4. Limit the number of roles assigned to a user

Prioritizing fewer, more intricate roles over numerous, simplistic roles for users enhances security and simplifies administration.

Additional best practices for role management may include:

1. Role granularity: Define roles based on specific job functions or access requirements to minimize unnecessary privileges.
2. Regular review: Regularly review and audit assigned roles to ensure alignment with organizational policies and access needs.

For more information on roles visit the documentation on [defining users and roles in OpenSearch](https://opensearch.org/docs/latest/security/access-control/users-roles/).

## 5. Verify DLS, FLS and field masking

If you have configured DLS (document level security) or FLS (field level security) or field masking double check your role definitions.

[Additional information being added]

## 6. Strip audit logging configuration to essentials only

If not strictly required by compliance regulations, consider turning off audit logging because it incurs a performance penalty, likely consumes a significant amount of disk space, and complicates a secure setup.

If it is not feasible to turn it off you need to thoroughly configure it to what is really needed by your compliance regulations.

Whenever possible adhere to this recommendations:
- `audit.log_request_body: false`
- `audit.resolve_bulk_requests: false`
- `compliance.write_log_diffs`
- As few as possible entries for `compliance.read_watched_fields`
- As few as possible entries for `compliance.write_watched_indices`

## 7. Explore disabling private tenant

[Additional information being added]

## 8. Manage the configuration via securityadmin.sh

We recommend to use securityadmin.sh to manage configuration of your clusters, `securityadmin.sh` is a command-line tool provided by OpenSearch for managing security configurations. It allows administrators to efficiently manage security settings, including roles, role mappings, and other security-related configurations, within an OpenSearch cluster.

### Benefits of Using securityadmin.sh:
1. Consistency: By using securityadmin.sh, administrators can ensure consistency across security configurations within the cluster. This helps maintain a standardized and secure environment.
2. Automation: securityadmin.sh enables automation of security configuration tasks, making it easier to deploy and manage security settings across multiple nodes or clusters.
3. Version Control: Security configurations managed through securityadmin.sh can be version-controlled using standard version control systems like Git. This facilitates tracking changes, auditing, and reverting to previous configurations if necessary.

To prevent any configuration overides, it is important to note that configuration changes made through the OpenSearch Dashboards UI or via the OpenSearch API provide a convenient way to modify security configurations. To ensure updates made in this way are maintained via the securityadmin.sh tool, a backup of configuration should first be made to ensure all configuration are captured prior to uploading the modified configuration using securityadmin.sh

For more detailed information on using securityadmin.sh and managing security configurations in OpenSearch, refer to the following resources:
- OpenSearch Security Documentation: [Applying changes to configuration files](https://opensearch.org/docs/latest/security/configuration/security-admin/)
- OpenSearch Security Documentation: [Modifying the YAML files](https://opensearch.org/docs/latest/security/configuration/yaml/)

## 9. Replace all default passwords

[Additional information being added]

## 10. Stay informed and apply updates

Regularly monitor security advisories and updates from the OpenSearch project to stay informed about potential vulnerabilities or bugs. Promptly apply updates to the security plugin and its dependencies to maintain a secure environment.

## Bonus tip: Diagnose permission issues efficiently
