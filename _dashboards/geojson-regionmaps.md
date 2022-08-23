---
layout: default
title: Region map visualizations
nav_order: 7
---

# Region map visualizations

OpenSearch Dashboards provides basic map tiles with a standard vector map that you can use to create your region map visualizations. You can configure the base map tiles using the Web Map Service (WMS) map server.

You cannot configure a server to support user-defined vector map layers. However, you can configure your own GeoJSON file and upload it for this purpose. 
{: .note}

OpenSearch also has a standard set of GeoJSON files to provide a vector map with your regional maps.

## Custom vector maps with GeoJSON

If you have a specific locale that is not provided by OpenSearch Dashboards vector maps, such as a US county or US ZIP Code, you can create your own custom vector map with a GeoJSON file. To use this feature, you have to install both the [Dashboards-Maps frontend plugin](https://github.com/opensearch-project/dashboards-maps) and the [OpenSearch Geospatial backend plugin](https://github.com/opensearch-project/geospatial).

GeoJSON format allows you to encode geographic data structures. To learn more about the GeoJSON specification, go to [geojson.org](https://geojson.org/).

You can use [geojson.io](https://geojson.io/#map=2/20.0/0.0) to extract GeoJSON files.
{: .tip}

To create your own custom vector map, upload a JSON file that contains GEO data for your customized regional maps. The JSON file contains vector layers for visualization.

1. Prepare a JSON file to upload. Make sure the file has either a .geojson or .json extension.
1. On the top menu bar, go to **OpenSearch Dashboards > Visualize**.
1. Select the **Create Visualization** button.
1. Select **Region Map**.
1. Choose a source. For example, **[Flights] Flight Log**.
1. In the right panel, select **Import Vector Map**. 
1. In **Upload map**, select or drag and drop your JSON file.
Enter **Map name prefix** (for example, `us-county`). Your map will have the prefix that you defined followed by the `-map` suffix (for example, `us-county-map`). 
Select the **Import file** button. 
Once the upload is successful, you will see a pop-up prompting you to refresh the map. Select the **Refresh** button.

<img src="{{site.url}}{{site.baseurl}}/images/import-vector-map.png" alt="import a Geo .json file" width="380"/>

## Layer options

If you upload a custom GeoJSON file, you can toggle between two layer options: **Default vector map** or **Custom vector map**. To use your custom vector map, follow the steps below.

1. On the top menu bar, go to **OpenSearch Dashboards > Visualize**.
1. Select the **Create Visualization** button.
1. Select **Region Map**.
1. Choose a source. For example, **[Flights] Flight Log**.
1. In the right panel, select **Layer Options**. 
1. In the **Layer settings** section, under **Choose a vector map layer**, select the **Custom vector map** option. In **Vector map**, select the custom map you created. Select the **Update** button.

Under **Layer settings > Style settings**, you may want to increase **Border thickness** to see the borders more clearly.
{: .tip}

### Example GeoJSON file

The following example GeoJSON file provides coordinates for five US counties.

```json
{
  "type": "FeatureCollection",
  "name": "usa counties",
  "features": [
    { "type": "Feature", "properties": { "iso2": "US", "iso3": "KC-WA", "name": "King County", "country": "US", "county": "KC" }, "geometry": { "type": "Polygon", "coordinates":[[[-122.43713378906249,48.57842428752037],[-122.43713378906249,48.57842428752037],[-122.3712158203125,48.26491251331118],[-122.36022949218749,48.14043243818811],[-122.244873046875,48.026672195436014],[-122.2723388671875,47.916342040161155],[-122.4151611328125,47.82053186746053],[-122.4591064453125,47.69867153529717],[-122.398681640625,47.56911375866714],[-122.3272705078125,47.48380086737799],[-122.3382568359375,47.368594345213374],[-122.45361328124999,47.29040793812928],[-122.607421875,47.26804770458176],[-122.574462890625,47.09630525444073],[-122.50305175781249,46.924007100770275],[-122.354736328125,46.86394700508323],[-122.1185302734375,46.856434763486966],[-121.65710449218749,46.89023157359399],[-121.4483642578125,46.976504510552],[-121.3604736328125,47.05515408550348],[-121.28356933593749,47.212105775622426],[-121.2176513671875,47.35371061951363],[-121.0748291015625,47.468949677672484],[-120.9979248046875,47.56540738772852],[-120.9210205078125,47.724544549099676],[-120.8551025390625,48.026672195436014],[-120.87158203125,48.184401125107684],[-120.948486328125,48.37449671682332],[-121.1077880859375,48.542068763606466],[-121.5087890625,48.56388521347092],[-121.87683105468749,48.545705491847464],[-122.06909179687501,48.55297816440071],[-122.3052978515625,48.5493419587775],[-122.43713378906249,48.57842428752037]]] } },
    { "type": "Feature", "properties": { "iso2": "US", "iso3": "SJ-WA", "name": "San Juan County", "country": "US", "county": "SJ" }, "geometry": { "type": "Polygon", "coordinates":[[[-122.96173095703125,48.73807825631017],[-123.04962158203124,48.71452483966837],[-123.1512451171875,48.66012869453836],[-123.19244384765625,48.61656946813302],[-123.17596435546876,48.56206753526866],[-123.14849853515625,48.5275192374508],[-123.07708740234374,48.480204398955145],[-122.98645019531249,48.45653041501911],[-122.8875732421875,48.44195631996267],[-122.8106689453125,48.438312142641244],[-122.78594970703126,48.44560023585716],[-122.78594970703126,48.505687108189804],[-122.78320312499999,48.545705491847464],[-122.79144287109375,48.59477574898104],[-122.77496337890625,48.62383195130112],[-122.7557373046875,48.65105695744785],[-122.73651123046874,48.69821216562637],[-122.84637451171874,48.72358515157852],[-122.96173095703125,48.73807825631017]]] } },
    { "type": "Feature", "properties": { "iso2": "US", "iso3": "WW-WA", "name": "Walla Walla County", "country": "US", "county": "WW" }, "geometry": { "type": "Polygon", "coordinates":[[[-118.33442687988281,46.09204333606358],[-118.34884643554688,46.088709905656856],[-118.37047576904297,46.07561233580712],[-118.38249206542967,46.0653702518009],[-118.3838653564453,46.05298193687039],[-118.3787155151367,46.04416548185682],[-118.3656692504883,46.03558595870985],[-118.35159301757811,46.030818981314766],[-118.33339691162111,46.02819696848244],[-118.3114242553711,46.02938880791639],[-118.29666137695312,46.03201076421151],[-118.2784652709961,46.038922598236],[-118.2722854614258,46.0536967228988],[-118.2619857788086,46.076564991185734],[-118.25752258300781,46.092757616368665],[-118.2630157470703,46.10513700514936],[-118.29288482666016,46.10085214663405],[-118.31794738769531,46.09680503002718],[-118.33442687988281,46.09204333606358]]] } },
    { "type": "Feature", "properties": { "iso2": "US", "iso3": "LA-CA", "name": "Los Angeles County", "country": "US", "county": "LA" }, "geometry": { "type": "Polygon", "coordinates":[[[-118.71826171875,34.07086232376631],[-118.69628906249999,34.03445260967645],[-118.56994628906249,34.02990029603907],[-118.487548828125,33.957030069982316],[-118.37219238281249,33.86129311351553],[-118.45458984375,33.75631505992707],[-118.33923339843749,33.715201644740844],[-118.22937011718749,33.75631505992707],[-118.1414794921875,33.678639851675555],[-117.9107666015625,33.578014746143985],[-117.75146484375,33.4955977448657],[-117.55920410156249,33.55512901742288],[-117.3065185546875,33.5963189611327],[-117.0703125,33.67406853374198],[-116.69677734375,34.06176136129718],[-116.9439697265625,34.28445325435288],[-117.18017578125,34.42956713470528],[-117.3779296875,34.542762387234845],[-117.62512207031251,34.56990638085636],[-118.048095703125,34.615126683462194],[-118.44909667968749,34.542762387234845],[-118.61938476562499,34.38877925439021],[-118.740234375,34.21180215769026],[-118.71826171875,34.07086232376631]]] } },
    { "type": "Feature", "properties": { "iso2": "US", "iso3": "SD-CA", "name": "San Diego County", "country": "US", "county": "SD" }, "geometry": { "type": "Polygon", "coordinates":[[[-117.23510742187501,32.861132322810946],[-117.2406005859375,32.75494243654723],[-117.1636962890625,32.68099643258195],[-117.14172363281251,32.58384932565662],[-117.09228515624999,32.46342595776104],[-117.0538330078125,32.29177633471201],[-116.96044921875,32.194208672875384],[-116.85607910156249,32.16631295696736],[-116.6748046875,32.20350534542368],[-116.3671875,32.319633552035214],[-116.1474609375,32.55144352864431],[-116.1639404296875,32.80574473290688],[-116.4111328125,33.073130945006625],[-116.72973632812499,33.08233672856376],[-117.09228515624999,32.99484290420988],[-117.2515869140625,32.96258644191747]]] } }
  ]
}
```
