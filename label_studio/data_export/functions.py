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

_DATASET_FORMAT_INFO_EN = {
        Format.JSON: {
            'title': 'JSON',
            'description': "List of items in raw JSON format stored in one JSON file. Use to export both the data "
                           "and the annotations for a dataset.",
            'link': 'https://dataset.vn/guide/export.html#JSON'
        },
        Format.JSON_MIN: {
            'title': 'JSON-MIN',
            'description': 'List of items where only "from_name", "to_name" values from the raw JSON format are '
                           'exported. Use to export only the annotations for a dataset.',
            'link': 'https://dataset.vn/guide/export.html#JSON-MIN',
        },
        Format.CSV: {
            'title': 'CSV',
            'description': 'Results are stored as comma-separated values with the column names specified by the '
                           'values of the "from_name" and "to_name" fields.',
            'link': 'https://dataset.vn/guide/export.html#CSV'
        },
        Format.TSV: {
            'title': 'TSV',
            'description': 'Results are stored in tab-separated tabular file with column names specified by '
                           '"from_name" "to_name" values',
            'link': 'https://dataset.vn/guide/export.html#TSV'
        },
        Format.CONLL2003: {
            'title': 'CONLL2003',
            'description': 'Popular format used for the CoNLL-2003 named entity recognition challenge.',
            'link': 'https://dataset.vn/guide/export.html#CONLL2003',
            'tags': ['sequence labeling', 'text tagging', 'named entity recognition']
        },
        Format.COCO: {
            'title': 'COCO',
            'description': 'Popular machine learning format used by the COCO dataset for object detection and image '
                           'segmentation tasks with polygons and rectangles.',
            'link': 'https://dataset.vn/guide/export.html#COCO',
            'tags': ['image segmentation', 'object detection']
        },
        Format.VOC: {
            'title': 'Pascal VOC XML',
            'description': 'Popular XML format used for object detection and polygon image segmentation tasks.',
            'link': 'https://dataset.vn/guide/export.html#Pascal-VOC-XML',
            'tags': ['image segmentation', 'object detection']
        },
        Format.YOLO: {
            'title': 'YOLO',
            'description': 'Popular TXT format is created for each image file. Each txt file contains annotations for '
                           'the corresponding image file, that is object class, object coordinates, height & width.',
            'link': 'https://dataset.vn/guide/export.html#YOLO',
            'tags': ['image segmentation', 'object detection']
        },
        Format.BRUSH_TO_NUMPY: {
            'title': 'Brush labels to NumPy',
            'description': 'Export your brush labels as NumPy 2d arrays. Each label outputs as one image.',
            'link': 'https://dataset.vn/guide/export.html#Brush-labels-to-NumPy-amp-PNG',
            'tags': ['image segmentation']
        },
        Format.BRUSH_TO_PNG: {
            'title': 'Brush labels to PNG',
            'description': 'Export your brush labels as PNG images. Each label outputs as one image.',
            'link': 'https://dataset.vn/guide/export.html#Brush-labels-to-NumPy-amp-PNG',
            'tags': ['image segmentation']
        },
        Format.ASR_MANIFEST: {
            'title': 'ASR Manifest',
            'description': 'Export audio transcription labels for automatic speech recognition as the JSON manifest '
                           'format expected by NVIDIA NeMo models.',
            'link': 'https://dataset.vn/guide/export.html#ASR-MANIFEST',
            'tags': ['speech recognition']
        }
    }


def all_dts_formats():
    return _DATASET_FORMAT_INFO_EN



# _DATASET_FORMAT_INFO_VI = {
#         Format.JSON: {
#             'title': 'JSON',
#             'description': "List of items in raw JSON format stored in one JSON file. Use to export both the data "
#                            "and the annotations for a dataset.",
#             'link': 'https://labelstud.io/guide/export.html#JSON'
#         },
#         Format.JSON_MIN: {
#             'title': 'JSON-MIN',
#             'description': 'List of items where only "from_name", "to_name" values from the raw JSON format are '
#                            'exported. Use to export only the annotations for a dataset.',
#             'link': 'https://labelstud.io/guide/export.html#JSON-MIN',
#         },
#         Format.CSV: {
#             'title': 'CSV',
#             'description': 'Results are stored as comma-separated values with the column names specified by the '
#                            'values of the "from_name" and "to_name" fields.',
#             'link': 'https://labelstud.io/guide/export.html#CSV'
#         },
#         Format.TSV: {
#             'title': 'TSV',
#             'description': 'Results are stored in tab-separated tabular file with column names specified by '
#                            '"from_name" "to_name" values',
#             'link': 'https://labelstud.io/guide/export.html#TSV'
#         },
#         Format.CONLL2003: {
#             'title': 'CONLL2003',
#             'description': 'Popular format used for the CoNLL-2003 named entity recognition challenge.',
#             'link': 'https://labelstud.io/guide/export.html#CONLL2003',
#             'tags': ['sequence labeling', 'text tagging', 'named entity recognition']
#         },
#         Format.COCO: {
#             'title': 'COCO',
#             'description': 'Popular machine learning format used by the COCO dataset for object detection and image '
#                            'segmentation tasks with polygons and rectangles.',
#             'link': 'https://labelstud.io/guide/export.html#COCO',
#             'tags': ['image segmentation', 'object detection']
#         },
#         Format.VOC: {
#             'title': 'Pascal VOC XML',
#             'description': 'Popular XML format used for object detection and polygon image segmentation tasks.',
#             'link': 'https://labelstud.io/guide/export.html#Pascal-VOC-XML',
#             'tags': ['image segmentation', 'object detection']
#         },
#         Format.YOLO: {
#             'title': 'YOLO',
#             'description': 'Popular TXT format is created for each image file. Each txt file contains annotations for '
#                            'the corresponding image file, that is object class, object coordinates, height & width.',
#             'link': 'https://labelstud.io/guide/export.html#YOLO',
#             'tags': ['image segmentation', 'object detection']
#         },
#         Format.BRUSH_TO_NUMPY: {
#             'title': 'Brush labels to NumPy',
#             'description': 'Export your brush labels as NumPy 2d arrays. Each label outputs as one image.',
#             'link': 'https://labelstud.io/guide/export.html#Brush-labels-to-NumPy-amp-PNG',
#             'tags': ['image segmentation']
#         },
#         Format.BRUSH_TO_PNG: {
#             'title': 'Brush labels to PNG',
#             'description': 'Export your brush labels as PNG images. Each label outputs as one image.',
#             'link': 'https://labelstud.io/guide/export.html#Brush-labels-to-NumPy-amp-PNG',
#             'tags': ['image segmentation']
#         },
#         Format.ASR_MANIFEST: {
#             'title': 'ASR Manifest',
#             'description': 'Export audio transcription labels for automatic speech recognition as the JSON manifest '
#                            'format expected by NVIDIA NeMo models.',
#             'link': 'https://labelstud.io/guide/export.html#ASR-MANIFEST',
#             'tags': ['speech recognition']
#         }
#     }