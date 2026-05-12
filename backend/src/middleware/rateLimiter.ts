import rateLimit from 'express-rate-limit';

// Désactiver le rate limiting pour les tests de performance
export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 requêtes (au lieu de 100)
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Pour les tests, on peut complètement désactiver
export const testLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10000, // 10000 requêtes
  skip: () => process.env.NODE_ENV === 'test'
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Augmenté pour les tests
  message: 'Too many login attempts, please try again after 15 minutes'
});