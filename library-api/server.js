const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');

// 設置 Express 應用
const app = express();
const port = 3000;
//要先cd進library-api中
// 定義根路徑的路由
app.get('/', (req, res) => {
    res.send('Welcome to the library!');
  });
// 使用 body-parser 解析 JSON 請求
app.use(bodyParser.json());

// 加載 Swagger 文件
const swaggerDocument = yaml.load(fs.readFileSync('../library_API.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 模擬的圖書數據
let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

app.get('/', (req, res) => {
    res.send('Welcome to the Library API!');
  });
// 讀取全部書籍
app.get('/books', (req, res) => {
  res.json(books);
});

// 讀取單本書籍
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
});

// 創建新書籍
app.post('/books', (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// 更新書籍
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');

  book.title = req.body.title;
  book.author = req.body.author;
  res.json(book);
});

// 刪除書籍
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) return res.status(404).send('Book not found');

  books.splice(bookIndex, 1);
  res.status(204).send();
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Library API running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
