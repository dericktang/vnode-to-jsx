(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.VNodeToJsx = factory());
}(this, function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /*  */
  var VNodeToJsx = function VNodeToJsx(vm, filterKey, startKey) {
    console.log("[VNodeToJsx]", vm);
    this.root = vm.$root; //虚拟dom根节点

    this.html = "";
    this.filterKey = filterKey;
    this.startKey = startKey; // this._tmpEachVm(this.root);
    // console.log("tagtagtagthis.html",this.html);
  };
  /**
   * 遍历生成VDOM
   * @param {*} tmpVm 
   */


  VNodeToJsx.prototype._tmpEachVm = function _tmpEachVm(tmpVm) {
    var this$1 = this;

    if (tmpVm && tmpVm.$children) {
      var hasTag = false;
      var toGet = false;

      if (this._isKeyString(tmpVm) && this._scanKey(tmpVm) || !this.filterKey && !this.startKey) {
        console.log("tmpVm.$vnode.key ", tmpVm.$vnode.key);
        toGet = true;
      }

      if (tmpVm.$vnode && tmpVm.$vnode.componentOptions.tag && toGet) {
        var tag = tmpVm.$vnode.componentOptions.tag || tmpVm.$vnode.tag;
        hasTag = true;

        var jsxProps = this._getVNodeProps(tmpVm.$vnode);

        this.html += "<" + tag + " " + jsxProps + ">";
      }

      tmpVm.$children.forEach(function (vm) {
        this$1._tmpEachVm(vm);
      });

      if (hasTag) {
        this.html += "</" + tmpVm.$vnode.componentOptions.tag + ">";
      }
    }
  };
  /**
   * 扫描vnode中key是否符合条件
   * @param {*} tmpVm 
   */


  VNodeToJsx.prototype._scanKey = function _scanKey(tmpVm) {
    return this.filterKey ? this.filterKey ? tmpVm.$vnode.key.indexOf(this.filterKey) > -1 : false : this.startKey ? tmpVm.$vnode.key == this.startKey : false;
  };
  /**
   * 判断vnode中key是否是字符串
   */


  VNodeToJsx.prototype._isKeyString = function _isKeyString(tmpVm) {
    return tmpVm.$vnode && tmpVm.$vnode.key && typeof tmpVm.$vnode.key == "string";
  };
  /**
   * 获取VNode对应的属性
   */


  VNodeToJsx.prototype._getVNodeProps = function _getVNodeProps(vnode) {
    var vnodeCommonentOptions = vnode.componentOptions;
    var vmClass = vnodeCommonentOptions.Ctor;
    return this._toJSXProps(vnodeCommonentOptions, vmClass);
  };
  /**
   * 转为JSX可识别的属性
   * @param {*} vnodeCommonentOptions 
   * @param {*} vmClass 
   */


  VNodeToJsx.prototype._toJSXProps = function _toJSXProps(vnodeCommonentOptions, vmClass) {
    var props = "";

    for (var m in vnodeCommonentOptions.propsData) {
      var type = vmClass.options.props[m].type; // console.log("vnodeprops:",m,type,type && type.toString());

      if (type) {
        //这里需求取函数名字来判断属于哪种类型，有个类型解析优先级 [Function>String>Number]
        if (type instanceof Array) {
          type = type[0];
        }

        props = props + " " + m + "={" + type(vnodeCommonentOptions.propsData[m]) + "}";
      } else {
        if (_typeof(vnodeCommonentOptions.propsData[m]) == "object") {
          props = props + " " + m + '={' + JSON.stringify(vnodeCommonentOptions.propsData[m]) + '}';
        } else {
          props = props + " " + m + '="' + vnodeCommonentOptions.propsData[m] + '"';
        }
      }
    }

    return props;
  };
  /**
   * 生成Jsx
   */


  VNodeToJsx.prototype.makeToJsx = function makeToJsx() {
    this._tmpEachVm(this.root);

    return this.html;
  };

  /*  */

  return VNodeToJsx;

}));
