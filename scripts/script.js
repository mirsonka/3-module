const character = document.getElementById('character')
const mushroom = document.getElementById('mushroom')

function jump() {
  if (!character) return

  if (character.classList.contains('animate')) return
  character.classList.add('animate')
  setTimeout(() => character.classList.remove('animate'), 850)
}

window.addEventListener('click', jump)
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault()
    jump()
  }
})

let mushroomIterations = 0
let characterAnimationDuration = 0.9

const mushroomAnim =
  mushroom.getAnimations().find((a) => a.animationName === 'mushroom') ||
  mushroom.getAnimations()[0]

console.log(mushroom.getAnimations())

let mushroomRate = 1

const speedUpMushroom = () => {
  if (mushroomRate > 2) {
    window.removeEventListener('animationiteration', speedUpMushroom)
    return
  }
  mushroomIterations++
  if (mushroomIterations % 3 === 0) {
    characterAnimationDuration *= 0.95

    mushroomRate += 0.3
    mushroomAnim.updatePlaybackRate(mushroomRate)
    character.style.animationDuration = `${characterAnimationDuration}s`
  }
}

mushroom.addEventListener('animationiteration', speedUpMushroom)
