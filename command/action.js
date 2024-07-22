import fs from 'fs'
import { NotFoundResponse } from './response.js'

const checkFileExist = (filePath) => {
    // 检查当前目录是否存在
    if(!fs.existsSync(filePath)&&type==="action"){
        if(create){
            fs.mkdir(`mock`, function(err){
                if(err){
                    return console.error(err.message)
                }
                fs.mkdirSync(`./mock/api`)
                const data = JSON.stringify(ResponseExample, "", "\t");
                fs.writeFileSync('./mock/api/list.json', data);
            });
            console.log(chalk.green(`curl --location --request POST 'http://localhost:9000/api' \ --header 'Content-Type: application/json' \ --data-raw '{ "Action": "list" }'`))
        }else{
            console.log("The current directory mock folder does not exist, you can create it use : " + chalk.red("u-admin-cli mock -n"))
        }
    }
}

const action = ({ app, filePath }) => {
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

export default action