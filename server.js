const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// ensure directories
if (!fs.existsSync('post_imgs')) fs.mkdirSync('post_imgs', { recursive: true });

// middleware
app.use(express.json());
// serve static files (html, css, js, uploads)
app.use('/', express.static(path.join(__dirname)));
app.use('/post_imgs', express.static(path.join(__dirname, 'post_imgs')));

// storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'postImg') cb(null, path.join(__dirname, 'post_imgs'));
    else cb(null, __dirname);
  },
  filename: function (req, file, cb) {
    const safe = `${Date.now()}_${path.basename(file.originalname || file.fieldname)}`;
    cb(null, safe);
  }
});
const upload = multer({ storage });

// 保存 data.json
app.post('/save', (req, res) => {
  try {
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(req.body, null, 2), 'utf8');
    res.send('ok');
  } catch (e) {
    console.error('save error', e);
    res.status(500).send('error');
  }
});

// 上传头像（单文件字段名 avatar 或 avatarFile）
app.post('/upload', upload.single('avatar'), (req, res) => {
  const log = msg => fs.appendFileSync(path.join(__dirname,'server.log'), msg + '\n');
  log('POST /upload received');
  if (!req.file) { log('no file in /upload'); return res.status(400).send('no file'); }
  try {
    const dest = path.join(__dirname, 'avatar.jpg');
    fs.copyFileSync(req.file.path, dest);
    log('avatar saved: ' + dest);
    res.send('/avatar.jpg');
  } catch (e) {
    log('avatar upload error: ' + (e && e.stack ? e.stack : e));
    console.error('avatar upload error', e);
    res.status(500).send('error');
  }
});

// 上传文章图片，字段名 postImg
app.post('/uploadPostImg', upload.single('postImg'), (req, res) => {
  const log = msg => fs.appendFileSync(path.join(__dirname,'server.log'), msg + '\n');
  log('POST /uploadPostImg received');
  if (!req.file) { log('no file in /uploadPostImg'); return res.status(400).send('no file'); }
  try {
    const saved = req.file.path;
    log('multer saved to: ' + saved);
    const publicPath = `/post_imgs/${path.basename(req.file.filename)}`;
    log('returning publicPath: ' + publicPath);
    res.send(publicPath);
  } catch (e) {
    log('post image upload error: ' + (e && e.stack ? e.stack : e));
    console.error('post image upload error', e);
    res.status(500).send('error');
  }
});

// fallback: serve index
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log('====================================');
  console.log(`✅ 博客主页：http://localhost:${PORT}`);
 
  console.log('====================================');
});

// express 错误处理器，记录到文件
app.use((err, req, res, next) => {
  const msg = (err && err.stack) ? err.stack : String(err);
  fs.appendFileSync(path.join(__dirname,'server.log'), 'Express error: ' + msg + '\n');
  console.error('Express error:', err);
  res.status(500).send('error');
});
