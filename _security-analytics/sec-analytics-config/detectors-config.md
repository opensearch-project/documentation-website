---
layout: default
title: Creating detectors
parent: Setting up Security Analytics
nav_order: 15
---

# Creating detectors

Security Analytics provides the options and functionality to monitor and respond to a wide range of security threats. Detectors are the essential components that determine what to look for and how to respond to those threats. This section covers their creation and configuration. 

---
## Step 1. Define a detector

You can define a new detector by naming the detector, selecting a data source and detector type, and specifying a detector schedule. After defining a detector, you can also configure field mappings and set up alerts. Follow the steps in this section to accomplish all three of these setup tasks.

1. On the **Threat detectors** page, choose **Create detector**. The **Define detector** page opens.
1. In **Detector details**, give the detector a name. Adding a description for the detector is optional. 
1. In the **Data source** section, select the dropdown arrow and select one or multiple sources for the log data.
    
    When multiple data sources are selected, the logs must be of the same type. We recommend creating separate detectors for different log types.
    {: .note }
    
1. In the **Log types and rules** section, select the log type for the data source. The system automatically populates the Sigma security rules associated with the log type.
   
   For information about creating your own detection rules, see [Creating detection rules]({{site.url}}{{site.baseurl}}/security-analytics/usage/rules/#creating-detection-rules).
   {: .note }
   
   The following image shows the number of associated rules populated in the **Detection rules** section.

    <img src="{{site.url}}{{site.baseurl}}/images/Security/detector_rules.png" alt="Selecting threat detector type to auto-populate rules" width="85%">
    
    When you select **Network events**, **CloudTrail logs**, or **S3 access logs** as the log type, the system automatically creates a detector dashboard. The dashboard offers visualizations for the detector and can provide security-related insight into log source data. For more information about visualizations, see [Building data visualizations]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/).
    
    You can skip the next step for applying select rules if you are satisfied with those automatically populated by the system. Otherwise, go to the next step to select rules individually.
    {: .note }
    
1. Expand **Detection rules** to show the list of available detection rules for the selected log type. Initially, all rules are selected by default. The following image illustrates this.

    <img src="{{site.url}}{{site.baseurl}}/images/Security/select_rules.png" alt="Select or deselect rules that the detector will use for findings" width="85%">

    * Use the toggle to the left of **Rule name** to select or deselect rules.
    * Use the **Rule severity** and **Source** dropdown lists to filter the rules you want to select from. 
    * Use the **Search** bar to search for specific rules.

    To quickly select one or more known rules and dismiss others, first deselect all rules by turning off the **Rule name** toggle, then search for your target rule names and select each individually by turning its toggle on.
    {: .tip }
    
---
## Step 2. Create field mappings

The field mapping step matches field names from the detector rule with field names from the log index being used to provide data. Creating field mappings allows the system to accurately pass event data from the log to the detector and then use the data to trigger alerts.

The data source (log index), log type, and detection rules specified in the first step determine which fields are available for mapping. For example, when "Windows logs" is selected as the log type, this parameter, along with the specific detection rules, determines the list of detection field names available for the mapping. Similarly, the selected data source determines the list of log source field names that are available for the mapping.

The system uses prepackaged Sigma rules for detector creation. It can automatically map important fields for a specific log type with the corresponding fields in the Sigma rules. The field mapping step presents a view of automatically mapped fields while also providing the option to customize, change, or add new field mappings. When a detector includes customized rules, you can follow this step to manually map detector rule field names to log source field names.

Because the system has the ability to automatically map field names, this step is optional. However, the more fields that can be mapped between detector fields and log source fields, the greater the accuracy of generated findings.

#### A note on field names

If you choose to perform manual field mapping, you should be familiar with the field names in the log index and have an understanding of the data contained in those fields. If you have an understanding of the log source fields in the index, the mapping is typically a straightforward process.

Security Analytics takes advantage of prepackaged Sigma rules for security event detection. Therefore, the field names are derived from a Sigma rule field standard. To make them easier to identify, however, we have created aliases for the Sigma rule fields based on the open-source Elastic Common Schema (ECS) specification. These alias rule field names are the field names used in these steps. They appear in the **Detector field name** column of the mapping tables.

Although the ECS rule field names are largely self-explanatory, you can find predefined mappings of the Sigma rule field names to ECS rule field names, for all supported log types, in the GitHub Security Analytics repository. Navigate to the [OSMappings](https://github.com/opensearch-project/security-analytics/tree/main/src/main/resources/OSMapping) folder and select the file for the specific log type. For example, to see the Sigma rule fields that correspond to ECS rule fields for the Windows log type, select the [`windows_logtype.json` file](https://github.com/opensearch-project/security-analytics/blob/main/src/main/resources/OSMapping/windows_logtype.json). The `raw_field` value in the file represents the Sigma rule field name in the mapping.

#### Amazon Security Lake logs

[Amazon Security Lake](https://docs.aws.amazon.com/security-lake/latest/userguide/what-is-security-lake.html) converts security log and event data to the [Open Cybersecurity Schema Framework](https://docs.aws.amazon.com/security-lake/latest/userguide/open-cybersecurity-schema-framework.html) (OCSF) to normalize combined data and facilitate its management. OpenSearch supports ingestion of log data from Security Lake in the OCSF format, and Security Analytics can automatically map fields from OCSF to ECS (the default field-mapping schema).

The Security Lake log types that can be used as log sources for detector creation include CloudTrail, Route 53, and VPC Flow. Given that Route 53 is a log that captures DNS activity, its log type should be specified as **DNS logs** when [defining a detector](#step-1-define-a-detector). Furthermore, because logs such as CloudTrail can conceivably be captured in both raw format and OCSF, it's good practice to name indexes in a way that keeps these logs separate and easily identifiable. This becomes helpful when specifying an index name in any of the APIs associated with Security Analytics.

To reveal fields for a log index in either raw format or OCSF, use the [Get Mappings View]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/mappings-api/#get-mappings-view) API and specify the index in the `index_name` field of the request.
{: .tip }

### Automatically mapped fields

Once you select a data source and log type, the system attempts to automatically map fields between the log and rule fields. Expand **Automatically mapped fields** to show the list of these mappings. When the field names are similar to one another, the system can successfully match the two, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/Security/automatic-mappings.png" alt="Field mapping example for automatic mappings" width="85%">

Although these automatic matches are normally dependable, it's still a good idea to review the mappings in the **Automatically mapped fields** table and verify that they are correct and matched as expected. If you find a mapping that doesn't appear to be accurate, you can use the dropdown list to search for and select the correct field name. For more on matching field names, see the [Pending field mappings](#pending-field-mappings) section that follows.

### Pending field mappings

The field names that are not automatically mapped appear in the **Pending field mappings** table. In this table you can manually map rule fields to log source fields, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/Security/pending-mappings.png" alt="Field mapping example for pending mappings" width="85%">

While mapping fields, consider the following:
* The **Detector field name** column lists field names based on all of the prepackaged rules associated with the selected log type.
* The **Log source field name** column includes a dropdown list for each of the detector fields. Each dropdown list contains field names extracted from the log index.
* To map a detector field name to a log source field name, use the dropdown arrow to open the list of log source fields and select the log field name from the list. To search for names in the log field list, enter text in the **Select a mapping field** box, as shown in the following image.
  
  <img src="{{site.url}}{{site.baseurl}}/images/Security/log-field.png" alt="Mapping the log field to a detector rule field" width="60%">
  
* Once the log source field name is selected and mapped to the detector field name, the icon in the **Status** column to the right changes from the alert icon to a check mark.
* Make as many matches between field names as possible to complete an accurate mapping for the detector and log source fields.

---
## Step 3. Create a detector schedule

1. In the **Detector schedule** section, set how often the detector will run. Specify a unit of time and a corresponding number to set the interval. The following image shows that the detector runs every 3 minutes.
    
    <img src="{{site.url}}{{site.baseurl}}/images/Security/detector-schedule.png" alt="Detector schedule settings to determine how often the detector runs" width="40%">
    
1. After specifying how often the detector will run, select **Next** in the lower-right corner of the screen. The **Set up alerts** page appears and displays settings for an alert trigger.

---
## Step 4. Set up alerts

The fourth step in creating a detector involves setting up alerts. Alerts are configured to create triggers that, when matched with a set of detection rule criteria, send notifications of possible security events. You can select rule names, rule severity, and tags in any combination to define a trigger. Once a trigger is defined, the alert setup lets you choose the channel on which to be notified and provides options for customizing a message for the notification.

At least one alert condition is required before a detector can begin generating findings.
{: .note }

You can also configure alerts from the **Findings** window. To see how to set up alerts from the **Findings** window, see [The findings list]({{site.url}}{{site.baseurl}}/security-analytics/usage/findings/#the-findings-list). A final option for adding additional alerts is to edit a detector and navigate to the **Alert triggers** tab, where you can edit existing alerts as well as add new ones. For details, see [Editing a detector]({{site.url}}{{site.baseurl}}/security-analytics/usage/detectors/#editing-a-detector).

To set up an alert for a detector, continue with the following steps:

1. In the **Trigger name** box, enter a name for the trigger.
1. To define rule matches for the alert, select security rules, severity levels, and tags.
    
    <img src="{{site.url}}{{site.baseurl}}/images/Security/alert_rules.png" alt="Defining an alert" width="70%">

    * Select one rule or multiple rules that will trigger the alert. Put the cursor in the **Rule names** box and type a name to search for it. To remove a rule name, select the **X** beside the name. To remove all rule names, select the **X** beside the dropdown list's down arrow.

    <img src="{{site.url}}{{site.baseurl}}/images/Security/rule_name_delete.png" alt="Deletes all selected rules" width="45%">

    * Select one or more rule severity levels as conditions for the alert.
    * Select from a list of tags to include as conditions for the alert.

1. To define a notification for the alert, assign an alert severity, select a channel for the notification, and customize a message generated for the alert.

    <img src="{{site.url}}{{site.baseurl}}/images/Security/alert_notify.png" alt="Notification settings for the alert" width="45%">

    * Assign a level of severity for the alert to give the recipient an indication of its urgency.
    * Select a channel for the notification from the **Select channel to notify** dropdown list. Examples include Slack, Chime, or email. To create a new channel, select the **Manage channels** link to the right of the field. The **Channels** page for Notifications opens in a new tab where you can edit and create new channels. For more information about notifications, see the [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/) documentation.
    * Expand **Show notify message** to show message preferences. The message subject and message body are populated with details about the current alert configuration. You can edit these text fields to customize the message. Beneath the message body text box, you can select **Generate message** to populate more details in the message, such as rule names, rule severity levels, and rule tags.
    * Select **Add another alert trigger** to configure an additional alert.

1. After configuring the conditions in the preceding fields, select **Next** in the lower-right corner of the screen. The **Review and create** page opens.

1. Review the specifications for the detector and select **Create detector** in the lower-right corner of the screen. The detector details for the new detector are displayed. When you navigate to the main **Threat detectors** page, the new detector appears in the list.

---
## What's next

If you are ready to view findings for the new detector, see the [Working with findings]({{site.url}}{{site.baseurl}}/security-analytics/usage/findings/) section. If you would like to import rules or set up custom rules before working with findings, see the [Working with rules]({{site.url}}{{site.baseurl}}/security-analytics/usage/rules/) section. 

