require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import List from "./model/List.js";
import * as listView from "./view/listView";
import Like from "./model/Like.js";
import * as likesView from "./view/likesView.js";
import {
  renderRecipe,
  clearRecipe,
  highlightSelectedRecipe,
} from "./view/recipeView.js";

/*
web app төлөв
--Хайлтын үр дүн
-- Тухайн үзүүлж байгаа жор
-- Таалагдсан жорууд
-- Захиалж байгаа жорын найрлаганууд
*/

const state = {};

/*
// Хайлтын контроллер = Model ==> Controller <== View 
*/
const controlSearch = async () => {
  // 1. вебээс хайлтын түлхүүр үгийг гаргаж авна.
  const query = searchView.getInput();
  // 2. Шинээр хайлтын обьектийг үүсгэж өгнө.
  if (query) {
    // 2. Шинээр хайлтын обьектийг үүсгэж өгнө.
    state.search = new Search(query);

    // 3. Хайлт хийхэд зориулж дэлгэцийг UI бэлтгэнэ
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResultDiv);
    // 4. Хайлтыг гүйцэтгэнэ.
    await state.search.doSearch();

    // 5. Хайлтын үр дүнг дэлгэцэнд үзүүлнэ.
    clearLoader();
    if (state.search.result === undefined) alert("Хайлтаар илэрцгүй...");
    else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.pageButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const gotoPageNumber = parseInt(btn.dataset.goto, 10);
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

/*
// Жорын контроллер
*/
const controlRecipe = async () => {
  // 1 URL-aas ID-g salgaj awna.
  const id = window.location.hash.replace("#", "");

  // URL deer ID baigaa uguig shalgana
  if (id) {
    // 2 Joriin modeliig uusgej ugnu.
    state.recipe = new Recipe(id);
    // 3 UI delgetsiig beltgene.
    clearRecipe();
    renderLoader(elements.recipeDiv);
    highlightSelectedRecipe(id);

    //  4 joroo tataj awch irne.
    await state.recipe.getRecipe(id);

    // 5 Joriig guitsetgeh hugatsaa bolon ortsiig tootsoolno.
    clearLoader();
    state.recipe.calcTime();
    state.recipe.calcServes();
    // 6 joroo delgetsend gargana.
    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
};

// window.addEventListener("hashchange", "load", controlRecipe);
// window.addEventListener("load", controlRecipe);

["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);

window.addEventListener("load", (e) => {
  if (!state.likes) state.likes = new Like();

  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

  state.likes.likes.forEach((like) => likesView.renderLike(like));
});
// Nairlaganii controller

const controlList = () => {
  // nairlaganii modeliig uusgene
  state.list = new List();
  // umnun haragdaj bsan nairlaganuudiig tsewerlene
  listView.clearItems();
  // ug model ruu odoo haragdaj baigaa jornii but nairlagiig awch hiine

  state.recipe.ingredients.forEach((n) => {
    // tuhain nairlagiig model ruu hiine
    const item = state.list.addItem(n);

    //  tuhain nairlagiig delgetsend gargana
    listView.renderItem(item);
  });
};

const controlLike = () => {
  // 1 taalagdsan joriin modeliig uusgene
  if (!state.likes) state.likes = new Like();
  // 2 odoo haragdaj bui joriin idg olj awah
  const currentRecipeId = state.recipe.id;
  //3 ene jor taalagdsan esehiig shalgah
  if (state.likes.isLiked(currentRecipeId)) {
    // taalagdsan bol butsaad awj
    state.likes.deleteLike(currentRecipeId);
    // taalagdsan tsesnees ustgana
    likesView.deleteLike(currentRecipeId);
    // taalagdsan baidliig boliulah
    likesView.toggleLikeBtn(false);
  } else {
    // songogdoogui bol taalagdsan tsesluu nemne
    const newLike = state.likes.addLike(
      currentRecipeId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.image_url
    );

    // taalagdsan tsesend taalagdsang oruulah
    likesView.renderLike(newLike);
    // taalagdsan bolgoh
    likesView.toggleLikeBtn(true);
  }

  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn * ")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

elements.shoppingList.addEventListener("click", (e) => {
  // jagsaaltaas daragsan zuiliin data-itemid-g shuuj gargaj awah
  const id = e.target.closest(".shopping__item").dataset.itemid;
  // oldson id tei ortsiig modeloos ustgana
  state.list.deleteItem(id);
  // delgetsees iim ID-tei ortsiig bas ustgana.
  listView.deleteItem(id);
});
