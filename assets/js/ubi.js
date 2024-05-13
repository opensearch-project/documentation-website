



function guiid() {
	let id = '123456-insecure';
	try{
	  id = crypto.randomUUID();
	}
	catch(error){
	  console.warn('tried to generate a guiid in an insecure context');
	  id ='10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	  );
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
 * In place of true authentication, this makes a hash out of the user's IP address and browser
 * for tracking individual user behavior
 * 		user_id = hash( user ip ) + '::' + hash( userAgent )
 * 
 * NOTE: if this function is called, but user_id starts with 'USER-', 
 * 		the function below did not complete successfully, 
 * 		and userError() was called instead
 * @returns 
 */
export async function initialize(){
	let i = 1;
	/*
	let data = {
		"search_term": "anything",
		"docs_version": "latest"
	};
	let payload = new UbiEvent('earch', {data_object:data});
	console.log(payload.toJson());
	*/
	try{
		if(!sessionStorage.hasOwnProperty('session_id'))
			sessionStorage.setItem('session_id', guiid());

		if(sessionStorage.hasOwnProperty('user_id')){
			console.log('Already initialized UBI');
			return;
		}
			var rq = new XMLHttpRequest;

			rq.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if(this.response != null) {

						//make a new user id: user ip + '::' + hash( userAgent )
						let client_id = '';
						if( window.navigator != null && window.navigator.userAgent != null){
							client_id = window.navigator.userAgent;
						} else {
							client_id = guiid();
						}
						let user_id = hash( this.response.ip ) + '::' + hash( client_id );	
						sessionStorage.setItem('user_id', user_id);
						console.log('user_id: ' + user_id);

					}
				}
			};

			rq.onerror = function(){
				userError();
				if(this.error != null && this.error != ''){
					console.error('ERROR Retrieving user info: ' + this.error);
				}
				else
					console.error('UNSPECIFIED ERROR Retrieving user info');
			}

			rq.open("GET", "https://api64.ipify.org?format=json", true);
			rq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			rq.responseType = "json";
			rq.send();

		} catch(error){
			console.log(error)
		}

}
 /**
 * back up method to make a user individual
 * @returns 
 */
function userError(){
	let user_id = 'USER-' + guiid();
	sessionStorage.setItem('user_id', user_id);
	return user_id;
} 


export function genQueryId(){
	const qid = 'QUERY-' + guiid();
	sessionStorage.setItem('query_id', qid);
	return qid;
}
export function getQueryId(){
	return sessionStorage.getItem('query_id');
}

/**
 * Save explicitly, if conditions are right
 */
export function saveQueryId(query_id){
	sessionStorage.setItem('query_id', query_id);
}

export function clearCache() {
	sessionStorage.removeItem('search_results');
	sessionStorage.removeItem('result_ids');
}

export function cacheQueryResults(results){
	let qid = genQueryId();
	saveQueryId(qid);
	
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
/**
 * Ubi Event data structures
 */

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
		this.object = object;
		this.position = position;
		for(var entry in Object.entries(attributes)){
			this[entry.key] = entry.value;
		}
	}
}



export class UbiEvent {
	constructor(action_name, {message=null, attributes={}, data_object={}}={}) {
		this.action_name = action_name;
		this.user_id = getUserId();
		this.query_id = getQueryId();
		this.session_id = getSessionId();
		this.page_id = getPageId();
		this.timestamp = Date.now();

		this.message_type = 'INFO';
		if( message )
			this.message = message;

		this.event_attributes = new UbiEventAttributes({attributes:attributes});
	}

	/**
	 * Use to suppress null objects in the json output
	 * @param key 
	 * @param value 
	 * @returns 
	 */
	static replacer(key, value){
		if(value == null)
			return undefined;
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