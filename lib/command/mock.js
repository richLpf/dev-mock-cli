const express = require('express');
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser');


// 通过解析请求参数生成不同的数据
// 通过设置setTimeout，配置延时返回效果
module.exports = (args) => {

    const { port } = args

    const app = express()
    app.use(bodyParser.json({limit: '50mb'}))
    app.use(express.urlencoded({ extended: true }));

    app.all('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
        res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
        res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
        res.header('Content-Type', 'application/json;charset=utf-8');
        next();
    });
    app.post('*', async(req, res) => {
        const key = req.params[0].substring(1)
        const { Action } = req.body

        const filePath = path.join(process.cwd(), `./mock/`)

        console.log("filePath", filePath)

        const fileList = []
        try{
            fs.readdirSync(filePath).forEach(fileName => {
                console.log("file", fileName);
                fileList.push(fileName)
            });
        }catch(err){
            res.send({
                RetCode: 400,
                Message: "NotFound",
                Data: null
            })
        }
        if(!fileList.includes(key)||!Action){
            res.send({
                RetCode: 400,
                Message: "NotFound",
                Data: null
            })
        }

        let file = path.join(process.cwd(), `./mock/${key}/${Action}.json`); //文件路径，__dirname为当前运行js文件的目录
        console.log(file)

        fs.readFile(file, 'utf-8', function(err, data) {
            if (err) {
                res.send('文件读取失败');
            } else {
                res.send(data);
            }
        })
    })

    const startServer = () =>
        app.listen(port, () => console.log(`Mock api listening on port ${port}!`));

    startServer()
}