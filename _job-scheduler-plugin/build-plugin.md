---
layout: default
title: Building a plugin for Job Scheduler
nav_order: 10
---

# Buidling a plugin for Job Scheduler

OpenSearch plugin developers can extend the Job Scheduler plugin to schedule jobs like running aggregation query against raw data and saving the aggregated data into a new index every hour, or continue monitoring the shard allocation by calling the OpenSearch API and then post the output to a Webhook.

Reference the following [README](https://github.com/opensearch-project/job-scheduler/blob/main/README.md) for examples on building a plugin that utilizes Job Scheduler.

## Defining an endpoint

You can configure your plugin's API endpoint by referencing the [example](https://github.com/opensearch-project/job-scheduler/blob/main/sample-extension-plugin/src/main/java/org/opensearch/jobscheduler/sampleextension/SampleExtensionRestHandler.java) `SampleExtensionRestHandler.java` file. Set the `WATCH_INDEX_URI` to the endpoint name that your plugin will use:

```java
public class SampleExtensionRestHandler extends BaseRestHandler {
    public static final String WATCH_INDEX_URI = "/_plugins/scheduler_sample/watch";
```

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

Next, build out your parameters from the declared variables:

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

    public String getIndexToWatch() {
        return this.indexToWatch;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public void setLastUpdateTime(Instant lastUpdateTime) {
        this.lastUpdateTime = lastUpdateTime;
    }

    public void setEnabledTime(Instant enabledTime) {
        this.enabledTime = enabledTime;
    }

    public void setEnabled(boolean enabled) {
        isEnabled = enabled;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public void setIndexToWatch(String indexToWatch) {
        this.indexToWatch = indexToWatch;
    }

    public void setLockDurationSeconds(Long lockDurationSeconds) {
        this.lockDurationSeconds = lockDurationSeconds;
    }

    public void setJitter(Double jitter) {
        this.jitter = jitter;
    }
```

The example code above defines the request parameters that can be set when building your plugin. Reference the following table configured by the example code above.

| Field | Data type | Description |
:--- | :--- | :---
| getName | String | Returns the name of the job. |
| getLastUpdateTime | Time unit | Returns the last time the job ran. |
| getEnabledTime | Time unit | Returns the time that the job was enabled. |
| getSchedule | Unix cron | Returns the schedule that the job runs on formatted in Unix cron syntax. |
| isEnabled | Boolean | Whether or not the job is enabled. |
| getLockDurationSeconds | Integer | Returns the duration of time that the job is locked. |
| getJitter | Integer | Returns the defined jitter value. |
| getIndexToWatch | String | Returns the name of the index that the job monitors. |
| setJobName | String | Sets the name of the job. |
| setLastUpdateTime | Time unit | Sets the time that the job was last updated at. |
| setEnabledTime | Time unit | Sets the time for when the job is enabled. |
| setEnabled | Boolean | Enables or disables the job. |
| setSchedule | Unix cron | Sets the job's schedule using Unix cron syntax. |
| setIndexToWatch | String | Set the index that the job will monitor. |
| setLockDurationSeconds | Integer | Sets the duration that the job is locked for. |
| setJitter | Double | Sets the jitter value. |

For further information, reference the Job Scheduler [sample extention](https://github.com/opensearch-project/job-scheduler/blob/main/sample-extension-plugin/src/main/java/org/opensearch/jobscheduler/sampleextension/SampleJobParameter.java) directory in the [Job Scheduler Github repro](https://github.com/opensearch-project/job-scheduler).
