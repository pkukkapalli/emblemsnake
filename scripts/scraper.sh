#!/bin/bash

rm crawl.log
pipenv run scrapy crawl parts --logfile crawl.log
