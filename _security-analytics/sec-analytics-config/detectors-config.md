---
layout: default
title: Creating detectors
parent: Setting up security analytics
nav_order: 15
---

# Creating detectors

Creating detectors includes 

### Define the detector

Defining a new detector involves naming the detector, selecting a data source and detector type, and specifying a detector schedule. Follow the steps in this section to define a new detector.

1. On the Detectors page, select the **Create detector** button. The Edit detector page opens.
1. Give the detector a name and, as an option, add a description for the detector. 
1. In the Data source section, select the drop-down arrow and select a source for the log data.
1. In the threat detection type section, select the data type. The Sigma security rules associated with the log data are automatically populated in the Detection rules section below it.

    You can skip the next step for mapping rules if you are satisfied with those automatically populated by the system. Otherwise, go to the next step to specify select rules.
    {: .note }

1. In the **Detection rules** section, specify only those rules you want mapped to the detector. 
Use the toggle to the left of the rule name to select or deselct rules.
Use the **Log type**, **Rule severity**, and **Library** drop-downs to filter the rules you want to select from. 
Use the **Search** bar to search for specific rules.

    To quickly select one or more known rules and dismiss others, first deselect all rules by moving the **rule name** toggle to the left, then search for the target rule names and select each individully by moving its toggle to the right.
    {: .tip }

1. In the **Detector schedule** section, set how often the detector will run. Specify a unit of time and a corresponding number to set the interval.
1. Select the **Next** button at the bottom of the page to continue.

### Field mapping

Field mapping matches field names for the rule with field names from the log being used to provide data. The mappings are automatically applied once the detector is defined in previous steps. This page offers the user the option to map log-specific field names to the internal rule field names.

For example, if a user preferred to have the log field name UserID rather than EventID correspond to the event_uid rule field name, the user would use the **Log field name** drop-down to select **UserID**.

<img src="{{site.url}}{{site.baseurl}}/images/Security/field_map.png" alt="Rule and log field mapping example">

To make any changes to the automatically populated mappings, use the drop-down arrows across from the rule field names to specify a preferred log field name for the mapping. After completing the mappings, select the **Next** button in the bottom of the screen.

### Set up alerts

At this stage, setting up alerts is optional for creating a new detector. Alerts can be configured at any stage of setup, including from the Findings window. This section describes the process for defining the alert conditions during creation of a detector. For the method of setting up an alert from findings, see [Working with findings](#findings).

1. In the **Alert trigger** section, give the alert a trigger name.
1. Under the **if a detection rule matches** heading, select one rule or multiple rules that will trigger the alert. Put the cursor in the Rule names field and type a rule name to search for it. All rules that begin the same will appear as options from the search.
1. Select one or more rule severities as conditions for the alert.
1. Select from a list of tags to include them as conditions for the alert.
1. In the **Alert and notify** section, specify the alert severity that will trigger a notification.
1. Select a channel for the notification. Examples include Slack, Chime, or email. Select the  **Manage channels** link to the right of the field to link the notification to a preferred channel.
1. Select the **Show notify message** label to expand message preferences. You can add a subject for the message and a note to inform recipients of the nature of the message.
1. After configuring the conditions in the fields above, select the **Next** button in the bottom of the screen. The **Review and create** page opens.

After reviewing the specifications for the detector, select the **Create** button in the bottom of the screen to create the detector. The screen returns to the list of all detectors, and the new detector appears in the list.

## What's next

If you are ready to view findings for the new detector, see the [Working with findings](#findings) section. If you would like to set up custom rules before working with findings, see the [Creating rules](#rules) section. 

