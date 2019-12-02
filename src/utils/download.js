import config from "@/http/config";
import axios from "axios";
import Cookies from "js-cookie";
export const download = (url,params) => {
    let headers = {'content-type': 'application/json' };
    headers.token = Cookies.get("token");
    const instance = axios.create({
     headers: headers,
     timeout: config.timeout,
     withCredentials: config.withCredentials
   });
   instance
     .post(config.baseUrl + url, params, {
       responseType: "blob"
     })
     .then(response => {
       let data = response.data;
       if (!data) {
         return;
       }
       let contentDisposition = response.headers["content-disposition"];
       let fileName = decodeURIComponent(
         contentDisposition.substring(contentDisposition.indexOf("=") + 1)
       );
       //let url = window.URL.createObjectURL(new Blob([data], { type: 'application/ms-excel;charset=utf-8' }))
       let url = window.URL.createObjectURL(new Blob([data]));
       let a = document.createElement("a");
       a.style.display = "none";
       a.href = url;
       a.setAttribute("download", fileName);
       document.body.appendChild(a);
       //点击下载
       a.click();
       // 下载完成移除元素
       document.body.removeChild(a);
       // 释放掉blob对象
       window.URL.revokeObjectURL(url);
       console.log("下载完成");
     },
     error=>{
       this.$message({ message: "模板文件下载失败,可能是还没上传模板文件", type: "error" });
     })
     .catch(function(error) {
       this.$message({ message: "模板文件下载失败,可能是还没上传模板文件", type: "error" });
     }); 
}