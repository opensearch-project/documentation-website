---
layout: default
title: OpenSearch FIPS configuration
parent: Configuration
nav_order: 55
---

# OpenSearch FIPS configuration

The [Federal Information Processing Standard (FIPS) 140-3](https://csrc.nist.gov/pubs/fips/140-3/final) is a U.S. government standard that defines security requirements for cryptographic modules. When running OpenSearch in a FIPS-compliant environment, you must configure the system to use FIPS-validated cryptographic providers.

To achieve FIPS compliance, OpenSearch requires:

- FIPS-validated cryptographic providers for all cryptographic operations (Bouncy Castle FIPS is included in OpenSearch).
- A JVM configured to use these FIPS-validated providers.
- A JVM using a Java version for which [BC-FJA](https://www.bouncycastle.org/download/bouncy-castle-java-fips/) is certified (for example, Java 11, 17, or 21 for OpenSearch v3.2.0+ with BC-FJA v2.1.0).
- FIPS-compliant keystores and truststores in BCFKS or PKCS11 format.
- Strong passwords meeting FIPS minimum requirements (112 bits or approximately 14 characters).

## FIPS demo installer

By default, the JVM uses the `cacerts` truststore (typically in PKCS12 format) for SSL/TLS connections. This truststore contains trusted certificate authority (CA) certificates. However, the standard PKCS12 format is not FIPS compliant.

OpenSearch includes a FIPS demo installer CLI tool that simplifies the truststore configuration process. The tool provides an automated way to configure a FIPS-compliant truststore by converting the JVM default truststore to BCFKS format. The project source is available in `distribution/tools/fips-demo-installer-cli`.

This tool is designed for demo and development purposes. Before deploying to production, carefully review all generated configurations and replace demo settings with production-appropriate values.
{: .warning}

### Prerequisites

Before running the FIPS demo installer, ensure that the following prerequisites are met:

- OpenSearch is installed and the installation directory is accessible.
- You have write permissions to the OpenSearch configuration directory.
- The `jvm.options` file exists in the configuration directory.

### Available commands

The FIPS demo installer provides the following commands.

| Command | Description |
|---------|-------------|
| `generated` | Generates a new BCFKS truststore from the JVM default truststore. |
| `system` | Uses the existing system PKCS11 truststore. |
| `show-providers` | Shows available security providers and exits (does not change the configuration). |

### Configuration options

The FIPS demo installer supports the following command-line options.

| Option | Description |
|--------|-------------|
| `-f`, `--force` | Force the configuration even if FIPS settings already exist in `jvm.options`. |
| `-n`, `--non-interactive` | Run in non-interactive mode (use defaults, no prompts). |
| `-p`, `--password` | Specify a password for the BCFKS truststore (overrides the auto-generated password in non-interactive mode). |
| `--pkcs11-provider` | Specify a PKCS11 provider name directly (used with the `system` command). |
| `--help` | Display help information for the supported commands. |

### Non-interactive mode

To run the installer in non-interactive mode for automated deployments, use either the `-n` or `--non-interactive` flag:

```bash
./bin/opensearch-fips-demo-installer -n
```
{% include copy.html %}

The non-interactive mode runs without prompts and automatically performs the following actions:

- Defaults to generating a new BCFKS truststore.
- Auto-confirms all prompts.
- Generates a secure 24-character password (or uses the one specified using `-p`).
- Selects the first available PKCS11 provider when using the `system` command.

Non-interactive mode is ideal for automated provisioning scripts and configuration management tools.
{: .note}

### Examples

The following are some common command examples for the FIPS demo installer.

On Windows, use `opensearch-fips-demo-installer.bat` instead of the bash script.
{: .note}

Interactive mode (prompts for all choices):
```bash
./bin/opensearch-fips-demo-installer
```
{% include copy.html %}

Non-interactive mode with auto-generated password---overrides the existing FIPS configuration:
```bash
./bin/opensearch-fips-demo-installer -n -f
```
{% include copy.html %}

Generate a BCFKS truststore with a custom password:
```bash
./bin/opensearch-fips-demo-installer generated -p "MySecurePassword123!"
```
{% include copy.html %}

Use the system PKCS11 truststore with a specific provider:
```bash
./bin/opensearch-fips-demo-installer system --pkcs11-provider YourPKCS11-Provider
```
{% include copy.html %}

### Configuration output

After running the FIPS demo installer, the following properties are added to your `jvm.options` file:

```bash
################################################################
## Start OpenSearch FIPS Demo Configuration
## WARNING: revise all the lines below before you go into production
################################################################

-Djavax.net.ssl.trustStore=/path/to/opensearch/config/opensearch-fips-truststore.bcfks
-Djavax.net.ssl.trustStorePassword=<your-password>
-Djavax.net.ssl.trustStoreType=BCFKS
-Djavax.net.ssl.trustStoreProvider=BCFIPS
################################################################
```

These properties configure the JVM to use the FIPS-compliant truststore for all SSL/TLS connections if no other truststore is defined.

## Security plugin in FIPS mode

When `OPENSEARCH_FIPS_MODE` is set to `true`, the Security plugin enforces the following rules in addition to the requirements listed above.

### Password hashing and password length

- PBKDF2 is the only allowed password hashing algorithm. Set `plugins.security.password.hashing.algorithm: pbkdf2` in `opensearch.yml`; otherwise, OpenSearch does not start. Internal user hashes created with BCrypt or Argon2 cannot be verified in FIPS mode. Before you apply the security configuration, regenerate them with the following command:

  ```bash
  ./plugins/opensearch-security/tools/hash.sh -a pbkdf2
  ```
  {% include copy.html %}

- Passwords must contain at least 14 characters because Bouncy Castle FIPS rejects PBKDF2 passwords with less than 112 bits. If `plugins.security.restapi.password_min_length` is not set, it is raised to `14`. If it is set to a lower value, OpenSearch does not start.
- OpenSearch does not start if `plugins.security.password.hashing.pbkdf2.length` is lower than `112` or `plugins.security.password.hashing.pbkdf2.iterations` is lower than `1000`. The defaults are `256` and `600000`.

### Demo configuration

When `OPENSEARCH_FIPS_MODE` is set to `true`, `install_demo_configuration.sh` performs the following additional actions:

- Replaces the shipped `internal_users.yml`, which contains BCrypt hashes, with a file containing PBKDF2 hashes. A modified `internal_users.yml` is kept.
- Adds `plugins.security.password.hashing.algorithm: pbkdf2` to `opensearch.yml`.
- Requires an `OPENSEARCH_INITIAL_ADMIN_PASSWORD` of at least 14 characters.

The shipped demo passwords are shorter than 14 characters, so the demo users have different passwords in FIPS mode.

| User | Password without FIPS mode | Password in FIPS mode |
|:---|:---|:---|
| `admin` | The value of `OPENSEARCH_INITIAL_ADMIN_PASSWORD` | The value of `OPENSEARCH_INITIAL_ADMIN_PASSWORD` (at least 14 characters) |
| `kibanaserver` | `kibanaserver` | `kibanaserver@OpenSearch` |
| `kibanaro`, `logstash`, `readall`, `snapshotrestore`, `anomalyadmin` | The shipped demo passwords | `<username>@OpenSearch` |

OpenSearch Dashboards connects to OpenSearch as `kibanaserver`. In FIPS mode, set `opensearch.password: kibanaserver@OpenSearch` in `opensearch_dashboards.yml`.
{: .note}

### TLS

- Only `BCFKS` and `PKCS11` keystores and truststores are supported. JKS, JCEKS, and PKCS12 stores are rejected.
- TLS 1.1 is not offered. The default protocols are TLS 1.3 and TLS 1.2, including for LDAP and the external OpenSearch audit log sink.
- Encrypted PEM private keys must use PBES2 (for example, AES with PBKDF2). Keys encrypted with a PBES1 scheme, such as `PBEWithMD5AndDES` or `PBEWithSHA1AndDESede`, cannot be read. PBES2 keys created by older OpenSSL versions, which use HMAC-SHA1 and 3DES or AES, can be read. The key password must contain at least 14 characters. To re-encrypt a key, run the following command:

  ```bash
  openssl pkcs8 -topk8 -v2 aes-256-cbc -v2prf hmacWithSHA256 -in <old-key> -out <new-key>
  ```
  {% include copy.html %}

- If you validate certificate revocation using CRL distribution points (`plugins.security.ssl.http.crl.validate: true` without `plugins.security.ssl.http.crl.disable_crldp`), add `org.bouncycastle.x509.enableCRLDP=true` to `config/fips_java.security`. The JDK property `com.sun.security.enableCRLDP`, which the Security plugin sets, has no effect on Bouncy Castle FIPS.

### Known limitations

- **SAML**: If the service provider signs authentication requests and the identity provider encrypts assertions, only the first login succeeds. The SAML library uses one RSA key for signing and decryption, and Bouncy Castle FIPS does not allow a key that has been used for decryption to sign again.
- **Kerberos**: Kerberos uses the JDK's SunJGSS provider, which `config/fips_java.security` keeps. Use only AES encryption types in `krb5.conf` and in the keytab. RC4 and DES encryption types are not approved.
- **PKCS#11 keys**: TLS with a private key on a PKCS#11 token (`keystore_type: PKCS11`) uses the JDK's SunJSSE provider, which `config/fips_java.security` keeps, because Bouncy Castle JSSE cannot sign with a key that stays on the token. In FIPS mode these connections use TLS 1.3 only. OpenSearch does not start if `plugins.security.ssl.http.enabled_protocols` or `plugins.security.ssl.transport.enabled_protocols` does not include `TLSv1.3`, and protocols passed to `securityadmin.sh` with `-ep` must include it as well.

## Troubleshooting FIPS

This section covers common issues encountered when running OpenSearch in FIPS mode.

### Truststore type not specified

The following error indicates that the FIPS truststore configuration is incomplete or missing from `jvm.options`:

```
Trust store type must be specified using the '-Djavax.net.ssl.trustStoreType' JVM option. Accepted values are PKCS11 and BCFKS.
```

To resolve this issue:

- Verify that you have run the FIPS demo installer successfully.
- Check that `jvm.options` contains the FIPS truststore configuration block.

### Truststore file not found

If you see an error indicating that the truststore file cannot be found, verify that:

- The path in `jvm.options` is correct and absolute.
- The truststore file exists at the specified location.
- OpenSearch has read permissions for the truststore file.

### Certificate conversion failures

Some certificates in the JVM default truststore may not be compatible with the BCFKS format. The installer reports the number of certificates that were successfully converted. Review the output to ensure that critical certificates were converted successfully.

### Keystore password is too weak for FIPS mode

When the [OpenSearch keystore]({{site.url}}{{site.baseurl}}/security/configuration/opensearch-keystore) `$OPENSEARCH_HOME/config/opensearch.keystore` contains a password that does not meet FIPS requirements, OpenSearch fails to start with the following error:

```
org.bouncycastle.crypto.fips.FipsUnapprovedOperationError: password must be at least 112 bits
```

In FIPS mode, Bouncy Castle enforces a minimum password strength of 112 bits, which is approximately 14 characters.

Because FIPS mode is already active, the `opensearch-keystore passwd` command does not accept the existing weak password. Alternatively, you can recreate the keystore as follows:

1. List existing secrets for backup (if needed):
```bash
./bin/opensearch-keystore list
```
{% include copy.html %}

2. Create a new keystore with a FIPS-compliant password (at least 14 characters):
```bash
./bin/opensearch-keystore create --password
```
{% include copy.html %}

3. Re-add any secrets that were stored in the old keystore (if needed):
```bash
./bin/opensearch-keystore add <setting-name>
```
{% include copy.html %}

Ensure that your new password is at least 14 characters long and includes a mix of uppercase characters, lowercase characters, numbers, and special characters. For security best practices, consider using a password manager to generate and store complex passwords.
{: .note}

## Next steps

After configuring FIPS mode for OpenSearch:

- Review the [security configuration]({{site.url}}{{site.baseurl}}/security/configuration/index/) guide for additional security settings.
- Configure [TLS certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/) for node-to-node and client-to-node encryption.
- Set up [authentication and authorization]({{site.url}}{{site.baseurl}}/security/configuration/configuration/) for your cluster.
- Configure [PBKDF2 password hashing]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/#expert-level-settings) for internal user passwords to ensure FIPS compliance.
- Set up [field masking with FIPS-approved hash algorithms]({{site.url}}{{site.baseurl}}/security/access-control/field-masking/) instead of the default BLAKE2b.
- Review [best practices for OpenSearch security]({{site.url}}{{site.baseurl}}/security/configuration/best-practices/) for comprehensive security guidance.
