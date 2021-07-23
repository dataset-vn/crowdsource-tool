---
title: Install and upgrade Dataset
type: guide
order: 200
meta_title: Install and Upgrade
meta_description: Dataset Documentation for installing and upgrading Dataset with Docker, pip, and anaconda to use for your machine learning and data science projects. 
---

Install Dataset on premises or in the cloud. Choose the install method that works best for your environment:
- [Install with pip](#Install-with-pip)
- [Install with Docker](#Install-with-Docker)
- [Install from source](#Install-from-source)
- [Install with Anaconda](#Install-with-Anaconda)
- [Install for local development](#Install-for-local-development)
- [Upgrade Dataset](#Upgrade-Label-Studio)


## System requirements
You can install Dataset on a Linux, Windows, or MacOSX machine running Python 3.6 or later. 

### Install prerequisite
Install Dataset in a clean Python environment. We highly recommend using a virtual environment (venv or conda) to reduce the likelihood of package conflicts or missing packages. 

### Port requirements
Dataset expects port 8080 to be open by default. To use a different port, specify it when starting Dataset. See [Start Dataset](start.html). 

### Disk space requirements
Allocate disk space according to the amount of data you plan to label. As a benchmark, 1 million labeling tasks take up approximately 2.3GB on disk when using the SQLite database. For more on using Dataset at scale and labeling performance, see [Start Dataset](start.html). 

### Web browser support
Dataset is tested with the latest version of Google Chrome and is expected to work in the latest versions of:
- Google Chrome
- Apple Safari
- Mozilla Firefox

If using other web browsers, or older versions of supported web browsers, unexpected behavior could occur. 


## Install with pip

To install Dataset using pip, you need Python>=3.6 and run:
```bash
pip install label-studio
```

Then, start Dataset:

```bash
label-studio
```
The default web browser opens automatically at [http://localhost:8080](http://localhost:8080) with Dataset.


## Install with Docker

Dataset is also available as a Docker container. Make sure you have [Docker](https://www.docker.com/) installed on your machine.


### Install with Docker on *nix
To install and start Dataset at [http://localhost:8080](http://localhost:8080), storing all labeling data in `./my_project` directory, run the following:
```bash
docker run -it -p 8080:8080 -v `pwd`/mydata:/label-studio/data heartexlabs/label-studio:latest
```

### Install with Docker on Windows
Or for Windows, you have to modify the volumes paths set by `-v` option.

#### Override the default Docker install
You can override the default Docker install by appending new arguments: 
```bash
docker run -it -p 8080:8080 -v `pwd`/mydata:/label-studio/data heartexlabs/label-studio:latest label-studio --log-level DEBUG
```

### Build a local image with Docker
If you want to build a local image, run:
```bash
docker build -t heartexlabs/label-studio:latest .
```

### Run with Docker Compose
Use Docker Compose to serve Dataset at `http://localhost:8080`.

Start Dataset:
```bash
docker-compose up -d
```

This starts Dataset with a PostgreSQL database backend. You can also use a PostgreSQL database without Docker Compose. See [Set up database storage](storedata.html).

## Install from source

If you want to use nightly builds or extend the functionality, consider downloading the source code using Git and running Dataset locally:

```bash
git clone https://github.com/heartexlabs/label-studio.git
cd label-studio
python setup.py develop
```

Then, start Dataset:

```bash
label-studio 
```
The default web browser opens automatically at [http://localhost:8080](http://localhost:8080).


## Install with Anaconda

```bash
conda create --name label-studio python=3.8
conda activate label-studio
pip install label-studio
```

## Troubleshoot installation

You might see errors when installing Dataset. Follow these steps to resolve them.

### Run the latest version of Dataset
Many bugs might be fixed in patch releases or maintenance releases. Make sure you're running the latest version of Dataset by upgrading your installation before you start Dataset. 

### Errors about missing packages

If you see errors about missing packages, install those packages and try to install Dataset again. Make sure that you run Dataset in a clean Python environment, such as a virtual environment.

For Windows users the default installation might fail to build the `lxml` package. Consider manually installing it from [the unofficial Windows binaries](https://www.lfd.uci.edu/~gohlke/pythonlibs/#lxml). If you are running Windows 64-bit with Python 3.8 or later, run `pip install lxml‑4.5.0‑cp38‑cp38‑win_amd64.whl` to install it. 


### Errors from Dataset 

If you see any other errors during installation, try to rerun the installation.

```bash
pip install --ignore-installed label-studio
```


## Upgrade Dataset
To upgrade to the latest version of Dataset, reinstall or upgrade using pip. 


```bash
pip install --upgrade label-studio
```

Migration scripts run when you upgrade to version 1.0.0 from version 0.9.1 or earlier. 

To make sure an existing project gets migrated, when you [start Dataset](start.html), run the following command:

```bash
label-studio start path/to/old/project 
```

The most important change to be aware of is changes to rename "completions" to "annotations". See the [updated JSON format for completed tasks](export.html#Raw_JSON_format_of_completed_tasks). 

If you customized the Dataset Frontend, see the [Frontend reference guide](frontend_reference.html) for required updates to maintain compatibility with version 1.0.0.  
