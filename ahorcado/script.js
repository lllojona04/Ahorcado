$(document).ready(function() {
    let dictionary = { facil: [], normal: [], dificil: [] }; 
    let currentWord = '';
    let guessedLetters = [];
    let wrongGuesses = 0;
    let maxWrongGuesses = 7;
    let wins = 0;
    let losses = 0;
    let level = 1;
    let round = 1;
    const maxRounds = 15;
    const roundsPerLevel = 5; 

    const hangmanImages = [
        './img/ahorcado0.png',
        './img/ahorcado1.png',
        './img/ahorcado2.png',
        './img/ahorcado3.png',
        './img/ahorcado4.png',
        './img/ahorcado5.png',
        './img/ahorcado6.png',
        './img/ahorcado7.png'
    ];

    const $loading = $('#loading');
    const $error = $('#error');
    const $levelSpan = $('#level');
    const $roundSpan = $('#round');
    const $winsSpan = $('#wins');
    const $lossesSpan = $('#losses');
    const $hangmanImg = $('#hangman-img');
    const $wordToGuess = $('#word-to-guess');
    const $keyboard = $('#keyboard');
    const $newGameBtn = $('#new-game-btn');
    const $clearStatsBtn = $('#clear-stats-btn');
    const $exitBtn = $('#exit-btn');
    const $timerSpan = $('#timer');

    let timer;
    let timeLeft = 60; 
    let roundActive = false; 
    let currentDifficulty = '';

    // --- Inicialización ---
    function loadDictionary() {
        $loading.removeClass('hidden');
        $error.addClass('hidden');

        $.ajax({
         url: 'HTTP://LOCALHOST/ahorcado/ahorcado.php',
            method: 'POST',
            dataType: 'json',
            success: function(data) {
                dictionary = data; 
                $loading.addClass('hidden');
                initializeGame();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $loading.addClass('hidden');
                $error.removeClass('hidden');
                alert('No se pudo cargar el diccionario.');
            }
        });
    }

    function initializeGame() {
        wins = 0;
        losses = 0;
        level = 1;
        round = 1;
        updateGameInfo();
        generateKeyboard();
        startNewRound();
    }

    function newGame() {
        if (confirm('¿Deseas iniciar una nueva partida? Se perderá el progreso actual.')) {
            initializeGame();
        }
    }

    function clearStats() {
        if (confirm('¿Deseas limpiar los contadores de partidas ganadas y perdidas?')) {
            wins = 0;
            losses = 0;
            updateGameInfo();
        }
    }

    function exitGame() {
        if (confirm('¿Deseas salir del juego?')) {
            window.close(); 
            // alert('Has salido del juego. Cierra la pestaña manualmente si no se cerró automáticamente.');
        }
    }

    function generateKeyboard() {
        $keyboard.empty();
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < letters.length; i++) {
            const letter = letters[i];
            const $button = $('<button>')
                .addClass('key')
                .text(letter.toUpperCase())
                .data('letter', letter)
                .on('click', handleGuess);
            $keyboard.append($button);
        }
    }

    // --- Juego ---
    function startTimer() {
        clearInterval(timer);
        timeLeft = 60;
        roundActive = true;
        $timerSpan.text(`Tiempo: ${timeLeft}s`);
        timer = setInterval(() => {
            timeLeft--;
            $timerSpan.text(`Tiempo: ${timeLeft}s`);
            if (timeLeft <= 0) {
                clearInterval(timer);
                roundActive = false;
                alert(`¡Se acabó el tiempo! La palabra era "${currentWord.toUpperCase()}"`);
                losses++;
                updateGameInfo(currentDifficulty);
                round++;
                startNewRound();
            }
        }, 1000);
    }

    function startNewRound() {
        if (round > maxRounds) {
            endGame();
            return;
        }

        // Determinar dificultad
        let wordList;
        if (round <= roundsPerLevel) {
            currentDifficulty = 'Fácil';
            wordList = dictionary.facil;
        } else if (round <= roundsPerLevel * 2) {
            currentDifficulty = 'Normal';
            wordList = dictionary.normal;
        } else {
            currentDifficulty = 'Difícil';
            wordList = dictionary.dificil;
        }

        if (!wordList || wordList.length === 0) {
            alert(`No hay palabras para el nivel ${currentDifficulty}.`);
            loadDictionary();
            return;
        }

        currentWord = wordList[Math.floor(Math.random() * wordList.length)].toLowerCase();
        guessedLetters = [];
        wrongGuesses = 0;
        $hangmanImg.attr('src', hangmanImages[0]);
        
        resetKeyboard();
        updateWordDisplay();
        updateGameInfo(currentDifficulty);
        startTimer();
        console.log('Palabra a adivinar:', currentWord);
    }

    function updateGameInfo(difficulty = '') {
        $levelSpan.text(difficulty);
        $roundSpan.text(`Ronda: ${round} de ${maxRounds}`);
        $winsSpan.text(wins);
        $lossesSpan.text(losses);
    }

    function updateWordDisplay() {
        let displayWord = '';
        for (let i = 0; i < currentWord.length; i++) {
            const letter = currentWord[i];
            if (guessedLetters.includes(letter) || letter === ' ' || letter === '-') {
                displayWord += letter.toUpperCase();
            } else {
                displayWord += '_';
            }
            displayWord += ' ';
        }
        $wordToGuess.text(displayWord.trim());
    }

    function handleGuess(event, keyLetter = null) {
        if (!roundActive) return;

        const letter = keyLetter ? keyLetter.toLowerCase() : $(this).data('letter');
        if (guessedLetters.includes(letter)) return;

        guessedLetters.push(letter);

        const $targetButton = $(`.key[data-letter="${letter}"]`);
        $targetButton.prop('disabled', true);

        if (currentWord.includes(letter)) {
            updateWordDisplay();
            if (checkWin()) {
                roundActive = false;
                clearInterval(timer);
                handleRoundEnd(true);
            }
        } else {
            wrongGuesses++;
            $hangmanImg.attr('src', hangmanImages[wrongGuesses]);
            if (wrongGuesses >= maxWrongGuesses) {
                roundActive = false;
                clearInterval(timer);
                handleRoundEnd(false);
            }
        }
    }

    function checkWin() {
        for (let i = 0; i < currentWord.length; i++) {
            const letter = currentWord[i];
            if (letter !== ' ' && letter !== '-' && !guessedLetters.includes(letter)) {
                return false;
            }
        }
        return true;
    }

    function handleRoundEnd(won) {
        if (won) {
            wins++;
            updateGameInfo(currentDifficulty);
            setTimeout(() => {
                alert(`¡Felicidades! Adivinaste`);
                round++;
                startNewRound();
            }, 100);
        } else {
            losses++;
            updateGameInfo(currentDifficulty);
            setTimeout(() => {
                alert(`¡Perdiste! La palabra era "${currentWord.toUpperCase()}"`);
                round++;
                startNewRound();
            }, 100);
        }
    }

    function resetKeyboard() {
        $('.key').prop('disabled', false);
    }

    function endGame() {
        alert(`¡Partida Terminada!\nGanadas: ${wins}\nPerdidas: ${losses}`);
        newGame();
    }

    // --- Teclado físico ---
    $(document).on('keypress', function(e) {
        if (!roundActive) return;
        const charCode = e.which;
        if ((charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90)) {
            const pressedLetter = String.fromCharCode(charCode).toLowerCase();
            handleGuess(null, pressedLetter);
        }
    });

    $newGameBtn.on('click', newGame);
    $clearStatsBtn.on('click', clearStats);
    $exitBtn.on('click', exitGame);

    loadDictionary();
});
