import mongoose from 'mongoose';

const AlbumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }]
}, {
  collection: 'albums',
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

export default AlbumSchema;
