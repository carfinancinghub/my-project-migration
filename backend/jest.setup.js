const moduleAlias = require('module-alias');
moduleAlias.addAliases({
  '@services': `${__dirname}/services`,
  '@utils': `${__dirname}/utils`,
  '@validation': `${__dirname}/validation`,
  '@repositories': `${__dirname}/repositories`
});
