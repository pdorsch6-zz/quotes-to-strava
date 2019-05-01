var fs = require('fs');

const path = require('path');

module.exports.createTcx = (req, res) => {
  if (req.body.tcx_file) {
    var fileContent = req.body.tcx_file;
    var fileName = req.body.tcx_filename;
  } else {
    return res.status(500).json({
      status: 'error',
      message: 'Invalid tcx'
    });
  }

  let filepath = path.join(__dirname, '../../../', 'frontend/src/tcx_files', fileName);

  fs.writeFile(filepath, fileContent, (err) => {
    if (err) throw err;

    console.log(`The file ${fileName} was succesfully saved!`);
    return res.status(200).json({
      status: 'ok',
      message: `The file ${fileName} was succesfully saved!`
    });
  });
}