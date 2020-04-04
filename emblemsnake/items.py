# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

from enum import Enum, auto
import scrapy


class EmblemPartGroup(Enum):
    BACK_NORMAL = auto()
    BACK_SPECIAL = auto()
    FRONT_NORMAL = auto()
    FRONT_ANIMALS = auto()
    FRONT_CODENAMES = auto()
    FRONT_SPECIAL = auto()
    WORD_NUMBER = auto()
    WORD_LETTER = auto()
    WORD_NORMAL = auto()
    WORD_PHONETIC = auto()
    WORD_CODENAMES = auto()


image_groups = set([
    EmblemPartGroup.BACK_NORMAL, EmblemPartGroup.BACK_SPECIAL,
    EmblemPartGroup.FRONT_NORMAL, EmblemPartGroup.FRONT_ANIMALS,
    EmblemPartGroup.FRONT_CODENAMES, EmblemPartGroup.FRONT_SPECIAL
])


class EmblemPartItem(scrapy.Item):
    name = scrapy.Field()
    group = scrapy.Field()
    path = scrapy.Field()
