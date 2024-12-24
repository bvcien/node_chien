const express = require('express')
const conn = require('./conn.js')
const path = require('path')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const Blog = require('./content_blog.js')
//ket noi nodejs va mongoDB
async function main() {
    await conn().then(() => console.log("Ket noi database thanh cong"));

    //khoi tao express seer
    const app1 = new express()
    const app2 = new express()

    //set ung dung goi den thu muc chua giao dien
    app1.set('view engine', 'ejs')
    app1.set('views', './views')
    app2.set('view engine', 'ejs')
    app2.set('views', './views')

    //thuc hien lay DL tu body ve request
    app1.use(bodyParser.urlencoded({ extended: true }))
    app1.use(bodyParser.json({ type: 'application/json' }))
    app1.use(bodyParser.raw());

    app2.use(bodyParser.urlencoded({ extended: true }))
    app2.use(bodyParser.json({ type: 'application/json' }))
    app2.use(bodyParser.raw());

    //Dang ky thu muc public..
    app1.use(express.static('template'));
    app1.use(express.static('Admin'));
    app1.use(express.static('public'));

    app2.use(express.static('template'));
    app2.use(express.static('Admin'));
    app2.use(express.static('public'));

    
    // app2.use(express.static(path.join(__dirname, 'Admin')));

    //goi chay cong 8000
    const server1 = app1.listen(8888, () => { console.log("server run port 8888") })
    const server2 = app2.listen(5555, () => { console.log("server run port 5555") })

    // app1.get('/home', (req, res) => {
    //     res.render('home', { item: catalogItem });
    // });
    

    app1.get('/home', async (req, res) => {
        try {
            const items = await Blog.find({}); // Lấy tất cả dữ liệu từ collection Blog
            res.render('home', { items }); // Truyền dữ liệu vào template 'home.ejs'
        } catch (err) {
            console.error(err);
            res.status(500).send('Lỗi khi lấy dữ liệu');
        }
    });

    app1.get('/blog_detail', async (req, res) => {
        try {
            const items = await Blog.find({}); // Lấy tất cả dữ liệu từ collection Blog
            res.render('blog_detail', { items }); // Truyền dữ liệu vào template 'home.ejs'
        } catch (err) {
            console.error(err);
            res.status(500).send('Lỗi khi lấy dữ liệu');
        }
    });
    
    // app1.get('/home', function (req, res) {
    //     res.render('home')
    // })

    app1.get('/blog_detail', function (req, res) {
        res.render('blog_detail')
    })

    app2.get('/admin', function (req, res) {
        res.render('admin')
    })

    app2.get('/product', function (req, res) {
        res.render('product')
    })

    app2.post('/product', function (req, res) {
        res.render('product')
    })

    

    // port: API thuc hien them moi du lieu
    app2.post('/api/insert', (req, res) => {
        Blog.create(req.body).then(() => {
            res.redirect('/product')
        })
    })

    // hiển thị
    
    app2.get('/product_select', function (req, res) {
        Blog.find({}).then((result) => {
            console.log(result);
            res.render('product_select', { user_Blog: result });
        })
            .catch((err) => console.log(err))
    });

    // xoá
    app2.get('/product_delete/:id', function (req, res) {
        Blog.findByIdAndDelete(req.params.id).then((result) => {
            console.log('delete successful')
            res.redirect('/product_select')
        })
    })

    // update
    app2.get('/product_update/:id', function (req, res) {
        Blog.findById(req.params.id).then((result) => {
            console.log(result);
            res.render('product_update', { user_id_blog: result });
        })
            .catch((err) => console.log(err))
    })
    app2.post('/product_update/:id', function (req, res) {
        Blog.findByIdAndUpdate(req.params.id, req.body).then((result) => {
            console.log('update successful')
            res.redirect('/product_select')
        })
    })

}
main().catch(err => console.error(err))