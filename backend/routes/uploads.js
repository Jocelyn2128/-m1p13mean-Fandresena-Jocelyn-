const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const Store = require('../models/Store');
const { upload, setUploadType } = require('../middlewares/upload');

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }
    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

// Utilitaire: supprimer un fichier si il existe
const deleteFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// Utilitaire: construire l'URL publique d'une image
const buildImageUrl = (req, relativePath) => {
    return `${req.protocol}://${req.get('host')}/${relativePath.replace(/\\/g, '/')}`;
};

// =============================================
// UPLOAD D'IMAGES POUR UN PRODUIT
// =============================================

// @route   POST /api/uploads/products/:productId/images
// @desc    Ajouter des images à un produit (max 5 images)
// @access  Private (Boutique)
router.post(
    '/products/:productId/images',
    authMiddleware,
    setUploadType('product'),
    upload.array('images', 5),
    async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ success: false, message: 'Aucun fichier uploadé' });
            }

            const product = await Product.findById(req.params.productId);
            if (!product) {
                // Supprimer les fichiers uploadés si le produit n'existe pas
                req.files.forEach(f => deleteFile(f.path));
                return res.status(404).json({ success: false, message: 'Produit non trouvé' });
            }

            // Vérifier que l'utilisateur est bien propriétaire (via la boutique)
            if (req.user.role !== 'ADMIN_MALL') {
                const Store = require('../models/Store');
                const store = await Store.findOne({ _id: product.storeId, ownerId: req.user.userId });
                if (!store) {
                    req.files.forEach(f => deleteFile(f.path));
                    return res.status(403).json({ success: false, message: 'Accès refusé: vous n\'êtes pas propriétaire de ce produit' });
                }
            }

            // Construire les URLs des images uploadées
            const imageUrls = req.files.map(file => buildImageUrl(req, file.path));

            // Ajouter les nouvelles images aux images existantes
            product.images = [...(product.images || []), ...imageUrls];
            await product.save();

            res.json({
                success: true,
                message: `${req.files.length} image(s) ajoutée(s) avec succès`,
                data: {
                    images: product.images,
                    newImages: imageUrls
                }
            });
        } catch (error) {
            console.error('Upload product images error:', error);
            if (req.files) req.files.forEach(f => deleteFile(f.path));
            res.status(500).json({ success: false, message: error.message || 'Erreur serveur' });
        }
    }
);

// @route   PUT /api/uploads/products/:productId/images
// @desc    Remplacer toutes les images d'un produit
// @access  Private (Boutique)
router.put(
    '/products/:productId/images',
    authMiddleware,
    setUploadType('product'),
    upload.array('images', 5),
    async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ success: false, message: 'Aucun fichier uploadé' });
            }

            const product = await Product.findById(req.params.productId);
            if (!product) {
                req.files.forEach(f => deleteFile(f.path));
                return res.status(404).json({ success: false, message: 'Produit non trouvé' });
            }

            // Vérifier que l'utilisateur est bien propriétaire
            if (req.user.role !== 'ADMIN_MALL') {
                const store = await Store.findOne({ _id: product.storeId, ownerId: req.user.userId });
                if (!store) {
                    req.files.forEach(f => deleteFile(f.path));
                    return res.status(403).json({ success: false, message: 'Accès refusé' });
                }
            }

            // Supprimer les anciennes images du disque
            if (product.images && product.images.length > 0) {
                product.images.forEach(imageUrl => {
                    // Extraire le chemin relatif depuis l'URL
                    try {
                        const urlPath = new URL(imageUrl).pathname;
                        const localPath = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
                        deleteFile(localPath);
                    } catch (e) {
                        // Si c'est déjà un chemin relatif
                        deleteFile(imageUrl);
                    }
                });
            }

            // Construire les URLs des nouvelles images
            const imageUrls = req.files.map(file => buildImageUrl(req, file.path));
            product.images = imageUrls;
            await product.save();

            res.json({
                success: true,
                message: 'Images remplacées avec succès',
                data: { images: product.images }
            });
        } catch (error) {
            console.error('Replace product images error:', error);
            if (req.files) req.files.forEach(f => deleteFile(f.path));
            res.status(500).json({ success: false, message: error.message || 'Erreur serveur' });
        }
    }
);

// @route   DELETE /api/uploads/products/:productId/images
// @desc    Supprimer une image spécifique d'un produit
// @access  Private (Boutique)
router.delete('/products/:productId/images', authMiddleware, async (req, res) => {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'imageUrl est requis' });
        }

        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Produit non trouvé' });
        }

        // Supprimer le fichier du disque
        try {
            const urlPath = new URL(imageUrl).pathname;
            const localPath = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
            deleteFile(localPath);
        } catch (e) {
            deleteFile(imageUrl);
        }

        // Retirer l'image de la liste
        product.images = (product.images || []).filter(img => img !== imageUrl);
        await product.save();

        res.json({
            success: true,
            message: 'Image supprimée avec succès',
            data: { images: product.images }
        });
    } catch (error) {
        console.error('Delete product image error:', error);
        res.status(500).json({ success: false, message: error.message || 'Erreur serveur' });
    }
});

// =============================================
// UPLOAD D'IMAGES POUR UNE BOUTIQUE
// =============================================

// @route   POST /api/uploads/stores/:storeId/logo
// @desc    Uploader/changer le logo d'une boutique
// @access  Private (Boutique)
router.post(
    '/stores/:storeId/logo',
    authMiddleware,
    setUploadType('store'),
    upload.single('logo'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'Aucun fichier uploadé' });
            }

            const store = await Store.findById(req.params.storeId);
            if (!store) {
                deleteFile(req.file.path);
                return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
            }

            // Vérifier que l'utilisateur est le propriétaire
            if (req.user.role !== 'ADMIN_MALL' && store.ownerId.toString() !== req.user.userId) {
                deleteFile(req.file.path);
                return res.status(403).json({ success: false, message: 'Accès refusé' });
            }

            // Supprimer l'ancien logo
            if (store.logo) {
                try {
                    const urlPath = new URL(store.logo).pathname;
                    const localPath = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
                    deleteFile(localPath);
                } catch (e) {
                    deleteFile(store.logo);
                }
            }

            const logoUrl = buildImageUrl(req, req.file.path);
            store.logo = logoUrl;
            await store.save();

            res.json({
                success: true,
                message: 'Logo mis à jour avec succès',
                data: { logo: store.logo }
            });
        } catch (error) {
            console.error('Upload store logo error:', error);
            if (req.file) deleteFile(req.file.path);
            res.status(500).json({ success: false, message: error.message || 'Erreur serveur' });
        }
    }
);

// @route   POST /api/uploads/stores/:storeId/cover
// @desc    Uploader/changer l'image de couverture d'une boutique
// @access  Private (Boutique)
router.post(
    '/stores/:storeId/cover',
    authMiddleware,
    setUploadType('store'),
    upload.single('cover'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'Aucun fichier uploadé' });
            }

            const store = await Store.findById(req.params.storeId);
            if (!store) {
                deleteFile(req.file.path);
                return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
            }

            // Vérifier que l'utilisateur est le propriétaire
            if (req.user.role !== 'ADMIN_MALL' && store.ownerId.toString() !== req.user.userId) {
                deleteFile(req.file.path);
                return res.status(403).json({ success: false, message: 'Accès refusé' });
            }

            // Supprimer l'ancienne image de couverture
            if (store.coverImage) {
                try {
                    const urlPath = new URL(store.coverImage).pathname;
                    const localPath = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
                    deleteFile(localPath);
                } catch (e) {
                    deleteFile(store.coverImage);
                }
            }

            const coverUrl = buildImageUrl(req, req.file.path);
            store.coverImage = coverUrl;
            await store.save();

            res.json({
                success: true,
                message: 'Image de couverture mise à jour avec succès',
                data: { coverImage: store.coverImage }
            });
        } catch (error) {
            console.error('Upload store cover error:', error);
            if (req.file) deleteFile(req.file.path);
            res.status(500).json({ success: false, message: error.message || 'Erreur serveur' });
        }
    }
);

module.exports = router;
