---
layout: default
title: Tarball
parent: Install OpenSearch
nav_order: 50
---

# Tarball

OpenSearch offers many installation methods. One such method is to install OpenSearch manually from a tarball. The tarball is a self-contained directory with everything you need to run OpenSearch, including an integrated Java Development Kit (JDK). The tarball is a good option for testing and development.

After downloading and unpacking the archive, OpenSearch is ready to configure and use. Experienced OpenSearch users may have predefined configurations that they will apply to their host after downloading the tarball. A quickstart guide with basic recommended settings is included below for new users.

This installation method is compatible with most Linux distributions including, but not limited to, CentOS 7, Amazon Linux 2, and Ubuntu 18.04. If you have your own Java installation and set the environment variable `JAVA_HOME` in the terminal, macOS works as well.

This document assumes that you are comfortable working from the Linux command line interface. You should understand how to input commands, navigate between directories, and edit text files. Some example commands reference the `vi` text editor, but that is strictly for demonstration purposes and is not meant to endorse `vi`.
{:.note}

## Download OpenSearch

1. Download the appropriate tar.gz archive from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'} or using the command line (such as with `wget`).
   ```bash
   # x64
   wget https://artifacts.opensearch.org/releases/bundle/opensearch/{{site.opensearch_version}}/opensearch-{{site.opensearch_version}}-linux-x64.tar.gz

   # ARM64
   wget https://artifacts.opensearch.org/releases/bundle/opensearch/{{site.opensearch_version}}/opensearch-{{site.opensearch_version}}-linux-arm64.tar.gz
   ```
1. Extract the contents of the tarball.
   ```bash
   # x64
   tar -xvf opensearch-{{site.opensearch_version}}-linux-x64.tar.gz
   
   # ARM64
   tar -xvf opensearch-{{site.opensearch_version}}-linux-arm64.tar.gz
   ```

## Configure Important System Settings

Before launching OpenSearch you should review some [important system settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/){:target='\_blank'}.

1. Disable memory paging and swapping performance on the host to improve performance.
   ```bash
   sudo swapoff -a
   ```
1. Increase the number of memory maps available to OpenSearch.
   ```bash
   # Edit the sysctl config file
   sudo vi /etc/sysctl.conf

   # Add a line to define the desired value
   # or change the value if the key exists
   vm.max_map_count=262144

   # Save and quit (in vi you would use the command :wq!)
   # Reload the kernel parameters using sysctl
   sudo sysctl -p

   # Verify that the change was applied by checking the value
   cat /proc/sys/vm/max_map_count
   ```

## Test OpenSearch

REVISIT AND ADD SENTENCE HERE TO TIE TOGETHERYou should verify that OpenSearch is able to run and respond to API requests. There are two quick methods to achieve this:

1. **(Security Enabled)** Apply a generic configuration using the demo security script included in the tar archive.
1. **(Security Disabled)** Manually disable the security plugin and test the instance before applying your own custom security settings.

The demo security script will apply a generic configuration to your instance of OpenSearch. This configuration defines some environment variables and also applies self-signed TLS certificates. If you would like to configure these yourself, see the [Quickstart Guide](#quickstart-guide).

If you only want to verify that the service is properly configured and will respond to API requests, and you intend to configure security settings yourself, then you may want to disable the security plugin and launch the service without encryption or authentication.

An OpenSearch node configured by the demo security script is not suitable for a production environment. If you plan to use the node in a production environment after running `opensearch-tar-install.sh` you should, at a minimum, replace the demo TLS certificates with your own TLS certificates and [update the list of internal users and passwords]({{site.url}}{{site.baseurl}}/security-plugin/configuration/yaml). See [Security configuration]({{site.url}}{{site.baseurl}}/security-plugin/configuration/index/) for additional guidance to ensure that your nodes are configured according to your security requirements.
{: .warning}

### Option 1: Test your Opensearch settings with security enabled
// Consider putting a paragraph here to introduce?
1. Change to the top directory of your OpenSearch install.
   ```bash
   cd /path/to/opensearch-{{site.opensearch_version}}
   ```
1. Run the demo security script.
   ```bash
   ./opensearch-tar-install.sh
   ```
1. Open another terminal session and send requests to the server to verify that OpenSearch is up and running. Note the  use of the `--insecure` flag which is required since the TLS certs are self-signed.
   - Send a request to port 9200.
      ```bash
      curl -X GET https://localhost:9200 -u 'admin:admin' --insecure
      ```
      You should get a response that looks like this:
      ```bash
      {
         "name" : "hostname",
         "cluster_name" : "opensearch",
         "cluster_uuid" : "6XNc9m2gTUSIoKDqJit0PA",
         "version" : {
            "distribution" : "opensearch",
            "number" : "2.1.0",
            "build_type" : "tar",
            "build_hash" : "388c80ad94529b1d9aad0a735c4740dce2932a32",
            "build_date" : "2022-06-30T21:31:04.823801692Z",
            "build_snapshot" : false,
            "lucene_version" : "9.2.0",
            "minimum_wire_compatibility_version" : "7.10.0",
            "minimum_index_compatibility_version" : "7.0.0"
         },
         "tagline" : "The OpenSearch Project: https://opensearch.org/"
      }
      ```
   - Query the plugins endpoint.
      ```bash
      curl -X GET https://localhost:9200/_cat/plugins?v -u 'admin:admin' --insecure
      ```

      The response should look like this:
      ```bash
      name     component                            version
      hostname opensearch-alerting                  2.1.0.0
      hostname opensearch-anomaly-detection         2.1.0.0
      hostname opensearch-asynchronous-search       2.1.0.0
      hostname opensearch-cross-cluster-replication 2.1.0.0
      hostname opensearch-index-management          2.1.0.0
      hostname opensearch-job-scheduler             2.1.0.0
      hostname opensearch-knn                       2.1.0.0
      hostname opensearch-ml                        2.1.0.0
      hostname opensearch-notifications             2.1.0.0
      hostname opensearch-notifications-core        2.1.0.0
      hostname opensearch-observability             2.1.0.0
      hostname opensearch-performance-analyzer      2.1.0.0
      hostname opensearch-reports-scheduler         2.1.0.0
      hostname opensearch-security                  2.1.0.0
      hostname opensearch-sql                       2.1.0.0
      ```
1. Return to the original terminal session and stop the process by pressing `CTRL + C`.

### Option 2: Test your OpenSearch settings with security disabled
// Consider putting a paragraph here to introduce?
1. Open the configuration file.
   ```bash
   vi /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   ```
1. Add the following line to disable the security plugin.
   ```bash
   plugins.security.disabled: true
   ```
1. Save the change and close the file.
1. Open another terminal session and send requests to the server to verify that OpenSearch is up and running. Since the security plugin has been disabled you will be sending commands using `HTTP` rather than `HTTPS`.
   - Send a request to port 9200.
      ```bash
      curl -X GET http://localhost:9200
      ```
      You should get a response that looks like this:
      ```bash
      {
         "name" : "hostname",
         "cluster_name" : "opensearch",
         "cluster_uuid" : "6XNc9m2gTUSIoKDqJit0PA",
         "version" : {
            "distribution" : "opensearch",
            "number" : "2.1.0",
            "build_type" : "tar",
            "build_hash" : "388c80ad94529b1d9aad0a735c4740dce2932a32",
            "build_date" : "2022-06-30T21:31:04.823801692Z",
            "build_snapshot" : false,
            "lucene_version" : "9.2.0",
            "minimum_wire_compatibility_version" : "7.10.0",
            "minimum_index_compatibility_version" : "7.0.0"
         },
         "tagline" : "The OpenSearch Project: https://opensearch.org/"
      }
      ```
   - Query the plugins endpoint.
      ```bash
      curl -X GET http://localhost:9200/_cat/plugins?v
      ```

      The response should look like this:
      ```bash
      name     component                            version
      hostname opensearch-alerting                  2.1.0.0
      hostname opensearch-anomaly-detection         2.1.0.0
      hostname opensearch-asynchronous-search       2.1.0.0
      hostname opensearch-cross-cluster-replication 2.1.0.0
      hostname opensearch-index-management          2.1.0.0
      hostname opensearch-job-scheduler             2.1.0.0
      hostname opensearch-knn                       2.1.0.0
      hostname opensearch-ml                        2.1.0.0
      hostname opensearch-notifications             2.1.0.0
      hostname opensearch-notifications-core        2.1.0.0
      hostname opensearch-observability             2.1.0.0
      hostname opensearch-performance-analyzer      2.1.0.0
      hostname opensearch-reports-scheduler         2.1.0.0
      hostname opensearch-security                  2.1.0.0
      hostname opensearch-sql                       2.1.0.0
      ```

## Quickstart Guide - CHANGE TO SOMETHING LIKE "Configure/Setup OpenSearch in your environment" with a blurb about "here are settings we recommend."

By default, OpenSearch is not bound to a network interface and cannot be reached by external hosts. Additionally, security settings are either undefined (greenfield install) or are populated by default usernames and passwords if you ran the security demo script by invoking `opensearch-tar-install.sh`. The following recommendations will enable a user to bind OpenSearch to a network interface, create and sign TLS certifications, and configure basic authentication.

If you ran the security demo script then you will need to manually reconfigure settings that were modified. Refer to Security Plugin [Configuration]({{site.url}}{{site.baseurl}}/opensearch/configuration/) for guidance before proceeding.
{:.note}

Before modifying any configuration files, it's always a good idea to save a backup copy before making changes. The backup file can be used to revert any issues caused by a bad configuration.
{:.tip}

1. Open `opensearch.yml`.
   ```bash
   vi /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   ```
1. Add the following lines.
   ```bash
   # Bind OpenSearch to the correct network interface. Use 0.0.0.0
   # to include all available interfaces or specify an IP addresss
   # assigned to a specific interface.
   network.host: 0.0.0.0

   # Unless you have already configured a cluster, you should set
   # discovery.type to single-node or the bootstrap checks will
   # fail when you try to start the service.
   discovery.type: single-node

   # If you previously disabled the security plugin in opensearch.yml,
   # be sure to re-enable it.
   plugins.security.disabled: false
   ```
1. Save your changes and close the file.
1. Specify an initial and max JVM heap size.
   1.  Open `jvm.options`.
         ```bash
         vi /path/to/opensearch-{{site.opensearch_version}}/config/jvm.options
         ```
   1. Modify the values for initial and maximum heap size. As a starting point, you should set these values to half of the available system memory. For dedicated hosts this value can be increased based on your workflow requirements.
      -  As an example, if the host machine has 8GB of memory then you might want to set the initial and maximum heap sizes to 4GB:
         ```bash
         -Xms4g
         -Xmx4g
         ```
   1. Save your changes and close the file.
1. Specify the location of the included JDK.
   ```bash
   export OPENSEARCH_JAVA_HOME=/path/to/opensearch-{{site.opensearch_version}}/jdk
   ```

### Configure TLS

TLS certificates provide additional security for your cluster by allowing clients to confirm the identity of hosts and encrypt traffic between the client and host. For more complete information, refer to [Configure TLS Certificates]({{site.url}}{{site.baseurl}}/security-plugin/configuration/tls/) and [Generate Certificates]({{site.url}}{{site.baseurl}}/security-plugin/configuration/generate-certificates/) which are covered in the [Security Plugin]({{site.url}}{{site.baseurl}}/security-plugin/index/) documentation. For work performed in a development environment, self-signed certificates are usually adequate. This section will guide you through the basic steps required to generate your own TLS certificates and apply them to your OpenSearch host.

1. Navigate to the OpenSearch `config` directory. This is where the certificates will be stored.
   ```bash
   cd /path/to/opensearch-{{site.opensearch_version}}/config/
   ```
1. Generate a root certificate. This is what you will use to sign your other certificates.
   ```bash
   # Create a private key for the root certificate
   openssl genrsa -out root-ca-key.pem 2048
   
   # Use the private key to create a self-signed root certificate. Be sure to
   # replace the arguments passed to -subj so they reflect your specific host.
   openssl req -new -x509 -sha256 -key root-ca-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=ROOT" -out root-ca.pem -days 730
   ```
1. Next, create the admin certificate. This certificate is used is used to gain elevated rights for performing administrative tasks relating to the security plugin.
   ```bash
   # Create a private key for the admin cert
   openssl genrsa -out admin-key-temp.pem 2048

   # Convert the private key to PKCS#8
   openssl pkcs8 -inform PEM -outform PEM -in admin-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out admin-key.pem
   
   # Create the CSR. A common name (CN) of "A" is acceptable because this certificate is
   # used for authenticating elevated access and is not tied to a host.
   openssl req -new -key admin-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=A" -out admin.csr
   
   # Sign the admin certificate with the root certificate and private key that was created earlier
   openssl x509 -req -in admin.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out admin.pem -days 730
   ```
1. Create a certificate for the node being configured.
   ```bash
   # Create a private key for the node cert
   openssl genrsa -out node1-key-temp.pem 2048
   
   # Convert the private key to PKCS#8
   openssl pkcs8 -inform PEM -outform PEM -in node1-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out node1-key.pem
   
   # Create the CSR - replace the arguments passed to -subj to they reflect your specific host.
   # The CN should match a DNS A record for the host - do not use the hostname.
   openssl req -new -key node1-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=node1.dns.a-record" -out node1.csr
   
   # Create an extension file that defines a SAN DNS name for the host. This
   # should match the DNS A record of the host.
   echo 'subjectAltName=DNS:node1.dns.a-record' > node1.ext
   
   # Sign the node certificate with the root certificate and private key that was created earlier
   openssl x509 -req -in node1.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out node1.pem -days 730 -extfile node1.ext
   ```
1. Remove temporary files that are no longer required.
   ```bash
   rm *temp.pem *csr *ext
   ```
1. Add these certificates to `opensearch.yml` as described in [Generate Certificates]({{site.url}}{{site.baseurl}}/security-plugin/configuration/generate-certificates/#add-distinguished-names-to-opensearchyml). You might also choose to append the settings using a script.
   ```bash
   #! /bin/bash

   # Before running this script, make sure to replace the /path/to your OpenSearch directory
   # and don't forget to replace the CN in the node's distinguished name with a real
   # DNS A record.

   echo "plugins.security.ssl.transport.pemcert_filepath: /path/to/opensearch-{{site.opensearch_version}}/config/node1.pem" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.ssl.transport.pemkey_filepath: /path/to/opensearch-{{site.opensearch_version}}/config/node1-key.pem" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.ssl.transport.pemtrustedcas_filepath: /path/to/opensearch-{{site.opensearch_version}}/config/root-ca.pem" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   # I don't think we want this next line in the sample script right?  Borrowed from Miki's personal notes/process.
   # echo "plugins.security.ssl.transport.enforce_hostname_verification: false" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.ssl.http.enabled: true" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.ssl.http.pemcert_filepath: /path/to/opensearch-{{site.opensearch_version}}/config/node1.pem" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.ssl.http.pemkey_filepath: /path/to/opensearch-{{site.opensearch_version}}/config/node1-key.pem" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.ssl.http.pemtrustedcas_filepath: /path/to/opensearch-{{site.opensearch_version}}/config/root-ca.pem" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.allow_default_init_securityindex: true" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.authcz.admin_dn:" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "  - 'CN=A,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.nodes_dn:" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "  - 'CN=node1.dns.a-record,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.audit.type: internal_opensearch" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.enable_snapshot_restore_privilege: true" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.check_snapshot_restore_write_privileges: true" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.restapi.roles_enabled: [\"all_access\", \"security_rest_api_access\"]" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   ```
1. (Optional) Add trust for the self-signed root certificate.
   ```bash
   # Copy the root cert to the correct directory
   sudo cp /path/to/opensearch-{{site.opensearch_version}}/config/root-ca.pem /etc/pki/ca-trust/source/anchors/

   # Add trust
   sudo update-ca-trust
   ```

### Configure a user

Users are defined and authenticated by OpenSearch in a variety of ways. One method, which does not require additional backend infrastructure, is manually configuring users in `internal_users.yml`. See [YAML files]({{site.url}}{{site.baseurl}}/security-plugin/configuration/yaml/) for more information about configuring users. The following steps explain how to remove all demo users except for the `admin` user, and how to replace the `admin` default password using a script.

1. Make the security plugin scripts executable.
   ```bash
   chmod 755 /path/to/opensearch-{{site.opensearch_version}}/plugins/opensearch-security/tools/*.sh
   ```
1. Run `hash.sh` to generate a new password.
   - This script will fail if a JDK is not defined in your `$PATH` and you have not defined either the `OPENSEARCH_JAVA_HOME` or the `JAVA_HOME` environment variables:
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
   - Declare an environment variable when you invoke the script to avoid issues with the following command:
      ```bash
      OPENSEARCH_JAVA_HOME=/path/to/opensearch-{{site.opensearch_version}}/jdk ./hash.sh
      ```
   - Enter the desired password at the prompt and make a note of the output hash.
1. Open `internal_users.yml`.
   ```bash
   vi /path/to/opensearch-{{site.opensearch_version}}/config/opensearch-security/internal_users.yml
   ```
1. Remove all demo users except for `admin` and replace the hash with the output provided by `hash.sh` in a previous step. The file should look similar to the following example.
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
   ```

### Apply changes

TLS certificates are installed and demo users were removed or assigned new passwords. The last step is to apply the configuration changes, which requires invoking `securityadmin.sh` while OpenSearch is running on the host.

1. Start OpenSearch.
   ```bash
   # Change directories
   cd /path/to/opensearch-{{site.opensearch_version}}/bin

   # Run the service in the foreground
   ./opensearch
   ```
1. Open a second terminal session with the host and change directories to access `securityadmin.sh`.
   ```bash
   # Change to the correct directory
   cd /path/to/opensearch-{{site.opensearch_version}}/plugins/opensearch-security/tools
   ```
1. Invoke the script.
   ```bash
   # You can omit the environment variable if you declared this in your $PATH.
   OPENSEARCH_JAVA_HOME=/path/to/opensearch-{{site.opensearch_version}}/jdk ./securityadmin.sh -cd /path/to/opensearch-{{site.opensearch_version}}/config/opensearch-security/ -cacert /path/to/opensearch-{{site.opensearch_version}}/config/root-ca.pem -cert /path/to/opensearch-{{site.opensearch_version}}/config/admin.pem -key /path/to/opensearch-{{site.opensearch_version}}/config/admin-key.pem -icl -nhnv
   ```

### Verify that the service is running

OpenSearch is now running on your host with custom TLS certificates and a secure user for basic authentication. The last step is verifying that the host is reachable by other clients.

During previous tests you directed requests to `localhost`. Now that TLS certificates have been applied, and the new certificates reference your hosts actual DNS record, the CN check will fail and the certificate will be considered invalid if you send requests to `localhost`. Instead, requests should be sent to the address you specified while generating the certificate.

You should add trust for the root certificate to your client before sending requests. If you do not add trust then you must use the `-k` option so that cURL ignores CN and root certificate validation.
{:.tip}

```bash
$ curl https://your.host.address:9200 -u admin:yournewpassword -k
{
  "name" : "hostname-here",
  "cluster_name" : "opensearch",
  "cluster_uuid" : "efC0ANNMQlGQ5TbhNflVPg",
  "version" : {
    "distribution" : "opensearch",
    "number" : "2.1.0",
    "build_type" : "tar",
    "build_hash" : "388c80ad94529b1d9aad0a735c4740dce2932a32",
    "build_date" : "2022-06-30T21:31:04.823801692Z",
    "build_snapshot" : false,
    "lucene_version" : "9.2.0",
    "minimum_wire_compatibility_version" : "7.10.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "The OpenSearch Project: https://opensearch.org/"
}
```

## Related Links

Add some links to plugins, configuration, cluster setup, indexing data, etc., here
{% comment %}
## Configuration

You can modify `config/opensearch.yml` or specify environment variables as arguments using `-E`:

```bash
./opensearch-tar-install.sh -Ecluster.name=opensearch-cluster -Enode.name=opensearch-node1 -Ehttp.host=0.0.0.0 -Ediscovery.type=single-node
```

For other settings, see [Important settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/).
{% endcomment %}

### (Optional) Set up Performance Analyzer

In a tarball installation, Performance Analyzer collects data when it is enabled. But in order to read that data using the REST API on port 9600, you must first manually launch the associated reader agent process:

1. Make Performance Analyzer accessible outside of the host machine

   ```bash
   cd /usr/share/opensearch # navigate to the OpenSearch home directory
   cd config/opensearch-performance-analyzer/
   vi performance-analyzer.properties
   ```

   Uncomment the line `#webservice-bind-host` and set it to `0.0.0.0`:

   ```
   # ======================== OpenSearch performance analyzer plugin config =========================

   # NOTE: this is an example for Linux. Modify the config accordingly if you are using it under other OS.

   # WebService bind host; default to all interfaces
   webservice-bind-host = 0.0.0.0

   # Metrics data location
   metrics-location = /dev/shm/performanceanalyzer/

   # Metrics deletion interval (minutes) for metrics data.
   # Interval should be between 1 to 60.
   metrics-deletion-interval = 1

   # If set to true, the system cleans up the files behind it. So at any point, we should expect only 2
   # metrics-db-file-prefix-path files. If set to false, no files are cleaned up. This can be useful, if you are archiving
   # the files and wouldn't like for them to be cleaned up.
   cleanup-metrics-db-files = true

   # WebService exposed by App's port
   webservice-listener-port = 9600

   # Metric DB File Prefix Path location
   metrics-db-file-prefix-path = /tmp/metricsdb_

   https-enabled = false

   #Setup the correct path for certificates
   certificate-file-path = specify_path

   private-key-file-path = specify_path

   # Plugin Stats Metadata file name, expected to be in the same location
   plugin-stats-metadata = plugin-stats-metadata

   # Agent Stats Metadata file name, expected to be in the same location
   agent-stats-metadata = agent-stats-metadata
   ```

1. Make the CLI executable:

   ```bash
   sudo chmod +x ./bin/performance-analyzer-agent-cli
   ```

1. Launch the agent CLI:

   ```bash
   OPENSEARCH_HOME="$PWD" OPENSEARCH_PATH_CONF="$PWD/config" ./bin/performance-analyzer-agent-cli
   ```

1. In a separate window, enable the Performance Analyzer plugin:

   ```bash
   curl -XPOST localhost:9200/_plugins/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
   ```

   If you receive the `curl: (52) Empty reply from server` error, you are likely protecting your cluster with the security plugin and you need to provide credentials. Modify the following command to use your username and password:

   ```bash
   curl -XPOST https://localhost:9200/_plugins/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}' -u 'admin:admin' -k
   ```

1. Finally, enable the Root Cause Analyzer (RCA) framework

   ```bash
   curl -XPOST localhost:9200/_plugins/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
   ```

   Similar to step 4, if you run into `curl: (52) Empty reply from server`, run the command below to enable RCA

   ```bash
   curl -XPOST https://localhost:9200/_plugins/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}' -u 'admin:admin' -k
   ```

{% comment %}

### (Optional) Removing Performance Analyzer

See [Clean up Performance Analyzer files]({{site.url}}{{site.baseurl}}/plugins#optional-clean-up-performance-analyzer-files).

{% endcomment %}