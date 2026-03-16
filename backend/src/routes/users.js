const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-jwt-secret';

// Middleware admin
const adminOnly = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requis' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès admin requis' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

// GET /api/users - Liste tous les utilisateurs (admin)
router.get('/', adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, nom: true, prenom: true, role: true, annee: true, niveau: true, active: true, createdAt: true },
      orderBy: { nom: 'asc' },
    });

    res.json({ count: users.length, users });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/users/:id/role - Modifier rôle (admin)
router.put('/:id/role', adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['ADMIN', 'USER'].includes(role)) {
      return res.status(400).json({ error: 'Rôle invalide (ADMIN ou USER)' });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: { id: true, email: true, nom: true, prenom: true, role: true },
    });

    res.json({ message: 'Rôle mis à jour', user });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/users/:id/activate - Activer/désactiver (admin)
router.put('/:id/activate', adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { active: active ?? true },
      select: { id: true, email: true, active: true },
    });

    res.json({ message: active ? 'Utilisateur activé' : 'Utilisateur désactivé', user });
  } catch (error) {
    console.error('Toggle active error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;