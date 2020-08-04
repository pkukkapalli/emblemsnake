"""
Settings to initialize scrapy
"""

BOT_NAME = 'emblemsnake'

SPIDER_MODULES = ['src.spiders']
NEWSPIDER_MODULE = 'src.spiders'

USER_AGENT = 'emblemsnake (+http://www.pradyothkukkapalli.com)'
ROBOTSTXT_OBEY = True

SPIDER_MIDDLEWARES = {
    'scrapy_splash.SplashDeduplicateArgsMiddleware': 100,
}

DOWNLOADER_MIDDLEWARES = {
    'scrapy_splash.SplashCookiesMiddleware':
        723,
    'scrapy_splash.SplashMiddleware':
        725,
    'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware':
        810,
    'scrapy.downloadermiddlewares.retry.RetryMiddleware':
        820,
}
RETRY_TIMES = 3

ITEM_PIPELINES = {
    # Allow scrapy to download files such as images
    'scrapy.pipelines.files.FilesPipeline': 100,
    # Publish emblem assets for the emblem snake app to use
    'src.pipelines.AssetsPipeline': 300
}
FILES_STORE = '../client/assets/images'

AUTOTHROTTLE_ENABLED = True
# The average number of requests Scrapy should be sending in parallel to
# each remote server
AUTOTHROTTLE_TARGET_CONCURRENCY = 3.0

HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 604800
HTTPCACHE_DIR = 'httpcache'
HTTPCACHE_IGNORE_HTTP_CODES = [503, 504, 505, 500, 400, 401, 402, 403, 404]

SPLASH_URL = 'http://localhost:8050'
