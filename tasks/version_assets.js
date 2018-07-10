/*
 * grunt-version-assets
 * https://github.com/basti1302/grunt-version-assets
 *
 * Copyright (c) 2014 Bastian Krol
 * Licensed under the MIT license.
 */

'use strict';

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

    var grepFilesExpanded = grunt.file.expandMapping(options.grepFiles);

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

    var versioner = new Version({
      assets: assets,
      grepFiles: grepFiles,
      keepOriginal: options.keepOriginal,
      newVersion: options.newVersion,
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
