---
layout: default
title: UBI data flow
parent: User behavior insights
has_children: false
nav_order: 7
---

# Basic UBI flow
**Executive Summary**: Once a user performs search, that search is tied to a `query_id`.  Then any following user events until the next search are logged and indexed by the search's `query_id`. If the user finds something of interest, that something's identifier (`object_id` or `key_value`) is logged in the event store with the `query_id`.

### UBI roles
- **UBI Plugin**: in charge of initiating an UBI store, saving all incoming queries associated with an UBI store, and logging the UBI events directly.
- **Search Client**: in charge of searching and recieving a `query_id` from the **UBI Plugin**.  This `query_id` is then passed to the **UBI Client**
- **UBI Client**: in charge of logging user events, such as `onClick`, passing the data to the **UBI Plugin**, with the appropriate `query_id`, if the event follows a search event that produced a `query_id`. 
If the user interacts with an *object* (book, product, document) that was returned from their search, that `object_id` is logged, tying the `query_id` to the `object_id`


```mermaid
%%{init: {'theme':'base',
 'themeVariables': {
      'background': '#ffffff',
      'secondaryColor': '#3cb371',
      'actorTextColor': '#2a00ff',
      'actorBorder': '#ff6347'
 }

}}%%
sequenceDiagram
    autonumber
    actor U as  User-123
    activate Search Client
    U->>Search Client: "Show me cute puppies"
    box rgb(255, 247, 146) Cute Things App
    participant Search Client
    participant UBI Client
    end  
    box rgb(121, 247, 255) OpenSearch Cluster
    participant OS as OpenSearch
    participant UBI Plugin
    end
    activate OS
    Search Client->>OS: "puppies" {X-ubi-store: cute-things-index, X-ubi-user-id: user-123}
    note right of OS: Hits: <br/> [  pug: {id:321, name:JohnBoy},<br/> beagle: {id:456, name:Reagle},<br/> poodle: {id:785, name:Noodle},<br/> ...]
    deactivate Search Client
    activate UBI Plugin
    note right of UBI Plugin: Saving User-123's QUERIES and HITS  <br/> with query_id: 15c182f2-...
    OS->> UBI Plugin: save user query and hits to the QUERY store
    UBI Plugin-->>OS: User-123's query_id is 15c182f2-05db-4f4f-814f-46dc0de6b9ea
    activate Search Client
    OS-->>Search Client: [  pug: {id:321, name:JohnBoy},<br/> beagle: {id:456, name:Reagle},<br/> poodle: {id:785, name:Noodle},...<br/> query_id: 15c182f2-05db-4f4f-814f-46dc0de6b9ea
    note over U: "Hmmm, pug, beagle or poodle?"
    deactivate UBI Plugin
    deactivate OS
    Search Client->> UBI Client: The new query_id is 15c182f2-05db-4f4f-814f-46dc0de6b9ea
    activate UBI Client
    U->>UBI Client: item_onClick, user_id:User-123, <br/> query_id: 15c182f2-05db-4f4f-814f-46dc0de6b9ea
    deactivate Search Client
    activate UBI Plugin
    note over U: "This pug, JohnBoy,<br/> is really cute!"
    note right of UBI Plugin: Saving User-123's EVENTS linked to <br/>  JohnBoy and query_id: 15c182f2-...
    UBI Client->> UBI Plugin: save item_onClick, query_id & user_id to the EVENT store
    U->>UBI Client: item_Adopt, user_id:User-123, <br/> query_id: 15c182f2-05db-4f4f-814f-46dc0de6b9ea
    note over U: Imma adopt him!
    UBI Client->> UBI Plugin: save item_Adopt, query_id & user_id to the EVENT store
    deactivate UBI Client
    deactivate UBI Plugin
```
<!-- vale off -->
# The *Cute Things Animal Rescue*
<!-- vale on -->
1) `User-123` searches for a cute puppy to adopt.
2) The *Cute Things App* relays the search to an OpenSearch Cluster where the `UBI Plugin` is installed and listening for queries on the *cute-things-index*
A number of puppies up for adoption are found.
3) The *hits* and the query is saved in the **query** store, linked to the user, session and `query_id`
4) If no `query_id` is sent in from the client in a request header, a new `query_id` is generated and used to index the data, and then returned in the response.
5) OpenSearch's response headers will have the `query_id` indexed.
6) The application saves this id for the `UBI Client` to log all user events to be associated with that search.
7)  `User-123` clicks on the pug to learn more about JohnBoy.
8) The `UBI Plugin` saves this click event, `query_id`, `user_id` and the specific puppy's identifying information.
9) `User-123` initiates the adoption process for the pug, JohnBoy.
10) The `UBI Plugin` saves this adoption event, `query_id`, `User-123` and the puppy's identifying information.
