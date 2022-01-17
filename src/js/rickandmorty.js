// rick and morty 
window.$ = window.jQuery = require("jquery");
import 'regenerator-runtime/runtime';

const rickAndMorty = {
  apiEndpoint: 'https://rickandmortyapi.com/api/character',
  characterList: $('#rickAndMortyList'),
  charactersInput: $('#searchCharacters input[name="search-characters"]'),
  charactersSearchForm: $('form[name="search-characters"'),
  paginatePrev: $('#previousPage'),
  paginateNext: $('#nextPage'),
  totalPages: 0,
  currentCharacters: [],
  init: () => {
    // fetch characters
    rickAndMorty.fetchCharacters();

    // bind click events
    rickAndMorty.bindEvents();
  },
  bindEvents: () => {
    // delete character
    $('body').on('click', '.delete-character', (event) => {
      // prevent default click action
      event.preventDefault();

      // delete card
      rickAndMorty.deleteCharacterCard($(event.currentTarget).attr('data-character-id'));
    });

    // handle search keyup/change
    rickAndMorty.charactersInput.on('change keyup', () => {
      rickAndMorty.fetchCharacters({name: rickAndMorty.charactersInput.val()});
    });

    // handle form submission
    rickAndMorty.charactersSearchForm.on('submit', (event) => {
      // prevent default action
      event.preventDefault();
      rickAndMorty.fetchCharacters({name: rickAndMorty.charactersInput.val()});
    });

    // handle pagination
    $('#previousPage, #nextPage').on('click', (event) => {
      // prevent default behaviour
      event.preventDefault();

      // change page
      rickAndMorty.changePage(rickAndMorty.characterList.attr('data-page-number'), $(event.currentTarget).attr('data-goto'));
    });
  },
  changePage: (currentPage, goTo) => {
    // url params
    const urlParams = {};

    // handle page to go to
    switch (goTo) {
      case 'prev':
        urlParams['page'] = ( currentPage !== 1 ) ? ( parseInt(currentPage) - 1 ) : 1;
        break;
    
      case 'next':
        urlParams['page'] = ( parseInt(currentPage) + 1 );
        break;
    }

    // update current page
    rickAndMorty.characterList.attr('data-page-number', urlParams['page']);

    // update previous pagination button
    if ( urlParams['page'] !== 1 ) {
      rickAndMorty.paginatePrev.attr('aria-disabled', 'false')
        .removeAttr('tabindex')
        .parent()
        .removeClass('disabled');
    }
    else if ( urlParams['page'] === 0 || urlParams['page'] === 1 ) {
      rickAndMorty.paginatePrev.attr('aria-disabled', 'true')
        .attr('tabindex', '-1')
        .parent()
        .addClass('disabled');
    }

    // update next pagination button
    if ( urlParams['page'] !== rickAndMorty.totalPages ) {
      rickAndMorty.paginateNext.attr('aria-disabled', 'false')
        .removeAttr('tabindex')
        .parent()
        .removeClass('disabled');
    }
    else if ( urlParams['page'] === rickAndMorty.totalPages ) {
      rickAndMorty.paginateNext.attr('aria-disabled', 'true')
        .attr('tabindex', '-1')
        .parent()
        .addClass('disabled');
    }

    // append search query if available
    let searchCharacterInput = rickAndMorty.charactersInput.val();
    if ( searchCharacterInput.length ) {
      urlParams['name'] = searchCharacterInput;
    }

    // fetch characters
    rickAndMorty.fetchCharacters(urlParams);
  },
  fetchCharacters: async (urlParams = {}) => {
    // prepare query string
    let queryString = Object.keys(urlParams).length ? 
      '/?' + Object.keys(urlParams).map(key => key + '=' + urlParams[key]).join('&') : 
      '';

    // fetch characters
    await fetch(`${rickAndMorty.apiEndpoint}${queryString}`)
      .then((response) => response.json())
      .then((response) => {
        // flush characters
        rickAndMorty.flushCharacters();

        // add character results
        rickAndMorty.currentCharacters = response.results;
        rickAndMorty.totalPages = response.info.pages;

        // create card for each character
        $.each(rickAndMorty.currentCharacters, (key, character) => {
          rickAndMorty.generateCharacterCard(character);
        });
      })
      .then(() => {
        rickAndMorty.wrapRows();
      })
      .then(() => {
        rickAndMorty.handleEmpty();
      })
      .catch((response) => {
        alert('There was an error! Please check the console.');
        console.log(response);
      });
  },
  wrapRows: () => {
    // card wrappers
    let cardWrappers = $("#rickAndMortyList .card-wrapper");

    // wrap card wrappers in rows
    for(let i = 0; i < cardWrappers.length; i += 4) {
      cardWrappers.slice(i, i + 4).wrapAll('<div class="card-row row d-flex"></div>');
    }
  },
  unWrapRows: () => {
    // unwrap card wrappers
    $("#rickAndMortyList .card-wrapper").unwrap();
  },
  generateCharacterCard: (character) => {
    let characterHTML = `<div data-character-id="${character.id}" class="card-wrapper col-12 col-md-6 col-lg-3">
      <div class="card h-100">
        <a 
          href="${character.url}" 
          target="_blank" 
          rel="noopener" 
          aria-describedby="new-window-warning"
          title="${character.name}">
          <img class="card-img-top" src="${character.image}" alt="${character.name}">
          <div hidden>
            <span id="new-window-warning">Opens in a new window</span>
          </div>
        </a>
        <div class="card-body justify-content-between d-flex flex-column">
          <div class="d-flex flex-row align-items-center">
            <h5 class="card-title">${character.name}</h5>
            <div class="card-wrapper__status ${character.status.toLowerCase()}"></div>
          </div>
          <ul class="card-list d-flex flex-column">
            <li class="card-list-item d-flex flex-column">
              <label>Last location:</label> 
              ${character.location.name}
            </li>
            <li class="card-list-item d-flex flex-column">
              <label>First seen in:</label> 
              ${character.origin.name}
            </li>
            <li class="card-list-item d-flex flex-column">
              <label>Species:</label> 
              ${character.species}
            </li>
          </ul>
          <a href="#" data-character-id="${character.id}" class="btn btn-danger delete-character">Delete</a>
        </div>
      </div>
    </div>`;
    rickAndMorty.characterList.append(characterHTML);
  },
  flushCharacters: () => {
    rickAndMorty.characterList.html('');
  },
  deleteCharacterCard: (characterID) => {
    // remove character
    rickAndMorty.characterList.find(`div[data-character-id="${characterID}"]`)
      .remove();

    // un-wrap rows
    rickAndMorty.unWrapRows();
    
    // re-wrap rows
    rickAndMorty.wrapRows();

    // check empty
    rickAndMorty.handleEmpty();
  },
  handleEmpty: () => {
    if (rickAndMorty.characterList.is(':empty')) {
      rickAndMorty.characterList.html(`
        <div class="no-characters-found-row align-items-center justify-content-center d-flex">
          <h2>No Characters Found!</h2>
        </div>
      `);
    }
  }
};

export { rickAndMorty };
