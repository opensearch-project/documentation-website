---
layout: default
title: UBI queries with sql
parent: User behavior insights
has_children: false
nav_order: 7
---

# Sample UBI SQL queries
These can be performed on the OpenSearch Dashboards/Query Workbench: 
http://chorus-opensearch-edition.dev.o19s.com:5601/app/opensearch-query-workbench

## Queries with zero results
Although it's trivial on the server side to find queries with no results, we can also get the same answer by querying the event side.
### Server-side
```sql
select
   count(0)
from .ubi_log_queries
where query_response_objects_ids is null
order by user_id
```

### Client event-side
```sql
select 
	count(0)
from .ubi_log_events
where action_name='on_search' and  event_attributes.data.data_detail.query_data.query_response_objects_ids is null
order by timestamp
```

Both client and server-side queries should return the same number.



## Trending queries
```sql
select 
	message, count(0) Total  
from .ubi_log_events 
where 
	action_name='on_search' 
group by message 
order by Total desc
```

<!-- vale off -->
Message|Total
|---|---|
Virtual flexibility systematic|143
Virtual systematic flexibility|89
discrete desk service Cross group|75
Blanditiis quo sint repudiandae a sit.|75
Optio id quis alias at.|75
Consectetur enim sunt laborum adipisci occaecati reiciendis.|70
Like prepare trouble consider.|68
User Behavior Insights|65
cheapest laptop with i9|64
Cross group discrete service desk|63
Laptop|61
Amet maxime numquam libero ipsam amet.|59
fastest laptop|54
Voluptas iusto illum eum autem cum illum.|51
fortalece relaciones e-business|2
evoluciona comercio electrónico en tiempo real|2
incentiva canales escalables|1
incentiva ancho de banda inalámbrica|1
implementa sistemas de siguiente generación|1
implementa marcados eficientes|1

<!-- vale on -->

## Event type distribution counts
To make a pie chart like widget on all the most common events:
```sql
select 
	action_name, count(0) Total  
from .ubi_log_events 
group by action_name
order by Total desc
```
action_name|Total
|---|---|
on_search|3199
brand_filter|3112
button_click|3150
type_filter|3149
product_hover|3132
product_sort|3115
login|2458
logout|1499
new_user_entry|208

### Events associated with queries
Since the `query_id` is set during client-side search, all events that are associated with a query will have that same `query_id`.
To make a pie chart like widget on the most common events preceded by a query:
```sql
select 
	action_name, count(0) Total  
from .ubi_log_events
where query_id is not null
group by action_name
order by Total desc
```
action_name|Total
|---|---|
on_search|1329
brand_filter|669
button_click|648
product_hover|639
product_sort|625
type_filter|613
logout|408


## Sample search journey

Find a search in the query log:
```sql
select *
from .ubi_log_queries
where query_id ='1065c70f-d46a-442f-8ce4-0b5e7a71a892'
order by timestamp
```
(In this generated data, the `query` field is plain text; however in the real implementation the query will be in the internal DSL of the query and parameters.)
query_response_id|query_id|user_id|query|query_response_objects_ids|session_id|timestamp
---|---|---|---|---|---|---
1065c70f-d46a-442f-8ce4-0b5e7a71a892|1065c70f-d46a-442f-8ce4-0b5e7a71a892|155_7e3471ff-14c8-45cb-bc49-83a056c37192|Blanditiis quo sint repudiandae a sit.|8659955|fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|2027-04-17 10:16:45

In the event log
Search for the events that correspond to the query above, `1065c70f-d46a-442f-8ce4-0b5e7a71a892`.

```sql
select 
  query_id, action_name, message_type, message, event_attributes.data.data_id, event_attributes.data.description, session_id, user_id
from .ubi_log_events
where query_id = '1065c70f-d46a-442f-8ce4-0b5e7a71a892'
order by timestamp
```

<!-- vale off -->

query_id|action_name|message_type|message|event_attributes.data.data_id|event_attributes.data.description|session_id|user_id
---|---|---|---|---|---|---|---
1065c70f-d46a-442f-8ce4-0b5e7a71a892|product_hover|INQUERY|Focused logistical policy|1692104|HP LaserJet Color CP3525dn Printer Colour 600 x 1200 DPI A4|fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|155_7e3471ff-14c8-45cb-bc49-83a056c37192
1065c70f-d46a-442f-8ce4-0b5e7a71a892|brand_filter|INFO||||fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|155_7e3471ff-14c8-45cb-bc49-83a056c37192
1065c70f-d46a-442f-8ce4-0b5e7a71a892|type_filter|INFO|Multi-tiered client-server software|||fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|155_7e3471ff-14c8-45cb-bc49-83a056c37192
1065c70f-d46a-442f-8ce4-0b5e7a71a892|product_sort|PURCHASE||77499830|SES Creative Charm bracelets|fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|155_7e3471ff-14c8-45cb-bc49-83a056c37192
1065c70f-d46a-442f-8ce4-0b5e7a71a892|logout|ERROR||||fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|155_7e3471ff-14c8-45cb-bc49-83a056c37192
1065c70f-d46a-442f-8ce4-0b5e7a71a892|on_search|QUERY|Blanditiis quo sint repudiandae a sit.|1065c70f-d46a-442f-8ce4-0b5e7a71a892||fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|155_7e3471ff-14c8-45cb-bc49-83a056c37192
1065c70f-d46a-442f-8ce4-0b5e7a71a892|product_purchase|REJECT||1377181|Matrox G55-MDDE32LPDF graphics card GDDR|fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|155_7e3471ff-14c8-45cb-bc49-83a056c37192
1065c70f-d46a-442f-8ce4-0b5e7a71a892|brand_filter|WARN||||fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|155_7e3471ff-14c8-45cb-bc49-83a056c37192
1065c70f-d46a-442f-8ce4-0b5e7a71a892|product_sort|PURCHASE|Object-based upward-trending policy|137688|HERMA CD labels A4 Ã˜ 116 mm white paper matt opaque 200 pcs.|fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|155_7e3471ff-14c8-45cb-bc49-83a056c37192
1065c70f-d46a-442f-8ce4-0b5e7a71a892|product_click|INQUERY||4534016|ASUS BX700 mouse Bluetooth Laser 1200 DPI Right-hand|fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|155_7e3471ff-14c8-45cb-bc49-83a056c37192
1065c70f-d46a-442f-8ce4-0b5e7a71a892|product_hover|INQUERY||78314263|Tripp Lite DMCCASTER flat panel mount accessory|fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|155_7e3471ff-14c8-45cb-bc49-83a056c37192
1065c70f-d46a-442f-8ce4-0b5e7a71a892|product_click|INQUERY||2073|HP LaserJet 5100tn 1200 x 1200 DPI A3|fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|155_7e3471ff-14c8-45cb-bc49-83a056c37192
1065c70f-d46a-442f-8ce4-0b5e7a71a892|button_click|WARN||||fa6e3b1c-3212-44d2-b16b-690b4aeddbba_1975|155_7e3471ff-14c8-45cb-bc49-83a056c37192

<!-- vale on -->

## User sessions
To look at more sessions from the same user above, `155_7e3471ff-14c8-45cb-bc49-83a056c37192`. 
```sql
select 
	user_id, session_id, query_id, action_name, message_type, message, event_attributes.data.data_type, timestamp 
from .ubi_log_events
where user_id ='155_7e3471ff-14c8-45cb-bc49-83a056c37192'
order by timestamp
```

Results are truncated to a few sessions:

<!-- vale off -->
user_id|session_id|query_id|action_name|message_type|message|event_attributes.data.data_type|timestamp
---|---|---|---|---|---|---|---
user_id|session_id|query_id|action_name|message_type|message|event_attributes.data.data_type|timestamp
155_7e3471ff-14c8-45cb-bc49-83a056c37192|2465d7cf-7123-499c-a510-f5681db2bad8_1967||new_user_entry|INFO|||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|2465d7cf-7123-499c-a510-f5681db2bad8_1967||login|ERROR|iniciativa potenciada centrado en el usuario||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|2465d7cf-7123-499c-a510-f5681db2bad8_1967|11a40012-8e70-4cb8-afcb-b7d1214aa0b0|on_search|QUERY|Blanditiis quo sint repudiandae a sit.|query|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|f8500640-1a69-41f0-b2ea-c7b2d7af5ab1_1970||login|ERROR|Switchable actuating methodology||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|f8500640-1a69-41f0-b2ea-c7b2d7af5ab1_1970||product_purchase|INQUERY|Enterprise-wide high-level circuit|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|f8500640-1a69-41f0-b2ea-c7b2d7af5ab1_1970||product_purchase|REJECT||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|f8500640-1a69-41f0-b2ea-c7b2d7af5ab1_1970||product_sort|PURCHASE|Enhanced content-based protocol|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|f8500640-1a69-41f0-b2ea-c7b2d7af5ab1_1970||button_click|INFO|||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|f8500640-1a69-41f0-b2ea-c7b2d7af5ab1_1970||brand_filter|INFO|Automated solution-oriented firmware||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|f8500640-1a69-41f0-b2ea-c7b2d7af5ab1_1970||product_sort|PURCHASE||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|f8500640-1a69-41f0-b2ea-c7b2d7af5ab1_1970||button_click|INFO|sinergia dedicada mandatorio||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|f8500640-1a69-41f0-b2ea-c7b2d7af5ab1_1970||product_sort|PURCHASE||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|f8500640-1a69-41f0-b2ea-c7b2d7af5ab1_1970||product_click|INQUERY||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|f8500640-1a69-41f0-b2ea-c7b2d7af5ab1_1970||type_filter|INFO|actitud maximizada virtual||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|f8500640-1a69-41f0-b2ea-c7b2d7af5ab1_1970||product_sort|INQUERY||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|f8500640-1a69-41f0-b2ea-c7b2d7af5ab1_1970||brand_filter|ERROR|Re-contextualized zero administration complexity||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|8819a35a-7cd8-4365-8c29-6b07fe46f073_1968|71b2903a-9108-4829-96f1-a675e7a635d8|brand_filter|INFO|||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|8819a35a-7cd8-4365-8c29-6b07fe46f073_1968||login|INFO|Optional context-sensitive system engine||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|8819a35a-7cd8-4365-8c29-6b07fe46f073_1968||button_click|INFO|Sharable background knowledge user||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|8819a35a-7cd8-4365-8c29-6b07fe46f073_1968||product_hover|PURCHASE|polÃ­tica basado en necesidades multicanal|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|8819a35a-7cd8-4365-8c29-6b07fe46f073_1968||product_click|INQUERY||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|8819a35a-7cd8-4365-8c29-6b07fe46f073_1968||button_click|WARN|Customer-focused exuding policy||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|8819a35a-7cd8-4365-8c29-6b07fe46f073_1968||button_click|WARN|||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|8819a35a-7cd8-4365-8c29-6b07fe46f073_1968||product_sort|INQUERY|paradigma basado en el contexto opcional|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|8819a35a-7cd8-4365-8c29-6b07fe46f073_1968|71b2903a-9108-4829-96f1-a675e7a635d8|on_search|QUERY|what is ubi?|query|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|8819a35a-7cd8-4365-8c29-6b07fe46f073_1968|71b2903a-9108-4829-96f1-a675e7a635d8|product_purchase|INQUERY|Ergonomic 24/7 solution|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|8819a35a-7cd8-4365-8c29-6b07fe46f073_1968|71b2903a-9108-4829-96f1-a675e7a635d8|product_purchase|REJECT|Enhanced uniform methodology|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|8819a35a-7cd8-4365-8c29-6b07fe46f073_1968|71b2903a-9108-4829-96f1-a675e7a635d8|type_filter|WARN|Seamless didactic info-mediaries||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|8819a35a-7cd8-4365-8c29-6b07fe46f073_1968|71b2903a-9108-4829-96f1-a675e7a635d8|product_sort|REJECT|algoritmo direccional visionario|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||login|INFO|||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||button_click|WARN|Enterprise-wide 24hour focus group||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||type_filter|WARN|Balanced cohesive adapter||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||product_click|INQUERY|Ergonomic hybrid instruction set|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||product_purchase|PURCHASE||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||product_sort|INQUERY|Automated zero administration encoding|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||product_sort|INQUERY|conjunto de instrucciones multitarea de tamaÃ±o adecuado|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||type_filter|WARN|enfoque heurÃ­stica opcional||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||button_click|INFO|Multi-channeled optimizing neural-net||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||product_hover|INQUERY||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||product_click|INQUERY|Programmable intangible product|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||product_hover|INQUERY||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||product_purchase|PURCHASE|Grass-roots client-server conglomeration|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||brand_filter|ERROR|Implemented real-time standardization||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|dc7984c6-11b1-40ad-b6a5-b96717139da2_1969||product_sort|PURCHASE|funciÃ³n modular progresivo|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971||login|INFO|||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971||type_filter|WARN|conglomeraciÃ³n maximizada seguro||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971||button_click|INFO|Focused regional portal||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971||button_click|INFO|definiciÃ³n sistÃ©mica virtual||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971||type_filter|INFO|||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971||type_filter|INFO|||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971||product_purchase|INQUERY||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971||product_hover|INQUERY|Seamless directional database|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971||product_hover|REJECT|aplicaciÃ³n dinÃ¡mica robusto|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971||product_click|INQUERY|aplicaciÃ³n 4ta generaciÃ³n personalizable|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971||product_click|INQUERY|alianza holÃ­stica administrado|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971|0e360673-46fe-4912-a10c-0ab90bbb0513|on_search|QUERY|what is ubi?|query|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971|0e360673-46fe-4912-a10c-0ab90bbb0513|product_purchase|REJECT|Diverse intermediate hardware|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971|0e360673-46fe-4912-a10c-0ab90bbb0513|product_click|INQUERY|Advanced contextually-based Graphical User Interface|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971|0e360673-46fe-4912-a10c-0ab90bbb0513|product_purchase|PURCHASE|Ergonomic mission-critical ability|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971|0e360673-46fe-4912-a10c-0ab90bbb0513|product_purchase|INQUERY|Visionary discrete groupware|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|86f9c1e4-428f-4520-acef-883770c0f541_1971|0e360673-46fe-4912-a10c-0ab90bbb0513|logout|WARN|Compatible composite process improvement||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|c83a0f59-1ae5-4f63-a45f-b0dcefc7a7d5_1972||login|INFO|Upgradable interactive analyzer||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|c83a0f59-1ae5-4f63-a45f-b0dcefc7a7d5_1972||product_hover|REJECT|Horizontal modular database|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|c83a0f59-1ae5-4f63-a45f-b0dcefc7a7d5_1972||product_click|INQUERY|Re-engineered interactive knowledge user|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|c83a0f59-1ae5-4f63-a45f-b0dcefc7a7d5_1972||product_hover|INQUERY|caja de herramientas holÃ­stica orgÃ¡nico|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|c83a0f59-1ae5-4f63-a45f-b0dcefc7a7d5_1972||brand_filter|INFO|Public-key neutral infrastructure||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|c83a0f59-1ae5-4f63-a45f-b0dcefc7a7d5_1972||brand_filter|INFO|software 24 horas programable||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|c83a0f59-1ae5-4f63-a45f-b0dcefc7a7d5_1972||product_click|INQUERY||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|c83a0f59-1ae5-4f63-a45f-b0dcefc7a7d5_1972||product_purchase|REJECT||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|c83a0f59-1ae5-4f63-a45f-b0dcefc7a7d5_1972||button_click|WARN|||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|c83a0f59-1ae5-4f63-a45f-b0dcefc7a7d5_1972||product_hover|REJECT||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|c83a0f59-1ae5-4f63-a45f-b0dcefc7a7d5_1972||type_filter|INFO|||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|c83a0f59-1ae5-4f63-a45f-b0dcefc7a7d5_1972||logout|INFO|Sharable discrete policy||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|5fb20967-14fe-49e1-93e4-5ab54b0d54a7_1973||login|ERROR|||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|5fb20967-14fe-49e1-93e4-5ab54b0d54a7_1973|898fdbfb-ee8f-4a21-a0e6-8acbc46e45f6|on_search|QUERY|Amet maxime numquam libero ipsam amet.|query|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|5fb20967-14fe-49e1-93e4-5ab54b0d54a7_1973|898fdbfb-ee8f-4a21-a0e6-8acbc46e45f6|product_sort|INQUERY||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|5fb20967-14fe-49e1-93e4-5ab54b0d54a7_1973|e3b7319c-2517-4375-bc66-7ff50bfd37f5|on_search|QUERY|Laptop|query|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|5fb20967-14fe-49e1-93e4-5ab54b0d54a7_1973|e3b7319c-2517-4375-bc66-7ff50bfd37f5|brand_filter|INFO|||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|5fb20967-14fe-49e1-93e4-5ab54b0d54a7_1973|e3b7319c-2517-4375-bc66-7ff50bfd37f5|product_sort|REJECT||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|5fb20967-14fe-49e1-93e4-5ab54b0d54a7_1973|e3b7319c-2517-4375-bc66-7ff50bfd37f5|brand_filter|INFO|capacidad 3ra generaciÃ³n multi-capas||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|5fb20967-14fe-49e1-93e4-5ab54b0d54a7_1973|e3b7319c-2517-4375-bc66-7ff50bfd37f5|button_click|INFO|base de trabajo nueva generaciÃ³n distribuido||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|5fb20967-14fe-49e1-93e4-5ab54b0d54a7_1973|e382687a-a853-460a-99e3-9fec9806875e|on_search|QUERY|Cross group discrete service desk|query|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|4aca7a9c-895f-481c-86a0-1419cec4fbcc_1974||login|INFO|Horizontal full-range framework||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|4aca7a9c-895f-481c-86a0-1419cec4fbcc_1974||button_click|INFO|Vision-oriented motivating matrix||2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|4aca7a9c-895f-481c-86a0-1419cec4fbcc_1974||product_hover|PURCHASE|Cross-platform cohesive product|product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|4aca7a9c-895f-481c-86a0-1419cec4fbcc_1974||product_sort|INQUERY||product|2027-04-17 10:16:45
155_7e3471ff-14c8-45cb-bc49-83a056c37192|4aca7a9c-895f-481c-86a0-1419cec4fbcc_1974||brand_filter|INFO|Multi-layered next generation process improvement||2027-04-17 10:16:45

<!-- vale on -->

## List user sessions that logged out without any queries
- This query denotes users without a query_id.  Note that this could happen if the client side is not passing the returned query to other events.

```sql
select 
    user_id, session_id, count(0) EventTotal
from .ubi_log_events
where action_name='logout' and query_id is null
group by user_id, session_id
order by EventTotal desc
```

<!-- vale off -->

user_id|session_id|EventTotal
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

Since some of these query-less logouts repeat with some users, here is a query to see which users do this the most:

```sql
select 
    user_id, count(0) EventTotal
from .ubi_log_events
where action_name='logout' and query_id is null
group by user_id
order by EventTotal desc
```

user_id|EventTotal
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
