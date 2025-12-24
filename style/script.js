const messages = [
    "Merry Jesusmas",
    "Happy Holidays",
    "Wish You Joy and Peace",
    "Tối lq k ae?",
    "Have a Magical Christmas",
    "Bí béo vãi l"
];

let msgIndex = 0;
let charIndex = 0;
const speed = 90;
const typeArea = document.getElementById("typewriter");

function typeWriter() {
    if (charIndex < messages[msgIndex].length) {
        typeArea.innerHTML += messages[msgIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, speed);
    } else {
        setTimeout(() => eraseText(), 1500);
    }
}

function eraseText() {
    if (charIndex > 0) {
        typeArea.innerHTML = messages[msgIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseText, 40);
    } else {
        msgIndex = (msgIndex + 1) % messages.length;
        setTimeout(typeWriter, 300);
    }
}

setTimeout(typeWriter, 6000);
MorphSVGPlugin.convertToPath('polygon');
var xmlns = "http://www.w3.org/2000/svg",
    xlinkns = "http://www.w3.org/1999/xlink",
    select = function (s) {
        return document.querySelector(s);
    },
    selectAll = function (s) {
        return document.querySelectorAll(s);
    },
    pContainer = select('.pContainer'),
    mainSVG = select('.mainSVG'),
    star = select('#star'),
    sparkle = select('.sparkle'),
    tree = select('#tree'),
    showParticle = true,
    particleColorArray = ['#E8F6F8', '#ACE8F8', '#F6FBFE', '#A2CBDC', '#B74551', '#5DBA72', '#910B28', '#910B28', '#446D39'],
    particleTypeArray = ['#star', '#circ', '#cross', '#heart'],
    particlePool = [],
    particleCount = 0,
    numParticles = 201


gsap.set('svg', {
    visibility: 'visible'
})

gsap.set(sparkle, {
    transformOrigin: '50% 50%',
    y: -100
})

let getSVGPoints = (path) => {

    let arr = []
    var rawPath = MotionPathPlugin.getRawPath(path)[0];
    rawPath.forEach((el, value) => {
        let obj = {}
        obj.x = rawPath[value * 2]
        obj.y = rawPath[(value * 2) + 1]
        if (value % 2) {
            arr.push(obj)
        }
    })

    return arr;
}
let treePath = getSVGPoints('.treePath'),
    treeBottomPath = getSVGPoints('.treeBottomPath'),
    mainTl = gsap.timeline({ delay: 0, repeat: 0 }),
    starTl;

function flicker(p) {

    gsap.killTweensOf(p, { opacity: true });
    gsap.fromTo(p, {
        opacity: 1
    }, {
        duration: 0.07,
        opacity: Math.random(),
        repeat: -1
    })
}

function createParticles() {

    var i = numParticles, p, particleTl, step = numParticles / treePath.length, pos;
    while (--i > -1) {

        p = select(particleTypeArray[i % particleTypeArray.length]).cloneNode(true);
        mainSVG.appendChild(p);
        p.setAttribute('fill', particleColorArray[i % particleColorArray.length]);
        p.setAttribute('class', "particle");
        particlePool.push(p);
        gsap.set(p, {
            x: -100,
            y: -100,
            transformOrigin: '50% 50%'
        })



    }

}

var getScale = gsap.utils.random(0.5, 3, 0.001, true);

function playParticle(p) {
    if (!showParticle) { return };
    var p = particlePool[particleCount]
    gsap.set(p, {
        x: gsap.getProperty('.pContainer', 'x'),
        y: gsap.getProperty('.pContainer', 'y'),
        scale: getScale()
    }
    );
    var tl = gsap.timeline();
    tl.to(p, {
        duration: gsap.utils.random(0.61, 6),
        physics2D: {
            velocity: gsap.utils.random(-23, 23),
            angle: gsap.utils.random(-180, 180),
            gravity: gsap.utils.random(-6, 50)
        },
        scale: 0,
        rotation: gsap.utils.random(-123, 360),
        ease: 'power1',
        onStart: flicker,
        onStartParams: [p],
        onRepeat: (p) => {
            gsap.set(p, {
                scale: getScale()
            })
        },
        onRepeatParams: [p]

    });


    particleCount++;
    particleCount = (particleCount >= numParticles) ? 0 : particleCount

}

function drawStar() {

    starTl = gsap.timeline({ onUpdate: playParticle })
    starTl.to('.pContainer, .sparkle', {
        duration: 6,
        motionPath: {
            path: '.treePath',
            autoRotate: false
        },
        ease: 'linear'
    })
        .to('.pContainer, .sparkle', {
            duration: 1,
            onStart: function () { showParticle = false },
            x: treeBottomPath[0].x,
            y: treeBottomPath[0].y
        })
        .to('.pContainer, .sparkle', {
            duration: 2,
            onStart: function () { showParticle = true },
            motionPath: {
                path: '.treeBottomPath',
                autoRotate: false
            },
            ease: 'linear'
        }, '-=0')
        .from('.treeBottomMask', {
            duration: 2,
            drawSVG: '0% 0%',
            stroke: '#FFF',
            ease: 'linear'
        }, '-=2')

}


createParticles();
drawStar();

mainTl.from(['.treePathMask', '.treePotMask'], {
    duration: 6,
    drawSVG: '0% 0%',
    stroke: '#FFF',
    stagger: {
        each: 6
    },
    duration: gsap.utils.wrap([6, 1, 2]),
    ease: 'linear'
})
    .from('.treeStar', {
        duration: 3,
        scaleY: 0,
        scaleX: 0.15,
        transformOrigin: '50% 50%',
        ease: 'elastic(1,0.5)'
    }, '-=4')

    .to('.sparkle', {
        duration: 3,
        opacity: 0,
        ease: "rough({strength: 2, points: 100, template: linear, taper: both, randomize: true, clamp: false})"
    }, '-=0')
    .to('.treeStarOutline', {
        duration: 1,
        opacity: 1,
        ease: "rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})"
    }, '+=1')

mainTl.add(starTl, 0)
gsap.globalTimeline.timeScale(1.5);

function createSnowflake() {
    const snow = document.createElement("div");
    snow.classList.add("snowflake");
    snow.textContent = "❄";
    snow.style.left = Math.random() * window.innerWidth + "px";
    snow.style.fontSize = (Math.random() * 15 + 10) + "px";
    snow.style.animationDuration = (Math.random() * 5 + 5) + "s";
    snow.style.opacity = Math.random();
    document.body.appendChild(snow);
    setTimeout(() => {
        snow.remove();
    }, 10000);
}

setInterval(createSnowflake, 150);

const bgm = document.getElementById("bgm");
const santa = document.querySelector(".santa-claus");

document.addEventListener("DOMContentLoaded", () => {
    bgm.currentTime = 55;

    const attempt = bgm.play();

    if (attempt !== undefined) {
        attempt.catch(() => {
            console.log("Autoplay bị chặn trên mobile.");
        });
    }
});

function enableMusicOnTouch() {
    bgm.currentTime = 55;
    bgm.play();

    document.removeEventListener("touchstart", enableMusicOnTouch);
    document.removeEventListener("click", enableMusicOnTouch);
}

document.addEventListener("touchstart", enableMusicOnTouch);
document.addEventListener("click", enableMusicOnTouch);

santa.addEventListener("click", () => {
    bgm.currentTime = 55;
    bgm.play();
});
