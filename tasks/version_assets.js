/*
 * grunt-version-assets
 * https://github.com/basti1302/grunt-version-assets
 *
 * Copyright (c) 2014 Bastian Krol
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');

var Version = require("node-version-assets");

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask(
  'versioning',
  'Rename static assets and update references',
  function() {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      grepFiles: [],
      keepOriginal: true,
    });

    Object.keys(options).forEach(function(key) {
      grunt.log.debug('Option: ' + key + ': ' + JSON.stringify(options[key]));
    });

    var grepFilesExpanded = grunt.file.expandMapping({ nonull: true},
      options.grepFiles);

    grunt.log.debug('**GREPFILES**');
    var grepFiles = [];
    grepFilesExpanded.forEach(function(file) {
      grepFiles.push(file.src[0]);
      grunt.log.debug(file.src[0]);
    });

    // Iterate over all specified file groups.
    grunt.log.debug('**ASSETS**');
    var assets = [];
    this.filesSrc.forEach(function(file) {
      assets.push(file);
      grunt.log.debug(file);
    });

    // node-version-assets also checks if all files exist, but if files are
    // missing it just prints the list of all specified files and prints a
    // message that some files could not be found, without telling which one
    // exactly are missing. This is pretty annoying, therfore we duplicate this
    // check here and print a decent error message in case of missing files.
    debugger;
    var missingFiles = false;
    grepFiles.forEach(function(grepFile) {
      if (!fs.existsSync(grepFile)) {
        grunt.log.error('versioning: You asked grunt-version-assets to replace asset references in the file "' + grepFile + '", however, this file does not exist.');
        missingFiles = true;
      }
    })
    assets.forEach(function(asset) {
      if (!fs.existsSync(asset)) {
        grunt.log.error('versioning: You asked grunt-version-assets to replace asset references in the file "' + grepFile + '", however, this file does not exist.');
        grunt.log.error('versioning: You asked grunt-version-assets to rename the file "' + asset + '", however, this file does not exist.');
        missingFiles = true;
      }
    })
    if (missingFiles) {
      return done(new Error('Some files specified for versioning have not been found.'));
    }

    var versioner = new Version({
      assets: assets,
      grepFiles: grepFiles,
      keepOriginal: options.keepOriginal,
    });

    versioner.run(function(err) {
      if (err) {
        return done(err);
      } else {
        return done();
      }
    });
  });
};
