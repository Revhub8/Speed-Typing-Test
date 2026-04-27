document.addEventListener("DOMContentLoaded", () => {
    // DOM references
    const textDisplay   = document.querySelector("#paragraph");
    const userInput     = document.querySelector(".input-field");
    const timerDisplay  = document.querySelector(".time span b");
    const errorCount    = document.querySelector(".error span");
    const wpmDisplay    = document.querySelector(".wpm span");
    const accuracyDisp  = document.querySelector(".accuracy span");
    const retryBtn      = document.querySelector("button");

    // Game state
    const TEST_DURATION = 60;
    let countdownTimer, timeRemaining = TEST_DURATION;
    let totalMistakes = 0, currentIndex = 0, hasStarted = false;

    const passages = [
        "The old lighthouse stood tall against the crashing waves, its beacon guiding sailors safely through the night. Stars twinkled in the dark sky above, while the salty sea breeze carried the sound of distant seagulls. It was a scene of timeless beauty, a reminder of the power and majesty of the ocean.",

        "As the first light of dawn crept over the horizon, the sleepy town slowly came to life. Shopkeepers opened their doors, filling the air with the aroma of freshly baked bread and brewing coffee. Birds chirped merrily in the trees, greeting the new day with song.",

        "In the heart of the bustling city, skyscrapers towered over crowded streets, casting long shadows in the afternoon sun. Horns blared and people hurried along the sidewalks, lost in their own thoughts and worries. Yet amidst the chaos, there was a sense of energy and possibility.",

        "High in the mountains, a solitary cabin nestled among the pines, its chimney sending curls of smoke into the crisp mountain air. Inside, a fire crackled in the hearth, casting a warm glow over the cozy interior. It was a refuge from the world below, a place of peace and solitude.",

        "The ancient ruins lay silent beneath the blazing sun, their weathered stones bearing witness to centuries of history. Moss clung to crumbling walls, while vines twisted around fallen pillars. It was a reminder of the passage of time, a testament to the resilience of the human spirit.",

        "In the vast expanse of the desert, sand dunes stretched as far as the eye could see, their rippling waves shimmering in the midday heat. A lone camel trudged across the endless landscape, its footsteps muffled by the soft sand. It was a world of solitude and silence, where time seemed to stand still.",

        "The dense jungle teemed with life, its lush foliage alive with the chatter of monkeys and the call of exotic birds. Sunlight filtered through the canopy above, casting dappled shadows on the forest floor. It was a world of mystery and wonder, waiting to be explored.",

        "On the vast savanna, herds of wildebeest roamed freely, their thundering hooves stirring up clouds of dust. Lions lazed in the shade of acacia trees, their golden coats blending seamlessly with the tall grass. It was a landscape of raw beauty, where predator and prey lived in delicate balance.",

        "Beneath the icy waters of the Arctic Ocean, a world of wonder lay hidden from view. Polar bears prowled the frozen tundra, while seals darted gracefully through the frigid depths. It was a harsh and unforgiving environment, yet one filled with beauty and resilience.",

        "In the heart of the rainforest, a mighty river surged and roared, its waters carving a path through the dense foliage. Giant trees loomed overhead, their branches alive with the chatter of monkeys and the trill of exotic birds. It was a world of unparalleled biodiversity, a treasure trove of life.",

        "At the edge of the desert, an oasis shimmered like a mirage in the midday sun. Palm trees swayed gently in the breeze, their fronds providing shade for weary travelers. Clear water sparkled in the sunlight, inviting weary travelers to quench their thirst and rest their weary limbs.",

        "In the heart of the ancient forest, a hidden grove lay untouched by the passage of time. Sunlight filtered through the dense canopy above, casting a soft glow on the moss-covered ground below. Birds flitted among the branches, their songs echoing through the silent woods.",

        "As night fell, the city came alive with the twinkle of a thousand lights. Skyscrapers towered overhead, their glass facades reflecting the glow of the moon above. Streets bustled with activity, as cars honked and pedestrians hurried along the sidewalks. It was a world of constant motion and noise.",

        "In the quiet of the countryside, fields stretched to the horizon, their golden crops swaying in the gentle breeze. Barns dotted the landscape, their weathered walls standing testament to generations of hard work and toil. It was a world untouched by the hustle and bustle of the city, a place of peace and simplicity.",

        "In the shadow of the mountains, a sleepy village nestled among the trees, its cobblestone streets winding through the quaint town square. Old-fashioned lampposts cast a warm glow on the cobblestones below, while the smell of wood smoke wafted through the air. It was a scene straight out of a storybook, a place where time seemed to stand still.",

        "Amidst the rolling hills, a vineyard sprawled across the landscape, its neat rows of grapevines stretching as far as the eye could see. Workers toiled in the fields, harvesting the ripe fruit under the watchful gaze of the sun. It was a scene of abundance and prosperity, a testament to the bounty of the land.",

        "On the rugged coast, cliffs towered over crashing waves, their rocky faces battered by the relentless sea. Seagulls soared overhead, their cries mingling with the roar of the surf. It was a wild and untamed landscape, where nature reigned supreme.",

        "In the heart of the city, a bustling marketplace hummed with activity, its narrow alleys crowded with vendors and shoppers alike. The air was alive with the sound of haggling and laughter, as people bartered for goods and shared stories with friends. It was a scene of vibrant energy and excitement.",

        "At the foot of the mountains, a tranquil lake shimmered in the afternoon sun, its still waters reflecting the beauty of the surrounding landscape. Ducks paddled lazily across the surface, leaving trails of ripples in their wake. It was a scene of serenity and peace, a place to escape the hustle and bustle of everyday life.",

        "In the heart of the city, a grand cathedral rose majestically into the sky, its towering spires reaching towards the heavens. Stained glass windows bathed the interior in a kaleidoscope of colors, while the organ filled the air with music. It was a place of beauty and reverence, a sanctuary in the midst of the bustling city."
    ];

    // Pick and render a random passage as individual <span> elements
    function loadPassage() {
        const idx = Math.floor(Math.random() * passages.length);
        textDisplay.innerHTML = "";
        passages[idx].split("").forEach(ch => {
            textDisplay.innerHTML += `<span>${ch}</span>`;
        });
        textDisplay.querySelectorAll("span")[0].classList.add("active");
        document.addEventListener("keydown", () => userInput.focus());
        textDisplay.addEventListener("click", () => userInput.focus());
    }

    // Handle each input event — advance, backtrack, and score
    function handleInput() {
        const chars = textDisplay.querySelectorAll("span");
        const typed  = userInput.value[currentIndex];

        if (currentIndex < chars.length && timeRemaining > 0) {
            // Start the countdown on first keystroke
            if (!hasStarted) {
                countdownTimer = setInterval(tick, 1000);
                hasStarted = true;
            }

            if (typed == null) {
                // Backspace: undo last character
                if (currentIndex > 0) {
                    currentIndex--;
                    if (chars[currentIndex].classList.contains("incorrect")) totalMistakes--;
                    chars[currentIndex].classList.remove("correct", "incorrect");
                }
            } else {
                // Grade the character
                if (chars[currentIndex].innerText === typed) {
                    chars[currentIndex].classList.add("correct");
                } else {
                    totalMistakes++;
                    chars[currentIndex].classList.add("incorrect");
                }
                currentIndex++;
            }

            // Move the active cursor highlight
            chars.forEach(s => s.classList.remove("active"));
            if (currentIndex < chars.length) chars[currentIndex].classList.add("active");

            // Update live stats
            const elapsed = TEST_DURATION - timeRemaining || 1;
            const wpm        = Math.round(((currentIndex - totalMistakes) / 5) / elapsed * 60);
            const accuracy   = Math.round(((currentIndex - totalMistakes) / currentIndex) * 100);
            const errPercent = 100 - accuracy;

            wpmDisplay.innerText   = wpm;
            errorCount.innerText   = totalMistakes;
            accuracyDisp.innerText = accuracy;
            errorCount.innerText   = errPercent.toFixed(2);

            // Finished the whole passage early
            if (currentIndex === chars.length) {
                clearInterval(countdownTimer);
                userInput.value = "";
                finalizeResults();
            }
        } else {
            // Time expired mid-type
            userInput.value = "";
            clearInterval(countdownTimer);
            finalizeResults();
        }
    }

    // Count down the timer each second
    function tick() {
        if (timeRemaining > 0) {
            timeRemaining--;
            timerDisplay.innerText = timeRemaining;
        } else {
            clearInterval(countdownTimer);
            finalizeResults();
        }
    }

    // Compute final stats, save to storage, redirect
    function finalizeResults() {
        const correctChars = currentIndex - totalMistakes;
        let accuracy = Math.round((correctChars / currentIndex) * 100);
        if (!accuracy || accuracy < 0 || !isFinite(accuracy)) accuracy = 0;

        const wpm        = Math.round((correctChars / 5) / TEST_DURATION * 60);
        const errPercent = 100 - accuracy;

        wpmDisplay.innerText   = wpm;
        errorCount.innerText   = totalMistakes;
        accuracyDisp.innerText = accuracy;

        localStorage.setItem("wpm",             wpm);
        localStorage.setItem("mistakes",        totalMistakes);
        localStorage.setItem("accuracy",        accuracy);
        localStorage.setItem("errorPercentage", errPercent.toFixed(2));

        window.location.href = "RESULTS.html";
    }

    // Reset everything and load a new passage
    function resetTest() {
        loadPassage();
        userInput.value        = "";
        clearInterval(countdownTimer);
        timeRemaining          = TEST_DURATION;
        currentIndex           = totalMistakes = 0;
        hasStarted             = false;
        timerDisplay.innerText = timeRemaining;
        errorCount.innerText   = 0;
        wpmDisplay.innerText   = 0;
        accuracyDisp.innerText = 0;
    }

    // Init
    loadPassage();
    userInput.addEventListener("input", handleInput);
    retryBtn.addEventListener("click", resetTest);
});
