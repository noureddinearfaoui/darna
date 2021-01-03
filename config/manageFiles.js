const fs = require("fs");
const directory = require("../pathDirectory");
const dirUploads = "uploads";
const host=`${process.env.SERVER_BACKEND_ADDRESS || "http://localhost:3000"}`;

exports.createFile=(dir,base64,id,apiUrl)=>{
    if (!fs.existsSync(dirUploads)) {
        fs.mkdirSync(dirUploads);
    }
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    removeFile(dir,id);
    let data = base64;
    let buff = Buffer.from(data.split(";base64,")[1], "base64");
    let extension = data.split(";base64,")[0].split("/")[1];
    let fileName = dir + "/" + id + "." + extension;
    fs.writeFileSync(fileName, buff);
    urlFile =host+apiUrl+id+"." +extension;
    return urlFile;
}

function removeFile(dir,id){
    if(fs.existsSync(dir)){
        let files = fs.readdirSync(dir);
        if (files.find((el) => el.indexOf(id) !== -1)) {
          let fileT = files.find((el) => el.indexOf(id) !== -1);
          fs.unlinkSync(dir + "/" + fileT, () => {});
        }
    }
}
exports.deleteFile=(dir,id)=>removeFile(dir,id);

exports.getFileByNom=(dir,nomFile)=>{
    if(!fs.existsSync(dir)){
        return null;
    }
    let files = fs.readdirSync(dir);
    if (!files.includes(nomFile)) {
        return null;
    }
    return directory + "/" + dir + "/" + nomFile;
}