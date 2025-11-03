---
layout: default
title: Custom Logic Approach
nav_order: 35
parent: Synthetic Data Generation
grand_parent: Features
---

# Generating Data with Custom Logic

To invoke synthetic data generation, you'll need to provide either one of the two required input files:
* OpenSearch index mappings
* Custom logic (via Python module)

This document explores using custom logic to generate synthetic data.

### Prerequisites

* **Required**: Custom logic defined in Python module
* **Optional**: Synthetic Data Generation Config

Python module with custom logic **must include** `generate_synthetic_data(providers, **custom_lists)` within.
{: .important}

### Overview

This approach offers the most granular control over how synthetic data is produced in OpenSearch Benchmark. This is especially useful for users who understand the distribution of their data and the relationship between different fields.

An example of what a valid Python module with custom logic that can be provided is shown below:

```shell
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
This example Python module has custom logic to generate documents related to dog drivers for a fictional ride-sharing company called *Pawber*, who uses OpenSearch to store and search across large volumes of ride-sharing data.

In the module above, notice that there's function called `generate_synthetic_data(providers, **custom_lists)`. OpenSearch Benchmark expects that all custom modules provided must have this function defined along with its parameters. This function informs OpenSearch Benchmark on how to generate a synthetic document.
{: .important}

Next, we'll see how we can use this to generate documents.

### Command Parameters

```shell
osb generate-data --custom-module ~/Desktop/http-logs.py --index-name http-logs-regenerated --output-path ~/Desktop/sdg_outputs/ --total-size 2
```

* `generate-data` (required): sub-command that activates synthetic data generation in OpenSearch Benchmark
* `--custom-module` or `-m` (required): Path to Python logic that includes custom logic

For `--custom-module` parameter, the custom Python module provided must include `generate_synthetic_data(providers, **custom_lists)`.
{: .important}

* `--index-name` or `-n` (required): Name of data corpora generated
* `--output-path` or `-p` (required): Path where data should be generated in
* `--total-size` or `-s` (required): Total amount of data that should be generated in GB
* `--custom-config` or `-c` (optional): Path to YAML config defining rules for how data should be generated. This is further explored in the subsequent section
* `--test-document` or `-t` (optional): When flag is present, OSB generates a single synthetic document and outputs to the console. Provides users a way to verify that the example document generated is aligned with expectations. When the flag is not present, the entire data corpora will be generated

### Example Output

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
ssh -i <PEM filepath> -N -L localhost:8787:localhost:8787 ec2-user@<DNS>

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
This is an example output of what it might look like if you generated 100GB.


### Using synthetic data generation config

Using a synthetic data generation config is not necessary for this approach unless users prefer to store custom logic in the config file for organizational purposes.

To store custom logic in the config file, the synthetic data generation config must have *CustomGenerationValues* defined and can have *custom_lists* and *custom_providers* defined.

* **custom_lists** → Key, value pair mapping.  Keys are names of lists and values are list of values.
* **custom_providers** → “Custom Providers” from Mimesis. Synthetic data generation in OpenSearch Benchmark uses Mimesis under the hood. These should be defined in the same file as the custom Python module supplied.

Example of synthetic data generation config with *CustomGenerationValues* defined:

```yml
CustomGenerationValues:
  # For users who want to generate data via a custom Python module
  custom_lists:
  # Custom lists for users who are using a custom Python module and want to consolidate all values in this YAML file
    dog_names: [Hana, Youpie, Charlie, Lucy, Cooper, Luna, Rocky, Daisy, Buddy, Molly]
    dog_breeds: [Jindo, Labrador, German Shepherd, Golden Retriever, Bulldog, Poodle, Beagle, Rottweiler, Boxer, Dachshund, Chihuahua]
    treats: [cookies, pup_cup, jerky]
  custom_providers:
  # OSB's synthetic data generator uses mimesis and custom providers are essentially custom Python classes that adds more functionality to Mimesis
    - NumericString
    - MultipleChoices
```

To use the synthetic data generation config with CustomGenerationValues defined, supply the following parameter to the generate-data command:

```shell
--custom-config ~/Desktop/sdg-config.yml
```

OpenSearch Benchmark will now be using those custom_lists and custom_providers defined when generating synthetic data.

