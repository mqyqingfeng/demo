(function() {

    // requestAnimationFrame 兼容到 IE6
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

    var util = {
        getViewPortSize: function() {
            var w = window;
            if (w.innerWidth != null) return { x: w.innerWidth, y: w.innerHeight };
            var d = w.document;
            // 表明是标准模式
            if (document.compatMode == "CSS1Compat") {
                return {
                    x: d.documentElement.clientWidth,
                    y: d.documentElement.clientHeight
                }
            }
            // 怪异模式
            return { x: d.body.clientWidth, y: d.body.clientHeight }
        },
        extend: function(target) {
            for (var i = 1, len = arguments.length; i < len; i++) {
                for (var prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        target[prop] = arguments[i][prop]
                    }
                }
            }

            return target
        },
        //返回角度
        GetSlideAngle: function(dx, dy) {
            return Math.atan2(dy, dx) * 180 / Math.PI;
        },

        //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
        GetSlideDirection: function(startX, startY, endX, endY) {
            var dy = startY - endY;
            var dx = endX - startX;
            var result = 0;

            //如果滑动距离太短
            if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                return result;
            }

            var angle = util.GetSlideAngle(dx, dy);
            if (angle >= -45 && angle < 45) {
                result = 4;
            } else if (angle >= 45 && angle < 135) {
                result = 1;
            } else if (angle >= -135 && angle < -45) {
                result = 2;
            } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                result = 3;
            }

            return result;
        }
    }

    function Slider(element, options) {

        EventEmitter.call(this);

        this.element = document.getElementById(element);
        this.options = util.extend({}, this.constructor.defaultOptions, options)
        this.init()
    }

    Slider.defaultOptions = {
        speed: 30
    }

    var proto = Slider.prototype = new EventEmitter;

    proto.constructor = Slider;

    proto.init = function() {
        var self = this;
        this.setElement();

        this.bindSwiperEvent();
    }

    proto.setElement = function() {
    	var viewPortSize = util.getViewPortSize();
    	// 设置每个 li 的宽度为 屏幕宽度
        this.clientWidth = viewPortSize.x;

        var list = this.element.getElementsByTagName("li");
        var len = list.length;

        for (var i = 0; i < len; i++) {
            list[i].style.width = this.clientWidth + 'px';
        }

        // 设置每个 answer-content 的高度为 屏幕高度 - 430
        this.clientHeight = viewPortSize.y;

        var answerList = this.element.getElementsByClassName("answer-content");
        var answerLen = answerList.length;

        for (var i = 0; i < answerLen; i++) {
            console.log(this.clientHeight - this.clientWidth / 2 + 'px')
            answerList[i].style.height = this.clientHeight - this.clientWidth / 2 + 'px'
        }

        this.element.style.width = '400%'
        this.element.style.left = 0;
        this.element.style.top = 0;
        this.element.style.position = "absolute";

    }

    proto.index = 0;



    proto.next = function() {



        var timer, self = this;
        cancelAnimationFrame(timer);

        // var start = 0,
        //     beginingValue = self.index * self.clientWidth,
        //     changeValue = (self.index + 1) * self.clientWidth,
        //     during = 40;

        console.log('向后滑动')

        function step(timestamp) {

            if (self.index > 2) {
                return;
            }


            var startPosition = parseFloat(self.element.style.left);
            var endPosition = self.clientWidth * (self.index + 1) * -1

            // start++;
            if (startPosition > endPosition) {
                // console.log(parseFloat(self.element.style.left))
                // console.log(self.options.speed)
                self.element.style.left = Math.max(parseFloat(self.element.style.left) - self.options.speed, endPosition) + 'px';
                // self.element.style.left = -Tween.Sine.easeIn(start, beginingValue, changeValue, during) + 'px'
                timer = requestAnimationFrame(step);
            } else {
                cancelAnimationFrame(timer);
                self.index += 1;
                self.emit("in", [self.index])
            }
        }

        requestAnimationFrame(step);

    }

    proto.prev = function() {



        var timer, self = this;
        cancelAnimationFrame(timer);

        console.log('向前滑动')

        function step(timestamp) {

            if (self.index < 1) {
                return;
            }


            var startPosition = parseFloat(self.element.style.left);
            var endPosition = self.clientWidth * (self.index - 1) * -1

            if (startPosition < endPosition) {

                self.element.style.left = Math.min(parseFloat(self.element.style.left) + self.options.speed, endPosition) + 'px';
                timer = requestAnimationFrame(step);
            } else {
                cancelAnimationFrame(timer);
                self.index -= 1;
                self.emit("out", [self.index])
            }
        }

        requestAnimationFrame(step);

    }

    proto.bindSwiperEvent = function() {
        var self = this;

        //滑动处理
        var startX, startY;

        E.addEvent(document, 'touchstart', function(ev) {
            startX = ev.touches[0].pageX;
            startY = ev.touches[0].pageY;
        })


        E.addEvent(document, 'touchend', function(ev) {
            var endX, endY;
            endX = ev.changedTouches[0].pageX;
            endY = ev.changedTouches[0].pageY;
            var direction = util.GetSlideDirection(startX, startY, endX, endY);
            switch (direction) {
                case 0:
                    // alert("没滑动");
                    break;
                case 1:
                    // 上

                    break;
                case 2:
                    // 下

                    break;
                case 3:
                    // 向左
                    self.next()
                    break;
                case 4:
                    // 向右
                    self.prev()
                    break;
                default:
            }
        })

    }

    this.Slider = Slider;

}());