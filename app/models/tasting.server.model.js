const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TastingSchema = new Schema({
    distillerName: {
        type: String,
        default: '',
        trim: true,
        required: 'Distiller cannot be blank'
    },
    flavor: {
        type: String,
        default: '',
        trim: true
    },
    age: Number,
    added: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    }
        
});

TastingSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Tasting', TastingSchema);
