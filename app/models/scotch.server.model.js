const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ScotchSchema = new Schema({
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
    age: String,
    added: {
        type: Date,
        default: Date.now
    },
    style: {
        type: String,
        enum: ['Single Malt', 'Blended'],
        default: 'Single Malt'
    },
    region: {
        type: String,
        enum: ['Speyside','Highland','Islay','Island','Scotch','Lowland','Campbeltown','Other']
    },
    inStock: Boolean,
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    comment: String,
    notes: [{ note: String, dateAdded: {type: Date, default: Date.now} }],
    tastings: [{dateAdded: Date, location: String, rating: Number, comment: String, rating: String}],
    wishLists: [String]
});

ScotchSchema.virtual('dramName').get(function() {
    return this.distillerName + ' ' + this.flavor + ' ' + this.age;
});

ScotchSchema.virtual('rating').get(function() {
    var sum = 0;
    var count = 0;
    this.tastings.forEach(function(tasting) {
        sum += Number(tasting.rating);
        count++;
    });
    if (count > 0) {
        var ratingRaw = sum / count;
        var rating = Math.round(ratingRaw);
    } else {
        var rating = 0;
    }
  return rating;
});

ScotchSchema.set('toJSON', {
    virtuals: true
});


mongoose.model('Scotch', ScotchSchema);
