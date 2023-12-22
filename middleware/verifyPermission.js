

const checkPermissions = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            const user = req.user;

            if (requiredPermissions.role && user.role !== requiredPermissions.role) {
                return res.status(403).json({ error: 'Insufficient role permissions' });
            }

            if (requiredPermissions.permissions) {
                for (const permission of requiredPermissions.permissions) {
                    if (!user[permission]) {
                        return res.status(403).json({ error: 'Insufficient permissions' });
                    }
                }
            }

            // User has the required permissions and role, proceed to the next middleware or route handler
            next();
        } catch (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
};


module.exports = checkPermissions