document.addEventListener('DOMContentLoaded', function() {
  App.init({
    container: this.querySelector('.container'),
    searchForm: this.querySelector('.box'),
    searchInput: this.querySelector('.search-input'),
    searchResult: this.querySelector('.search-result')
  });
});