// ===== 🔑 YOUR GOOGLE FORM CREDENTIALS =====
var GOOGLE_FORM_ID = '1FAIpQLScA4-5MHgDq6t1Qgymr4XXqrplKXTqc6Pz1JHlF0ZiT_sQm4w';
var GOOGLE_ENTRY_ID = 'entry.629896746';
var GOOGLE_MESSAGE_ENTRY_ID = 'entry.934161882';

// ===== 🎵 MUSIC VARIABLE =====
var musicPlaying = false;

// ===== 🔍 FIND ENTRY IDs - DELETE AFTER FINDING! =====
function findEntryIds() {
    var formUrl = 'https://docs.google.com/forms/d/e/' + GOOGLE_FORM_ID + '/viewform';

    fetch(formUrl)
        .then(function(response) { return response.text(); })
        .then(function(html) {
            var matches = html.match(/entry\.\d+/g);
            if (matches) {
                var uniqueIds = [];
                for (var i = 0; i < matches.length; i++) {
                    if (uniqueIds.indexOf(matches[i]) === -1) {
                        uniqueIds.push(matches[i]);
                    }
                }
                alert('Found Entry IDs:\n\n' + uniqueIds.join('\n') + '\n\nFirst = Action\nSecond = Message');
            } else {
                alert('Could not find entry IDs.');
            }
        })
        .catch(function(err) {
            alert('Error: ' + err.message);
        });
}

// ===== 🎵 MUSIC CONTROLS =====
function startMusic() {
    var music = document.getElementById('bgMusic');
    if (!music) return;

    music.volume = 0.5;
    music.play().then(function() {
        musicPlaying = true;
        document.getElementById('musicBtn').textContent = '🔊';
    }).catch(function(err) {
        console.log('Music autoplay blocked:', err);
        musicPlaying = false;
        document.getElementById('musicBtn').textContent = '🔇';
    });
}

function toggleMusic() {
    var music = document.getElementById('bgMusic');
    var btn = document.getElementById('musicBtn');
    if (!music || !btn) return;

    if (musicPlaying) {
        music.pause();
        musicPlaying = false;
        btn.textContent = '🔇';
    } else {
        music.volume = 0.5;
        music.play().then(function() {
            musicPlaying = true;
            btn.textContent = '🔊';
        }).catch(function(err) {
            console.log('Cannot play music:', err);
        });
    }
}

// ===== SEND NOTIFICATION VIA GOOGLE FORM =====
function notifyMe(actionType) {
    var formUrl = 'https://docs.google.com/forms/d/e/' + GOOGLE_FORM_ID + '/formResponse';

    var now = new Date();
    var time = now.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    var fullMessage = actionType + ' | Time: ' + time;

    var formData = new FormData();
    formData.append(GOOGLE_ENTRY_ID, fullMessage);

    fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(function() {
        console.log('Sent: ' + fullMessage);
    }).catch(function(err) {
        console.log('Error:', err);
    });
}

// ===== OPEN ENVELOPE =====
function openEnvelope() {
    var envelope = document.getElementById('envelope');
    envelope.classList.add('opened');

    notifyMe('💌 Opened the Envelope');

    setTimeout(function() {
        document.getElementById('landing').classList.remove('active');
        document.getElementById('message-screen').classList.add('active');

        // 🎥 PLAY VIDEO + 🎵 MUSIC TOGETHER
        playVideoFirst();
    }, 800);
}

// ===== 🎥 PLAY VIDEO + 🎵 MUSIC AUTOMATICALLY =====
function playVideoFirst() {
    var video = document.getElementById('ourVideo');
    var bgMusic = document.getElementById('bgMusic');
    var videoSection = document.querySelector('.video-section');

    // Hide letter and other stuff — show only video
    var title = document.querySelector('.title');
    var letterBox = document.querySelector('.letter-box');
    var surpriseBtn = document.querySelector('.surprise-btn');

    if (title) title.style.display = 'none';
    if (letterBox) letterBox.style.display = 'none';
    if (surpriseBtn) surpriseBtn.style.display = 'none';

    // Show video section with fade in
    if (videoSection) {
        videoSection.style.opacity = '0';
        videoSection.style.display = 'block';
        videoSection.style.animation = 'fadeInUp 1s ease forwards';
    }

    // Video is muted (no sound in video)
    video.muted = true;

    // 🎵 Set background music volume
    bgMusic.volume = 0.5;

    // Try to play both together
    function tryPlayVideo() {
      video.play().then(function() {
        console.log('Video playing!');

        // Now start music
        bgMusic.play().then(function() {
            musicPlaying = true;
            document.getElementById('musicBtn').textContent = '🔊';
        }).catch(function(err) {
            console.log('Music blocked:', err);
            showTapForMusic();
        });

        notifyMe('🎥 Watching Your Video!');

    }).catch(function(err) {
        console.log('Video autoplay failed:', err);
        showTapToPlay();
    });
    }
    // Check if video can play
    if (video.readyState >= 3) {
        // Already loaded enough
        tryPlayVideo();
    } else {
        // Wait for enough data to load
        video.addEventListener('canplay', function onCanPlay() {
            video.removeEventListener('canplay', onCanPlay);
            tryPlayVideo();
        });
    }

    // Safety: If nothing happens in 8 seconds, show tap to play
    setTimeout(function() {
        if (video.paused && !document.getElementById('tapOverlay')) {
            showTapToPlay();
        }
    }, 8000);

    // When video ends → show the letter
    video.addEventListener('ended', function() {
        showLetterAfterVideo();
    });
}

// ===== TAP TO PLAY (if autoplay blocked on phone) =====
function showTapToPlay() {
    var video = document.getElementById('ourVideo');
    var bgMusic = document.getElementById('bgMusic');
    var videoWrapper = document.querySelector('.heart-video-container');
    // Create tap overlay
    var overlay = document.createElement('div');
    overlay.id = 'tapOverlay';
    overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;border-radius:20px;';

    var playContent = document.createElement('div');
    playContent.style.cssText = 'text-align:center;';

    var playIcon = document.createElement('p');
    playIcon.textContent = '▶';
    playIcon.style.cssText = 'font-size:4rem;color:white;';

    var playText = document.createElement('p');
    playText.textContent = 'Tap to play 💖';
    playText.style.cssText = 'color:white;font-size:1.2rem;margin-top:10px;font-family:Poppins,sans-serif;';

    playContent.appendChild(playIcon);
    playContent.appendChild(playText);
    overlay.appendChild(playContent);

    videoWrapper.style.position = 'relative';
    videoWrapper.appendChild(overlay);

    overlay.addEventListener('click', function() {
        overlay.remove();

        // Play video (muted — no sound in video)
        video.muted = true;
        video.play();

        // 🎵 Play background music WITH sound
        bgMusic.volume = 0.5;
        bgMusic.play().then(function() {
            musicPlaying = true;
            document.getElementById('musicBtn').textContent = '🔊';
        }).catch(function(err) {
            console.log('Music failed:', err);
        });

        notifyMe('🎥 Watching Your Video!');
    });
}

// ===== TAP FOR MUSIC (if video plays but music doesn't) =====
function showTapForMusic() {
    var musicBtn = document.getElementById('musicBtn');

    // Make music button glow
    musicBtn.style.animation = 'musicAlert 0.5s ease-in-out infinite alternate';
    musicBtn.textContent = '🔇';

    // Add hint
    var hint = document.createElement('div');
    hint.id = 'musicHint';
    hint.textContent = '🎵 Tap for music!';
    hint.style.cssText = 'position:fixed;bottom:75px;right:10px;z-index:9999;background:rgba(255,107,157,0.9);color:white;padding:8px 15px;border-radius:20px;font-size:0.85rem;font-family:Poppins,sans-serif;';
    document.body.appendChild(hint);

    // Remove hint after 3 seconds
    setTimeout(function() {
        var existingHint = document.getElementById('musicHint');
        if (existingHint) {
            existingHint.remove();
        }
    }, 3000);
}

// ===== SHOW LETTER AFTER VIDEO ENDS =====
function showLetterAfterVideo() {
    var videoSection = document.querySelector('.video-section');
    var title = document.querySelector('.title');
    var letterBox = document.querySelector('.letter-box');
    var surpriseBtn = document.querySelector('.surprise-btn');

    // Fade out video
    videoSection.style.animation = 'fadeOutVideo 1s ease forwards';

    setTimeout(function() {
        // Hide video
        videoSection.style.display = 'none';

        // Show title
        title.style.display = 'block';
        title.style.opacity = '0';
        title.style.animation = 'gradientShift 4s ease infinite, fadeInDown 1s ease 0.3s forwards';

        // Show letter
        letterBox.style.display = 'block';
        letterBox.style.opacity = '0';
        letterBox.style.animation = 'fadeInUp 1s ease 0.5s forwards';

        // Reset letter text animations
        document.querySelector('.greeting').style.animation = 'fadeInUp 0.8s ease 1s forwards';
        document.getElementById('text1').style.animation = 'fadeInUp 0.8s ease 1.5s forwards';
        document.getElementById('text2').style.animation = 'fadeInUp 0.8s ease 2.2s forwards';
        document.getElementById('text3').style.animation = 'fadeInUp 0.8s ease 2.9s forwards';
        document.getElementById('text4').style.animation = 'fadeInUp 0.8s ease 3.6s forwards';
        document.getElementById('text5').style.animation = 'fadeInUp 0.8s ease 4.3s forwards';
        document.querySelector('.signature').style.animation = 'fadeInUp 0.8s ease 5s forwards';

        // Show surprise button
        surpriseBtn.style.display = 'inline-block';
        surpriseBtn.style.opacity = '0';
        surpriseBtn.style.animation = 'fadeInUp 0.8s ease 5.5s forwards';

        // Start floating hearts
        startFloatingHearts();

    }, 1000);
}

// ===== FLOATING HEARTS (Red & Blue Glittery) =====
function startFloatingHearts() {
    var container = document.getElementById('hearts-container');
    var heartEmojis = ['❤️', '💙', '❤️', '💙', '❤️', '💙'];

    setInterval(function() {
        var heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
        heart.style.animationDuration = (Math.random() * 5 + 6) + 's';
        heart.style.filter = 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.9))';
        heart.style.textShadow = '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff';

        container.appendChild(heart);
        setTimeout(function() { heart.remove(); }, 12000);
    }, 400);
}

// ===== LAUNCH CAKE =====
function launchCake() {
    var cakeSection = document.getElementById('cake-section');
    cakeSection.classList.remove('hidden');
    cakeSection.style.animation = 'fadeInUp 0.8s ease forwards';
    document.querySelector('.surprise-btn').style.display = 'none';

    notifyMe('🎁 Clicked Surprise Button');

    cakeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== BLOW CANDLES =====
function blowCandles() {
    var flames = document.querySelectorAll('.flame');
    flames.forEach(function(flame, index) {
        setTimeout(function() {
            flame.classList.add('blown');
        }, index * 300);
    });

    notifyMe('🌬️ Blew the Candles');

    setTimeout(function() {
        document.querySelector('.blow-btn').style.display = 'none';
        document.querySelector('.wish-text').style.display = 'none';
        var afterBlow = document.getElementById('after-blow');
        afterBlow.classList.remove('hidden');
        afterBlow.style.animation = 'fadeInUp 0.8s ease forwards';
        launchConfetti();
    }, 1200);
}

// ===== MOVE "NO" BUTTON =====
function moveNoButton() {
    var btn = document.getElementById('noBtn');
    var x = Math.random() * (window.innerWidth - 150);
    var y = Math.random() * (window.innerHeight - 60);
    btn.style.position = 'fixed';
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
    btn.style.zIndex = '1000';

    notifyMe('😂 Tried to Click NO');
}

// ===== SAY YES =====
function sayYes() {
    document.querySelector('.response-buttons').style.display = 'none';
    document.querySelector('.forgive-text').style.display = 'none';
    var yayMessage = document.getElementById('yay-message');
    yayMessage.classList.remove('hidden');
    yayMessage.style.animation = 'fadeInUp 0.8s ease forwards';
    launchConfetti();

    notifyMe('💖 HE SAID YES! He forgives you!');

    for (var i = 0; i < 30; i++) {
        (function(index) {
            setTimeout(function() {
                var heart = document.createElement('div');
                heart.classList.add('heart');
                var emojis = ['❤️', '💙', '❤️', '💙', '🎉'];
                heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.fontSize = '2rem';
                heart.style.animationDuration = '4s';
                heart.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))';
                document.getElementById('hearts-container').appendChild(heart);
            }, index * 100);
        })(i);
    }
}

// ===== 💌 SEND THANKS BUTTON =====
function sendThanks() {
    var btn = document.getElementById('thanksBtn');
    btn.disabled = true;
    btn.classList.add('btn-loading');
    btn.textContent = 'Sending...';

    var formUrl = 'https://docs.google.com/forms/d/e/' + GOOGLE_FORM_ID + '/formResponse';

    var now = new Date();
    var time = now.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    var formData = new FormData();
    formData.append(GOOGLE_ENTRY_ID, '💌 Sent Thank You! | Time: ' + time);

    fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(function() {
        btn.classList.remove('btn-loading');
        btn.textContent = '✅ Sent!';
        btn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
        document.getElementById('thanks-sent').classList.remove('hidden');
        launchConfetti();

        // Show personal message section after 2 seconds
        setTimeout(function() {
            var msgSection = document.getElementById('personal-message-section');
            msgSection.classList.remove('hidden');
            msgSection.style.animation = 'fadeInUp 1s ease forwards';
            msgSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 2000);

    }).catch(function(err) {
        btn.classList.remove('btn-loading');
        btn.textContent = '❌ Failed, try again';
        btn.disabled = false;
    });
}

// ===== 💬 SEND HIS PERSONAL MESSAGE =====
function sendHisMessage() {
    var messageBox = document.getElementById('hisMessage');
    var btn = document.getElementById('sendMessageBtn');
    var message = messageBox.value.trim();

    if (message === '') {
        messageBox.style.border = '2px solid #ff6b6b';
        messageBox.setAttribute('placeholder', '💬 Please type something... I am waiting! 🥺');
        return;
    }

    btn.disabled = true;
    btn.classList.add('btn-loading');
    btn.textContent = 'Sending...';

    var formUrl = 'https://docs.google.com/forms/d/e/' + GOOGLE_FORM_ID + '/formResponse';

    var now = new Date();
    var time = now.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    var formData = new FormData();
    formData.append(GOOGLE_ENTRY_ID, '💬 Sent a Personal Message | Time: ' + time);
    formData.append(GOOGLE_MESSAGE_ENTRY_ID, message);

    fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(function() {
        btn.classList.remove('btn-loading');
        btn.textContent = '✅ Sent!';
        btn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';

        document.getElementById('message-sent-confirmation').classList.remove('hidden');
        messageBox.style.display = 'none';
        document.querySelector('.char-count').style.display = 'none';

        launchConfetti();
        notifyMe('💬 HE SENT A PERSONAL MESSAGE! Check Google Forms! 💖');

    }).catch(function(err) {
        btn.classList.remove('btn-loading');
        btn.textContent = '❌ Failed, try again';
        btn.disabled = false;
    });
}

// ===== CONFETTI =====
function launchConfetti() {
    var canvas = document.getElementById('confetti-canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var confettiPieces = [];
    var colors = ['#ff6b9d', '#feca57', '#ff9ff3', '#00b894', '#74b9ff', '#a29bfe', '#fd79a8', '#00cec9'];

    for (var i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 12 + 5,
            h: Math.random() * 8 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 4 + 2,
            angle: Math.random() * 360,
            spin: Math.random() * 10 - 5,
            drift: Math.random() * 2 - 1
        });
    }

    var frameCount = 0;

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confettiPieces.forEach(function(p) {
            ctx.save();
            ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
            ctx.rotate((p.angle * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();

            p.y += p.speed;
            p.x += p.drift;
            p.angle += p.spin;
        });

        frameCount++;
        if (frameCount < 300) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animateConfetti();
}

// ===== CHARACTER COUNTER =====
document.addEventListener('DOMContentLoaded', function() {
    var textarea = document.getElementById('hisMessage');
    if (textarea) {
        textarea.addEventListener('input', function() {
            var count = this.value.length;
            document.getElementById('charCount').textContent = count;

            var counter = document.getElementById('charCount');
            if (count > 450) {
                counter.style.color = '#ff6b6b';
            } else if (count > 350) {
                counter.style.color = '#feca57';
            } else {
                counter.style.color = 'rgba(255, 255, 255, 0.4)';
            }
        });
    }
});

// ===== WINDOW RESIZE =====
window.addEventListener('resize', function() {
    var canvas = document.getElementById('confetti-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
