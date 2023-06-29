---
layout: default
title: Crypto plugin
nav_order: 90
has_children: false
---


# Crypto plugin

The Crypto plugin provides client side encryption and decryption for OpenSearch. This allows for the transfer of data between OpenSearch and a remote storage service to support features such as [Remote-backed storage]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/index/) or backup of [Snapshots]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/index/). However, the plugin is not limited to this type of application alone and can be used for local encryption as well.

The plugin itself is responsible for implementing encryption or decryption of OpenSearch data, although it does require a key provider to generate a cypher key, also called a data key. The plugin is extensible and therefore supports any number of key providers.  

## Client side encryption API

To register an encryption enabled repository for <remote-store>.

### Request fields

| Field | Type | Description |
| :--- | :--- |:--- |
| `type` | String | The storage service used to store the repository. |
| `settings.bucket` | String | Path to the target distinguished name to be updated. Required. |
| `settings.region` | String | Path to the target distinguished name to be updated. Required. |
| `encrypted` | Boolean | Determines whether the repository is encrypted or not. Set to `true` to encrypt the repository. |
| `crypto_settings.key_provider_name` | String | Identifies the key provider. |
| `crypto_settings.key_provider_type` | String | The type of extension installed |
| `crypto_settings.key_provider_type.settings.sample_key_arn` | String | Setting for the extension plugin that creates the key provider. |



#### Example request

```json
PUT _snapshot/vikasvb-repository-test-1
{
  "type": "s3",
  "settings": {
    "bucket": "vikasvb-repository-test",
    "region": "us-west-2"
  },    
  "encrypted": true,
  "crypto_settings": {
      "key_provider_name": "first-mock-1",
      "key_provider_type": "sample-key-provider-extension",
      "settings": {
          "key-1": "sample value"
      }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
    "acknowledged": true
}
```

## External libraries

Software dependencies are mainly AWS v2 SDK. The following is a list of dependencies:

1. AWS encryption SDK (com.amazonaws:aws-encryption-sdk-java) - Some classes are modified to support encryption or decryption of partial content.
2. Bouncy castle (org.bouncycastle:bcprov-ext-jdk15on)  : Used by encryption SDK for core crypto ops.
3. Apache commons (org.apache.commons:commons-lang3) - Again used by encryption SDK for basic object validations.
4. Junit dependencies - For tests