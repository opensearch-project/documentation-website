---
layout: default
title: Managing ML models in OpenSearch Dashboards
nav_order: 120
---

Machine Learning in OpenSearch dashboards is an experimental feature released in OpenSearch 2.6. It can't be used in a production environment. For updates on the feature’s progress or to leave feedback on improving the feature, see the [OpenSearch Forum discussion](https://forum.opensearch.org/t/feedback-ml-commons-ml-model-health-dashboard-for-admins-experimental-release/12494).
{: .warning }

Administrators of machine-learning (ML) clusters can use OpenSearch dashboards to manage and check the status of ML models running inside their cluster. This can aid in assisting ML developers with provisioning nodes to make sure their models run efficiently.

As of OpenSearch 2.6, you can only upload models using the API. For more information about how to upload a model to your cluster, see [Upload model to OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-serving-framework#upload-model-to-opensearch)

## Enabling Machine Learning in Dashboards

In OpenSearch 2.6, Machine Learning is disabled by default. To enable it, you need to edit the configuration in `opensearch_dashboards.yml` and then restart you cluster.

To enable the feature:

1. In your OpenSearch cluster, navigate to your Dashboards home directory; for example, in Docker, `/usr/share/opensearch-dashboards`.
2. Open your local copy of the Dashboards configuration file, `opensearch_dashboards.yml`. If you don't have a copy, get one from GitHub: [`opensearch_dashboards.yml`](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/config/opensearch_dashboards.yml).
3. Add the setting `ml_commons_dashboards.enabled:` and set it to  `ml_commons_dashboards.enabled: true` and save the configuration.
4. Restart the Dashboards container.
5. Verify the feature configuration settings were created and configured properly by connecting launching OpenSearch Dashboards. The Machine Learning section should appear under **OpenSearch plugins**.

## Accessing Machine Learning in Dashboards

To access Machine Learning in OpenSearch Dashboards,select **OpenSearch plugins** > **Machine Learning**. 

<img src="{{site.url}}{{site.baseurl}}/images/ml/ml-dashboard/ml-dashboard.png" alt="Machine Learning section in OpenSearch dashboards">

Inside the Machine Learning section, you now have access to the **Deployed models** dashboard.

## Deployed models dashboard

The model health dashboards give admins the ability to check the status of any models stored inside your OpenSearch cluster. 

<img src="{{site.url}}{{site.baseurl}}/images/ml/ml-dashboard/deployed-models.png" alt="The deployed models view.">

The dashboard includes the following information about the model:

- **Name**: The name of the model given upon upload.
- **Status**: The number of nodes for which the model is responsive. 
   - When all nodes are responsive, status is **Green**.
   - When some nodes are responsive, status is **Yellow**.
   - When all nodes are unresponsive, status is **Red**.
- **Model ID**: The model ID.
- **Action**: What actions you can take with the model.

As of OpenSearch 2.6, the only action available is **View Status Details**. 

<img src="{{site.url}}{{site.baseurl}}/images/ml/ml-dashboard/view-status-details.png" alt="You can view status details under actions.">

When selected, the Status Details panel appears.

You can see the following details inside the panel:

- **Model ID**
- **Model status by node**: The number of nodes for which the model is responsive.

A list of nodes gives you a view of each node the model is running on, including each node’s **Node ID** and responsiveness. This is useful if you want to use the node's **Node ID** to track why the node is unresponsive in your cluster.

<img src="{{site.url}}{{site.baseurl}}/images/ml/ml-dashboard/model-node-details.png" alt="The status of each node running the model.">

## Next steps

For more information about how manage models in OpenSearch, see the [Model-serving framework]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-serving-framework/).
