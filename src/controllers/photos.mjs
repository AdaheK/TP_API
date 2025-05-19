import PhotoModel from '../models/photo.mjs';

const Photos = class Photos {
  constructor(app, connect) {
    this.app = app;
    this.PhotoModel = connect.model('Photo', PhotoModel);

    this.run();
  }

  create() {
    this.app.post('/photo/', (req, res) => {
      try {
        const photo = new this.PhotoModel(req.body);

        photo.save().then((savedPhoto) => {
          res.status(200).json(savedPhoto || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server Error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] photo/create -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad Request'
        });
      }
    });
  }

  showById() {
    this.app.get('/photo/:id', (req, res) => {
      try {
        this.PhotoModel.findById(req.params.id).then((photo) => {
          res.status(200).json(photo || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server Error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] photo/:id -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad Request'
        });
      }
    });
  }

  deleteById() {
    this.app.delete('/photo/:id', (req, res) => {
      try {
        this.PhotoModel.findByIdAndDelete(req.params.id).then((photo) => {
          res.status(200).json(photo || {});
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server Error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] photo/:id -> ${err}`);

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

export default Photos;
