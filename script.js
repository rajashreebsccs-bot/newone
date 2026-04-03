// ===== GLOBAL VARIABLES =====
var musicPlaying = false;
var formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSftqErZcP9iB0fenqyA_cdkbXwhnbIIcg09gkivDRcz_ef1zg/formResponse';
var thanksEntryId = 'entry.1883305769';
var messageEntryId = 'entry.1883305769';

// ===== :love_letter: OPEN ENVELOPE =====
function openEnvelope() {
    var envelope = document.querySelector('.envelope');
    envelope.classList.add('opened');

    setTimeout(function () {
        document.getElementById('screen1').classList.remove('active');
        document.getElementById('screen2').classList.add('active');
        startFloatingHearts();
        playVideoFirst();
    }, 800);
}

// ===== :movie_camera: PLAY VIDEO + :musical_note: MUSIC =====
function playVideoFirst() {
    var video = document.getElementById('ourVideo');
    var bgMusic = document.getElementById('bgMusic');
    var loader = document.getElementById('videoLoader');
    var videoArea = document.getElementById('videoArea');

    if (videoArea) videoArea.style.display = 'block';

    // Phone-specific: MUST be muted + playsinline for autoplay
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('muted', '');
    video.preload = 'auto';

    bgMusic.volume = 0.5;

    // Force load video first
    video.load();

    // Wait 2 seconds for phone to buffer, then try playing
    setTimeout(function () {
        if (loader) loader.classList.add('hidden');

        video.play().then(function () {
            console.log('Video playing!');

            // Start background music
            bgMusic.play().then(function () {
                musicPlaying = true;
                document.getElementById('musicBtn').textContent = ':loud_sound:';
            }).catch(function (err) {
                console.log('Music needs user tap:', err);
            });

        }).catch(function (err) {
            console.log('Autoplay blocked, showing tap button:', err);
            showTapButton();
        });
    }, 2000);

    // When video ends, show the letter
    video.addEventListener('ended', function () {
        showLetterAfterVideo();
    });

    // If video stuck for 12 seconds, skip to letter
    setTimeout(function () {
        if (video.paused || video.currentTime < 2) {
            console.log('Video stuck, skipping to letter...');
            if (loader && !loader.classList.contains('hidden')) {
                loader.classList.add('hidden');
            }
            showLetterAfterVideo();
        }
    }, 12000);

    // Handle stalling (buffering mid-play on phone)
    video.addEventListener('stalled', function () {
        console.log('Video stalled...');
        setTimeout(function () {
            if (video.paused || video.readyState < 3) {
                showLetterAfterVideo();
            }
        }, 4000);
    });

    // Handle waiting (buffering)
    video.addEventListener('waiting', function () {
        console.log('Video buffering...');
    });
}

// ===== :arrow_forward: TAP TO PLAY BUTTON (phones that block autoplay) =====
function showTapButton() {
    var videoArea = document.getElementById('videoArea');
    var video = document.getElementById('ourVideo');
    var bgMusic = document.getElementById('bgMusic');

    // Don't add multiple tap buttons
    if (document.getElementById('tapPlayBtn')) return;

    var tapBtn = document.createElement('button');
    tapBtn.id = 'tapPlayBtn';
    tapBtn.textContent = ':arrow_forward: Tap to Play :sparkling_heart:';
    tapBtn.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:20;background:linear-gradient(135deg,#FF6B9D,#C44569);color:white;border:none;padding:15px 30px;border-radius:50px;font-size:1.1rem;font-family:Poppins,sans-serif;cursor:pointer;animation:pulse 1.5s infinite;box-shadow:0 10px 30px rgba(255,107,157,0.5);';

    videoArea.style.position = 'relative';
    videoArea.appendChild(tapBtn);

    tapBtn.addEventListener('click', function () {
        tapBtn.remove();

        video.muted = true;
        video.play().then(function () {
            console.log('Video playing after tap!');

            bgMusic.play().then(function () {
                musicPlaying = true;
                document.getElementById('musicBtn').textContent = ':loud_sound:';
            }).catch(function () {
                console.log('Music still blocked');
            });

        }).catch(function () {
            console.log('Video failed even after tap, showing letter');
            showLetterAfterVideo();
        });
    });
}

// ===== :memo: SHOW LETTER AFTER VIDEO =====
function showLetterAfterVideo() {
    var videoArea = document.getElementById('videoArea');
    var title = document.getElementById('mainTitle');
    var letterBox = document.getElementById('letterBox');
    var surpriseBtn = document.getElementById('surpriseBtn');

    // Fade out video
    if (videoArea) {
        videoArea.style.transition = 'opacity 1s ease';
        videoArea.style.opacity = '0';
        setTimeout(function () {
            videoArea.style.display = 'none';

            // Stop video to free memory on phone
            var video = document.getElementById('ourVideo');
            if (video) {
                video.pause();
                video.src = '';
            }
        }, 1000);
    }

    // Show title
    setTimeout(function () {
        if (title) {
            title.style.display = 'block';
            title.style.opacity = '0';
            title.style.animation = 'gradientShift 4s ease infinite, fadeInDown 1s ease 0.3s forwards';
        }
    }, 500);

    // Show letter box
    setTimeout(function () {
        if (letterBox) {
            letterBox.style.display = 'block';
            letterBox.style.opacity = '0';
            letterBox.style.animation = 'fadeInUp 1s ease 0.5s forwards';

            // Reset text animations
            var greeting = document.querySelector('.greeting');
            if (greeting) greeting.style.animation = 'fadeInUp 0.8s ease 1s forwards';

            document.getElementById('text1').style.animation = 'fadeInUp 0.8s ease 1.5s forwards';
            document.getElementById('text2').style.animation = 'fadeInUp 0.8s ease 2.2s forwards';
            document.getElementById('text3').style.animation = 'fadeInUp 0.8s ease 2.9s forwards';
            document.getElementById('text4').style.animation = 'fadeInUp 0.8s ease 3.6s forwards';
            document.getElementById('text5').style.animation = 'fadeInUp 0.8s ease 4.3s forwards';

            var signature = document.querySelector('.signature');
            if (signature) signature.style.animation = 'fadeInUp 0.8s ease 5s forwards';
        }
    }, 1000);

    // Show surprise button
    setTimeout(function () {
        if (surpriseBtn) {
            surpriseBtn.style.display = 'inline-block';
            surpriseBtn.style.opacity = '0';
            surpriseBtn.style.animation = 'fadeInUp 0.8s ease 5.5s forwards';
        }
    }, 1200);

    // Start music if not already playing
    var bgMusic = document.getElementById('bgMusic');
    if (bgMusic && bgMusic.paused) {
        bgMusic.play().then(function () {
            musicPlaying = true;
            document.getElementById('musicBtn').textContent = ':loud_sound:';
        }).catch(function () {
            console.log('Music needs user interaction');
        });
    }
}

// ===== :sparkling_heart::blue_heart: FLOATING HEARTS + SENTIMENT EMOJIS =====
function startFloatingHearts() {
    var hearts = [':heart:', ':blue_heart:', ':heart:', ':blue_heart:', ':heart:', ':blue_heart:', ':sparkling_heart:', ':heartpulse:'];
    var sentiments = [':pleading_face:', ':two_hearts:', ':sparkles:', ':butterfly:', ':sparkling_heart:', ':kissing_heart:', ':heart_hands:', ':gift_heart:', ':rose:', ':dizzy:', ':smiling_face_with_3_hearts:', ':heartbeat:'];

    // Big floating hearts
    setInterval(function () {
        var heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 2.5 + 1.5) + 'rem';
        heart.style.animationDuration = (Math.random() * 5 + 6) + 's';
        heart.style.opacity = (Math.random() * 0.4 + 0.6).toString();
        document.body.appendChild(heart);
        setTimeout(function () { heart.remove(); }, 12000);
    }, 800);

    // Sentiment emojis
    setInterval(function () {
        var emoji = document.createElement('div');
        emoji.className = 'sentiment-emoji';
        emoji.textContent = sentiments[Math.floor(Math.random() * sentiments.length)];
        emoji.style.left = Math.random() * 100 + 'vw';
        emoji.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
        emoji.style.animationDuration = (Math.random() * 6 + 7) + 's';
        emoji.style.opacity = (Math.random() * 0.3 + 0.5).toString();
        document.body.appendChild(emoji);
        setTimeout(function () { emoji.remove(); }, 14000);
    }, 1200);
}

// ===== :birthday: SHOW SURPRISE (CAKE) =====
function showSurprise() {
    document.getElementById('surpriseBtn').style.display = 'none';
    document.getElementById('cakeSection').style.display = 'block';
    document.getElementById('cakeSection').style.animation = 'fadeInUp 0.8s ease forwards';
}

/ ===== :wind_blowing_face: BLOW CANDLES =====
function blowCandles() {
    for (var i = 1; i <= 5; i++) {
        (function (index) {
            setTimeout(function () {
                document.getElementById('flame' + index).classList.add('blown');
            }, index * 200);
        })(i);
    }

    setTimeout(function () {
        document.querySelector('.wish-text').textContent = ':tada: Happy Birthday Ammu! :tada:';
        document.querySelector('.blow-btn').style.display = 'none';
        startConfetti();

        setTimeout(function () {
            document.getElementById('cakeSection').style.display = 'none';
            document.getElementById('forgiveSection').style.display = 'block';
            document.getElementById('forgiveSection').style.animation = 'fadeInUp 0.8s ease forwards';
        }, 2500);
    }, 1500);
}

// ===== :triumph: NO BUTTON RUNS AWAY =====
function moveNoBtn() {
    var btn = document.getElementById('noBtn');
    var maxX = window.innerWidth - btn.offsetWidth - 20;
    var maxY = window.innerHeight - btn.offsetHeight - 20;
    var randomX = Math.floor(Math.random() * maxX);
    var randomY = Math.floor(Math.random() * maxY);
    btn.style.position = 'fixed';
    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';
    btn.style.zIndex = '9998';
}

// ===== :sparkling_heart: YES BUTTON =====
function sayYes() {
    document.querySelector('.response-buttons').style.display = 'none';
    document.getElementById('noBtn').style.display = 'none';
    document.getElementById('yay-message').style.display = 'block';
    document.getElementById('yay-message').style.animation = 'fadeInUp 0.8s ease forwards';

    startConfetti();

    // Celebration hearts burst
    for (var i = 0; i < 30; i++) {
        (function (index) {
            setTimeout(function () {
                var heart = document.createElement('div');
                heart.className = 'heart';
                heart.textContent = [':heart:', ':blue_heart:', ':sparkling_heart:', ':two_hearts:', ':pleading_face:', ':sparkles:', ':heart_hands:'][Math.floor(Math.random() * 7)];
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.fontSize = (Math.random() * 2 + 2) + 'rem';
                heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
                document.body.appendChild(heart);
                setTimeout(function () { heart.remove(); }, 6000);
            }, index * 100);
        })(i);
    }

    // Show thanks section
    setTimeout(function () {
        document.getElementById('thanksSection').style.display = 'block';
        document.getElementById('thanksSection').style.animation = 'fadeInUp 0.8s ease forwards';
    }, 2000);

    // Show message section
    setTimeout(function () {
        document.getElementById('messageSection').style.display = 'block';
        document.getElementById('messageSection').style.animation = 'fadeInUp 0.8s ease forwards';
    }, 3000);
}

// ===== :love_letter: SEND THANKS =====
function sendThanks() {
    var btn = document.getElementById('thanksBtn');
    btn.disabled = true;
    btn.classList.add('btn-loading');
    btn.textContent = '';

    var formData = new FormData();
    formData.append(thanksEntryId, 'Thanks and Love sent from Birthday Page! :sparkling_heart::birthday:');

    fetch(formURL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(function () {
        btn.classList.remove('btn-loading');
        btn.textContent = ':white_check_mark: Sent!';
        document.getElementById('thanksConfirmation').style.display = 'block';
        startConfetti();
    }).catch(function () {
        btn.classList.remove('btn-loading');
        btn.textContent = ':white_check_mark: Sent!';
        document.getElementById('thanksConfirmation').style.display = 'block';
    });
}

// ===== :gift_heart: SEND PERSONAL MESSAGE =====
function sendPersonalMessage() {
    var message = document.getElementById('hisMessage').value.trim();
    if (!message) {
        alert('Please write something! :pleading_face:');
        return;
    }

    var btn = document.getElementById('sendMsgBtn');
    btn.disabled = true;
    btn.classList.add('btn-loading');
    btn.textContent = '';

    var formData = new FormData();
    formData.append(messageEntryId, 'Personal Message: ' + message);

    fetch(formURL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(function () {
        showMessageSuccess();
    }).catch(function () {
        showMessageSuccess();
    });
}

function showMessageSuccess() {
    var btn = document.getElementById('sendMsgBtn');
    btn.classList.remove('btn-loading');
    btn.style.display = 'none';
    document.getElementById('hisMessage').style.display = 'none';
    document.querySelector('.char-count').style.display = 'none';
    document.getElementById('msgConfirmation').style.display = 'block';
    startConfetti();
}

// ===== :bar_chart: CHARACTER COUNTER =====
function updateCharCount() {
    var count = document.getElementById('hisMessage').value.length;
    document.getElementById('charCount').textContent = count;
}

// ===== :loud_sound: MUSIC TOGGLE =====
function toggleMusic() {
    var bgMusic = document.getElementById('bgMusic');
    var btn = document.getElementById('musicBtn');
    if (musicPlaying) {
        bgMusic.pause();
        btn.textContent = ':mute:';
        musicPlaying = false;
    } else {
        bgMusic.play().then(function () {
            btn.textContent = ':loud_sound:';
            musicPlaying = true;
        }).catch(function (err) {
            console.log('Music play failed:', err);
        });
    }
}

// ===== :confetti_ball: CONFETTI =====
function startConfetti() {
    var canvas = document.getElementById('confetti-canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var pieces = [];
    var colors = ['#FF6B9D', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD', '#01A3A4', '#FF6348', '#00D2D3', '#FF0044', '#4A90FF'];

    for (var i = 0; i < 150; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 360,
            spin: Math.random() * 0.2 - 0.1,
            drift: Math.random() * 2 - 1
        });
    }

    var frames = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(function (p) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
            p.y += p.speed;
            p.x += p.drift;
            p.angle += p.spin * 10;
            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        });
        frames++;
        if (frames < 300) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    animate();
}

// ===== :iphone: HANDLE WINDOW RESIZE =====
window.addEventListener('resize', function () {
    var canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
