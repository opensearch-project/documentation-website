---
layout: default
title: UBI JavaScript Collector
parent: User Behavior Insights
has_children: false
nav_order: 10
---

# UBI JavaScript collector

UBI comes with a very basic JavaScript client that manages the life cycle of the `query_id` for a specific search and can create UBI Event data structures and store them for specific actions.

For more information about the schema, see [UBI index schemas]({{site.url}}{{site.baseurl}}/search-plugins/ubi/schemas/).

We recommend that you refer to the client as a starting point for your own specific needs.

## Installation

The client comes as a single file `ubi.js` and only has a dependency on the `axios` library.  
Download it from https://github.com/opensearch-project/user-behavior-insights/tree/main/ubi-javascript-collector.

Reference the events and create the client via:

```js
import { UbiEvent } from './ubi';
import { UbiEventAttributes } from './ubi'
import { UbiClient } from './ubi'

const ubiClient = new  UbiClient('http://localhost:9200');
```


## Creating an event 

This code snippet is to track adding an item to a shopping cart in an e-commerce application. It utilizes the `UbiEvent` and `UbiEventAttributes` class to encapsulate event details, which can then be sent to the tracking system.
```js
var event = new UbiEvent(
    'add_to_cart', 
    client_id, 
    session_id, 
    getQueryId(), 
    new UbiEventAttributes('product', item.primary_ean, item.title, item), 
    item.title + ' (' + item.id + ')'
);
```

### Parameters

1. **Event Name**: 
   - `'add_to_cart'` - This string indicates the type of event being tracked.

2. **Client ID**: 
   - `client_id` - A variable that holds the unique identifier for the client. This helps in distinguishing between different users or sessions.

3. **Session ID**: 
   - `session_id` - A variable that contains the unique identifier for the user session. This is used to track user interactions within a specific session.

4. **Query ID**: 
   - `getQueryId()` - A function call that retrieves the current query ID, which may represent a specific search or interaction context.

5. **UbiEventAttributes**: 
   - This is an instance of the `UbiEventAttributes` class, which encapsulates additional details about the event:
     - **Type**: 
       - `'product'` - Specifies that the attribute type is related to a product.
     - **Primary EAN**: 
       - `item.primary_ean` - This is the product's unique identifier in EAN format.
     - **Title**: 
       - `item.title` - The name or description of the product.
     - **Item**: 
       - `item` - The complete product object containing all relevant details.

6. **Event Label**: 
   - `item.title + ' (' + item.id + ')'` - This creates a descriptive label for the event that includes the product title and its unique identifier (ID).

The method `getQueryId()` refers to a helper method to generate a unique query id (and stores it in the session).  
Here is a sample method:

```
function generateQueryId(){
  const query_id = generateGuid();
  sessionStorage.setItem('query_id', query_id);
  return query_id;
}

function generateGuid() {
  let id = '';
  try{
    id = crypto.randomUUID();
  }
  catch(error){
    // crypto.randomUUID only works in https, not http context, so fallback.
    id ='10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  return id;
};
```
{% include copy.html %}

## Tracking the event 

You can send the event to the backend by calling the `trackEvent` method:

```js
ubiClient.trackEvent(event);
```


## Tracking queries

You have the option of tracking queries using the client (instead of using the UBI plugin for OpenSearch).

This looks very similar to tracking events:

```js
const query = new UbiQuery(APPLICATION, client_id, query_id, value, "_id", {});
ubiClient.trackQuery(query)
```
