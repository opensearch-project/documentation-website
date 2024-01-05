---
layout: default
title: Actions
nav_order: 50
grand_parent: Alerting
parent: Monitors
---

# Actions

Actions send notifications when trigger conditions are met. See [Notifications]({{site.url}}{{site.baseurl}}/notifications-plugin/index/) to learn about creating notifications. If you don't want to receive notifications, don't add actions to your triggers.

## Adding actions

To add an action:

1. In the **Triggers** panel, select **Add action**.
1. Enter the action details, including action name, notification channel, and notification message body, in the **Notification** section.

    You can add variables to your messages using [Mustache templates](https://mustache.github.io/mustache.5.html). You have access to `ctx.action.name`, the name of the current action, and all [actions variables](#actions-variables).

    If your notification channel is a custom webhook that expects a particular data format, include JSON (or XML) directly in the message body:

    ```json
    {% raw %}{ "text": "Monitor {{ctx.monitor.name}} just entered alert status. Please investigate the issue. - Trigger: {{ctx.trigger.name}} - Severity: {{ctx.trigger.severity}} - Period start: {{ctx.periodStart}} - Period end: {{ctx.periodEnd}}" }{% endraw %}
    ```

    In the preceding example, the message content must conform to the `Content-Type` header in the [custom webhook]({{site.url}}{{site.baseurl}}/notifications-plugin/index/).

1. If you're using a bucket-level monitor, choose whether the monitor should perform an action for each execution or for each alert.
1. (Optional) Use action throttling to limit the number of notifications you receive within a given time frame.

    For example, if a monitor checks a trigger condition every minute, you could receive one notification per minute. If you set action throttling to 60 minutes, you receive no more than one notification per hour, even if the trigger condition is met dozens of times in that hour.

1. Choose **Create**.

After an action sends a message, the content of that message has left the purview of the [Security Analytics]({{site.url}}{{site.baseurl}}/security-analytics/index/) plugin. Securing access to the message (for example, access to the Slack channel) is your responsibility.

#### Example message

```mustache
{% raw %}Monitor {{ctx.monitor.name}} just entered an alert state. Please investigate the issue.
- Trigger: {{ctx.trigger.name}}
- Severity: {{ctx.trigger.severity}}
- Period start: {{ctx.periodStart}}
- Period end: {{ctx.periodEnd}}{% endraw %}
```

To use the `ctx.results` variable in a message, use `{% raw %}{{ctx.results.0}}{% endraw %}` rather than `{% raw %}{{ctx.results[0]}}{% endraw %}`. This difference is due to how Mustache handles bracket notation.
{: .note }

#### Actions variables

Variable | Data type | Description
:--- | :--- | : ---
`ctx.trigger.actions.id` | String | The action ID.
`ctx.trigger.actions.name` | String | The action name.
`ctx.trigger.actions.message_template.source` | String | The message to send in the alert.
`ctx.trigger.actions.message_template.lang` | String | The scripting language used to define the message. Must be Mustache.
`ctx.trigger.actions.throttle_enabled` | Boolean | Whether throttling is enabled for this trigger. See [adding actions](#adding-actions) for more information about throttling.
`ctx.trigger.actions.subject_template.source` | String | The message's subject in the alert.
`ctx.trigger.actions.subject_template.lang` | String | The scripting language used to define the subject. Must be Mustache.
