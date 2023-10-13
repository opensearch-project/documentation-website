---
layout: default
title: Nodes hot threads
parent: Nodes APIs
nav_order: 30
---

# Nodes hot threads
**Introduced 1.0**
{: .label .label-purple }

The nodes hot threads endpoint provides information about busy JVM threads for selected cluster nodes. It provides a unique view of the of activity each node.

#### Example

```json
GET /_nodes/hot_threads
```
{% include copy-curl.html %}

## Path and HTTP methods

```json
GET /_nodes/hot_threads
GET /_nodes/<nodeId>/hot_threads
```

## Path parameters

You can include the following optional path parameter in your request. 

Parameter | Type | Description
:--- | :--- | :---
nodeId | String  | A comma-separated list of node IDs used to filter results. Supports [node filters]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/index/#node-filters). Defaults to `_all`.

## Query parameters

You can include the following query parameters in your request. All query parameters are optional.

Parameter | Type | Description
:--- | :---| :---
snapshots | Integer | The number of samples of thread stacktraces. Defaults to `10`.
interval | Time | The interval between consecutive samples. Defaults to `500ms`.
threads | Integer | The number of the busiest threads to return information about. Defaults to `3`.
ignore_idle_threads | Boolean   | Don’t show threads that are in known idle states, such as waiting on a socket select or pulling from an empty task queue. Defaults to `true`.
type | String | Supported thread types are `cpu`, `wait`, or `block`. Defaults to `cpu`.
timeout | Time | Sets the time limit for node response. Default value is `30s`.

#### Example request 

```json
GET /_nodes/hot_threads
```
{% include copy-curl.html %}

#### Example response

```bash
::: {opensearch}{F-ByTQzVQ3GQeYzQJArJGQ}{GxbcLdCATPWggOuQHJAoCw}{127.0.0.1}{127.0.0.1:9300}{dimr}{shard_indexing_pressure_enabled=true}
   Hot threads at 2022-09-29T19:46:44.533Z, interval=500ms, busiestThreads=3, ignoreIdleThreads=true:
   
    0.1% (455.5micros out of 500ms) cpu usage by thread 'ScheduledMetricCollectorsExecutor'
     10/10 snapshots sharing following 2 elements
       java.base@17.0.4/java.lang.Thread.sleep(Native Method)
       org.opensearch.performanceanalyzer.collectors.ScheduledMetricCollectorsExecutor.run(ScheduledMetricCollectorsExecutor.java:100)
```

## Response

Unlike the majority of OpenSearch API responses, this response is in a text format.

It consists of one section per each cluster node included in the response.

Each section starts with a single line containing the following segments:

Line segment | Description
:--- |:-------
<code>:::&nbsp;</code>  | Line start (a distinct visual symbol).
`{global-eu-35}` | Node name.
`{uFPbKLDOTlOmdnwUlKW8sw}` | NodeId.
`{OAM8OT5CQAyasWuIDeVyUA}` | EphemeralId.
`{global-eu-35.local}` | Host name.
`{[gdv2:a284:2acv:5fa6:0:3a2:7260:74cf]:9300}` | Host address.
`{dimr}` | Node roles (d=data, i=ingest, m=cluster&nbsp;manager, r=remote&nbsp;cluster&nbsp;client).
`{zone=west-a2, shard_indexing_pressure_enabled=true}` | Node attributes.

Then information about threads of the selected type is provided.

```bash
::: {global-eu-35}{uFPbKLDOTlOmdnwUlKW8sw}{OAM8OT5CQAyasWuIDeVyUA}{global-eu-35.local}{[gdv2:a284:2acv:5fa6:0:3a2:7260:74cf]:9300}{dimr}{zone=west-a2, shard_indexing_pressure_enabled=true}
   Hot threads at 2022-04-01T15:15:27.658Z, interval=500ms, busiestThreads=3, ignoreIdleThreads=true:
   
    0.1% (645micros out of 500ms) cpu usage by thread 'opensearch[global-eu-35][transport_worker][T#7]'
     4/10 snapshots sharing following 3 elements
       io.netty.util.concurrent.SingleThreadEventExecutor$4.run(SingleThreadEventExecutor.java:986)
       io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74)
       java.base@11.0.14.1/java.lang.Thread.run(Thread.java:829)
::: {global-eu-62}{4knOxAdERlOB19zLQIT1bQ}{HJuZs2HiQ_-8Elj0Fvi_1g}{global-eu-62.local}{[gdv2:a284:2acv:5fa6:0:3a2:bba6:fe3f]:9300}{dimr}{zone=west-a2, shard_indexing_pressure_enabled=true}
   Hot threads at 2022-04-01T15:15:27.659Z, interval=500ms, busiestThreads=3, ignoreIdleThreads=true:
      
   18.7% (93.4ms out of 500ms) cpu usage by thread 'opensearch[global-eu-62][transport_worker][T#3]'
     6/10 snapshots sharing following 3 elements
       io.netty.util.concurrent.SingleThreadEventExecutor$4.run(SingleThreadEventExecutor.java:986)
       io.netty.util.internal.ThreadExecutorMap$2.run(ThreadExecutorMap.java:74)
       java.base@11.0.14.1/java.lang.Thread.run(Thread.java:829)
::: {global-eu-44}{8WW3hrkcTwGvgah_L8D_jw}{Sok7spHISFyol0jFV6i0kw}{global-eu-44.local}{[gdv2:a284:2acv:5fa6:0:3a2:9120:e79e]:9300}{dimr}{zone=west-a2, shard_indexing_pressure_enabled=true}
   Hot threads at 2022-04-01T15:15:27.659Z, interval=500ms, busiestThreads=3, ignoreIdleThreads=true:
   
   42.6% (212.7ms out of 500ms) cpu usage by thread 'opensearch[global-eu-44][write][T#5]'
     2/10 snapshots sharing following 43 elements
       java.base@11.0.14.1/sun.nio.ch.IOUtil.write1(Native Method)
       java.base@11.0.14.1/sun.nio.ch.EPollSelectorImpl.wakeup(EPollSelectorImpl.java:254)
       io.netty.channel.nio.NioEventLoop.wakeup(NioEventLoop.java:787)
       io.netty.util.concurrent.SingleThreadEventExecutor.execute(SingleThreadEventExecutor.java:846)
       io.netty.util.concurrent.SingleThreadEventExecutor.execute(SingleThreadEventExecutor.java:815)
       io.netty.channel.AbstractChannelHandlerContext.safeExecute(AbstractChannelHandlerContext.java:989)
       io.netty.channel.AbstractChannelHandlerContext.write(AbstractChannelHandlerContext.java:796)
       io.netty.channel.AbstractChannelHandlerContext.writeAndFlush(AbstractChannelHandlerContext.java:758)
       io.netty.channel.DefaultChannelPipeline.writeAndFlush(DefaultChannelPipeline.java:1020)
       io.netty.channel.AbstractChannel.writeAndFlush(AbstractChannel.java:311)
       org.opensearch.transport.netty4.Netty4TcpChannel.sendMessage(Netty4TcpChannel.java:159)
       app//org.opensearch.transport.OutboundHan...
```

## Required permissions

If you use the Security plugin, make sure you set the following permissions: `cluster:monitor/nodes/hot_threads`.
