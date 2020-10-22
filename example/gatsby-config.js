module.exports = {
  siteMetadata: {
    title: `Gatsby Theme Replica - example`,
    siteUrl: 'https://gatsby-theme-replica.vercel.app',
    siteName: `It's HiiTea Time!`,
    description: "Hiitea's tech blog for web development knowledge sharing",
    author: 'HiiTea',
    bio: 'this bio bio bio bio',
    location: 'Earth',
    email: 'hi@hiitea.io',
    link: 'https://hiitea.io',
    avatar:
      'https://avatars2.githubusercontent.com/u/5300359?s=460&u=ad93a82d45a91c8f6e70ec438d788c7e873ef6b5&v=4',
    status: {
      emoji: '🍓',
      text: 'I may be slow to respond',
      isBusy: true,
    },
    gcse: '',
    footerList: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'Github',
        link: 'https://github.com/sabrinaluo',
      },
      {
        text: 'Stack Overflow',
        link: 'https://stackoverflow.com/users/3821392/sabrina-luo',
      },
    ],
    flagCounter: {
      url: 'https://info.flagcounter.com/mx4Y',
      image:
        '//s01.flagcounter.com/count/mx4Y/bg_FFFFFF/txt_000000/border_FFFFFF/columns_3/maxflags_9/viewers_3/labels_0/pageviews_1/flags_0/percent_0/',
    },
  },
  plugins: [
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `hiitea-tech`,
      },
    },
    {
      resolve: 'gatsby-theme-replica',
      options: {
        contentPath: 'content',
      },
    },
  ],
};
