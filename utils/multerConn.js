const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure the directory 'uploads' exists
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  const allowedFileTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'video/mp4',
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Set the maximum file size to 5 MB
  fileFilter: fileFilter,
});

const singleUpload = (fieldName) => {
  return async (req, res, next) => {
    try {
      await upload.single(fieldName)(req, res, (err) => {
        if (err) {
          return res.status(400).json({ msg: 'Failed to upload file: ' + err });
        }

        if (!req.file) {
          return res.status(400).json({ msg: 'No file uploaded' });
        }

        req.body.filename = req.file.filename;
        next();
      });
    } catch (err) {
      res.status(400).json({ msg: 'Failed to upload file: ' + err });
    }
  };
};

module.exports = { singleUpload };
