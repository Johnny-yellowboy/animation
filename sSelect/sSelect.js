'use strict'

!(function ($) {
  function sSelect(ele, ops) {
    var $this = this
    $this.ele = $(ele)
    $this.ops = $.extend({}, $.fn.sSelect.defaults, ops)
    this.init(ops)
  }

  sSelect.prototype = {
    constructor: sSelect,
    init: function init(ops) {
      var $this = this,
        data = this.ops.data,
        once = false,
        $b = this.creat(data)
      $this.ele.append($b)
      this.addStyle(ops, once)
      this.onScroll()
      this.onClick()
      this.onSelect()
      this.onFocus()
      this.onBlur()
      this.onChange()
    },
    creat: function creat(data) {
      if (this.ops.updateData != '') {
        this.ele.children('.search-con').remove()
        data = this.ops.updateData
      }

      var $ul = '',
        $li = ''
      data.forEach(function (e) {
        var v = e.value
        $li += '<li value="' + v + '" title="' + v + '">' + v + '</li>'
        $ul = '<ul>' + $li + '</ul>'
      }) // 滚动条

      var length = data.length

      if (length >= 10) {
        var $scrollBar = '<div class="select-scroll-bar"></div>',
          $scroll = '<div class="select-scroll">' + $scrollBar + '</div>',
          $b = '<div class="search-con">' + $ul + $scroll + '</div>'
      } else {
        var $b = '<div class="search-con">' + $ul + '</div>'
      }

      return $b
    },
    onScroll: function onScroll() {
      var s = this.ele[0].querySelector('.select-scroll')

      if (s) {
        var num = 0
        var con = this.ele.children('.search-con')
        // 判断是否火狐浏览器，兼容鼠标滚轮事件
        if (navigator.userAgent.indexOf('Firefox') > -1) {
          var mousewheel = 'DOMMouseScroll'
        } else {
          var mousewheel = 'mousewheel'
        }
        // console.log(mousewheel)
        con[0].addEventListener(mousewheel, function (e) {
          var conH = this.offsetHeight
          var ulH = this.querySelector('ul').offsetHeight
          var scrollH = conH * 0.9
          var barHeight = scrollH / (ulH / conH)

          var bar = this.querySelector('.select-scroll-bar')
          if (e.wheelDelta < 0 || -e.detail < 0) {
            if (num < (ulH - conH) / 24) {
              num++
              this.querySelector('ul').style.top = -num * 24 + 'px'
            }
          }
          if (e.wheelDelta > 0 || -e.detail > 0) {
            if (num > 0) {
              num--
              this.querySelector('ul').style.top = -num * 24 + 'px'
            }
          }
          var top = +this.querySelector('ul').style.top.slice(0, -2)
          // bar的top比例：ulH-conH/scrollH-barHeight = top/barTop
          // bartop = top / (ulH-conH/scrollH-barHeight)
          var bartop = -top / ((ulH - conH) / (scrollH - barHeight))
          bar.style.top = bartop + 'px'
        })
      }
    },
    onClick: function onClick() {
      var $this = this,
        input = this.ele.children('input'),
        con = this.ele.children('.search-con')[0]

      input.on('click', function (e) {
        e.stopPropagation()
        var val = input[0].value,
          cons = document.querySelectorAll('.search-con')
        Array.prototype.slice.call(cons).forEach(function (ele) {
          ele.style.display = 'none'
        })
        con.style.display = 'block'
        $this.filter(val)
        typeof $this.ops.onFocus == 'function' && $this.ops.onFocus(val)
      })
    },
    onFocus: function onFocus() {
      var $this = this,
        input = this.ele.children('input')

      input.on('focus', function (e) {
        var val = input[0].value
        $this.filter(val)
        typeof $this.ops.onFocus == 'function' && $this.ops.onFocus(val)
      })
    },
    onBlur: function onBlur() {
      var $this = this,
        input = this.ele.children('input')
      input.on('blur', function () {
        var val = input[0].value
        typeof $this.ops.onBlur == 'function' && $this.ops.onBlur(val)
      })
    },
    onChange: function onChange() {
      var $this = this,
        input = this.ele.children('input'),
        _theCount = 0
      // ie的input首先自动触发，focus也会触发，给ie注册keyup键盘弹起事件代替input事件
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        var event = 'keyup'
      } else {
        var event = 'input'
      }
      input.off(event)
      input.on(event, function () {
        // 解决ie自动触发input事件
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
          // console.log('ie浏览器')
          _theCount++
          console.log(_theCount)
          // console.log(_theCount)
          if (_theCount < 2) {
            return
          }
        }
        if (!$this.ops.filter) return
        var val = input[0].value
        typeof $this.ops.onChange == 'function' && $this.ops.onChange(val)
        $this.filter(val)
      })
    },
    onSelect: function onSelect() {
      var $this = this,
        lis = $this.ele.children('.search-con').children('ul').children('li')
      lis.on('click', function () {
        var select = this.innerText
        $this.ele.find('input').val(select)
        console.log(select)

        $this.filter(select)
        typeof $this.ops.onSelect == 'function' && $this.ops.onSelect(select)
      })
    },
    addStyle: function addStyle(ops, once) {
      var $this = this,
        ele = this.ele[0],
        sw = ele.offsetWidth,
        input = this.ele.children('input')[0],
        s = ele.querySelector('.select-scroll'),
        bar = ele.querySelector('.select-scroll-bar'),
        conH = ele.querySelector('.search-con').offsetHeight,
        con = this.ele.children('.search-con')[0],
        ulH = this.ele.children('.search-con').children('ul')[0].offsetHeight
      input.style.width = sw + 'px'

      if (s) {
        var width = ops.scollWidth || $this.ops.scollWidth
        s.style.width = width + 'px'
        s.style.height = conH * 0.9 + 'px'
        var scrollH = conH * 0.9 // bar的高度比：  ul/con = barHeight/bar高度
        // bar高度 = scrollH / ul /con
        var barHeight = scrollH / (ulH / conH) // console.log(barHeight)
        bar.style.cssText = 'width:' + width + 'px;height:' + barHeight + 'px'
      }
      if (!once) {
        con.style.display = 'none'
      }
    },
    filter: function filter(v) {
      var $this = this,
        $data = $this.ops.data

      if (this.ops.updateData != '') {
        $data = this.ops.updateData
      }

      var newDa = [],
        newLi = '',
        ul = this.ele.children('.search-con').children('ul'),
        lis = this.ele.children('.search-con').children('ul').children('li'),
        bar = this.ele[0].querySelector('.select-scroll-bar')
      $data.forEach(function (ele, i) {
        var idx = ele.value.indexOf(v.replace(/\s+/g, ''))
        if (idx >= 0) {
          return newDa.push($data[i])
        }
      })
      ul[0].style.top = 0

      if (bar) {
        bar.style.top = 0
      }

      lis.remove()

      if (newDa == '') {
        newLi = '<li class="notfind">抱歉，没有找到<span class="filter-name">"' + v + '"</span>相关数据</li>'
        ul.append(newLi)
      } else {
        newDa.forEach(function (e) {
          var v = e.value
          newLi += '<li value="' + v + '" title="' + v + '">' + v + '</li>'
        })
        ul.append(newLi)
      }
      var once = true

      $this.addStyle($this.ops, once)
      $this.onSelect()
    },
    destroy: function destroy() {
      this.ele.children('.search-con').remove()
    },
  }

  $.fn.sSelect = function (ops, callback) {
    return this.each(function () {
      var $this = $(this),
        classObject = $this.data('classObjectKey')
      $this.data('classObjectKey', new sSelect(this, ops))

      if (typeof ops == 'string' && !!classObject) {
        typeof callback == 'function' ? callback(classObject[ops](args)) : classObject[ops](args)
      }
    })
  }

  $.fn.sSelect.defaults = {
    placeholder: '请选择',
    scollWidth: 4,
    //滚动条宽度
    data: [
      //数据
      {
        value: 'value1',
      },
      {
        value: 'value2',
      },
      {
        value: 'value3',
      },
    ],
    filter: true,
    //是否支持搜索
    updateData: [],
    //更新的数据
    // 获得焦点时回填selectVal-->已经选择的数据的 key值,inputValue-->输入框内的值
    onFocus: function onFocus(val) {
      console.log('focus' + val)
    },
    onBlur: function onBlur(val) {
      console.log('blur' + val)
    },
    //  输入框值改变时回填selectVal-->已经选择的数据的 key值,inputValue-->输入框内的值
    onChange: function onChange(val) {
      console.log('输入框的值' + val)
    },
    // 被选中时调用 selectVal-->已经选择的数据的 key值,curentObj-->当前选择的一条数据的 {key:value}
    onSelect: function onSelect(val) {
      console.log('被选中的' + val)
    },
  }
  $(function () {
    $(document).on('click', function () {
      $('.search-con').css('display', 'none')
    })
    $("[data-toggle='sSelect']").sSelect()
  })
})(window.jQuery)
