---
layout: default
title: ISM with OpenSearch Dashboards
parent: Index State Management
grand_parent: Managing indexes
nav_order: 30
---


# Index state management with OpenSearch Dashboards

Index state management policies (ISM policies) are configurations you can use to manage the lifecycles of indexes. For general information about ISM, see [Index state management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/).

Policies are state machines. A policy consists of _states_, _actions_, and _transitions_, all of which you define.

1. **States** are possible states of an index, including the default state for new indexes. For example, you might name your states `hot`, `warm`, or `delete`. For more information, see [States]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/#states).

1. **Actions** are operations that you want the policy to perform, for example doing a rollover or force-merging, when an index enters a state. For more information, see [Actions]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/#actions).

1. **Transitions** are conditions that must be met for an index to move into a new state. Transition conditions are typically based on age or file size. For example, "Move an index that is more than 8 weeks old to the `delete` state". For more information, see [Transitions]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/#transitions).

There are no constraints on the configuration of your policies. An index can have any number of states, transition between any two states (or from a state into itself), and specify any number of actions in each state.

For a complete description of policies, see [Policies]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/).

For an example ISM template policy, see [Sample policy with ISM template for auto rollover]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies#sample-policy-with-ism-template-for-auto-rollover).

Policies run periodically by default. This behavior is configurable.


## Viewing an index policy

You can view existing index policies.

To view an index policy, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. In the **Index Management** panel, select **State management policies**.

1. From the **State management policies** table, select the policy you want to look at.

   The page displays the Policy settings, ISM Templates, and States panels.

1. (Optional) To view a state's transitions and actions, expand the state in the States panel by selecting the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-right-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) icon next to the state's name.


## Creating an index policy

To create an index policy, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. From the **Index Management** panel, choose **State management policies**.

1. Select the **Create policy** button at the upper right of the Indexes panel.

    You can use the visual editor or JSON editor to create policies. We recommend using the visual editor to compose new policies. Use the JSON editor to paste an existing policy.

1. In the **Configuration method** dialog, select **Visual editor**.

1. Choose **Continue**.

1. In the **Policy info** panel, name the policy.
   1. In the **Policy ID** field, enter an ID for the policy. The policy ID must be unique, and should be easy to recognize and remember (for example, `hot_cold_workflow`).
   1. (Optional) In the **Description** box, enter the purpose of the policy (for example, `Automatically transition indexes from hot to cold storage based on age`).

1. (Optional) In the **Error notification – _(optional)_** panel, select a channel ID from the **Channel ID** drop-down. See [Error notifications]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies#error-notifications).

   If you're using auto rollovers in your policy, we recommend setting up error notifications. This notifies you of unexpectedly large indexes if rollovers fail.
   {: .note}

1. (Optional) In the **ISM templates – _optional_** panel, configure one or more templates to apply the policy automatically to future indexes. See [Creating ISM templates](#creating-ism-templates).

1. Add states to the index policy.

   In the **States (0)** panel, select **Add state** to create and add states to the policy. See [Adding states to a policy](#adding-states-to-a-policy) for instructions.

   The number in parentheses after **States** shows the number of states currently defined in the policy.
   {: .note}

1. Select the **Create** button in the lower right of the **Create policy** page.

## Adding states to a policy

You create states, which include actions and transitions, as part of the index policy creation process. See [Creating an index policy](#creating-an-index-policy).

To add a state, go to the **States** panel of the **Create policy** page, then follow these steps:

1. In the **State name** field, enter a descriptive name for the state (for example, `hot`, `warm`, `cold`, or `delete`).

1. Under **Order**, define the state's position. (Skip this step when defining the first state of policy.)
   1. Select **Add before** or **Add after**.
   1. Select the state that this position is relative to.

1. (Optional) Define one or more actions for the state.
   1. Select **Add action**.
   1. Select an action from the **Action type** drop-down.
   1. If applicable, enter parameters for the action. For example, for the Snapshot action you must supply a repository and a name for the snapshot.
   1. (Optional) Define timeout and retry settings.
      1. In the **Timeout** box, enter the timeout period for the action; for example, `5h`.
      1. In the **Retry count** combo box, enter the number of retries before the action fails.
      1. In the **Retry backoff** drop-down, select a retry backoff policy.
      1. In the **Retry delay** box, enter the delay between retries; for example, `1d'.
   1. Select the **Add action** button.

   For more information about available actions, see [Actions](https://opensearch.org/docs/im-plugin/ism/policies/#actions).

1. (Optional) In the **Transitions** section, define and add one or more transitions from this state.

   To add a transition, follow these steps:

   1. In the **State** dialog, choose **+ Add Transition**.

   1. In the **Destination state** combo box, enter or select the _target_, the state to transition to.

      A state can transition to itself. To define a state as its own target, enter the state name since it's not in the selection list yet.
      {: .tip}
   
   1. In the **Condition** drop-down, select the trigger condition for the transition.
   1. Enter any parameters required for the condition. For example, the _Minimum Doc Count_ condition requires that you specify the minimum number of documents to trigger the transition.

1. Choose the **Add transition** button to add the transition.

For more information about transitions, see [Transitions](https://opensearch.org/docs/im-plugin/ism/policies/#transitions).

1. To save the completed state, choose the **Save state** button.


## Setting the initial state

To specify which state your policy begins in, follow these steps:

1. In States panel on the Create policy page, Select a state from the **Initial state** dropdown.


## Changing the default policy job interval

See [Settings]({{site.url}}{{site.baseurl}}/im-plugin/ism/settings/).


## Creating ISM templates

An ISM template is an index pattern that ISM uses to apply an index policy to new indexes.

An ISM template has a priority. If more than one ISM template matches an index pattern, ISM uses the priority value to determine which template to apply.

To create one or more ISM templates, follow these steps on the **Create policy** page:

   1. In the **ISM templates - _optional_** panel, select **Add template**.

   1. In the **Index patterns** box, enter an index pattern.

      For example, if you specify a template of `sample-index-*`, the ISM plugin automatically applies this policy to any indexes whose names start with `sample-index-`.

      An index pattern cannot contain any of the following characters: `:`, `"`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`.
      {: .note}

   1. In the Priority combo box, enter or select a priority for the index pattern.

      If more than one ISM template that matches an index pattern, ISM uses the priority value to determine which template to apply.

   1. (Optional) Repeat the previous steps to add more templates.

   For more information about ISM templates, see [Index templates](https://opensearch.org/docs/im-plugin/ism/index/).


## Applying a policy

You can apply a policy to one or more indexes so that the state of the indexes is governed by the policy.

To attach a policy to one or more indexes, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. In the **Index Management** panel, choose **Indexes**.

1. Select the checkboxes of one or more indexes to which you want to apply a policy.

1. Choose **Actions**.

1. From the **Actions** dropdown, select **Apply policy**.

1. In the **Apply policy** dialog, select a policy from the **Policy ID** drop-down.

1. Choose the **Apply** button.

   After you apply a policy to an index, ISM creates a job that runs every 5 minutes by default to perform policy actions, check conditions, and transition the index into different states. To change the default time interval for this job, see [Changing the default policy job interval](#changing-the-default-policy-job-interval).

   Policy jobs do not run if the cluster state is red.
   {: .important}

## Editing an index policy

You can edit an index policy after it is created. The modifications are in force the next time the index policy is applied.

To edit an index policy, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. In the **Index Management** panel, select **State management policies**.

1. From the **State management policies** table, select the policy you want to edit.

1. Select the **Edit** button in the upper right of the policy's viewing page.

1. In the **Configuration method** dialog, choose **Visual editor**.

1. Enter or change the policy features as described in [Creating an index policy](#creating-an-index-policy). 

   You can edit any feature except the policy ID.


## Deleting index policies

You can delete index policies. A deleted policy immediately ceases to apply to any indexes.

Deleted polices are not recoverable.
{: .warning}

To delete one or more index policies, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. From the **Index Management** panel, select State management policies.

1. In the **State management policies** table, select the checkboxes for the policies you want to delete.

1. Choose **Delete** from the upper right of the **Index Management** page.

1. In the Delete confirmation dialog, choose the **Delete** button.


## Next steps

For more information about creating and setting up indexes, see [Core index operations]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/index/).

For more information about managing indexes without policies, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/dash-manage).
