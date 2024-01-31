---
layout: default
title: OpenSearch keystore
parent: Configuration
nav_order: 50
---

# OpenSearch Keystore

`opensearch-keystore` is a utility script for managing the OpenSearch Keystore. This keystore provides a secure method to store sensitive information, such as passwords and keys, used in an OpenSearch cluster. The script allows you to securely create, list, add, and remove settings.

## Usage

To use OpenSearch Keystore, open a terminal and use the following command syntax: 


```
opensearch-keystore [command] [options]
```

## Commands
OpenSearch Keystore supports the following the commands: 


- `create`: Initializes a new keystore. If a keystore already exists, this command will overwrite it.
- `list`: Lists all settings in the keystore.
- `add <setting-name>`: Adds a new setting to the keystore. Prompts for the value to be securely stored.
- `add-file <file-name>`: Adds a new file to the keystore.
- `remove <setting-name>`: Removes a setting from the keystore.
- `upgrade <setting-name>`: Upgrades an existing setting within the keystore.
- `passwd`: Sets a password for the keystore.
- `has-passwd`: Print whether keystore is password protected or not.
- `help`: Displays help information about the `opensearch-keystore` commands.

### Options

- `-h, --help`: Displays help information about the script and its options.
- `-s, --silent`: Provides minimal output.
- `-v, --verbose`: Provides a verbose output for debugging purposes.

### Examples

1. Creating a new keystore:

    ```bash
    ./bin/opensearch-keystore create
    ```

2. Listing settings in the keystore:

    ```bash
    ./bin/opensearch-keystore list
    ```

3. Adding a new setting:

    ```bash
    ./bin/opensearch-keystore add plugins.security.ssl.http.pemkey_password_secure
    ```

After this command, you will be prompted to enter the secret key securely.

4. Removing a setting:

    ```bash
    ./bin/opensearch-keystore remove plugins.security.ssl.http.pemkey_password_secure
    ```

### Refer to keystore entries within OpenSearch configuration

Once a setting is added to the keystore, you can refer to the setting within the OpenSearch configuration. Place the setting name as a placeholder in the `opensearch.yml` configuration file.

```bash
plugins.security.ssl.http.pemkey_password_secure: ${plugins.security.ssl.http.pemkey_password_secure}
```