function changeImage(e) {
    e.target.value && (el("input-image").src = "jpeg-input-" + e.target.value + ".png")
}
function loadImageFromFile(e) {
    let t = el("input-image"),
        a = URL.createObjectURL(e),
        n = t.src;
    t.src = a;
    try {
        URL.revokeObjectURL(n)
    } catch (e) {
        console.log(e)
    }
}
function dragOverHandler(e) {
    e.preventDefault()
}
function dragEndHandler(e) {
    let t = e.dataTransfer;
    if (t.items)
        for (let e = t.items.length; e >= 0; --e)
            t.items.remove(e);
    else
        t.dataTransfer.clearData()
}
function dropHandler(e) {
    e.preventDefault();
    let t = e.dataTransfer;
    if (t.items && t.items.length > 0 && "file" === t.items[0].kind) {
        loadImageFromFile(t.items[0].getAsFile()),
        el("custom").setAttribute("checked", "")
    }
}
el("tower").onchange = changeImage,
el("flowers").onchange = changeImage,
el("hippos").onchange = changeImage,
el("lofreq").onchange = changeImage,
el("hifreq").onchange = changeImage,
el("custom").onclick = function(e) {
    el("file-input").click()
},
el("file-input").onchange = function(e) {
    loadImageFromFile(e.target.files[0])
},
document.body.addEventListener("dragover", dragOverHandler),
document.body.addEventListener("dragend", dragOverHandler),
document.body.addEventListener("drop", dropHandler);
{
    let e = function(e, t) {
        t += "_";
        let a = "";
        for (let e = 0; e < 8; ++e) {
            a += "<tr>";
            for (let n = 0; n < 8; ++n)
                a += "<td><samp id='" + t + n + "_" + e + "'></samp></td>";
            a += "</tr>"
        }
        el(e).innerHTML = a
    };
    e("lumTable", "L"),
    e("chrTable", "C")
}
function copyCanvas(e, t) {
    e = el(e),
    t = el(t);
    let a = e.width,
        n = e.height,
        l = t.width,
        o = t.height;
    t.getContext("2d").drawImage(e, 0, 0, a, n, 0, 0, l, o)
}
function filterPixels(e, t, a) {
    let n = (e = el(e)).width,
        l = e.height,
        o = e.getContext("2d"),
        r = o.getImageData(0, 0, n, l),
        i = r.data,
        c = new Array(3),
        u = 0;
    for (let e = 0; e < n; ++e)
        for (let e = 0; e < l; ++e) {
            let e = u;
            c[0] = i[u++],
            c[1] = i[u++],
            c[2] = i[u++],
            u++,
            a(c),
            i[e++] = c[0],
            i[e++] = c[1],
            i[e++] = c[2],
            i[e++] = 255
        }
    (o = (t = el(t)).getContext("2d")).putImageData(r, 0, 0)
}
function cl(e) {
    return Math.max(0, Math.min(255, Math.round(e)))
}
function RGBtoYCbCr(e) {
    let t = .299 * e[0] + .587 * e[1] + .114 * e[2],
        a = -.1687 * e[0] - .3313 * e[1] + .5 * e[2] + 128,
        n = .5 * e[0] - .4187 * e[1] - .0813 * e[2] + 128;
    e[0] = cl(t),
    e[1] = cl(a),
    e[2] = cl(n)
}
function YCbCrtoRGB(e) {
    e[1] -= 128,
    e[2] -= 128;
    let t = e[0] + 1.402 * e[2],
        a = e[0] - .3441 * e[1] - .7141 * e[2],
        n = e[0] + 1.772 * e[1];
    e[0] = cl(t),
    e[1] = cl(a),
    e[2] = cl(n)
}
function RGBtoR(e) {
    e[1] = 0,
    e[2] = 0
}
function RGBtoG(e) {
    e[0] = 0,
    e[2] = 0
}
function RGBtoB(e) {
    e[0] = 0,
    e[1] = 0
}
function mergeChannels(e, t, a, n) {
    let l = new ImageData(e.width, e.height),
        o = l.data,
        r = e.data,
        i = t.data,
        c = a.data,
        u = [],
        s = 0;
    for (let e = 0; e < r.length; ++e)
        u[0] = r[e],
        u[1] = i[e],
        u[2] = c[e],
        YCbCrtoRGB(u),
        o[s++] = u[0],
        o[s++] = u[1],
        o[s++] = u[2],
        o[s++] = 255;
    el(n).getContext("2d").putImageData(l, 0, 0)
}
function prepareBlock(e, t, a, n) {
    let l = t.width,
        o = t.data;
    for (let t = 0; t < 8; ++t) {
        let r = (n + t) * l + a;
        for (let a = 0; a < 8; ++a)
            e[a][t] = o[r++]
    }
}
function restoreBlock(e, t, a, n) {
    let l = t.width,
        o = t.data;
    for (let t = 0; t < 8; ++t) {
        let r = (n + t) * l + a;
        for (let a = 0; a < 8; ++a)
            o[r++] = e[a][t]
    }
}
function canvasToDCTData(e) {
    let t = (e = el(e)).width,
        a = e.height,
        n = new Array(t * a),
        l = e.getContext("2d").getImageData(0, 0, t, a).data;
    for (let e = 0, t = 0; e < n.length; ++e, t += 4)
        n[e] = l[t];
    return new ChannelData(t, a, n)
}
function visualizeDCTData(e, t) {
    t = el(t);
    let a = e.width,
        n = e.height,
        l = e.data.slice();
    function o(e) {
        return Math.pow(1 - e, 32)
    }
    let r = 0,
        i = new ImageData(a, n),
        c = i.data;
    for (let e = 0; e < l.length; ++e) {
        let t = 255 * o(Math.abs(l[e]) / 1024);
        c[r++] = t,
        c[r++] = t,
        c[r++] = t,
        c[r++] = 255
    }
    t.getContext("2d").putImageData(i, 0, 0)
}
function processBlocks(e, t) {
    let a = e.width,
        n = e.height,
        l = {
            width: a,
            height: n,
            data: new Array(a * n)
        },
        o = [[], [], [], [], [], [], [], []];
    for (let r = 0; r < n; r += 8)
        for (let n = 0; n < a; n += 8)
            prepareBlock(o, e, n, r),
            t(o),
            restoreBlock(o, l, n, r);
    return l
}
let work = [[], [], [], [], [], [], [], []],
    cos = [],
    coeff = [];
for (let e = 0; e < 8; ++e) {
    cos[e] = [],
    coeff[e] = 0 === e ? Math.sqrt(2) / 4 : .5;
    for (let t = 0; t < 8; ++t)
        cos[e][t] = Math.cos(Math.PI * e * (2 * t + 1) / 16)
}
function forwardDCT(e) {
    let t,
        a,
        n,
        l;
    for (t = 0; t < 8; ++t)
        for (a = 0; a < 8; ++a) {
            for (l = 0, n = 0; n < 8; ++n)
                l += e[n][t] * cos[a][n];
            work[a][t] = l * coeff[a]
        }
    for (t = 0; t < 8; ++t)
        for (a = 0; a < 8; ++a) {
            for (l = 0, n = 0; n < 8; ++n)
                l += work[t][n] * cos[a][n];
            e[t][a] = l * coeff[a]
        }
}
function inverseDCT(e) {
    let t,
        a,
        n,
        l;
    for (t = 0; t < 8; ++t)
        for (a = 0; a < 8; ++a) {
            for (l = 0, n = 0; n < 8; ++n)
                l += e[n][t] * coeff[n] * cos[n][a];
            work[a][t] = l
        }
    for (t = 0; t < 8; ++t)
        for (a = 0; a < 8; ++a) {
            for (l = 0, n = 0; n < 8; ++n)
                l += work[t][n] * coeff[n] * cos[n][a];
            e[t][a] = l
        }
}
function forwardDCTChannel(e, t) {
    let a = processBlocks(e, forwardDCT);
    return visualizeDCTData(a, t), a
}
function inverseDCTDataToCanvas(e, t) {
    t = el(t);
    let a = new ImageData(t.width, t.height),
        n = a.data,
        l = e.data,
        o = 0;
    for (let e = 0; e < l.length; ++e) {
        let t = cl(l[e]);
        n[o++] = t,
        n[o++] = t,
        n[o++] = t,
        n[o++] = 255
    }
    t.getContext("2d").putImageData(a, 0, 0)
}
let luminanceTable,
    chrominanceTable,
    masterLuminanceTable = [[16, 11, 10, 16, 24, 40, 51, 61], [12, 12, 14, 19, 26, 58, 60, 55], [14, 13, 16, 24, 40, 57, 69, 56], [14, 17, 22, 29, 51, 87, 80, 62], [18, 22, 37, 56, 68, 109, 103, 77], [24, 35, 55, 64, 81, 104, 113, 92], [49, 64, 78, 87, 103, 121, 120, 101], [72, 92, 95, 98, 112, 100, 103, 99]],
    masterChrominanceTable = [[17, 18, 24, 47, 99, 99, 99, 99], [18, 21, 26, 66, 99, 99, 99, 99], [24, 26, 56, 99, 99, 99, 99, 99], [47, 66, 99, 99, 99, 99, 99, 99], [99, 99, 99, 99, 99, 99, 99, 99], [99, 99, 99, 99, 99, 99, 99, 99], [99, 99, 99, 99, 99, 99, 99, 99], [99, 99, 99, 99, 99, 99, 99, 99]];
function lerpTable(e, t) {
    let a = [[], [], [], [], [], [], [], []];
    if ((e = 1 - e) < .5)
        for (let n = 0; n < 8; ++n)
            for (let l = 0; l < 8; ++l)
                a[l][n] = Math.round(1 + e * (2 * t[l][n] - 1));
    else {
        e = 2 * (e - .5);
        for (let n = 0; n < 8; ++n)
            for (let l = 0; l < 8; ++l) {
                let o = t[l][n];
                a[l][n] = Math.round(o + 6 * e * o)
            }
    }
    return a
}
function displayTable(e, t) {
    let a = t === masterLuminanceTable ? "L_" : "C_";
    for (let t = 0; t < 8; ++t)
        for (let n = 0; n < 8; ++n) {
            let l = e[n][t],
                o = "";
            l < 100 && (o += " ", l < 10 && (o += " ")),
            o += l,
            el(a + n + "_" + t).textContent = o
        }
}
function updateQuality(e) {
    luminanceTable = lerpTable(e, masterLuminanceTable),
    chrominanceTable = lerpTable(e, masterChrominanceTable),
    displayTable(luminanceTable, masterLuminanceTable),
    displayTable(chrominanceTable, masterChrominanceTable)
}
function quantizerFor(e) {
    if (null == e)
        throw new Error("requires table");
    return function(t) {
        for (let a = 0; a < 8; ++a)
            for (let n = 0; n < 8; ++n)
                t[n][a] = Math.round(t[n][a] / e[n][a])
    }
}
function unquantizerFor(e) {
    if (null == e)
        throw new Error("requires table");
    return function(t) {
        for (let a = 0; a < 8; ++a)
            for (let n = 0; n < 8; ++n)
                t[n][a] *= e[n][a]
    }
}
let cbRawFull,
    crRawFull,
    yRaw,
    cbRaw,
    crRaw,
    yUnquant,
    cbUnquant,
    crUnquant,
    yQuant,
    cbQuant,
    crQuant,
    yRestore,
    cbRestore,
    crRestore,
    yOut,
    cbOut,
    crOut,
    cbOutFull,
    crOutFull,
    hasImageAvailable = !1,
    srcImage = el("input-image"),
    qualitySlider = el("quality");
function ChannelData(e, t, a) {
    this.width = e,
    this.height = t,
    this.data = a
}
function canvasToYCbCrChannels(e) {
    let t = (e = el(e)).width,
        a = e.height,
        n = e.getContext("2d").getImageData(0, 0, t, a).data,
        l = [],
        o = [],
        r = [],
        i = [],
        c = 0,
        u = 0;
    for (y = 0; y < a; ++y)
        for (x = 0; x < t; ++x)
            i[0] = n[c++],
            i[1] = n[c++],
            i[2] = n[c++],
            c++,
            RGBtoYCbCr(i),
            l[u] = i[0],
            o[u] = i[1],
            r[u++] = i[2];
    return [new ChannelData(t, a, l), new ChannelData(t, a, o), new ChannelData(t, a, r)]
}
function visualizeChannelData(e, t, a) {
    let n = e.width,
        l = e.height,
        o = e.data,
        r = new ImageData(n, l),
        i = r.data,
        c = [],
        u = 0;
    for (let e = 0; e < o.length; ++e)
        a(o[e], c),
        i[u++] = c[0],
        i[u++] = c[1],
        i[u++] = c[2],
        i[u++] = 255;
    el(t).getContext("2d").putImageData(r, 0, 0)
}
function vizY(e, t) {
    t[0] = cl(e + 0),
    t[1] = cl(e - 0 - 0),
    t[2] = cl(e + 0)
}
function vizCb(e, t) {
    t[0] = cl(128),
    t[1] = cl(128 - .344136 * (e - 128) - 0),
    t[2] = cl(128 + 1.772 * (e - 128))
}
function vizCr(e, t) {
    t[0] = cl(128 + 1.402 * (e - 128)),
    t[1] = cl(128 - .714136 * (e - 128)),
    t[2] = cl(128)
}
function convertRGBtoYCbCr() {
    filterPixels("input", "in-r", RGBtoR),
    filterPixels("input", "in-g", RGBtoG),
    filterPixels("input", "in-b", RGBtoB);
    let e = canvasToYCbCrChannels("input");
    yRaw = e[0],
    cbRawFull = e[1],
    crRawFull = e[2],
    copyCanvas("input", "input-1_4"),
    e = canvasToYCbCrChannels("input-1_4"),
    cbRaw = e[1],
    crRaw = e[2],
    visualizeChannelData(yRaw, "in-y-colour", vizY),
    visualizeChannelData(cbRawFull, "in-cb-colour", vizCb),
    visualizeChannelData(crRawFull, "in-cr-colour", vizCr),
    copyCanvas("in-y-colour", "in-y-colour-1_4"),
    visualizeChannelData(cbRaw, "in-cb-colour-1_4", vizCb),
    visualizeChannelData(crRaw, "in-cr-colour-1_4", vizCr),
    transformToFrequencyDomain()
}
function transformToFrequencyDomain() {
    yUnquant = forwardDCTChannel(yRaw, "in-y-dct"),
    cbUnquant = forwardDCTChannel(cbRaw, "in-cb-dct"),
    crUnquant = forwardDCTChannel(crRaw, "in-cr-dct"),
    quantizeFrequencyDomain()
}
function quantizeFrequencyDomain() {
    let e = quantizerFor(luminanceTable),
        t = quantizerFor(chrominanceTable);
    visualizeDCTData(yQuant = processBlocks(yUnquant, e), "in-y-quant"),
    copyCanvas("in-y-quant", "out-y-quant"),
    visualizeDCTData(cbQuant = processBlocks(cbUnquant, t), "in-cb-quant"),
    copyCanvas("in-cb-quant", "out-cb-quant"),
    visualizeDCTData(crQuant = processBlocks(crUnquant, t), "in-cr-quant"),
    copyCanvas("in-cr-quant", "out-cr-quant"),
    unquantizeFrequencyDomain()
}
function unquantizeFrequencyDomain() {
    let e = unquantizerFor(luminanceTable),
        t = unquantizerFor(chrominanceTable);
    visualizeDCTData(yRestore = processBlocks(yQuant, e), "out-y-dct"),
    visualizeDCTData(cbRestore = processBlocks(cbQuant, t), "out-cb-dct"),
    visualizeDCTData(crRestore = processBlocks(crQuant, t), "out-cr-dct"),
    transformBackToSpatialDomain()
}
function transformBackToSpatialDomain() {
    function e(e) {
        let t = e.width,
            a = e.height,
            n = e.data,
            l = [],
            o = 0;
        for (let e = 0; e < a; ++e)
            for (let a = 0; a < 2; ++a) {
                let a = e * t;
                for (let e = 0; e < t; ++e)
                    l[o++] = n[a],
                    l[o++] = n[a++]
            }
        return new ChannelData(2 * t, 2 * a, l)
    }
    visualizeChannelData(yOut = processBlocks(yRestore, inverseDCT), "out-y-colour-1_4", vizY),
    visualizeChannelData(cbOut = processBlocks(cbRestore, inverseDCT), "out-cb-colour-1_4", vizCb),
    visualizeChannelData(crOut = processBlocks(crRestore, inverseDCT), "out-cr-colour-1_4", vizCr),
    copyCanvas("out-y-colour-1_4", "out-y-colour"),
    visualizeChannelData(cbOutFull = e(cbOut), "out-cb-colour", vizCb),
    copyCanvas("out-cb-colour", "out-cb-up"),
    visualizeChannelData(crOutFull = e(crOut), "out-cr-colour", vizCr),
    copyCanvas("out-cr-colour", "out-cr-up"),
    mergeChannels(yOut, cbOutFull, crOutFull, "output"),
    copyCanvas("input", "input-comparison"),
    copyCanvas("output", "output-clone"),
    filterPixels("output", "out-r", RGBtoR),
    filterPixels("output", "out-g", RGBtoG),
    filterPixels("output", "out-b", RGBtoB),
    differenceImage("input", "output", "diff")
}
function differenceImage(e, t, a) {
    e = el(e).getContext("2d").getImageData(0, 0, 256, 128),
    t = el(t).getContext("2d").getImageData(0, 0, 256, 128);
    let n = e.data,
        l = t.data;
    for (let e = 0; e < n.length; ++e) {
        let t = 255 - cl((Math.abs(n[e] - l[e]) + Math.abs(n[e + 1] - l[e + 1]) + Math.abs(n[e + 2] - l[e + 2])) / 3 * 2);
        n[e++] = t,
        n[e++] = t,
        n[e++] = t
    }
    el(a).getContext("2d").putImageData(e, 0, 0)
}
srcImage.onload = function() {
    updateQuality(qualitySlider.value / 100),
    hasImageAvailable = !0;
    let e = el("input").getContext("2d");
    e.fillStyle = "white",
    e.fillRect(0, 0, 256, 128);
    let t = srcImage.naturalWidth,
        a = srcImage.naturalHeight,
        n = Math.max(256 / t, 128 / a),
        l = Math.round(t * n),
        o = Math.round(a * n);
    256 === t && 128 === a ? e.drawImage(srcImage, 0, 0, 256, 128) : e.drawImage(srcImage, 0, 0, t, a, (256 - l) / 2, (128 - o) / 2, l, o),
    convertRGBtoYCbCr()
},
qualitySlider.oninput = function(e) {
    updateQuality(qualitySlider.value / 100)
},
qualitySlider.onchange = function(e) {
    updateQuality(qualitySlider.value / 100),
    hasImageAvailable && quantizeFrequencyDomain()
},
srcImage.src = "jpeg-input-tower.png";
