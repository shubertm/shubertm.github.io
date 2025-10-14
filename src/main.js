import './style.css'

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
    <p>I am a software engineer from the other side of the earth, my interests in computing are Secure P2P networks, Blockchain, Cryptography, Algorithms and Data Structures and Mobile Development. I also take pleasure in exploring electronics and robotics, I mean... these sparking creations are awesome!</p>
    <p class="read-the-docs">
      "To boldly go where no one has gone before" - Star Trek
    </p>
  </div>
`

const projectsPage = `
    <div class="projects-container">
        <h1>Some things in my collection</h1>
        <ul class="project-list">
            <li>
                <a id="amuzic" class="project" href="https://play.google.com/store/apps/details?id=com.infbyte.amuzic">
                    <img class="project-icon" src="./../public/assets/amuzic.svg" alt="project icon"/>
                    <p>Amuzic</p>
                    <img id="play" class="repo-host" src="./../public/assets/play.webp" alt="google play icon"/>
                </a>
            </li>
            <li>
                <a id="amuzeo" class="project" href="https://github.com/shubertm/Amuzeo">
                    <img class="project-icon" src="./../public/assets/amuzeo.svg" alt="project icon"/>
                    <p>Amuzeo</p>
                    <img class="repo-host" src="./../public/assets/github.svg" alt="github icon"/>
                </a>
            </li>
        </ul>
    </div>
`

app.innerHTML = mePage

me.addEventListener(
    'click',
    (event) => {
        app.innerHTML = mePage
    }
)

projects.addEventListener(
    'click',
    (event) => {
        app.innerHTML = projectsPage
    }
)