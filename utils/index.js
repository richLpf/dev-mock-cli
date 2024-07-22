import fs from 'fs';

export const checkFileExist = () => {
    return fs.existsSync(path.join(process.cwd(), `./mock`))
}

export const createMkdir = () => {
    if(!checkFileExist()){
        fs.mkdir(`mock`, function(err){
            if(err){
                return console.error(err.message)
            }
            fs.mkdirSync(`./mock/api`)
        });
    }
}

export const setHeader = (env, headerKey, value) => {
    let newValue = value;
    switch (headerKey) {
      case 'Access-Control-Allow-Headers':
        newValue = `${env.cors['Access-Control-Allow-Headers']}, ${value}`;
        break;
      case 'Access-Control-Allow-Methods':
        newValue = `${env.cors['Access-Control-Allow-Methods']}, ${value}`;
        break;
      case 'Content-Type':
        newValue = value;
        break;
    }
    return newValue;
};