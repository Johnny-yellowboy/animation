
function waterAnimate(percent, total) {
    let canvas = document.getElementById("water-chart")
    let ctx = canvas.getContext("2d")
    // let oRange = document.getElementsByName("range")[0];
    let M = Math
    let Sin = M.sin
    let Cos = M.cos
    let Sqrt = M.sqrt
    let Pow = M.pow
    let PI = M.PI
    let Round = M.round
    let oW = canvas.width = 150
    let oH = canvas.height = 150
    let lineWidth = 1 // 线宽
    let r = (oW / 2) // 大半径
    let cR = r - 10 * lineWidth
    ctx.beginPath()
    ctx.lineWidth = lineWidth

    // 水波动画初始参数
    let axisLength = 2 * r - 16 * lineWidth // Sin 图形长度
    let unit = axisLength / 9 // 波浪宽
    let range = .4 // 浪幅
    let nowrange = range
    let xoffset = 8 * lineWidth // x 轴偏移量
    // let percent = ~~(oRange.value) / 100 // 数据量 (百分比)
    percent = percent || 0.68// 数据量 (百分比)=>进度圈百分比 
    total = total || 100 //总数
    console.log(percent)
    let sp = 0 // 周期偏移量
    let nowdata = 0  //初始进度百分比
    let waveupsp = 0.006 // 水波上涨速度


    // 圆动画初始参数
    let arcStack = [] // 圆栈
    let bR = r - 8 * lineWidth
    let soffset = -(PI / 2) // 圆动画起始位置
    let circleLock = true // 起始动画锁

    // 获取圆动画轨迹点集
    for (var i = soffset; i < soffset + 2 * PI; i += 1 / (8 * PI)) {
        arcStack.push([
            r + bR * Cos(i),
            r + bR * Sin(i)
        ])
    }
    // 圆起始点
    let cStartPoint = arcStack.shift();
    ctx.strokeStyle = "#1c86d1";
    ctx.moveTo(cStartPoint[0], cStartPoint[1]);
    // 开始渲染
    render();

    function drawSine() {
        ctx.beginPath();
        ctx.save();
        var Stack = []; // 记录起始点和终点坐标
        for (var i = xoffset; i <= xoffset + axisLength; i += 20 / axisLength) {
            var x = sp + (xoffset + i) / unit;
            var y = Sin(x) * nowrange;
            var dx = i;
            var dy = 2 * cR * (1 - nowdata) + (r - cR) - (unit * y);
            ctx.lineTo(dx, dy);
            Stack.push([dx, dy])
        }
        // 获取初始点和结束点
        var startP = Stack[0]
        var endP = Stack[Stack.length - 1]
        ctx.lineTo(xoffset + axisLength, oW);
        ctx.lineTo(xoffset, oW);
        ctx.lineTo(startP[0], startP[1])
        //        ctx.fillStyle = "red";
        var my_gradient = ctx.createLinearGradient(0, 0, 170, 0);
        my_gradient.addColorStop(0, "#acddfe");
        my_gradient.addColorStop(0.5, "#b7e4fe");
        my_gradient.addColorStop(1, "#d9f7ff");
        ctx.fillStyle = my_gradient;
        ctx.fill();
        ctx.restore();
    }

    function drawText() {
        ctx.globalCompositeOperation = 'source-over';
        var size = 0.35 * cR;
        ctx.font = 'bold ' + size + 'px Microsoft Yahei';
        let txt = (nowdata.toFixed(2) * total).toFixed(0) + '人';
        var fonty = r + size / 2;
        var fontx = r - size * 0.8;
        ctx.fillStyle = "#659aff";
        ctx.textAlign = 'center';
        ctx.fillText(txt, r + 2, r + 10)

    }
    //最外面淡蓝色圈
    function drawCircle() {
        ctx.beginPath();
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#eef9ff';
        ctx.arc(r, r, cR, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
    //灰色圆圈
    function grayCircle() {
        ctx.beginPath();
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#ededed';
        ctx.arc(r, r, cR - 6, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
        ctx.beginPath();
    }
    //蓝色进度圈
    function orangeCircle() {
        ctx.beginPath();
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#659aff';
        //使用这个使圆环两端是圆弧形状
        ctx.lineCap = 'round';
        ctx.arc(r, r, cR - 6, 0 * (Math.PI / 180.0) - (Math.PI / 2), (nowdata * 360) * (Math.PI / 180.0) - (Math.PI / 2));
        ctx.stroke();
        ctx.save()
    }
    //裁剪中间水圈
    function clipCircle() {
        ctx.beginPath();
        ctx.arc(r, r, cR - 9, 0, 2 * Math.PI, false);
        ctx.clip();
    }
    //渲染canvas
    function render() {
        ctx.clearRect(0, 0, oW, oH);
        //最外面淡黄色圈
        drawCircle();
        //灰色圆圈
        grayCircle();
        //橘黄色进度圈
        orangeCircle();
        //裁剪中间水圈
        clipCircle();
        // 控制波幅
        // oRange.addEventListener("change", function() {
        //     percent = ~~(oRange.value) / 100;
        // }, 0);
        if (percent >= 0.85) {
            if (nowrange > range / 4) {
                var t = range * 0.01;
                nowrange -= t;
            }
        } else if (percent <= 0.1) {
            if (nowrange < range * 1.5) {
                var t = range * 0.01;
                nowrange += t;
            }
        } else {
            if (nowrange <= range) {
                var t = range * 0.01;
                nowrange += t;
            }
            if (nowrange >= range) {
                var t = range * 0.01;
                nowrange -= t;
            }
        }
        if ((percent - nowdata) > 0) {
            nowdata += waveupsp;
        }
        if ((percent - nowdata) < 0) {
            nowdata -= waveupsp
        }
        sp += 0.07;
        // 开始水波动画
        drawSine();
        // 写字
        drawText();
        requestAnimationFrame(render)
    }
}

$('.water-chart').on('click', function (e) {
    console.log(e);

})