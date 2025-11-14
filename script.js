/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");

    // Initialize the game
    checkUsername(); 
    displayQuestions();
    displayScores();

    /**
     * Fetches trivia questions from the API and displays them.
     */
    async function fetchQuestions() {
        showLoading(true); // Show loading state
        try {
            const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            if (!response.ok) {
                throw new Error(`HTTP Error: status: ${response.status}`);
            }
            showLoading(false)
            return response.json()
        } catch (error) {
            //  Error handling: log the error message
            console.error("Failed to fetch data", error.message);
            showLoading(false)
        }
    }

    /**
     * Toggles the display of the loading state and question container.
     *
     * @param {boolean} isLoading - Indicates whether the loading state should be shown.
     */
    function showLoading(isLoading) {
        document.getElementById("loading-container").className = isLoading
            ? ""
            : "hidden";
        document.getElementById("question-container").className = isLoading
            ? "hidden"
            : "";
    }

    /**
     * Displays fetched trivia questions.
     * @param {Object[]} questions - Array of trivia questions.
     */
    async function displayQuestions() {

        const questions = await fetchQuestions();
        console.log(questions.results)
        questionContainer.innerHTML = ""; // Clear existing questions
        questions.results.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(
                question.correct_answer,
                question.incorrect_answers,
                index
            )}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }

    /**
     * Creates HTML for answer options.
     * @param {string} correctAnswer - The correct answer for the question.
     * @param {string[]} incorrectAnswers - Array of incorrect answers.
     * @param {number} questionIndex - The index of the current question.
     * @returns {string} HTML string of answer options.
     */
    function createAnswerOptions(
        correctAnswer,
        incorrectAnswers,
        questionIndex
    ) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
            () => Math.random() - 0.5
        );
        return allAnswers
            .map(
                (answer) => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${answer === correctAnswer ? 'data-correct="true"' : ""
                    }>
                ${answer}
            </label>
        `
            )
            .join("");
    }

    // Event listeners for form submission and new player button
    form.addEventListener("submit", handleSubmitButton) 

    function handleSubmitButton(event){
        event.preventDefault();

        const usernameInput = document.getElementById("username");
        const playerName = usernameInput.value.trim() || getUsername("username");

        if (!playerName) {
            alert("Please enter a username!");
            return;
        }

        // Store username if new player
        if (!getUsername("username")) {
            storeUsername(playerName);
        }

        // Hide username input, show New Player button
        usernameInput.classList.add("hidden");
        newPlayerButton.classList.remove("hidden");

        // Calculate and save score
        const score = calculateScores();
        saveScore(playerName, score);

        // Update score table
        displayScores();

        // Load new questions
        displayQuestions();
    }

    newPlayerButton.addEventListener("click", () => {
    // Delete username cookie
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

    // Reset input field
    const usernameInput = document.getElementById("username");
    usernameInput.value = "";
    usernameInput.classList.remove("hidden");

    // Hide "New Player" button
    newPlayerButton.classList.add("hidden");

    console.log("New player session started. Enter a new username.");

    // Refresh score table and questions
    // Will still show previous scores
    displayScores();   
    // New set of trivia for the new player
    displayQuestions(); 
    });

    function storeUsername(name){
        if(name.trim() !== ""){
            document.cookie = `username=${name}; expires=${new Date(2025, 10, 20).toUTCString()}; path=/`;
        }
        else {
        console.warn("Invalid player name — cookie not set.");
    }
    }
    function getUsername(name){
        const cookies = document.cookie.split(";")
        for(const cookie of cookies){
            const[key,value] = cookie.split("=");
            if(key.trim() === name){
                return value.trim()
            }
        }
        return null;
    }
    function checkUsername(){
        const usernameInput = document.getElementById("username")
        const username = getUsername("username")
        if(username){
            usernameInput.classList.add("hidden")
            newPlayerButton.classList.remove("hidden")
            console.log(`THIS USERNAME ALREADY EXISTS.`)
    
        }else{
            usernameInput.classList.remove("hidden")
            newPlayerButton.classList.add("hidden")
        }
    }

    function calculateScores(){
        let score = 0;
        const questions = questionContainer.querySelectorAll("div");
        questions.forEach((question) => {
            const selected = question.querySelector("input[type='radio']:checked");
            if (selected && selected.dataset.correct === "true") {
            score += 1;
            }
        })
        return score; 


    }
    function saveScore(playerName, score){
        if (!playerName) return;
        // Gets the Existing scores using local storage.
        const scores = JSON.parse(localStorage.getItem("triviaScores")) || [];
        // to add new storage 
        scores.push({ name: playerName, score: score });
        localStorage.setItem("triviaScores", JSON.stringify(scores));
    }

    function displayScores() {
    const tbody = document.querySelector("#score-table tbody");
    // to clear existing rows
    tbody.innerHTML = ""; 
    // gets scores
    const scores = JSON.parse(localStorage.getItem("triviaScores")) || [];
    // Populate the table 
    scores.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${entry.name}</td><td>${entry.score}</td>`;
        tbody.appendChild(row);
    });
}

});