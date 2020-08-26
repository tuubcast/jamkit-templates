function showComments(onResult, onError) {
    __showComments(onResult, onError);
}

function __showComments(onResult, onError) {
    try {
        var section = document.getElementsByTagName('ytm-comment-section-renderer')[0];
        var button = section.getElementsByTagName('button')[0];
        
        if (button.getAttribute('aria-expanded') !== "true") {
            button.click();
        }

        button.getElementsByTagName('c3-icon')[0].style.display = 'none';
        button.disabled = true;

        setTimeout(function() {
            window.scrollTo(0, 0);
            onResult();
        }, 50)
    } catch(e) {
        setTimeout(function() {
            __showComments(onResult, onError);
        }, 200);
    }
}

function getChapters(onResult, onError) {
    __getChapters(onResult, onError);
}

function __getChapters(onResult, onError) {
    try {
        var section = document.getElementsByTagName('ytm-comment-section-renderer')[0];
        var button = section.getElementsByTagName('button')[0];
        
        if (button.getAttribute('aria-expanded') !== "true") {
            button.click();
        }

        var comments = document.getElementsByTagName('ytm-comment-thread-renderer');

        if (comments.length > 0) {
            onResult({
                "chapters":__getChaptersWithComments(comments) || []
            })
        } else {
            setTimeout(function() {
                __getChapters(onResult, onError);
            }, 200);
        }
    } catch(e) {
        setTimeout(function() {
            __getChapters(onResult, onError);
        }, 200);
    }
}

function __getChaptersWithComments(comments) {
    for (var i = 0; i < comments.length; ++i) {
        var commentText = comments[i].getElementsByClassName('comment-text')[0].textContent;
        var timestampLines = __getTimestampLines(commentText);

        if (timestampLines.length > 3) {
            var chapters = [];

            timestampLines.forEach(function(line) {
                var [ time, title ] = __parseTimestampLine(line);

                chapters.push({ "time":time, "title":title });
            });

            return chapters;
        }
    }
}

function __getTimestampLines(text) {
    var lines = [], lastTimestamp;

    text.split('\n').forEach(function(line) {
        var match = line.match(/[0-9]+(\:[0-9]{2}){1,2}/);

        if (match && match[0] !== lastTimestamp) {
            lines.push(line.replace('\r', ''));

            lastTimestamp = match[0];
        }
    })

    return lines;
}

function __parseTimestampLine(line) {
    var patterns = [
        /\[ *([0-9]+(\:[0-9]{2}){1,2}) *\] */,
        /\( *([0-9]+(\:[0-9]{2}){1,2}) *\) */,
        /\|? *([0-9]+(\:[0-9]{2}){1,2}) *\| */,
        /([0-9]+(\:[0-9]{2}){1,2}) *l +/,
        /([0-9]+(\:[0-9]{2}){1,2}) */,
    ]

    for (var i = 0; i < patterns.length; ++i) {
        var match = line.match(patterns[i]);

        if (match) {
            return [ match[1], line.replace(match[0], "").trim() ]
        }
    }

    return [ "0:00", "" ]
}

function pauseVideo(onResult, onError) {
    __pauseVideo(onResult, onError)
}

function __pauseVideo(onResult, onError) {
    try {
        var video = document.getElementsByTagName('video')[0]

        if (!video.paused) {
            video.pause();

            setTimeout(function() {
                __pauseVideo(onResult, onError);
            }, 10);
        } else {
            onResult();
        }
    } catch (e) {
        setTimeout(function() {
            __pauseVideo(onResult, onError);
        }, 10);
    }
}

(function() {
    var open = window.XMLHttpRequest.prototype.open
    window.XMLHttpRequest.prototype.open = function() {
        if (arguments[1].match(/m\.youtube\.com/) || arguments[1].match(/play\.afreecatv\.com/)) {
            __$_bridge.postMessage(JSON.stringify({
                "script":"on_request_url",
                "url":arguments[1]
            }));
        } else {
            return open.apply(this, [].slice.call(arguments));
        }
    }
})()
