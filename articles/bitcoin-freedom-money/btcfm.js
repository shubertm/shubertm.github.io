import '../style.css'
import { html } from './bitcoin-freedom-money.md';

const articleSpace = document.querySelector("#article-space");

if (!articleSpace) {
    throw new Error("Article space is missing")
}

articleSpace.innerHTML = html
