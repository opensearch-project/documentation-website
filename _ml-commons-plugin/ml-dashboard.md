---
layout: default
title: Managing ML models in OpenSearch Dashboards
nav_order: 120
redirect_from:
  - /ml-commons-plugin/ml-dashbaord/
---

The ML dashboard was taken out of experimental status and released as Generally Available in OpenSearch 2.9.  
{: .note}

Administrators of machine learning (ML) clusters can use OpenSearch Dashboards to manage and check the status of ML models running inside a cluster. This can help ML developers provision nodes to ensure their models run efficiently.

You can register and deploy models using the API only. For more information, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-serving-framework/).

## Enabling ML in Dashboards

In OpenSearch 2.6, ML functionality is disabled by default. To enable it, you need to edit the configuration in `opensearch_dashboards.yml` and then restart your cluster.

To enable the feature:

1. In your OpenSearch cluster, navigate to your Dashboards home directory; for example, in Docker, `/usr/share/opensearch-dashboards`.
2. Open your local copy of the Dashboards configuration file `opensearch_dashboards.yml`. If you don't have a copy, get one from GitHub: [`opensearch_dashboards.yml`](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/config/opensearch_dashboards.yml).
3. Add the setting `ml_commons_dashboards.enabled:`  to `opensearch_dashboards.yml`. Then, set it to  `ml_commons_dashboards.enabled: true` and save the configuration file.
4. Restart the Dashboards container.
5. Verify that the feature configuration settings were created and configured properly by launching OpenSearch Dashboards. The Machine Learning section should appear under **OpenSearch plugins**.

## Accessing ML functionality in Dashboards

To access ML functionality in OpenSearch Dashboards,select **OpenSearch plugins** > **Machine Learning**. 

<img src="{{site.url}}{{site.baseurl}}/images/ml/ml-dashboard/ml-dashboard.png" alt="Machine Learning section in OpenSearch dashboards">

In the Machine Learning section, you now have access to the **Deployed models** dashboard.

## Deployed models dashboard

The deployed models dashboard gives admins the ability to check the status of any models stored inside your OpenSearch cluster. 

<img src="{{site.url}}{{site.baseurl}}/images/ml/ml-dashboard/deployed-models.png" alt="The deployed models view.">

The dashboard includes the following information about the model:

- **Name**: The name of the model given upon upload.
- **Status**: The number of nodes for which the model responds. 
   - When all nodes are responsive, the status is **Green**.
   - When some nodes are responsive,the status is **Yellow**.
   - When all nodes are unresponsive,the  status is **Red**.
- **Model ID**: The model ID.
- **Action**: What actions you can take with the model.

As of OpenSearch 2.6, the only action available is **View Status Details**, shown in the following image. 

<img src="{{site.url}}{{site.baseurl}}/images/ml/ml-dashboard/view-status-details.png" alt="You can view status details under actions.">

When selected, the Status Details panel appears.

The panel provides the following details inside the panel:

- **Model ID**
- **Model status by node**: The number of nodes for which the model is responsive.

A list of nodes gives you a view of each node the model is running on, including each node’s **Node ID** and status, as shown in the following image. This is useful if you want to use the node's **Node ID** to determine why a node is unresponsive.

<img src="{{site.url}}{{site.baseurl}}/images/ml/ml-dashboard/model-node-details.png" alt="The status of each node running the model.">

## Next steps

For more information about how to manage ML models in OpenSearch, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-serving-framework/).
