var util = {
	setOpacity: function(ele, opacity) {
	    if (ele.style.opacity != undefined) {
	        ele.style.opacity = opacity / 100;
	    } else {
	        // 兼容低版本 IE 浏览器
	        ele.style.filter = "alpha(opacity=" + opacity + ")";
	    }
	},
	fadeIn: function(element, speed) {
	    var opacity = 0;
	    util.setOpacity(element, 0)
	    var timer;

	    function step() {
	        util.setOpacity(element, opacity += speed)
	        if (opacity < 100) {
	            timer = requestAnimationFrame(step);
	        } else {

	            cancelAnimationFrame(timer)
	        }
	    }
	    requestAnimationFrame(step)
	},
	fadeOut: function(element, speed) {
	    var opacity = 100;
	    util.setOpacity(element, 100)
	    var timer;

	    function step() {
	        util.setOpacity(element, opacity -= speed)
	        if (opacity > 0) {
	            timer = requestAnimationFrame(step);
	        } else {
	        	element.style.display = 'none';
	            cancelAnimationFrame(timer)
	        }
	    }
	    requestAnimationFrame(step)
	},
}


var pics = [
	"http://yayu.coding.me/introduction/img/yayu.jpeg",
	"http://yayu.coding.me/introduction/img/yutian.jpeg",
	"http://yayu.coding.me/introduction/img/dongxiaojie.jpeg",
	"http://yayu.coding.me/introduction/img/jingjing.jpeg",
	"http://yayu.coding.me/introduction/img/joke.png",
	"http://yayu.coding.me/introduction/img/joke2.jpg",
	"http://yayu.coding.me/introduction/img/introduction.jpg",
	"http://yayu.coding.me/introduction/img/loading.jpeg"
]

var loadImg = function(pics, callback){
    var index = 0;
    var len = pics.length;
    var img = new Image();
    var flag = false;

    console.log(pics)

    var load = function(){

    	img.src = pics[index];

        img.onload = function() {

            index ++ ;
            if (index < len) {
                load();
            }else{
                callback()
            }
        }
        return img;
    }


    if(len > 0){
        load();
    }else{

    }
}

loadImg(pics, function(){
    setTimeout(function(){
    	util.fadeOut(document.getElementById("loading-wrapper"), 10);
    	// 初始化滚动
    	var slider = new Slider('answer-list');

    	var arr1 =
    	[
    		{type: 'text', text: '泻药，我是静静的小助理，不得不说，静静是个十足的女神经，嗯？'},
    		{type: 'wait', time: 900},
    		{type: 'delete', num: 4},
    		{type: 'text', text: '，嗯!' },
    		'<br /><br />',
    		{type: 'text', text: '她温柔美丽，善良大方，......'},
    		'<br /><br />',
    		{type: 'text', text: '编不下去了，还是看看静静的十年老铁怎么说吧'},
    		'<br /><br />',
    		{type: 'text', text: '下面，我们热烈欢迎黄瓜兄~'},
    		{type: 'wait', time: 900}
    	]

    	var content1 = document.getElementById("answer-content1");

    	var content2 = document.getElementById("answer-content2");
    	var arr2 =
    	[
    		{type: 'text', text: '大家好，我就是静静的十年老铁！'},
    		'<br /><br />',
    		{type: 'text', text: '我先来列举下静静同学的几个特质：'},
    		'<br /><br />',
    		{type: 'text', text: '1. 笑点低，讲个笑话就能把自己逗死的那种 ↓'},
    		{type: 'img', src: "http://yayu.coding.me/introduction/img/joke.png", id: "joke1"},
    		{type: 'wait', time: 2000},
    		{type: 'text', text: '2. 人缘差，比如她最近摔了个下巴 ↓'},
    		{type: 'img', src: "http://yayu.coding.me/introduction/img/joke2.jpg", id: "joke1"},
    		{type: 'wait', time: 3000},
    		{type: 'text', text: '不过，静静身材保持的还是很好的，十年始终都是个小胖友！'},
    		{type: 'wait', time: 900}

    	]

    	var content3 = document.getElementById("answer-content3");
    	var arr3 =
    	[
    		{type: 'text', text: '泻药，我是静静的前任......同事，我比较有资格回答这个问题。'},
    		'<br /><br />',
    		'<video style="width: 100%" height="240" preload="auto" controls="controls" autoplay="autoplay"> <source src="img/interview.mp4" type="video/mp4" /> Your browser does not support the video tag. </video>',
    		{type: 'text', text: '看完往左滑哈~'},
    		'<br /><br />',
    	]

    	var content4 = document.getElementById("answer-content4");
    	var arr4 =
    	[
    		{type: 'text', text: '大家好，我是静静本人，前几位屁民的叙述，不够客观，让我来澄清一下：'},
    		'<br /><br />',
    		{type: 'img', src: "http://yayu.coding.me/introduction/img/introduction.jpg", id: "wecode"}
    	]

    	var answer = document.getElementById("answer")

    	// 1s 后开始输入文字，输入文字完毕后，滑动到第二屏
    	setTimeout(function(){
    		content1.innerHTML = '';
    		var area1 = new AutoType(content1, arr1);
    		area1.once("end", function(){
    			slider.next();
    		})
    	}, 1000)

    	//滑动到第二屏后，开始输入文字
    	slider.on("in", function(index){

    		if(index == 1) {
    			content2.innerHTML = '';
    			answer.scrollTop = 0;
    			var area2 = new AutoType(content2, arr2);
    			area2.once("end", function(){
    				answer.scrollTop = 0;
    				slider.next();
    			})
    		}
    		else if (index == 2) {
    			content3.innerHTML = '';

    			var area3 = new AutoType(content3, arr3);
    			area3.once("end", function(){
    				answer.scrollTop = 0;

    			})
    		}
    		else if (index == 3) {
    			content4.innerHTML = '';

    			var area4 = new AutoType(content4, arr4);
    			area4.once("end", function(){
    				slider.allOff()
    			})
    		}

    	})
    }, 500);
});

E.addEvent(window, 'load', function(){
	console.log('页面加载完毕')
})