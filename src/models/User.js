const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema(
    {
        office: { type: Schema.Types.ObjectId, required: true, ref: 'Office' },
        firstname: { type: String, required: true, uppercase: true },
        lastname: { type: String, required: true, uppercase: true },
        user: { type: String },
        password: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: Number, required: true },
    },
    { timestamp: true },
);

UserSchema.pre('save', async function (next) {
    const requiredFields = [
        'office',
        'firstname',
        'lastname',
        'email',
        'password',
        'phone',
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
    let user = this;
    let salt = bcrypt.genSaltSync();
    user.password = await bcrypt.hashSync(user.password, salt);
    return next();
});

module.exports = mongoose.model('User', UserSchema);
