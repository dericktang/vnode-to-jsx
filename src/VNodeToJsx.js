/* @flow */
export default class VNodeToJsx {
    expression: string;
    cb: Function;
    id: number;
    deep: boolean;
    value: any;

    constructor(
        vnode: VNodeWithData,
        expOrFn: string | Function,
        cb: Function,
        options ? : ? Object,
        isRenderWatcher ? : boolean
    ) {

    }

    static makeToJsx() {
        ['a'].forEach((element) => {
            console.log(element);
        });
    }

    makeToJsx(){
        ['a'].forEach((element) => {
            console.log(element);
        });
    }
}