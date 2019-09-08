const archiver = require('archiver');
const fs = require('fs');

var output = fs.createWriteStream('dist.zip');
var archive = archiver('zip');

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);
archive.glob('dist/**');
archive.glob('.ebextensions/**');
archive.finalize();
