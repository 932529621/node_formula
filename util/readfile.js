let fs=require('fs');

fs.readdir('C:/Users/Administrator/Desktop/formula/driver_brief/driver_number_icon',(err,files)=>{
    if (err) {
		console.log(err);
	} else{
		// console.log(files); 返回的文件是个数组,可以用forEach循环输出文件名
		//  files.forEach((x)=>{
		// 	 console.log('有'+ x +'这个文件');
		//  })
        const filelength=files.length
        console.log('有'+filelength+"个文件");
        
	}
})