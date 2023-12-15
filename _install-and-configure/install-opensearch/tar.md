---
layout: default
title: Tarball
parent: Installing OpenSearch
nav_order: 10
redirect_from:
  - /opensearch/install/tar/
---

# Tarball

Installing OpenSearch from a tarball, also known as a tar archive, may appeal to users who want granular control over installation details like file permissions and installation paths.

Generally speaking, the installation of OpenSearch from a tarball can be broken down into a few steps:

1. **Download and unpack OpenSearch.**
1. **Configure important system settings.**
   - These settings are applied to the host before modifying any OpenSearch files.
1. **(Optional) Test OpenSearch.**
   - Confirm that OpenSearch is able to run before you apply any custom configuration.
   - This can be done without any security (no password, no certificates) or with a demo security configuration that can be applied by a packaged script.
1. **Configure OpenSearch for your environment.**
   -  Apply basic settings to OpenSearch and start using it in your environment.

The tarball is a self-contained directory with everything needed to run OpenSearch, including an integrated Java Development Kit (JDK). This installation method is compatible with most Linux distributions, including CentOS 7, Amazon Linux 2, and Ubuntu 18.04. If you have your own Java installation and set the environment variable `JAVA_HOME` in the terminal, macOS works as well.

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. Some example commands reference the `vi` text editor, but you may use any text editor available.
{:.note}

## Step 1: Download and unpack OpenSearch

1. Download the appropriate tar.gz archive from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'} or by using the command line (such as with `wget`).
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

## Step 2: Configure important system settings

Before launching OpenSearch you should review some [important system settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/){:target='\_blank'}.
1. Disable memory paging and swapping performance on the host to improve performance.
   ```bash
   sudo swapoff -a
   ```
   {% include copy.html %}

1. Increase the number of memory maps available to OpenSearch.
   ```bash
   # Edit the sysctl config file
   sudo vi /etc/sysctl.conf

   # Add a line to define the desired value
   # or change the value if the key exists,
   # and then save your changes.
   vm.max_map_count=262144

   # Reload the kernel parameters using sysctl
   sudo sysctl -p

   # Verify that the change was applied by checking the value
   cat /proc/sys/vm/max_map_count
   ```

## Step 3: (Optional) Test OpenSearch

Before proceeding you should test your installation of OpenSearch. Otherwise, it can be difficult to determine whether future problems are due to installation issues or custom settings you applied after installation. There are two quick methods for testing OpenSearch at this stage:

1. **(Security enabled)** Apply a generic configuration using the demo security script included in the tar archive.
1. **(Security disabled)** Manually disable the Security plugin and test the instance before applying your own custom security settings.

The demo security script will apply a generic configuration to your instance of OpenSearch. This configuration defines some environment variables and also applies self-signed TLS certificates. If you would like to configure these yourself, see [Step 4: Set up OpenSearch in your environment](#step-4-set-up-opensearch-in-your-environment).

If you only want to verify that the service is properly configured and you intend to configure security settings yourself, then you may want to disable the Security plugin and launch the service without encryption or authentication.

An OpenSearch node configured by the demo security script is not suitable for a production environment. If you plan to use the node in a production environment after running `opensearch-tar-install.sh`, you should, at a minimum, replace the demo TLS certificates with your own TLS certificates and [update the list of internal users and passwords]({{site.url}}{{site.baseurl}}/security/configuration/yaml). See [Security configuration]({{site.url}}{{site.baseurl}}/security/configuration/index/) for additional guidance to ensure that your nodes are configured according to your security requirements.
{: .warning}

### Option 1: Test your OpenSearch settings with security enabled

1. Change to the top directory of your OpenSearch installation.
   ```bash
   cd /path/to/opensearch-{{site.opensearch_version}}
   ```
   {% include copy.html %}

1. Run the OpenSearch startup script with the security demo configuration.
   ```bash
   ./opensearch-tar-install.sh
   ```
   {% include copy.html %}

1. Open another terminal session and send requests to the server to verify that OpenSearch is running. Note the use of the `--insecure` flag, which is required because the TLS certificates are self-signed.
   - Send a request to port 9200:
      ```bash
      curl -X GET https://localhost:9200 -u 'admin:admin' --insecure
      ```
      {% include copy.html %}

      You should get a response that looks like this:
      ```bash
      {
         "name" : "hostname",
         "cluster_name" : "opensearch",
         "cluster_uuid" : "6XNc9m2gTUSIoKDqJit0PA",
         "version" : {
            "distribution" : "opensearch",
            "number" : <version>,
            "build_type" : <build-type>,
            "build_hash" : <build-hash>,
            "build_date" : <build-date>,
            "build_snapshot" : false,
            "lucene_version" : <lucene-version>,
            "minimum_wire_compatibility_version" : "7.10.0",
            "minimum_index_compatibility_version" : "7.0.0"
         },
         "tagline" : "The OpenSearch Project: https://opensearch.org/"
      }
      ```
   - Query the plugins endpoint:
      ```bash
      curl -X GET https://localhost:9200/_cat/plugins?v -u 'admin:admin' --insecure
      ```
      {% include copy.html %}

      The response should look like this:
      ```bash
      name     component                            version
      hostname opensearch-alerting                  {{site.opensearch_version}}
      hostname opensearch-anomaly-detection         {{site.opensearch_version}}
      hostname opensearch-asynchronous-search       {{site.opensearch_version}}
      hostname opensearch-cross-cluster-replication {{site.opensearch_version}}
      hostname opensearch-index-management          {{site.opensearch_version}}
      hostname opensearch-job-scheduler             {{site.opensearch_version}}
      hostname opensearch-knn                       {{site.opensearch_version}}
      hostname opensearch-ml                        {{site.opensearch_version}}
      hostname opensearch-notifications             {{site.opensearch_version}}
      hostname opensearch-notifications-core        {{site.opensearch_version}}
      hostname opensearch-observability             {{site.opensearch_version}}
      hostname opensearch-performance-analyzer      {{site.opensearch_version}}
      hostname opensearch-reports-scheduler         {{site.opensearch_version}}
      hostname opensearch-security                  {{site.opensearch_version}}
      hostname opensearch-sql                       {{site.opensearch_version}}
      ```
1. Return to the original terminal session and stop the process by pressing `CTRL + C`.

### Option 2: Test your OpenSearch settings with security disabled

1. Open the configuration file.
   ```bash
   vi /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   ```
   {% include copy.html %}

1. Add the following line to disable the Security plugin:
   ```bash
   plugins.security.disabled: true
   ```
   {% include copy.html %}

1. Save the change and close the file.
1. Open another terminal session and send requests to the server to verify that OpenSearch is running. Because the Security plugin has been disabled, you will be sending commands using `HTTP` rather than `HTTPS`.
   - Send a request to port 9200.
      ```bash
      curl -X GET http://localhost:9200
      ```
      {% include copy.html %}

      You should get a response that looks like this:
      ```bash
      {
         "name" : "hostname",
         "cluster_name" : "opensearch",
         "cluster_uuid" : "6XNc9m2gTUSIoKDqJit0PA",
         "version" : {
            "distribution" : "opensearch",
            "number" : <version>,
            "build_type" : <build-type>,
            "build_hash" : <build-hash>,
            "build_date" : <build-date>,
            "build_snapshot" : false,
            "lucene_version" : <lucene-version>,
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
      {% include copy.html %}

      The response should look like this:
      ```bash
      name     component                            version
      hostname opensearch-alerting                  {{site.opensearch_version}}
      hostname opensearch-anomaly-detection         {{site.opensearch_version}}
      hostname opensearch-asynchronous-search       {{site.opensearch_version}}
      hostname opensearch-cross-cluster-replication {{site.opensearch_version}}
      hostname opensearch-index-management          {{site.opensearch_version}}
      hostname opensearch-job-scheduler             {{site.opensearch_version}}
      hostname opensearch-knn                       {{site.opensearch_version}}
      hostname opensearch-ml                        {{site.opensearch_version}}
      hostname opensearch-notifications             {{site.opensearch_version}}
      hostname opensearch-notifications-core        {{site.opensearch_version}}
      hostname opensearch-observability             {{site.opensearch_version}}
      hostname opensearch-performance-analyzer      {{site.opensearch_version}}
      hostname opensearch-reports-scheduler         {{site.opensearch_version}}
      hostname opensearch-security                  {{site.opensearch_version}}
      hostname opensearch-sql                       {{site.opensearch_version}}
      ```

## Step 4: Set up OpenSearch in your environment

Users who do not have prior experience with OpenSearch may want a list of recommended settings in order to get started with the service. By default, OpenSearch is not bound to a network interface and cannot be reached by external hosts. Additionally, security settings are either undefined (greenfield install) or populated by default usernames and passwords if you ran the security demo script by invoking `opensearch-tar-install.sh`. The following recommendations will enable a user to bind OpenSearch to a network interface, create and sign TLS certificates, and configure basic authentication.

The following recommended settings will allow you to:

- Bind OpenSearch to an IP or network interface on the host.
- Set initial and maximum JVM heap sizes.
- Define an environment variable that points to the bundled JDK.
- Configure your own TLS certificates - no third-party certificate authority (CA) is required.
- Create an admin user with a custom password.

If you ran the security demo script, then you will need to manually reconfigure settings that were modified. Refer to [Security configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/) for guidance before proceeding.
{:.note}

Before modifying any configuration files, it's always a good idea to save a backup copy before making changes. The backup file can be used to revert any issues caused by a bad configuration.
{:.tip}

1. Open `opensearch.yml`.
   ```bash
   vi /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   ```
   {% include copy.html %}

1. Add the following lines.
   ```bash
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

1. Save your changes and close the file.
1. Specify initial and maximum JVM heap sizes.
   1.  Open `jvm.options`.
         ```bash
         vi /path/to/opensearch-{{site.opensearch_version}}/config/jvm.options
         ```
         {% include copy.html %}

   1. Modify the values for initial and maximum heap sizes. As a starting point, you should set these values to half of the available system memory. For dedicated hosts this value can be increased based on your workflow requirements.
      -  As an example, if the host machine has 8 GB of memory then you might want to set the initial and maximum heap sizes to 4 GB:
         ```bash
         -Xms4g
         -Xmx4g
         ```
         {% include copy.html %}

   1. Save your changes and close the file.
1. Specify the location of the included JDK.
   ```bash
   export OPENSEARCH_JAVA_HOME=/path/to/opensearch-{{site.opensearch_version}}/jdk
   ```
   {% include copy.html %}

### Configure TLS

TLS certificates provide additional security for your cluster by allowing clients to confirm the identity of hosts and encrypt traffic between the client and host. For more information, refer to [Configure TLS Certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/) and [Generate Certificates]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/), which are included in the [Security plugin]({{site.url}}{{site.baseurl}}/security/index/) documentation. For work performed in a development environment, self-signed certificates are usually adequate. This section will guide you through the basic steps required to generate your own TLS certificates and apply them to your OpenSearch host.

1. Navigate to the OpenSearch `config` directory. This is where the certificates will be stored.
   ```bash
   cd /path/to/opensearch-{{site.opensearch_version}}/config/
   ```
   {% include copy.html %}

1. Generate a root certificate. This is what you will use to sign your other certificates.
   ```bash
   # Create a private key for the root certificate
   openssl genrsa -out root-ca-key.pem 2048
   
   # Use the private key to create a self-signed root certificate. Be sure to
   # replace the arguments passed to -subj so they reflect your specific host.
   openssl req -new -x509 -sha256 -key root-ca-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=ROOT" -out root-ca.pem -days 730
   ```
1. Next, create the admin certificate. This certificate is used to gain elevated rights for performing administrative tasks relating to the Security plugin.
   ```bash
   # Create a private key for the admin certificate.
   openssl genrsa -out admin-key-temp.pem 2048

   # Convert the private key to PKCS#8.
   openssl pkcs8 -inform PEM -outform PEM -in admin-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out admin-key.pem
   
   # Create the CSR. A common name (CN) of "A" is acceptable because this certificate is
   # used for authenticating elevated access and is not tied to a host.
   openssl req -new -key admin-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=A" -out admin.csr
   
   # Sign the admin certificate with the root certificate and private key you created earlier.
   openssl x509 -req -in admin.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out admin.pem -days 730
   ```
1. Create a certificate for the node being configured.
   ```bash
   # Create a private key for the node certificate.
   openssl genrsa -out node1-key-temp.pem 2048
   
   # Convert the private key to PKCS#8.
   openssl pkcs8 -inform PEM -outform PEM -in node1-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out node1-key.pem
   
   # Create the CSR and replace the arguments passed to -subj so they reflect your specific host.
   # The CN should match a DNS A record for the host--do not use the hostname.
   openssl req -new -key node1-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=node1.dns.a-record" -out node1.csr
   
   # Create an extension file that defines a SAN DNS name for the host. This
   # should match the DNS A record of the host.
   echo 'subjectAltName=DNS:node1.dns.a-record' > node1.ext
   
   # Sign the node certificate with the root certificate and private key that you created earlier.
   openssl x509 -req -in node1.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out node1.pem -days 730 -extfile node1.ext
   ```
1. Remove temporary files that are no longer required.
   ```bash
   rm *temp.pem *csr *ext
   ```
   {% include copy.html %}

1. Add these certificates to `opensearch.yml` as described in [Generate Certificates]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/#add-distinguished-names-to-opensearchyml). Advanced users might also choose to append the settings using a script:
   ```bash
   #! /bin/bash

   # Before running this script, make sure to replace the /path/to your OpenSearch directory,
   # and remember to replace the CN in the node's distinguished name with a real
   # DNS A record.

   echo "plugins.security.ssl.transport.pemcert_filepath: /path/to/opensearch-{{site.opensearch_version}}/config/node1.pem" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.ssl.transport.pemkey_filepath: /path/to/opensearch-{{site.opensearch_version}}/config/node1-key.pem" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   echo "plugins.security.ssl.transport.pemtrustedcas_filepath: /path/to/opensearch-{{site.opensearch_version}}/config/root-ca.pem" | sudo tee -a /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
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
   {% include copy.html %}

1. (Optional) Add trust for the self-signed root certificate.
   ```bash
   # Copy the root certificate to the correct directory
   sudo cp /path/to/opensearch-{{site.opensearch_version}}/config/root-ca.pem /etc/pki/ca-trust/source/anchors/

   # Add trust
   sudo update-ca-trust
   ```

### Configure a user

Users are defined and authenticated by OpenSearch in a variety of ways. One method, which does not require additional backend infrastructure, is to manually configure users in `internal_users.yml`. See [YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/) for more information about configuring users. The following steps explain how to remove all demo users except for the `admin` user and how to replace the `admin` default password using a script.

1. Make the Security plugin scripts executable.
   ```bash
   chmod 755 /path/to/opensearch-{{site.opensearch_version}}/plugins/opensearch-security/tools/*.sh
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
      OPENSEARCH_JAVA_HOME=/path/to/opensearch-{{site.opensearch_version}}/jdk ./hash.sh
      ```
      {% include copy.html %}

   - Enter the desired password at the prompt and make a note of the output hash.
1. Open `internal_users.yml`.
   ```bash
   vi /path/to/opensearch-{{site.opensearch_version}}/config/opensearch-security/internal_users.yml
   ```
   {% include copy.html %}

1. Remove all demo users except for `admin` and replace the hash with the output provided by `hash.sh` in a previous step. The file should look similar to the following example:
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
   {% include copy.html %}

### Apply changes

Now that TLS certificates are installed and demo users were removed or assigned new passwords, the last step is to apply the configuration changes. This last configuration step requires invoking `securityadmin.sh` while OpenSearch is running on the host.

1. Start OpenSearch. It must be running for `securityadmin.sh` to apply changes.
   ```bash
   # Change directories
   cd /path/to/opensearch-{{site.opensearch_version}}/bin

   # Run the service in the foreground
   ./opensearch
   ```
1. Open a separate terminal session with the host and navigate to the directory containing `securityadmin.sh`.
   ```bash
   # Change to the correct directory
   cd /path/to/opensearch-{{site.opensearch_version}}/plugins/opensearch-security/tools
   ```
1. Invoke the script. See [Apply changes using securityadmin.sh]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/) for definitions of the arguments you must pass.
   ```bash
   # You can omit the environment variable if you declared this in your $PATH.
   OPENSEARCH_JAVA_HOME=/path/to/opensearch-{{site.opensearch_version}}/jdk ./securityadmin.sh -cd /path/to/opensearch-{{site.opensearch_version}}/config/opensearch-security/ -cacert /path/to/opensearch-{{site.opensearch_version}}/config/root-ca.pem -cert /path/to/opensearch-{{site.opensearch_version}}/config/admin.pem -key /path/to/opensearch-{{site.opensearch_version}}/config/admin-key.pem -icl -nhnv
   ```
1. Stop and restart the running OpenSearch process to apply the changes.

### Verify that the service is running

OpenSearch is now running on your host with custom TLS certificates and a secure user for basic authentication. You can verify external connectivity by sending an API request to your OpenSearch node from another host.

During previous tests you directed requests to `localhost`. Now that TLS certificates have been applied and the new certificates reference your host's actual DNS record, requests to `localhost` will fail the CN check and the certificate will be considered invalid. Instead, requests should be sent to the address you specified while generating the certificate.

You should add trust for the root certificate to your client before sending requests. If you do not add trust, then you must use the `-k` option so that cURL ignores CN and root certificate validation.
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

### Run OpenSearch as a service with systemd

This section will guide you through creating a service for OpenSearch and registering it with `systemd`. After the service has been defined, you can enable, start, and stop the OpenSearch service using `systemctl` commands. The commands in this section reflect an environment where OpenSearch has been installed to `/opt/opensearch` and should be changed depending on your installation path.

The following configuration is only suitable for testing in a non-production environment. We do not recommend using the following configuration in a production environment. You should install OpenSearch with the [RPM]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/rpm) distribution if you want to run OpenSearch as a systemd-managed service on your host. The tarball installation does not define a specific installation path, users, roles, or permissions. Failure to properly secure your host environment can result in unexpected behavior.
{: .warning}

1. Create a user for the OpenSearch service.
   ```bash
   sudo adduser --system --shell /bin/bash -U --no-create-home opensearch
   ```
   {% include copy.html %}

1. Add your user to the `opensearch` user group.
   ```bash
   sudo usermod -aG opensearch $USER
   ```
   {% include copy.html %}

1. Change the file owner to `opensearch`. Make sure to change the path if your OpenSearch files are in a different directory.
   ```bash
   sudo chown -R opensearch /opt/opensearch/
   ```
   {% include copy.html %}

1. Create the service file and open it for editing.
   ```bash
   sudo vi /etc/systemd/system/opensearch.service
   ```
   {% include copy.html %}

1. Enter the following example service configuration. Make sure to change references to the path if your OpenSearch files are in a different directory.
   ```bash
   [Unit]
   Description=OpenSearch
   Wants=network-online.target
   After=network-online.target

   [Service]
   Type=forking
   RuntimeDirectory=data

   WorkingDirectory=/opt/opensearch
   ExecStart=/opt/opensearch/bin/opensearch -d

   User=opensearch
   Group=opensearch
   StandardOutput=journal
   StandardError=inherit
   LimitNOFILE=65535
   LimitNPROC=4096
   LimitAS=infinity
   LimitFSIZE=infinity
   TimeoutStopSec=0
   KillSignal=SIGTERM
   KillMode=process
   SendSIGKILL=no
   SuccessExitStatus=143
   TimeoutStartSec=75

   [Install]
   WantedBy=multi-user.target
   ```
   {% include copy.html %}

1. Reload `systemd` manager configuration.
   ```bash
   sudo systemctl daemon-reload
   ```
   {% include copy.html %}

1. Enable the OpenSearch service.
   ```bash
   sudo systemctl enable opensearch.service
   ```
   {% include copy.html %}

1. Start the OpenSearch service.
   ```bash
   sudo systemctl start opensearch
   ```
   {% include copy.html %}

1. Verify that the service is running.
   ```bash
   sudo systemctl status opensearch
   ```
   {% include copy.html %}

## Related links

- [OpenSearch configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/)
- [Configure Performance Analyzer for Tarball Installation]({{site.url}}{{site.baseurl}}/monitoring-plugins/pa/index/#install-performance-analyzer)
- [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/)
- [OpenSearch plugin installation]({{site.url}}{{site.baseurl}}/opensearch/install/plugins/)
- [About the Security plugin]({{site.url}}{{site.baseurl}}/security/index/)