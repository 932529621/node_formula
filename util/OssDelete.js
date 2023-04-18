
let OSS = require('ali-oss');
const path = require("path");


let client = new OSS({
    // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
    region: 'oss-cn-fuzhou',
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: '',
    accessKeySecret: '',
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
exports.deleteMulti =  async function deleteMulti (req,res) {
    try {
        // 填写需要删除的多个Object完整路径并设置返回模式为详细模式。Object完整路径中不能包含Bucket名称。
        //let result = await client.deleteMulti(['exampleobject-1', 'exampleobject-2', 'testfolder/sampleobject.txt']);
        //console.log(result);
        // 填写需要删除的多个Object完整路径并设置返回模式为简单模式。Object完整路径中不能包含Bucket名称。
        console.log(req.body.fileItems);
        
        const fileItem=req.body.fileItems;
        let result = await client.deleteMulti(fileItem, { quiet: true });
        res.json({
            data: {
                fileItem,
                operation: 'success'
            }
        })
    } catch (e) {
        console.log(e.status);
        res.send(e)
    }
}
