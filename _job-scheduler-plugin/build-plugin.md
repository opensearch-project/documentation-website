---
layout: default
title: Building a plugin for Job Scheduler
nav_order: 10
---

# Building a plugin for Job Scheduler

OpenSearch plugin developers can extend the Job Scheduler plugin to schedule jobs to perform on the cluster. Jobs you can schedule include running aggregation queries against raw data and saving the aggregated data into a new index every hour, or continuing to monitor the shard allocation by calling the OpenSearch API and then posting the output to a webhook.

For examples of building a plugin that utilizes the Job Scheduler plugin, see the Job Scheduler [README](https://github.com/opensearch-project/job-scheduler/blob/main/README.md).

## Defining an endpoint

You can configure your plugin's API endpoint by referencing the [example](https://github.com/opensearch-project/job-scheduler/blob/main/sample-extension-plugin/src/main/java/org/opensearch/jobscheduler/sampleextension/SampleExtensionRestHandler.java) `SampleExtensionRestHandler.java` file. Set the endpoint URL that your plugin will expose with `WATCH_INDEX_URI`:

```java
public class SampleExtensionRestHandler extends BaseRestHandler {
    public static final String WATCH_INDEX_URI = "/_plugins/scheduler_sample/watch";
```

You then need to define the job configuration by [extending](https://github.com/opensearch-project/job-scheduler/blob/main/sample-extension-plugin/src/main/java/org/opensearch/jobscheduler/sampleextension/SampleJobParameter.java) `ScheduledJobParameter`. You can also define the fields used by your plugin like `indexToWatch` as shown in the [example](https://github.com/opensearch-project/job-scheduler/blob/main/sample-extension-plugin/src/main/java/org/opensearch/jobscheduler/sampleextension/SampleJobParameter.java) `SampleJobParameter` file. This job configuration will be saved as a document in an index defined by you as shown in this [example](https://github.com/opensearch-project/job-scheduler/blob/main/sample-extension-plugin/src/main/java/org/opensearch/jobscheduler/sampleextension/SampleExtensionPlugin.java#L54).

## Parameters configuration

You can configure your plugin's parameters by referencing and modifying the [example](https://github.com/opensearch-project/job-scheduler/blob/main/sample-extension-plugin/src/main/java/org/opensearch/jobscheduler/sampleextension/SampleJobParameter.java) `SampleJobParameter.java` file to fit your needs:

```java
/**
 * A sample job parameter.
 * <p>
 * It adds an additional "indexToWatch" field to {@link ScheduledJobParameter}, which stores the index
 * the job runner will watch.
 */
public class SampleJobParameter implements ScheduledJobParameter {
    public static final String NAME_FIELD = "name";
    public static final String ENABLED_FILED = "enabled";
    public static final String LAST_UPDATE_TIME_FIELD = "last_update_time";
    public static final String LAST_UPDATE_TIME_FIELD_READABLE = "last_update_time_field";
    public static final String SCHEDULE_FIELD = "schedule";
    public static final String ENABLED_TIME_FILED = "enabled_time";
    public static final String ENABLED_TIME_FILED_READABLE = "enabled_time_field";
    public static final String INDEX_NAME_FIELD = "index_name_to_watch";
    public static final String LOCK_DURATION_SECONDS = "lock_duration_seconds";
    public static final String JITTER = "jitter";

    private String jobName;
    private Instant lastUpdateTime;
    private Instant enabledTime;
    private boolean isEnabled;
    private Schedule schedule;
    private String indexToWatch;
    private Long lockDurationSeconds;
    private Double jitter;
```

Next, build out your parameters from the declared variables. The following sample shows the request parameters to set while building your plugin:

```java
public SampleJobParameter(String id, String name, String indexToWatch, Schedule schedule, Long lockDurationSeconds, Double jitter) {
        this.jobName = name;
        this.indexToWatch = indexToWatch;
        this.schedule = schedule;

        Instant now = Instant.now();
        this.isEnabled = true;
        this.enabledTime = now;
        this.lastUpdateTime = now;
        this.lockDurationSeconds = lockDurationSeconds;
        this.jitter = jitter;
    }

    @Override
    public String getName() {
        return this.jobName;
    }

    @Override
    public Instant getLastUpdateTime() {
        return this.lastUpdateTime;
    }

    @Override
    public Instant getEnabledTime() {
        return this.enabledTime;
    }

    @Override
    public Schedule getSchedule() {
        return this.schedule;
    }

    @Override
    public boolean isEnabled() {
        return this.isEnabled;
    }

    @Override
    public Long getLockDurationSeconds() {
        return this.lockDurationSeconds;
    }

    @Override public Double getJitter() {
        return jitter;
    }
```

The following table describes the request parameters configured in the previous sample. All the request parameters shown are required.

| Field | Data type | Description |
:--- | :--- | :---
| getName | String | Returns the name of the job. |
| getLastUpdateTime | Time unit | Returns the last time the job ran. |
| getEnabledTime | Time unit | Returns the time that the job was enabled. |
| getSchedule | Unix cron | Returns the schedule that the job runs on formatted in Unix cron syntax. |
| isEnabled | Boolean | Whether or not the job is enabled. |
| getLockDurationSeconds | Integer | Returns the duration of time that the job is locked. |
| getJitter | Integer | Returns the defined jitter value. |

The logic run by your job should be defined by a class extending `ScheduledJobRunner` such as `SampleJobRunner`. While the job is running, there is a locking mechanism you can use to prevent other nodes from running the same job. [Acquire](https://github.com/opensearch-project/job-scheduler/blob/main/sample-extension-plugin/src/main/java/org/opensearch/jobscheduler/sampleextension/SampleJobRunner.java#L96) the lock. Then, make sure to release the lock before the [job finishes](https://github.com/opensearch-project/job-scheduler/blob/main/sample-extension-plugin/src/main/java/org/opensearch/jobscheduler/sampleextension/SampleJobRunner.java#L116).

For more information, see the Job Scheduler [sample extention](https://github.com/opensearch-project/job-scheduler/blob/main/sample-extension-plugin/src/main/java/org/opensearch/jobscheduler/sampleextension/SampleJobParameter.java) directory in the [Job Scheduler Github repro](https://github.com/opensearch-project/job-scheduler).
