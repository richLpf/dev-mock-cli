const express = require('express');
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser');
const chalk = require("chalk");

const NotFoundResponse = {
    RetCode: 400,
    Message: "NotFound",
    Data: null
}

// 通过解析请求参数生成不同的数据
// 通过设置setTimeout，配置延时返回效果
// TODO: 提取生成json数据的代码
// TODO: 第一次生成的情况下，要判断mock下对应的文件是否存在，而不仅仅是判断mock
module.exports = (args) => {

    const { port, type, create } = args

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

    const filePath = path.join(process.cwd(), `./mock/`)

    // 检查当前目录是否存在
    if(!fs.existsSync(filePath)&&type==="action"){
        if(create){
            fs.mkdir(`mock`, function(err){
                if(err){
                    return console.error(err.message)
                }
                fs.mkdirSync(`./mock/api`)

                let student = {
                    "Action": "post",
                    "RetCode": 200,
                    "Message": "",
                    "Data": [{
                        "Id": 1,
                        "Name": "san.li"
                    }]
                }
                let data = JSON.stringify(student, "", "\t");
                fs.writeFileSync('./mock/api/list.json', data);
            });
            console.log(chalk.green(`curl --location --request POST 'http://localhost:9000/api' \ --header 'Content-Type: application/json' \ --data-raw '{ "Action": "list" }'`))
        }else{
            console.log("The current directory mock folder does not exist, you can create it use : " + chalk.red("u-admin-cli mock -n"))
        }
    }

    if(!fs.existsSync(filePath)&&type==="restful"){
        if(create){
            fs.mkdir(`mock`, function(err){
                if(err){
                    return console.error(err.message)
                }
                fs.mkdirSync(`./mock/api`)

                let student = {
                    "Action": "post",
                    "RetCode": 200,
                    "Message": "",
                    "Data": [{
                        "Id": 1,
                        "Name": "san.li"
                    }]
                }
                let data = JSON.stringify(student, "", "\t");
                fs.writeFileSync('./mock/api/get.json', data);
            });
            console.log(chalk.green(`curl --location --request GET 'http://localhost:9000/api'`))
        }else{
            console.log("The current directory mock folder does not exist, you can create it use : " + chalk.red("u-admin-cli mock -n"))
        }
    }

    if(type === "action"){
        // 如果在mock下，判断下key的值
        app.post('*', async(req, res) => {
            const key = req.params[0].substring(1)
            
            const { Action } = req.body

            if(key){
                const fileList = []
                try{
                    fs.readdirSync(filePath).forEach(fileName => {
                        fileList.push(fileName)
                    });
                }catch(err){
                    res.send(NotFoundResponse)
                }
                
                if(!fileList.includes(key)||!Action){
                    res.send(NotFoundResponse)
                }
            }

            const file = `${filePath}${key}/${Action}.json`; //文件路径，__dirname为当前运行js文件的目录

            fs.readFile(file, 'utf-8', function(err, data) {
                if (err) {
                    res.send(NotFoundResponse);
                } else {
                    res.send(data);
                }
            })
        })
    }
    if(type === "restful"){
        app.all("*", async(req, res) => {
            const key = req.params[0]
            const method = req.method
            const file =`${filePath}${key}/${method}.json`
            console.log("file", file)
            fs.readFile(file, 'utf-8', function(err, data) {
                if (err) {
                    res.send(NotFoundResponse);
                } else {
                    // console.log("data", JSON.parse(data))
                    // TODO:可以固定参数增加筛选，或者写一写过滤函数，引入mock等，重新生成返回数据，更多的模拟返回值
                    res.send(data);
                }
            })
        })
    }

    const startServer = () =>
        app.listen(port, () => console.log(`Mock api listening on port ${port}!`));

    startServer()
}