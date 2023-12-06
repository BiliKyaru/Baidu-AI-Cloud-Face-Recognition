let constraints = {
        //参数
        video: {width: 350, height: 350},
        audio: false
    };
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
//未检测到人脸的次数
let count = 0, title;
let tbody = document.querySelector('.userData tbody');
(function () {
    getMedia();
    getUserList(0)
})();

function setAs() {
    let link = document.querySelectorAll('.userData tbody a');
    for (let i = 0;i < link.length; i++){
        link[i].addEventListener('click', function () {
            let par = this.parentNode.parentNode;
            let pre = this.parentNode.previousSibling;
            let xhr = new XMLHttpRequest();
            // 创建一个FormData对象，用于封装表单数据
            let formData = new FormData();
            // 将图片数据添加到表单数据中，键名为
            formData.append('user', pre.textContent);
            xhr.open('POST', 'http://127.0.0.1:5000/deleteUser', false);
            xhr.onreadystatechange = function () {
                console.log(xhr.responseText)
                const data = JSON.parse(xhr.responseText);
                if (data["error_msg"] === 'SUCCESS')
                    tbody.removeChild(par);
            }
            xhr.send(formData);
        })
    }
}


function getMedia() {
    //返回的Promise对象
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    //then()异步，调用MediaStream对象作为参数
    promise.then(function (MediaStream) {
        video.srcObject = MediaStream;
        video.play();
    });
}
// 定义一个函数，用于将视频流的当前帧绘制到canvas上
function takePhoto() {
    // 获取canvas的绘图上下文，用于操作canvas的内容
    let ctx = canvas.getContext('2d');
    //绘图，
    // 调用drawImage方法，将视频元素的内容绘制到canvas上，指定绘制的位置和大小为0,0,300,300
    ctx.drawImage(video, 0, 0, 300, 300);
}


// 定义一个函数，用于停止视频流
function stopMedia(videoElem) {
    // 获取视频元素的srcObject属性，得到媒体流对象
    const stream = videoElem.srcObject;
    if (stream != null){
        const tracks = stream.getTracks();
        // 遍历数组中的每个轨道
        tracks.forEach(function(track) {
           // 调用stop方法，停止轨道的传输
            track.stop();  //停止视频流
        });
        // 将视频元素的srcObject属性设置为null，表示视频元素没有源
        videoElem.srcObject = null;
    }

    // 将上传次数重置为0
    count = 0;
}


function requestVideo() {
    let name = document.getElementById('name');
    let canvas = document.getElementById('canvas');
    let xhr = new XMLHttpRequest();
    // 创建一个FormData对象，用于封装表单数据
    let formData = new FormData();
    // 将图片数据添加到表单数据中
    formData.append('name', name.value)
    formData.append('img', canvas.toDataURL('image/png'));
    // 设置请求的方法为POST，请求的地址为http://127.0.0.1:5000/videoUpper，请求的模式为异步


    xhr.open('POST', '/register', false);
    xhr.onreadystatechange = function () {
        if (xhr.status === 200){
            console.log(xhr.responseText)
            const data = JSON.parse(xhr.responseText);
            if (!data['error'])
                alert('录入成功！');
            else
                alert(data['error']);
        } else {
            console.log(xhr.status)
            console.log(xhr.responseText)
        }

    }
    xhr.send(formData);

}


function getUserList(type) {
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    let xhr = new XMLHttpRequest();
    // 创建一个FormData对象，用于封装表单数据
    let formData = new FormData();
    formData.append('type', type);
    xhr.open('POST', '/getUserList', false);
    xhr.onreadystatechange = function () {
        if (xhr.status === 200){
            console.log(xhr.responseText)
            const data = JSON.parse(xhr.responseText);
            if (!data['error']){
                let tbody = document.querySelector('.details .recentOrders .userData tbody');
                for (let i = 0; i < data.length; i++){
                    let tr = document.createElement('tr');
                    tbody.appendChild(tr);

                    let td1 = document.createElement('td');
                    let td2 = document.createElement('td');

                    td1.innerHTML = data[i];
                    td2.innerHTML = '<a href="javascript:;" class="a">删除</a>';

                    tr.appendChild(td1);
                    tr.appendChild(td2);
                }
            }
            setAs();
        }

    }
    xhr.send(formData);
}


let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};

document.getElementById('admin').addEventListener('click', () => {
    window.location.href = '/admin';
})

document.getElementById('user').addEventListener('click', () => {
    window.location.href = '/user';
})

document.getElementById('quit').addEventListener('click', () => {
    window.location.href = '/index';
})

document.getElementById('btn').addEventListener('click', () => {
    takePhoto();
    requestVideo();
    canvas.height = canvas.height;
    getUserList(1);
})
