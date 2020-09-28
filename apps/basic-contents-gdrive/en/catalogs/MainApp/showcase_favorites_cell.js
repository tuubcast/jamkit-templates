const conf = include("config.js")

function remove() {
    owner.action("script", {
        "script":"remove_favorite",
        [conf.unique_key]:$data[conf.unique_key]
    })
}
