import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
}, {
  collection: 'photos',
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    const retUpdated = { ...ret };
    retUpdated.id = ret._id;
    delete retUpdated._id;
    return retUpdated;
  }
});

export default PhotoSchema;
