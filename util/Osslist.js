let OSS = require('ali-oss');

let client = new OSS({
  // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
  region: 'oss-cn-fuzhou',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: '',
  accessKeySecret: '',
  // 填写Bucket名称。
  bucket: 'vue2-express',
});
let fs = require('fs');

fs.readdir('C:/Users/Administrator/Desktop/formula/schedule/nation_icon/', (err, files) => {
  if (err) {
    console.log(err);
  } else {
    // console.log(files); 返回的文件是个数组,可以用forEach循环输出文件名
    //  files.forEach((x)=>{
    // 	 console.log('有'+ x +'这个文件');
    //  })

    const filelength = files.length+1
    list(filelength)
  }
});
async function list(filelength) {
  // 不带任何参数，默认最多返回100个文件。

  let files = await client.list({
    'max-keys': filelength,
     prefix: 'formula/schedule/nation_icon/',
    // 设置正斜线（/）为文件夹的分隔符。
    delimiter: '/'
  });

  console.log(files.objects.forEach(obj=>{
    console.log(obj.url);
    
  }));


}


