
# my-dear-wife-blog

简单的静态 + Node Express 博客示例项目。

## 本地运行

1. 安装依赖

```bash
npm install
```

2. 启动服务

```bash
npm start
```

3. 打开浏览器

- 博客主页: http://localhost:3000
- 后台管理: http://localhost:3000/admin.html

> 端口可通过环境变量 `PORT` 覆盖，例如 `PORT=8080 npm start`。

## 部署建议

- Render / Heroku：直接将仓库推到 GitHub，然后在平台上新建 Web 服务，选择 Node 环境。平台会用 `npm start` 启动应用。
- 注意将 `data.json` 列入 `.gitignore`（已处理），避免将本地数据推上仓库。若需要持久化数据，应使用数据库或外部对象存储。

### Render 快速部署
1. 把仓库推到 GitHub。
2. 在 Render 新建 Web Service，选择 "Node"，分支选择主分支，构建命令留空或 `npm install`，启动命令填写 `npm start`。

### Heroku 快速部署
1. 登录 Heroku，创建新应用。
2. 连接 GitHub 仓库并启用自动部署或手动部署。
3. Heroku 会读取 `package.json` 并执行 `npm start`。如果需要指定 Node 版本，请确保 `engines.node` 已设置（本仓库已设置为 `18.x`）。

## 本地测试要点
- 上传文件会写入 `post_imgs/`，确保部署环境可写或改为外部存储。
- 日志写入 `server.log`，生产环境可以改为更成熟的日志方案。

如果你想，我可以：
- 帮你把仓库初始化并推到 GitHub（需你提供仓库名与权限）
- 生成一个 `Procfile` 或 Render 的 `render.yaml`
- 演示部署到 Heroku / Render 的具体命令
