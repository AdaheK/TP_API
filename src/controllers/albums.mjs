import AlbumModel from '../models/album.mjs';

const Albums = class Albums {
  constructor(app, connect) {
    this.app = app;
    this.AlbumModel = connect.model('Album', AlbumModel);

    this.run();
  }

  create() {
    this.app.post('/album/', (req, res) => {
      try {
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
    this.app.get('/album/:id', (req, res) => {
      try {
        this.AlbumModel.findById(req.params.id)
          .then((album) => {
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

  deleteById() {
    this.app.delete('/album/:id', (req, res) => {
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

  run() {
    this.create();
    this.showById();
    this.deleteById();
  }
};

export default Albums;
