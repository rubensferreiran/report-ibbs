/* eslint-disable no-undef */
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async getAll(req, res) {
        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para listar usuários.'
        try {
            const users = await User.find().populate({
                path: 'oficce',
                select: 'nameoficce',
            });
            return res.json(users);
        } catch (error) {
            return res
                .status(400)
                .send({ error: `Erro ao listar os usuários - ${error}` });
        }
    },

    async getById(req, res) {
        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para obter usuário através do ID.'
        try {
            const { _id } = req.params;
            const user = await User.findOne({ _id: _id }).populate({
                path: 'oficce',
                select: 'nameoficce',
            });
            return res.json(user);
        } catch (error) {
            return res
                .status(400)
                .send({ error: `Erro ao retornar um usuário - ${error}` });
        }
    },

    async insert(req, res) {
        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para cadastrar usúario.'
        const { oficce, firstname, lastname, email, password, phone } =
            req.body;
        try {
            const regex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#@$%&])[A-Za-z\d!#@$%&]{8,16}$/;
            if (!regex.test(password)) {
                return res.status(400).json({ error: 'Senha inválida' });
            }

            if (await User.findOne({ email })) {
                return res.status(400).json({ error: 'Usuário já existe' });
            }

            const first = firstname.split(' ');
            const last = lastname.split(' ');

            const user = `${first}.${last}`.toLowerCase();

            const userLogin = await User.create({
                oficce,
                firstname,
                lastname,
                user,
                email,
                password,
                phone,
            });
            return res.json({ userLogin });
        } catch (error) {
            console.log(error);
            return res
                .status(400)
                .json({ error: 'Falha ao registrar usuário.' });
        }
    },

    async login(req, res) {
        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para fazer login do usúario.'
        try {
            const { user, password } = req.body;
            if (!(user && password)) {
                res.status(400).send('Campos obrigatórios');
            }
            const userLogin = await User.findOne({ user });
            if (!userLogin) {
                return res
                    .status(400)
                    .json({ error: 'Usuário não encontrado' });
            }
            const passwordMatches = await bcrypt.compareSync(
                password,
                userLogin.password,
            );
            if (passwordMatches) {
                const token = jwt.sign(
                    { userLogin, user },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: process.env.ACCESS_TOKEN_DURATION,
                    },
                );
                user.token = token;

                return res.status(200).json(userLogin);
            } else {
                return res.status(400).json({ error: 'Senha incorreta' });
            }
        } catch (error) {
            return res
                .status(500)
                .send({ error: `'Ocorreu um erro interno - ${error}` });
        }
    },

    async update(req, res) {
        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para editar usúario.'
        try {
            const { _id } = req.params;
            const { password } = req.body;
            const regex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#@$%&])[A-Za-z\d!#@$%&]{8,16}$/;
            if (!regex.test(password)) {
                return res.status(400).json({ error: 'Senha inválida' });
            }
            await User.updateOne(
                { _id: _id },
                {
                    password,
                },
            );
            return res.json({ msg: 'Senha atualizada com sucesso!' });
        } catch (error) {
            return res
                .status(400)
                .send({ error: `Erro ao atualizar um usuário - ${error}` });
        }
    },

    // async delete(req, res) {
    //     // #swagger.tags = ['User']
    //     // #swagger.description = 'Endpoint para excluir usúario.'
    //     try {
    //         const { _id } = req.params;
    //         await User.findOneAndDelete({ _id: _id });
    //         return res.json({ msg: 'Usúario excluído com sucesso!' });
    //     } catch (error) {
    //         return res.json({ error: 'Erro ao excluir um usuário' });
    //     }
    // },
};
