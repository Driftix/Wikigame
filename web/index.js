
import {loadGame} from './js-file';
let load = document.getElementById("load");


load.onclick = async function () {
    console.log("click");
    loadGame();
}