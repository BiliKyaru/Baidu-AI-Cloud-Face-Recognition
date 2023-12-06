let constraints = {
        //参数
        video: {width: 400, height: 400},
        audio: false
    };
let video = document.getElementById("video");
(function () {
    // 请求用户媒体权限
    requestVideoUpper();
    // 获取媒体流
    getMedia();
})();
function getMedia() {
    //返回的Promise对象
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    // 使用 then() 处理异步操作，将 MediaStream 对象作为参数
    promise.then(function (MediaStream) {
         // 将媒体流赋值给视频元素
        video.srcObject = MediaStream;
        // 播放视频
        video.play();
    });

    // 获取所有导航列表项
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

// 为所有列表项添加鼠标悬停事件监听器，触发时调用activeLink函数
list.forEach((item) => item.addEventListener("mouseover", activeLink));

// 获取切换按钮
let toggle = document.querySelector(".toggle");
// 获取导航菜单
let navigation = document.querySelector(".navigation");
// 获取主要内容区域
let main = document.querySelector(".main");

// 切换按钮点击时的事件处理函数
toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

document.getElementById('admin').addEventListener('click', () => {
    window.location.href = '/admin';
})}

document.getElementById('user').addEventListener('click', () => {
    window.location.href = '/user';
})

document.getElementById('quit').addEventListener('click', () => {
    window.location.href = '/index';
})

// 请求视频上传的函数
function requestVideoUpper() {
     // 创建 XMLHttpRequest 对象
    let xhr = new XMLHttpRequest();
     // 创建 FormData 对象，用于发送表单数据
    let formData = new FormData();
    formData.append('file', 1);
    xhr.open('POST', '/allLog', false);
    // 请求加载完成时的回调函数
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('upload success');
        }
    };
     // readyState 改变时的回调函数
    xhr.onreadystatechange = function(){
        if(this.status === 200){
            const data = JSON.parse(xhr.responseText);
            console.log(xhr.responseText);
            let tbody = document.querySelector('.userData tbody');
            for (let i = 0; i < data.length; i++){
                let tr = document.createElement('tr');
                tbody.appendChild(tr);

                let td1 = document.createElement('td');
                let td2 = document.createElement('td');

                td1.innerHTML = data[i]['user'];
                td2.innerHTML = data[i]['time'];

                tr.appendChild(td1);
                tr.appendChild(td2);
            }
        }
    };
    xhr.send(formData);
}