import PhotoModel from '../models/photo.mjs';
import AlbumModel from '../models/album.mjs';

const Photos = class Photos {
  constructor(app, connect, jwtMiddleware) {
    this.app = app;
    this.PhotoModel = connect.model('Photo', PhotoModel);
    this.AlbumModel = connect.model('Album', AlbumModel);
    this.jwtMiddleware = jwtMiddleware;

    this.run();
  }

  getPhotosInAlbum() {
    this.app.get('/album/:albumId/photos', this.jwtMiddleware, async (req, res) => {
      try {
        const photos = await this.PhotoModel.find({ album: req.params.albumId });
        res.status(200).json(photos);
      } catch (err) {
        console.error('[ERROR] GET /album/:albumId/photos ->', err);
        res.status(500).json({ message: 'Erreur serveur' });
      }
    });
  }

  getOnePhoto() {
    this.app.get('/album/:albumId/photo/:photoId', this.jwtMiddleware, async (req, res) => {
      try {
        const photo = await this.PhotoModel.findOne({
          _id: req.params.photoId,
          album: req.params.albumId
        });

        if (!photo) return res.status(404).json({ message: 'Photo non trouvée' });

        return res.status(200).json(photo);
      } catch (err) {
        console.error('[ERROR] GET /album/:id/photo/:id ->', err);
        return res.status(400).json({ message: 'Requête invalide' });
      }
    });
  }

  addPhotoToAlbum() {
    this.app.post('/album/:albumId/photo', async (req, res) => {
      try {
        const photo = new this.PhotoModel({
          ...req.body,
          album: req.params.albumId
        });

        await photo.save();

        await this.AlbumModel.findByIdAndUpdate(req.params.albumId, {
          $addToSet: { photos: photo._id }
        });

        res.status(201).json(photo);
      } catch (err) {
        console.error('[ERROR] POST /album/:id/photo ->', err);
        res.status(400).json({ message: 'Erreur création photo' });
      }
    });
  }

  updatePhotoInAlbum() {
    this.app.put('/album/:albumId/photo/:photoId', this.jwtMiddleware, async (req, res) => {
      try {
        const updated = await this.PhotoModel.findOneAndUpdate(
          { _id: req.params.photoId, album: req.params.albumId },
          req.body,
          { new: true }
        );

        if (!updated) return res.status(404).json({ message: 'Photo non trouvée' });

        return res.status(200).json(updated);
      } catch (err) {
        console.error('[ERROR] PUT /album/:id/photo/:id ->', err);
        return res.status(400).json({ message: 'Erreur mise à jour photo' });
      }
    });
  }

  deletePhotoInAlbum() {
    this.app.delete('/album/:albumId/photo/:photoId', this.jwtMiddleware, async (req, res) => {
      try {
        const deleted = await this.PhotoModel.findOneAndDelete({
          _id: req.params.photoId,
          album: req.params.albumId
        });

        if (!deleted) return res.status(404).json({ message: 'Photo non trouvée' });

        await this.AlbumModel.findByIdAndUpdate(req.params.albumId, {
          $pull: { photos: deleted._id }
        });

        return res.status(200).json(deleted);
      } catch (err) {
        console.error('[ERROR] DELETE /album/:id/photo/:id ->', err);
        return res.status(400).json({ message: 'Erreur suppression photo' });
      }
    });
  }

  run() {
    this.getPhotosInAlbum();
    this.getOnePhoto();
    this.addPhotoToAlbum();
    this.updatePhotoInAlbum();
    this.deletePhotoInAlbum();
  }
};

export default Photos;
