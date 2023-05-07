const fs = require('fs');
const { createFilePath } = require(`gatsby-source-filesystem`);
require('ts-node').register({ files: true });
const { slugify } = require('./src/utils/slugify');
const { UNCATEGORIZED, CATEGORY_DIR, TAG_DIR } = require('./src/constants/key');
const DEFAULT_CONTENT_PATH = 'content';
const { getDateString } = require('./_gatsby/utils/date');
const readingTime = require(`reading-time`);

// Make sure the content directory exists
exports.onPreBootstrap = ({ reporter }, options) => {
  const contentPath = options.contentPath || DEFAULT_CONTENT_PATH;

  if (!fs.existsSync(contentPath)) {
    reporter.info(`creating the ${contentPath} directory`);
    fs.mkdirSync(contentPath);
  }
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'Mdx') {
    const value = createFilePath({ node, getNode }).replace(/^\/(\d{8}-)/, '/'); // TODO configurable pattern

    const dateString = getDateString(node.frontmatter.date);
    const datePath = dateString ? `/${dateString.split('-').join('/')}` : '';

    createNodeField({
      name: 'slug',
      node,
      value: `${datePath}${value}`,
    });

    createNodeField({
      name: 'year',
      node,
      value: new Date(node.frontmatter.date).getFullYear(),
    });

    createNodeField({
      node,
      name: `timeToRead`,
      value: readingTime(node.body),
    });
  }
};

// adding slug and year to base of mdx as well to keep compatibility with the usage in templates
// TODO: phase this out; try to adhere to the plugin standard to allow for wider compatibility
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`#graphql
    type Mdx implements Node {
      slug: String @proxy(from: "fields.slug")
      year: Int @proxy(from: "fields.year")
      # You can also use other keys from fields.timeToRead if you don't want "minutes"
      timeToRead: Float @proxy(from: "fields.timeToRead.minutes")
      wordCount: Int @proxy(from: "fields.timeToRead.words")
    }
  `);
};

const pages = [
  {
    path: '',
    template: 'home',
  },
  {
    path: `${CATEGORY_DIR}`,
    template: 'categories',
  },
  {
    path: 'archives',
    template: 'archive',
  },
  {
    path: `${TAG_DIR}`,
    template: 'tags',
  },
];

exports.createPages = async ({ actions, graphql, reporter }) => {
  // Exclude README.md, it's reserved to be a section in overview page
  const result = await graphql(`
    {
      allMdx(
        filter: { slug: { ne: "README" } }
        sort: { frontmatter: { date: ASC } }
      ) {
        nodes {
          id
          slug
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
      site {
        pathPrefix
        siteMetadata {
          siteUrl
        }
      }
      tags: allMdx {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
        }
      }
      categories: allMdx {
        group(field: { frontmatter: { category: SELECT } }) {
          fieldValue
        }
      }
      uncategorized: allMdx(
        filter: { frontmatter: { category: { eq: null } } }
      ) {
        totalCount
      }
    }
  `);

  if (result.errors) {
    reporter.panic('error loading events', result.errors);
    return;
  }

  const getPermalink = (path) => {
    const { pathPrefix, siteMetadata } = result.data.site;
    return `${siteMetadata.siteUrl}${pathPrefix ?? ''}${path}`;
  };

  pages.forEach((page) => {
    actions.createPage({
      path: `/${page.path}`,
      component: require.resolve(`./src/templates/${page.template}.tsx`),
    });
  });

  const posts = result.data.allMdx.nodes;
  const tags = result.data.tags.group;
  const categories = result.data.categories.group;
  const uncategorized = result.data.uncategorized;

  try {
    posts.forEach((post, index) => {
      const prev = posts[index - 1];
      const next = posts[index + 1];
      const prevPost = prev
        ? {
            slug: prev.fields.slug,
            title: prev.frontmatter.title,
          }
        : null;

      const nextPost = next
        ? {
            slug: next.fields.slug,
            title: next.frontmatter.title,
          }
        : null;

      const pagePathWithoutPrefix = `${post.fields.slug}`;

      actions.createPage({
        path: pagePathWithoutPrefix,
        component: require.resolve('./src/templates/post.tsx'),
        context: {
          postID: post.id,
          numericId: index + 1,
          prevPost,
          nextPost,
          permalink: getPermalink(pagePathWithoutPrefix),
        },
      });
    });
  } catch (e) {
    console.error(e);
  }

  // todo ignore case
  try {
    tags.forEach((o) => {
      const slug = slugify(o.fieldValue);
      actions.createPage({
        path: `/${TAG_DIR}/${slug}`,
        component: require.resolve('./src/templates/tag.tsx'),
        context: {
          tag: o.fieldValue,
        },
      });
    });
  } catch (e) {
    console.error(e);
  }

  // todo ignore case
  try {
    categories.forEach((o) => {
      const slug = slugify(o.fieldValue);
      actions.createPage({
        path: `/${CATEGORY_DIR}/${slug}`,
        component: require.resolve('./src/templates/category.tsx'),
        context: {
          category: o.fieldValue,
        },
      });
    });

    if (uncategorized.totalCount > 0) {
      actions.createPage({
        path: `/${CATEGORY_DIR}/${UNCATEGORIZED}`,
        component: require.resolve('./src/templates/category.tsx'),
        context: {
          category: null,
        },
      });
    }
  } catch (e) {
    console.error(e);
  }
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'), // TODO check if this is actually needed.. or just can be set to false
      },
    },
  });
};
