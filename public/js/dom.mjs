export let dom = ( function  () {
    return  {
        query: q => document.querySelector(q),
        queryAll: q => document.querySelectorAll(q),
        applyAttributes(domElement, attributes) {
            for(let key in attributes) {
                domElement.setAttribute(key, attributes[key]);
            }
            return domElement;
        },
        makeHTMLElement(name, attributes = {}){
            let element = document.createElement(name.toUpperCase());
            return this.applyAttributes(element, attributes);
        }
    }
})();