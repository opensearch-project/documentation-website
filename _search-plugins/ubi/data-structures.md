---
layout: default
title: UBI client data structures
parent: User Behavior Insights
has_children: false
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/search-plugins/ubi/data-structures/
---

# UBI client data structures

Data structures are used to create events that follow the [User Behavior Insights (UBI) event schema specification](https://github.com/o19s/ubi).
For more information about the schema, see [UBI index schemas]({{site.url}}{{site.baseurl}}/search-plugins/ubi/schemas/).


You must provide an implementation for the following functions:
- `getClientId()`
- `getQueryId()`
  
You can also optionally provide an implementation for the following functions:
- `getSessionId()`
- `getPageId()`


The following JavaScript structures can be used as a starter implementation to serialize UBI events into schema-compatible JSON:
```js
/*********************************************************************************************
 * Ubi Event data structures
 * The following structures help ensure adherence to the UBI event schema
 *********************************************************************************************/



export class UbiEventData {
  constructor(object_type, id=null, description=null, details=null) {
    this.object_id_field = object_type;
    this.object_id = id;
    this.description = description;
    this.object_detail = details;
  }
}
export class UbiPosition{
  constructor({ordinal=null, x=null, y=null, trail=null}={}) {
    this.ordinal = ordinal;
    this.x = x;
    this.y = y;
    if(trail)
      this.trail = trail;
    else {
      const trail = getTrail();
      if(trail && trail.length > 0)
        this.trail = trail;
    }
  }
}


export class UbiEventAttributes {
  /**
   * Tries to prepopulate common event attributes
   * The developer can add an `object` that the user interacted with and
   *   the site `position` information relevant to the event
   * 
   * Attributes, other than `object` or `position` can be added in the form:
   * attributes['item1'] = 1
   * attributes['item2'] = '2'
   *
   * @param {*} attributes: object with general event attributes 
   * @param {*} object: the data object the user interacted with
   * @param {*} position: the site position information
   */
  constructor({attributes={}, object=null, position=null}={}) {
    if(attributes != null){
      Object.assign(this, attributes);
    }
    if(object != null && Object.keys(object).length > 0){
      this.object = object;
    }
    if(position != null && Object.keys(position).length > 0){
      this.position = position;
    }
    this.setDefaultValues();
  }

  setDefaultValues(){
    try{
        if(!this.hasOwnProperty('dwell_time') && typeof TimeMe !== 'undefined'){
          this.dwell_time = TimeMe.getTimeOnPageInSeconds(window.location.pathname);
        }

        if(!this.hasOwnProperty('browser')){
          this.browser = window.navigator.userAgent;
        }

        if(!this.hasOwnProperty('page_id')){
          this.page_id = window.location.pathname;
        }
        if(!this.hasOwnProperty('session_id')){
          this.session_id = getSessionId();
        }

        if(!this.hasOwnProperty('page_id')){
          this.page_id = getPageId();
        }

        if(!this.hasOwnProperty('position') || this.position == null){
          const trail = getTrail();
          if(trail.length > 0){
            this.position = new UbiPosition({trail:trail});
          }
        } 
        // ToDo: set IP
    }
    catch(error){
      console.log(error);
    }
  }
}



export class UbiEvent {
  constructor(action_name, {message_type='INFO', message=null, event_attributes={}, data_object={}}={}) {
    this.action_name = action_name;
    this.client_id = getClientId();
    this.query_id = getQueryId();
    this.timestamp = Date.now();

    this.message_type = message_type;
    if( message )
      this.message = message;

    this.event_attributes = new UbiEventAttributes({attributes:event_attributes, object:data_object});
  }

  /**
   * Use to suppress null objects in the json output
   * @param key
   * @param value
   * @returns
   */
  static replacer(key, value){
    if(value == null || 
      (value.constructor == Object && Object.keys(value).length === 0)) {
      return undefined;
    }
    return value;
  }

  /**
   *
   * @returns json string
   */
  toJson() {
    return JSON.stringify(this, UbiEvent.replacer);
  }
}
```
{% include copy.html %}

# Sample usage

```js
export function logUbiMessage(event_type, message_type, message){
  let e = new UbiEvent(event_type, {
    message_type:message_type,
    message:message
  });
  logEvent(e);
}

export function logDwellTime(action_name, page, seconds){
  console.log(`${page} => ${seconds}`);
  let e = new UbiEvent(action_name, {
    message:`On page ${page} for ${seconds} seconds`,
    event_attributes:{
      session_id: getSessionId()},
      dwell_seconds:seconds
      },
    data_object:TimeMe
  });
  logEvent(e);
}

/**
 * ordinal is the number within a list of results
 * for the item that was clicked
 */ 
export function logItemClick(item, ordinal){
  let e = new UbiEvent('item_click', {
    message:`Item ${item['object_id']} was clicked`,
    event_attributes:{session_id: getSessionId()},
    data_object:item,    
  });
  e.event_attributes.position.ordinal = ordinal;
  logEvent(e);
}

export function logEvent( event ){
  // some configured http client 
  return client.index( index = 'ubi_events', body = event.toJson());
}

```
{% include copy.html %}
