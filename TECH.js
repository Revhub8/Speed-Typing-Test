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
        "The process of converting raw data into meaningful information is known as data processing. This involves several steps, including data collection, data entry, data validation, data manipulation, and data analysis. Each step is crucial for ensuring the accuracy and reliability of the final output.",

        "In computer science, an algorithm is a set of instructions for solving a problem or completing a task. Algorithms can be expressed in various forms, such as pseudocode, flowcharts, or programming languages. They are fundamental to the field of computer science and play a key role in software development.",

        "Artificial intelligence (AI) is the simulation of human intelligence by machines. It encompasses various techniques, including machine learning, natural language processing, and computer vision. AI systems are used in a wide range of applications, from virtual assistants to autonomous vehicles.",

        "A database is an organized collection of data, typically stored and accessed electronically. It consists of tables, each containing rows and columns of data. Databases are commonly used in business, education, and research to store and retrieve information efficiently.",

        "Computer networks are systems that allow computers to communicate and share resources with each other. They can be classified based on their size, scope, and topology. Common types of networks include local area networks (LANs), wide area networks (WANs), and the Internet.",

        "Encryption is the process of converting plaintext into ciphertext to protect it from unauthorized access. It involves using algorithms and keys to scramble the data in such a way that it can only be decrypted by someone with the correct key. Encryption is used to secure sensitive information, such as financial transactions and personal data.",

        "A programming language is a formal language used to write computer programs. It consists of a set of syntax rules and semantics that dictate how instructions are to be written and interpreted. Examples of programming languages include Python, Java, and C++.",

        "Cloud computing is the delivery of computing services, such as servers, storage, databases, networking, software, and analytics, over the Internet ('the cloud'). It offers scalability, flexibility, and cost-effectiveness compared to traditional on-premises solutions.",

        "A web browser is a software application used to access and view websites on the World Wide Web. It interprets HTML documents, CSS stylesheets, and JavaScript code to render web pages in a graphical user interface. Popular web browsers include Google Chrome, Mozilla Firefox, and Microsoft Edge.",

        "Machine learning is a subset of artificial intelligence that focuses on building systems that can learn from data and improve over time without being explicitly programmed. It uses algorithms to analyze and interpret data, identify patterns, and make predictions or decisions.",

        "An operating system is software that manages computer hardware and provides common services for computer programs. It controls the allocation of resources, such as memory and processing power, and provides a user interface for interacting with the system. Examples of operating systems include Windows, macOS, and Linux.",

        "Data mining is the process of discovering patterns, trends, and insights from large datasets using statistical and machine learning techniques. It is used in various fields, including business, healthcare, finance, and marketing, to extract valuable information from data.",

        "An integrated circuit (IC) is a miniature electronic circuit consisting of semiconductor devices and passive components fabricated on a single chip of semiconductor material. ICs are used in a wide range of electronic devices, from computers and smartphones to medical devices and automotive systems.",

        "Computer security, also known as cybersecurity, is the practice of protecting computer systems, networks, and data from unauthorized access, attacks, and damage. It involves implementing measures such as firewalls, antivirus software, encryption, and access controls to mitigate security risks.",

        "A compiler is a software tool that translates source code written in a high-level programming language into machine code that can be executed by a computer. It performs lexical analysis, syntax analysis, semantic analysis, optimization, and code generation to produce executable code.",

        "An optical fiber is a flexible, transparent fiber made of glass or plastic, used to transmit light signals over long distances with minimal loss of signal strength. It is widely used in telecommunications, networking, and medical imaging to transmit data at high speeds.",

        "Robotics is the branch of engineering and science that deals with the design, construction, operation, and application of robots. Robots are programmable machines capable of performing tasks autonomously or under remote control. They are used in various industries, including manufacturing, healthcare, and space exploration.",

        "A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules. It acts as a barrier between a trusted internal network and untrusted external networks, such as the Internet, to prevent unauthorized access and protect against cyber threats.",

        "Big data refers to large and complex datasets that are difficult to manage and analyze using traditional data processing techniques. It encompasses structured, semi-structured, and unstructured data from various sources, such as social media, sensors, and Internet of Things (IoT) devices.",

        "An application programming interface (API) is a set of rules, protocols, and tools that allows different software applications to communicate and interact with each other. APIs define the methods and data formats that developers can use to access the functionality of a software component or service."
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
