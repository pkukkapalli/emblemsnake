# Codename Emblem Snake

Create [Metal Gear Solid V emblems](https://metalgear.fandom.com/wiki/Emblem) and use them as phone and desktop wallpapers.

![Example emblems you could create](assets/hero-image.png)

Visit [emblemsnake.com](https://emblemsnake.com).

## Developing locally

First install the npm packages:

```sh
npm install --also=dev
```

Then, start the development server and open http://localhost:8080:

```sh
npm start
```

## Test the production server

The app is deployed using [Docker](docker.com). If you want to test out the Docker container locally, run:

```sh
./scripts/docker-server.sh
```

## Gather image assets

**Make sure you have [Docker](docker.com) and [Pipenv](https://pypi.org/project/pipenv/) installed first.**

First install the pipenv and node packages:

```sh
npm install --dev && pipenv install --dev
```

These are already part of the repository, but if you want to refresh the assets, run the following commands:

```sh
./scripts/splash-server.sh
```

Then, in a separate terminal:

```sh
./scripts/scraper.sh && ./scripts/word-renderer.js
```

`splash-server.sh` runs a Docker instance of [Splash](https://www.scrapinghub.com/splash/) to run the Javascript on webpages visited by the scraper.

## Acknowledgments

Thanks to Kojima Productions and Konami for making MGSV, particularly the Mother Base emblems.
