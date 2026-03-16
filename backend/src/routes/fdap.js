const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-jwt-secret';

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

// GET /api/fdap - Liste des FDAP
router.get('/', auth, async (req, res) => {
  try {
    const { search, sort } = req.query;

    let where = {};
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    if (search) {
      where.OR = [
        { titre: { contains: search, mode: 'insensitive' } },
        { nomPrenom: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy = {};
    if (sort === 'titre') {
      orderBy = { titre: 'asc' };
    } else if (sort === 'nom') {
      orderBy = { nomPrenom: 'asc' };
    } else if (sort === 'date') {
      orderBy = { createdAt: 'desc' };
    }

    const fdaps = await prisma.fdap.findMany({
      where,
      orderBy,
      include: {
        user: { select: { id: true, nom: true, prenom: true } },
        medias: true,
      },
    });

    res.json({ count: fdaps.length, fdaps });
  } catch (error) {
    console.error('List FDAP error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/fdap/:id - Détail FDAP
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const fdap = await prisma.fdap.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { id: true, nom: true, prenom: true } },
        medias: true,
      },
    });

    if (!fdap) {
      return res.status(404).json({ error: 'FDAP non trouvée' });
    }

    if (req.user.role !== 'ADMIN' && fdap.userId !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json({ fdap });
  } catch (error) {
    console.error('Get FDAP error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/fdap - Créer FDAP
router.post('/', auth, async (req, res) => {
  try {
    const fdapData = {
      ...req.body,
      userId: req.user.id,
      dateSaisie: req.body.dateSaisie ? new Date(req.body.dateSaisie) : new Date(),
    };

    const fdap = await prisma.fdap.create({
      data: fdap,
    });

    res.status(201).json({ message: 'FDAP créée', fdap });
  } catch (error) {
    console.error('Create FDAP error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/fdap/:id - Modifier FDAP
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const existingFdap = await prisma.fdap.findUnique({ where: { id: parseInt(id) } });
    if (!existingFdap) {
      return res.status(404).json({ error: 'FDAP non trouvée' });
    }

    if (req.user.role !== 'ADMIN' && existingFdap.userId !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const fdap = await prisma.fdap.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    res.json({ message: 'FDAP mise à jour', fdap });
  } catch (error) {
    console.error('Update FDAP error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/fdap/:id - Supprimer FDAP
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const existingFdap = await prisma.fdap.findUnique({ where: { id: parseInt(id) } });
    if (!existingFdap) {
      return res.status(404).json({ error: 'FDAP non trouvée' });
    }

    if (req.user.role !== 'ADMIN' && existingFdap.userId !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    await prisma.fdap.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'FDAP supprimée' });
  } catch (error) {
    console.error('Delete FDAP error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;