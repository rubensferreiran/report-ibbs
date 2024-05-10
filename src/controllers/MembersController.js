const Members = require('../models/Members');

module.exports = {
    async getAll(req, res) {
        // #swagge.tags = ['Members']
        // #swagge.description = 'Endpoint para listar os membros.'
        try {
            const page = parseInt(req.query.page || 1);
            let limit = parseInt(req.query.limit || 10);
            const count = await Members.countDocuments({
                hidefile: false,
            });
            if (limit > count) {
                limit = count;
            }

            const members = await Members.find({
                hidefile: false,
            })
                .limit(limit)
                .skip((page - 1) * limit)
                .populate({
                    path: 'office',
                    select: 'nameoffice',
                })
                .sort({ name: 'asc' });
            return res.json({
                members,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                totalRegister: count,
                limit: limit,
            });
        } catch (error) {
            return res
                .status(400)
                .send({ error: `Erro ao carregar os membros - ${error}` });
        }
    },

    async getSearch(req, res) {
        // #swagger.tags = ['Members']
        // #swagger.description = 'Endpoint para pesquisar membros.'
        const { value } = req.query;
        if (!value || value.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "O parâmetro de pesquisa 'value' está vazio ou ausente.",
            });
        }
        const query = {
            $or: [{ name: { $regex: value, $options: 'i' } }],
            $and: [{ hidefile: false }],
        };
        const page = parseInt(req.query.page || 1);
        let limit = parseInt(req.query.limit || 10);
        const count = await Members.countDocuments(query);
        if (limit > count) {
            limit = count;
        }
        const members = await Members.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .populate({
                path: 'office',
                select: 'nameoffice',
            });
        if (members.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    'Nenhum fornecedor encontrado com os critérios fornecidos.',
            });
        }
        return res.json({
            members,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalRegister: count,
            limit: limit,
        });
    },

    async getById(req, res) {
        // #swagger.tags = ['Members']
        // #swagger.description = 'Endpoint para obter membro através do ID.'
        const { _id } = req.params;
        const member = await Members.findOne({
            _id: _id,
            hidefile: false,
        }).populate({
            path: 'office',
            select: 'nameoffice',
        });
        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Membro não encontrado',
            });
        }
        return res.json(member);
    },

    async insert(req, res) {
        // #swagger.tags = ['Members']
        // #swagger.description = 'Endpoint para inserir membros.'
        try {
            const {
                name,
                document,
                email,
                address: {
                    publicplace,
                    number,
                    cep,
                    district,
                    city,
                    state,
                    complement,
                },
                birthdate,
                phone,
                office,
                maritalstatus,
            } = req.body;

            // const birthYear = new Date(birthdate).getFullYear();
            // const currentYear = new Date().getFullYear;
            // const age = birthYear - currentYear;

            const isExist = await Members.findOne({
                document,
            });
            if (isExist) {
                return res.status(400).json({ error: 'Membro já existe' });
            }

            const member = await Members.create({
                name,
                document,
                email,
                address: {
                    publicplace,
                    number,
                    cep,
                    district,
                    city,
                    state,
                    complement,
                },
                birthdate,
                phone,
                // age,
                office,
                maritalstatus,
            });
            return res.json(member);
        } catch (error) {
            if (error.requiredFields) {
                return res.status(400).json({
                    success: false,
                    message: `Campos obrigatórios ausentes - ${error.requiredFields}`,
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: `Erro ao inserir um membro: ${error}`,
                });
            }
        }
    },

    async update(req, res) {
        // #swagger.tags = ['Members']
        // #swagger.description = 'Endpoint para atualizar membro.'
        try {
            const { _id } = req.params;
            let member = Members.findOne({ _id: _id });
            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: 'Membro não encontrado',
                });
            }
            let data = req.body;
            let keys = Object.keys(data);
            keys.forEach(key => {
                member[key] = data[key];
            });

            const {
                name = member.name,
                document = member.document,
                email = member.email,
                address = member.address,
                birthdate = member.birthdate,
                phone = member.phone,
                office = member.office,
                maritalstatus = member.maritalstatus,
            } = req.body;

            const birthYear = new Date(birthdate).getFullYear();
            const currentYear = new Date().getFullYear;
            const age = birthYear - currentYear;

            await Members.findByIdAndUpdate(
                { _id: _id },
                {
                    name,
                    document,
                    email,
                    address,
                    birthdate,
                    phone,
                    age,
                    office,
                    maritalstatus,
                },
                { new: true },
            );
            return res.json(member);
        } catch (error) {
            if (error.requiredFields) {
                return res.status(400).json({
                    success: false,
                    message: `Campos obrigatórios ausentes: ${error.requiredFields}`,
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: `Erro ao editar um membro: ${error}`,
                });
            }
        }
    },

    async delete(req, res) {
        // #swagger.tags = ['Members']
        // #swagger.description = 'Endpoint para deletar membro.'
        try {
            const { _id } = req.params;
            await Members.findByIdAndUpdate(
                _id,
                { hidefile: true },
                { new: true },
            );
            return res.json({ msg: 'Membro excluído com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};
