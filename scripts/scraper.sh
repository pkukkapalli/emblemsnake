#!/bin/bash

rm scraper/crawl.log
(cd scraper && pipenv run scrapy crawl parts --logfile crawl.log)
