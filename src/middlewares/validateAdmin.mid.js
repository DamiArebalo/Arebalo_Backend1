export default async function validateAdmin(req, res, next) {
    let user = req.user;
    if (user.role !== 'ADMIN') {
        return res.json401();
    }
    next();
}