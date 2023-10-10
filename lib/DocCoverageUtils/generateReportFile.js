const {existsSync, mkdirSync, writeFileSync} = require('fs');

const generateReportFile = (astHash, framework, componentsCoverage, data) => {
  const key = `fileWiseCoverage${
    framework ? framework.charAt(0).toUpperCase() + framework.slice(1) : 'JSX'
  }`;
  const output = {
    ...data,
    fileWiseCoverageJSFiles: astHash,
    [key]: componentsCoverage,
  };

  const dir = './doc-coverage';

  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  writeFileSync(
    `${dir}/docCoverageReport.json`,
    JSON.stringify(output, null, 4),
    'utf8'
  );
};

module.exports = generateReportFile;
