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

const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 3, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1],
  [1, 1, 1, 2, 2, 3, 2, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1],
  [1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1],
  [1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 3, 2, 2, 1, 1],
  [0, 2, 2, 2, 1, 1, 2, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
  [1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
  [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2, 3, 2, 2, 2, 2, 2, 1, 2, 1, 1],
  [1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 3, 1, 1],
  [1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 2, 1, 1],
  [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1],
  [1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1],
  [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 3, 1, 1, 1, 1, 1, 2, 1, 1],
  [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1],
  [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1],
  [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1],
  [1, 1, 1, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 3, 2, 2, 2, 4],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

let playerX = 0
let playerY = 6
const pinkCat = document.querySelector('.pink-cat')
const cookies = document.querySelectorAll('.cookies')
const cookiesCoords = [
  [5, 3],
  [11, 1],
  [17, 5],
  [7, 6],
  [12, 8],
  [19, 9],
  [3, 12],
  [13, 15],
  [17, 19],
  [6, 19],
]

const cookiesObjects = Array.from(cookies).map((cookie, i) => {
  return {
    cookie,
    coords: cookiesCoords[i],
  }
})

window.addEventListener('resize', (e) => {})

window.addEventListener('load', (event) => {
  const labirint = document.getElementById('labirint')
  const cellWidth = labirint.clientWidth / 22
  const cellHeight = labirint.clientHeight / 21

  function renderCat() {
    pinkCat.style.position = 'absolute'
    pinkCat.style.left = playerX * cellWidth - 5 + 'px'
    pinkCat.style.top = playerY * cellHeight - 7 + 'px'
  }
  renderCat()

  for (const cookieObject of cookiesObjects) {
    const { cookie, coords } = cookieObject

    cookie.style.position = 'absolute'
    cookie.style.left = coords[0] * cellWidth - 5 + 'px'
    cookie.style.top = coords[1] * cellHeight - 7 + 'px'
  }

  const removeCookieOnCoord = (y, x) => {
    for (const cookieObject of cookiesObjects) {
      if (cookieObject.coords[0] === x && cookieObject.coords[1] === y) {
        cookieObject.cookie.remove()
      }
    }
  }

  document.addEventListener('keydown', (e) => {
    let newX = playerX
    let newY = playerY

    e.preventDefault()

    if (e.key === 'ArrowLeft') newX--
    if (e.key === 'ArrowRight') newX++
    if (e.key === 'ArrowUp') newY--
    if (e.key === 'ArrowDown') newY++

    if (newY >= 0 && newY < map.length && newX >= 0 && newX < map[0].length) {
      if (map[newY][newX] !== 1) {
        playerX = newX
        playerY = newY
        renderCat()
      }

      if (map[newY][newX] === 3) {
        removeCookieOnCoord(newY, newX)
      }
    }

    if (map[newY][newX] === 4)
      confetti({
        size: 3,
      })
  })
})

const cards = document.querySelectorAll('.game-card')
const cardsRow = document.querySelector('.cards-row')
const tamaraCard = document.getElementById('tamara')

let isAnimating = false
let stage = 'front'

cards.forEach((card) => {
  card.addEventListener('click', handleCardsClick)
})

function handleCardsClick(e) {
  const clickedCard = e.currentTarget

  if (isAnimating) return

  if (stage === 'front') {
    isAnimating = true
    for (const card of cards) {
      card.classList.remove('opened')
    }
    cardsRow.classList.add('flipped-all')

    setTimeout(async () => {
      await shuffleSequence(2)
      stage = 'shuffled'
      isAnimating = false
    }, 800)

    return
  }

  if (stage === 'shuffled') {
    isAnimating = true
    clickedCard.classList.add('opened')
    stage = 'opened'

    setTimeout(() => {
      isAnimating = false
    }, 700)
  }

  if (stage === 'opened') {
    if (clickedCard === tamaraCard) {
      for (let x = 0; x < window.innerWidth; x += 250) {
        for (let y = 0; y < window.innerHeight; y += 250) {
          const randomX = Math.random() * 90 - 45
          const randomY = Math.random() * 90 - 45

          confetti({
            position: {
              x: x + randomX,
              y: y + randomY,
            },
            size: 3,
          })
        }
      }
    }
    setTimeout(() => {
      stage = 'front'
      for (const card of cards) {
        card.classList.add('opened')
      }
    }, 3000)
  }
}

async function shuffleSequence(times = 4) {
  for (let i = 0; i < times; i++) {
    await animatedShuffle()
  }
}

function animatedShuffle() {
  return new Promise((resolve) => {
    const cards = Array.from(document.querySelectorAll('.game-card'))

    const firstRects = new Map()
    cards.forEach((card) => {
      firstRects.set(card, card.getBoundingClientRect())
    })

    const shuffled = [...cards]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    shuffled.forEach((card) => {
      cardsRow.appendChild(card)
    })

    const lastRects = new Map()
    shuffled.forEach((card) => {
      lastRects.set(card, card.getBoundingClientRect())
    })

    shuffled.forEach((card) => {
      const first = firstRects.get(card)
      const last = lastRects.get(card)

      const dx = first.left - last.left
      const dy = first.top - last.top

      card.style.transition = 'none'
      card.style.transform = `translate(${dx}px, ${dy}px)`
    })

    requestAnimationFrame(() => {
      shuffled.forEach((card) => {
        card.style.transition = 'transform 0.6s ease'
        card.style.transform = 'translate(0, 0)'
      })

      setTimeout(() => {
        resolve()
      }, 650)
    })
  })
}

const fish = document.querySelector('.last-fish')
const pupils = document.querySelector('.pupils')

let currentX = 0
let targetX = 0

window.addEventListener('load', () => {
  if (!fish || !pupils) return
  requestAnimationFrame(trackFish)
})

function trackFish() {
  if (!fish || !pupils) return

  const fishRect = fish.getBoundingClientRect()
  const pupilsRect = pupils.getBoundingClientRect()

  const fishCenterX = fishRect.left + fishRect.width / 2
  const fishCorrectedX = fishCenterX - 300
  const pupilsCenterX = pupilsRect.left + pupilsRect.width / 2 - currentX

  const deltaX = fishCorrectedX - pupilsCenterX

  const strength = 0.1
  const maxLeftOffset = 45

  targetX = deltaX * strength

  targetX = Math.min(0, targetX)

  targetX = Math.max(-maxLeftOffset, targetX)

  currentX += (targetX - currentX) * 0.12

  pupils.style.transform = `translateX(${currentX}px)`

  requestAnimationFrame(trackFish)
}
