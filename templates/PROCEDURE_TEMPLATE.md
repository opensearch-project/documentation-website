---
layout: default
title: <DOING SOMETHING WITH APP>
parent: <DOING SOMETHING MORE GENERAL>
grand_parent: <POSSIBLY EVEN ONE MORE LEVEL>
nav_order: 0
has_children: true
redirect_from:
  - <PREVIOUS PAGE DIRECTOR(Y/IES)>
---

# <DOING SOMETHING WITH APP>

_<This is a template for writing a how-to or tutorial page for OpenSearch Dashboard. Introduce the topic here like this:>_

You can use the **<APP>** application in **OpenSearch Dashboards** to <SOMETHING> your OpenSearch <DATA>.

Use the following <PROCEDURES/TUTORIALS> to <SOMETHING> using the **<APP>** application <[AND SAMPLE DATA OR WHATEVER]>.

<OR>

This page describes how to use **<APP>** to:

- <DO SOMETHING>.
- <DO SOMETHING ELSEa>.
- <DO YET A THIRD THING>.
- <IT'S REMARKABLE, THE VERSATILITY OF THIS APP>.


## Understanding <CONCEPTUAL MODEL>

_<If necessary explain and/or link to the concepts necessary to understand and use the application. For example, you might need to explain indexes in depth to explain the Index Management pages. This might be a link to a page outside of the dashboards collection. That's fine; there's no need to duplicate the information if it's the same for both purposes.>_


## Navigating the <APP> UI

_<Show the app here, with UI components labeled. Then use the component names consistently in the instructions.>_

The following components make up the **<APP>** UI.

![<APP UI WITH CALLOUTS>]({{site.url}}{{site.baseurl}}/images/dashboards/APP-WITH-CALLOUTS.png)

- The _navigation panel_ (A) on the left contains the OpenSearch Dashboards applications.
- The _search_ bar (B) enables selection of data using a query language search.
- The _filter_ (C) provides a graphical interface for selecting data values and ranges.
- The _toolbar_ (D) contains frequently used commands and shortcuts.
- The _time filter_ (E) enables selection of data based on a time and date range.
- The _panel_ (F) displays the <APP>. You can <SOMETHING> here.


## Prerequisites

Before using the **<APP>** tool, ensure that you:

- [Install OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards).

- Add sample data or import your own data into OpenSearch. To learn about adding sample datasets, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart/#adding-sample-data). To learn about importing your own data, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/).

- Know how to use the [search bar]({{site.url}}{{site.baseurl}}/dashboards/discover/search-bar/) and the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter/).

- <WHATEVER ELSE IS REQUIRED FOR SUCCESS>


## <DOING SOMETHING>

_<This is the first procedure (or, if more extended, tutorial). Explain it step by numbered step. Do not combine steps, even simple ones. The user might be new to the UI as well as the task. The following steps are examples; use the form, but fill in the appropriate actions and controls.>_

To <DO SOMETHING>, follow these steps:

1. In the <APP CONTROL>, <select/enter> **OpenSearch Dashboards** > **<APP>**.

1. Choose the data you want to work with from <APP CONTROL>. For the examples used in this procedure, choose <`opensearch_dashboards_sample_data_flights`>.

_<The next two steps show the correct way to refer to a graphical icon and a complex control in the UI:>_

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/calendar-icon.png" class="inline-icon" alt="time-select icon"/>{:/} (calendar) icon to <filter the time range of your search>.

1. Change the [time filter]({{site.url}}{{site.baseurl}}/dashboards/discover/time-filter) from **Last 15 minutes** to **Last 1 month**.

1. Select **<WHATEVER IT SAYS ON THE BUTTON TO COMPLETE THE TASK>**.

   The resulting view is shown in the following image.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/define-search.png" alt="Discover interface showing search of flight sample data for Last 7 days"  width="700">

## <DOING THE NEXT THING>

_<AND SO ON>_

## Next steps

_<Give the user a list of logical next steps after completing one or more of these tasks.>_