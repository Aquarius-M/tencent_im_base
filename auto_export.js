const path = require("path");
const fs = require('fs-extra')
const CONSTVARS = {
    "FLUTTER":"flutter/bin",
    "CACHED":".pub-cache/hosted/pub.dartlang.org",
    "PERFIX":"package:tencent_cloud_chat_sdk",
}
async function exec(){
    const flutterPath = getFlutterEnvPath();
    if(flutterPath == ""){
        throw new Error("你没安装flutter，先安装一个吧...")
    }
    console.log(`当前用户flutter安装目录：${flutterPath}`)
    const sdkPath = await getCachedTencentImSDKPath(flutterPath);
    console.log(`当前用户缓存的tentcent im sdk 目录：${sdkPath}`)
    const enums = await getAllFiles(`${sdkPath}/lib/enum`,".dart","enum");
    const models = await getAllFiles(`${sdkPath}/lib/models`,".dart","models")
    const manager = await getAllFiles(`${sdkPath}/lib/manager`,".dart","manager")
    generateExport(enums.concat(models).concat(manager))
}

function generateExport(expo){
    fs.removeSync(path.resolve(__dirname,'export.txt'))
    fs.writeFileSync(path.resolve(__dirname,'export.txt'),`${expo.join(";\n")};`)
    console.log('写完了。。。')
}
function getFlutterEnvPath(){
    const { PATH } = process.env;
    console.log(PATH);
    let flutterPath = "";
    const paths = PATH.split(':');
    for(let i in paths){
        console.log(paths[i]);
        if(paths[i].includes(CONSTVARS.FLUTTER)){
            flutterPath = paths[i];
            break;
        }
    }
    return flutterPath;
}

function getAllFiles(current_dir_path, type = '.dart',perfix) {
    const res = [];
    return new Promise((resolve) => {
        const files = fs.readdirSync(current_dir_path);
        files.forEach(async (name) => {
            const filePath = path.join(current_dir_path, name);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
                if (filePath.endsWith(type) && !filePath.includes("image_types")) {
                    const name = filePath.split('/').pop();
                    res.push(`export "${CONSTVARS.PERFIX}/${perfix}/${name}"`);
                }
            } else {
                const innerFiles = await getAllFiles(filePath, type);
                innerFiles.map((i) => res.push(i));
            }
        });
        resolve(res);
    });
}
function getAllDir(cpath){
    const res = [];
    return new Promise((resolve) => {
        const files = fs.readdirSync(cpath);
        files.forEach(async (name) => {
            const filePath = path.join(cpath, name);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                res.push(filePath)
            } 
        });
        resolve(res);
    });
}
async function getCachedTencentImSDKPath(flutetrPath){
    const cachePath = path.resolve(`${flutetrPath.replace('bin','')}${CONSTVARS.CACHED}`);
    const paths = await getAllDir(cachePath)
    const versions = [];
    for(let i in paths){
        if(paths[i].includes("tencent_cloud_chat_sdk-")){
            versions.push(paths[i])
        }
    }
    if(!versions.length){
        throw new Error("本地没有缓存 tencent_cloud_chat_sdk 先缓存");
    }
    return versions.pop();
}


exec();