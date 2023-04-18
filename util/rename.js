let fs=require('fs');

//异步复制并重命名文件
fs.copyFile('./1.text','./public/index.html',(err)=>{
	if (err) {
		console.log(err);
	} else{
		console.log('已经复制并移动');
	}
})

// 同步操作复制并重命名文件
fs.copyFileSync('./index.html','./public/index.html');