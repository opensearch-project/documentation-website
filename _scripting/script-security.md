---
layout: default
title: Script security
nav_order: 50
---

# Script security

A script is code that runs inside the OpenSearch process, so the security of your cluster depends on the origin of that code and on the Java classes it can call. OpenSearch protects scripting by restricting a script's permitted actions and by restricting the OpenSearch process itself. Configuration settings further restrict the scripts that the cluster accepts.

## Restricting a script's permitted actions

[Painless]({{site.url}}{{site.baseurl}}/scripting/painless/) and the [Lucene expression language]({{site.url}}{{site.baseurl}}/scripting/expressions/) are sandboxed: a script can call only the classes and methods on an allow list that OpenSearch provides, and the allow list omits file access, network access, thread creation, reflection, and the system clock. A Java agent enforces the allow list at the JVM level.

The allow list is provided as plain text in the `lang-painless` module, so you can read it to determine whether a particular class or method is callable. An installed plugin can add entries to it, which means the boundary depends on which plugins are present. For the file locations and contents, see [Painless scripting language]({{site.url}}{{site.baseurl}}/scripting/painless/).

The allow list limits the damage a hostile script can do, and it does not make a script from an untrusted source safe to run. Combine it with the process and configuration restrictions described in the following sections.
{: .warning}

## Restricting the OpenSearch process

The sandbox governs what a script can call. The two protections in this section govern what the OpenSearch process itself can do, so that code escaping the sandbox is still confined.

### Running OpenSearch as an unprivileged user

Never run OpenSearch as the `root` user. A sandbox escape in a process running as `root` compromises the entire host, whereas the same escape in a process running as a dedicated service account is confined to what that account can read and write. The packaged distributions create an `opensearch` user for this purpose. For more information, see [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/).

OpenSearch enforces this itself. A node started as `root` fails during bootstrap with `can not run opensearch as root`. There is no setting that overrides the check.

### Blocking process creation at the operating system level

Below the language sandbox, OpenSearch calls on the operating system to restrict the process itself, so that even native code loaded into the JVM cannot start a new program. The mechanism differs by platform:

- On Linux, a filter installed through `seccomp(2)`, or through `prctl(2)` on older kernels, blocks the `fork`, `vfork`, `execve`, and `execveat` system calls.
- On macOS, `sandbox_init` applies the Seatbelt profile `(version 1) (allow default) (deny process-fork) (deny process-exec)`.
- On Windows, the process joins a job object whose `ActiveProcessLimit` is 1, so it cannot create a child process.

This protection is controlled by the static `bootstrap.system_call_filter` setting, which defaults to `true`. Leave it enabled.

When the setting is enabled and the filter cannot be installed, OpenSearch reports `system call filters failed to install; check the logs and fix your configuration or disable system call filters at your own risk`. Whether that message stops the node depends on how the node is bound:

- A node bound only to a loopback address, or configured with `discovery.type: single-node`, logs the message as a warning and starts anyway. A local development cluster therefore runs without this layer and gives no indication of it beyond that log line.
- A node that binds or publishes to a non-loopback address fails to start, because binding to a reachable address makes the check mandatory.

Do not read a successful start on a development cluster as confirmation that the filter is installed. Search the startup log for the preceding message, which names the reason---such as a kernel built without `CONFIG_SECCOMP_FILTER`---and fix it before you apply the same configuration to a node that other machines can reach. To make the check mandatory on any node, start it with `-Dopensearch.enforce.bootstrap.checks=true`.
{: .note}

Disable `bootstrap.system_call_filter` only to work around a platform on which the filter cannot be installed, and treat that node as having one less layer of defense.
{: .warning}

## Restricting the scripts that the cluster accepts

Configuration is the protection that you control. The following sections describe who can submit a script and which scripts the cluster runs.

### Keeping the cluster off the public network

Do not expose the OpenSearch REST API directly to users or to the internet. Any client that can reach the API can submit a script, so an exposed cluster gives every visitor the ability to run code inside your search process. Place your own application between users and OpenSearch, and have it construct requests from validated input. Do not forward a request body that a user supplied.

The following practices reduce your exposure to a hostile script:

- Send only the query text that a user typed to your application, and build the OpenSearch request from it server-side.
- Store scripts in the cluster and reference them by identifier, so that clients choose from a reviewed set of scripts and supply only `params`. For more information, see [Working with stored scripts]({{site.url}}{{site.baseurl}}/scripting/using-scripts/#working-with-stored-scripts).
- Restrict who can create stored scripts with the `cluster:admin/script/put` permission. For more information, see [Permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/).
- Validate and bound the values that you pass in `params`, the same as any other user input.

The following practices leave a cluster exposed:

- Making the REST API reachable from the internet or from an untrusted network.
- Accepting a search request body from a client and passing it through unchanged, which lets the client supply an arbitrary inline script.
- Interpolating user input into a script `source` string, which is script injection: the input becomes code instead of data.

### Restricting the allowed script types

The `script.allowed_types` setting controls whether the cluster accepts inline scripts, stored scripts, or both. Set it to `inline`, `stored`, or `none`.

The default is an empty list, which allows both types. To accept only stored scripts, so that every script in use has been reviewed and saved by an administrator, add the following to `opensearch.yml`:

```yaml
script.allowed_types: stored
```
{% include copy.html %}

To disable scripting entirely, set the value to `none`:

```yaml
script.allowed_types: none
```
{% include copy.html %}

### Restricting the allowed contexts

The `script.allowed_contexts` setting controls which script contexts the cluster accepts. Each context corresponds to a feature that runs scripts, such as `score` for relevance scoring, `update` for document updates, and `ingest` for ingest pipeline processors.

The default is an empty list, which allows every context. To permit scripts only where they compute scores and sort values, add the following to `opensearch.yml`:

```yaml
script.allowed_contexts: score, number_sort, string_sort
```
{% include copy.html %}

With this setting in place, a script submitted in any other context---including an update script or an ingest processor script---is rejected.

Both `script.allowed_types` and `script.allowed_contexts` are static settings. Set them in `opensearch.yml` on every node and restart the nodes.
{: .note}

## Verifying the current restrictions

To confirm what the cluster currently accepts, use the [Get Script Languages API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-script-language/):

```json
GET _script_language
```
{% include copy-curl.html %}

The `types_allowed` field reports the effect of `script.allowed_types`, and each language is listed with the contexts it can run in after `script.allowed_contexts` is applied:

<details open markdown="block">
<summary>
  Response
</summary>

```json
{
  "types_allowed": [
    "inline",
    "stored"
  ],
  "language_contexts": [
    {
      "language": "expression",
      "contexts": [
        "aggregation_selector",
        "aggs",
        "bucket_aggregation",
        "field",
        "filter",
        "number_sort",
        "score",
        "terms_set"
      ]
    },
    {
      "language": "knn",
      "contexts": [
        "score"
      ]
    },
    {
      "language": "mustache",
      "contexts": [
        "template"
      ]
    },
    {
      "language": "opensearch_compounded_script",
      "contexts": [
        "aggs",
        "filter"
      ]
    },
    {
      "language": "painless",
      "contexts": [
        "aggregation_selector",
        "aggs",
        "aggs_combine",
        "aggs_init",
        "aggs_map",
        "aggs_reduce",
        "analysis",
        "bucket_aggregation",
        "context_aware_grouping",
        "derived_field",
        "field",
        "filter",
        "ingest",
        "interval",
        "moving-function",
        "number_sort",
        "painless_test",
        "processor_conditional",
        "ranklib",
        "score",
        "script_heuristic",
        "search",
        "similarity",
        "similarity_weight",
        "string_sort",
        "template",
        "terms_set",
        "trigger",
        "update"
      ]
    },
    {
      "language": "ranklib",
      "contexts": [
        "ranklib"
      ]
    }
  ]
}
```
</details>

This response is from a standard distribution with both settings left at their defaults, so all types and all contexts appear. The exact list depends on which plugins are installed, because each one can register languages and contexts of its own. After you narrow either setting, the response shows the reduced set, which makes it a direct check that your configuration took effect.

## Limiting the resources a script can consume

A script that is permitted and correct can still be expensive. Two settings bound the resources that scripting consumes:

- `script.painless.regex.enabled` and `script.painless.regex.limit-factor` bound the work a regular expression can do, which prevents a single script from stalling a node. For more information, see [Controlling regular expressions]({{site.url}}{{site.baseurl}}/scripting/painless/#controlling-regular-expressions).
- The compilation rate limit bounds how often new scripts can be compiled, which prevents a flood of unique scripts from consuming a node's CPU on compilation. For more information, see [Script compilation settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/script-and-resource-settings/#script-compilation-settings).

## Other security layers

Scripting settings are one part of securing a cluster. Configure the following as well:

- [Authentication and authorization]({{site.url}}{{site.baseurl}}/security/authentication-backends/authc-index/), so that only known clients can send requests.
- [TLS]({{site.url}}{{site.baseurl}}/security/configuration/tls/) on the REST and transport layers, so that requests and cluster traffic are encrypted.
- [Fine-grained access control]({{site.url}}{{site.baseurl}}/security/access-control/index/), so that a client can access only the indexes and operations it needs.
- An IP filter or firewall in front of the cluster, so that the API is reachable only from your application tier.

For a full account, see [Security in OpenSearch]({{site.url}}{{site.baseurl}}/security/index/).

## Related documentation

- [How to use scripts]({{site.url}}{{site.baseurl}}/scripting/using-scripts/)
- [Painless scripting language]({{site.url}}{{site.baseurl}}/scripting/painless/)
- [Get Script Languages API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/get-script-language/)
