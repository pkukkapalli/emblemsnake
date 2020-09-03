# Codename Emblem Snake

Create [Metal Gear Solid V emblems](https://metalgear.fandom.com/wiki/Emblem) and use them as phone and desktop wallpapers.

![Example emblems you could create](assets/hero-image.png)

## Using it

Visit [emblemsnake.com][https://emblemsnake.com].

## Developing

Run the local development server:

```sh
./scripts/app-server.sh
```

Re-scrape the emblem part images:

```sh
./scripts/splash-server.sh
```

Then, in a separate terminal:

```sh
./scripts/scraper.sh
```

Re-render the word images:

```sh
./scripts/word-renderer.js
```
