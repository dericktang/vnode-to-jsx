/* @flow */
export default class VNodeToJsx {
    html:string;
    filterKey:string;
    startKey:string;
    
    constructor( vm: Component, filterKey:string, startKey:string ) {
        console.log("[VNodeToJsx]",vm);
        this.root = vm.$root; //虚拟dom根节点
        this.html = "";
        this.filterKey = filterKey;
        this.startKey = startKey;
        // this._tmpEachVm(this.root);
        // console.log("tagtagtagthis.html",this.html);
    }

    /**
     * 遍历生成VDOM
     * @param {*} tmpVm 
     */
    _tmpEachVm(tmpVm){
        if (tmpVm && tmpVm.$children){
            let hasTag = false;
            let toGet =false;
                
            if( this._isKeyString(tmpVm) && this._scanKey(tmpVm) || (!this.filterKey &&!this.startKey)){
                console.log("tmpVm.$vnode.key ",tmpVm.$vnode.key );
                toGet = true;
            }

            if (tmpVm.$vnode && tmpVm.$vnode.componentOptions.tag && toGet) {
                let tag = tmpVm.$vnode.componentOptions.tag || tmpVm.$vnode.tag;
                hasTag = true;
                let jsxProps =this._getVNodeProps(tmpVm.$vnode);
                this.html += "<"+tag+" "+jsxProps+">";
            }
            
            tmpVm.$children.forEach((vm:Component) => {
                this._tmpEachVm(vm);
            });

            if (hasTag){
                this.html += "</"+tmpVm.$vnode.componentOptions.tag+">";
            }
        }
    }

    /**
     * 扫描vnode中key是否符合条件
     * @param {*} tmpVm 
     */
    _scanKey(tmpVm){
        return  this.filterKey ? (this.filterKey ? tmpVm.$vnode.key.indexOf(this.filterKey)>-1 : false) : (this.startKey? tmpVm.$vnode.key==this.startKey : false); 
    }

    /**
     * 判断vnode中key是否是字符串
     */
    _isKeyString(tmpVm){
        return  tmpVm.$vnode && tmpVm.$vnode.key && typeof tmpVm.$vnode.key =="string";
    }

    /**
     * 获取VNode对应的属性
     */
    _getVNodeProps(vnode: VNodeWithData){
        let vnodeCommonentOptions = vnode.componentOptions;
        let vmClass = vnodeCommonentOptions.Ctor;
        return this._toJSXProps(vnodeCommonentOptions,vmClass);
    }

    /**
     * 转为JSX可识别的属性
     * @param {*} vnodeCommonentOptions 
     * @param {*} vmClass 
     */
    _toJSXProps(vnodeCommonentOptions : VNodeComponentOptions,vmClass:Class<Component>){
        let props = "";
        for (let m in vnodeCommonentOptions.propsData) {
            let type = vmClass.options.props[m].type;
            // console.log("vnodeprops:",m,type,type && type.toString());
            if (type) {
                //这里需求取函数名字来判断属于哪种类型，有个类型解析优先级 [Function>String>Number]
                if (type instanceof Array){
                    type = type[0];
                }
                props = props + " " + m + "={" + type(vnodeCommonentOptions.propsData[m]) + "}";
            } else {
                if (typeof vnodeCommonentOptions.propsData[m]=="object") {
                    props = props + " " + m + '={' + JSON.stringify(vnodeCommonentOptions.propsData[m]) + '}';
                }else{
                    props = props + " " + m + '="' + vnodeCommonentOptions.propsData[m] + '"';
                }
                
            }
        }
        return props;
    }

    /**
     * 生成Jsx
     */
    makeToJsx(){
        this._tmpEachVm(this.root);
        return this.html;
    }
}