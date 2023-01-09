---
layout: default
title: Debian
parent: Install OpenSearch
nav_order: 55
---

{% comment %}
The following liquid syntax declares a variable, major_version_mask, which is transformed into "N.x" where "N" is the major version number. This is required for proper versioning references to the Yum repo.
{% endcomment %}
{% assign version_parts = site.opensearch_major_minor_version | split: "." %}
{% assign major_version_mask = version_parts[0] | append: ".x" %}

# DEB

Installing OpenSearch using the APT package manager simplifies the process considerably compared to the [Tarball]({{site.url}}{{site.baseurl}}/opensearch/install/tar/) method. Several technical considerations, such as the installation path, location of configuration files, and creation of a service managed by `systemd`, as examples, are handled automatically by the package manager.

Generally speaking, installing OpenSearch from the DEB distribution can be broken down into a few steps:

1. **Download and install OpenSearch.**
   - Install manually from a DEB distribution or by creating a local repository.
1. **Configure important system settings.**
   - These settings are applied to the host before modifying any OpenSearch files.
1. **(Optional) Test OpenSearch.**
   - Confirm that OpenSearch is able to run before you apply any custom configuration.
   - This can be done without any security (no password, no certificates) or with a demo security configuration that can be applied by a packaged script.
1. **Configure OpenSearch for your environment.**
   -  Apply basic settings to OpenSearch and start using it in your environment.

The DEB distribution provides everything you need to run OpenSearch inside Debian-based Linux Distributions, such as Ubuntu.

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. Some example commands reference the `vi` text editor, but you may use any text editor available.
{:.note}

