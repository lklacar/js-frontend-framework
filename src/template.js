import $ from "jquery";

function selectElementById(id) {
    return document.querySelectorAll('[data-alljsid="' + id + '"]');
}

function getValue(obj, str) {
    str.split(".").forEach(function (i) {
        obj = obj[i];
    }.bind(this));

    return obj;
}

class Template {

    constructor() {
        this.data = {};
        this.bindings = {};
    }

    /**
     * Must implement.
     * Should return html template.
     */
    getHtml() {
        throw "Not implemented"
    }

    /**
     * Sets data and triggers onDataChange
     * @param key Data key
     * @param value Data valye
     */
    setData(key, value) {
        this.data[key] = value;


        for (const nodeKey in this.bindings) {
            if (this.bindings.hasOwnProperty(nodeKey)) {
                if (this.bindings[nodeKey] === key) {
                    this.onDataChange(nodeKey);
                }
            }
        }
    }

    /**
     * Is triggered every time the user calls setData
     * @param nodeKey
     */
    onDataChange(nodeKey) {
        if (nodeKey === undefined)
            return;

        var element = $('*[data-alljsid="' + nodeKey + '"]');

        var newValue = getValue(this.data, this.bindings[nodeKey]);
        var oldValue = element.text();


        if (oldValue !== newValue)
            element.text(newValue);

    }

    /**
     * Should implement
     * Code will execute right before the rendering. Should be used to set data using setData(key, value);
     */
    load() {
        throw "Not implemented"
    }

    /**
     * Renders element on the screen
     * @param element Element which will contain the template
     */
    render(element) {
        this.load();

        const html = this.getHtml();
        const $html = $(html);

        this.traverse($html, [
            this.generateUniqueNodeId,
        ], -1);

        element.html($html[0].outerHTML);

        this.traverse($html, [
            this.bindData,
            this.bindEvent,
        ], -1);

        this.onDataChange();


    }

    /**
     * Binds defined event to method defined in extended class
     * @param node
     * @param index
     */
    bindEvent(node, index) {
        if (!node.attr("data-on"))
            return;

        const bindDefinition = node.attr("data-on");
        const eventName = bindDefinition.split("->")[0].trim();
        const callback = bindDefinition.split("->")[1].trim();
        const nodeId = node.attr('data-alljsid');

        selectElementById(nodeId)[0].addEventListener(eventName, this[callback].bind(this));
    }

    //noinspection JSMethodCanBeStatic
    /**
     * Generates unique id for the node from parents id
     * @param node - node to process
     * @param index - node index in the parent element
     */
    generateUniqueNodeId(node, index) {
        if (index === -1) { //if root element, set id to 0
            node.attr("data-alljsid", '0');
            return;
        }

        var id = node.parent().attr("data-alljsid") + "." + index;
        $(node).attr("data-alljsid", id);
    }

    //noinspection JSMethodCanBeStatic
    /**
     * Logs currently processed node to the console
     * @param node - node to process
     * @param index - node index in the parent element
     */
    logNode(node, index) {
        console.log(node, index);
    }


    /**
     * Binds data
     * @param node
     * @param index
     */
    bindData(node, index) {
        if (!node.attr("data-bind"))
            return;

        const bindDefinition = node.attr("data-bind");
        const dataKey = bindDefinition.split("->")[0].trim();
        const propertyName = bindDefinition.split("->")[1].trim();
        const dataValue = this.data[dataKey];
        const nodeId = node.attr('data-alljsid');

        if (propertyName === "text") {
            node.text(dataValue);
        } else {
            node.attr(propertyName, dataValue);
        }

        this.bindings[nodeId] = dataKey;


    }

    /**
     * Traverses whole dom tree
     * @param node - node currently being processed
     * @param callbacks - list of callbacks to apply on the current node
     * @param index - node index in the parent element
     */
    traverse(node, callbacks, index) {

        // Call every callback for given node
        $.each(callbacks, function (callbackIndex, callbackObject) {
            callbackObject.bind(this)(node, index);
        }.bind(this));

        // Traverse further
        $.each(node.children(), function (nodeIndex, nodeObject) {
            this.traverse($(nodeObject), callbacks, nodeIndex);
        }.bind(this));
    }
}


export default class ExampleTemplate extends Template {

    getHtml() {
        return require("./template.html");
    }

    load() {
        let i = 0;
        this.setData('count', 0);
        this.setData("obj", {"a": "b"});

        this.setData("person", {
            name: "Luka",
            lastname: "Klacar",
        });


        setInterval(function () {
            this.setData("a", i++);
        }.bind(this), 100);
    }

    //noinspection JSMethodCanBeStatic
    onClick() {
        this.setData('count', this.data.count + 1)
    }

    getName() {
        return "asd";
    }

}