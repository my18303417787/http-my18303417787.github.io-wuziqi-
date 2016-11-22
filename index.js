
$(function() {
    $('.zi').addClass('ani wobble');
    var canvas=$('#canvas').get(0);

    var ctx=canvas.getContext('2d');///注意getContext中的C要大写
    var ROW=15;
    var width=canvas.width;
    var off=width/ROW;
    var flag=true;
    var blocks={};
    var ai=false;
    var blank={};
   /* $('.kaichang').on('click', function() {
        $('.kaichang .zuo').css({
            transform: 'translateX(-100%)'
        });
        $('.kaichang .you').css({
            transform: 'translateX(100%)'
        });
        $('.kaichang span').css({
            transform: 'translateY(-100%)'
        });
        $('.kaichang').css({
            zIndex: -10
        });
    })*/
    for (var i=0;i<ROW;i++){
        for(var j=0;j<ROW;j++){
            blank[p2k(i,j)]=true;
        }
    }

    ////////////画棋子的小函数/////////////
    function v2k(position) {
        return position.x+"_"+position.y;
    }
    function p2k(x,y){
        return  x+"_"+y;
    }
    function k2o(key) {
        var arr=key.split('_');
        return {x:parseInt(arr[0]),y:parseInt(arr[1])}
    }


    var bai;
    var hei;
    var t;
    function drawchess(position,color){
        ctx.save();
        //填充注意顺序
        /////////////////棋子的渐变///////////////////
        var r=ctx.createRadialGradient(-2,-2,3,0,0,15);
        r.addColorStop(0,'#ccc');
        r.addColorStop(0.9,'#000');
        r.addColorStop(1,'rgba(0,0,0,.8)');
        var f=ctx.createRadialGradient(-2,-2,3,0,0,15);
        f.addColorStop(0,'#fff');
        f.addColorStop(0.9,'#ccc');
        f.addColorStop(1,'rgba(255,255,255,.8)');

        ///////////////绘制圆/////////////

        if(color==="#000"){
            //落白子时候钟表走
            clearInterval(hei);
            bai=setInterval(miao,1000);
            //电子表
            clearInterval(timeHei)
            timeB()
            ctx.fillStyle=r;
        }else{
            //落黑子时候钟表走
            clearInterval(bai);
            hei=setInterval(miaoh,1000);
            //电子表
            clearInterval(timeBai);
            timeH();
            ctx.fillStyle=f;
        }
        ctx.beginPath();
        ctx.translate((position.x+0.5)*off+0.5,(position.y+0.5)*off+0.5);
        ctx.arc(0,0,15,0,2*Math.PI);
        ctx.fill()
        ctx.closePath();
        ctx.restore();
        blocks[v2k(position)]=color;
        delete blank[v2k(position)];
    }
    ////////////////制作5个小圆点///////////////
    function drawcircle(x,y){
        ctx.save();
        ctx.beginPath();
        ctx.arc(x*off , y*off, 3 , 0 ,2*Math.PI);
        ctx.fillStyle='#a55d31';
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    drawcircle(3.5,3.5);
    drawcircle(11.5,3.5);
    drawcircle(7.5,7.5);
    drawcircle(3.5,11.5);
    drawcircle(11.5,11.5);
    ////////////////////根据棋子的位置查询表////////////////////////
    function check(position,color){
        var rownum=1,
            colnum=1,
            leftnum=1,
            rightnum=1;
        var table={};
        var tx=position.x;
        var ty=position.y;
        for(var i in blocks){
            if(blocks[i]==color){
                table[i]=true;
            }
        }
        //////横排//////
        while(table[p2k(tx+1,ty)]){
            rownum++;
            tx++;
        }
        tx=position.x;ty=position.y;
        while(table[p2k(tx-1,ty)]){
            rownum++;
            tx--;
        }
        tx=position.x;ty=position.y;
        ////////////竖排//////
        while(table[p2k(tx,ty+1)]){
            colnum++;
            ty++;
        }
        tx=position.x;ty=position.y;
        while(table[p2k(tx,ty-1)]){
            colnum++;
            ty--;
        }
        tx=position.x;ty=position.y;
        ///////左斜//////
        while(table[p2k(tx-1,ty-1)]){
            leftnum++;
            tx--;
            ty--;
        }
        tx=position.x;ty=position.y;
        while(table[p2k(tx-1,ty+1)]){
            leftnum++;
            tx--;
            ty++;
        }
        tx=position.x;ty=position.y;
        ///////右斜//////
        while(table[p2k(tx+1,ty-1)]){
            rightnum++;
            tx++;
            ty--;
        }
        tx=position.x;ty=position.y;
        while(table[p2k(tx+1,ty+1)]){
            rightnum++;
            tx++;
            ty++;
        }
        // return rownum >=5 || colnum>=5 || leftnum>=5|| rightnum>=5;
        return Math.max(rownum,colnum,leftnum,rightnum);
    }
    //////////绘制行线、竖线/////////
    function draw(){
        ctx.beginPath();
        for(var i=0; i<ROW; i++){
            var sep=off/2;
            var startPoint={x:sep+0.5,y:sep+0.5+i*off}
            var endPoint={x:(ROW-0.5)*off+0.5,y:off/2 + 0.5 + i*off}
            ctx.moveTo(startPoint.x,startPoint.y);
            ctx.lineTo(endPoint.x, endPoint.y);
        }
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        for(var i=0; i<ROW; i++){
            ctx.moveTo(off/2+0.5+ i*off, off/2 + 0.5);
            ctx.lineTo(off/2 + 0.5+ i*off,(ROW-0.5)* off + 0.5);
        }
        ctx.stroke();
        ctx.closePath();
    }
    draw();
    ////////////drawText////////////////////
    function drawText(position,text,color){
        ctx.save();
        ctx.font="15px 微软雅黑";
        if(color=="#000"){
            ctx.fillStyle="#fff";
        }else{
            ctx.fillStyle="#000";
        }
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillText(text,(position.x+0.5)*off,(position.y+0.5)*off);
        ctx.restore();
    }
    ///////////////////review棋谱////////////////////
    function  review(){
        var i=1;
        for (var position in blocks){
            drawText(k2o(position),i,blocks[position]);
            i++;
        }
    }
    /////////////////重新开始游戏/////////////////
    function restart(){
        ctx.clearRect(0,0,width,width);
        blocks={};
        flag=true;
        $(canvas).off('click').on('click',handleclick);
        drawcircle(3.5,3.5);
        drawcircle(11.5,3.5);
        drawcircle(7.5,7.5);
        drawcircle(3.5,11.5);
        drawcircle(11.5,11.5);
        draw();
    }
    //////////////AI/////////////////////
    function AI(){
        var pos1;
        var pos2;
        var max1=-Infinity;
        var max2=-Infinity;
        for(var i in blank){
            //把自己当成黑棋为这个位置打分
            var score1=check(k2o(i),'#000');
            var score2=check(k2o(i),'#fff');
            if(score1>max1){
                pos1=k2o(i);
                max1=score1;
            }
            if(score2>max2){
                pos2=k2o(i);
                max2=score2;
            }

        }
        if(max2 >= max1){
            return pos2
        }else{
            return pos1;
        }
    }

    function handleclick(e) {
        var position={x:Math.round((e.offsetX-off/2)/off),
            y:Math.round((e.offsetY-off/2)/off)};
        if(blocks[v2k(position)]){return};
        if(ai){
            drawchess(position,"#000");

           // h=setInterval(heimiao,1000)
            if(check(position,"#000")>=5){

                if(confirm("是否生成棋谱")){
                    review();
                }
                $(canvas).off('click');
                return;
            }
            drawchess(AI(),"#fff");
            //b=setInterval(baimiao,1000)
            if(check(AI(),"#fff")>5){

                if(confirm("是否生成棋谱")){
                    review();
                }
                $(canvas).off('click');
                return;
            }
            // flag=true;
            return;
        }
        if(flag){
            drawchess(position,"#000");

            if(check(position,"#000")>=5){

                $(canvas).off('click');
                /*$('.blackwin').addClass('ani fade-in-down')
                $('.blackwin').css('display','block')
                setTimeout(function(){
                    $('.qipu').css('display','block');
                },2000)
                $('.yes').on('click',function(){
                    review();
                    $('.qipu').css('display','none');
                    $('.whitewin').css('display','none');
                    $('.blackwin').css('display','none');
                })
                $('.no').on('click',function(){
                    $('.qipu').css('display','none');
                    $('.whitewin').css('display','none');
                    $('.blackwin').css('display','none');
                })*/

                return;
            }
        }else{
            drawchess(position,"#fff");

            if(check(position,"#fff")>=6){

                if(confirm("是否生成棋谱")){
                    review();
                }
                $(canvas).off('click');
                return;
            }
        }
        flag=!flag;
    }


    $(canvas).on('click', handleclick)
    $('.rrdz').on('click',function(){
        $('.rrdz').toggleClass('ani pulse')
    });


    $('.cl').on('click',function(){
        restart();
        $('.cl').toggleClass('ani pulse')
    })
   $('.start').on('click',function(){
       $('.start').toggleClass('ani pulse')
   })
    $('.renji').on('click', function() {
        $('.renji').toggleClass('ani pulse')
        ai = !ai;
})



    function format(second){
        var m=parseInt(second/60);
        var s=parseInt(second%60);
        s=(s < 10)?( '0' + s):s;
        m=(m<10)?('0'+m):m;
        var time=m + ":" + s;
        return time;
    }


    //白秒表
    var second=$('.clock').get(0);
    var sctx=second.getContext('2d');
    var sb=0;
    function miao() {
        sctx.clearRect(0,0,150,150)
        sctx.save();
        sctx.translate(75,75);
        sctx.beginPath();
        sctx.rotate(Math.PI*2/60*sb);
        sctx.arc(0,0,3,0,Math.PI*2);
        sctx.moveTo(0,-3)
        sctx.lineTo(0,-30)
        sctx.moveTo(0,3)
        sctx.lineTo(0,8)
        sctx.stroke();
        sctx.closePath();
        sctx.restore();
        sb++;
    }
    miao()
    //var bai=setInterval(miao,1000);

    var timeBai;
    function timeB() {

        var secondb = 0
        var timeb = $('.time').eq(0);
        timeBai = setInterval(function () {
            secondb++;
            timeb.text(format(secondb))
        }, 1000)
    }

    //黑秒表
    var secondh=$('.clockh').get(0);
    var hctx=secondh.getContext('2d');
    var sh=0;

    function miaoh() {
        hctx.clearRect(0,0,150,150)
        hctx.save();
        hctx.translate(75,75);
        hctx.beginPath();

        hctx.rotate(Math.PI*2/60*sh);
        hctx.arc(0,0,3,0,Math.PI*2);
        hctx.moveTo(0,-3)
        hctx.lineTo(0,-30)
        hctx.moveTo(0,3)
        hctx.lineTo(0,8)

        hctx.stroke();
        hctx.closePath();
        hctx.restore();
        sh++;
    }
    miaoh()
    //var hei=setInterval(miaoh,1000);

    var timeHei;
    function timeH() {

        var secondh = 0;
        var timeh = $('.time').eq(1)
        timeHei = setInterval(function () {
            secondh++;
            timeh.text(format(secondh))
        }, 1000)
    }
})