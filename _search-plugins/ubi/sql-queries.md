---
layout: default
title: Sample UBI SQL queries
parent: User Behavior Insights
has_children: false
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/search-plugins/ubi/sql-queries/
---

# Sample UBI SQL queries

You can run sample User Behavior Insights (UBI) SQL queries through the OpenSearch Dashboards [Query Workbench]({{site.url}}{{site.baseurl}}/dashboards/query-workbench/).

## Queries with zero results

Queries can be executed on events on either the queries index (`ubi_queries`) or events index (`ubi_events`).

### Server-side queries

A UBI-enabled search server logs the queries and their results as they are made, so in order to find all queries with *no* results, search for empty `query_response_hit_ids`:

```sql
select
   count(*)
from ubi_queries 
where query_response_hit_ids is null

```

### Client-side events

Although it's relatively straightforward to find queries with no results on the server side, you can also get the same result by querying the *event attributes* that were logged on the client side.
Both client- and server-side queries return the same results. Use the following query to search for queries with no results: 

```sql
select
    count(0)
from ubi_events
where event_attributes.result_count > 0
```




## Trending queries

Trending queries can be found by using either of the following queries.

### Server-side

```sql
select 
	user_query, count(0) Total  
from ubi_queries
group by user_query
order by Total desc
```

### Client-side

```sql
select 
	message, count(0) Total  
from ubi_events
where 
	action_name='on_search' 
group by message 
order by Total desc
```

Both queries return the distribution of search strings, as shown in the following table.

Message|Total
|---|---|
User Behavior Insights|127
best Laptop|78
camera|21
backpack|17
briefcase|14
camcorder|11
cabinet|9
bed|9
box|8
bottle|8
calculator|8
armchair|7
bench|7
blackberry|6
bathroom|6
User Behavior Insights Mac|5
best Laptop Dell|5
User Behavior Insights VTech|5
ayoolaolafenwa|5
User Behavior Insights Dell|4
best Laptop Vaddio|4
agrega modelos intuitivas|4
bеуоnd|4
abraza metodologías B2C|3



## Event type distribution counts

To create a pie chart widget visualizing the most common events, run the following query:

```sql
select 
	action_name, count(0) Total  
from ubi_events
group by action_name
order by Total desc
```

The results include a distribution across actions, as shown in the following table.

action_name|Total
|---|---|
on_search|5425
brand_filter|3634
global_click|3571
view_search_results|3565
product_sort|3558
type_filter|3505
product_hover|820
item_click|708
purchase|407
declined_product|402
add_to_cart|373
page_exit|142
user_feedback|123
404_redirect|123

The following query shows the distribution of margins across user actions:


```sql
select 
    action_name, 
    count(0) total,
    AVG( event_attributes.object.object_detail.cost ) average_cost,
    AVG( event_attributes.object.object_detail.margin ) average_margin
from ubi_events  
group by action_name
order by average_cost desc
```

The results include actions and the distribution across average costs and margins, as shown in the following table.

action_name|total|average_cost|average_margin
---|---|---|---
declined_product|395|8457.12|6190.96
item_click|690|7789.40|5862.70
add_to_cart|374|6470.22|4617.09
purchase|358|5933.83|5110.69
global_click|3555||
product_sort|3711||
product_hover|779||
page_exit|107||
on_search|5438||
brand_filter|3722||
user_feedback|120||
404_redirect|110||
view_search_results|3639||
type_filter|3691||

## Sample search journey

To find a search in the query log, run the following query:

```sql
select
  client_id, query_id, user_query, query_response_hit_ids, query_response_id, timestamp 
from ubi_queries where query_id = '7ae52966-4fd4-4ab1-8152-0fd0b52bdadf'
```

The following table shows the results of the preceding query.

client_id|query_id|user_query|query_response_hit_ids|query_response_id|timestamp
---|---|---|---|---|---
a15f1ef3-6bc6-4959-9b83-6699a4d29845|7ae52966-4fd4-4ab1-8152-0fd0b52bdadf|notebook|0882780391659|6e92c90c-1eee-4dd6-b820-c522fd4126f3|2024-06-04 19:02:45.728

The `query` field in `query_id` has the following nested structure:

```json
{
	"query": {
		"size": 25,
		"query": {
			"query_string": {
				"query": "(title:\"notebook\" OR attr_t_device_type:\"notebook\" OR name:\"notebook\")",
				"fields": [],
				"type": "best_fields",
				"default_operator": "or",
				"max_determinized_states": 10000,
				"enable_position_increments": true,
				"fuzziness": "AUTO",
				"fuzzy_prefix_length": 0,
				"fuzzy_max_expansions": 50,
				"phrase_slop": 0,
				"analyze_wildcard": false,
				"escape": false,
				"auto_generate_synonyms_phrase_query": true,
				"fuzzy_transpositions": true,
				"boost": 1.0
			}
		},
		"ext": {
			"query_id": "7ae52966-4fd4-4ab1-8152-0fd0b52bdadf",
			"user_query": "notebook",
			"client_id": "a15f1ef3-6bc6-4959-9b83-6699a4d29845",
			"object_id_field": "primary_ean",
			"query_attributes": {
				"application": "ubi-demo"
			}
		}
	}
}
```

In the event log, `ubi_events`, search for the events that correspond to the preceding query (whose query ID is `7ae52966-4fd4-4ab1-8152-0fd0b52bdadf`):

```sql
select 
 application, query_id, action_name, message_type, message, client_id, timestamp
from ubi_events
where query_id = '7ae52966-4fd4-4ab1-8152-0fd0b52bdadf'
order by timestamp
```

<!-- vale off -->

The results include all events associated with the user's query, as shown in the following table.

application|query_id|action_name|message_type|message|client_id|timestamp
---|---|---|---|---|---|---
ubi-demo|7ae52966-4fd4-4ab1-8152-0fd0b52bdadf|on_search|QUERY|notebook|a15f1ef3-6bc6-4959-9b83-6699a4d29845|2024-06-04 19:02:45.777
ubi-demo|7ae52966-4fd4-4ab1-8152-0fd0b52bdadf|product_hover|INFO|orquesta soluciones uno-a-uno|a15f1ef3-6bc6-4959-9b83-6699a4d29845|2024-06-04 19:02:45.816
ubi-demo|7ae52966-4fd4-4ab1-8152-0fd0b52bdadf|item_click|INFO|innova relaciones centrado al usuario|a15f1ef3-6bc6-4959-9b83-6699a4d29845|2024-06-04 19:02:45.86
ubi-demo|7ae52966-4fd4-4ab1-8152-0fd0b52bdadf|add_to_cart|CONVERSION|engineer B2B platforms|a15f1ef3-6bc6-4959-9b83-6699a4d29845|2024-06-04 19:02:45.905
ubi-demo|7ae52966-4fd4-4ab1-8152-0fd0b52bdadf|purchase|CONVERSION|Purchase item 0884420136132|a15f1ef3-6bc6-4959-9b83-6699a4d29845|2024-06-04 19:02:45.913

<!-- vale on -->


## User sessions

To find more of the same user's sessions (with the client ID `a15f1ef3-6bc6-4959-9b83-6699a4d29845`), run the following query:

```sql
select
 application, event_attributes.session_id, query_id, 
 action_name, message_type, event_attributes.dwell_time,
 event_attributes.object.object_id, 
 event_attributes.object.description,
 timestamp
from ubi_events
where client_id = 'a15f1ef3-6bc6-4959-9b83-6699a4d29845'
order by query_id, timestamp
```

The results are truncated to show a sample of sessions, as shown in the following table.


application|event_attributes.session_id|query_id|action_name|message_type|event_attributes.dwell_time|event_attributes.object.object_id|event_attributes.object.description|timestamp
---|---|---|---|---|---|---|---|---
ubi-demo|00731779-e290-4709-8af7-d495ae42bf48|0254a9b7-1d83-4083-aa46-e12dff86ec98|on_search|QUERY|46.6398|||2024-06-04 19:06:36.239
ubi-demo|00731779-e290-4709-8af7-d495ae42bf48|0254a9b7-1d83-4083-aa46-e12dff86ec98|product_hover|INFO|53.681877|0065030834155|USB 2.0 S-Video and Composite Video Capture Cable|2024-06-04 19:06:36.284
ubi-demo|00731779-e290-4709-8af7-d495ae42bf48|0254a9b7-1d83-4083-aa46-e12dff86ec98|item_click|INFO|40.699997|0065030834155|USB 2.0 S-Video and Composite Video Capture Cable|2024-06-04 19:06:36.334
ubi-demo|00731779-e290-4709-8af7-d495ae42bf48|0254a9b7-1d83-4083-aa46-e12dff86ec98|declined_product|REJECT|5.0539055|0065030834155|USB 2.0 S-Video and Composite Video Capture Cable|2024-06-04 19:06:36.373
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|on_search|QUERY|26.422775|||2024-06-04 19:04:40.832
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|on_search|QUERY|17.1094|||2024-06-04 19:04:40.837
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|brand_filter|FILTER|40.090374|OBJECT-6c91da98-387b-45cb-8275-e90d1ea8bc54|supplier_name|2024-06-04 19:04:40.852
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|type_filter|INFO|37.658962|OBJECT-32d9bb39-b17d-4611-82c1-5aaa14368060|filter_product_type|2024-06-04 19:04:40.856
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|product_sort|SORT|3.6380951|||2024-06-04 19:04:40.923
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|view_search_results|INFO|46.436115|||2024-06-04 19:04:40.942
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|view_search_results|INFO|46.436115|||2024-06-04 19:04:40.959
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|type_filter|INFO|37.658962|OBJECT-32d9bb39-b17d-4611-82c1-5aaa14368060|filter_product_type|2024-06-04 19:04:40.972
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|brand_filter|FILTER|40.090374|OBJECT-6c91da98-387b-45cb-8275-e90d1ea8bc54|supplier_name|2024-06-04 19:04:40.997
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|type_filter|INFO|37.658962|OBJECT-32d9bb39-b17d-4611-82c1-5aaa14368060|filter_product_type|2024-06-04 19:04:41.006
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|product_sort|SORT|3.6380951|||2024-06-04 19:04:41.031
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|product_sort|SORT|3.6380951|||2024-06-04 19:04:41.091
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|type_filter|INFO|37.658962|OBJECT-32d9bb39-b17d-4611-82c1-5aaa14368060|filter_product_type|2024-06-04 19:04:41.164
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|brand_filter|FILTER|40.090374|OBJECT-6c91da98-387b-45cb-8275-e90d1ea8bc54|supplier_name|2024-06-04 19:04:41.171
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|view_search_results|INFO|46.436115|||2024-06-04 19:04:41.179
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|global_click|INFO|42.45651|OBJECT-d350cc2d-b979-4aca-bd73-71709832940f|(96, 127)|2024-06-04 19:04:41.224
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|view_search_results|INFO|46.436115|||2024-06-04 19:04:41.24
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|view_search_results|INFO|46.436115|||2024-06-04 19:04:41.285
ubi-demo|844ca4b5-b6f8-4f7b-a5ec-7f6d95788e0b|0cf185be-91a8-49cf-9401-92ad079ce43b|global_click|INFO|42.45651|OBJECT-d350cc2d-b979-4aca-bd73-71709832940f|(96, 127)|2024-06-04 19:04:41.328
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|on_search|QUERY|52.721157|||2024-06-04 19:03:50.8
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|view_search_results|INFO|26.600422|||2024-06-04 19:03:50.802
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|product_sort|SORT|14.839713|||2024-06-04 19:03:50.875
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|brand_filter|FILTER|20.876852|OBJECT-6c91da98-387b-45cb-8275-e90d1ea8bc54|supplier_name|2024-06-04 19:03:50.927
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|type_filter|INFO|15.212905|OBJECT-32d9bb39-b17d-4611-82c1-5aaa14368060|filter_product_type|2024-06-04 19:03:50.997
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|view_search_results|INFO|26.600422|||2024-06-04 19:03:51.033
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|global_click|INFO|11.710514|OBJECT-d350cc2d-b979-4aca-bd73-71709832940f|(96, 127)|2024-06-04 19:03:51.108
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|product_sort|SORT|14.839713|||2024-06-04 19:03:51.144
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|global_click|INFO|11.710514|OBJECT-d350cc2d-b979-4aca-bd73-71709832940f|(96, 127)|2024-06-04 19:03:51.17
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|brand_filter|FILTER|20.876852|OBJECT-6c91da98-387b-45cb-8275-e90d1ea8bc54|supplier_name|2024-06-04 19:03:51.205
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|type_filter|INFO|15.212905|OBJECT-32d9bb39-b17d-4611-82c1-5aaa14368060|filter_product_type|2024-06-04 19:03:51.228
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|product_sort|SORT|14.839713|||2024-06-04 19:03:51.232
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|type_filter|INFO|15.212905|OBJECT-32d9bb39-b17d-4611-82c1-5aaa14368060|filter_product_type|2024-06-04 19:03:51.292
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|2071e273-513f-46be-b835-89f452095053|type_filter|INFO|15.212905|OBJECT-32d9bb39-b17d-4611-82c1-5aaa14368060|filter_product_type|2024-06-04 19:03:51.301
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|23f0149a-13ae-4977-8dc9-ef61c449c140|on_search|QUERY|16.93674|||2024-06-04 19:03:50.62
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|23f0149a-13ae-4977-8dc9-ef61c449c140|global_click|INFO|25.897957|OBJECT-d350cc2d-b979-4aca-bd73-71709832940f|(96, 127)|2024-06-04 19:03:50.624
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|23f0149a-13ae-4977-8dc9-ef61c449c140|product_sort|SORT|44.345097|||2024-06-04 19:03:50.688
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|23f0149a-13ae-4977-8dc9-ef61c449c140|brand_filter|FILTER|19.54417|OBJECT-6c91da98-387b-45cb-8275-e90d1ea8bc54|supplier_name|2024-06-04 19:03:50.696
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|23f0149a-13ae-4977-8dc9-ef61c449c140|type_filter|INFO|48.79312|OBJECT-32d9bb39-b17d-4611-82c1-5aaa14368060|filter_product_type|2024-06-04 19:03:50.74
ubi-demo|33bd0ee2-60b7-4c25-b62c-1aa1580da73c|23f0149a-13ae-4977-8dc9-ef61c449c140|brand_filter|FILTER|19.54417|OBJECT-6c91da98-387b-45cb-8275-e90d1ea8bc54|supplier_name|2024-06-04 19:03:50.802


## List user sessions for users who logged out without submitting any queries

The following query searches for users who don't have an associated `query_id`. Note that this may happen if the client side does not pass the returned query to other events.

```sql
select 
    client_id, session_id, count(0) EventTotal
from ubi_events
where action_name='logout' and query_id is null
group by client_id, session_id
order by EventTotal desc
```

<!-- vale off -->

The following table shows the client ID, session ID, and that there was 1 event,`logout`. 

client_id|session_id|EventTotal
---|---|---
100_15c182f2-05db-4f4f-814f-46dc0de6b9ea|1c36712c-44b8-4fdd-8f0d-fdfeab5bd794_1290|1
175_e5f262f1-0db3-4948-b349-c5b95ff31259|816f94d6-8966-4a8b-8984-a2641d5865b2_2251|1
175_e5f262f1-0db3-4948-b349-c5b95ff31259|314dc1ff-ef38-4da4-b4b1-061f62dddcbb_2248|1
175_e5f262f1-0db3-4948-b349-c5b95ff31259|1ce5dc30-31bb-4759-9451-5a99b28ba91b_2255|1
175_e5f262f1-0db3-4948-b349-c5b95ff31259|10ac0fc0-409e-4ba0-98e9-edb323556b1a_2249|1
174_ab59e589-1ae4-40be-8b29-8efd9fc15380|dfa8b38a-c451-4190-a391-2e1ec3c8f196_2228|1
174_ab59e589-1ae4-40be-8b29-8efd9fc15380|68666e11-087a-4978-9ca7-cbac6862273e_2233|1
174_ab59e589-1ae4-40be-8b29-8efd9fc15380|5ca7a0df-f750-4656-b9a5-5eef1466ba09_2234|1
174_ab59e589-1ae4-40be-8b29-8efd9fc15380|228c1135-b921-45f4-b087-b3422e7ed437_2236|1
173_39d4cbfd-0666-4e77-84a9-965ed785db49|f9795e2e-ad92-4f15-8cdd-706aa1a3a17b_2206|1
173_39d4cbfd-0666-4e77-84a9-965ed785db49|f3c18b61-2c8a-41b3-a023-11eb2dd6c93c_2207|1
173_39d4cbfd-0666-4e77-84a9-965ed785db49|e12f700c-ffa3-4681-90d9-146022e26a18_2210|1
173_39d4cbfd-0666-4e77-84a9-965ed785db49|da1ff1f6-26f1-49d4-bd0d-d32d199e270e_2208|1
173_39d4cbfd-0666-4e77-84a9-965ed785db49|a1674e9d-d2dd-4da9-a4d1-dd12a401e8e7_2216|1
172_875f04d6-2c35-45f4-a8ac-bc5b675425f6|cc8e6174-5c1a-48c5-8ee8-1226621fe9f7_2203|1
171_7d810730-d6e9-4079-ab1c-db7f98776985|927fcfed-61d2-4334-91e9-77442b077764_2189|1
16_581fe410-338e-457b-a790-85af2a642356|83a68f57-0fbb-4414-852b-4c4601bf6cf2_156|1
16_581fe410-338e-457b-a790-85af2a642356|7881141b-511b-4df9-80e6-5450415af42c_162|1
16_581fe410-338e-457b-a790-85af2a642356|1d64478e-c3a6-4148-9a64-b6f4a73fc684_158|1

<!-- vale on -->

You may want to identify users who logged out multiple times without submitting a query. The following query lets you see which users do this the most:

```sql
select 
    client_id, count(0) EventTotal
from ubi_events
where action_name='logout' and query_id is null
group by client_id
order by EventTotal desc
```

The following table shows user client IDs and the number of logouts without any queries.

client_id|EventTotal
---|---
87_5a6e1f8c-4936-4184-a24d-beddd05c9274|8
127_829a4246-930a-4b24-8165-caa07ee3fa47|7
49_5da537a3-8d94-48d1-a0a4-dcad21c12615|6
56_6c7c2525-9ca5-4d5d-8ac0-acb43769ac0b|6
140_61192c8e-c532-4164-ad1b-1afc58c265b7|6
149_3443895e-6f81-4706-8141-1ebb0c2470ca|6
196_4359f588-10be-4b2c-9e7f-ee846a75a3f6|6
173_39d4cbfd-0666-4e77-84a9-965ed785db49|5
52_778ac7f3-8e60-444e-ad40-d24516bf4ce2|5
51_6335e0c3-7bea-4698-9f83-25c9fb984e12|5
175_e5f262f1-0db3-4948-b349-c5b95ff31259|5
61_feb3a495-c1fb-40ea-8331-81cee53a5eb9|5
181_f227264f-cabd-4468-bfcc-4801baeebd39|5
185_435d1c63-4829-45f3-abff-352ef6458f0e|5
100_15c182f2-05db-4f4f-814f-46dc0de6b9ea|5
113_df32ed6e-d74a-4956-ac8e-6d43d8d60317|5
151_0808111d-07ce-4c84-a0fd-7125e4e33020|5
204_b75e374c-4813-49c4-b111-4bf4fdab6f26|5
29_ec2133e5-4d9b-4222-aa7c-2a9ae0880ddd|5
41_f64abc69-56ea-4dd3-a991-7d1fd292a530|5
