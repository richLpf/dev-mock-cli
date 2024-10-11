# 使用官方的 Node.js 18 镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 将项目文件复制到工作目录中
COPY . .

# 安装项目依赖
RUN yarn install

# 暴露端口
EXPOSE 9000

# 启动应用
CMD ["yarn", "start"]
