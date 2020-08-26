WebJSFeed = (function() {
    return {
        __contexts: {},
        __web_loaded: false
    }
})();

WebJSFeed.feed = function(name, handler) {
    var context = WebJSFeed.__get_context(name);

    if (WebJSFeed.__web_loaded) {
        handler(context["next-token"]);
    } else {
        context["handler"] = handler;
    }
}

WebJSFeed.reset = function() {
    WebJSFeed.__web_loaded = false
    WebJSFeed.__contexts = {}
}

WebJSFeed.on_feed_done = function(name, next_token) {
    var context = WebJSFeed.__get_context(name);

    if (context["handler"]) {
        delete context["handler"];
    }

    context["next-token"] = next_token;
}

WebJSFeed.on_web_loaded = function() {
    WebJSFeed.__web_loaded = true

    Object.keys(WebJSFeed.__contexts).forEach(function(name) {
        var context = WebJSFeed.__get_context(name);
        
        if (context["handler"]) {
            context["handler"](context["next-token"]);
        }
    });
}

WebJSFeed.is_web_loaded = function() {
    return WebJSFeed.__web_loaded;
}

WebJSFeed.__get_context = function(name) {
    if (!WebJSFeed.__contexts[name]) {
        WebJSFeed.__contexts[name] = {};
    }

    return WebJSFeed.__contexts[name];
}

__MODULE__ = WebJSFeed;