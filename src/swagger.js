const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./router.js'];

const doc = {
    info: {
        version: '1.0.0',
        title: 'API Relatório-IBBS',
        description:
            'Documentação para automação de gerar API de controle presença e gestão',
    },
    host: 'localhost:8282',
    basePath: '/',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'API-Controle-Membros',
            description: 'Endpoints',
        },
    ],
};
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index');
});
