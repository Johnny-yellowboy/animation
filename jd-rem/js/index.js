//监听屏幕滚动事件,大于600时让头部背景颜色改变

; (function () {

  var header = document.querySelector(".header");

  window.addEventListener("scroll", function () {

    var scrollTop = window.pageYOffset;
    var opacity = 0;
    console.log(scrollTop);
    if (scrollTop > 600) {
      opacity = 1;
    }
    else {
      opacity = scrollTop / 600 * 1;
    }
    header.style.backgroundColor = "rgba(222, 24, 27," + opacity + ")";
  })

})();


//京东快报
// 每次ul向上移动一个li的高度

; (function () {

  var ul = document.querySelector(".news .info ul");
  var lis = ul.children;
  var liHeight = lis[0].offsetHeight;
  // console.log(liHeight);

  var index = 0;
  setInterval(function () {


    //方法2重绘和回流:只会执行下面的transform和transition
    // 中间添加一个获取事件,就会执行两次,
    // if(index >= lis.length - 1){
    //   index = 0;
    //   ul.style.transition = "none";
    //   ul.style.transform = "translateY(0px)";
    // }

    // ul.offsetHeight;

    index++;
    ul.style.transform = "translateY(-" + index * liHeight + "px)";
    ul.style.transition = "all 0.5s";

  }, 1000);

  ul.addEventListener("transitionend", function () {

    if (index >= lis.length - 1) {
      index = 0;
      ul.style.transition = "none";
      ul.style.transform = "translateY(0px)";
    }

  });

})();




//倒计时功能
//秒杀的时间戳 - 当前时间的时间戳,分配给小时,分,秒
; (function () {


  var spans = document.querySelectorAll(".seckill .info span");


  setTime();
  var timer = setInterval(setTime, 1000);
  function setTime() {
    var seckillTime = new Date("2018/11/11 11:11");
    var now = new Date();
    // console.log(now);
    // console.log(seckillTime);

    var time = (seckillTime - now) / 1000;
    // console.log(time+"秒杀的时间戳");

    var hours = parseInt(time / 3600);
    // console.log(hours + "时");

    var minutes = parseInt(time / 60) % 60;
    // console.log(minutes + "分钟");

    var seconds = parseInt(time % 60);
    // console.log(seconds + "秒");

    if (time <= 0) {
      time = 0;
      clearInterval(timer);
    }
    spans[0].innerHTML = addZero(hours);
    spans[2].innerHTML = addZero(minutes);
    spans[4].innerHTML = addZero(seconds);
  }
  function addZero(n) {

    return n < 10 ? "0" + n : n;
  }

})();


//秒杀产品动态获取ul的宽度

; (function () {

  var ul = document.querySelector(".seckill_content ul");
  var lis = ul.children;
  //  console.log(lis.length);

  var width = lis[0].offsetWidth;

  ul.style.width = width * lis.length + "px";

  // console.log(ul.style.width);

  new IScroll(".seckill_content", {

    scrollX: true,
    scrollY: false
  });

})();



//轮播图
//图先动起来
//小店跟着动起来
// 根据手指触摸距离让轮播图移动相同的距离
; (function () {

  var ul = document.querySelector(".banner ul");
  var lis = ul.children;
  var width = lis[0].offsetWidth;
  // var ol = document.querySelector(".banner ol");
  // var olis = ol.children;
  // console.log(olis);
  // 上面这种方式获取到的li数组__proto__和下面的不一样,获取的是ol所有的子元素
  // 下面是直接获取所有ol下的li,否则注册不上函数事件
  
  var olis = document.querySelectorAll(".banner ol li");
  console.log(olis);
  
  
  var index = 1;
  var timer = setInterval(function () {
    index++;
    // console.log(index);

    addTransition();
    setTranslatX(-index * width);

  }, 1000);

  ul.addEventListener("transitionend", function () {

    if (index >= lis.length - 1) {
      index = 1;
      removeTransition();
      setTranslatX(-index * width);
    }
    if(index <= 0){
      index = lis.length -2;
      removeTransition(); 
      setTranslatX(-index * width );
    }
    // 这里index 已经是1-8,排除了0和10;小圆点是0-7
    olis.forEach(function( v, i ) {
      v.classList.remove("current");
    })
    // 让 index-1 对应的小圆点高亮  (小圆点范围 0-7)
    olis[ index - 1 ].classList.add("current");
  });

  function removeTransition() {
    ul.style.transition = "none";
    ul.style.webkiTransition = "none";
  }
  function setTranslatX(value) {
    ul.style.transform = "translateX(" + value + "px)";
    ul.style.webkitTransform = "translateX(" + value + "px)";
  }
  function addTransition(){
    ul.style.transition = "all 0.2s";
    ul.style.webkitTransition = "all 0.2s";
  }
  // 让手指跟着屏幕动
  var startX = 0; 
  var startTime;
  ul.addEventListener("touchstart",function(e){

    var startTime = new Date();
    startX = e.touches[0].clientX;
    clearInterval(timer);
  });
  ul.addEventListener("touchmove",function (e){

    var distanceX = e.touches[0].clientX -startX;
    setTranslatX( -index * width + distanceX);
    removeTransition();
  });
  ul.addEventListener("touchend",function (e){

    var distanceX = e.changedTouches[0].clientX - startX;
    var time = new Date() - startTime;
    
    if(distanceX > width /3 ||time <300 && distanceX >50){
      index--;
    }
    else if(distanceX < -width /3 ||time <300 && distanceX < -50){
      index++;
    }
    addTransition();
    setTranslatX(-index * width);

    timer = setInterval(function(){
      index++;
      addTransition();
      setTranslatX(-index * width);
    },2000);
  });


  //适配屏幕改变时ul宽度自适应
  window.addEventListener("resize", function (e){

    width = lis[0].offsetWidth;
    removeTransition();
    setTranslatX(-index *width);
  });

})();