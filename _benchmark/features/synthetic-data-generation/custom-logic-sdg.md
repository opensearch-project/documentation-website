---
layout: default
title: Generating data using custom logic
nav_order: 35
parent: Synthetic data generation
grand_parent: Additional features
---

# Generating data using custom logic

You can generate synthetic data using custom logic defined in a Python module. This approach offers you the most granular control over how synthetic data is produced in OpenSearch Benchmark. This is especially useful if you understand the distribution of your data and the relationship between different fields.

## The generate_synthetic_document function

Every custom module provided to OpenSearch Benchmark must define the `generate_synthetic_document(providers, **custom_lists)` function. This function defines how OpenSearch Benchmark generates each synthetic document.

### Function parameters

| Parameter | Required/Optional | Description |
|---|---|---|
| `providers` | Required | A dictionary containing data generation tools. Available providers are `generic` (Mimesis [Generic provider](https://mimesis.name/master/api.html#generic-providers)) and `random` (Mimesis [Random class](https://mimesis.name/master/random_and_seed.html)). To add custom providers, see [Advanced configuration](#advanced-configuration). |
| `custom_lists` | Optional | Keyword arguments containing predefined lists of values that you can use in your data generation logic. These are defined in your YAML configuration file under `custom_lists` and allow you to separate data values from your Python code. For example, if you define `dog_names: [Buddy, Max, Luna]` in YAML, you can access it as `custom_lists['dog_names']` in your function. This makes it easy to modify data values without changing your Python code. |

### Basic function template

```python
def generate_synthetic_document(providers, **custom_lists):
    # Access the available providers
    generic = providers['generic']
    random_provider = providers['random']

    # Generate a document using the providers
    document = {
        'name': generic.person.full_name(),
        'age': random_provider.randint(18, 80),
        'email': generic.person.email(),
        'timestamp': generic.datetime.datetime()
    }

    # Optionally, use custom lists if provided
    if 'categories' in custom_lists:
        document['category'] = random_provider.choice(custom_lists['categories'])

    return document
```
{% include copy.html %}

For more information, see the [Mimesis documentation](https://mimesis.name/master/api.html).

## Python module example

The following example Python module demonstrates custom logic for generating documents about dog drivers for a fictional ride-sharing company, *Pawber*, which uses OpenSearch to store and search large volumes of ride-sharing data.

This example showcases several advanced concepts:
- **[Custom provider classes](#advanced-configuration)** (`NumericString`, `MultipleChoices`) that extend Mimesis functionality
- **[Custom lists](#advanced-configuration)** for data values like dog names, breeds, and treats (referenced as `custom_lists['dog_names']`)
- **Geographic clustering** logic for realistic location data
- **Complex document structures** with nested objects and relationships

Save this code to a file called `pawber.py` in your desired directory (for example, `~/pawber.py`):

```python
from mimesis.providers.base import BaseProvider
from mimesis.enums import TimestampFormat

import random

GEOGRAPHIC_CLUSTERS = {
    'Manhattan': {
        'center': {'lat': 40.7831, 'lon': -73.9712},
        'radius': 0.05  # degrees
    },
    'Brooklyn': {
        'center': {'lat': 40.6782, 'lon': -73.9442},
        'radius': 0.05
    },
    'Austin': {
        'center': {'lat': 30.2672, 'lon': -97.7431},
        'radius': 0.1  # Increased radius to cover more of Austin
    }
}

def generate_location(cluster):
    """Generate a random location within a cluster"""
    center = GEOGRAPHIC_CLUSTERS[cluster]['center']
    radius = GEOGRAPHIC_CLUSTERS[cluster]['radius']
    lat = center['lat'] + random.uniform(-radius, radius)
    lon = center['lon'] + random.uniform(-radius, radius)
    return {'lat': lat, 'lon': lon}

class NumericString(BaseProvider):
    class Meta:
        name = "numeric_string"

    @staticmethod
    def generate(length=5) -> str:
        return ''.join([str(random.randint(0, 9)) for _ in range(length)])

class MultipleChoices(BaseProvider):
    class Meta:
        name = "multiple_choices"

    @staticmethod
    def generate(choices, num_of_choices=5) -> str:
        import logging
        logger = logging.getLogger(__name__)
        logger.info("Choices: %s", choices)
        logger.info("Length: %s", num_of_choices)
        total_choices_available = len(choices) - 1

        return [choices[random.randint(0, total_choices_available)] for _ in range(num_of_choices)]

def generate_synthetic_document(providers, **custom_lists):
    generic = providers['generic']
    random_mimesis = providers['random']

    first_name = generic.person.first_name()
    last_name = generic.person.last_name()
    city = random.choice(list(GEOGRAPHIC_CLUSTERS.keys()))

    # Driver Document
    document = {
        "dog_driver_id": f"DD{generic.numeric_string.generate(length=4)}",
        "dog_name": random_mimesis.choice(custom_lists['dog_names']),
        "dog_breed": random_mimesis.choice(custom_lists['dog_breeds']),
        "license_number": f"{random_mimesis.choice(custom_lists['license_plates'])}{generic.numeric_string.generate(length=4)}",
        "favorite_treats": random_mimesis.choice(custom_lists['treats']),
        "preferred_tip": random_mimesis.choice(custom_lists['tips']),
        "vehicle_type": random_mimesis.choice(custom_lists['vehicle_types']),
        "vehicle_make": random_mimesis.choice(custom_lists['vehicle_makes']),
        "vehicle_model": random_mimesis.choice(custom_lists['vehicle_models']),
        "vehicle_year": random_mimesis.choice(custom_lists['vehicle_years']),
        "vehicle_color": random_mimesis.choice(custom_lists['vehicle_colors']),
        "license_plate": random_mimesis.choice(custom_lists['license_plates']),
        "current_location": generate_location(city),
        "status": random.choice(['available', 'busy', 'offline']),
        "current_ride": f"R{generic.numeric_string.generate(length=6)}",
        "account_status": random_mimesis.choice(custom_lists['account_status']),
        "join_date": generic.datetime.formatted_date(),
        "total_rides": generic.numeric.integer_number(start=1, end=200),
        "rating": generic.numeric.float_number(start=1.0, end=5.0, precision=2),
        "earnings": {
            "today": {
                "amount": generic.numeric.float_number(start=1.0, end=5.0, precision=2),
                "currency": "USD"
            },
            "this_week": {
                "amount": generic.numeric.float_number(start=1.0, end=5.0, precision=2),
                "currency": "USD"
            },
            "this_month": {
                "amount": generic.numeric.float_number(start=1.0, end=5.0, precision=2),
                "currency": "USD"
            }
        },
        "last_grooming_check": "2023-12-01",
        "owner": {
            "first_name": first_name,
            "last_name": last_name,
            "email": f"{first_name}{last_name}@gmail.com"
        },
        "special_skills": generic.multiple_choices.generate(custom_lists['skills'], num_of_choices=3),
        "bark_volume": generic.numeric.float_number(start=1.0, end=10.0, precision=2),
        "tail_wag_speed": generic.numeric.float_number(start=1.0, end=10.0, precision=1)
    }

    return document
```
{% include copy.html %}

## Generating data

To generate synthetic data using custom logic, use the `generate-data` subcommand and provide the required custom Python module, index name, output path, and total amount of data to generate:

```shell
osb generate-data --custom-module ~/pawber.py --index-name pawber-data --output-path ~/Desktop/sdg_outputs/ --total-size 2
```
{% include copy.html %}

For a complete list of available parameters and their descriptions, see the [`generate-data` command reference]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/generate-data/).

## Example output

The following is an example output of generating 100 GB of data:

```
   ____                  _____                      __       ____                  __                         __
  / __ \____  ___  ____ / ___/___  ____ ___________/ /_     / __ )___  ____  _____/ /_  ____ ___  ____ ______/ /__
 / / / / __ \/ _ \/ __ \\__ \/ _ \/ __ `/ ___/ ___/ __ \   / __  / _ \/ __ \/ ___/ __ \/ __ `__ \/ __ `/ ___/ //_/
/ /_/ / /_/ /  __/ / / /__/ /  __/ /_/ / /  / /__/ / / /  / /_/ /  __/ / / / /__/ / / / / / / / / /_/ / /  / ,<
\____/ .___/\___/_/ /_/____/\___/\__,_/_/   \___/_/ /_/  /_____/\___/_/ /_/\___/_/ /_/_/ /_/ /_/\__,_/_/  /_/|_|
    /_/


[NOTE] ✨ Dashboard link to monitor processes and task streams: [http://127.0.0.1:8787/status]
[NOTE] ✨ For users who are running generation on a virtual machine, consider SSH port forwarding (tunneling) to localhost to view dashboard.
[NOTE] Example of localhost command for SSH port forwarding (tunneling) from an AWS EC2 instance:
ssh -i <PEM_FILEPATH> -N -L localhost:8787:localhost:8787 ec2-user@<DNS>

Total GB to generate: [1]
Average document size in bytes: [412]
Max file size in GB: [40]

100%|███████████████████████████████████████████████████████████████████| 100.07G/100.07G [3:35:29<00:00, 3.98MB/s]

Generated 24271844660 docs in 12000 seconds. Total dataset size is 100.21GB.
✅ Visit the following path to view synthetically generated data: /home/ec2-user/

-----------------------------------
[INFO] ✅ SUCCESS (took 272 seconds)
-----------------------------------
```

## Advanced configuration

You can optionally create a YAML configuration file to store custom data and providers. The configuration file must define a `CustomGenerationValues` parameter.

The following parameters are available in `CustomGenerationValues`. Both parameters are optional.

| Parameter | Required/Optional | Description |
|---|---|---|
| `custom_lists` | Optional | Predefined arrays of values that you can reference in your Python module using `custom_lists['list_name']`. This allows you to separate data values from your code logic, making it easy to modify data values without changing your Python file. For example, `dog_names: [Buddy, Max, Luna]` becomes accessible as `custom_lists['dog_names']`. |
| `custom_providers` | Optional | Custom data generation classes that extend Mimesis functionality. These should be defined as classes in your Python module (like `NumericString` or `MultipleChoices` in the [example](#python-module-example)) and then listed in this parameter by name. This allows you to create specialized data generators beyond what Mimesis provides by default. |

### Example configuration file

Save your configuration in a YAML file:

```yml
CustomGenerationValues:
  # Generate data using a custom Python module
  custom_lists:
  # Custom lists to consolidate all values in this YAML file
    dog_names: [Hana, Youpie, Charlie, Lucy, Cooper, Luna, Rocky, Daisy, Buddy, Molly]
    dog_breeds: [Jindo, Labrador, German Shepherd, Golden Retriever, Bulldog, Poodle, Beagle, Rottweiler, Boxer, Dachshund, Chihuahua]
    treats: [cookies, pup_cup, jerky]
  custom_providers:
  # OSB's synthetic data generator uses Mimesis; custom providers are essentially custom Python classes that adds more functionality to Mimesis
    - NumericString
    - MultipleChoices
```
{% include copy.html %}


### Using the configuration

To use your configuration file, add the `--custom-config` parameter to the `generate-data` command:

```shell
osb generate-data --custom-module ~/pawber.py --index-name pawber-data --output-path ~/Desktop/sdg_outputs/ --total-size 2 --custom-config ~/Desktop/sdg-config.yml
```
{% include copy.html %}

## Related documentation

- [`generate-data` command reference]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/generate-data/)
- [Generating data using index mappings]({{site.url}}{{site.baseurl}}/benchmark/features/synthetic-data-generation/mapping-sdg/)
