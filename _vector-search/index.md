---
layout: default
title: Vector search
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /vector-search/
redirect_from:
  - /vector-search/index/
  - /search-plugins/vector-search/
tutorial_cards:
  - heading: "Get started with vector search"
    description: "Build powerful similarity search applications using your existing vectors or embeddings"
    link: "/vector-search/getting-started/"
  - heading: "Generate embeddings automatically"
    description: "Streamline your vector search using OpenSearch's built-in embedding generation"
    link: "/vector-search/getting-started/auto-generated-embeddings/"
more_cards:
  - heading: "AI search"
    description: "Discover AI search, from <b>semantic</b>, <b>hybrid</b>, and <b>multimodal</b> search to <b>RAG</b>"
    link: "/vector-search/ai-search/"
  - heading: "Tutorials"
    description: "Follow step-by-step tutorials to build AI-powered search for your applications"
    link: "/vector-search/tutorials/"
  - heading: "Advanced filtering"
    description: "Refine search results while maintaining semantic relevance"
    link: "/vector-search/filter-search-knn/"
  - heading: "Memory-efficient search"
    description: "Reduce memory footprint using vector compression methods"
    link: "/vector-search/optimizing-storage/"
  - heading: "Sparse vector support"
    description: "Combine semantic understanding with traditional search efficiency using <b>neural sparse search</b>"
    link: "/vector-search/ai-search/neural-sparse-search/"
  - heading: "Multi-vector support"
    description: "Store and search multiple vectors per document using nested fields"
    link: "/vector-search/specialized-operations/nested-search-knn/"
items:
  - heading: "Create an index"
    description: "Create a vector index for storing your embeddings."
    link: "/vector-search/creating-vector-index/"
  - heading: "Ingest data"
    description: "Ingest your data into the index."
    link: "/vector-search/ingesting-data/"
  - heading: "Search data"
    description: "Use raw vector search or AI-powered methods like semantic, hybrid, multimodal, or neural sparse search. Add RAG to build conversational search."
    link: "/vector-search/searching-data/"
canonical_url: https://docs.opensearch.org/latest/vector-search/
---

# Vector search

OpenSearch [vector search]({{site.url}}{{site.baseurl}}/vector-search/getting-started/vector-search-basics/) provides a complete vector database solution for building efficient AI applications. Store and search vector embeddings alongside your existing data, making it easy to implement semantic search, retrieval-augmented generation (RAG), recommendation systems, and other AI-powered applications.

## Overview

Watch this video to learn about key vector search features in OpenSearch and discover how to use OpenSearch as a vector database through a step-by-step demo.

{% include youtube-player.html id='oX0HMAztP8E' %}

To follow the demo, use these steps.

<details markdown="block">
  <summary>
    Steps
  </summary>
  {: .fs-5 .fw-700}

### Prerequisites
{:.no_toc} 

Download the sample data for this demo:

```bash
wget https://amazon-pqa.s3.amazonaws.com/amazon_pqa_headsets.json
```
{% include copy.html %}

Prepare data for bulk indexing into OpenSearch:

```bash
head -n 5000 amazon_pqa_headsets.json |  awk '{ print "{\"index\":{\"_index\":\"neural_search_pqa\"}}"; print;}'  > neural_search_amazon_pqa_headsets.json
```
{% include copy.html %}

Enable running machine learning (ML) models on data nodes (not recommended for production environments):

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.only_run_on_ml_node": false
  }
}
```
{% include copy-curl.html %}

### Step 1: Register and deploy a model
{:.no_toc} 

Register and deploy an ML model provided by OpenSearch:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
	"name": "huggingface/sentence-transformers/all-distilroberta-v1",
	"version": "1.0.1",
	"model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

Registering a model is an asynchronous task. OpenSearch returns a task ID for this task. Check the status of the task by using the Tasks API:

```json
GET /_plugins/_ml/tasks/<task_id>
```
{% include copy-curl.html %}

Once the task is complete, the task state will change to `COMPLETED` and the Tasks API response will contain a model ID for the registered model. Note the model ID; you'll use it in the following steps.

### Step 2: Create an ingest pipeline 
{:.no_toc} 

Create an ingest pipeline that will generate vector embeddings from text:

```json
PUT _ingest/pipeline/nlp-index-pipeline
{
  "processors" : [
    {
      "text_embedding": {
        "model_id": "<model_id>",
        "field_map": {
          "question_text": "question_vector"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

Test the ingest pipeline:

```json
POST /_plugins/_ml/_predict/text_embedding/<model_id>
{
  "text_docs":[ "what does the package contain?"],
  "return_number": true,
  "target_response": ["sentence_embedding"]
}
```
{% include copy-curl.html %}

### Step 3: Create an index
{:.no_toc} 

Create a vector index and set the default ingest pipeline to the ingest pipeline created in the previous step:

```json
PUT /neural_search_pqa
{
  "settings": {
    "index.knn": true,
    "default_pipeline": "nlp-index-pipeline"
  },
  "mappings": {
    "properties": {
      "question_vector": {
        "type": "knn_vector",
        "dimension": 768
      }
    }
  }
}
```
{% include copy-curl.html %}

### Step 4: Ingest data
{:.no_toc} 

Ingest the data you prepared in the [Prerequisites](#prerequisites) section:

```bash
curl -XPOST -u "<username>:<password>" -k https://localhost:9200/_bulk --data-binary @neural_search_amazon_pqa_headsets.json  -H 'Content-Type: application/json'
```
{% include copy.html %}

If you're not running the Security plugin, omit the username and password:

```bash
curl -XPOST http://localhost:9200/_bulk --data-binary @neural_search_amazon_pqa_headsets.json  -H 'Content-Type: application/json'
```
{% include copy.html %}

Test the vector generation:

```json
GET /neural_search_pqa/_search
```
{% include copy-curl.html %}

### Step 5: Search the data
{:.no_toc} 

Now search the data using the following search methods.

#### Semantic search

To run a semantic search, send the following request:

```json
GET /neural_search_pqa/_search
{
  "size": 5, 
  "query": {
    "neural": {
      "question_vector": {
        "query_text": "what does the package contain?",
        "model_id": "<model_id>",
        "k": 5
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Raw vector search 

To run a raw vector search using test embeddings, send the following request:

<details markdown="block">
  <summary>
    Request
  </summary>

```json
GET /neural_search_pqa/_search
{
  "query": {
    "knn": {
      "question_vector": {
        "vector": [
            0.002710069,
            -0.009941524,
            -0.010563275,
            -0.0010122135,
            -0.01606663,
            0.035004564,
            -0.024301449,
            0.036937017,
            0.0021445795,
            -0.018301377,
            0.028222118,
            0.03426478,
            0.06526259,
            -0.11439706,
            -0.05570727,
            -0.013401183,
            0.07173271,
            -0.008754317,
            -0.003892538,
            -0.04069254,
            -0.007873223,
            0.043676812,
            0.07628463,
            0.006414452,
            0.017962739,
            0.015939584,
            0.0035662137,
            -0.025271492,
            0.0003880734,
            -0.07922912,
            -0.055034645,
            -0.005235041,
            0.016212236,
            -0.0027856824,
            0.015833888,
            -0.008724626,
            0.07955987,
            -0.015250193,
            0.043985505,
            0.0161295,
            0.043298006,
            0.045120195,
            0.0008796525,
            0.025070759,
            0.02620675,
            0.0008109898,
            0.03925882,
            0.0014451992,
            -0.0106107555,
            0.01826351,
            0.03323938,
            -0.045674287,
            -0.0070893173,
            0.022116413,
            -0.04267077,
            -0.07391224,
            -0.007829025,
            -0.027157241,
            0.02210903,
            0.03281591,
            0.03863423,
            0.019042324,
            -0.008937828,
            -0.00822864,
            -0.0013345153,
            -0.012705528,
            0.024063895,
            0.06755618,
            -0.026645413,
            -0.044332504,
            -0.009713288,
            0.07448414,
            -0.037496917,
            -0.059190735,
            0.00071719656,
            0.054966882,
            -0.014735149,
            -0.012903547,
            -0.07329577,
            0.032558594,
            -0.0065674637,
            0.030938147,
            -0.000380445,
            0.03772217,
            0.065343246,
            -0.03851167,
            0.021905331,
            -0.031275578,
            -0.03284647,
            -0.0039149136,
            0.033011954,
            -0.015860643,
            0.056815848,
            0.018801196,
            0.036051515,
            0.030969055,
            -0.06881828,
            -0.07299447,
            0.011791604,
            0.036003478,
            0.085550085,
            -0.030811753,
            0.008854608,
            -0.00115729,
            0.058123615,
            0.031589605,
            -0.04637206,
            0.052185714,
            -0.008147512,
            -0.009668442,
            -0.020753473,
            -0.044140838,
            0.007126401,
            0.018284583,
            0.026957503,
            -0.06066957,
            0.005663597,
            -0.00054079125,
            -0.007547787,
            0.038137276,
            0.029036777,
            -0.050400596,
            -0.04595853,
            0.019300641,
            0.0750706,
            0.06053001,
            0.05319831,
            -0.040328506,
            -0.026151964,
            0.017703054,
            -0.009880278,
            -0.02431335,
            -0.016003195,
            0.017467672,
            -0.028064456,
            0.010797431,
            0.04620068,
            -0.035007767,
            -0.05585064,
            0.053512778,
            0.033208907,
            0.008550426,
            -0.0388121,
            -0.043947462,
            0.041298136,
            0.00632402,
            0.050902393,
            0.025355011,
            0.049950752,
            0.05057344,
            -0.030225132,
            0.068390064,
            0.011451242,
            0.022812577,
            -0.04050082,
            0.04564967,
            0.02095755,
            -0.008775425,
            0.02742215,
            0.0045154644,
            -0.022773914,
            -0.023864053,
            0.048423547,
            -0.02743273,
            0.023161013,
            -0.085432865,
            -0.027781866,
            0.045083255,
            -0.024330953,
            0.051298082,
            -0.014561553,
            0.019947212,
            -0.04762156,
            -0.08161497,
            -0.02915204,
            -0.05000734,
            0.016844928,
            0.06842721,
            -0.07254415,
            0.023711553,
            -0.065741085,
            -0.02294238,
            0.026964355,
            0.023867974,
            -0.036694836,
            0.031053912,
            -0.029109096,
            0.03979944,
            0.0066577485,
            -0.04632492,
            -0.002852599,
            0.104205936,
            -0.0015289283,
            -0.0031528969,
            -0.067211226,
            0.038498618,
            -0.044048615,
            0.07784984,
            -0.00019098066,
            -0.073304884,
            -0.025518911,
            -0.044625603,
            -0.015586972,
            0.029835561,
            0.012194141,
            -0.015629057,
            -0.020035604,
            -0.06611267,
            -0.011576042,
            -0.018833332,
            -0.0058776387,
            0.0015687104,
            0.042071432,
            0.035765655,
            0.036961976,
            -0.06410254,
            0.0069225053,
            0.009306832,
            -0.033220366,
            -0.0011623797,
            -0.05273565,
            -0.05313439,
            0.0040645716,
            0.015500928,
            -0.031550664,
            0.052280493,
            0.0037078348,
            -0.021173084,
            0.0150960395,
            0.078733385,
            0.0028686044,
            -0.005216703,
            -0.0036014854,
            0.050795995,
            -0.041090492,
            -0.04149299,
            -0.042463295,
            0.004432829,
            0.019274198,
            0.02163699,
            -0.009603396,
            -0.0049729077,
            -0.04318596,
            -0.087209016,
            -0.018899467,
            -0.010470672,
            -0.030606175,
            0.002642825,
            0.0075506642,
            0.021283865,
            0.02029468,
            -0.020240186,
            0.021211915,
            0.013999255,
            0.061195884,
            0.04166171,
            -0.052985657,
            -0.025418852,
            0.053535376,
            0.0052670254,
            0.00996464,
            0.022772988,
            -0.0067050382,
            0.011592934,
            0.00048262937,
            0.056712538,
            0.04335854,
            -0.018352322,
            0.021396462,
            -0.062193274,
            -0.07501798,
            -0.043138392,
            0.029762914,
            0.0022764541,
            -0.021794599,
            0.020765148,
            0.09824474,
            -0.0021401478,
            0.07763454,
            -0.0071393973,
            0.048322372,
            -0.0068628914,
            -0.01169711,
            0.0369351,
            0.056131776,
            0.007255264,
            0.014164492,
            0.047250435,
            0.037673194,
            -0.032006253,
            0.0064754435,
            -0.029092291,
            0.10371859,
            -0.04414858,
            -0.04181647,
            0.031237667,
            0.06330435,
            0.0009903753,
            0.015501904,
            -0.043972794,
            -0.07873341,
            -0.034613512,
            0.0045046876,
            0.02307906,
            0.000025955713,
            -0.026988667,
            -0.021876179,
            -0.061864477,
            -0.03174992,
            -0.020722676,
            -0.013450134,
            -0.07542003,
            0.032319948,
            -0.024602456,
            -0.0333397,
            0.012231298,
            0.041405365,
            0.038915142,
            -0.015581544,
            -0.019906731,
            0.05896227,
            -0.041462217,
            -0.017148478,
            0.026938373,
            0.016844902,
            0.04285087,
            -0.017774548,
            0.020407137,
            -0.051100556,
            0.020812236,
            0.07045972,
            -0.0051538153,
            0.0011321488,
            -0.011617311,
            0.022422142,
            -0.118273415,
            0.036936108,
            -0.0006845923,
            -0.020841764,
            -0.03182234,
            0.057517555,
            -0.033479884,
            -0.027451057,
            -0.043103144,
            0.008880055,
            -0.041282106,
            0.055030968,
            -0.04702203,
            0.056501582,
            0.014168417,
            0.02385893,
            -0.015406,
            0.02182121,
            -0.016413651,
            -0.010580059,
            -0.032921027,
            0.0029189822,
            -0.02338612,
            -0.022606278,
            0.04826292,
            -0.004382977,
            0.025545042,
            0.02886143,
            -0.060381353,
            -0.028612776,
            -0.07493492,
            0.00719094,
            0.015079185,
            -0.042235136,
            -0.01738928,
            -0.0015764751,
            0.0080654705,
            0.00045899878,
            0.02290927,
            -0.044065766,
            -0.027154867,
            0.019949641,
            0.024834728,
            0.035529647,
            -0.02206892,
            0.010913105,
            0.010024395,
            -0.029580403,
            0.02561486,
            -0.009437026,
            0.031584535,
            -0.03349992,
            0.017479446,
            0.03321881,
            0.04470709,
            -0.051657267,
            0.014068284,
            0.028261097,
            0.006924192,
            0.015599272,
            0.024204262,
            0.017719362,
            -0.009957364,
            0.042847835,
            -0.023584707,
            0.045098092,
            -0.023444502,
            -0.0037809366,
            -0.03454478,
            0.021056872,
            -0.043912865,
            -0.0390931,
            0.009994628,
            -0.045420606,
            -0.010205209,
            0.0022059593,
            -0.0064243795,
            0.0058772936,
            -0.01227864,
            -0.028449906,
            0.05086825,
            0.011771748,
            0.029447777,
            -0.00488326,
            -0.00972601,
            -0.0038806763,
            0.012304249,
            0.048176277,
            -0.044568717,
            -0.046164848,
            -0.040474243,
            -0.010306429,
            0.0070577585,
            0.050434314,
            -0.047979098,
            -0.032600895,
            0.004446253,
            0.043626312,
            0.006991633,
            -0.008693645,
            0.03655107,
            -0.010262025,
            0.061423175,
            -0.041305497,
            0.049218614,
            0.024470096,
            0.008277926,
            0.023871863,
            -0.0680525,
            -0.01373448,
            -0.019403461,
            0.01457673,
            0.020989386,
            -0.012840103,
            0.04480477,
            -0.012785204,
            0.05274674,
            0.00044528328,
            -0.03250745,
            -0.034448665,
            -0.021306505,
            -0.006346044,
            0.03572138,
            -0.005664647,
            0.007930765,
            0.05546037,
            0.08555072,
            0.0052049863,
            0.005712941,
            0.0069970684,
            -0.07032658,
            -0.021292446,
            -0.043971684,
            0.033561017,
            0.0078121717,
            -0.01232355,
            0.04682774,
            -0.012410457,
            -0.024060972,
            0.026366811,
            0.02424469,
            -0.003813699,
            0.007787949,
            0.030725611,
            -0.018421294,
            0.024292007,
            0.02683838,
            0.018937135,
            0.024167754,
            -0.012694116,
            -0.04747225,
            -0.018581947,
            0.04490841,
            0.010850694,
            0.013474754,
            -0.053915884,
            -0.0157288,
            -0.035485156,
            0.002554162,
            1.9480496e-33,
            0.026267078,
            -0.0005050934,
            0.056276474,
            -0.04939255,
            -0.042061917,
            0.017516103,
            -0.0347885,
            0.0056415154,
            0.028010717,
            0.037564415,
            -0.010455965,
            -0.0016442607,
            0.01223653,
            -0.0033323513,
            0.04782389,
            0.016800124,
            -0.07022924,
            -0.06512625,
            -0.0020572834,
            -0.01184387,
            0.02217141,
            -0.024825176,
            -0.0015173266,
            -0.0269819,
            0.019096063,
            0.017777557,
            0.017873168,
            0.039785545,
            -0.046805847,
            0.021698391,
            -0.06269843,
            0.019622149,
            0.007864404,
            0.008894206,
            0.0038650148,
            0.042388596,
            -0.009941635,
            -0.023884028,
            -0.035126317,
            0.0005930202,
            0.006001224,
            -0.024304975,
            -0.025708912,
            0.04936831,
            0.0016331291,
            -0.040760614,
            0.030479766,
            0.05206152,
            -0.00443369,
            0.10088473,
            0.011507102,
            -0.023531357,
            -0.040234685,
            -0.01877001,
            0.009172026,
            -0.03114441,
            -0.04349409,
            -0.017874151,
            0.034953598,
            -0.008358288,
            0.018915119,
            0.07711077,
            0.023954341,
            0.002415601,
            0.008599011,
            0.010966408,
            0.060247257,
            -0.0024354062,
            0.029591061,
            -0.028959572,
            -0.036631253,
            -0.021705143,
            0.030625504,
            -0.0047654426,
            0.014964073,
            0.037887104,
            0.015323633,
            0.037921626,
            -0.025576469,
            0.055206805,
            -0.029262222,
            -0.01962374,
            -0.03655967,
            0.027075786,
            -0.081109434,
            0.02449199,
            -0.0011163651,
            0.023110788,
            0.027611898,
            0.008880572,
            -0.016672952,
            0.054573104,
            0.0668384,
            0.0016800691,
            -0.026792923,
            -0.007083326,
            -0.02166146,
            -0.05414477,
            0.034420814,
            -0.014911138,
            -0.015938187,
            0.0024109697,
            0.018606238,
            -0.0068018483,
            0.007229771,
            -0.07069912,
            0.005073739,
            -0.02377225,
            0.025782589,
            -0.023521125,
            -0.009433753,
            0.001846642,
            0.039006367,
            0.058460444,
            0.0073873056,
            0.007734639,
            0.04332041,
            -0.02951278,
            -0.025803477,
            0.046294205,
            0.02037022,
            0.017971495,
            -0.07894564,
            0.035865154,
            -0.0019950685,
            0.0058006193,
            -0.016100215,
            -0.032027755,
            -0.015766902,
            0.0036303538,
            0.036353722,
            -0.012345974,
            -0.052974723,
            -0.018639334,
            -0.023760993,
            -0.039711308,
            0.011242891,
            0.019980058,
            0.0056355395,
            -0.034353167,
            0.035260357,
            0.0017268837,
            0.026457984,
            -0.027261587,
            -0.0083769085,
            0.013137794,
            0.06074834,
            -0.03966026,
            0.015282993,
            -0.03137165,
            -0.0018508149,
            0.0006249257,
            -0.088941485,
            -0.016475422,
            -0.061206434,
            0.02161922,
            0.04977918,
            -0.012738911,
            0.029521877,
            0.019252038,
            0.0060790903,
            -0.019414661,
            -0.0037854896,
            0.0035633324,
            0.0012202597,
            -0.0025355266,
            -0.013203971,
            0.03394517,
            0.055446833,
            -0.056813966,
            -0.017438352,
            -0.0025512646,
            0.0015061953,
            -0.014893743,
            0.01575938,
            0.0137350615,
            0.021631295,
            -0.011761018,
            0.003874792,
            -0.033888955,
            0.034087986,
            0.007129588,
            -0.054342985,
            -0.08680173,
            -0.002967837,
            0.025510576,
            0.021943994,
            0.012099311,
            -0.04670378,
            -0.0052654264,
            -0.018963156,
            0.041973554,
            -0.028053606,
            -0.08092634,
            0.01265107,
            -0.054788973,
            0.09400683,
            -0.06417367,
            -0.027034711,
            -0.039408244,
            0.023176627,
            -0.01461873,
            0.03884634,
            -0.036304634,
            -0.017949235,
            -0.057132546,
            0.01646405,
            0.0404744,
            -0.0027004834,
            -0.00041886698,
            -0.0028203563,
            0.008831913,
            -0.0040895687,
            -0.012310025,
            0.05664932,
            0.017413152,
            0.0068459054,
            0.018910537,
            0.019317543,
            0.0020133136,
            -0.017052755,
            0.005844975,
            0.010338119,
            0.020037401,
            0.013349168,
            -0.05482043,
            -0.066234104,
            -0.02689704,
            -0.035874642,
            -0.050699547,
            -0.05060031,
            -0.04085721,
            -0.027676092,
            -0.0981729,
            -0.02701008,
            0.050626777,
            0.04092506,
            0.029677482,
            0.05753057,
            0.10218166,
            0.024896685,
            -0.030231407,
            -0.04353669,
            -0.005995228,
            -0.0033289846,
            0.029730862,
            -0.10618225,
            0.020681499,
            -0.024290795,
            0.022039287,
            0.043326188,
            -0.05395758,
            -0.025439745,
            0.03492537,
            -0.027676322,
            -0.00053507305,
            0.02218165,
            0.09227446,
            -0.023444649,
            -0.06172415,
            0.018731289,
            -0.01790614,
            0.006927564,
            -0.025528973,
            -0.009136651,
            -0.009685557,
            0.017786622,
            0.023883764,
            0.011552316,
            0.06438146,
            0.0033594605,
            0.022067433,
            -0.035531327
          ],
        "k": 5
      }
    }
  }
}
```
{% include copy-curl.html %}
</details>

#### Lexical search

To run a lexical search, send the following request:

```json
GET /neural_search_pqa/_search
{
  "query": {
    "match": {
      "question_text": "what does the package contain?"
    }
  }
}
```
{% include copy-curl.html %}

#### Hybrid search

Create a search pipeline for hybrid search:

```json
PUT /_search/pipeline/hybrid-search-pipeline
{
  "phase_results_processors": [
    {
      "normalization-processor": {
        "normalization": {
          "technique": "min_max"
        },
        "combination": {
          "technique": "arithmetic_mean",
          "parameters": {
            "weights": [
              0.3,
              0.7
            ]
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

Set this pipeline as the default search pipeline for the index:

```json
PUT /neural_search_pqa/_settings
{
  "index.search.default_pipeline": "hybrid-search-pipeline"
}
```
{% include copy-curl.html %}

To run a hybrid search, send the following request:

```json
GET /neural_search_pqa/_search
{
  "_source": "question_text",
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "question_text":"what does the package contain?"
          }
        },
        {
          "neural": {
            "question_vector": {
            "query_text": "what does the package contain?",
            "model_id": "<model_id>",
            "k": 5
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

### Clean up
{:.no_toc} 

Undeploy the model:

```json
POST /_plugins/_ml/models/<model_id>/_undeploy
```
{% include copy-curl.html %}

Delete the model:

```json
DELETE /_plugins/_ml/models/<model_id>
```
{% include copy-curl.html %}

Delete the index:

```json
DELETE /neural_search_pqa
```
{% include copy-curl.html %}

</details>

## Getting started

You can bring your own vectors or let OpenSearch generate embeddings automatically from your data. See [Preparing vectors]({{site.url}}{{site.baseurl}}/vector-search/getting-started/vector-search-options/).
{: .info }

{% include cards.html cards=page.tutorial_cards %}

{% include list.html list_items=page.items%}

<span class="centering-container">
[Get started]({{site.url}}{{site.baseurl}}/vector-search/getting-started/){: .btn-dark-blue}
</span>

## Build your solution 

{% include cards.html cards=page.more_cards %}