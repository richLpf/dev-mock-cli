export const NotFoundResponse = {
  RetCode: 400,
  Message: 'NotFound',
  Data: null
};

export const APIFolderResponse = {
  RetCode: 400,
  Message: 'API folder not found',
  Data: null
};

export const ResponseExample = {
  Action: 'post',
  RetCode: 200,
  Message: 'success',
  'Data|1-10': [
    {
      'Id|+1': 1,
      Name: 'zhangsan'
    }
  ]
};

export const mockRestfulAPI = [{
  url: "/list",
  fileName: 'get.json',
  content: ResponseExample
},{
  url: "/user/{id}",
  fileName: 'get.json',
  content: ResponseExample
},{
  url: "/user/{id}",
  fileName: 'put.json',
  content: ResponseExample
}]