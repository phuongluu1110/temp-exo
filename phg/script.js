/* ============================================================
   CẤU HÌNH — chỉ cần sửa phần này để đổi bài hát
   ============================================================
   loai: "mp3"     -> file nhạc của bạn (đặt trong thư mục audio/)
         "youtube" -> dán link YouTube bất kỳ
         "spotify" -> dán link bài hát / playlist Spotify
   ============================================================ */
const CONFIG = {
    nhac: {
        loai: "youtube",
        url: "https://youtu.be/9nkIxVcBHCQ?si=bIaw_wmWJEePZ-ew",
        // vd YouTube: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
        // vd Spotify: "https://open.spotify.com/track/XXXXXXXXXXXXXXXX"
        tenBai: "Tên bài hát",
        caSi: "EXO"
    },
    amLuong: .8
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ---------- Chiều cao màn hình thật (iPhone) ---------- */
function setVh() {
    document.documentElement.style.setProperty("--vh", window.innerHeight * .01 + "px");
}
setVh();
window.addEventListener("orientationchange", function () { setTimeout(setVh, 300); });


/* ---------- Bầu trời: sao, tuyết, bụi tiên (Peter Pan), bokeh & sao băng ---------- */
(function () {
    const canvas = document.getElementById("sky");
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, shoot = null, nextShoot = 4000;
    const R = Math.random;

    const stars = Array.from({ length: 90 }, function () { return { x: R(), y: R(), r: R() * 1.2 + .3, p: R() * 6.28 }; });
    const snow = Array.from({ length: 28 }, function () { return { x: R(), y: R(), r: R() * 1.8 + .6, v: R() * .0006 + .0003, d: R() * 6.28 }; });
    const dust = Array.from({ length: 26 }, function () { return { x: R(), y: R(), r: R() * 1.6 + .8, v: R() * .0005 + .0002, d: R() * 6.28, p: R() * 6.28 }; });
    const tints = ["120,160,255", "190,150,240", "255,205,160"];
    const bokeh = Array.from({ length: 6 }, function (_, i) { return { x: R(), y: R(), r: 50 + R() * 70, vx: (R() - .5) * .00004, vy: (R() - .5) * .00004, c: tints[i % 3] }; });

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.offsetWidth; h = canvas.offsetHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(t) {
        ctx.clearRect(0, 0, w, h);

        bokeh.forEach(function (b) {
            b.x += b.vx; b.y += b.vy;
            if (b.x < -.1 || b.x > 1.1) b.vx *= -1;
            if (b.y < -.1 || b.y > 1.1) b.vy *= -1;
            const g = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.r);
            g.addColorStop(0, "rgba(" + b.c + ",.10)"); g.addColorStop(1, "rgba(" + b.c + ",0)");
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x * w, b.y * h, b.r, 0, 6.28); ctx.fill();
        });

        stars.forEach(function (s) {
            ctx.globalAlpha = .35 + .45 * Math.sin(t / 1400 + s.p);
            ctx.fillStyle = "#dfe9ff";
            ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r, 0, 6.28); ctx.fill();
        });

        ctx.globalAlpha = .6; ctx.fillStyle = "#fff";
        snow.forEach(function (f) {
            f.y += f.v; f.d += .008;
            if (f.y > 1.02) { f.y = -.02; f.x = R(); }
            ctx.beginPath(); ctx.arc((f.x + Math.sin(f.d) * .015) * w, f.y * h, f.r, 0, 6.28); ctx.fill();
        });

        /* bụi tiên màu vàng nhạt bay lên */
        dust.forEach(function (f) {
            f.y -= f.v; f.d += .01;
            if (f.y < -.02) { f.y = 1.02; f.x = R(); }
            const x = (f.x + Math.sin(f.d) * .02) * w, y = f.y * h, a = .35 + .4 * Math.sin(t / 700 + f.p);
            const g = ctx.createRadialGradient(x, y, 0, x, y, f.r * 4);
            g.addColorStop(0, "rgba(255,232,185," + a + ")"); g.addColorStop(1, "rgba(255,232,185,0)");
            ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, f.r * 4, 0, 6.28); ctx.fill();
        });

        /* sao băng thỉnh thoảng lướt qua */
        if (!shoot && t > nextShoot) shoot = { x: w * (.45 + R() * .5), y: h * (.04 + R() * .2), life: 0 };
        if (shoot) {
            shoot.life += 1; shoot.x -= 7; shoot.y += 3.2;
            const a = 1 - shoot.life / 55, g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x + 110, shoot.y - 50);
            g.addColorStop(0, "rgba(255,255,255," + a + ")"); g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(shoot.x + 110, shoot.y - 50); ctx.stroke();
            if (shoot.life > 55) { shoot = null; nextShoot = t + 9000 + R() * 8000; }
        }

        if (!reduceMotion) requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(draw);
})();


/* ---------- Ảnh: nếu chưa có file thì giữ khung "Thay ảnh" ---------- */
document.querySelectorAll(".photo img").forEach(function (img) {
    function bad() { img.remove(); }
    img.addEventListener("error", bad);
    if (img.complete && img.naturalWidth === 0) bad();
});


/* ---------- Nhạc: tự phát khi bấm "Our Universe", chỉ còn đĩa nhỏ để bật/tắt ---------- */
const audio = document.getElementById("audio");
const fab = document.getElementById("fab");
const fabIcon = document.getElementById("fabIcon");
const spBar = document.getElementById("spBar");
const M = CONFIG.nhac;
let yt = null, ytOn = false;

if (M.loai === "mp3") audio.src = M.url;
if (M.loai !== "spotify") fab.classList.add("on");

function setPlaying(on) {
    fab.classList.toggle("playing", on);
    fabIcon.textContent = on ? "❚❚" : "▶";
}

function ytCmd(fn) {
    yt.contentWindow.postMessage(JSON.stringify({ event: "command", func: fn, args: [] }), "*");
}

function startMusic() {
    if (M.loai === "mp3") {
        if (!audio.paused) return;
        audio.volume = CONFIG.amLuong;
        const p = audio.play();
        if (p && p.catch) p.catch(function () { setPlaying(false); });
    }
    else if (M.loai === "youtube") {
        if (yt) return;
        const m = M.url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
        if (!m) return;
        yt = document.createElement("iframe");
        yt.className = "yt-hidden";
        yt.allow = "autoplay";
        yt.src = "https://www.youtube.com/embed/" + m[1] + "?autoplay=1&loop=1&playlist=" + m[1] + "&enablejsapi=1&playsinline=1&controls=0";
        document.body.appendChild(yt);
        ytOn = true; setPlaying(true);
    }
    else if (M.loai === "spotify" && spBar.hidden) {
        spBar.innerHTML = '<iframe src="' + M.url.replace("open.spotify.com/", "open.spotify.com/embed/").split("?")[0] + '" allow="autoplay; encrypted-media" title="Nhạc"></iframe>';
        spBar.hidden = false;
    }
}

fab.addEventListener("click", function () {
    if (M.loai === "mp3") { if (audio.paused) startMusic(); else audio.pause(); }
    else if (M.loai === "youtube") {
        if (!yt) { startMusic(); return; }
        ytOn = !ytOn; ytCmd(ytOn ? "playVideo" : "pauseVideo"); setPlaying(ytOn);
    }
});
audio.addEventListener("play", function () { setPlaying(true); });
audio.addEventListener("pause", function () { setPlaying(false); });


/* ---------- Mở màn hình đầu ---------- */
const gate = document.getElementById("gate");

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

document.getElementById("openGate").addEventListener("click", function () {
    if (gate.classList.contains("opening")) return;
    startMusic();
    gate.classList.add("opening");
    document.body.classList.remove("is-locked");
    window.scrollTo(0, 0);
    setTimeout(function () { gate.style.display = "none"; }, reduceMotion ? 50 : 1500);
});


/* ---------- Hiện dần khi cuộn ---------- */
const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("visible");
        io.unobserve(e.target);
    });
}, { threshold: .15, rootMargin: "0px 0px -5% 0px" });

document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });


/* ---------- Bấm vào ảnh để xem lớn ---------- */
const lightbox = document.getElementById("lightbox");
const lbImg = lightbox.querySelector("img");

document.querySelectorAll(".pola:not(.memo)").forEach(function (p) {
    p.addEventListener("click", function () {
        const img = p.querySelector("img");
        if (!img) return;
        lbImg.src = img.src; lbImg.alt = img.alt;
        lightbox.classList.add("open");
    });
});
lightbox.addEventListener("click", function () { lightbox.classList.remove("open"); });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") lightbox.classList.remove("open"); });


/* ---------- Chữ hiện từng dòng ---------- */
document.querySelectorAll(".prose").forEach(function (box) {
    let n = 0;
    box.querySelectorAll("p").forEach(function (p) {
        p.innerHTML = p.innerHTML.split(/<br\s*\/?>/i).map(function (t) {
            return '<span class="ln" style="--i:' + (n++) + '">' + t.trim() + "</span>";
        }).join("<br>");
    });
});


/* ---------- Mở hộp bí mật ---------- */
const mail = document.getElementById("mail");
const box = document.getElementById("box");

mail.querySelectorAll(".letter p").forEach(function (p, i) { p.style.setProperty("--i", i); });

box.addEventListener("click", function () {
    if (mail.classList.contains("open")) return;
    mail.classList.add("open");

    const r = box.getBoundingClientRect(), m = mail.getBoundingClientRect();

    for (let i = 0; i < 18; i++) {
        const s = document.createElement("span");
        s.className = "spark";
        s.style.left = (r.left - m.left + r.width / 2 + (Math.random() - .5) * 90) + "px";
        s.style.top = (r.top - m.top + 20) + "px";
        s.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
        s.style.setProperty("--dy", -(Math.random() * 170 + 70) + "px");
        s.style.animationDelay = (Math.random() * .5) + "s";
        s.addEventListener("animationend", function () { s.remove(); });
        mail.appendChild(s);
    }
});


/* ---------- Menu ghim: sáng chữ phần đang đọc ---------- */
const spyLinks = document.querySelectorAll("[data-spy]");
let spyActive = null;

const spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
        if (e.isIntersecting) spyActive = e.target.id;
        else if (spyActive === e.target.id) spyActive = null;
    });
    spyLinks.forEach(function (a) { a.classList.toggle("active", a.dataset.spy === spyActive); });
}, { rootMargin: "-45% 0px -50% 0px" });

spyLinks.forEach(function (a) { spy.observe(document.getElementById(a.dataset.spy)); });


/* ---------- Youth: dòng chữ ở giữa màn hình sáng lên ---------- */
const litObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
        e.target.classList.toggle("on", e.isIntersecting);
        if (e.isIntersecting) e.target.classList.add("seen");
    });
}, { rootMargin: "-40% 0px -42% 0px" });

document.querySelectorAll(".lit").forEach(function (el) { litObserver.observe(el); });


/* ---------- Journey: rê chuột / chạm để mở khung ---------- */
const memos = document.querySelectorAll(".memo");
const canHover = window.matchMedia("(hover: hover)").matches;

function openMemo(m) {
    memos.forEach(function (o) { o.classList.toggle("open", o === m); });
}

memos.forEach(function (m) {
    if (canHover) {
        m.addEventListener("mouseenter", function () { openMemo(m); });
        m.addEventListener("mouseleave", function () { m.classList.remove("open"); });
        m.addEventListener("focus", function () { openMemo(m); });
        m.addEventListener("blur", function () { m.classList.remove("open"); });
    }
    else {
        m.addEventListener("click", function () { openMemo(m.classList.contains("open") ? null : m); });
    }
});


/* ---------- Onward: vừa lướt tới phần này là bắt đầu vẽ 8 nhánh (vẽ lại mỗi lần quay lại) ---------- */
const pathsFig = document.getElementById("paths");

new IntersectionObserver(function (entries) {
    pathsFig.classList.toggle("drawn", entries[0].isIntersecting);
}, { rootMargin: "0px 0px -8% 0px" }).observe(document.getElementById("phia-truoc"));


/* ---------- Video ở Our Youth: tự phát khi lướt tới, tắt tiếng mặc định ---------- */
const yv = document.getElementById("youthVideo");
const vSound = document.getElementById("vSound");
let bgWasOn = false;

function videoSound(on) {
    yv.muted = !on;
    vSound.textContent = on ? "Tắt tiếng" : "Bật tiếng";
    if (on) {
        bgWasOn = M.loai === "mp3" ? !audio.paused : (M.loai === "youtube" && ytOn);
        if (M.loai === "mp3") audio.pause();
        else if (M.loai === "youtube" && yt) { ytCmd("pauseVideo"); ytOn = false; setPlaying(false); }
    }
    else if (bgWasOn) {
        bgWasOn = false;
        if (M.loai === "mp3") startMusic();
        else if (M.loai === "youtube" && yt) { ytCmd("playVideo"); ytOn = true; setPlaying(true); }
    }
}

vSound.addEventListener("click", function () { videoSound(yv.muted); });

function dropVideo() { yv.remove(); vSound.remove(); }
yv.addEventListener("error", dropVideo);
if (yv.error || yv.networkState === 3) dropVideo();

new IntersectionObserver(function (entries) {
    if (!yv.isConnected) return;
    if (entries[0].isIntersecting) {
        const p = yv.play();
        if (p && p.catch) p.catch(function () { /* trình duyệt chặn: người xem chạm vào video để phát */ });
    }
    else {
        yv.pause();
        if (!yv.muted) videoSound(false);
    }
}, { threshold: .4 }).observe(yv);

yv.addEventListener("click", function () { if (yv.paused) yv.play(); else yv.pause(); });
