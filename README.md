# Codename Emblem Snake

Create [Metal Gear Solid V emblems](https://metalgear.fandom.com/wiki/Emblem) and use them as phone and desktop wallpapers.

![Example emblems you could create](assets/hero-image.png)

Visit [emblemsnake.com](https://emblemsnake.com).

## Developing locally

**Make sure you have [Docker](docker.com) installed first.**

First install the npm packages:

```sh
npm install --dev
```

Run the following two servers:

```sh
./scripts/app-server.sh
```

```sh
./scripts/draw-server.sh
```

`app-server.sh` starts the local development server that renders the webapp. The `draw-server.sh` starts a Docker container that runs a Node.js service to draw the emblems previewed and downloaded from the webapp.

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
