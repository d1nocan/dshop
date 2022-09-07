module.exports = {
    images: {
      domains: ["static-cdn.jtvnw.net"],
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"]
      });
      return config;
    }
  }