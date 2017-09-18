const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishListSchema = new Schema({
    wishListName: {
        type: String,
        required: 'Name is required'
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

WishListSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('WishList', WishListSchema);