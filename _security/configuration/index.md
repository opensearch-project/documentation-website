---
layout: default
title: Configuration
nav_order: 2
has_children: true
has_toc: false
redirect_from:
  - /security-plugin/configuration/
  - /security-plugin/configuration/index/
---

# Security configuration

The plugin includes demo certificates so that you can get up and running quickly. To use OpenSearch in a production environment, you must configure it manually:

1. [Replace the demo certificates]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#configuring-basic-security-settings).
- OpenSearch ships with demo certificates intended for quick setup and testing purposes. For a production environment, it's critical to replace these with your own trusted certificates to ensure secure communication.

**Steps**:
- **Generate your own certificates:** Use tools like OpenSSL or a certificate authority (CA) to generate your own certificates. For further guidance on generating certificates with OpenSSL, visit: [Generating self-signed certificates](https://opensearch.org/docs/latest/security/configuration/generate-certificates/).
- **Place the generated certificates and private key in the appropriate directory:** Typically they are placed in `<OPENSEARCH_HOME>/config/`, for more information see: [Add certificate files to opensearch.yml](https://opensearch.org/docs/latest/security/configuration/generate-certificates/#add-certificate-files-to-opensearchyml/).
- **Set proper file permissions:**
  - **Recommended File Mode:** Set both the public certificates (.crt, .pem) and private keys (.key) to 644 (readable by everyone, writable only by the owner). This ensures that the OpenSearch service can read the files while preventing unauthorized modifications.
  - **Ownership**: Ensure the files are owned by the OpenSearch service user (opensearch or similar).

2. [Reconfigure `opensearch.yml` to use your certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/). 
- The `opensearch.yml` file is the main configuration file for OpenSearch. Update this file to point to your custom certificates for secure communication.
- Steps:
  - Open `opensearch.yml`: Locate and open the `opensearch.yml` file in your preferred text editor.
  - Update paths to certificates and keys: Set the correct paths for your certificates and keys in the `opensearch.yml` file. For example:
```json
plugins.security.ssl.transport.pemcert_filepath: /path/to/your/cert.pem
plugins.security.ssl.transport.pemkey_filepath: /path/to/your/key.pem
plugins.security.ssl.transport.pemtrustedcas_filepath: /path/to/your/ca.pem
plugins.security.ssl.http.enabled: true
plugins.security.ssl.http.pemcert_filepath: /path/to/your/cert.pem
plugins.security.ssl.http.pemkey_filepath: /path/to/your/key.pem
plugins.security.ssl.http.pemtrustedcas_filepath: /path/to/your/ca.pem
```
3. [Reconfigure `config.yml` to use your authentication backend]({{site.url}}{{site.baseurl}}/security/configuration/configuration/).
- The `config.yml` file allows you to configure the authentication and authorization mechanisms for OpenSearch.
- Update the authentication backend settings in `config/opensearch-security/config.yml` according to your requirements. For example, to use LDAP:
    ```
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
    ```
  
4. [Modify the configuration YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/).
- Determine which additional YAML files need modification, for example the `roles.yml`, `roles_mapping.yml`, `internal_users.yml`.
- Edit the files with any additional configuration needed.

5. Set a password policy
- When using the internal user database, it is advisable to enforce a password policy to ensure strong passwords, see: [set a password policy in `opensearch.yml`]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#opensearchyml).
-  Open `opensearch.yml` and add or update the password policy settings.

6. [Apply changes using the `securityadmin` script]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/)

    **Note:** The steps below are not required for first-time use because the security index is automatically initialized from the YAML configuration files when OpenSearch starts.

- After initial setup, if you make changes to your security configuration or if you disable automatic initialization by setting `plugins.security.allow_default_init_securityindex` to `false` (setting to prevent security index initializing from yaml files), you need to manually apply changes using the `securityadmin` script.
- The `securityadmin` script is typically found in the OpenSearch plugins directory: `plugins/opensearch-security/tools/securityadmin.sh`. 
  - **Note for 1.x users:** the `securityadmin` script was located in the `plugins/opendistro_security/tools/` directory. 
- Run the script with the appropriate parameters to apply the changes:
    ```
    ./securityadmin.sh -cd ../securityconfig/ -icl -key /path/to/admin-key.pem -cert /path/to/admin-cert.pem -cacert /path/to/root-ca.pem -nhnv
    ```

- Check the OpenSearch logs and configuration to ensure that the changes have been successfully applied.
- For further information see the documentation: [Backup restore and migrate](https://opensearch.org/docs/latest/security/configuration/security-admin#backup-restore-and-migrate/)

7. Start OpenSearch.


8. [Add users, roles, role mappings, and tenants]({{site.url}}{{site.baseurl}}/security/access-control/index/).

If you don't want to use the Security plugin, you can disable it by editing the `opensearch.yml` file:
```
plugins.security.disabled: true
```
You can then enable the plugin by removing the `plugins.security.disabled` setting.

For further information on disabling the security plugin check the documentation: [Disable security]({{site.url}}{{site.baseurl}}/security/configuration/disable-enable-security/).

The Security plugin has several default users, roles, action groups, permissions, and settings for OpenSearch Dashboards that use kibana in their names. We will change these names in a future release.
{: .note }

For a full list of `opensearch.yml` Security plugin settings, Security plugin settings, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/).
{: .note}
