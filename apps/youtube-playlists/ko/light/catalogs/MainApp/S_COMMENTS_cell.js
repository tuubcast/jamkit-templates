const webjs = require("webjs-helper").initialize("web.comments", "__$_bridge")

function on_loaded() {
    if ($data["video-id"]) {
        view.object("web.comments").property({ 
            "url":"https://m.youtube.com/watch?v=" + $data["video-id"] 
        })
    }
}

function on_web_loaded(data) {
    if (data["url"].startsWith("https://m.youtube.com/watch?")) {
        webjs.import("youtube_video.js")
        webjs.call("pauseVideo")
        webjs.call("showComments").then(function() {
            view.object("effect.loading").action("hide")
            view.object("web.comments").action("show")
        })
        
        return
    }
}

function on_web_prevent(data) {
    if (data["url"].startsWith("https://www.youtube.com/redirect?")) {
        controller.action("link", {
            "url":decodeURIComponent(data["url"].match(/q=(.+)/)[1])
        })
    }
} 

function on_request_url(data) {
    if (data["url"].startsWith("https://m.youtube.com/watch?")) {
        var seconds = data["url"].match(/t=([0-9]+)s/)[1]
        
        if (seconds) {
            owner.action("script", {
                "script":"seek_video",
                "seconds":seconds
            })
        } else {
            controller.action("link", { "url":data["url"] })
        }
    } else {
        controller.action("link", { "url":data["url"] })
    }
}

function back() {
    owner.action("script", {
        "script":"hide_comments"
    })
}
