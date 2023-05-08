# Gatsby Theme Replica ![npm](https://img.shields.io/npm/v/gatsby-theme-replica?color=default) ![npm (tag)](https://img.shields.io/npm/v/gatsby-theme-replica/next) ![NPM](https://img.shields.io/npm/l/gatsby-theme-replica?color=blue)

Because we love octocat! :two_hearts:

This theme is still in a very early stage, issues & Contributions are welcome!

## Post upgrade to all latest packages

### Status: 

- all plugins and dependencies updated to latest ones
- home page loads
- all other pages load without errors
- the theme is essentially usable to be used for blogging
- disqus is commented out in the article page template 
- no known runtime errors so far
- there are lot of build time warnings

### TODOs

- try out the plugin for my blog and fix issues that may arise
- enable disqus for comments / questions / junta /janata participation
- rss is not working 
- images / svgs don't seem to work as of now
- update all the graphql queries to the latest format from the deprecated format
- fix css parts that are currently commented out (are marked with TODOs)
- attend to warnings at build time
  - triage and fix 
- attend to TODOs marked in code 
  - triage and fix
- add search and pagination to archives, categories and tags pages

## Quick Start

Please use `yarn` as there is no `npm.lock` yet

To get a stable version

```bash
yarn add gatsby-theme-replica
```

or to get the latest preview version

```bash
yarn add gatsby-theme-replica@next
```

## gatsby-config.js

### Add `gatsby-theme-replica` into plugin

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-theme-replica',
      options: {
        contentPath: 'content', // folder of your post source
      },
    },
  ],
};
```

### siteMetadata

Please refer to [gatsby-config](example/gatsby-config.js)

## Posts

### README

Create a README.md under your post source folder, the content will appear at the blog's homepage just like github's username/username/README.md does.

### Frontmatter of `post.md`

- date: You may need to specify your timezone explicitly to get the calendar and date right.
  - valid format: https://yaml.org/type/timestamp.html
- tags: must be an array
- category: string

```md
title: This is a title
date: 2020-12-01 18:46:26 +8
tags: [promise]
category: JS
```

### 3rd Party Code & iframe

Links from `jsfiddle`, `gist` will be converted to iframe block automatically. [Example](example/content/example-post-3.md)

### js fiddle

```md
https://jsfiddle.net/HiiTea/ac2j48Ln/3/embedded/result,html,css
```

### gist block

```md
https://gist.github.com/sabrinaluo/1990a3f5ab6df31b8b82e41a4a399505
```

## Plugins

### Disqus

Add disqus config into `gatsby-config.js` to enable disqus plugin. It appears at the bottom of post page when enabled.
