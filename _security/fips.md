---
layout: default
title: Getting started with OpenSearch FIPS
nav_order: 70
---

# Getting started with OpenSearch FIPS

The [Federal Information Processing Standard (FIPS) 140-3](https://csrc.nist.gov/pubs/fips/140-3/final) is a U.S. government standard that defines security requirements for cryptographic modules. When running OpenSearch in a FIPS-compliant environment, you need to configure the system to use FIPS-validated cryptographic providers.

To achieve FIPS compliance, OpenSearch requires:

- FIPS-validated cryptographic providers for all cryptographic operations (Bouncy Castle FIPS is included with OpenSearch)
- JVM configured to use these FIPS-validated providers
- FIPS-compliant key stores and trust stores in BCFKS or PKCS11 format
- Strong passwords meeting FIPS minimum requirements (112 bits / approximately 14 characters)

## FIPS demo installer

By default, the JVM uses the `cacerts` trust store (typically in PKCS12 format) for SSL/TLS connections, which contains trusted certificate authority (CA) certificates. However, the standard PKCS12 format is not FIPS-compliant.

OpenSearch includes a FIPS demo installer CLI tool that simplifies the trust store configuration process. The tool provides an automated way to set up a FIPS-compliant trust store by converting the JVM's default trust store to BCFKS format. The project source is available in distribution/tools/fips-demo-installer-cli.

This tool is designed for demo and development purposes. Before deploying to production, carefully review all generated configuration and replace demo settings with production-appropriate values.
{: .warning}

### Prerequisites

Before running the FIPS demo installer, ensure the following:

- OpenSearch is installed and the installation directory is accessible.
- You have write permissions to the OpenSearch configuration directory.
- The `jvm.options` file exists in the configuration directory.

### Available commands

The FIPS demo installer provides the following commands:

| Command | Description |
|---------|-------------|
| `generated` | Generate a new BCFKS trust store from the JVM default trust store |
| `system` | Use existing system PKCS11 trust store |
| `show-providers` | Show available security providers and exit (no configuration changes) |

### Configuration options

The FIPS demo installer supports the following command-line options:

| Option | Description |
|--------|-------------|
| `-f`, `--force` | Force configuration even if FIPS settings already exist in jvm.options |
| `-n`, `--non-interactive` | Run in non-interactive mode (use defaults, no prompts) |
| `-p`, `--password` | Password for the BCFKS trust store (overrides auto-generated password in non-interactive mode) |
| `--pkcs11-provider` | Specify a PKCS11 provider name directly (used with `system` command) |
| `--help` | Display help information for commands |

### Non-interactive mode

To run the installer in non-interactive mode for automated deployments, use the `-n` or `--non-interactive` flag:

```
./bin/opensearch-fips-demo-installer -n
```
{% include copy.html %}

The non-interactive mode runs without prompts and automatically performs the following:

- Defaults to generating a new BCFKS trust store
- Auto-confirms all prompts
- Generates a secure 24-character password (or uses one specified with `-p`)
- Selects the first available PKCS11 provider when using the `system` command

Non-interactive mode is ideal for automated provisioning scripts and configuration management tools.
{: .note}

### Examples

Here are some common command variations for the FIPS demo installer:

On Windows, use `opensearch-fips-demo-installer.bat` instead of the shell script.
{: .note}

```bash
# Interactive mode (prompts for all choices)
./bin/opensearch-fips-demo-installer

# Non-interactive mode with auto-generated password - overrides existing FIPS configuration
./bin/opensearch-fips-demo-installer -n -f

# Generate BCFKS trust store with custom password
./bin/opensearch-fips-demo-installer generated -p "MySecurePassword123!"

# Use system PKCS11 trust store with specific provider
./bin/opensearch-fips-demo-installer system --pkcs11-provider YourPKCS11-Provider
```
{% include copy.html %}

### Configuration output

After running the FIPS demo installer, the following properties are added to your `jvm.options` file:

```
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

These properties configure the JVM to use the FIPS-compliant trust store for all SSL/TLS connections if no other trust store is defined.

## Troubleshooting FIPS

This section covers common issues when running OpenSearch in FIPS mode.

### Trust store type not specified

```
Trust store type must be specified using the '-Djavax.net.ssl.trustStoreType' JVM option. Accepted values are PKCS11 and BCFKS.
```

This error indicates that the FIPS trust store configuration is incomplete or missing from `jvm.options`. To resolve this issue:

- Verify that you have run the FIPS demo installer successfully.
- Check that `jvm.options` contains the FIPS trust store configuration block.

### Trust store file not found

If you see an error indicating the trust store file cannot be found, verify that:

- The path in `jvm.options` is correct and absolute.
- The trust store file exists at the specified location.
- OpenSearch has read permissions for the trust store file.

### Certificate conversion failures

Some certificates in the JVM default trust store may not be compatible with BCFKS format. The installer will report how many certificates were successfully converted. Review the output to ensure critical certificates were converted successfully.

### Keystore password too weak for FIPS mode

If OpenSearch fails to start with the error:

```
org.bouncycastle.crypto.fips.FipsUnapprovedOperationError: password must be at least 112 bits
```

This error occurs when the [OpenSearch keystore]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/#password-protection) `$OPENSEARCH_HOME/config/opensearch.keystore` has a password that does not meet FIPS requirements. In FIPS mode, Bouncy Castle enforces a minimum password strength of 112 bits, which is approximately 14 characters.

Because FIPS mode is already active, the `opensearch-keystore passwd` command will not accept the existing weak password. The workaround is to recreate the keystore:

```bash
# List existing secrets for backup (if needed)
./bin/opensearch-keystore list

# Create a new keystore with a FIPS-compliant password (at least 14 characters)
./bin/opensearch-keystore create --password

# Re-add any secrets that were stored in the old keystore (if needed)
./bin/opensearch-keystore add <setting-name>
```
{% include copy.html %}

Ensure your new password is at least 14 characters long and includes a mix of uppercase, lowercase, numbers, and special characters. For security best practices, consider using a password manager to generate and store complex passwords.
{: .note}

## Next steps

After configuring FIPS mode for OpenSearch:

- Review the [Security configuration]({{site.url}}{{site.baseurl}}/security/configuration/index/) guide for additional security settings.
- Configure [TLS certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/) for node-to-node and client-to-node encryption.
- Set up [authentication and authorization]({{site.url}}{{site.baseurl}}/security/configuration/configuration/) for your cluster.
- Review [Best practices for OpenSearch security]({{site.url}}{{site.baseurl}}/security/configuration/best-practices/) for comprehensive security guidance.
