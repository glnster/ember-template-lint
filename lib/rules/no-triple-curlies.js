'use strict';

const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./_base');

module.exports = class NoTripleCurlies extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean':
        return config;
      case 'undefined':
        return false;
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      ['  * boolean - `true` to enable / `false` to disable'],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      MustacheStatement(node) {
        if (!node.escaped) {
          this.log({
            message: 'Usage of triple curly brackets is unsafe',
            node,
            source: `{{{${node.path.original}}}}`,
          });
        }
      },
    };
  }
};
