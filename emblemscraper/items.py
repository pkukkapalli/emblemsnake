"""
Defines the types needed to collect and understand emblem parts.
"""

from enum import Enum, auto
import scrapy


class EmblemPartGroup(Enum):
    """
    Conceptual groups that an item can belong to. Useful for organizing parts into different tabs
    in the app.
    """

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


class EmblemPartItem(scrapy.Item):  # pylint: disable=too-many-ancestors
    """
    Represents an asset that can be used as part of an emblem.
    """

    name = scrapy.Field()
    group = scrapy.Field()
    file_urls = scrapy.Field()
    files = scrapy.Field()
