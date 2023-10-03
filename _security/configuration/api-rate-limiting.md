---
layout: default
title: API rate limiting
parent: Configuration
nav_order: 30
---


# API rate limiting

API rate limiting is typically used to restrict the number of API calls that users can make in a set span of time, thereby helping to manage the rate of API traffic. For security purposes, rate limiting features, by restricting failed login attempts, have the potential to defend against denial of service (DoS) attacks or repeated login attempts intended to gain access through trial and error.

You have the option to configure the Security plugin for username rate limiting, IP address rate limiting, or both. These configurations are made in the `config.yml` file. See the following sections for information about each type of rate limiting configuration.


## Username rate limiting

The username rate limiting configuration limits login attempts by username. When a login fails, the username is blocked from use by any machine in the network. The following example shows `config.yml` file settings configured for username rate limiting:

```yml
auth_failure_listeners:
      internal_authentication_backend_limiting:
        type: username
        authentication_backend: internal
        allowed_tries: 3
        time_window_seconds: 60
        block_expiry_seconds: 60
        max_blocked_clients: 100000
        max_tracked_clients: 100000
```
{% include copy.html %}

The following table describes the individual settings for this type of configuration.

| Setting | Description |
| :--- | :--- |
| `type` | The type of rate limiting. In this case, `username`. |
| `authentication_backend` | The internal backend. Enter `internal`. |
| `allowed_tries` | The number of login attempts allowed before login attempts are blocked. Be aware that increasing the number increases heap usage. |
| `time_window_seconds` | The window of time during which the value for `allowed_tries` is enforced. For example, if `allowed_tries` is `3` and `time_window_seconds` is `60`, a username has 3 attempts to log in successfully within a 60-second time span before login attempts are blocked. |
| `block_expiry_seconds` | The window of time during which login attempts remain blocked after a failed login. After this time elapses, login is reset and the username can attempt to log in again. |
| `max_blocked_clients` | The maximum number of blocked usernames. This limits heap usage to avoid a potential DoS attack. |
| `max_tracked_clients` | The maximum number of tracked usernames with failed login attempts. This limits heap usage to avoid a potential DoS attack. |


## IP address rate limiting

The IP address rate limiting configuration limits login attempts by IP address. When a login fails, the IP address specific to the machine being used for login is blocked. 

Configuring IP address rate limiting involves two steps. First, set the `challenge` setting to `false` in the `http_authenticator` section of the `config.yml` file:

```yml
http_authenticator:
  type: basic
  challenge: false
```

For more information about this setting, see [HTTP basic authentication]({{site.url}}{{site.baseurl}}/security/authentication-backends/basic-authc/).

Second, configure the IP address rate limiting settings. The following example shows a completed configuration:

```yml
auth_failure_listeners:
      ip_rate_limiting:
        type: ip
        allowed_tries: 1
        time_window_seconds: 20
        block_expiry_seconds: 180
        max_blocked_clients: 100000
        max_tracked_clients: 100000
```
{% include copy.html %}

The following table describes the individual settings for this type of configuration.

| Setting | Description |
| :--- | :--- |
| `type` | The type of rate limiting. In this case, `ip`. |
| `allowed_tries` | The number of login attempts allowed before login attempts are blocked. Be aware that increasing the number increases heap usage. |
| `time_window_seconds` | The window of time during which the value for `allowed_tries` is enforced. For example, if `allowed_tries` is `3` and `time_window_seconds` is `60`, an IP address has 3 attempts to log in successfully within a 60-second time span before login attempts are blocked. |
| `block_expiry_seconds` | The window of time during which login attempts remain blocked after a failed login. After this time elapses, login is reset and the IP address can attempt to log in again. |
| `max_blocked_clients` | The maximum number of blocked IP addresses. This limits heap usage to avoid a potential DoS attack. |
| `max_tracked_clients` | The maximum number of tracked IP addresses with failed login attempts. This limits heap usage to avoid a potential DoS attack. |

