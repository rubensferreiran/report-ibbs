const TypesCults = require('../models/TypesCults');

module.exports = {
    // #swagger.tags = ['Types Cult']
    // #swagger.description = 'Endpoint to list types.'
    async getAll(req, res) {
        try {
            const types = await TypesCults.find();
            return res.json(types);
        } catch (error) {
            return res
                .status(400)
                .send({ error: `Error loading positions - ${error}` });
        }
    },

    async getById(req, res) {
        // #swagger.tags = ['Types Cult']
        // #swagger.description = 'Endpoint to obtain type through ID.'
        const { _id } = req.params;
        const typeID = await TypesCults.findOne({ _id: _id });
        if (!typeID) {
            return res.status(400).json({
                success: false,
                messege: 'Position not found',
            });
        }
        return res.json(typeID);
    },

    async insert(req, res) {
        // #swagger.tags = ['Types Cult']
        // #swagger.description = 'Endpoint to enter job title.'
        try {
            const { nametype } = req.body;
            const isExist = await TypesCults.findOne({
                nametype,
            });
            if (isExist) {
                return res
                    .status(400)
                    .json({ error: 'Position already exists' });
            }
            const type = await TypesCults.create({ nametype });
            return res.json(type);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error: ' + error.message,
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Error when entering a position type',
                });
            }
        }
    },

    async update(req, res) {
        // #swagger.tags = ['Types Cult']
        // #swagger.description = 'Endpoint to update type.'
        try {
            const { _id } = req.params;
            const { nametype } = req.body;
            let typeUpdate = await TypesCults.findByIdAndUpdate(
                { _id: _id },
                { nametype },
                { new: true },
            );
            return res.json(typeUpdate);
        } catch (error) {
            if (error.requiredFields) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${error.requiredFields}`,
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: `Error when editing a position: ${error}`,
                });
            }
        }
    },

    async delete(req, res) {
        // #swagger.tags = ['Types Cult']
        // #swagger.description = 'Endpoint to delete type.'
        try {
            const { _id } = req.params;
            await TypesCults.findByIdAndDelete({ _id: _id });
            return res.json({ messege: 'Position deleted successfully!' });
        } catch (error) {
            res.status(500).json({ messege: error.messege });
        }
    },
};
