function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let c = 0; c < ca.length; c++) {
        let d = ca[c];
        while (d.charAt(0) == ' ') {
            d = d.substring(1);
        }
        if (d.indexOf(name) == 0) {
            return d.substring(name.length, d.length);
        }
    }
    return "";
}

function reset() {
    status = 0;
    score = 0;
    yPos = 250;
    lockScroll = false;
    lockJump = false;
    lockBird = true;
    Pipes = [];
    hitTheGround = false;
}

function startGame() {
    status = 1;
    InitPipes();
    lockBird = false;
}

function gameOver() {
    if (status == 2) {
        return 0;
    }

    // hit sound
    if (sfx_hit != null) {
        sfx_hit.play();
    }

    status = 2; // Game Over
    lockScroll = true;
    lockJump = true;

    // Verify the best score
    let bestScoreCookie = getCookie("best");
    newBest = false;
    if (bestScoreCookie == "") {
        // new best score
        bestScore = 0;
        setCookie("best", score);
        newBest = true;
    } else {
        let lastBest = parseInt(bestScoreCookie);
        bestScore = lastBest;
        if (score > lastBest) {
            // new best score
            setCookie("best", score);
            newBest = true;
        }
    }

}

function resetScore() {
    setCookie("best", "0");
}