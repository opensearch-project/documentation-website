---
layout: default
title: OpenSearch Keystore
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


- `create`: Initializes a new keystore. If a keystore already exists, this command will overwrite the existing keystore.
- `list`: Lists all settings in the keystore.
- `add <setting-name>`: Adds a new setting to the current keystore. When a new setting is added, OpenSearch Keystore prompts for the value of that setting. After adding the setting and value, both are securely stored in the keystore.
- `add-file <file-name>`: Adds a new file to the keystore.
- `remove <setting-name>`: Removes an existing setting from the keystore.
- `upgrade <setting-name>`: Upgrades an existing setting within the keystore.
- `passwd`: Sets a password for the keystore.
- `has-passwd`: Print whether keystore is password protected or not.
- `help`: Displays help information about the `opensearch-keystore` commands.

### Options

- `-h, --help`: Displays help information about the script and its options.
- `-s, --silent`: Provides minimal output.
- `-v, --verbose`: Provides a verbose output for debugging purposes.

## Examples

The following examples provide the basic syntax for common OpenSearch Keystore commands:


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

## Referring to keystore entries

After a setting has been added to the keystore, you can refer back to that setting inside your OpenSearch configuration. To refer back to the setting, place the keystore setting name as a placeholder in the `opensearch.yml` configuration file, as shown in the following example:

```bash
plugins.security.ssl.http.pemkey_password_secure: ${plugins.security.ssl.http.pemkey_password_secure}
```