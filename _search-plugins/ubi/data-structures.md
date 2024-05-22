---
layout: default
title: Client data structures
parent: User behavior insights
has_children: false
nav_order: 7
---

# Sample data structures
The data structures below can be used to create events that follow the [UBI event schema](schemas.md).

The developer just needs to decide on implementations for the following functions:
- `getUserId()`
- `getQueryId()`
- `getSessionId()`
- `getPageId()`- e.g.:
  ```js
    function getPageId(){
 	 return location.pathname;
	}
  ```
Other sample implementations can be found [here](#TODO).

```js
/*********************************************************************************************
 * Ubi Event data structures
 * The following structures help ensure adherence to the UBI event schema
 *********************************************************************************************/

export class UbiEventData {
  constructor(type, id=null, description=null, details=null) {
    this.object_type = type;
    this.object_id = id;
    this.description = description;
    this.object_detail = details;

    //override if using key_field's and values
    this.key_value = id;
  }
}
export class UbiPosition{
  constructor({ordinal=null, x=null, y=null, trail=null}={}) {
    this.ordinal = ordinal;
    this.x = x;
    this.y = y;
    this.trail = trail;
  }
}


export class UbiEventAttributes {
  /**
   * Attributes, other than `object` or `position` should be in the form of
   * attributes['item1'] = 1
   * attributes['item2'] = '2'
   *
   * The object member is reserved for further, relevant object payloads or classes
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
  }
}



export class UbiEvent {
  constructor(action_name, {message=null, event_attributes={}, data_object={}}={}) {
    this.action_name = action_name;
    this.user_id = getUserId();
    this.query_id = getQueryId();
    this.session_id = getSessionId();
    this.page_id = getPageId();
    this.timestamp = Date.now();

    this.message_type = 'INFO';
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

# Sample Usage

```js
export async function logDwellTime(action_name, page, seconds){
  console.log(`${page} => ${seconds}`);
  let e = new UbiEvent(action_name, {
    message:`On page ${page} for ${seconds} seconds`,
    event_attributes:{dwell_seconds:seconds},
    data_object:TimeMe
  });
  logEvent(e);
}
```