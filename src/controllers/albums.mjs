import validator from 'better-validator';
import AlbumModel from '../models/album.mjs';

const Albums = class Albums {
  constructor(app, connect, jwtMiddleware) {
    this.app = app;
    this.AlbumModel = connect.model('Album', AlbumModel);
    this.jwtMiddleware = jwtMiddleware;

    this.run();
  }

  create() {
    this.app.post('/album/', (req, res) => {
      try {
        validator(req.body).required().isObject((obj, err) => {
          obj('title').required().isString();
          obj('description').isString();

          if (err) {
            res.status(400).json({
              code: 400,
              message: 'Bad request'
            });
          }
        });
        const album = new this.AlbumModel(req.body);

        album.save().then((savedAlbum) => {
          res.status(200).json(savedAlbum || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server Error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/create -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad Request'
        });
      }
    });
  }

  showById() {
    this.app.get('/album/:id', this.jwtMiddleware, async (req, res) => {
      try {
        const album = await this.AlbumModel.findById(req.params.id);
        return res.status(200).json(album || {});
      } catch (err) {
        console.error(`[ERROR] album/:id -> ${err}`);

        if (err.name === 'CastError') {
          return res.status(400).json({
            code: 400,
            message: 'ID invalide'
          });
        }

        return res.status(500).json({
          code: 500,
          message: 'Internal Server Error'
        });
      }
    });
  }

  deleteById() {
    this.app.delete('/album/:id', this.jwtMiddleware, (req, res) => {
      try {
        this.AlbumModel.findByIdAndDelete(req.params.id).then((album) => {
          res.status(200).json(album || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server Error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] album/:id -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad Request'
        });
      }
    });
  }

  getAll() {
    this.app.get('/albums', this.jwtMiddleware, async (req, res) => {
      try {
        const query = {};

        if (req.query.title) {
          query.title = { $regex: req.query.title, $options: 'i' };
        }

        const albums = await this.AlbumModel.find(query).populate('photos');

        res.status(200).json(albums);
      } catch (err) {
        console.error('[ERROR] GET /albums ->', err);
        res.status(500).json({ message: 'Erreur serveur' });
      }
    });
  }

  updateById() {
    this.app.put('/album/:id', this.jwtMiddleware, async (req, res) => {
      try {
        const album = await this.AlbumModel.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        ).populate('photos');

        if (!album) {
          return res.status(404).json({ message: 'Album non trouvé' });
        }
        return res.status(200).json(album);
      } catch (err) {
        console.error('[ERROR] PUT /album/:id ->', err);
        return res.status(400).json({ message: 'Requête invalide' });
      }
    });
  }

  run() {
    this.create();
    this.showById();
    this.deleteById();
    this.getAll();
    this.updateById();
  }
};

export default Albums;
