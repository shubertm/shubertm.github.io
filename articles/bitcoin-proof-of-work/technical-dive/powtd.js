import '../../style.css'
import { html } from './technical-dive.md'

const articleSpace = document.querySelector("#article-space");

if (!articleSpace) {
    throw new Error("Article space is missing")
}

articleSpace.innerHTML = html;