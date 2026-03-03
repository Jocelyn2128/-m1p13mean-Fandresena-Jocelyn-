const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crée les dossiers d'upload s'ils n'existent pas
const createUploadDirs = () => {
    const dirs = [
        'uploads',
        'uploads/products',
        'uploads/stores'
    ];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};
createUploadDirs();

// Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        // Détermine le sous-dossier selon le type d'upload
        if (req.uploadType === 'product') {
            uploadPath = 'uploads/products/';
        } else if (req.uploadType === 'store') {
            uploadPath = 'uploads/stores/';
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Nom de fichier unique: timestamp + nom original nettoyé
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        const baseName = path.basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9]/g, '-')
            .toLowerCase();
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    }
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Seules les images sont acceptées (jpeg, jpg, png, gif, webp)'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB par défaut
    }
});

// Middleware pour définir le type d'upload avant multer
const setUploadType = (type) => (req, res, next) => {
    req.uploadType = type;
    next();
};

module.exports = { upload, setUploadType };
