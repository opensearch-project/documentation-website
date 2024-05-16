
function guiid() {
  let id = '123456-insecure';
  try {
    id = crypto.randomUUID();
  }
  catch(error){
    console.warn('tried to generate a guiid in an insecure context');
    id ='10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  }
  return id;
};

export function hash(str, seed=42) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for(let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};


/**
 * In place of true authentication, this makes a hash out of the user's cookie,
 *  which at the moment is _ga...
 *
 * NOTE: if this function is called, but user_id starts with 'U-',
 *     the function below did not complete successfully,
 *     and userError() was called instead
 * @returns
 */
export async function initialize(){
  let i = 1;

  try {

  
    if(!sessionStorage.hasOwnProperty('session_id')) {
      sessionStorage.setItem('session_id', 'S-' + guiid());
    }

    if(sessionStorage.hasOwnProperty('user_id')){
      console.log('Already initialized UBI');
      return;
    }
    
    // currently, the only cookie is gtag's client_id et al.
    if(document.cookie && document.cookie.length > 0){
      setUserId(hash(document.cookie));
      return;
    } else {
      //back up user_id method
      userError();
    }


  } catch(error){
    console.log(error)
  }
}

/**
* Back up method to make a user individual
* Note that this is basically the same as a session id since it would 
*   generate each time a user lands on the site
* @returns
*/
function userError(){
  let user_id = guiid();
  setUserId(user_id);
  return user_id;
}


export function genQueryId(){
  const qid = 'Q-' + guiid();
  sessionStorage.setItem('query_id', qid);
  return qid;
}
export function getQueryId(){
  return sessionStorage.getItem('query_id');
}

/**
 * Save explicitly, if conditions are right
 */
export function setQueryId(query_id){
  sessionStorage.setItem('query_id', query_id);
}

export function clearCache() {
  sessionStorage.removeItem('search_results');
  sessionStorage.removeItem('result_ids');
}

export function cacheQueryResults(results){
  let qid = genQueryId();
  setQueryId(qid);

  if(results.length > 0){
    let search_results = {};
    for(var res of results){
      if(!res.hasOwnProperty('id')){
        res.id = hash(res.url)
      }
      search_results[res.id] = res;
    }
    let result_ids = Object.keys(search_results);
    sessionStorage.setItem('search_results', JSON.stringify(search_results));
    sessionStorage.setItem('result_ids', result_ids);
    return [qid, result_ids];
  }
  return [qid, []];
}

export function setUserId(user_id){
  sessionStorage.setItem('user_id', 'U-' + user_id);
}

export function getUserId(){
  if(sessionStorage.hasOwnProperty('user_id')){
    return sessionStorage.getItem('user_id');
  }

  return userError();
}

export function getSessionId(){
  if(sessionStorage.hasOwnProperty('session_id')){
    return sessionStorage.getItem('session_id');
  }

  let session_id = guiid();
  sessionStorage.setItem('session_id', session_id);
  return session_id;
}

export function getPageId(){
  return location.pathname;
}

function getTrail(){
  let trail = sessionStorage.getItem('trail');
  if(trail == null)
    return '';
  return trail;
}

function setTrail(){
  let trail = getTrail();
  if(trail && trail.length > 0){
    if(!trail.startsWith(window.location.pathname)){
      trail += ` › ${window.location.pathname}`;
    }
  } else {
    trail = window.location.pathname;
  }
  sessionStorage.setItem('trail', trail);

  return trail;
}

window.addEventListener("DOMContentLoaded", function (e) {
  try{
    initialize();
    TimeMe.initialize({
      currentPageName: window.location.href,
      idleTimeoutInSeconds: 5 
    });
    setTrail();
    TimeMe.startTimer(window.location.pathname);
  } catch(error){
    console.warn(error);
  }
});

window.addEventListener("beforeunload", function (e) {
  try{
    TimeMe.stopTimer(window.location.pathname);
    logDwellTime('page_exit', window.location.pathname,
      TimeMe.getTimeOnPageInSeconds(window.location.pathname));
  } catch(error){
    console.warn(error);
  }
});

export async function logDwellTime(action_name, page, seconds){
  console.log(`${page} => ${seconds}`);
  let e = new UbiEvent(action_name, {
    message:`On page ${page} for ${seconds} seconds`,
    event_attributes:{dwell_seconds:seconds},
    data_object:TimeMe
  });
  logEvent(e);
}

export async function logEvent(event){
  try {
    //=>146.190.147.150
    fetch('http://localhost:9200/ubi/docs', {
      method: 'POST',
      headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
      },
      body: event.toJson()
    }).then(res => res.json())
    .then(res => console.log(res))
    .catch((error) => {
      console.log(error)
      });
  } catch (e) {
    console.warn('Ubi error: ' + JSON.stringify(e));
  }
}

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
    if(trail)
      this.trail = trail;
    else {
      console.log(document.referrer);
    }
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
    this.setDefaultValues();
  }

  setDefaultValues(){
    try{
        if(!this.hasOwnProperty('dwell_seconds') && typeof TimeMe !== 'undefined'){
          this.dwell_seconds = TimeMe.getTimeOnPageInSeconds(window.location.pathname);
        }

        if(!this.hasOwnProperty('browser')){
          this.browser = window.navigator.userAgent;
        }

        if(!this.hasOwnProperty('position') || this.position == null){
          const trail = getTrail();
          if(trail.length > 0){
            this.position = new UbiPosition({trail:trail});
          }
        }

        // TODO: set IP
    }
    catch(error){

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
