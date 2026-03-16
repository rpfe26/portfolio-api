const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-jwt-secret';
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// Middleware auth
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requis' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

// Configurer le stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(UPLOAD_DIR, file.fieldname.includes('photo') ? 'photos' : 'media');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/m4a'],
    video: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    photo: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  };

  const fieldNames = {
    audio: ['audio'],
    video: ['video'],
    document: ['document'],
    photo: ['photos']
  };

  let type = null;
  for (const [key, names] of Object.entries(fieldNames)) {
    if (names.some(n => file.fieldname.includes(n))) {
      type = key;
      break;
    }
  }

  if (!type) {
    return cb(new Error('Type de fichier non supporté'), false);
  }

  if (allowedTypes[type].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Type ${file.mimetype} non autorisé pour ${type}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

// POST /api/media/upload - Upload un fichier
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    const file = req.file;
    const type = file.fieldname.includes('photo') ? 'PHOTO' :
                  file.fieldname.includes('audio') ? 'AUDIO' :
                  file.fieldname.includes('video') ? 'VIDEO' : 'DOCUMENT';

    const media = await prisma.media.create({
      data: {
        type,
        filename: file.originalname,
        storedName: file.filename,
        path: file.path.replace(UPLOAD_DIR, ''),
        mimeType: file.mimetype,
        size: file.size,
        width: null,
        height: null,
        compressed: false,
        fdapId: null
      }
    });

    res.json({
      message: 'Fichier uploadé',
      media: {
        id: media.id,
        type: media.type,
        filename: media.filename,
        url: `/uploads/${type === 'PHOTO' ? 'photos' : 'media'}/${media.storedName}`
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Erreur lors de l\'upload' });
  }
});

// POST /api/media/upload-multiple - Upload plusieurs fichiers (photos)
router.post('/upload-multiple', auth, upload.array('photos', 6), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    const medias = [];

    for (const file of req.files) {
      const media = await prisma.media.create({
        data: {
          type: 'PHOTO',
          filename: file.originalname,
          storedName: file.filename,
          path: file.path.replace(UPLOAD_DIR, ''),
          mimeType: file.mimetype,
          size: file.size,
          width: null,
          height: null,
          compressed: false,
          fdapId: null
        }
      });

      medias.push({
        id: media.id,
        filename: media.filename,
        url: `/uploads/photos/${media.storedName}`
      });
    }

    res.json({ message: 'Fichiers uploadés', medias });
  } catch (error) {
    console.error('Upload multiple error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload' });
  }
});

// GET /api/media/:id - Récupérer un média
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const media = await prisma.media.findUnique({
      where: { id: parseInt(id) }
    });

    if (!media) {
      return res.status(404).json({ error: 'Média non trouvé' });
    }

    res.json({ media });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/media/:id - Supprimer un média
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const media = await prisma.media.findUnique({
      where: { id: parseInt(id) }
    });

    if (!media) {
      return res.status(404).json({ error: 'Média non trouvé' });
    }

    // Supprimer le fichier
    const filePath = path.join(UPLOAD_DIR, media.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer de la base
    await prisma.media.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Média supprimé' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;