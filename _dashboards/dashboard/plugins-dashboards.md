---
layout: default
title: Managing plugins with a dashboard
parent: Observability
nav_order: 5
---

# Managing plugins with a dashboard

Introduced 2.7
{: .label .label-purple }

The default installation of OpenSearch Dashboards includes the Observability plugin, which you can use to visualize data-driven events using Piped Processing Language (PPL) to explore, discover, and query data stored in OpenSearch. The plugin requires OpenSearch 1.2 or later.

The Observability plugin provides a unified experience for collecting and monitoring metrics, logs, and traces from common data sources. Data collection and monitoring in one place enables full-stack, end-to-end observability of your entire infrastructure.

As of OpenSearch 2.7, you can manage your observability plugins with **Observability Dashboards** or **Dashboard**, instead of the plugins page. The plugins are integrated automatically into Observability Dashboards and Dashboard. This feature provides you:

- **Instant access to installed plugins:** Viewing a list of plugins from a dashboard displays all the installed plugins in one place.
- **Improved efficiency:** With a list of plugins readily available from a dashboard, you can enable, disable, update, or remove them with just a few clicks.
- **Better troubleshooting:** Viewing a list of plugins from a dashboard can help you quickly identify which plugins may be causing a problem.
- **Enhanced security:** With a list of plugins readily available from a dashboard, you can easily see if any outdated or vulnerable plugins are present and then quickly remove or update them, minimizing or avoiding security risks.
- **Improved website performance:** Viewing a list of plugins from a dashboard can help you identify any plugins that may be slowing down your website or causing performance issues.

## Viewing installed plugins

There are two ways to view installed plugins from a dashboard: with Observability Dashboards application or with Dashboard. To view your installed plugins, follow these steps:

1. From the OpenSearch Dashboards main menu, select **Observability** > **Dashboard**. Alternatively, select **Dashboard**.
2. View the list of items and select your plugin. Plugins are categorized automatically as the Observability Dashboard data type, which you can filter to concentrate on just what you want to see.

The following image shows a list of plugins viewed in the Observability Dashboard interface.

<insert image>

## Installing and removing plugins

To install plugins using the Observability Dashboards application, follow these steps:

1. From the OpenSearch Dashboards main menu, select **Observability Dashboards**. Alternatively, select **Dashboard**.
2. From the **Dashboards** window, select **Create** > **Observability Dashboard**.
3. In the **Create operational panel** window, enter a name in the **Name** field, and then select **Create**. The plugin is added to both the Observability Plugins application and the Dashboards application.
4. To remove the plugin, select <insert steps>.

 ## Staying updated about OpenSearch Dashboards plugins

The [OpenSearch plugins repository](https://github.com/opensearch-project/opensearch-plugins) on GitHub is a great way to keep track of and contribute to tasks, feature requests, enhancements, and bugs. The OpenSearch Project team welcomes your input.
