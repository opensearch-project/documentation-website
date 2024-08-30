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

OpenSearch ships with demo certificates intended for quick setup and demonstration purposes. For a production environment, it's critical to replace these with your own trusted certificates to ensure secure communication by using the following steps:

1. **Generate your own certificates:** Use tools like OpenSSL or a certificate authority (CA) to generate your own certificates. For more information about generating certificates with OpenSSL, see [Generating self-signed certificates]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/).
2. **Place the generated certificates and private key in the appropriate directory:** Generated certificates are typically placed in `<OPENSEARCH_HOME>/config/`. For more information, see [Add certificate files to opensearch.yml](https://opensearch.org/docs/latest/security/configuration/generate-certificates/#add-certificate-files-to-opensearchyml/).
3. **Set following proper file permissions:**
    - Private Key (.key files): Set the file mode to `600`. This restricts access so that only the file owner (the OpenSearch user) can read and write to the file, ensuring that the private key remains secure and inaccessible to unauthorized users.
    - Public Certificates (.crt, .pem files): Set the file mode to `644`. This allows the file owner to read and write the file, while other users can only read it.
    - Ownership: Make the files are owned by the OpenSearch user (OpenSearch or similar).

For additional guidance on file modes, see the following table:
        
        | Item        | Sample              | Numeric | Bitwise      |
        |-------------|---------------------|---------|--------------|
        | Public Key  | `~/.ssh/id_rsa.pub` | `644`   | `-rw-r--r--` |
        | Private Key | `~/.ssh/id_rsa`     | `600`   | `-rw-------` |
        | SSH Folder  | `~/.ssh`            | `700`   | `drwx------` |

### [Reconfigure `opensearch.yml` to use your certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/) 

The `opensearch.yml` file is the main configuration file for OpenSearch. Use the following steps to update this file to point to your custom certificates for secure communication.

1. Open `opensearch.yml`: Locate and open the `opensearch.yml` file in your preferred text editor.
2. Set the correct paths for your certificates and keys in the `opensearch.yml` file, as shown in the following example:

   ```
   plugins.security.ssl.transport.pemcert_filepath: /path/to/your/cert.pem
   plugins.security.ssl.transport.pemkey_filepath: /path/to/your/key.pem
   plugins.security.ssl.transport.pemtrustedcas_filepath: /path/to/your/ca.pem
   plugins.security.ssl.http.enabled: true
   plugins.security.ssl.http.pemcert_filepath: /path/to/your/cert.pem
   plugins.security.ssl.http.pemkey_filepath: /path/to/your/key.pem
   plugins.security.ssl.http.pemtrustedcas_filepath: /path/to/your/ca.pem
   ```

### [Reconfigure `config.yml` to use your authentication backend]({{site.url}}{{site.baseurl}}/security/configuration/configuration/)

The `config.yml` file allows you to configure the authentication and authorization mechanisms for OpenSearch. Update the authentication backend settings in `config/opensearch-security/config.yml` according to your requirements. For example, to use LDAP as your authentication backend, add the following settings:

  ```
    authc:
      basic_internal_auth:
        http_enabled: true
        transport_enabled: true
        order: 1
        http_authenticator:
          type: basic
          challenge: true
        authentication_backend:
          type: internal
   ```

### [Modify the configuration YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/)

Determine if any additional YAML files need modification, for example the `roles.yml`, `roles_mapping.yml`, `internal_users.yml`. Edit the files with any additional configuration needed.

### [Set a password policy]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#password-settings/)

When using the internal user database, we recommend enforcing a password policy to make sure that strong passwords are used. For information strong password policies, see [set a password policy in `opensearch.yml`]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#opensearchyml).

### [Apply changes using the `securityadmin` script]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/)

The following steps are not required for first-time user because the security index is automatically initialized from the YAML configuration files when OpenSearch starts.
{: .note}

After initial setup, if you make changes to your security configuration or if you disable automatic initialization by setting `plugins.security.allow_default_init_securityindex` to `false` (setting to prevent security index initializing from `yaml` files), you need to manually apply changes using the `securityadmin` script.

1. Find the `securityadmin` script. The script is typically found in the OpenSearch plugins directory, `plugins/opensearch-security/tools/securityadmin.sh`. If you're using OpenSearch 1.x, the `securityadmin` script was located in the `plugins/opendistro_security/tools/` directory. For additional information refer to [Applying changes to configuration files](https://opensearch.org/docs/latest/security/configuration/security-admin/), or if in need of further assistance visit [securityadmin.sh Troubleshooting](https://opensearch.org/docs/latest/troubleshoot/security-admin/).
2. Run the script with the appropriate parameters by using the following command:

   ```
    ./securityadmin[.sh|.bat] -backup my-backup-directory \
    -icl \
    -nhnv \
    -cacert ../../../config/root-ca.pem \
    -cert ../../../config/kirk.pem \
    -key ../../../config/kirk-key.pem
   ```

3. Check the OpenSearch logs and configuration to ensure that the changes have been successfully applied.

For further information about using the `securityadmin.sh` script, see [Backup restore and migrate](https://opensearch.org/docs/latest/security/configuration/security-admin#backup-restore-and-migrate/)



### [Add users, roles, role mappings, and tenants]({{site.url}}{{site.baseurl}}/security/access-control/index/)

If you don't want to use the Security plugin, you can disable it by adding the following setting to the `opensearch.yml` file:

```
plugins.security.disabled: true
```

You can then enable the plugin by removing the `plugins.security.disabled` setting.

For further information on disabling the Security plugin check the documentation, see [Disable security]({{site.url}}{{site.baseurl}}/security/configuration/disable-enable-security/).

The Security plugin has several default users, roles, action groups, permissions, and settings for OpenSearch Dashboards that use kibana in their names. We will change these names in a future release.
{: .note }

For a full list of `opensearch.yml` Security plugin settings, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/).
{: .note}
