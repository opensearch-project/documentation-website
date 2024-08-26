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

### [Replace the demo certificates]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#configuring-basic-security-settings).

1. OpenSearch ships with demo certificates intended for quick setup and demonstration purposes. For a production environment, it's critical to replace these with your own trusted certificates to ensure secure communication.
2. **Generate your own certificates:** Use tools like OpenSSL or a certificate authority (CA) to generate your own certificates. For further guidance on generating certificates with OpenSSL, visit: [Generating self-signed certificates](https://opensearch.org/docs/latest/security/configuration/generate-certificates/).
 3. **Place the generated certificates and private key in the appropriate directory:** Typically they are placed in `<OPENSEARCH_HOME>/config/`, for more information see: [Add certificate files to opensearch.yml](https://opensearch.org/docs/latest/security/configuration/generate-certificates/#add-certificate-files-to-opensearchyml/).
 4. **Set proper file permissions:**
    - **Recommended File Mode:** Set both the public certificates (.crt, .pem) and private keys (.key) to 644 (readable by everyone, writable only by the owner). This ensures that the OpenSearch service can read the files while preventing unauthorized modifications.
    - **Ownership**: Ensure the files are owned by the OpenSearch service user (OpenSearch or similar).


### [Reconfigure `opensearch.yml` to use your certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/). 

1.  The `opensearch.yml` file is the main configuration file for OpenSearch. Update this file to point to your custom certificates for secure communication.
2. Open `opensearch.yml`: Locate and open the `opensearch.yml` file in your preferred text editor.
3. Update paths to certificates and keys: Set the correct paths for your certificates and keys in the `opensearch.yml` file. For example:
 ```
 plugins.security.ssl.transport.pemcert_filepath: /path/to/your/cert.pem
 plugins.security.ssl.transport.pemkey_filepath: /path/to/your/key.pem
 plugins.security.ssl.transport.pemtrustedcas_filepath: /path/to/your/ca.pem
 plugins.security.ssl.http.enabled: true
 plugins.security.ssl.http.pemcert_filepath: /path/to/your/cert.pem
 plugins.security.ssl.http.pemkey_filepath: /path/to/your/key.pem
 plugins.security.ssl.http.pemtrustedcas_filepath: /path/to/your/ca.pem
 ```

### [Reconfigure `config.yml` to use your authentication backend]({{site.url}}{{site.baseurl}}/security/configuration/configuration/).
1.  The `config.yml` file allows you to configure the authentication and authorization mechanisms for OpenSearch.
2. Update the authentication backend settings in `config/opensearch-security/config.yml` according to your requirements. For example, to use LDAP:
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

### [Modify the configuration YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/).
1. Determine which additional YAML files need modification, for example the `roles.yml`, `roles_mapping.yml`, `internal_users.yml`.
   - Edit the files with any additional configuration needed.

### [Set a password policy]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#password-settings/)

1. When using the internal user database, it is advisable to enforce a password policy to ensure strong passwords, see: [set a password policy in `opensearch.yml`]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#opensearchyml).
2. Open `opensearch.yml` and add or update the password policy settings.

### [Apply changes using the `securityadmin` script]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/)

- **Note:** The following steps are not required for first-time use because the security index is automatically initialized from the YAML configuration files when OpenSearch starts.
1. After initial setup, if you make changes to your security configuration or if you disable automatic initialization by setting `plugins.security.allow_default_init_securityindex` to `false` (setting to prevent security index initializing from `yaml` files), you need to manually apply changes using the `securityadmin` script.
2. The `securityadmin` script is typically found in the OpenSearch plugins directory: `plugins/opensearch-security/tools/securityadmin.sh`. 
 - **Note for 1.x users:** the `securityadmin` script was located in the `plugins/opendistro_security/tools/` directory. 
3. Run the script with the appropriate parameters to apply the changes:
   ```
   ./securityadmin.sh -cd ../securityconfig/ -icl -key /path/to/admin-key.pem -cert /path/to/admin-cert.pem -cacert /path/to/root-ca.pem -nhnv
   ```

4. Check the OpenSearch logs and configuration to ensure that the changes have been successfully applied.
5. For further information see the documentation: [Backup restore and migrate](https://opensearch.org/docs/latest/security/configuration/security-admin#backup-restore-and-migrate/)


### Start OpenSearch.

### [Add users, roles, role mappings, and tenants]({{site.url}}{{site.baseurl}}/security/access-control/index/).

If you don't want to use the Security plugin, you can disable it by editing the `opensearch.yml` file:
```
plugins.security.disabled: true
```
You can then enable the plugin by removing the `plugins.security.disabled` setting.

For further information on disabling the Security plugin check the documentation: [Disable security]({{site.url}}{{site.baseurl}}/security/configuration/disable-enable-security/).

The Security plugin has several default users, roles, action groups, permissions, and settings for OpenSearch Dashboards that use kibana in their names. We will change these names in a future release.
{: .note }

For a full list of `opensearch.yml` Security plugin settings, Security plugin settings, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/).
{: .note}
