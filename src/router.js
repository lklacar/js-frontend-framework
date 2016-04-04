import $ from "jquery";


export default class Router {

    constructor(element) {
        this.routes = {};
        this.element = element;
    }


    registerRoute(path, callback) {
        this.routes[path] = callback;
    }


    check() {
        var path = window.location.hash.substring(1);


            this.routes[path].load(this.element);



    }

}


export function setRouter(router) {
    if (!window.router) {
        window.router = router;
    }

    window.addEventListener('hashchange', function () {
        window.router.check();
    });
    window.addEventListener('load', function () {
        window.router.check();

    });
}