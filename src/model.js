import $ from "jquery";

import {API} from "./api.js";

export class Model {

    static getUrlConfig() {
        return {
            CREATE: "",
            RETRIEVE_ONE: "",
            RETRIEVE_ALL: "",
            UPDATE: "",
            DELETE_ONE: "",
            DELETE_ALL: ""
        }
    }

    setup(data) {
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) { //noinspection JSUnfilteredForInLoop
            var key = keys[i];
            this[key] = data[key]
        }
    }

    getData() {
        return this;
    }

    save() {
        API.post(this.constructor.getUrlConfig().CREATE, this.getData());
    }

    static all(callback) {
        API.get(this.getUrlConfig().ALL, function (array) {
            var data = [];
            for (var i = 0; i < array.length; i++) {
                var elem = array[i];
                var temp = new this();
                temp.setup(elem);
                data.push(temp);
            }
            callback(data);
        }.bind(this));
    }

    static get(id, callback) {

        API.get(this.getUrlConfig().GET.replace("\<id\>", id.toString() + "/"), function (data) {
            var temp = new this();
            temp.setup(data);
            callback(temp);
        }.bind(this));

    }

}



