// load dependencies
window.$ = window.jQuery = require("jquery");
import { rickAndMorty } from './rickandmorty';

$(() => {
  // initalize
  rickAndMorty.init();
});
