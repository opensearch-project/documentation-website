---
layout: default
title: Creating detectors
parent: Setting up Security Analytics
nav_order: 15
---

# Creating detectors

Security Analytics provides the options and functionality to monitor and respond to a wide range of security threats. Detectors are the essential components that determine what to look for and how to respond to those threats. This section covers their creation and configuration. 

## Step 1. Defining a detector

Defining a new detector involves naming the detector, selecting a data source and detector type, and specifying a detector schedule. After defining a detector, you can also configure field mappings and set up alerts. Follow the steps in this section to accomplish all three of these setup tasks.

1. On the Detectors page, select the **Create detector** button. The Define detector page opens.
1. Give the detector a name and, as an option, add a description for the detector. 
1. In the Data source section, select the dropdown arrow and select a source for the log data.
1. In the threat detection type section, select the data type. The Sigma security rules associated with the log data are automatically populated in the Detection rules section below it.
<img src="{{site.url}}{{site.baseurl}}/images/Security/detector_rules.png" alt="Selecting threat detector type to auto-populate rules">

    You can skip the next step for mapping rules if you are satisfied with those automatically populated by the system. Otherwise, go to the next step to specify select rules.
    {: .note }

1. In the **Detection rules** section, specify only those rules you want mapped to the detector.
<img src="{{site.url}}{{site.baseurl}}/images/Security/select_rules.png" alt="Select or deselect rules that detector will use for findings">
* Use the toggle to the left of the rule name to select or deselect rules.
* Use the **Log type**, **Rule severity**, and **Source** dropdown menus to filter the rules you want to select from. 
* Use the **Search** bar to search for specific rules.

    To quickly select one or more known rules and dismiss others, first deselect all rules by moving the **rule name** toggle to the left, then search for your target rule names and select each individually by moving its toggle to the right.
    {: .tip }

1. In the **Detector schedule** section, set how often the detector will run. Specify a unit of time and a corresponding number to set the interval.
1. Select the **Next** button in the lower-right corner of the screen to continue. The Configure field mapping page appears.

## Step 2. Making field mappings

Field mapping matches field names for the rule with field names from the log being used to provide data. The mappings are automatically applied once the detector is defined in previous steps. This page offers the user the option to map log-specific field names to the internal rule field names.

For example, if you prefer to have the log field name UserID rather than EventID correspond to the event_uid rule field name, you can use the **Log field name** dropdown menu to select **UserID**.

<img src="{{site.url}}{{site.baseurl}}/images/Security/field_map.png" alt="Rule and log field mapping example">

To make any changes to the automatically populated mappings, use the dropdown arrows across from the rule field names to specify a preferred log field name for the mapping. After completing the mappings, select the **Next** button in the lower-right corner of the screen. The Set up alerts page appears and displays settings for an alert trigger.

## Step 3. Setting up alerts

The third step in creating a detector involves setting up alerts. Alerts are configured to create triggers that, when matched with a set of detection rule criteria, send a notification of a possible security event. You can select the criteria (rules, rule severity, and tags) in any combination to define a trigger. Once a trigger is defined, the alert setup lets you choose the channel on which to be notified and provides options for customizing a message for the notification.

At least one alert condition is required before a detector can begin generating findings.
{: .note }

You can also configure alerts from the Findings window. To see how to set up alerts from the Findings window, see [The findings list]({{site.url}}{{site.baseurl}}/security-analytics/usage/findings/#the-findings-list). A final option for adding additional alerts is to edit a detector and navigate to the **Alert triggers** tab, where you can edit existing alerts as well as add new ones. For details, see [Editing a detector]({{site.url}}{{site.baseurl}}security-analytics/usage/detectors/#editing-a-detector).

To set up an alert for a detector, continue with the following steps:

1. In the **Trigger name** box, enter a name for the trigger.
1. To define rule matches for the alert, select security rules, severity levels, and tags.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/alert_rules.png" alt="Rules used to define an alert">
* Select one rule or multiple rules that will trigger the alert. Put the cursor in the **Rule names** box and type a name to search for it. To remove a rule name, select the **X** beside the name. To remove all rule names, select the **X** beside the dropdown menu's down arrow.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/rule_name_delete.png" alt="Deletes all selected rules">
* Select one or more rule severities as conditions for the alert.
* Select from a list of tags to include as conditions for the alert.
1. To define a notification for the alert, assign an alert severity, select a channel for the notification, and customize a message generated for the alert.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/alert_notify.png" alt="Notification settings for the alert">
* Assign a level of severity for the alert to give the recipient an indication of its urgency.
* Select a channel for the notification. Examples include Slack, Chime, or email. Select the  **Manage channels** link to the right of the field to link the notification to a preferred channel.
* Select the **Show notify message** label to expand message preferences. You can add a subject for the message and a note to inform recipients of the nature of the message.
1. After configuring the conditions in the fields above, select the **Next** button in the lower-right corner of the screen. The Review and create page opens.

After reviewing the specifications for the detector, select the **Create** button in the lower-right corner of the screen to create the detector. The screen returns to the list of all detectors, and the new detector appears in the list.

## What's next

If you are ready to view findings for the new detector, see the [Working with findings]({{site.url}}{{site.baseurl}}/security-analytics/usage/findings/) section. If you would like to import rules or set up custom rules before working with findings, see the [Working with rules]({{site.url}}{{site.baseurl}}/security-analytics/usage/rules/) section. 

