import mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        requiured: true,
        max: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }    
}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema);   