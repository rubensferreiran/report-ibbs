const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CultsSchema = new Schema({
    day: { type: Date, required: true },
    theme: { type: String, required: true, uppercase: true },
    typecult: {
        type: Schema.Types.ObjectId,
        ref: 'TypesCults',
        required: true,
    },
    preacher: { type: String, required: true, uppercase: true },
    listmembers: [
        {
            member: { type: Schema.Types.ObjectId, ref: 'Members' },
            presence: { type: Boolean, default: false },
            fail: { type: Boolean, default: false },
        },
    ],
    hidefile: { type: Boolean, default: false },
});

CultsSchema.pre('save', function (next) {
    const requiredFields = ['day', 'theme', 'typecult', 'preacher'];
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

module.exports = mongoose.model('Cults', CultsSchema);
