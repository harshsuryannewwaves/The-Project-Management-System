const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
cloud_name: 'dvh1leouv',
api_key: '134616834768465',
api_secret: '0fUo0SNZND9MwGz_lx0y7_-LZPQ'
});

const storage = new CloudinaryStorage({
cloudinary,
params: {
folder: 'vnc-projects',
resource_type: 'raw', // allow all file types
public_id: (req, file) => {
return `file-${Date.now()}`;
}
}
});

module.exports = { cloudinary, storage };