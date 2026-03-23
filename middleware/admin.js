export default (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ status: false, message: 'Access denied. Admin only.' });
    }
};
