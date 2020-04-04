# -*- coding: utf-8 -*-
import logging
from string import ascii_uppercase
import scrapy
from scrapy_splash import SplashRequest
from emblemsnake.items import EmblemPartGroup, EmblemPartItem


class PartsSpider(scrapy.Spider):
    name = 'parts'
    allowed_domains = ['metalgear.fandom.com']

    def start_requests(self):
        return [
            SplashRequest('https://metalgear.fandom.com/wiki/Emblem',
                          args={'wait': 5})
        ]

    def parse(self, response):
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
        for item in parse_gallery(response, 'gallery-6',
                                  EmblemPartGroup.FRONT_SPECIAL):
            yield item

        # Numbers
        for i in range(10):
            yield EmblemPartItem(name=str(i), group=EmblemPartGroup.WORD_NUMBER)

        for i in range(100):
            yield EmblemPartItem(name='{:2d}'.format(i),
                                 group=EmblemPartGroup.WORD_NUMBER)

        # Letters
        for l in ascii_uppercase:
            yield EmblemPartItem(name=l, group=EmblemPartGroup.WORD_LETTER)

        # Word normal
        for tr in response.css('.article-table tr')[1:]:
            name = tr.css('td').get()
            yield EmblemPartItem(name=name, group=EmblemPartGroup.WORD_NORMAL)

        # Phonetic codes
        for code in response.css('h3:contains("Phonetic Codes") + ul').css(
                'li::text').getall():
            yield EmblemPartItem(name=code, group=EmblemPartGroup.WORD_PHONETIC)

        # Codenames
        for code in response.css('h3:contains(Codenames) + ul').css(
                'li::text').getall():
            yield EmblemPartItem(name=code,
                                 group=EmblemPartGroup.WORD_CODENAMES)


def parse_gallery(response, gallery_id, group):
    items = response.css('#{} .wikia-gallery-item'.format(gallery_id))
    return [parse_item(group, item) for item in items]


def parse_item(group, item):
    image = item.css('img::attr(data-src)').get()

    name = item.css('abbr::text').get()
    if not name:
        name = item.css('abbr b::text').get()
    if not name:
        name = item.css('.lightbox-caption b::text').get()
    if not name:
        name = item.css('.lightbox-caption::text').get()
    name = name.split('/')[0]
    name = name.split('\n')[0].strip()

    if not image:
        logging.error('missing image from {}'.format(item.get()))
        return None

    if not name:
        logging.error('missing name from {}'.format(item.get()))
        return None

    return EmblemPartItem(name=name, group=group, path=image)
