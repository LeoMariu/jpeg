function getURLParameter(e) {
    return decodeURIComponent((new RegExp("[?|&]" + e + "=([^&;]+?)(&|#|;|$)").exec(location.search) || [null, ""])[1].replace(/\+/g, "%20")) || null
}
function el(e) {
    return document.getElementById(e)
}
function qs(e) {
    return document.querySelector(e)
}
function qsAll(e) {
    return document.querySelectorAll(e)
}
function textn(e) {
    return document.createTextNode(e)
}
function append(e) {
    for (let t = 1; t < arguments.length; ++t) {
        let n = arguments[t];
        "string" == typeof n && (n = textn(n)),
        e.appendChild(n)
    }
}
function replace(e) {
    e.innerHTML = "",
    append.apply(null, arguments)
}
function html(e) {
    let t = document.createElement("template");
    return t.innerHTML = e, t.content
}
function setFs(e, t) {
    document.exitFullscreen && ((t = void 0 === t ? document.fullscreenElement !== e : t) ? e.requestFullscreen() : document.exitFullscreen())
}
function makeFsButton(e, t) {
    return !!document.exitFullscreen && (e.addEventListener("click", function(e) {
            e.preventDefault(),
            setFs(t, void 0)
        }), !0)
}
function badNet() {
    toast("Network problem—try again later", "alert")
}
function exec(e) {
    try {
        e()
    } catch (e) {
        console.log(e)
    }
}
exec(() => {
    let e = location.pathname;
    e.length > 0 && "/" === e.charAt(0) && (e = e.substring(1));
    let t = e.indexOf("/");
    t >= 0 && (e = e.substring(0, t)),
    0 !== e.length && "index.html" !== e || (e = "home"),
    e = "nav-" + e;
    let n = qsAll("header > nav > a");
    function l(e) {
        let t = Array.prototype.indexOf.call(n, e.target);
        if (t < 0)
            return;
        let l = null;
        switch (e.keyCode) {
        case 36:
            l = 0;
            break;
        case 35:
            l = -1;
            break;
        case 40:
        case 39:
            l = t + 1;
            break;
        case 38:
        case 37:
            l = t - 1;
            break;
        case 13:
        case 32:
            return e.preventDefault(), void n[t].click();
        case 27:
            let o = el("nav-toggle");
            o.classList.contains("popped") && o.click()
        }
        null !== l && (l < 0 && (l += n.length), l >= n.length && (l -= n.length), n[l].focus(), e.stopPropagation(), e.preventDefault())
    }
    for (let t = 0; t < n.length; ++t)
        n[t].addEventListener("keydown", l),
        n[t].id === e && n[t].classList.add("selected")
}),
exec(() => {
    let e = qs("nav"),
        t = el("nav-toggle");
    t.addEventListener("click", function(n) {
        t.classList.toggle("popped"),
        e.classList.toggle("popped"),
        e.classList.contains("popped") && e.querySelector("a").focus(),
        n.stopPropagation()
    }),
    document.body.addEventListener("click", function(n) {
        t.classList.remove("popped"),
        e.classList.remove("popped")
    })
}),
exec(() => {
    let e = qs("jump-to-top"),
        t = 0,
        n = !1;
    function l() {
        t > .25 * window.innerHeight ? e.classList.add("active") : e.classList.remove("active"),
        n = !1
    }
    addEventListener("scroll", function(e) {
        t = window.scrollY,
        n || (n = !0, requestAnimationFrame(l))
    }),
    e.addEventListener("click", function(e) {
        e.preventDefault();
        let t = qs("h1[id]");
        null != t ? location.hash = "#" + t.id : scrollTo(window.scrollX, 0)
    }),
    e.addEventListener("keydown", function(t) {
        13 !== t.keyCode && 32 !== t.keyCode || (t.preventDefault(), e.click())
    })
}),
exec(() => {
    var e = {};
    window.loadLibrary = function(t) {
        return !0 === e[t] ? new Promise((e, t) => {
            e()
        }) : void 0 === e[t] ? new Promise((n, l) => {
            e[t] = [[n, l]];
            let o = document.createElement("script");
            o.src = "/code/" + t + ".js",
            o.onload = function(n) {
                let l = e[t];
                for (let e = 0; e < l.length; ++e)
                    l[e][0]();
                e[t] = !0,
                o.parentNode.removeChild(o)
            },
            o.onerror = function(n) {
                let l = t + ": failed to load library",
                    i = e[t];
                for (let e = 0; e < i.length; ++e)
                    i[e][1](l);
                delete e[t],
                o.reparentNode.removeChild(o)
            },
            document.head.appendChild(o)
        }) : new Promise(function(n, l) {
            e[t].push([n, l])
        })
    }
}),
exec(() => {
    window.addEventListener("click", function(e) {
        let t = e.target;
        switch (t.nodeName) {
        case "ABBR":
            e.preventDefault();
            let n = qsAll("abbr[title]");
            for (let e = 0; e < n.length; ++e) {
                let t = n[e];
                t.setAttribute("data-acronym", t.textContent),
                t.textContent = t.getAttribute("title"),
                t.removeAttribute("title")
            }
            break;
        case "PRE":
            if (t.firstChild && "CODE" == t.firstChild.nodeName && e.offsetX < -parseFloat(getComputedStyle(t).marginInlineStart) && (e.preventDefault(), window.getSelection && document.createRange)) {
                let e = window.getSelection();
                if (e.isCollapsed) {
                    let n = document.createRange();
                    n.selectNodeContents(t.firstChild),
                    e.removeAllRanges(),
                    e.addRange(n),
                    document.execCommand("copy"),
                    toast("Code copied to clipboard")
                }
            }
        }
    })
}),
exec(() => {
    let e = null,
        t = null,
        n = "";
    window.beginSearch = l => {
        (l = l.trim()) !== n && (0 !== l.length ? (null != t && (clearTimeout(t), t = null), n = l, loadLibrary("search").then(() => {
            try {
                if (null == e) {
                    e = new MiniSearch({
                        fields: ["title", "text"],
                        searchOptions: {
                            boost: {
                                title: 4
                            },
                            fuzzy: .2,
                            prefix: !0
                        }
                    });
                    for (let e = 0; e < searchData.length; ++e)
                        searchData[e].id = e;
                    e.addAll(searchData)
                }
                if (l !== n)
                    return;
                let t = e.search(l);
                if (t.length < 4) {
                    let n = e.autoSuggest(l);
                    if (n.length > 0) {
                        let l = e.search(n[0].suggestion);
                        for (let e = 0; e < l.length; ++e) {
                            let n = 0;
                            for (; n < t.length && t[n].id !== l[e].id; ++n)
                                ;
                            n === t.length && t.push(l[e])
                        }
                    }
                }
                let o = "";
                for (let e = 0; e < t.length && e < 10; ++e) {
                    let n = searchData[t[e].id];
                    o += '<a href="' + n.url + '">' + n.title + "</a>"
                }
                qs("search-results").innerHTML = o
            } catch (e) {
                console.log(e)
            }
        }).catch(() => {
            t = setTimeout(() => {
                console.log("error loading search data; will retry"),
                t = null,
                l === n && (n = "", beginSearch(l))
            }, 2e3)
        })) : qs("search-results").innerHTML = "")
    };
    let l = function(e) {
            let t = e.target,
                n = qs("header"),
                l = qs("search-results");
            if (!n.classList.contains("searching"))
                throw new Error;
            for (; null != t;) {
                if (t === n || t === l)
                    return;
                t = t.parentNode
            }
            e.preventDefault(),
            o.click()
        },
        o = el("search-toggle"),
        i = el("search-box");
    o.addEventListener("click", function(e) {
        e.preventDefault();
        let t = qs("header");
        t.classList.toggle("searching"),
        t.classList.contains("searching") ? (i.focus(), window.addEventListener("click", l)) : window.removeEventListener("click", l)
    }),
    i.addEventListener("input", function(e) {
        beginSearch(i.value)
    }),
    i.addEventListener("keydown", function(e) {
        switch (e.key) {
        case "Escape":
            e.preventDefault(),
            o.click();
            break;
        case "Enter":
            e.preventDefault();
            let t = qs("search-results > a");
            t && t.click()
        }
    })
}),
exec(() => {
    let e = el("dark-mode-toggle"),
        t = !1;
    function n() {
        let t = "light",
            n = "dark";
        if (isDark) {
            let e = t;
            t = n,
            n = e
        }
        e.classList.add(t),
        e.classList.remove(n)
    }
    n(),
    e.addEventListener("click", function(e) {
        if (darkMode(!isDark), n(), !t) {
            t = !0;
            let n = e.pointerType && "mouse" != e.pointerType ? "Long press" : "Right click";
            toast(n + " the button to match your system settings")
        }
    }),
    e.addEventListener("contextmenu", function(e) {
        e.preventDefault(),
        darkMode(null),
        n(),
        t = !0
    })
}),
exec(() => {
    el("share-button").addEventListener("click", function(e) {
        !function(e) {
            loadLibrary("social").then(() => {
                share(e)
            }).catch(e => {
                badNet()
            })
        }({
            title: document.title,
            url: window.location.href,
            text: "I thought of you when I read this."
        })
    })
}),
exec(() => {
    let e = [],
        t = -1;
    function n(n) {
        null != n.onclick && null != n.parentNode && (n.onclick = null, clearTimeout(t), n.classList.remove("toast-in"), setTimeout(() => {
            if (t = -1, n.remove(), e.length > 0) {
                let t = e.pop();
                l(e.pop(), t)
            }
        }, 400))
    }
    function l(l, o) {
        if (-1 != t)
            e.unshift(l, o);
        else {
            l = String(l).trim();
            let e = 2e3 + Math.round(l.length / 12 * 1e3),
                i = document.createElement("toast-popup");
            null != o && i.classList.add(String(o)),
            i.onclick = () => n(i),
            i.appendChild(textn(l)),
            t = setTimeout(n, e, i),
            document.body.appendChild(i),
            requestAnimationFrame(() => i.classList.add("toast-in"))
        }
    }
    window.toast = l
});
