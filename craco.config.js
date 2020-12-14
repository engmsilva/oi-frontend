const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': '#f96038',
          '@link-color': '#f96038',
          '@table-header-bg': '#f96038',
          '@table-header-color': '#FFFFFF',
          '@layout-header-background': '#FFFFFF',
          '@layout-header-height': '85px',
          '@layout-header-padding': '0 30px',
        },
      },
    },
  ],
};