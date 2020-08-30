"""
Scrapes the emblem parts from the Metal Gear wiki site.
"""

import logging
from string import ascii_uppercase
from urllib.parse import urlparse
import scrapy
from scrapy_splash import SplashRequest
from emblemscraper.items import EmblemPartGroup, EmblemPartItem


class PartsSpider(scrapy.Spider):
    """
    A scrapy spider to get the emblem parts from the Metal Gear wiki site.
    """

    name = 'parts'
    allowed_domains = ['metalgear.fandom.com']

    def start_requests(self):
        return [
            SplashRequest('https://metalgear.fandom.com/wiki/Emblem',
                          args={'wait': 5})
        ]

    def parse(self, response):  # pylint: disable=arguments-differ
        # Back normal
        for item in parse_gallery(response, 'gallery-0',
                                  EmblemPartGroup.BACK_NORMAL):
            yield item

        # Back special
        for item in parse_gallery(response, 'gallery-1',
                                  EmblemPartGroup.BACK_SPECIAL):
            yield item

        # Front normal
        for item in parse_gallery(response, 'gallery-2',
                                  EmblemPartGroup.FRONT_NORMAL):
            yield item

        # Front animals
        for item in parse_gallery(response, 'gallery-3',
                                  EmblemPartGroup.FRONT_ANIMALS):
            yield item

        # Front codenames
        for item in parse_gallery(response, 'gallery-4',
                                  EmblemPartGroup.FRONT_CODENAMES):
            yield item

        # Front special
        for item in parse_gallery(response, 'gallery-5',
                                  EmblemPartGroup.FRONT_SPECIAL):
            yield item

        # Front FOB
        # Figure out how to make the background transparent on these.
        # for item in parse_gallery(response, 'gallery-6',
        #                           EmblemPartGroup.FRONT_SPECIAL):
        #     yield item

        # Numbers
        for i in range(10):
            yield EmblemPartItem(name=str(i), group=EmblemPartGroup.WORD_NUMBER)

        for i in range(100):
            yield EmblemPartItem(name='{:02d}'.format(i),
                                 group=EmblemPartGroup.WORD_NUMBER)

        # Letters
        for letter in ascii_uppercase:
            yield EmblemPartItem(name=letter, group=EmblemPartGroup.WORD_LETTER)

        # Word normal
        for table_row in response.css('.article-table tr')[1:]:
            name = table_row.css('td::text').get()
            yield EmblemPartItem(name=name, group=EmblemPartGroup.WORD_NORMAL)

        # Phonetic codes
        for code in response.css('h3:contains("Phonetic Codes") + ul').css(
                'li::text').getall():
            yield EmblemPartItem(name=code, group=EmblemPartGroup.WORD_PHONETIC)

        # Codenames
        for code in response.css('h3:contains(Codenames) + p + ul').css(
                'li::text').getall():
            yield EmblemPartItem(name=code,
                                 group=EmblemPartGroup.WORD_CODENAMES)


def parse_gallery(response, gallery_id, group):
    """
    Parses a wiki gallery into a list of items.
    """

    items = response.css('#{} .wikia-gallery-item'.format(gallery_id))
    return [parse_image_item(group, item) for item in items]


def parse_image_item(group, item):
    """
    Parses an image from the wiki gallery.
    """

    url = cleanup_image_url(item.css('img::attr(data-src)').get())

    name = item.css('abbr::text').get()
    if not name:
        name = item.css('abbr b::text').get()
    if not name:
        name = item.css('.lightbox-caption b::text').get()
    if not name:
        name = item.css('.lightbox-caption::text').get()
    name = name.split('/')[0]
    name = name.split('\n')[0].strip()

    if not url:
        logging.error('missing image from %s', item.get())
        return None

    if not name:
        logging.error('missing name from %s', item.get())
        return None

    return EmblemPartItem(name=name, group=group, file_urls=[url])


def cleanup_image_url(url):
    """
    Removes all resizing parameters from an image URL on the wiki.
    """

    url = urlparse(url)
    path = url.path.split('/')
    # Find the path to the base image, not the scaled image
    base_index = 0
    for i, path_part in enumerate(path):
        if '.png' in path_part:
            base_index = i
    path = path[:base_index + 1]
    return '{}://{}{}'.format(url.scheme, url.netloc, '/'.join(path))
