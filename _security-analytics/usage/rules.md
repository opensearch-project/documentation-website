---
layout: default
title: Working with rules
parent: Using Security Analytics
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/security-analytics/usage/rules/
---

# Working with rules

The Rules window lists all security rules and provides options for filtering the list and viewing details for each rule. Further options let you import rules and create new rules by first duplicating a Sigma rule then modifying it. This section covers navigation of the Rules page and description of the actions you can perform.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/Rules.png" alt="The Rules page" width="90%">

## Viewing and filtering rules

When you open the Rules page, all rules are listed in the table. Use the search bar to search for specific rules by entering a full or partial name and pressing **Return/Enter** on your keyboard. The list is filtered and displays matching results.

Alternatively, you can use the **Rule type**, **Rule severity**, and **Source** dropdown lists to drill down in the alerts and filter for preferred results. You can select multiple options from each list and use all three in combination to narrow results.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/rule-menu.png" alt="Rule menus for filtering results" width="40%">

### Rule details

To see rule details, select the rule in the Rule name column of the list. The rule details pane opens.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/Rule_details.png" alt="The rule details pane" width="50%">

In Visual view, rule details are arranged in fields, and the links are active. Select **YAML** to display the rule in YAML file format.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/rule_detail_yaml.png" alt="The rule details pane in YAML file view" width="50%">
* Rule details are formatted as a YAML file according to the Sigma rule specification.
* To copy the rule, select the copy icon in the top right corner of the rule. To quickly create a new and customized rule, you can paste the rule into the YAML editor and make any modifications before saving it. See [Customizing rules](#customizing-rules) for details.

## Creating rules

There are several ways to create rules on the Rules page. The first is to manually fill in the necessary fields that complete the rule, using either the Visual Editor or YAML Editor. To do this, select the **Create new rule** button in the uppper-right corner of the Rules window. The Create a rule window opens.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/create-a-rule.png" alt="The Create a rule window, which includes the Visual Editor and YAML editor." width="50%">

If you choose to create the rule manually, you can refer to Sigma's [Rule Creation Guide](https://github.com/SigmaHQ/sigma/wiki/Rule-Creation-Guide) to help understand details for each field.
* By default, the Visual Editor is displayed. Enter the appropriate content in each field and select **Create** in the lower-right corner of the window to save the rule.
* The Create a rule window also provides the YAML Editor so that you can create the rule directly in a YAML file format. Select **YAML Editor** and then enter information for the pre-populated field types.

The alternatives to manually creating a rule, however, simplify and speed up the process. They involve either importing a rule in a YAML file or duplicating an existing rule and customizing it. See the next two sections for detailed steps.


## Importing rules

At this time, Security Analytics supports the import of Sigma rules in YAML format. The following sample file shows the basic formatting of a rule in YAML.

```yml
title: RDP Sensitive Settings Changed
logsource:
  product: windows
  service: system
description: 'Detects changes to RDP terminal service sensitive settings'
detection:
  selection_reg:
  EventType: SetValue
  TargetObject|contains:
    - \services\TermService\Parameters\ServiceDll
    - \Control\Terminal Server\fSingleSessionPerUser
    - \Control\Terminal Server\fDenyTSConnections
    - \Policies\Microsoft\Windows NT\Terminal Services\Shadow
    - \Control\Terminal Server\WinStations\RDP-Tcp\InitialProgram
  condition: selection_reg
level: high
tags:
  - attack.defense_evasion
  - attack.t1112
references:
  - https://blog.menasec.net/2019/02/threat-hunting-rdp-hijacking-via.html
  - https://knowledge.insourcess.com/Supporting_Technologies/Wonderware/Tech_Notes/TN_WW213_How_to_shadow_an_established_RDP_Session_on_Windows_10_Pro
  - https://twitter.com/SagieSec/status/1469001618863624194?t=HRf0eA0W1YYzkTSHb-Ky1A&s=03
  - http://etutorials.org/Microsoft+Products/microsoft+windows+server+2003+terminal+services/Chapter+6+Registry/Registry+Keys+for+Terminal+Services/
falsepositives:
  - Unknown
author:
  - Samir Bousseaden 
  - David ANDRE
status: experimental
```
{% include copy.html %}

1. To begin, select the **Import rule** button in the upper-right corner of the page. The Import rule page opens.
1. Either drag a YAML-formatted Sigma rule into the window or browse for the file by selecting the link and opening it. The Import a rule window opens and the rule definition fields are automatically populated in both the Visual Editor and YAML Editor.
1. Verify or modify the information in the fields.
1. After you confirm the information for the rule is accurate, select the **Create** button in the lower-right corner of the window. A new rule is created, and it appears in the list of rules on the main page of the Rules window.

## Customizing rules

An alternative to importing a rule is duplicating a Sigma rule and then modifying it to create a custom rule. First search for or filter rules in the Rules list to locate the rule you want to duplicate.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/rules-dup1.png" alt="Selecting a rule in the Rules name list" width="75%">

1. To begin, select the rule in the Rule name column. The rule details pane opens.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/rule-dup2.png" alt="Opening the rule details pane" width="50%">
1. Select the **Duplicate** button in the upper-right corner of the pane. The Duplicate rule window opens in Visual Editor view and all of the fields are automatically populated with the rule's details. Details are also populated in YAML Editor view.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/dupe-rule.png" alt="Selecting the duplicate button opens the Duplicate rule window" width="50%">
1. In either Visual Editor view or YAML Editor view, modify any of the fields to customize the rule.
1. After performing any modifications to the rule, select the **Create** button in the lower-right corner of the window. A new and customized rule is created, and it appears in the list of rules on the main page of the Rules window.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/custom-rule.png" alt="The custom rule now appears in the list of rules." width="70%">

You cannot modify the Sigma rule itself. The original Sigma rule always remains in the system. Its duplicate, after modification, becomes the custom rule that is added to the list of rules.
{: .note }

