
let currentAudio = "";
function search() {
    async function run() {
        let content = document.querySelector(".content");
        content.style.display = "block"
        let input = document.querySelector("input").value.trim();
        let word = document.querySelector("h1");
        let speech = document.querySelector("#speech");
        let phonetic = document.querySelector("#phonetic");
        let definition = document.querySelector("#definition");
        let exm = document.querySelector("#example");

        if (!input) {
            content.innerHTML = "<h1 class='message'>Please enter a word</h1>";
            return;
        }

        try {
            let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`);
            let data = await response.json();

            word.innerText = data[0].word;
            speech.innerText = data[0].meanings[0].partOfSpeech;
            definition.innerText = data[0].meanings[0].definitions[0].definition;
            phonetic.innerText = data[0].phonetic ?? "N/A";

            // Example check
            if (data[0].meanings[0].definitions[0].example) {
                exm.innerText = data[0].meanings[0].definitions[0].example;
            } else {
                exm.innerText = "Example is not available for this word";
            }

            // Get first available audio
            let audioUrl = "";
            for (let i = 0; i < data[0].phonetics.length; i++) {
                if (data[0].phonetics[i].audio) {
                    audioUrl = data[0].phonetics[i].audio;
                    break;
                }
            }

            // Create or update audio object
            if (audioUrl) {
                currentAudio = new Audio(audioUrl);
            } else {
                currentAudio = "";
            }
            document.querySelector("input").value = "";
        } catch (err) {
            content.innerHTML = "<h1 class='message'>Invalid word</h1>";
            console.error(err);
        }
    }

    run();
}


document.querySelector("i").addEventListener("click", () => {
    if (currentAudio) {
        currentAudio.play();
    } else {
        alert("No audio available for this word.");
    }
});
