import './style.css'

const navItemFontWeightBold = "bold"
const navItemFontWeightNormal = "normal"

const app = document.querySelector('#app')

const me = document.querySelector('#me')

const projects = document.querySelector('#projects')

const mePage = `
  <div>
    <a class="avatar" href="https://github.com/shubertm" target="_blank">
      <img src="https://avatars.githubusercontent.com/u/87703131?s=400&u=e0668b4e4129b67bfc09758bb642fdaba14512f4&v=4" class="logo vanilla" alt="my avatar" />
    </a>
    <h1>Shubert Munthali</h1>
    <h2>Hello!</h2>
    <p>I am a <b>Software Engineer</b> from the other side of the earth, my interests in computing are <b>Secure P2P networks</b>, <b>Blockchain</b>, <b>Cryptography</b>, <b>Data Structures and Algorithms</b> and <b>Mobile Development</b>. I also take pleasure in exploring electronics and robotics, I mean... these sparking creations are awesome!</p>
    <p class="star-trek">
      "To boldly go where no one has gone before" - Star Trek
    </p>
    <div id="gpgDiv">
        <h4>GPG KEY:</h4>
        <p id="gpgKey">EF668CC147935682</p>
        <img class="copy-icon" id="copyGPGKey" src="./assets/copy.svg" alt="Copy"/>
    </div>
    <section id="tech-sect">
        <ul class="tech">
            <li>
                <img src="./assets/kotlin.svg" alt="Kotlin">
            </li>
            <li>
                <img src="./assets/c++.svg" alt="C++">
            </li>
            <li>
                <img src="./assets/javascript.svg" alt="Javascript">
            </li>
            <li>
                <img src="./assets/typescript.svg" alt="Typescript">
            </li>
            <li>
                <img src="./assets/python.svg" alt="Python">
            </li>
            <li>
                <img src="./assets/java.svg" alt="Java">
            </li>
            <li>
                <img id="rust" src="./assets/rust.svg" alt="Rust">
            </li>
            <li>
                <img src="./assets/android.svg" alt="Bitcoin">
            </li>
            <li>
                <img src="./assets/bitcoin.svg" alt="Bitcoin">
            </li>
            <li>
                <img src="./assets/polkadot.svg" alt="Polkadot">
            </li>
            <li>
                <img src="./assets/postgresql.svg" alt="PostgreSQL">
            </li>
            <li>
                <img src="./assets/sqlite.svg" alt="SQLite">
            </li>        
        </ul>
    </section>
  </div>
`

const projectsPage = `
        <ul class="project-list">
            <li>
                <a id="amuzic" class="project" href="https://play.google.com/store/apps/details?id=com.infbyte.amuzic">
                    <img class="project-icon" src="./assets/amuzic.svg" alt="project icon"/>
                    <p>Amuzic</p>
                    <img id="play" class="repo-host" src="./assets/play.webp" alt="google play icon"/>
                </a>
            </li>
            <li>
                <a id="amuzeo" class="project" href="https://github.com/shubertm/Amuzeo">
                    <img class="project-icon" src="./assets/amuzeo.svg" alt="project icon"/>
                    <p>Amuzeo</p>
                    <img class="repo-host" src="./assets/github.svg" alt="github icon"/>
                </a>
            </li>
            <li>
                <a id="ark-builders" class="project" href="https://github.com/ARK-Builders">
                    <img class="project-icon" src="./assets/ark-builders.svg" alt="project icon"/>
                    <p>ARK-Builders</p>
                    <img class="repo-host" src="./assets/github.svg" alt="github icon"/>
                </a>
            </li>
        </ul>
`

app.innerHTML = mePage
me.style.fontWeight = navItemFontWeightBold
projects.style.fontWeight = navItemFontWeightNormal

const copyGPGKeyButton = document.querySelector('#gpgDiv')
const currencyButtons = document.getElementsByClassName('currency')

me.addEventListener(
    'click',
    (event) => {
        me.style.fontWeight = navItemFontWeightBold
        projects.style.fontWeight = navItemFontWeightNormal
        app.innerHTML = mePage
    }
)

projects.addEventListener(
    'click',
    (event) => {
        projects.style.fontWeight = navItemFontWeightBold
        me.style.fontWeight = navItemFontWeightNormal
        app.innerHTML = projectsPage
    }
)

copyGPGKeyButton.addEventListener('click', event => {
    const keyId = copyGPGKeyButton.querySelector('p').textContent
    navigator.clipboard.writeText(keyId)
})

for (const button of currencyButtons) {
    button.addEventListener('click', () => { onClickCurrency(button) })
}

function onClickCurrency(button) {
    const address = button.querySelector('p').textContent
    navigator.clipboard.writeText(address)
}