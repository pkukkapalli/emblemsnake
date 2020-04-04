# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

import logging
import requests
from urllib.parse import urlparse
from scrapy.exporters import JsonItemExporter
from emblemsnake.items import image_groups


class JsonWritePipeline:

    def __init__(self):
        self.items = []

    def open_spider(self, spider):
        # Make sure the items list is cleared before each spider.
        self.items = []

    def process_item(self, item, spider):
        self.items.append(item)
        return item

    def close_spider(self, spider):
        for item in self.items:
            if item['group'] in image_groups:
                item['path'] = clean_image_url(item['path'])

        for item in self.items:
            if item['group'] in image_groups:
                item['path'] = write_image_file(item)

        with open('parts.json', 'wb') as output:
            exporter = JsonItemExporter(output)
            exporter.start_exporting()
            for item in self.items:
                item['group'] = item['group'].name
                exporter.export_item(item)
            exporter.finish_exporting()


def clean_image_url(url):
    url = urlparse(url)
    path = url.path.split('/')
    # Find the path to the base image, not the scaled image.
    base_index = 0
    for i, part in enumerate(path):
        if '.png' in part:
            base_index = i
    path = path[:base_index + 1]
    return '{}://{}{}'.format(url.scheme, url.netloc, '/'.join(path))


def write_image_file(item):
    response = requests.get(item['path'], stream=True)
    path = 'parts/{}.png'.format(item['name'])

    if response.status_code != 200:
        logging.error('request for {} failed'.format(item['path']))
        return None

    with open(path, 'wb') as output:
        for chunk in response:
            output.write(chunk)

    return path
