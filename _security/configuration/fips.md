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
- A JVM using a Java version for which [BC-FJA](https://www.bouncycastle.org/download/bouncy-castle-java-fips/) is certified. The validated module versions and the tested Java versions are listed on the module's [CMVP certificate](https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/4943). Check that the `bc-fips` JAR in the `lib` directory is one of the listed versions.
- FIPS-compliant keystores and truststores in BCFKS or PKCS11 format.
- Strong passwords meeting FIPS minimum requirements (112 bits or approximately 14 characters).

## Enabling FIPS mode

To run OpenSearch in FIPS mode, set the `OPENSEARCH_FIPS_MODE` environment variable to `true` before starting OpenSearch or any of its command line tools:

```bash
export OPENSEARCH_FIPS_MODE=true
./bin/opensearch
```
{% include copy.html %}

In FIPS mode, OpenSearch uses only the security providers listed in `config/fips_java.security` and requires Bouncy Castle FIPS to run in approved-only mode. If the Bouncy Castle FIPS JAR files are missing from the `lib` directory, OpenSearch fails to start instead of starting without FIPS.

OpenSearch no longer reads the `OPENSEARCH_CRYPTO_STANDARD` environment variable. Use `OPENSEARCH_FIPS_MODE` instead.
{: .note}

If the JVM is already in approved-only mode because FIPS is configured at the JDK or operating system level, but `OPENSEARCH_FIPS_MODE` is not set, OpenSearch does not enforce its own FIPS checks.

HTTP/3 is not available while Bouncy Castle FIPS runs in approved-only mode, even if `http.protocol.http3.enabled` is `true`. QUIC encrypts with the BoringSSL library bundled with the native QUIC codec rather than with a Java security provider, so it would bypass the validated module. OpenSearch then serves HTTP/1.1 and HTTP/2 only.

## Security providers and the generated java.security file

OpenSearch does not register or remove security providers in code. Instead, the startup scripts generate a `java.security` file from the JDK that OpenSearch runs on and pass it to the JVM using `-Djava.security.properties==<file>`, so the generated file replaces the JDK's own file. The OpenSearch node and every command line tool use the same mechanism.

The provider list depends on the mode:

- **FIPS mode**: The JDK's providers are removed. The providers and the settings that differ from the JDK defaults come from `config/fips_java.security`. This file is an example: only the Bouncy Castle providers are FIPS 140-3 validated. For a compliant deployment, review the file and replace the JDK providers that it lists.
- **Default mode**: The JDK's providers are kept, and Bouncy Castle FIPS is added after them. Keystores and truststores in BCFKS format work without FIPS mode.

The startup scripts write the generated file to `config/java.security.generated`. If the `config` directory is not writable, for example because it is mounted read-only, the file is written to a directory named `opensearch-<uid>` that only the OpenSearch user can access. This directory is created in `OPENSEARCH_TMPDIR` or, if that variable is not set, in the Java temporary directory. In that case, OpenSearch prints one line explaining the reason to `stderr`. A file that already has the correct content is not rewritten, so an installation step can generate the file in advance, even if the `config` directory is read-only later.

If `OPENSEARCH_JAVA_OPTS` already sets `java.security.properties`, OpenSearch does not generate a file and uses the specified one.

All processes that share a `config` directory, including command line tools such as `opensearch-keystore`, must use the same JDK and the same `OPENSEARCH_FIPS_MODE` value. Otherwise, a process can start with the file that another process generated. Running processes are not affected because the JVM reads the file only at startup.
{: .important}

### Logging before startup

In FIPS mode, Bouncy Castle JSSE logs every TLS handshake at the `INFO` level through `java.util.logging`. Until OpenSearch configures its logging, these messages are written to `stderr`. To route them through Log4j from the start, uncomment the following line in `config/jvm.options`:

```
-Djava.util.logging.manager=org.apache.logging.log4j.jul.LogManager
```

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
