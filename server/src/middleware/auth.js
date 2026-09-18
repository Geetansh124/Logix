const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_do_not_use_in_production';

/**
 * RBAC permission matrix matching SECURITY_CONTEXT.md.
 * Format: { role: { resource: ['action', ...] } }
 */
const PERMISSIONS = {
  ncpor_director: {
    expedition: ['create', 'read', 'update', 'delete'],
    cargo: ['read'],
    inventory: ['read'],
    personnel: ['read'],
    emergency: ['read'],
    asset: ['read'],
  },
  expedition_planner: {
    expedition: ['create', 'read', 'update', 'delete'],
    cargo: ['create', 'read', 'update', 'delete'],
    inventory: ['create', 'read', 'update', 'delete'],
    personnel: ['create', 'read', 'update', 'delete'],
    emergency: ['read'],
    asset: ['create', 'read', 'update', 'delete'],
  },
  station_manager: {
    expedition: ['read'],
    cargo: ['read'],
    inventory: ['create', 'read', 'update', 'delete'],
    personnel: ['create', 'read', 'update', 'delete'],
    emergency: ['create', 'read', 'update', 'delete'],
    asset: ['create', 'read', 'update', 'delete'],
  },
  cargo_handler: {
    expedition: ['read'],
    cargo: ['create', 'read', 'update', 'delete'],
    inventory: ['read'],
    personnel: ['read'],
    emergency: ['read'],
    asset: ['read'],
  },
  emergency_responder: {
    expedition: ['read'],
    cargo: ['read'],
    inventory: ['read'],
    personnel: ['read'],
    emergency: ['create', 'read', 'update', 'delete'],
    asset: ['read'],
  },
  researcher: {
    expedition: ['read'],
    cargo: ['read'],
    inventory: ['read'],
    personnel: ['read'],
    emergency: ['read', 'create'],
    asset: ['read'],
  },
};

/**
 * Verify JWT and attach user to request.
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return res.status(401).json({ error: message });
  }
}

/**
 * RBAC authorization guard.
 * @param {string} resource - e.g. 'cargo', 'inventory'
 * @param {string} action   - e.g. 'read', 'create', 'update', 'delete'
 */
function authorize(resource, action) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const rolePerms = PERMISSIONS[req.user.role];
    if (!rolePerms) {
      return res.status(403).json({ error: 'Unknown role' });
    }

    const resourcePerms = rolePerms[resource];
    if (!resourcePerms || !resourcePerms.includes(action)) {
      return res.status(403).json({ error: `Insufficient permissions: ${resource}:${action}` });
    }

    next();
  };
}

module.exports = { authenticate, authorize, PERMISSIONS };
