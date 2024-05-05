const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfficeSchema = new Schema({
    nameoffice: { type: String, required: true, uppercase: true },
});

OfficeSchema.pre('save', function (next) {
    const requiredFields = ['nameoffice'];
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

module.exports = mongoose.model('Office', OfficeSchema);
