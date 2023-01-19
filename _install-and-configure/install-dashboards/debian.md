---
layout: default
title: Debian
parent: Install OpenSearch Dashboards
nav_order: 55
---

# Install OpenSearch Dashboards (Debian)

Installing OpenSearch Dashboards using the Advanced Packaging Tool (APT) package manager simplifies the process considerably compared to the [Tarball]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tar/) method. Several technical considerations, such as the installation path, location of configuration files, and creation of a service managed by `systemd`, as examples, are handled automatically by the package manager.

OpenSearch Dashboards requires a <waiting-for-tech-feedback-for-prereq-wording>

Generally speaking, installing OpenSearch Dashboards from the Debian distribution can be broken down into a few steps:

1. **Download and install OpenSearch Dashboards.**
   - Install manually from a Debian package or from an APT repository.
1. **(Optional) Test OpenSearch.**
   - Confirm that OpenSearch is able to run before you apply any custom configuration.
   - This can be done without any security (no password, no certificates) or with a demo security configuration that can be applied by a packaged script.
1. **Configure OpenSearch for your environment.**
   -  Apply basic settings to OpenSearch and start using it in your environment.

The Debian distribution provides everything you need to run OpenSearch inside Debian-based Linux Distributions, such as Ubuntu.

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. Some example commands reference the `vi` text editor, but you may use any text editor available.
{:.note}