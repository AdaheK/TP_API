import jwt from 'jsonwebtoken';

const Auth = class Auth {
  constructor(app) {
    this.app = app;
    this.run();
  }

  jwt() {
    this.app.get('/auth', (req, res) => {
      try {
        const { name, role } = req.body;
        const token = jwt.sign({
          name,
          role
        }, 'efrei', {
          expiresIn: '24h'
        });
        res.status(200).json({
          token
        });
      } catch (err) {
        console.error(`[ERROR] jwt -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  run() {
    this.jwt();
  }
};

export default Auth;
