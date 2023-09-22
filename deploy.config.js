
const CustomConfig = {
	/*@custom*/
	// privateKeyPath,
	// appId: string,
	// baseUrl: string, //前缀
	// qiniuRegion: string, //七牛云空间区域
	// webviewBaseUrl: string, //webview空间
	// defaultOrgId: string, //默认机构id
	/*@custom end*/
}

module.exports = {
	appid: "wx357664b7c2a9fbd5", //小程序项目appid (必填)
	env: "prod", //项目环境，默认为production，可选dev，test
	projectPath: "./", //项目主目录
	// version: "1.3.2", //项目版本
	desc: "bug fixed", //项目更新描述
	robot: 1, //机器人
	...CustomConfig
}
