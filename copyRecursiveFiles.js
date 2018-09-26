// Require File System and Path npm modules
var fs = require('fs');
var path = require('path');


// Create new Directory in Dest
var mkdir = function (dir) {
	// making directory without exception if exists
	try {
		fs.mkdirSync(dir, 0755);
	} catch (e) {
		if (e.code != "EEXIST") {
			throw e;
		}
	}
};

// Copy Directory
var copyDir = function (src, dest, filter) {

	mkdir(dest); // Create a Destination Folder 
	
	var files = fs.readdirSync(src);
	for (var i = 0; i < files.length; i++) {
		var current = fs.lstatSync(path.join(src, files[i]));

		if (current.isDirectory()) {
			copyDir(path.join(src, files[i]), path.join(dest, files[i]), filter);
		} else if (current.isSymbolicLink()) {
			var symlink = fs.readlinkSync(path.join(src, files[i]));
			fs.symlinkSync(symlink, path.join(dest, files[i]));
		} else {
			// Copy Files When Matched file extension
			if (files[i].indexOf(filter) >= 0) {
				copyFilesFromRecurDir(path.join(src, files[i]), path.join(dest, files[i]));
			}
		}
	}
};

// CopyFiles 
var copyFilesFromRecurDir = function (src, dest) {
	var oldFile = fs.createReadStream(src);
	var newFile = fs.createWriteStream(dest);
	oldFile.pipe(newFile);
};

// Modify this function call as per requirement
copyDir('SourceFolderPath', 'DestFolderPath', 'FileExtensionToBeCopied');


/*
Eg:
	copyDir('../app/', '../feature/', '.js');
*/
