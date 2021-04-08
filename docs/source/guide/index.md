---
title: Get started with Dataset
type: guide
order: 100
meta_title: Getting Started Guide
meta_description: Dataset getting started guide for multi-typed data labeling, annotation, and exploration for machine learning and data science projects.
---

## What is Dataset?

Dataset is an open source data labeling tool for labeling and exploring multiple types of data. You can perform many different types of labeling for many different data formats. 

You can also integrate Dataset with machine learning models to supply predictions for labels (pre-labels), or perform continuous active learning. See [Set up machine learning with your labeling process](ml.html). 

<!--Dataset is also available as Enterprise and Cloud editions with additional features. See [What you get from Dataset]() for more. -->

## Quick start

1. Install Dataset:
```bash
pip install label-studio
```
2. Start Dataset
```bash
label-studio start
```
3. Open the Dataset UI at http://localhost:8080. 
4. Sign up with an email address and password that you create.
5. Click **Create** to create a project and start labeling data.
6. Name the project, and if you want, type a description and select a color.
7. Click **Data Import** and upload the data files that you want to use. If you want to use data from a cloud storage bucket or database, skip this step for now.
8. Click **Labeling Setup** and choose a template and customize the label names for your use case. 
9. Click **Save** to save your project. 

You're ready to start [labeling and annotating your data](labeling.html)!

## Labeling workflow with Dataset

All the steps required to start and finish a labeling project with Dataset:

1. [Install Dataset](install.html).
2. [Start Dataset](start.html).
2. [Create accounts for Dataset](signup.html). Create an account to manage and set up labeling projects. 
3. [Set up the labeling project](setup.html). Define the type of labeling to perform on the dataset, and add the labels that you want annotators to apply. 
4. [Import data as labeling tasks](tasks.html).
5. [Label and annotate the data](labeling.html). 
<!--6. [Review the completed labeling tasks](quality.html).-->
7. [Export the labeled data or the annotations](export.html).


## Dataset terminology

When you upload data to Dataset, each item in the dataset becomes a labeling task. The following table describes some terms you might encounter as you use Dataset.

| Term | Description |
| --- | --- |
| Dataset | What you upload to Dataset, comprised of individual items. |
| Task | What Dataset transforms your individual dataset items into. |
| Labels | What you add to each dataset item while performing a labeling task in Dataset. |
| Region | The portion of the dataset item that has a label assigned to it. | 
| Relation | A defined relationship between two labeled regions. 
| Pre-labeling | What machine learning models perform in Dataset or separate from Dataset. The result of predicting labels for items in a dataset are predicted labels, or pre-labels. |
| Annotations | The output of a labeling task. Previously called "completions". |
| Templates | Example labeling configurations that you can use to specify the type of labeling that you're performing with your dataset. See [all available templates](/templates) |
| Tags | Configuration options to customize the labeling interface. See [more about tags](/tags). |


## Components and architecture
You can use any of the Dataset components in your own tools, or customize them to suit your needs. <!--Before customizing Dataset extensively, you might want to review Dataset Enterprise Edition to see if it already contains the relevant functionality you want to build. See [What you get from Dataset](benefits.html) for more.--> 

The component parts of Dataset are available as modular extensible packages that you can integrate into your existing machine learning processes and tools. 

| Module | Technology | Description |
| --- | --- | --- | 
| [Dataset Backend](https://github.com/heartexlabs/label-studio/) | Python and [Django](https://www.djangoproject.com/) | Use to perform data labeling. | 
| [Dataset Frontend](https://github.com/heartexlabs/label-studio-frontend) | JavaScript web app using [React](https://reactjs.org/) and [MST](https://github.com/mobxjs/mobx-state-tree) | Perform data labeling in a user interface. |
| [Data Manager](https://github.com/heartexlabs/dm2) | JavaScript web app using [React](https://reactjs.org/) | Manage data and tasks for labeling. |
| [Machine Learning Backends](https://github.com/heartexlabs/label-studio-ml-backend) | Python | Predict data labels at various parts of the labeling process. |

<br>
<div style="margin:auto; text-align:center;"><img src="/images/ls-modules-scheme.png" style="opacity: 0.8"/></div>
<!--update to include data manager--> 

## Information collected by Dataset

Dataset collects anonymous usage statistics about the number of page visits and data types being used in labeling configurations that you set up. No sensitive information is included in the information we collect. The information we collect helps us improve the experience of labeling data in Dataset and helps us plan future data types and labeling configurations to support.


