// 全局变量a和b，分别获取用户框和密码框的value值
var a = $("#uid").value;
var b = $("pwd").value;
var message_1 = $("#message_1")[0];
var message_2 = $("#message_2")[0];

// 若输入框为空，阻止表单的提交
function submitTest() {
  if (!a && !b) { //用户框value值和密码框value值都为空
    message_1.innerHTML = "请输入用户名！";
    message_2.innerHTML = "请输入密码！";
    return false; //只有返回true表单才会提交
  } else if (!a) { //用户框value值为空
    message_1.innerHTML = "请输入用户名！";
    return false;
  } else if (!b) { //密码框value值为空
    message_2.innerHTML = "请输入密码！";
    return false;
  }
}

/*
 * 拖动滑块
 */
(function ($) {
  $.fn.drag = function () {
    var x, drag = this,
      isMove = false,
      tag = true;
    // 添加背景，文字，滑块
    var html = '<div class="drag_bg"></div>' +
      '<div class="drag_text" onselectstart="return false;" unselectable="on">拖动滑块验证</div>' +
      '<div class="handler handler_bg"></div>';
    this.append(html);

    var handler = drag.find('.handler');
    var drag_bg = drag.find('.drag_bg');
    var text = drag.find('.drag_text');
    // 能滑动的最大间距
    var maxWidth = drag.width() - handler.width();

    // 鼠标按下时候的x轴的位置
    handler.mousedown(function (e) {
      isMove = true;
      tag = false;
      x = e.pageX - parseInt(handler.css('left'), 10);
      y = e.pageY;
    });

    // 鼠标指针在上下文移动时，移动距离大于0小于最大间距，滑块x轴位置等于鼠标移动距离
    $(document).mousemove(function (e) {
      if (tag) {
        return;
      }
      var _x = e.pageX - x;
      if (isMove) {
        if (_x < 0) {
          _left = _width = 0;
        } else if (_x > maxWidth) {
          _left = _width = maxWidth;
        } else {
          _left = _width = _x;
        }

        handler.css({
          'left': _left
        });
        drag_bg.css({
          'width': _width
        });

      }
    }).mouseup(function (e) {
      if (tag) {
        return;
      }
      tag = true;
      isMove = false;

      var _x = e.pageX - x;
      var _y = e.pageY;

      if (_x <= maxWidth || parseInt(handler.css('left'), 10) < maxWidth) {
        // 鼠标松开时，如果没有达到最大距离位置，滑块就返回初始位置
        handler.css({
          'left': 0
        });
        drag_bg.css({
          'width': 0
        });
      } else if (_x > maxWidth) {
        // 鼠标指针移动距离达到最大时清空事件
        if (y == _y) {
          robot_tag = false;
        } else {
          robot_tag = true;
        }
        dragOk(robot_tag);
      }
    });

    // 清空事件
    function dragOk(robot_tag) {

      handler.removeClass('handler_bg').addClass('handler_ok_bg');
      if (robot_tag) {
        text.text('验证通过');
      } else {
        text.text('怀疑非人操作');
      }

      drag.css({ 'color': '#fff' });
      handler.unbind('mousedown');
      tag = true;
      // $(document).unbind('mousemove');
      // $(document).unbind('mouseup');
    }
  };
  $.fn.reset = function () {
    this.empty();
    this.drag();
  };
})(jQuery);

(function (undefined) {
  let _global;
  //工具函数
  //配置合并
  function extend(def, opt, override) {
    for (let k in opt) {
      if (opt.hasOwnProperty(k) && (!def.hasOwnProperty(k) || override)) {
        def[k] = opt[k];
      }
    }
    return def;
  }

  //日期格式化
  function formartDate(y, m, d, symbol) {
    symbol = symbol || '-';
    m = (m.toString())[1] ? m : '0' + m;
    d = (d.toString())[1] ? d : '0' + d;
    return y + symbol + m + symbol + d
  }

  function Schedule(opt) {
    let render = function () {
      const fullDay = new Date(year, month + 1, 0).getDate(), //当月总天数
        startWeek = new Date(year, month, 1).getDay(), //当月第一天是周几
        total = (fullDay + startWeek) % 7 == 0 ? (fullDay + startWeek)
          : fullDay + startWeek + (7 - (fullDay + startWeek) % 7),//元素总个数
        lastMonthDay = new Date(year, month, 0).getDate(), //上月最后一天
        eleTemp = [];
      for (let i = 0; i < total; i++) {
        if (i < startWeek) {
          eleTemp.push('<li class="other-month"><span class="dayStyle">' + (lastMonthDay - startWeek + 1 + i) + '</span></li>')
        } else if (i < (startWeek + fullDay)) {
          const nowDate = formartDate(year, month + 1, (i + 1 - startWeek),
            '-');
          let addClass = '';
          selectedDate == nowDate && (addClass = 'selected-style');
          formartDate(currentYear, currentMonth + 1, currentDay, '-') == nowDate && (addClass = 'today-flag');
          eleTemp.push('<li class="current-month" ><span title=' + nowDate + ' class="currentDate dayStyle ' + addClass + '">' + (i + 1 - startWeek) + '</span></li>')
        } else {
          eleTemp.push('<li class="other-month"><span class="dayStyle">' + (i + 1 - (startWeek + fullDay)) + '</span></li>')
        }
      }
      el.querySelector('.schedule-bd').innerHTML = eleTemp.join('');
      el.querySelector('.today').innerHTML = formartDate(year, month + 1, day,
        '-');
    };
    var def = {},
      opt = extend(def, opt, true),
      curDate = opt.date ? new Date(opt.date) : new Date(),
      year = curDate.getFullYear(),
      month = curDate.getMonth(),
      day = curDate.getDate(),
      currentYear = curDate.getFullYear(),
      currentMonth = curDate.getMonth(),
      currentDay = curDate.getDate(),
      selectedDate = '',
      el = document.querySelector(opt.el) || document.querySelector('body'),
      _this = this;
    const bindEvent = function () {
      el.addEventListener('click', function (e) {
        switch (e.target.id) {
          case 'nextMonth':
            _this.nextMonthFun();
            break;
          case 'nextYear':
            _this.nextYearFun();
            break;
          case 'prevMonth':
            _this.prevMonthFun();
            break;
          case 'prevYear':
            _this.prevYearFun();
            break;
          default:
            break;
        }
        if (e.target.className.indexOf('currentDate') > -1) {
          opt.clickCb && opt.clickCb(year, month + 1, e.target.innerHTML);
          selectedDate = e.target.title;
          day = e.target.innerHTML;
          render();
        }
      }, false)
    };
    const init = function () {
      const scheduleHd = '<div class="schedule-hd">' +
        '<div>' +
        '<span class="arrow icon iconfont icon-116leftarrowheads" id="prevYear" ></span>' +
        '<span class="arrow icon iconfont icon-112leftarrowhead" id="prevMonth"></span>' +
        '</div>' + '<div class="today">' + formartDate(year, month + 1, day, '-') + '</div>' +
        '<div>' + '<span class="arrow icon iconfont icon-111arrowheadright" id="nextMonth"></span>' +
        '<span class="arrow icon iconfont icon-115rightarrowheads" id="nextYear"></span>' +
        '</div>' + '</div>';
      const scheduleWeek = '<ul class="week-ul ul-box">' +
        '<li>日</li>' +
        '<li>一</li>' +
        '<li>二</li>' +
        '<li>三</li>' +
        '<li>四</li>' +
        '<li>五</li>' +
        '<li>六</li>' +
        '</ul>';
      const scheduleBd = '<ul class="schedule-bd ul-box" ></ul>';
      el.innerHTML = scheduleHd + scheduleWeek + scheduleBd;
      bindEvent();
      render();
    };
    this.nextMonthFun = function () {
      if (month + 1 > 11) {
        year += 1;
        month = 0;
      } else {
        month += 1;
      }
      render();
      opt.nextMonthCb && opt.nextMonthCb(year, month + 1, day);
    },
      this.nextYearFun = function () {
        year += 1;
        render();
        opt.nextYeayCb && opt.nextYeayCb(year, month + 1, day);
      },
      this.prevMonthFun = function () {
        if (month - 1 < 0) {
          year -= 1;
          month = 11;
        } else {
          month -= 1;
        }
        render();
        opt.prevMonthCb && opt.prevMonthCb(year, month + 1, day);
      },
      this.prevYearFun = function () {
        year -= 1;
        render();
        opt.prevYearCb && opt.prevYearCb(year, month + 1, day);
      };
    init();
  }

  //将插件暴露给全局对象
  _global = (function () {
    return this || (0, eval)('this')
  }());
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Schedule;
  } else if (typeof define === "function" && define.amd) {
    define(function () {
      return Schedule;
    })
  } else {
    !('Schedule' in _global) && (_global.Schedule = Schedule);
  }

}());
/**
   * 上传函数
   * @param fileInput DOM对象
   * @param callback 回调函数
   */
function getFileContent(fileInput, callback) {
  if (fileInput.files && fileInput.files.length > 0 && fileInput.files[0].size > 0) {
    var file = fileInput.files[0];
    if (window.FileReader) {
      var reader = new FileReader();
      reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
          callback(evt.target.result);
        }
      };
      reader.readAsText(file);
    }
  }
}

/**
 * 下载函数
 * @param filename
 * @param content
 */
function download(filename, content) {
  var blob = new Blob([content], {
    type: 'text/plain'
  });
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');

  a.style = "display: none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 5);
}

$(document).ready(function () {
  // 模拟进度条
  var value = 0;
  var prog_int = setInterval(function () {
    if (value < 100) {
      value = parseInt(value) + 1;
      $("#prog").css("width", value + "%").text(value + "%");
    } else {
      window.clearInterval(prog_int);
      document.getElementById('D1').innerHTML = '<div class="alert alert-warning" role="alert">我出来啦</div>';
    }
  }, 100);

  var logged = window.location.search.replace('?', '').split('&');
  if (logged.length >= 2) {
    var dic = [];
    logged.forEach(element => {
      dic[element.split('=')[0]] = element.split('=')[1];
    });

    if (dic.user == 'admin' && dic.password == '123456') {
      $("#s").text = "登陆成功";
      document.getElementById("s").innerHTML = "登陆成功";
    } else if (dic.user == 'admin') {
      document.getElementById("s").innerHTML = "密码错误";
    } else {
      document.getElementById("s").innerHTML = "用户名不存在";
    }
  }

  // 用户框失去焦点后验证value值
  $("#uid").blur(function () {
    a = document.getElementById("uid").value;
    if (!a) { //用户框value值为空
      message_1.innerHTML = "用户名不能为空";
    } else { //用户框value值不为空
      message_1.innerHTML = "";
    }
  });

  // 用户框获得焦点的隐藏提醒
  $("#uid").focus(function () {
    message_1.innerHTML = "";
    message_1.className = "message_user_" + Math.ceil(Math.random() * 100);
  });

  // 密码框失去焦点后验证value值
  $("#pwd").blur(function () {
    b = document.getElementById("pwd").value;
    if (!b) { //密码框value值为空
      message_2.innerHTML = "密码不能为空";
    } else { //密码框value值不为空
      message_2.innerHTML = "";
    }
  });

  // 密码框获得焦点的隐藏提醒
  $("#pwd").focus(function () {
    message_2.innerHTML = "";
    message_2.className = "message_pwd_" + Math.ceil(Math.random() * 100);
  });

  // 下拉列表
  $("#s1Id").change(function () {
    document.getElementById('s2Id').textContent = document.getElementById("s1Id").options[window.document
      .getElementById(
        "s1Id").selectedIndex].text;
  });

  // 警告框
  $("#b1").click(function () {
    if (confirm("有警告?")) {
      $("#t1")[0].value = "点击了确定";
    } else {
      $("#t1")[0].value = "点击了取消";
    }
  });

  // 提问框
  $("#b2").click(function () {
    $("#t2")[0].value = prompt("你是谁？", "输入你的名字");
  });

  // 双击
  $("#dblclick").dblclick(function (obj) {
    if (obj.target.style.backgroundColor === 'green') {
      obj.target.style.backgroundColor = 'red';
    } else {
      obj.target.style.backgroundColor = 'green';
    }
  });

  // 拖拽验证码
  $('#drag').drag();
  $("#re_drag").click(function () {
    $('#drag').reset();
  });

  // 拖拽
  $('.dowebok').dad();

  // 单击
  $("#click").click(function (obj) {
    if (obj.target.style.backgroundColor === 'green') {
      obj.target.style.backgroundColor = 'red';
    } else {
      obj.target.style.backgroundColor = 'green';
    }
  });

  // upload内容变化时载入内容
  $("#upload").change(function () {
    var content = document.getElementById('content');

    getFileContent(this, function (str) {
      content.value = str;
    });
  });

  //  点击下载
  $("#down").click(function () {
    var filename = "test.txt";
    var content = document.getElementById('content').value;
    download(filename, content);
  });

  // 日期选择器
  if ($("#schedule-box").length) {
    new Schedule({
      el: '#schedule-box',
      clickCb: function (y, m, d) {
        document.querySelector('#h3Ele').innerHTML = '日期：' + y + '-' + m + '-' + d
      },
      nextMonthCb: function (y, m, d) {
        document.querySelector('#h3Ele').innerHTML = '日期：' + y + '-' + m + '-' + d
      },
      nextYeayCb: function (y, m, d) {
        document.querySelector('#h3Ele').innerHTML = '日期：' + y + '-' + m + '-' + d
      },
      prevMonthCb: function (y, m, d) {
        document.querySelector('#h3Ele').innerHTML = '日期：' + y + '-' + m + '-' + d
      },
      prevYearCb: function (y, m, d) {
        document.querySelector('#h3Ele').innerHTML = '日期：' + y + '-' + m + '-' + d
      }
    });
  }

  // 日期时间选择器
  $("#date_time").click(function () {
    SetDate(this, 'yyyy-MM-dd hh:mm:ss');
  });

  // 模态框
  $("#b5").click(function () {
    $("#t3")[0].value = $("#basic-addon1")[0].value;
    $("#exampleModal").modal('hide');
    $("#basic-addon1")[0].value = "";
  });
});