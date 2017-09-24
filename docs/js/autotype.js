(function() {
    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global) ||
        this || {};


    var util = {
        extend: function(target) {
            for (var i = 1, len = arguments.length; i < len; i++) {
                for (var prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        target[prop] = arguments[i][prop]
                    }
                }
            }

            return target
        }
    };

    function AutoType(element, arr, options) {

        EventEmitter.call(this);

        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        this.options = util.extend({}, this.constructor.defaultOptions, options);
        this.resultArr = this.handleArr(arr);
        this.index = 0;
        this.element.offsetParent.offsetParent.scrollTop = 0;
        this.type();
    }

    AutoType.VERSION = '1.0.0';

    AutoType.defaultOptions = {
        speed: 150
    }

    var proto = AutoType.prototype = new EventEmitter;

    proto.constructor = AutoType;

    proto.handleArr = function(arr) {

        // console.log('要处理的数组为', arr)

        var result = [];

        for (var i = 0; i < arr.length; i++) {

            var current = arr[i];

            if (typeof current == 'object') {
                if (current.type == 'text') {
                    result = result.concat(current.text.split(''))
                } else if (current.type == 'delete') {
                    for (var j = 0; j < current.num; j++) {
                        result.push({
                            type: "delete"
                        })
                    }
                } else if (current.type == 'img') {
                    result.push('<img id=' + (current.id ? current.id : '""') +  ' src=' + current.src + ' title=' + (current.title ? current.title : '""') + ' style="display: block;margin-left:auto;margin-right: auto;margin-top: 30px;margin-bottom: 30px;max-width:100%;" />')
                } else {
                    result.push(current)
                }
            } else {

                result.push(current)
            }
        }

        // console.log('处理完毕的数组为', result)

        return result;
    }

    proto.type = function() {

        var index = this.index;
        var resultArr = this.resultArr;



        if (index < resultArr.length) {
            if (typeof resultArr[index] == 'string') {
                this.element.innerHTML = this.element.innerHTML.slice(0, -1) + resultArr[index] + '_';
                this.index++
                // console.log(this.element.scrollHeight)
                this.element.scrollTop = this.element.scrollHeight + 130;
                setTimeout(this.type.bind(this), this.options.speed)
            } else {
                var obj = resultArr[index];
                if (obj.type == 'delete') {
                    console.log('删除')
                    this.element.innerHTML = this.element.innerHTML.slice(0, -2) + '_'
                    this.index++
                    this.element.scrollTop = this.element.scrollHeight + 130;
                    setTimeout(this.type.bind(this), this.options.speed)
                } else if (obj.type == 'wait') {
                    this.index++;
                    this.element.scrollTop = this.element.scrollHeight + 130;
                    setTimeout(this.type.bind(this), obj.time)
                }
            }
        } else {

            this.element.innerHTML = this.element.innerHTML.slice(0, -1);
            this.element.scrollTop = this.element.scrollHeight;
            this.index = 0;
            this.emit("end")
        }

    }

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = AutoType;
        }
        exports.AutoType = AutoType;
    } else {
        root.AutoType = AutoType;
    }

}());