"""
Defines the pipeline necessary to save emblem images in a way that can be used by the emblem snake
app.
"""

import re
import json
import hashlib
from emblemscraper.items import image_groups


def calculate_id(item):
    """
    Create a unique ID for the given item.
    """

    if item['group'] in image_groups:
        return re.split(r'/|\.', item['files'][0]['path'])[1]

    group = item['group'].name
    name = item['name']
    return hashlib.sha1('{}:{}'.format(group, name).encode('utf-8')).hexdigest()


def item_for_export(item):
    """
    Creates a dict that can be exported as JSON for the given item.
    """

    if item['group'] in image_groups:
        return {
            'name': item['name'],
            'group': item['group'].name,
            'path': item['files'][0]['path'],
        }

    return {
        'name': item['name'],
        'group': item['group'].name,
    }


class AssetsPipeline:
    """
    Pipeline to collect all of the emblem part assets into a JSON object for the app to look up.
    """

    def __init__(self):
        self.items = []

    def open_spider(self, spider):
        """
        Lifecycle method that all pipelines must implement.
        """

    def process_item(self, item, spider):  # pylint: disable=unused-argument
        """
        Takes an item and tracks for export later.
        """
        self.items.append(item)
        return item

    def close_spider(self, spider):  # pylint: disable=unused-argument
        """
        Exports all items collected so far into a JSON file.
        """

        output = {}
        for item in self.items:
            output[calculate_id(item)] = item_for_export(item)

        with open('assets/assets.json', 'w') as file:
            json.dump(output, file)
