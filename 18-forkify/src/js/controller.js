import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update result View to mark selected search result
    resultsView.update(model.getSearchResultPage());

    //1) Updating bookmarks view
    bookmarkView.update(model.state.bookmarks);

    // 2) Load The Recipe
    await model.loadRecipe(id);

    // 3) Render the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load Search results
    await model.loadSearchResults(query);

    // 3) Render Results

    resultsView.render(model.getSearchResultPage());

    // 4) Render the pagination Buttons
    paginationView.render(model.state.search);

    /////////////////////////////////
    /////////////////////
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render New  Results
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2) Render the New pagination Buttons
  paginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  // update the recipe serving (in STATE)
  model.updateServing(newServing);

  // Uodate recipe VIEW
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  //2) Update Recpie View
  recipeView.update(model.state.recipe);

  //3) Rendr BookMarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookMarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipeData = async function (newReipe) {
  try {
    // render a spinner
    addRecipeView.renderSpinner();
    // Upload the new Recipe data
    await model.uploadRecipe(newReipe);
    console.log(model.state.recipe);

    //Render Recipe
    recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    //Render Bookmark View
    bookmarkView.render(model.state.bookmarks);

    // Change ID in URL

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close Window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🔥💩', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookMarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServing(controlServing);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipeData);
};

init();
