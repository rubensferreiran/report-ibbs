const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypesCultsSchema = new Schema({
    nametype: { type: String, required: true, uppercase: true },
});

TypesCultsSchema.pre('save', function (next) {
    const requiredFields = ['nametype'];
    const missingFields = requiredFields.filter(field => !this[field]);
    if (missingFields.length > 0) {
        const missingFieldNames = missingFields.join(', ');
        const error = new Error(
            `Campos obrigatórios ausentes: ${missingFieldNames}`,
        );
        error.requiredFields = missingFieldNames;
        return next(error);
    }
    return next();
});

module.exports = mongoose.model('TypesCults', TypesCultsSchema);
