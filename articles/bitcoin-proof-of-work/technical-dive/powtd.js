import 'github-markdown-css/github-markdown-dark.css'
import '../../style.css'

import { html } from './technical-dive.md'

const articleSpace = document.querySelector("#article-space");

if (!articleSpace) {
    throw new Error("Article space is missing")
}

function accommodateCodeSnippets(rawHtml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    doc.querySelectorAll('pre').forEach((preElement) => {
        const container = document.createElement('div');
        container.className = 'code-block';
        if (preElement.parentNode) {
            preElement.parentNode.insertBefore(container, preElement);
            container.appendChild(preElement);
        }
    });

    return doc.body.innerHTML;
}

articleSpace.innerHTML = `
  <div class="markdown-body">
    ${accommodateCodeSnippets(html)}
  </div>
`;
