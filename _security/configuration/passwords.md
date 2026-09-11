---
layout: default
title: Managing passwords
parent: Configuration
nav_order: 12
---

# Managing passwords

A cluster running the Security plugin uses several distinct passwords. Each one is set by a different person, stored in a different place, and changed through a different procedure, so the first step in any password task is identifying which password you are dealing with.

The following table lists the passwords in an OpenSearch cluster.

| Password | Who sets it | Where it is stored |
| :--- | :--- | :--- |
| [Admin password](#admin-password) | Whoever installs OpenSearch | The `.opendistro_security` index, seeded from the `OPENSEARCH_INITIAL_ADMIN_PASSWORD` environment variable |
| [Internal user passwords](#internal-user-passwords) | A cluster administrator | The `.opendistro_security` index |
| [Your own password](#your-own-password) | The user who owns the account | The `.opendistro_security` index |
| [Dashboards service account password](#dashboards-service-account-password) | Whoever configures OpenSearch Dashboards | The `opensearch.password` setting in `opensearch_dashboards.yml` |
| [Keystore and truststore passwords](#keystore-and-truststore-passwords) | Whoever configures TLS | The OpenSearch keystore |

Passwords for users authenticated by an external backend, such as LDAP or Active Directory, are managed in that backend rather than in OpenSearch. For more information, see [Authentication backends]({{site.url}}{{site.baseurl}}/security/authentication-backends/authc-index/).

The `OPENSEARCH_PASSWORD` environment variable is not an OpenSearch setting. Clients and tools, such as the [Reporting CLI]({{site.url}}{{site.baseurl}}/reporting/rep-cli-options/), read it to obtain the credentials they use when connecting to a cluster.
{: .note}

## Admin password

The `admin` user is created by the security demo configuration and has full access to the cluster. Its password is set once, through an environment variable, at the time the demo configuration is installed, and changing it afterward requires a different procedure.

There is no default admin password. A cluster will not start unless you supply one, and the `admin:admin` credentials used by earlier versions no longer work.

### Setting the initial admin password

A new cluster requires a custom admin password before it can install a security demo configuration. Set the `OPENSEARCH_INITIAL_ADMIN_PASSWORD` environment variable before the first start:

```bash
export OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>
```
{% include copy.html %}

The variable is read once, by the demo configuration installer, and becomes the password for the `admin` user. It has no effect on later starts, and it does not apply to a cluster whose `opensearch.yml` file is already configured, because the installer does not run on an existing cluster. The syntax for setting the variable differs by distribution. For more information, see [Setting up a demo configuration]({{site.url}}{{site.baseurl}}/security/configuration/demo-configuration/#installing-the-demo-configuration).

If the password does not meet the [admin password requirements]({{site.url}}{{site.baseurl}}/security/configuration/demo-configuration/#admin-password-requirements), the installation fails and the cluster does not start.

### Changing the admin password

After installation, the admin password can no longer be changed through the REST API or OpenSearch Dashboards, because the demo configuration marks the `admin` user as [reserved]({{site.url}}{{site.baseurl}}/security/access-control/api/#reserved-and-hidden-resources). Setting `OPENSEARCH_INITIAL_ADMIN_PASSWORD` again has no effect either. To reset the admin password, follow these steps:

1. Generate a password hash for the new password:

   ```bash
   ./plugins/opensearch-security/tools/hash.sh -p <new-password>
   ```
   {% include copy.html %}

1. Replace the `hash` value for the `admin` user in `<OPENSEARCH_HOME>/config/opensearch-security/internal_users.yml` with the generated hash.

1. Load the file into the `.opendistro_security` index:

   ```bash
   ./plugins/opensearch-security/tools/securityadmin.sh \
     -f ../../../config/opensearch-security/internal_users.yml \
     -t internalusers \
     -icl -nhnv \
     -cacert ../../../config/root-ca.pem \
     -cert ../../../config/kirk.pem \
     -key ../../../config/kirk-key.pem
   ```
   {% include copy.html %}

The `-f` and `-t` arguments limit the operation to internal users, which preserves roles and role mappings created through the REST API. Any internal users created through the REST API are overwritten. For more information, see [Applying changes to configuration files]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/).

## Internal user passwords

An administrator sets the password for an internal user when creating or updating that user. Use any of the following methods:

- Create the user in OpenSearch Dashboards, which prompts for the password. For more information, see [Defining users]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#defining-users).
- Send a plaintext password in the `password` field of a REST API request. The Security plugin hashes the password before storing it. For more information, see [Create or Update User API]({{site.url}}{{site.baseurl}}/security/api/users/create-user/).
- Add a `bcrypt` hash generated by `hash.sh` to `internal_users.yml` and run `securityadmin.sh` to load the file. Reserve this method for the initial setup of a cluster. For more information, see [internal_users.yml]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#internal_usersyml).

Passwords set through OpenSearch Dashboards or the REST API are validated against the [password settings]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#password-settings) in `opensearch.yml`. Hashes written directly to `internal_users.yml` bypass that validation.

## Your own password

Any authenticated user can change their own password without administrator involvement by supplying the current password along with the new one:

```json
PUT /_plugins/_security/api/account
{
  "current_password": "<old-password>",
  "password": "<new-password>"
}
```
{% include copy-curl.html security=true %}

For more information, see [Change Password API]({{site.url}}{{site.baseurl}}/security/api/account/change-password/).

## Dashboards service account password

OpenSearch Dashboards authenticates to OpenSearch as an internal user, configured through the `opensearch.username` and `opensearch.password` settings in `opensearch_dashboards.yml`. The demo configuration uses the `kibanaserver` user for this purpose. Changing this password takes two steps: update the `kibanaserver` user's password in OpenSearch, then set the matching value in `opensearch_dashboards.yml` and restart OpenSearch Dashboards.

This is a service account rather than a login account. End users sign in to OpenSearch Dashboards with their own credentials. For more information, see [Configuring sign-in options]({{site.url}}{{site.baseurl}}/security/configuration/multi-auth/).

## Keystore and truststore passwords

Keystore and truststore passwords protect TLS certificate stores and are unrelated to user authentication. Store them in the OpenSearch keystore rather than in `opensearch.yml`. For more information, see [OpenSearch keystore]({{site.url}}{{site.baseurl}}/security/configuration/opensearch-keystore/) and [Configuring TLS certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/).

## Demo configuration passwords

Along with the `admin` user, the demo configuration creates the `kibanaserver`, `kibanaro`, `logstash`, `readall`, and `snapshotrestore` users. Only the `admin` password comes from `OPENSEARCH_INITIAL_ADMIN_PASSWORD`. The others keep the default passwords published in `internal_users.yml`, so their credentials are public knowledge.

Change the password of every demo user you keep, and delete the ones you do not need, before moving a cluster into production. The demo certificates are equally unsuitable for production use. For more information, see [Best practices]({{site.url}}{{site.baseurl}}/security/configuration/best-practices/).
{: .warning}

## Password requirements

Two independent sets of rules apply, depending on how the password is set. Only the second set is a configurable password policy:

- The initial admin password is checked against rules built into the demo configuration installer, which cannot be changed. For more information, see [Admin password requirements]({{site.url}}{{site.baseurl}}/security/configuration/demo-configuration/#admin-password-requirements).
- Passwords set through OpenSearch Dashboards or the REST API are checked against `plugins.security.restapi.password_validation_regex`, `plugins.security.restapi.password_min_length`, and `plugins.security.restapi.password_score_based_validation_strength`. For more information, see [Password settings]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#password-settings).

Both sets use the [`zxcvbn`](https://github.com/dropbox/zxcvbn) strength estimator, which scores a password on entropy. Common words, dates, sequences such as `1234` or `qwerty`, and predictable substitutions such as `3` for `E` lower the score, while length and unpredictability raise it. A password that satisfies every character rule can still be rejected as too weak. To check a password's score, use the [`zxcvbn` demo](https://lowe.github.io/tryzxcvbn).
