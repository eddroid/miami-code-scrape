Install casperjs on Mac with HomeBrew
----

1. ```update brew```
1. ```brew install casperjs --devel```

Run scraper to generate scrape.json
----

```casperjs scraper.js --verbose```

scrape.json format
---
```
{
  url: "The page URL",
  title: "The page title",
  html: "The page HTML code",
}
```

Figure out the hierarchy structure based on the (poorly formatted) "Table of Contents" page and dump it to structure.json
----

```phantomjs structure.js```

structure.json format
---

```
{
  url: "The link URL",
  label: "The link text",
  parentUrl: "The parent link URL",
  parentLabel: "The parent link text"
}
```
