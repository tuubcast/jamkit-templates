var __favorites_visible = false

function show_playlists() {
    view.object("showcase.home").action("next-page")
}

function hide_playlists() {
    view.object("showcase.home").action("prev-page")
}

function show_favorites() {
    view.object("cell.favorites").action("reload")
    view.object("cell.favorites").action("show")

    __favorites_visible = true
}

function hide_favorites() {
    view.object("cell.favorites").action("hide")

    __favorites_visible = false
}

function start_playlist(data) {
    view.object("cell.player").data("display-unit", { "video-id":data["video-id"] })
    view.object("cell.player").action("reload")
    view.object("cell.musics").data("display-unit", { "video-id":data["video-id"] })
    view.object("cell.musics").action("reload")
    view.object("label.playlist.title").property({ "text":data["title"] })
    document.value("playing.video-id", data["video-id"])

    if (data["action-by-user"] === "yes") {
        hide_playlists()
        hide_favorites()    
    }
}

function remove_favorite(data) {
    view.object("showcase.home").view("cell", "S_HOME_PLAYLISTS").action("script", {
        "script":"remove_favorite",
        "video-id":data["video-id"]
    })
}

function on_enter_screen_saver() {
    view.object("showcase.home").property({
        "scroll-enabled":"no"
    })
}

function on_exit_screen_saver() {
    view.object("showcase.home").property({
        "scroll-enabled":"yes"
    })
}

function on_show_comments() {
    view.object("showcase.home").property({
        "scroll-enabled":"no"
    })
}

function on_hide_comments() {
    view.object("showcase.home").property({
        "scroll-enabled":"yes"
    })
}

function on_back() {
    if (!__favorites_visible) {
        if (!document.value("saver.running")) {
            if (!document.value("musics.visible")) {
                if (!document.value("comments.visible")) {
                    if (!document.value("subscribe.visible")) {
                        controller.action("back")
                    } else {
                        view.object("cell.subscribe").action("script", {
                            "script":"subscribe_done"
                        }) 
                    }
                } else {
                    view.object("cell.comments").action("script", {
                        "script":"hide_comments"
                    })
                }
            } else {
                view.object("cell.musics").action("script", {
                    "script":"hide_musics"
                })
            }
        } else {
            controller.action("toast", { 
                "message":"먼저 절전 모드를 해제해주세요." 
            })
        }    
    } else {
        hide_favorites()
    }
}
