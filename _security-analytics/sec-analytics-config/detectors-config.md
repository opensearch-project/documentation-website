---
layout: default
title: Creating detectors
parent: Setting up security analytics
nav_order: 15
---

# Creating detectors

Creating detectors includes 

## Define the detector

Defining a new detector involves naming the detector, selecting a data source and detector type, and specifying a detector schedule. You can also create alerts for the detector at this stage, although there are options to create alerts in other areas of the interface. Follow the steps in this section to define a new detector.

1. On the Detectors page, select the **Create detector** button. The Edit detector page opens.
1. Give the detector a name and, as an option, add a description for the detector. 
1. In the Data source section, select the dropdown arrow and select a source for the log data.
1. In the threat detection type section, select the data type. The Sigma security rules associated with the log data are automatically populated in the Detection rules section below it.
<img src="{{site.url}}{{site.baseurl}}/images/Security/detector_rules.png" alt="Selecting threat detector type to auto-populate rules">

    You can skip the next step for mapping rules if you are satisfied with those automatically populated by the system. Otherwise, go to the next step to specify select rules.
    {: .note }

1. In the **Detection rules** section, specify only those rules you want mapped to the detector.
<img src="{{site.url}}{{site.baseurl}}/images/Security/select_rules.png" alt="Select or deselect rules that detector will use for findings">
* Use the toggle to the left of the rule name to select or deselct rules.
* Use the **Log type**, **Rule severity**, and **Library** drop-downs to filter the rules you want to select from. 
* Use the **Search** bar to search for specific rules.

    To quickly select one or more known rules and dismiss others, first deselect all rules by moving the **rule name** toggle to the left, then search for your target rule names and select each individually by moving its toggle to the right.
    {: .tip }

1. In the **Detector schedule** section, set how often the detector will run. Specify a unit of time and a corresponding number to set the interval.
1. Select the **Next** button in the lower-right corner of the screen to continue. The Configure field mapping page appears.

## Field mapping

Field mapping matches field names for the rule with field names from the log being used to provide data. The mappings are automatically applied once the detector is defined in previous steps. This page offers the user the option to map log-specific field names to the internal rule field names.

For example, if you preferr to have the log field name UserID rather than EventID correspond to the event_uid rule field name, you can use the **Log field name** dropdown menu to select **UserID**.

<img src="{{site.url}}{{site.baseurl}}/images/Security/field_map.png" alt="Rule and log field mapping example">

To make any changes to the automatically populated mappings, use the dropdown arrows across from the rule field names to specify a preferred log field name for the mapping. After completing the mappings, select the **Next** button in the lower-right corner of the screen. The Set up alerts page appears.

## Set up alerts

At this stage, setting up alerts is optional for creating a new detector. Alerts can be configured at any stage of setup, including from the Findings window. This section describes the process for defining the alert conditions during creation of a detector. For the method of setting up an alert from findings, see [Working with findings](#findings). 

To skip directly to generating findings from the detector, select the **Remove alert trigger** button and then the **Next** button in the lower-right corner of the screen. Review the detector's definition and then select the **Create** button in the lower-right corner of the screen. The detector is created. 

To setup an alert for the detector at this stage of detector creation, continue with the following steps:

1. In the **Alert trigger** section, give the alert a trigger name.
1. To define rule matches for the alert, select security rules, severity level, and tags. 
<img src="{{site.url}}{{site.baseurl}}/images/Security/alert_rules.png" alt="Rules used to define an alert">
* Select one rule or multiple rules that will trigger the alert. Put the cursor in the Rule names field and type a name to search for it. To remove a rule name, select the **X** beside the name. To remove all rule names, select the **X** beside the dropdown menu's down arrow.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/rule_name_delete.png" alt="Deletes all selected rules">
* Select one or more rule severities as conditions for the alert.
* Select from a list of tags to include as conditions for the alert.
1. To define a notification for the alert, assign an alert severity, select a channel for the notification, and customize a message generated for the alert.
<img src="{{site.url}}{{site.baseurl}}/images/Security/alert_notify.png" alt="Notification settings for the alert">
* Assign a level of severity for the alert that gives the recipient an indication of its urgency.
* Select a channel for the notification. Examples include Slack, Chime, or email. Select the  **Manage channels** link to the right of the field to link the notification to a preferred channel.
* Select the **Show notify message** label to expand message preferences. You can add a subject for the message and a note to inform recipients of the nature of the message.
1. After configuring the conditions in the fields above, select the **Next** button in the bottom of the screen. The Review and create page opens.

After reviewing the specifications for the detector, select the **Create** button in the lower-right corner of the screen to create the detector. The screen returns to the list of all detectors, and the new detector appears in the list.

## What's next

If you are ready to view findings for the new detector, see the [Working with findings](#findings) section. If you would like to set up custom rules before working with findings, see the [Creating rules](#rules) section. 

