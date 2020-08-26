const webjs = require("webjs-helper").initialize("web.channel", "__$_bridge"),
      feed  = require("webjs-feed")

var __first_loaded = true
var __channel_info = {}

function on_web_loaded(data) {
    if (data["url"].startsWith("https://m.youtube.com/channel")) {
        webjs.import("youtube_channel.js")

        timeout(0.5, function() {
            webjs.call("getChannelInfo").then(function(result) {
                __channel_info = {
                    "title":result["channelInfo"]["title"],
                    "logo-url":result["channelInfo"]["logoUrl"],
                    "subscriber-count":result["channelInfo"]["subscriberCount"],
                    "logged-in":result["channelInfo"]["loggedIn"] ? "yes" : "no",
                    "subscribing":result["channelInfo"]["subscribing"] ? "yes" : "no"
                }

                controller.catalog().submit("showcase", "auxiliary", "S_CHANNEL_INFO", __channel_info)
                controller.update("channel-info", __channel_info)
            })

            if (!feed.is_web_loaded()) {
                feed.on_web_loaded()
            }
        })
    
        return
    }
}

function feed_playlists(keyword, location, length, sortkey, sortorder, handler) {
    if (location == 0 && feed.is_web_loaded()) {
        feed.reset()
        view.object("web.channel").action("home")
    }

    feed.feed("playlists", function(next_token) {
        next_token = (location == 0) ? null : next_token
        webjs.call("getVideos", [ next_token ]).then(function(result) {
            var playlists = []

            result["videos"].forEach(function(video) {
                var video_id = video["url"].match(/v=([^&#]+)/)[1]
                var favorite = controller.catalog().value("showcase", "favorites", "S_FAVORITES_" + video_id)
                playlists.push({
                    "id":"S_PLAYLISTS_" + video_id,
                    "video-id":video_id,
                    "title":video["title"],
                    "view-count":video["viewCount"],
                    "published-at":video["publishedDate"],
                    "favorite":favorite ? "yes" : "no"
                })
            })

            feed.on_feed_done("playlists", location + result["videos"].length)
            handler(playlists)

            if (__first_loaded && playlists.length > 0) {
                owner.action("script", {
                    "script":"start_playlist",
                    "video-id":playlists[0]["video-id"],
                    "title":playlists[0]["title"],
                    "action-by-user":"no"
                })
            }

            __first_loaded = false
        }, function(error) {
            console.log(JSON.stringify(error))
        })
    })
}

function on_select_playlist(data) {
    owner.action("script", {
        "script":"start_playlist",
        "video-id":data["video-id"],
        "title":data["title"],
        "action-by-user":"yes"
    })
}

function show_favorites() {
    owner.action("script", {
        "script":"show_favorites"
    })
}

function toggle_favorite(data) {
    var favorite = controller.catalog().value("showcase", "favorites", "S_FAVORITES_" + data["video-id"])

    if (!favorite) {
        controller.catalog().submit("showcase", "favorites", "S_FAVORITES_" + data["video-id"], {
            "video-id":data["video-id"],
            "title":data["title"]
        })
        controller.update("favorite-" + data["video-id"], { 
            "favorite":"yes"
        })
        controller.action("toast", { "message":"즐겨찾기에 추가되었습니다." })
    } else {
        controller.catalog().remove("showcase", "favorites", "S_FAVORITES_" + data["video-id"])
        controller.update("favorite-" + data["video-id"], { 
            "favorite":"no"
        })
        controller.action("toast", { "message":"즐겨찾기에서 제거되었습니다." })
    }
}

function remove_favorite(data) {
    controller.catalog().remove("showcase", "favorites", "S_FAVORITES_" + data["video-id"])
    controller.update("favorite-" + data["video-id"], { 
        "favorite":"no"
    })
    controller.action("toast", { "message":"즐겨찾기에서 제거되었습니다." })
}

function subscribe() {
    if (__channel_info) {
        if (__channel_info["logged-in"] === "yes") {
            if (__channel_info["subscribing"] !== "yes") {
                webjs.call("subscribe").then(function() {
                    controller.update("channel-info", Object.assign(__channel_info, {
                        "subscribing":"yes"
                    }))
                    view.object("web.channel").action("reload")
                    controller.action("toast", { "message":"구독을 시작했습니다." })
                }, function(error) {
                    controller.action("toast", { "message":"죄송합니다. 잠시 후 다시 시도해주세요." })
                })
            } else {
                controller.action("toast", { "message":"구독 취소는 유튜브 사이트에서 진행해주세요." })
            }
        } else {
            view.object("cell.subscribe").data("display-unit", {
                "channel":view.object("web.channel").value().match(/channel\/([^/&#]+)/)[1]
            })
            view.object("cell.subscribe").action("reload")
            view.object("cell.subscribe").action("show")
            document.value("subscribe.visible", true)    
        }
    } else {
        controller.action("toast", { "message":"죄송합니다. 잠시 후 다시 시도해주세요." })
    }
}

function subscribe_done() {
    view.object("cell.subscribe").action("hide")
    view.object("web.channel").action("reload")
    document.value("subscribe.visible", false)    
}

function back() {
    owner.action("script", {
        "script":"hide_playlists"
    })
}