const App = (_ => {
  function fetchRedditAPI(postNameFromInput, howMany, sorted) {
    return fetch(
      `https://www.reddit.com/search.json?q=${postNameFromInput}&sort=${sorted}&limit=${howMany}`
    )
      .then(res => res.json())
      .then(data => data.data.children.map(object => object.data))
      .catch(err => console.log(err));
  }

  function showAlert(text, vars) {
    // UTWORZENIE DIVA
    const div = document.createElement("div");

    // DODANIE DO DIVA KLASY
    div.className = "alert";

    // DODANIE TEKSTU ALERTU
    div.appendChild(document.createTextNode(text));

    // WPROWADZENIE DIVA Z TEKSTEM POMIĘDZY KONTENER A FORMULARZ
    vars.container.insertBefore(div, vars.searchForm);

    // PO 2 SEKUNDACH ZNIKA ALERT
    setTimeout(_ => document.querySelector(".alert").remove(), 2000);
  }

  function init(_vars) {
    const vars = _vars;

    // KLIKNIĘCIE W PRZYCISK SZUKAJ
    vars.searchForm.addEventListener("submit", e => {
      // CZYSZCZENIE REZULTATÓW PRZED KAŻDYM WCIŚNIĘCIEM KLAWISZA SZUKAJ
      vars.searchResult.innerHTML =
        '<h2 class="search-result-title">Wyniki</h2>';

      // POBIERAMY DO ZMIENNEJ WARTOŚĆ Z INPUTA, KTÓRY JEST NAZWĄ POSTA
      const postNameFromInput = vars.searchInput.value;

      // POBIERAMY DO ZMIENNEJ WARTOŚĆ Z RADIO, KTÓRE JEST USTAWIONE (CHECKED)
      const sorted = document.querySelector(".sort-input:checked").value;

      // POBIERAMY DO ZMIENNEJ WARTOŚĆ Z SELECTA
      const howMany = document.querySelector(".limit-select").value;

      // JEŻELI NIE WPISALIŚMY NIC DO INPUTA POJAWIA SIĘ KOMUNIKAT O BŁĘDZIE
      if (postNameFromInput === "") {
        showAlert("Wypełnij puste pole!", vars);
      } else {
        // BOX Z WYNIKAMI STAJE SIĘ WIDOCZNY
        vars.searchResult.classList.add("visible");
      }

      // WYSZUKIWANIE POSTÓW
      const dataFromAPI = fetchRedditAPI(
        postNameFromInput,
        howMany,
        sorted
      ).then(data => {
        let resultHTML = "";

        console.log(data);

        data.forEach(post => {
          // SPRAWDZANIE CZY JEST OBRAZ. JAK NIE TO DAJ IKONĘ REDDIT
          const image = post.preview
            ? post.preview.images[0].source.url
            : "https://upload.wikimedia.org/wikipedia/en/8/82/Reddit_logo_and_wordmark.svg";

          resultHTML += `
          <div class="post-box">
            <img src="${image}" alt="" class="post-img">
            <h4 class="post-title">${post.title}</h4>
            <p class="post-text">${post.selftext}</p>
            <a href="${
              post.url
            }" class="btn-post-link" target="_blank">Więcej</a>
            <hr>
            <div class="badge-subreddit">Subreddit: ${post.subreddit}</div>
            <div class="badge-score">Punkty: ${post.score}</div>
            <hr>
            <span>Autor: <strong>${post.author}</strong></span>
          </div>
          `;
        });

        vars.searchResult.insertAdjacentHTML("beforeend", resultHTML);
      });

      e.preventDefault();
    });

    // JEŻELI INPUT BĘDZIE PUSTY ZNIKA BOX Z WYNIKAMI
    vars.searchInput.addEventListener("keyup", function() {
      if (!this.value) {
        vars.searchResult.classList.remove("visible");
        vars.searchResult.innerHTML =
          '<h2 class="search-result-title">Wyniki</h2>';
      }
    });
  }

  return {
    init
  };
})();
