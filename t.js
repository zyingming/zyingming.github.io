const fs = require('fs');
const path = require('path');
const readline = require('readline');
let moment = require('moment');

const _basePath = __dirname + '/_posts/';

let w_data = '---\r\n'+
'layout: post\r\n'+
'title:  "default title"\r\n'+
'date:   '+ moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') +'\r\n'+
'categories: javascript\r\n'+
'tags: javascript\r\n'+
'marks: tag\r\n'+
'icon: original\r\n'+
'author: "zyingming"\r\n'+
'---';

w_data = new Buffer(w_data);

/*const rDir = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});*/



/*rDir.question('请输入文件夹名', (dirname) => {

	console.log(`文件夹名：${dirname}`);
	fs.exists(_basePath + dirname, function(exists) {
		if(exists) {
			console.log('进入该文件夹，创建文件')
			touchFile()
		}else {
			console.log('创建文件夹')
			fs.mkdirSync(_basePath + dirname, 0o777 , touchFile);
			_basePath = _basePath + dirname;
		}
	})
});*/

const rFile = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


rFile.question('请输入文件夹+文件名', (fileName) => {

	console.log(`文件名：${fileName}`);
	fs.writeFile(_basePath + fileName , w_data, {flag: 'w+'}, function(err, data) {
		if(err) {
			console.error('写入失败', err);
			return;
		}
		console.log(data)
	})

    rFile.close();
});




