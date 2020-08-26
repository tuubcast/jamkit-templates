const webjs = require("webjs-helper").initialize("web.subscribe", "__$_bridge")

var __first_loaded = true

function on_loaded() {
    if ($data["channel"]) {
        view.object("web.subscribe").property({ 
            "url":"https://www.youtube.com/channel/" + $data["channel"]
        })
    }
}

function on_web_loaded(data) {
    if (__first_loaded && data["url"].startsWith("https://m.youtube.com/channel/")) {
        webjs.import("youtube_channel.js")
        webjs.call("subscribe").then(function() {
            view.object("web.subscribe").action("show")
        }, function(error) {
            owner.action("script", {
                "script":"subscribe_done"
            })
            controller.action("toast", { "message":"죄송합니다. 잠시 후 다시 시도해주세요." })
        })

        __first_loaded = false

        return
    }
}

function back() {
    owner.action("script", {
        "script":"subscribe_done"
    })
}
