/*
 * grunt-remove
 * https://github.com/nvoinov/grunt-remove
 *
 * Copyright (c) 2013 nvoinov
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    fs = require('fs');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('remove', 'Your task description goes here.', function() {
      var options = this.options();
      var dirList = this.data.dirList;
      var fileList = this.data.fileList;
      var isExists = fs.existsSync || path.existsSync;

      var i = 0;

      var delete_file = function(path) {
          try {
              fs.unlinkSync(path);
          } catch(e) {
              grunt.log.writeln('Unable to delete file: "' + path + '" Message : ' + e.toString());
          }
      };

      var delete_dir= function(path) {
          try {
              fs.rmdirSync(path);
          } catch(e) {
              grunt.log.writeln('Unable to delete directory: "' + path + '" Message : ' + e.toString());
          }
      };

      var isFile = function(path) {
        return fs.statSync(path).isFile()
      };

      var isDirectory = function(path) {
        return fs.statSync(path).isDirectory()
      };

      var delete_files_in_folder = function (dir) {
          var iFile = 0;
          var dFileList, filePath;

          try {
              dFileList = fs.readdirSync(dir);
          } catch(e) {
              grunt.log.writeln('Error read directoty. ' + dir + ' Message : ' + e.toString());
              return;
          }
          if (dFileList.length > 0) {
              for(iFile = 0; iFile < dFileList.length; iFile += 1) {
                  filePath = path.resolve(dir, dFileList[iFile]);

                  if (isFile(filePath)) {
                      grunt.log.writeln('Delete file: ' + filePath);
                      delete_file(filePath);
                  } else {
                      if (isDirectory(filePath)) {
                          grunt.log.writeln('Delete files in dir: ' + filePath);
                          delete_files_in_folder(filePath);
                      }
                  }
              }
          }

          grunt.log.writeln('Delete dir: ' + dir);
          delete_dir(dir);
      };

      grunt.log.writeln('Start Delete folders...');

      if (dirList && dirList.length > 0) {
          for (i = 0; i < dirList.length; i += 1) {
              if (isExists(dirList[i])) {
                  delete_files_in_folder(dirList[i]);
              }
          }
      }

      grunt.log.writeln('Start Delete Files...');

      if (fileList && fileList.length > 0) {
          for (i = 0; i < fileList.length; i += 1) {
              grunt.log.writeln('Delete File: ' + fileList[i]);
              if (isExists(fileList[i])) {
                  if (isFile(fileList[i])) {
                      delete_file(fileList[i]);
                  }
              }
          }
      }
  });

};
