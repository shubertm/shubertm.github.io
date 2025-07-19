import './style.css'

const app = document.querySelector('#app')

const me = document.querySelector('#me')

const projects = document.querySelector('#projects')

const mePage = `
  <div>
    <a href="https://github.com/shubertm" target="_blank">
      <img src="https://avatars.githubusercontent.com/u/87703131?s=400&u=e0668b4e4129b67bfc09758bb642fdaba14512f4&v=4" class="logo vanilla" alt="my avatar" />
    </a>
    <h1>Shubert Munthali</h1>
    <h2>Hello!</h2>
    <p>I am a software engineer from the other side of the earth, my interests in computing are Secure P2P networks, Blockchain, Cryptography, Algorithms and Data Structures and Mobile Development.</p>
    <p class="read-the-docs">
      "To boldly go where no one has gone before" - Star Trek
    </p>
  </div>
`

const projectsPage = `
    <div>
        <h1>Projects</h1>
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