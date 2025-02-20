const {readdirSync, statSync} = require('fs');
const path = require('path');

/**
 * walk recursively in directory.
 * @param {string} dirPath - target directory path.
 * @param {function(entryPath: string)} callback - callback for each file.
 */
function walk(dirPath, callback) {
  let entries

  try {
    entries = readdirSync(dirPath);
  }
  catch (e) {
    if(e.code !== 'ENOENT') throw e
    return
  }

  entries.forEach((entry) => {
    const entryPath = path.resolve(dirPath, entry);
    const stat = statSync(entryPath);
    if (stat.isFile()) {
      callback(entryPath);
    } else if (stat.isDirectory()) {
      walk(entryPath, callback);
    }
  });
}

module.exports = walk;
