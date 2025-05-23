const theme = require('./src/settings/theme');

module.exports = {
  // developMiddleware should be at this top level, not inside plugins array
  developMiddleware: app => {
    app.use((req, res, next) => {
      // List of your existing pages
      const validPaths = [
        '/404/', 
        '/about/', 
        '/', 
        '/404.html', 
        '/vault/', 
        '/spybots/',
        '/orb/'
      ];
      
      // Check if the requested path exists in your site
      const requestPath = req.path.endsWith('/') ? req.path : `${req.path}/`;
      
      // If path is not valid and not a static resource or API route
      if (!validPaths.includes(requestPath) && 
          !requestPath.includes('.') && 
          !requestPath.includes('__')) {
        // Redirect to your custom 404 page
        res.redirect('/404');
        return;
      }
      
      next();
    });
  },
  // Plugins array remains the same
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