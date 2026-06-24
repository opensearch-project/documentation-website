---
layout: default
title: Sampling
parent: Common use cases
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/data-prepper/common-use-cases/sampling/
redirect_to: https://docs.opensearch.org/latest/data-prepper/common-use-cases/sampling/
---

# Sampling

Data Prepper provides the following sampling capabilities:

- Time sampling
- Percentage sampling
- Tail sampling

## Time sampling 

You can use the `rate_limiter` action within the [`aggregate` processor]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/aggregate/) to limit the number of events that can be processed per second. You can choose to either drop excess events or carry them forward to the next time period.

In the following example, only 100 events with a status code of `200` are sent to the sink per second from a given IP address. The `when_exceeds` option is set to `drop`, which means that all excess events from the configured time window will be dropped.

```json
...
  processor:
   - aggregate:                                                                                                                                          
        identification_keys: ["clientip"]                                                                                                      
        action:                                                                                                                                           
          rate_limiter:                                                                                                                                   
            events_per_second: 100                                                                                                                        
            when_exceeds: drop
        when: "/status == 200"  
...
```

If you instead set the `when_exceeds` option to `block`, the processor will block the pipeline until the time window has elapsed. Then it will process the blocked events.

## Percentage sampling

Use the `percent_sampler` action within the `aggregate` processor to limit the number of events that are sent to a sink. All excess events will be dropped.

In the following example, only 20% of events with a status code of `200` are sent to the sink from a given IP address:

```json
...
  processor:
  - aggregate:                                                                                                                                          
        identification_keys: ["clientip"]  
        duration :                                                                                                    
        action:                                                                                                                                           
          percent_sampler:                                                                                                                                   
            percent: 20                                                                                                                        
        when: "/status == 200" 
...
```

## Tail sampling

Use the `tail_sampler` action within the `aggregate` processor to sample events based on a set of defined policies. This action waits for an aggregation to complete across different aggregation periods based on the configured wait period. When an aggregation is complete, and if it matches the specific error condition, it is sent to the sink. Otherwise, only a configured percentage of events is sent to the sink.

The following pipeline sends all OpenTelemetry traces with an error condition status of `2` to the sink. It only sends 20% of the traces that don't match this error condition to the sink.

```json
...
  processor:
   - aggregate:                                                                                                                                          
        identification_keys: ["traceId"]                                                                                                                   
        action:                                                                                                                                           
          tail_sampler:                                                                                                                                   
            percent: 20                                                                                                                                   
            wait_period: "10s"                                                                                                                            
            condition: "/status == 2"                                                                                                              
          
...
```

If you set the error condition to `false` or don't include it, only the configured percentage of events is allowed to pass through, as determined by a probabilistic outcome.

Because it can be difficult to determine exactly when tail sampling should occur, you can use the `wait_period` option to measure the idle time since the last event was received.
