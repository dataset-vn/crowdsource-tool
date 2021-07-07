"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
import shutil
import io
import hashlib
import json
import os
from datetime import datetime
from copy import deepcopy

from django.conf import settings
from django.db import models
from label_studio_converter import Converter
from core.utils.io import get_temp_dir, read_bytes_stream, get_all_files_from_dir
from core.label_config import parse_config
from core import version
from tasks.models import Annotation
# Create your models here.

from enum import Enum

class Format(Enum):
    JSON = 1
    JSON_MIN = 2
    CSV = 3
    TSV = 4
    CONLL2003 = 5
    COCO = 6
    VOC = 7
    BRUSH_TO_NUMPY = 8
    BRUSH_TO_PNG = 9
    ASR_MANIFEST = 10
    YOLO = 11

    def __str__(self):
        return self.name

    @classmethod
    def from_string(cls, s):
        try:
            return Format[s]
        except KeyError:
            raise ValueError()


class DataExport(object):

    @staticmethod
    def save_export_files(project, now, get_args, data, md5, name):
        """ Generate two files: meta info and result file and store them locally for logging
        """
        filename_results = os.path.join(settings.EXPORT_DIR, name + '.json')
        filename_info = os.path.join(settings.EXPORT_DIR, name + '-info.json')
        annotation_number = Annotation.objects.filter(task__project=project).count()
        info = {
            'project': {
                'title': project.title,
                'id': project.id,
                'created_at': project.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
                'created_by': project.created_by.email,
                'task_number': project.tasks.count(),
                'annotation_number': annotation_number
            },
            'platform': {
                'version': version.get_git_version()
            },
            'download': {
                'GET': dict(get_args),
                'time': now.strftime('%Y-%m-%dT%H:%M:%SZ'),
                'result_filename': filename_results,
                'md5': md5
            }
        }

        with open(filename_results, 'w', encoding='utf-8') as f:
            f.write(data)
        with open(filename_info, 'w', encoding='utf-8') as f:
            json.dump(info, f, ensure_ascii=False)
        return filename_results

    @staticmethod
    def get_export_formats(project):
        converter = Converter(config=project.get_parsed_config(), project_dir=None)
        formats = []
        supported_formats = set(converter.supported_formats)

        FORMAT_INFO = {
            Format.JSON: {
                'title': 'JSON',
                'description': "List of items in raw JSON format stored in one JSON file. Use to export both the data "
                            "and the annotations for a dataset.",
                'link': 'https://dataset.vn/huongdan/export.html#JSON'
            },
            Format.JSON_MIN: {
                'title': 'JSON-MIN',
                'description': 'List of items where only "from_name", "to_name" values from the raw JSON format are '
                            'exported. Use to export only the annotations for a dataset.',
                'link': 'https://dataset.vn/huongdan/export.html#JSON-MIN',
            },
            Format.CSV: {
                'title': 'CSV',
                'description': 'Results are stored as comma-separated values with the column names specified by the '
                            'values of the "from_name" and "to_name" fields.',
                'link': 'https://dataset.vn/huongdan/export.html#CSV'
            },
            Format.TSV: {
                'title': 'TSV',
                'description': 'Results are stored in tab-separated tabular file with column names specified by '
                            '"from_name" "to_name" values',
                'link': 'https://dataset.vn/huongdan/export.html#TSV'
            },
            Format.CONLL2003: {
                'title': 'CONLL2003',
                'description': 'Popular format used for the CoNLL-2003 named entity recognition challenge.',
                'link': 'https://dataset.vn/huongdan/export.html#CONLL2003',
                'tags': ['sequence labeling', 'text tagging', 'named entity recognition']
            },
            Format.COCO: {
                'title': 'COCO',
                'description': 'Popular machine learning format used by the COCO dataset for object detection and image '
                            'segmentation tasks with polygons and rectangles.',
                'link': 'https://dataset.vn/huongdan/export.html#COCO',
                'tags': ['image segmentation', 'object detection']
            },
            Format.VOC: {
                'title': 'Pascal VOC XML',
                'description': 'Popular XML format used for object detection and polygon image segmentation tasks.',
                'link': 'https://dataset.vn/huongdan/export.html#Pascal-VOC-XML',
                'tags': ['image segmentation', 'object detection']
            },
            Format.YOLO: {
                'title': 'YOLO',
                'description': 'Popular TXT format is created for each image file. Each txt file contains annotations for '
                            'the corresponding image file, that is object class, object coordinates, height & width.',
                'link': 'https://dataset.vn/huongdan/export.html#YOLO',
                'tags': ['image segmentation', 'object detection']
            },
            Format.BRUSH_TO_NUMPY: {
                'title': 'Brush labels to NumPy',
                'description': 'Export your brush labels as NumPy 2d arrays. Each label outputs as one image.',
                'link': 'https://dataset.vn/huongdan/export.html#Brush-labels-to-NumPy-amp-PNG',
                'tags': ['image segmentation']
            },
            Format.BRUSH_TO_PNG: {
                'title': 'Brush labels to PNG',
                'description': 'Export your brush labels as PNG images. Each label outputs as one image.',
                'link': 'https://dataset.vn/huongdan/export.html#Brush-labels-to-NumPy-amp-PNG',
                'tags': ['image segmentation']
            },
            Format.ASR_MANIFEST: {
                'title': 'ASR Manifest',
                'description': 'Export audio transcription labels for automatic speech recognition as the JSON manifest '
                            'format expected by NVIDIA NeMo models.',
                'link': 'https://dataset.vn/huongdan/export.html#ASR-MANIFEST',
                'tags': ['speech recognition']
            }
        }

        for format, format_info in FORMAT_INFO.items():
            format_info = deepcopy(format_info)
            format_info['name'] = format.name
            if format.name not in supported_formats:
                format_info['disabled'] = True
            formats.append(format_info)
        return sorted(formats, key=lambda f: f.get('disabled', False))

    @staticmethod
    def generate_export_file(project, tasks, output_format, get_args):
        # prepare for saving
        now = datetime.now()
        data = json.dumps(tasks, ensure_ascii=False)
        md5 = hashlib.md5(json.dumps(data).encode('utf-8')).hexdigest()
        name = 'project-' + str(project.id) + '-at-' + now.strftime('%Y-%m-%d-%H-%M') + f'-{md5[0:8]}'

        input_json = DataExport.save_export_files(project, now, get_args, data, md5, name)
        converter = Converter(
            config=project.get_parsed_config(),
            project_dir=None,
            upload_dir=os.path.join(settings.MEDIA_ROOT, settings.UPLOAD_DIR))
        with get_temp_dir() as tmp_dir:
            converter.convert(input_json, tmp_dir, output_format, is_dir=False)
            files = get_all_files_from_dir(tmp_dir)
            # if only one file is exported - no need to create archive
            if len(os.listdir(tmp_dir)) == 1:
                output_file = files[0]
                ext = os.path.splitext(output_file)[-1]
                content_type = f'application/{ext}'
                out = read_bytes_stream(output_file)
                filename = name + os.path.splitext(output_file)[-1]
                return out, content_type, filename

            # otherwise pack output directory into archive
            shutil.make_archive(tmp_dir, 'zip', tmp_dir)
            out = read_bytes_stream(os.path.abspath(tmp_dir + '.zip'))
            content_type = 'application/zip'
            filename = name + '.zip'
            return out, content_type, filename
