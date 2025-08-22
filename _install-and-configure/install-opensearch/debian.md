---
layout: default
title: Debian
parent: Installing OpenSearch
redirect_from:
- /opensearch/install/deb/
nav_order: 55
---

{% comment %}
The following liquid syntax declares a variable, major_version_mask, which is transformed into "N.x" where "N" is the major version number. This is required for proper versioning references to the Yum repo.
{% endcomment %}
{% assign version_parts = site.opensearch_major_minor_version | split: "." %}
{% assign major_version_mask = version_parts[0] | append: ".x" %}

# Debian

Installing OpenSearch using the Advanced Packaging Tool (APT) package manager simplifies the process considerably compared to the [Tarball]({{site.url}}{{site.baseurl}}/opensearch/install/tar/) method. Several technical considerations, such as the installation path, location of configuration files, and creation of a service managed by `systemd`, as examples, are handled automatically by the package manager.

Generally speaking, installing OpenSearch from the Debian distribution can be broken down into a few steps:

1. **Download and install OpenSearch.**
   - Install manually from a Debian package or from an APT repository.
1. **(Optional) Test OpenSearch.**
   - Confirm that OpenSearch is able to run before you apply any custom configuration.
   - This can be done without any security (no password, no certificates) or with a demo security configuration that can be applied by a packaged script.
1. **Configure OpenSearch for your environment.**
   -  Apply basic settings to OpenSearch and start using it in your environment.

The Debian distribution provides everything you need to run OpenSearch inside Debian-based Linux Distributions, such as Ubuntu.

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. Some example commands reference the `vi` text editor, but you may use any text editor available.
{:.note}

## Step 1: Download and install OpenSearch

### Install OpenSearch from a package

1. Download the Debian package for the desired version directly from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'}. The Debian package can be downloaded for both **x64** and **arm64** architectures.
1. From the CLI, install the package using `dpkg`:

   For new installations of OpenSearch 2.12 and later, you must define a custom admin password in order to set up a demo security configuration. Use one of the following commands to define a custom admin password:
   ```bash
   # x64
   sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password> dpkg -i opensearch-{{site.opensearch_version}}-linux-x64.deb
   
   # arm64
   sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password> dpkg -i opensearch-{{site.opensearch_version}}-linux-arm64.deb
   ```
   Use the following command for OpenSearch versions 2.11 and earlier:
   ```bash
   # x64
   sudo dpkg -i opensearch-{{site.opensearch_version}}-linux-x64.deb
   
   # arm64
   sudo dpkg -i opensearch-{{site.opensearch_version}}-linux-arm64.deb
   ```

1. After the installation succeeds, enable OpenSearch as a service.
    ```bash
    sudo systemctl enable opensearch
    ```
    {% include copy.html %}

1. Start the OpenSearch service.
    ```bash
    sudo systemctl start opensearch
    ```
    {% include copy.html %}

1. Verify that OpenSearch launched correctly.
    ```bash
    sudo systemctl status opensearch
    ```
    {% include copy.html %}

### Fingerprint verification

The Debian package is not signed. If you would like to verify the fingerprint, the OpenSearch Project provides a `.sig` file as well as the `.deb` package for use with GNU Privacy Guard (GPG).

1. Download the desired Debian package.
   ```bash
   curl -SLO https://artifacts.opensearch.org/releases/bundle/opensearch/{{site.opensearch_version}}/opensearch-{{site.opensearch_version}}-linux-x64.deb
   ```
   {% include copy.html %}

1. Download the corresponding signature file.
   ```bash
   curl -SLO https://artifacts.opensearch.org/releases/bundle/opensearch/{{site.opensearch_version}}/opensearch-{{site.opensearch_version}}-linux-x64.deb.sig
   ```
   {% include copy.html %}

1. Download and import the GPG key.
   ```bash
   curl -o- https://artifacts.opensearch.org/publickeys/opensearch-release.pgp | gpg --import -
   ```
   {% include copy.html %}

1. Verify the signature.
   ```bash
   gpg --verify opensearch-{{site.opensearch_version}}-linux-x64.deb.sig opensearch-{{site.opensearch_version}}-linux-x64.deb
   ```
   {% include copy.html %}

### Install OpenSearch from an APT repository

APT, the primary package management tool for Debian–based operating systems, allows you to download and install the Debian package from the APT repository. 

1. Install the necessary packages.
   ```bash
   sudo apt-get update && sudo apt-get -y install lsb-release ca-certificates curl gnupg2
   ```
    {% include copy.html %}

1. Import the public GPG key. This key is used to verify that the APT repository is signed.
    ```bash
    curl -o- https://artifacts.opensearch.org/publickeys/opensearch-release.pgp | sudo gpg --dearmor --batch --yes -o /usr/share/keyrings/opensearch-release-keyring
    ```
    {% include copy.html %}

1. Create an APT repository for OpenSearch:
   ```bash
   echo "deb [signed-by=/usr/share/keyrings/opensearch-release-keyring] https://artifacts.opensearch.org/releases/bundle/opensearch/{{major_version_mask}}/apt stable main" | sudo tee /etc/apt/sources.list.d/opensearch-{{major_version_mask}}.list
   ```
   {% include copy.html %}

1. Verify that the repository was created successfully.
    ```bash
    sudo apt-get update
    ```
    {% include copy.html %}

1. With the repository information added, list all available versions of OpenSearch:
   ```bash
   sudo apt list -a opensearch
   ```
   {% include copy.html %}

1. Choose the version of OpenSearch you want to install: 
   - Unless otherwise indicated, the latest available version of OpenSearch is installed.

   ```bash
   # For new installations of OpenSearch 2.12 and later, you must define a custom admin password in order to set up a demo security configuration.
   # Use one of the following commands to define a custom admin password:
   sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password> apt-get install opensearch

   # Use the following command for OpenSearch versions 2.11 and earlier:
   sudo apt-get install opensearch
   ```
   {% include copy.html %}

   - To install a specific version of OpenSearch:

   ```bash
   # Specify the version manually using opensearch=<version>

   # For new installations of OpenSearch 2.12 and later, you must define a custom admin password in order to set up a demo security configuration.
   # Use one of the following commands to define a custom admin password:
   sudo env OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password> apt-get install opensearch={{site.opensearch_version}}

   # Use the following command for OpenSearch versions 2.11 and earlier:
   sudo apt-get install opensearch=<version>
   ```

1. If the installation succeeds, it means APT has validated that the repository metadata was signed with a trusted GPG key. To manually confirm that the key you imported matches the official OpenSearch release key, execute the following command:

   ```bash
   gpg --no-default-keyring --keyring /etc/apt/trusted.gpg.d/opensearch.gpg --fingerprint
   ```

   In the output you should see the following snippet:
   ```bash
   pub   rsa4096 2021-05-11 [SC]
      C5B7 4989 65EF D1C2 924B  A9D5 39D3 1987 9310 D3FC
   ```
   {% include copy.html %}

1. Once complete, enable OpenSearch.
    ```bash
    sudo systemctl enable opensearch
    ```
    {% include copy.html %}

1. Start OpenSearch.
    ```bash
    sudo systemctl start opensearch
    ```
    {% include copy.html %}

1. Verify that OpenSearch launched correctly.
    ```bash
    sudo systemctl status opensearch
    ```
    {% include copy.html %}

## Step 2: (Optional) Test OpenSearch

Before proceeding with any configuration, you should test your installation of OpenSearch. Otherwise, it can be difficult to determine whether future problems are due to installation issues or custom settings you applied after installation.

When OpenSearch is installed using the Debian package, some demo security settings are automatically applied. This includes self-signed TLS certificates and several users and roles. If you would like to configure these yourself, see [Set up OpenSearch in your environment](#step-3-set-up-opensearch-in-your-environment).

An OpenSearch node in its default configuration (with demo certificates and users with default passwords) is not suitable for a production environment. If you plan to use the node in a production environment, you should, at a minimum, replace the demo TLS certificates with your own TLS certificates and [update the list of internal users and passwords]({{site.url}}{{site.baseurl}}/security-plugin/configuration/yaml). See [Security configuration]({{site.url}}{{site.baseurl}}/security-plugin/configuration/index/) for additional guidance to ensure that your nodes are configured according to your security requirements.
{: .warning}

1. Send requests to the server to verify that OpenSearch is running. Note the use of the `--insecure` flag, which is required because the TLS certificates are self-signed.
   - Send a request to port 9200:
      ```bash
      curl -X GET https://localhost:9200 -u 'admin:<custom-admin-password>' --insecure
      ```
      {% include copy.html %}

      You should get a response that looks like this:
      ```bash
      {
         "name":"hostname",
         "cluster_name":"opensearch",
         "cluster_uuid":"QqgpHCbnSRKcPAizqjvoOw",
         "version":{
            "distribution":"opensearch",
            "number":<version>,
            "build_type":<build-type>,
            "build_hash":<build-hash>,
            "build_date":<build-date>,
            "build_snapshot":false,
            "lucene_version":<lucene-version>,
            "minimum_wire_compatibility_version":"7.10.0",
            "minimum_index_compatibility_version":"7.0.0"
         },
         "tagline":"The OpenSearch Project: https://opensearch.org/"
      }
      ```
   - Query the plugins endpoint:
    ```bash
    curl -X GET https://localhost:9200/_cat/plugins?v -u 'admin:<custom-admin-password>' --insecure
    ```
    {% include copy.html %}

    The response should look like this:
    ```bash
    name          component                            version
    hostname      opensearch-alerting                  {{site.opensearch_version}}
    hostname      opensearch-anomaly-detection         {{site.opensearch_version}}
    hostname      opensearch-asynchronous-search       {{site.opensearch_version}}
    hostname      opensearch-cross-cluster-replication {{site.opensearch_version}}
    hostname      opensearch-geospatial                {{site.opensearch_version}}
    hostname      opensearch-index-management          {{site.opensearch_version}}
    hostname      opensearch-job-scheduler             {{site.opensearch_version}}
    hostname      opensearch-knn                       {{site.opensearch_version}}
    hostname      opensearch-ml                        {{site.opensearch_version}}
    hostname      opensearch-neural-search             {{site.opensearch_version}}
    hostname      opensearch-notifications             {{site.opensearch_version}}
    hostname      opensearch-notifications-core        {{site.opensearch_version}}
    hostname      opensearch-observability             {{site.opensearch_version}}
    hostname      opensearch-performance-analyzer      {{site.opensearch_version}}
    hostname      opensearch-reports-scheduler         {{site.opensearch_version}}
    hostname      opensearch-security                  {{site.opensearch_version}}
    hostname      opensearch-security-analytics        {{site.opensearch_version}}
    hostname      opensearch-sql                       {{site.opensearch_version}}
    ```

## Step 3: Set up OpenSearch in your environment

Users who do not have prior experience with OpenSearch may want a list of recommended settings in order to get started with the service. By default, OpenSearch is not bound to a network interface and cannot be reached by external hosts. Additionally, security settings are populated by default user names and passwords. The following recommendations will enable a user to bind OpenSearch to a network interface, create and sign TLS certificates, and configure basic authentication.

The following recommended settings will allow you to:

- Bind OpenSearch to an IP or network interface on the host.
- Set initial and maximum JVM heap sizes.
- Define an environment variable that points to the bundled JDK.
- Configure your own TLS certificates—no third-party certificate authority (CA) is required.
- Create an admin user with a custom password.

If you ran the security demo script, then you will need to manually reconfigure settings that were modified. Refer to [Security configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/) for guidance before proceeding.
{:.note}

Before modifying any configuration files, it's always a good idea to save a backup copy before making changes. The backup file can be used to mitigate any issues caused by a bad configuration.
{:.tip}

1. Open `opensearch.yml`.
   ```bash
   sudo vi /etc/opensearch/opensearch.yml
   ```
   {% include copy.html %}

1. Replace the content with the following lines:

   ```bash
   # Path to directory where to store the data (separate multiple locations by comma):
   path.data: /var/lib/opensearch
   
   # Path to log files:
   path.logs: /var/log/opensearch

   # Bind OpenSearch to the correct network interface. Use 0.0.0.0
   # to include all available interfaces or specify an IP address
   # assigned to a specific interface.
   network.host: 0.0.0.0

   # Unless you have already configured a cluster, you should set
   # discovery.type to single-node, or the bootstrap checks will
   # fail when you try to start the service.
   discovery.type: single-node

   # If you previously disabled the Security plugin in opensearch.yml,
   # be sure to re-enable it. Otherwise you can skip this setting.
   plugins.security.disabled: false
   ```
   {% include copy.html %}

   The custom TLS configuration will be added in section [Configure TLS](#configure-tls)

1. Save your changes and close the file.
1. Specify initial and maximum JVM heap sizes.
   1.  Open `jvm.options`.
         
         ```bash
         sudo vi /etc/opensearch/jvm.options
         ```
         {% include copy.html %}

   1. Modify the values for initial and maximum heap sizes. As a starting point, you should set these values to half of the available system memory. For dedicated hosts this value can be increased based on your workflow requirements.
      -  As an example, if the host machine has 8 GB of memory, then you might want to set the initial and maximum heap sizes to 4 GB:
         
         ```bash
         -Xms4g
         -Xmx4g
         ```
         {% include copy.html %}

   1. Save your changes and close the file.

### Configure TLS

TLS certificates provide additional security for your cluster by allowing clients to confirm the identity of hosts and encrypt traffic between the client and host. For more information, refer to [Configure TLS Certificates]({{site.url}}{{site.baseurl}}/security-plugin/configuration/tls/) and [Generate Certificates]({{site.url}}{{site.baseurl}}/security-plugin/configuration/generate-certificates/), which are included in the [Security plugin]({{site.url}}{{site.baseurl}}/security-plugin/index/) documentation. For work performed in a development environment, self-signed certificates are usually adequate. This section will guide you through the basic steps required to generate your own TLS certificates and apply them to your OpenSearch host.

1. Delete the demo certificates.
   
   ```bash
   sudo sh -c 'rm /etc/opensearch/*.pem'
   ```
   {% include copy.html %}

1. Generate a root certificate. This is what you will use to sign your other certificates.
   
   ```bash
   # Create a private key for the root certificate
   sudo openssl genrsa -out /etc/opensearch/root-ca-key.pem 2048
   
   # Use the private key to create a self-signed root certificate. Be sure to
   # replace the arguments passed to -subj so they reflect your specific host.
   sudo openssl req -new -x509 -sha256 -key /etc/opensearch/root-ca-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=ROOT" -out /etc/opensearch/root-ca.pem -days 730
   ```

1. Next, create the admin certificate. This certificate is used to gain elevated rights for performing administrative tasks relating to the Security plugin.
   
   ```bash
   # Create a private key for the admin certificate.
   sudo openssl genrsa -out /etc/opensearch/admin-key-temp.pem 2048

   # Convert the private key to PKCS#8.
   sudo openssl pkcs8 -inform PEM -outform PEM -in /etc/opensearch/admin-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out /etc/opensearch/admin-key.pem
   
   # Create the certficiate signing request (CSR). A common name (CN) of "A" is acceptable because this certificate is
   # used for authenticating elevated access and is not tied to a host.
   sudo openssl req -new -key /etc/opensearch/admin-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=A" -out /etc/opensearch/admin.csr
   
   # Sign the admin certificate with the root certificate and private key you created earlier.
   sudo openssl x509 -req -in /etc/opensearch/admin.csr -CA /etc/opensearch/root-ca.pem -CAkey /etc/opensearch/root-ca-key.pem -CAcreateserial -sha256 -out /etc/opensearch/admin.pem -days 730
   ```
   {% include copy.html %}

1. Create a certificate for the node being configured.
   
   ```bash
   # Create a private key for the node certificate.
   sudo openssl genrsa -out /etc/opensearch/node1-key-temp.pem 2048
   
   # Convert the private key to PKCS#8.
   sudo openssl pkcs8 -inform PEM -outform PEM -in /etc/opensearch/node1-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out /etc/opensearch/node1-key.pem

   # Create the CSR and replace the arguments passed to -subj so they reflect your specific host.
   # The CN should match a DNS A record for the host-do not use the hostname.
   sudo openssl req -new -key /etc/opensearch/node1-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=node1.dns.a-record" -out /etc/opensearch/node1.csr
   
   # Create an extension file that defines a SAN DNS name for the host. This
   # should match the DNS A record of the host.
   sudo sh -c 'echo subjectAltName=DNS:node1.dns.a-record > /etc/opensearch/node1.ext'
   
   # Sign the node certificate with the root certificate and private key that you created earlier.
   sudo openssl x509 -req -in /etc/opensearch/node1.csr -CA /etc/opensearch/root-ca.pem -CAkey /etc/opensearch/root-ca-key.pem -CAcreateserial -sha256 -out /etc/opensearch/node1.pem -days 730 -extfile /etc/opensearch/node1.ext
   ```
   {% include copy.html %}

1. Remove temporary files that are no longer required.
   
   ```bash
   sudo sh -c 'rm -f /etc/opensearch/*temp.pem /etc/opensearch/*.csr /etc/opensearch/*.ext'
   ```
   {% include copy.html %}

1. Make sure the remaining certificates are owned by the opensearch user.
   
   ```bash
   sudo chown opensearch:opensearch /etc/opensearch/admin-key.pem /etc/opensearch/admin.pem /etc/opensearch/node1-key.pem /etc/opensearch/node1.pem /etc/opensearch/root-ca-key.pem /etc/opensearch/root-ca.pem /etc/opensearch/root-ca.srl
   ```
   {% include copy.html %}

1. Add these certificates to `/etc/opensearch/opensearch.yml` as described in [Generate Certificates]({{site.url}}{{site.baseurl}}/security-plugin/configuration/generate-certificates/#add-distinguished-names-to-opensearchyml). Advanced users might also choose to append the settings using the following script:
   
   ```bash
   #! /bin/bash

   # Before running this script, make sure to replace the CN in the 
   # node's distinguished name with a real DNS A record.

   echo "plugins.security.ssl.transport.pemcert_filepath: /etc/opensearch/node1.pem" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "plugins.security.ssl.transport.pemkey_filepath: /etc/opensearch/node1-key.pem" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "plugins.security.ssl.transport.pemtrustedcas_filepath: /etc/opensearch/root-ca.pem" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "plugins.security.ssl.http.enabled: true" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "plugins.security.ssl.http.pemcert_filepath: /etc/opensearch/node1.pem" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "plugins.security.ssl.http.pemkey_filepath: /etc/opensearch/node1-key.pem" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "plugins.security.ssl.http.pemtrustedcas_filepath: /etc/opensearch/root-ca.pem" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "plugins.security.allow_default_init_securityindex: true" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "plugins.security.authcz.admin_dn:" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "  - 'CN=A,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "plugins.security.nodes_dn:" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "  - 'CN=node1.dns.a-record,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "plugins.security.audit.type: internal_opensearch" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "plugins.security.enable_snapshot_restore_privilege: true" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "plugins.security.check_snapshot_restore_write_privileges: true" | sudo tee -a /etc/opensearch/opensearch.yml
   echo "plugins.security.restapi.roles_enabled: [\"all_access\", \"security_rest_api_access\"]" | sudo tee -a /etc/opensearch/opensearch.yml
   ```
   {% include copy.html %}

1. (Optional) Add trust for the self-signed root certificate.
   
   ```bash
   # Copy the root certificate to the correct directory
   sudo install -m 0644 /etc/opensearch/root-ca.pem /usr/local/share/ca-certificates/root-ca.crt
   
   # Add trust
   sudo update-ca-certificates
   ```
   {% include copy.html %}

### Configure a user

Users are defined and authenticated by OpenSearch in a variety of ways. One method that does not require additional backend infrastructure is to manually configure users in `internal_users.yml`. See [YAML files]({{site.url}}{{site.baseurl}}/security-plugin/configuration/yaml/) for more information about configuring users. The following steps explain how to replace the `admin` default password using a script.

1. Navigate to the Security plugins tools directory.
   
   ```bash
   cd /usr/share/opensearch/plugins/opensearch-security/tools
   ```
   {% include copy.html %}

1. Run `hash.sh` to generate a new password.
   - This script will fail if a path to the JDK has not been defined.
      
      ```bash
      # Example output if a JDK isn't found...
      $ ./hash.sh
      **************************************************************************
      ** This tool will be deprecated in the next major release of OpenSearch **
      ** https://github.com/opensearch-project/security/issues/1755           **
      **************************************************************************
      which: no java in (/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/user/.local/bin:/home/user/bin)
      WARNING: nor OPENSEARCH_JAVA_HOME nor JAVA_HOME is set, will use 
      ./hash.sh: line 35: java: command not found
      ```
      {% include copy.html %}

   - Declare an environment variable when you invoke the script in order to avoid issues:
      
      ```bash
      OPENSEARCH_JAVA_HOME=/usr/share/opensearch/jdk ./hash.sh
      ```
      {% include copy.html %}

   - Enter the desired password at the prompt and make a note of the output hash.
1. Open `internal_users.yml`.
   
   ```bash
   sudo vi /etc/opensearch/opensearch-security/internal_users.yml
   ```
   {% include copy.html %}

1. Replace the admin password hash inside `internal_users.yml` with the output provided by `hash.sh` in step 2. The file should look similar to the following example:
   
   ```bash
   ---
   # This is the internal user database
   # The hash value is a bcrypt hash and can be generated with plugin/tools/hash.sh

   _meta:
      type: "internalusers"
      config_version: 2

   # Define your internal users here

   admin:
      hash: "$2y$1EXAMPLEQqwS8TUcoEXAMPLEeZ3lEHvkEXAMPLERqjyh1icEXAMPLE."
      reserved: true
      backend_roles:
      - "admin"
      description: "Admin user"

   user1:
      hash: "$2y$12$zoHpvTCRjjQr6h0PEaabueCaGam3/LDvT6rZZGDGMusD7oehQjw/O"
      reserved: false
      backend_roles: []
      description: "New internal user"

   # Other users 
   ...
   ```
   {% include copy.html %}

### Apply changes

Now that TLS certificates are installed and demo users were removed or assigned new passwords, the last step is to apply the configuration changes. This last configuration step requires invoking `securityadmin.sh` while OpenSearch is running on the host.

1. OpenSearch must be running for `securityadmin.sh` to apply changes. If you made changes to `opensearch.yml`, restart OpenSearch.
   
   ```bash
   sudo systemctl restart opensearch
   ```
   {% include copy.html %}

1. Navigate to the directory containing `securityadmin.sh`.
   
   ```bash
   # Change to the correct directory
   cd /usr/share/opensearch/plugins/opensearch-security/tools
   ```
   {% include copy.html %}

1. Invoke the script. See [Apply changes using securityadmin.sh]({{site.url}}{{site.baseurl}}/security-plugin/configuration/security-admin/) for definitions of the arguments you must pass.
   
   ```bash
   # You can omit the environment variable if you declared this in your $PATH.
   sudo OPENSEARCH_JAVA_HOME=/usr/share/opensearch/jdk ./securityadmin.sh -cd /etc/opensearch/opensearch-security/ -cacert /etc/opensearch/root-ca.pem -cert /etc/opensearch/admin.pem -key /etc/opensearch/admin-key.pem -icl -nhnv
   ```
   {% include copy.html %}

### Verify that the service is running

OpenSearch is now running on your host with custom TLS certificates and a secure user for basic authentication. You can verify external connectivity by sending an API request to your OpenSearch node from another host.

During the previous test you directed requests to `localhost`. Now that TLS certificates have been applied and the new certificates reference your host's actual DNS record, requests to `localhost` will fail the CN check and the certificate will be considered invalid. Instead, requests should be sent to the address you specified while generating the certificate.

You should add trust for the root certificate to your client before sending requests. If you do not add trust, then you must use the `-k` option so that cURL ignores CN and root certificate validation.
{:.tip}

```bash
$ curl https://localhost:9200 -u admin:<yournewpassword> -k
```

You should receive the following response:

```
{
   "name":"hostname",
   "cluster_name":"opensearch",
   "cluster_uuid":"QqgpHCbnSRKcPAizqjvoOw",
   "version":{
      "distribution":"opensearch",
      "number":<version>,
      "build_type":<build-type>,
      "build_hash":<build-hash>,
      "build_date":<build-date>,
      "build_snapshot":false,
      "lucene_version":<lucene-version>,
      "minimum_wire_compatibility_version":"7.10.0",
      "minimum_index_compatibility_version":"7.0.0"
   },
   "tagline":"The OpenSearch Project: https://opensearch.org/"
}
```

## Upgrade to a newer version

OpenSearch instances installed using `dpkg` or `apt-get` can be easily upgraded to a newer version.

### Manual upgrade with DPKG 

Download the Debian package for the desired upgrade version directly from the [OpenSearch Project downloads page](https://opensearch.org/downloads.html){:target='\_blank'}.

Navigate to the directory containing the distribution and run the following command:

```bash
sudo dpkg -i opensearch-{{site.opensearch_version}}-linux-x64.deb
```
{% include copy.html %}

### APT-GET

To upgrade to the latest version of OpenSearch using `apt-get`:

```bash
sudo apt-get upgrade opensearch
```
{% include copy.html %}

You can also upgrade to a specific OpenSearch version:

```bash
sudo apt-get upgrade opensearch=<version>
```
{% include copy.html %}

### Automatically restart the service after a package upgrade (2.13.0+)

To automatically restart OpenSearch after a package upgrade, enable the `opensearch.service` through `systemd`:

```bash
sudo systemctl enable opensearch.service
```
{% include copy.html %}

## Related links

- [OpenSearch configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/)
- [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/)
- [OpenSearch plugin installation]({{site.url}}{{site.baseurl}}/opensearch/install/plugins/)
- [About the Security plugin]({{site.url}}{{site.baseurl}}/security-plugin/index/)
