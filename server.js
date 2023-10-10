#!/usr/bin/env node

const path = require('path');

const deepmerge = require('@fastify/deepmerge')
const fs = require('fs-extra');

const DocumentationCoverage = require('./lib/index');


const defaultConfig = {
  source: './lib', // './src',
  excludedPaths: [
    '/assets/',
    '/components/',
    '/containers/',
    '/__test__/',
    '/config./',
    '__snapshots__',
  ],
  excludedComponentPaths: ['/__test__/'],
  foldersWithComponentFiles: ['components', 'containers'],
  storiesFolderPath: './stories',
};


const merge = deepmerge()


class DocumentationCoverageCli {
  /**
   * find config file.
   * @returns {string|null} config file path.
   */
  static findConfigFilePath() {
    try {
      const filePath = path.resolve('./.doccoverage.json');
      fs.readFileSync(filePath);
      return filePath;
    } catch (e) {
      // ignore
    }

    try {
      const filePath = path.resolve('./.doccoverage.js');
      fs.readFileSync(filePath);
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
    const configJSON = fs.readFileSync(configFilePath, { encode: 'utf8' });
    const config = JSON.parse(configJSON);
    return config;
  }

  static exec() {
    let config;
    const configPath = this.findConfigFilePath();
    if (configPath) {
      config = this.createConfigFromJSONFile(configPath);
    }

    DocumentationCoverage.generateReport(
      config ? merge(defaultConfig, config) : defaultConfig
    );
  }
}
DocumentationCoverageCli.exec();
