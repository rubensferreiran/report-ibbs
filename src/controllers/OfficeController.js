const Office = require('../models/Office');

module.exports = {
    // #swagger.tags = ['Office']
    // #swagger.description = 'Endpoint to list positions.'
    async getAll(req, res) {
        try {
            const offices = await Office.find();
            return res.json(offices);
        } catch (error) {
            return res
                .status(400)
                .send({ error: `Error loading positions - ${error}` });
        }
    },

    async getById(req, res) {
        // #swagger.tags = ['Office']
        // #swagger.description = 'Endpoint to obtain position through ID.'
        const { _id } = req.params;
        const oficceId = await Office.findOne({ _id: _id });
        if (!oficceId) {
            return res.status(400).json({
                success: false,
                messege: 'Position not found',
            });
        }
        return res.json(oficceId);
    },

    async insert(req, res) {
        // #swagger.tags = ['Office']
        // #swagger.description = 'Endpoint to enter job title.'
        try {
            const { nameoffice } = req.body;
            const seExistirCategoria = await Office.findOne({
                nameoffice,
            });
            if (seExistirCategoria) {
                return res
                    .status(400)
                    .json({ error: 'Position already exists' });
            }
            const office = await Office.create({ nameoffice });
            return res.json(office);
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
        // #swagger.tags = ['Office']
        // #swagger.description = 'Endpoint to update postion.'
        try {
            const { _id } = req.params;
            const { nameoffice } = req.body;
            let officeUpdate = await Office.findByIdAndUpdate(
                { _id: _id },
                { nameoffice },
                { new: true },
            );
            return res.json(officeUpdate);
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
        // #swagger.tags = ['Office']
        // #swagger.description = 'Endpoint to delete position.'
        try {
            const { _id } = req.params;
            await Office.findByIdAndDelete({ _id: _id });
            return res.json({ messege: 'Position deleted successfully!' });
        } catch (error) {
            res.status(500).json({ messege: error.messege });
        }
    },
};
