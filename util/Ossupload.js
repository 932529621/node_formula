
let OSS = require('ali-oss');
const path = require("path");


let client = new OSS({
  // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
  region: 'oss-cn-fuzhou',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: 'LTAI5t6zhzhkRCu8eJznLSaA',
  accessKeySecret: 'SkT4MEMPR2Fl0W41HbVli2LQwpLKpb',
  // 填写Bucket名称。
  bucket: 'vue2-express',
});
const headers = {
  // 指定Object的存储类型。
  'x-oss-storage-class': 'Standard',
  // 指定Object的访问权限。
  'x-oss-object-acl': 'private',
  // 设置Object的标签，可同时设置多个标签。
  'x-oss-tagging': 'Tag1=1&Tag2=2',
  // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
  'x-oss-forbid-overwrite': 'true',
};
exports.ossUpload = async function ossUpload(req, res) {
 
  try {
    console.log(req.headers);
    
    var fileName=req.headers.path+'/'+req.file.originalname;
    const Option={};
    const result=await client.head(fileName,Option);
    res.json({
      data: {
        alt: req.file.originalname,
        href: result.res.requestUrls[0],
        operation: 'success',
        message: 'File Upload Success'
      }
    })
  } catch (e) {
    if (e.code === 'NoSuchKey') {
      try {
        // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
        // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
        const result = await client.put(`${fileName}`, path.normalize(`${req.file.path}`)
          // 自定义headers
          , { headers }
        );
        console.log(result);
        
        const str = result.name.substring(result.name.indexOf('/') + 1);
        res.json({
          data: {
            alt: str,
            href: result.url,
            operation: 'success',
            message: 'File Upload Success'
          }
        })
      } catch (e) {
       console.log(e);
      }
    }
  }
}
