document.getElementById('logging').addEventListener('click', () => {
    window.location.href = '/logging';
})

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