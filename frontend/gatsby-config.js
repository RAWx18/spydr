const theme = require('./src/settings/theme');

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-jss',
      options: { theme }
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Spydr',
        short_name: 'Spydr',
        start_url: '/',
        background_color: '#000000',
        theme_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        icon: 'src/images/spydr.png'
      }
    },
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/layouts/Template`)
      }
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-64916263-1'
      }
    }
  ]
};
