---
layout: default
title: OpenSearch keystore
parent: Configuration
nav_order: 50
---

# OpenSearch keystore

`opensearch-keystore` is a utility script for managing the OpenSearch keystore. This keystore provides a secure method to store sensitive information, such as passwords and keys, used in an OpenSearch cluster. The script allows you to securely create, list, add, and remove settings. It is included inside the OpenSearch distribution. 

## Usage

In order to use the OpenSearch keystore script, you must have access to the file system in which the script resides. 

To use OpenSearch keystore, open a terminal and use the following command syntax: 

```
opensearch-keystore [command] [options]
```
{% include copy.html %}

## Commands

OpenSearch keystore supports the following the commands: 

- `create`: Initializes a new keystore. If a keystore already exists, this command will overwrite the existing keystore.
- `list`: Lists all settings in the keystore.
- `add <setting-name>`: Adds a new setting to the current keystore. When a new setting is added, OpenSearch keystore prompts for the value of that setting. After adding the setting and value, both are securely stored in the keystore.
- `add-file <file-name>`: Adds a new file to the keystore.
- `remove <setting-name>`: Removes an existing setting from the keystore.
- `upgrade <setting-name>`: Upgrades an existing setting in the keystore.
- `passwd`: Sets a password for the keystore.
- `has-passwd`: Prints whether the keystore is password protected or not.
- `help`: Displays help information about all `opensearch-keystore` commands.

## Options

You can append each command with the following options:

- `-h, --help`: Displays help information about the keystore script and its options.
- `-s, --silent`: Provides minimal output when OpenSearch keystore responds to a command.
- `-v, --verbose`: Provides a verbose output for debugging purposes.

## Examples

The following examples provide the basic syntax for common OpenSearch keystore commands:

### Creating a new keystore:

**Command**

```bash
./bin/opensearch-keystore create
```
{% include copy.html %}

If a keystore already exists, the script will ask if you like to overwrite the existing keystore.
   
**Response**

The script responds with confirmation that the keystore was created:
   
```bash
Created opensearch keystore in $OPENSEARCH_HOME/config/opensearch.keystore
```

### Listing settings in the keystore:

**Command**
   
```bash
./bin/opensearch-keystore list
```
{% include copy.html %}

**Response**

The script responds with a list of settings in the keystore:

```bash
keystore.seed
plugins.security.ssl.http.pemkey_password_secure
```

### Adding a new setting:

```bash
./bin/opensearch-keystore add plugins.security.ssl.http.pemkey_password_secure
```
{% include copy.html %}

**Response**

After this command, you will be prompted to enter the secret key securely.

### Removing a setting:

**Command**

```bash
./bin/opensearch-keystore remove plugins.security.ssl.http.pemkey_password_secure
```
{% include copy.html %}

**Response**

No response exists for this command. To confirm the setting was deleted, use `opensearch-keystore list`.

## Referring to keystore entries

After a setting has been added to the keystore, you can refer back to that setting inside your OpenSearch configuration. To refer back to the setting, place the keystore setting name as a placeholder in the `opensearch.yml` configuration file, as shown in the following example:

```bash
plugins.security.ssl.http.pemkey_password_secure: ${plugins.security.ssl.http.pemkey_password_secure}
```
