import { Router } from "express";

class CustomRouter {
    constructor() {
        this._router = Router();
    }
    getRouter = () => this._router;
    // applyCallbacks() depende de todos los middlewares que necesite ejecutar
    // mapeamos los middlewares para que se ejecuten cada uno con (req, res, next)
    _applyCallbacks = (callbacks) =>
        callbacks.map((cb) => async (req, res, next) => {
            try {
                await cb(req, res, next);
            } catch (error) {
                return next(error);
            }
        });
    responses = (req, res, next) => {
        res.json200 = (response, message) =>
            res.status(200).json({ response, message });
        res.json201 = (response, message) =>
            res.status(201).json({ response, message });
        res.json400 = (message) => res.status(400).json({ error: message });
        res.json401 = () => res.status(401).json({ error: "Bad Auth!" });
        res.json403 = () => res.status(403).json({ error: "Forbidden!" });
        res.json404 = () => res.status(404).json({ error: "Not found!" });
        return next();
    };
    create = (path, ...cbs) => this._router.post(path,this.responses, this._applyCallbacks(cbs));
    read = (path, ...cbs) => this._router.get(path,this.responses, this._applyCallbacks(cbs));
    update = (path, ...cbs) => this._router.put(path,this.responses, this._applyCallbacks(cbs));
    destroy = (path, ...cbs) =>
        this._router.delete(path,this.responses, this._applyCallbacks(cbs));
    use = (path, ...cbs) => this._router.use(path, this._applyCallbacks(cbs));
}

export default CustomRouter;