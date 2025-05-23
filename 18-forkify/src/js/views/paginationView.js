import View from './View';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const pageToGo = +btn.dataset.goto;
      handler(pageToGo);
    });
  }

  _generateMarkUp() {
    const currentPage = this._data.page;
    const numsPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other page
    if (currentPage === 1 && numsPages > 1) {
      return `
      <button data-goto = "${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}icon-arrow-right"></use>
          </svg>
      </button>
      `;
    }
    // Last Page
    if (currentPage === numsPages && numsPages > 1) {
      return `
      <button data-goto = "${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
      </button>`;
    }
    // Other Page
    if (currentPage < numsPages) {
      return `
      <button data-goto = "${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
      </button> 
      <button data-goto = "${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
      `;
    }
    // Page 2, and there is no other page
    return '';
  }
}

export default new PaginationView();
