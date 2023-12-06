let constraints = {
        //参数
        video: {width: 400, height: 400},
        audio: false
    };
//获得video摄像头区域
let video = document.getElementById("video");
//获得Canvas对象
let canvas = document.getElementById("canvas");
//定时器id
let timerId = null;
//未检测到人脸的次数
let count = 0, title;
(function () {
    getMedia();
})();

function timeRest() {
   timerId = setInterval(function () {
        upLoadVideo()
    }, 3000);
}

function upLoadVideo(){
    takePhoto()
    let img = canvas.toDataURL('image/png');
    requestVideoUpper(img)

}
function stopAll() {
    clearInterval(timerId); //清空定时器
    stopMedia(video);   //暂停视频
    canvas.height = canvas.height; //清空画布
}
function requestVideoUpper(img) {
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    formData.append('file', img);
    xhr.open('POST', 'http://127.0.0.1:5000/videoUpper', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('upload success');
        }
    };
    xhr.onreadystatechange = function(){
        if(this.status === 200){
            try {
                const data = JSON.parse(xhr.responseText);
                console.log(xhr.responseText);
                console.log(data);
                if (data["error_msg"] === 'SUCCESS') {
                    console.log('SUCCESS');
                    console.log(timerId);
                    stopAll();
                    alert('人脸识别成功！');
                    window.location.href = "admin"

                } else if (data['error_code'] === 222207) {
                    stopAll();
                    alert('人脸未录入！');
                    window.location.href = "logging"
                } else if (data['error_code'] === 222202){
                    count ++;
                    if (count === 4){
                        stopAll();
                        alert('未检测到人脸！');
                        window.location.href = "login"
                    }
                }
            }catch (SyntaxError){
                console.log('识别人脸失败！');

            }
        }
    };
    xhr.send(formData);
}
function getMedia() {
    //返回的Promise对象
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    //then()异步，调用MediaStream对象作为参数
    promise.then(function (MediaStream) {
        video.srcObject = MediaStream;
        video.play();
    });
    timeRest();
}

function takePhoto() {
    let ctx = canvas.getContext('2d');
    //绘图
    ctx.drawImage(video, 0, 0, 300, 300);
}

function stopMedia(videoElem) {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function(track) {
        track.stop();  //停止视频流
    });
    videoElem.srcObject = null;
    count = 0;
}

let OriginTitle = document.title;    // 保存之前页面标题
let titleTime;
document.addEventListener('visibilitychange', function(){
    if (document.hidden){
        document.title ='(。•́︿•̀。)真的要离开吗？';  // 切出文字
        clearTimeout(titleTime);
    }else{
        document.title = '欢迎回来,sensei(⑅˃◡˂⑅)～';  // 切入文字
        titleTime = setTimeout(function() {
            document.title = OriginTitle;
        }, 1000); // 2秒后恢复原标题
    }
});