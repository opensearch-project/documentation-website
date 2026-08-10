---
layout: default
title: test_procedures
parent: Anatomy of a workload
nav_order: 50
---

<!-- vale off -->
# test_procedures
<!-- vale on -->

A test procedure is a single benchmarking scenario. Each test procedure wraps a [`schedule`]({{site.url}}{{site.baseurl}}/benchmark/reference/workloads/schedule/) and adds properties such as a name and description. Use the `test_procedures` element when a workload defines multiple scenarios. When a workload defines only one scenario, specify `schedule` at the top level of `workload.json` instead and omit `test_procedures`.

A test procedure can reference all operations defined in the [`operations`]({{site.url}}{{site.baseurl}}/benchmark/reference/workloads/operations/) element. Each test procedure supports the following parameters.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`name` | Yes | String | The name of the test procedure. When naming the test procedure, do not use spaces; this ensures that the name can be easily entered on the command line.
`description` | No | String |  Describes the test procedure in a human-readable format.
`user-info` | No | String | Outputs a message at the start of the test to notify you about important test-related information, for example, deprecations.
`default` | No | Boolean | When set to `true`, selects the default test procedure if you did not specify a test procedure on the command line. If the workload only defines one test procedure, it is implicitly selected as the default. Otherwise, you must define `"default": true` on exactly one challenge.
[`schedule`]({{site.url}}{{site.baseurl}}/benchmark/reference/workloads/schedule/) | Yes | Array | Defines the order in which workload tasks are run.
