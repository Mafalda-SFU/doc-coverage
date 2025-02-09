#!/usr/bin/env node

const {readFileSync} = require('fs');
const path = require('path');

const deepmerge = require('@fastify/deepmerge')

const DocumentationCoverage = require('./lib/index');


const defaultConfig = {
  source: './src',
  excludedPaths: [
    '/assets/',
    '/components/',
    '/containers/',
    '/__test__/',
    '/config./',
    '__snapshots__',
    '/node_modules/'
  ],
  excludedComponentPaths: ['/__test__/', '/node_modules/'],
  foldersWithComponentFiles: ['components', 'containers'],
  storiesFolderPath: './stories',
};


const merge = deepmerge({all: true})


class DocumentationCoverageCli {
  /**
   * find config file.
   * @returns {string|null} config file path.
   */
  static findConfigFilePath() {
    try {
      const filePath = path.resolve('./.doccoverage.json');
      readFileSync(filePath);
      return filePath;
    } catch (e) {
      // ignore
    }

    try {
      const filePath = path.resolve('./.doccoverage.js');
      readFileSync(filePath);
      return filePath;
    } catch (e) {
      // ignore
    }
    return null;
  }

  /**
   * create config object from config file.
   * @param {string} configFilePath - config file path.
   * @return {DocCoverageConfig} config object.
   * @private
   */
  static createConfigFromJSONFile(configFile) {
    const configFilePath = path.resolve(configFile);
    const ext = path.extname(configFilePath);
    if (ext === '.js') {
      /* eslint-disable global-require */
      // eslint-disable-next-line import/no-dynamic-require
      return require(configFilePath);
    }
    const configJSON = readFileSync(configFilePath, { encode: 'utf8' });
    const config = JSON.parse(configJSON);
    return config;
  }

  static exec(source) {
    let config;
    const configPath = this.findConfigFilePath();
    if (configPath) {
      config = this.createConfigFromJSONFile(configPath);
    }

    DocumentationCoverage.generateReport(
      merge(defaultConfig, config ?? {}, source ? {source} : {})
    );
  }
}
DocumentationCoverageCli.exec(process.argv[2]);
