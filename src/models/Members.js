const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function formatDocument(document) {
    if (document == null) return '';
    document = document.toString();
    if (document.length === 11) {
        return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
        return document;
    }
}

function formatCep(cep) {
    if (cep == null) return '';
    cep = cep.toString();
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

const AddressSchema = new Schema({
    publicplace: { type: String, uppercase: true },
    number: { type: String, uppercase: true, required: true },
    cep: {
        type: Number,
        required: true,
        set: value => parseInt(value),
        get: value => formatCep(value),
    },
    district: { type: String, uppercase: true },
    city: { type: String, uppercase: true },
    state: { type: String, uppercase: true },
    complement: { type: String, uppercase: true, default: null },
});

const MembersSchema = new Schema({
    name: { type: String, required: true, uppercase: true },
    document: {
        type: Number,
        required: true,
        set: value => parseInt(value),
        get: value => formatDocument(value),
    },
    email: { type: String, required: true },
    address: { type: AddressSchema },
    birthdate: { type: String, required: true },
    phone: { type: Number, required: true },
    age: { type: Number },
    office: { type: Schema.Types.ObjectId, ref: 'Office', required: true },
    maritalstatus: { type: String, required: true, uppercase: true },
    hidefile: { type: Boolean, default: false },
});

MembersSchema.pre('save', function (next) {
    const requiredFields = [
        'name',
        'email',
        'address',
        'birthdate',
        'phone',
        'office',
    ];
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

module.exports = mongoose.model('Members', MembersSchema);
