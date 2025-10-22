module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.infinus.co',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/**#*'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/grow'),
    await config.transform(config, '/grow/cfo'),
    await config.transform(config, '/grow/ceo'),
    await config.transform(config, '/cfo'),
    await config.transform(config, '/professional-services'),
    await config.transform(config, '/contact'),
    await config.transform(config, '/faq'),
  ],
  transform: async (config, path) => {
    // Set higher priority for key routes
    const keyRoutes = ['/', '/grow', '/grow/cfo', '/grow/ceo', '/cfo', '/professional-services', '/contact', '/faq'];
    const priority = keyRoutes.includes(path) ? 0.8 : 0.7;
    
    return {
      loc: path,
      changefreq: 'weekly',
      priority: priority,
      lastmod: new Date().toISOString(),
    };
  },
};
