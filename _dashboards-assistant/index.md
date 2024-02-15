---
layout: default
title: OpenSearch Assistant for OpenSearch Dashboards
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /dashboards-assistant/
redirect_from:
  - /dashboards-assistant/index/
---

This is an experimental feature and is not recommended for use in a production environment. For updates on the feature's progress or to leave feedback, go to the [`dashboards-assistant` repository](https://github.com/opensearch-project/dashboards-assistant) on GitHub or the associated [OpenSearch forum thread](https://forum.opensearch.org/t/feedback-opensearch-assistant/16741).
{: .warning}

For more information about ways to enable experimental features, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).
{: .note}
{: .warning}

# OpenSearch Assistant for OpenSearch Dashboards
Introduced 2.12
{: .label .label-purple }

The [OpenSearch Assistant toolkit](<insert-ML-cross-ref-link>) helps you create AI-powered assistants for OpenSearch Dashboards without requiring specialized query tools or skills.

## Enabling OpenSearch Assistant

To enable **OpenSearch Assistant** in OpenSearch Dashboards, locate your copy of the `opensearch_dashboards.yml` file and set the following option:
```
assistant.chat.enabled: true
```
{% include copy-curl.html %}
Then configure the root `agent_id` through the following API:
```
PUT .plugins-ml-config/_doc/os_chat
{
    "type":"os_chat_root_agent",
    "configuration":{
        "agent_id": "your root agent id"
    }
}
```
{% include copy-curl.html %}
Next, restart the OpenSearch Dashboards server. Following a successful restart, **OpenSearch Assistant** should appear in the top-right corner of the OpenSearch Dashboards interface. An example view is shown in the following image.

<img width="450px" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/entry.png" alt="OpenSearch Assistant icon">

## Configuring the plugin
Go to the [Flow Framework plugin](https://github.com/opensearch-project/flow-framework) documentation to get the default chatbot template. You can modify this template to use your own model and customize the chatbot tools. Go to the [Getting started guide](https://github.com/opensearch-project/dashboards-assistant/blob/main/GETTING_STARTED_GUIDE.md) for step-by-step instructions. 

## Using OpenSearch Assistant in OpenSearch Dashboards
### Start the conversation

You can start the conversation by clicking the input box, or use hot key `ctrl + /` to start typing your first question.

<img width="450px" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/start-conversation.png" alt="Start the conversation">

Then pressing `Enter`, you will see the conversation dialog pops up, and the assistant starts to generating response for the question and after a while:

<img width="400px" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/response.png" alt="The assistant response">

### Regenerate a response
Under the response, the second from the left is regenerate button, click it will regenerate answer for the same question. The previous answer will be replaced with the new answer both on the UI and chat history.

### The suggestions by the assistant
Under the response, we also provide suggestions that we think user may be interested to ask. User can click one of them to see the response.

<img width="600px" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/suggestions.png" alt="The assistant suggestions">

### Rate the response
Each response contains a thumb up and thumb down icon button, you can click on the button to feedback whether you are satisfied with the response.

<img width="600px" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/rate.png" alt="Rate the response">

### See how the response was generated
Under the available suggestions, there will be a link “How was this generated?”, click this link will show which tools are triggered to generate this response. It can be used for trouble shooting. There could be multiple steps if multiple tools are involved. Each step will display tool name with input and output of the tool.

<img width="400px" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/traces.png" alt="How was the response generated">

### Continue with a past conversation
#### View past conversation
Click the clock icon to open the conversation history panel. The clock icon will become active status and conversations will be displayed clicked after clicked.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/conversation-history-entry.png" alt="Show conversation history">

Search conversations by title:

<img src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/conversation-history-list.png" alt="List of conversations">

#### Manage past conversation
Click the pencil icon to edit conversation name, type the new conversation name in the below input, then click “Confirm name” button. The new conversation name will be saved.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/edit-conversation-title.png" alt="Edit the conversation title">

Click the trash icon to delete conversation, the delete confirmation modal will be displayed after clicked. Click the “Delete conversation” button to confirm the conversation delete operation. The conversation will be deleted after “Delete conversation” button clicked.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/delete-conversation.png" alt="Delete the conversation">

### Sharing a conversation through Notebooks

Click `Save to notebook` button to save your conversation to notebook. All messages between you and LLM model will be saved to observability notebook after entering name for notebook and confirm.

<img width="400px" src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/save-conversation-to-notebook.png" alt="Save a conversation to notebook">

Now you can find your conversation in observability notebook lists and others can see it as well.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards-assistant/conversation-in-notebook.png" alt="Conversation saved to notebook">
