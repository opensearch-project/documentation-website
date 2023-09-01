---
layout: default
title: Configuring Log4j
parent: Managing Data Prepper
nav_order: 20
---

# Configuring Log4j

You can configure logging using Log4j in Data Prepper. 

## Logging 

Data Prepper uses [SLF4J](https://www.slf4j.org/) with a [Log4j 2 binding](https://logging.apache.org/log4j/2.x/log4j-slf4j-impl.html).

For Data Prepper versions 2.0 and later, the Log4j 2 configuration file can be found and edited in `config/log4j2.properties` in the application's home directory. The default properties for Log4j 2 can be found in `log4j2-rolling.properties` in the *shared-config* directory.

For Data Prepper versions before 2.0, the Log4j 2 configuration file can be overridden by setting the `log4j.configurationFile` system property when running Data Prepper. The default properties for Log4j 2 can be found in `log4j2.properties` in the *shared-config* directory. 

### Example

When running Data Prepper, the following command can be overridden by setting the system property `-Dlog4j.configurationFile={property_value}`, where `{property_value}` is a path to the Log4j 2 configuration file:

```
java "-Dlog4j.configurationFile=config/custom-log4j2.properties" -jar data-prepper-core-$VERSION.jar pipelines.yaml data-prepper-config.yaml
```

See the [Log4j 2 configuration documentation](https://logging.apache.org/log4j/2.x/manual/configuration.html) for more information about Log4j 2 configuration.

