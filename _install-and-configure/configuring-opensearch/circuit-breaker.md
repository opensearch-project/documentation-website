---
layout: default
title: Circuit breaker settings
parent: Configuring OpenSearch
nav_order: 50
---

# Circuit breaker settings

Circuit breakers prevent OpenSearch from causing a Java OutOfMemoryError. The parent circuit breaker specifies the total available amount of memory for all child circuit breakers. The child circuit breakers specify the total available amount of memory for themselves.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Parent circuit breaker settings

OpenSearch supports the following parent circuit breaker settings:

- `indices.breaker.total.use_real_memory` (Static, Boolean): If `true`, the parent circuit breaker considers the actual memory usage. Otherwise, the parent circuit breaker considers the amount of memory reserved by the child circuit breakers. Default is `false`.

- `indices.breaker.total.limit` (Dynamic, percentage): Specifies the initial memory limit for the parent circuit breaker. If `indices.breaker.total.use_real_memory` is `true`, defaults to 95% of the JVM heap. If `indices.breaker.total.use_real_memory` is `false`, defaults to 70% of the JVM heap.

## Field data circuit breaker settings

The field data circuit breaker limits the heap memory required to load a field into the field data cache. OpenSearch supports the following field data circuit breaker settings:

- `indices.breaker.fielddata.limit` (Dynamic, percentage): Specifies the memory limit for the field data circuit breaker. Default is 40% of the JVM heap.

- `indices.breaker.fielddata.overhead` (Dynamic, double): A constant by which the field data estimations are multiplied to determine the final estimation. Default is 1.03.

## Request circuit breaker settings

The request circuit breaker limits the memory required to build data structures that are needed for a request (for example, when calculating aggregations). OpenSearch supports the following request circuit breaker settings:

- `indices.breaker.request.limit` (Dynamic, percentage): Specifies the memory limit for the request circuit breaker. Default is 60% of the JVM heap.

- `indices.breaker.request.overhead` (Dynamic, double): A constant by which the request estimations are multiplied to determine the final estimation. Default is 1.

## In-flight request circuit breaker settings

The in-flight request circuit breaker limits the memory usage for all currently running incoming requests on transport and HTTP level. The memory usage for a request is based on the content length of the request and includes memory needed for the raw request and a structured object representing the request. OpenSearch supports the following in-flight request circuit breaker settings:

- `network.breaker.inflight_requests.limit` (Dynamic, percentage): Specifies the memory limit for the in-flight request circuit breaker. Default is 100% of JVM heap (thus, the memory usage limit for an in-flight request is determined by the memory limit of the parent circuit breaker).

- `network.breaker.inflight_requests.overhead` (Dynamic, double): A constant by which the in-flight request estimations are multiplied to determine the final estimation. Default is 2.

## Script compilation circuit breaker settings

The script compilation circuit breaker limits the number of inline script compilations within a time interval. OpenSearch supports the following script compilation circuit breaker setting:

- `script.max_compilations_rate` (Dynamic, rate): The maximum number of unique dynamic scripts compiled within a time interval for a given context. Default is 150 every 5 minutes (`150/5m`).

## Regular expression circuit breaker settings

The regular expression circuit breaker enables or disables regular expressions and limits their complexity. OpenSearch supports the following regular expression circuit breaker settings:

- `script.painless.regex.enabled` (Static, string): Enables regular expressions in Painless scripts. 
    Valid values are: 
    - `limited`: Enables regular expressions and limits their complexity using the `script.painless.regex.limit-factor` setting. 
    - `true`: Enables regular expressions. Turns off the regular expression circuit breaker and does not limit regular expression complexity. 
    - `false`: Disables regular expressions. If a Painless script contains a regular expression, it returns an error. 

    Default is `limited`.

- `script.painless.regex.limit-factor` (Static, integer): Applied only if `script.painless.regex.enabled` is set to `limited`. Limits the number of characters a regular expression in a Painless script. The character limit is calculated by multiplying the number of characters in the script input by `script.painless.regex.limit-factor`. Default is 6 (thus, if the input has 5 characters, the maximum number of characters in a regular expression is 5 &middot; 6 = 30).
