const character = document.getElementById('character')
const mushroom = document.getElementById('mushroom')
const clouds1 = document.getElementById('clouds-1')
const clouds2 = document.getElementById('clouds-2')
const closeIcon1 = document.getElementById('close-icon-1')
const guideCard = document.getElementById('guide-card')
const question1 = document.getElementById('question-1')
const inviteCard1 = document.getElementById('invite-card-1')

let questionCardOpened = false

guideCard.addEventListener('click', (e) => {
  e.stopPropagation()
})

inviteCard1.addEventListener('click', (e) => {
  e.stopPropagation()
})

question1.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  if (questionCardOpened) {
    guideCard.style.display = 'none'
    restartGame()
  } else {
    guideCard.style.display = 'block'
    gameOver = true
    clouds1Anim.pause()
    clouds2Anim.pause()
    mushroomAnim.pause()
  }

  questionCardOpened = !questionCardOpened
})

closeIcon1.addEventListener('click', (e) => {
  e.stopPropagation()
  inviteCard1.style.display = 'none'
})

window.addEventListener('click', jump)
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault()
    if (gameOver) {
      restartGame()
    } else {
      jump()
    }
  }
})

let mushroomIterations = 0
let characterAnimationDuration = 0.9

const mushroomAnim =
  mushroom.getAnimations().find((a) => a.animationName === 'mushroom') ||
  mushroom.getAnimations()[0]

const clouds1Anim = clouds1.getAnimations()[0]
const clouds2Anim = clouds2.getAnimations()[0]

let mushroomRate = 1

function jump() {
  if (!character) return

  if (character.classList.contains('animate')) return
  character.classList.add('animate')

  const handleAnimationEnd = () => {
    character.classList.remove('animate')
    character.removeEventListener('animationend', handleAnimationEnd)
  }

  character.addEventListener('animationend', handleAnimationEnd)
}

const speedUpMushroom = () => {
  if (mushroomRate > 2) {
    mushroom.removeEventListener('animationiteration', speedUpMushroom)
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

let gameOver = false

function checkCollision() {
  if (gameOver) return

  const charRect = character.getBoundingClientRect()
  const mushRect = mushroom.getBoundingClientRect()

  const charReachedMushroom = charRect.right > mushRect.left + 10

  const isColliding =
    charReachedMushroom &&
    charRect.left < mushRect.right &&
    charRect.right > mushRect.left &&
    charRect.top < mushRect.bottom &&
    charRect.bottom > mushRect.top

  if (isColliding) {
    gameOver = true
    clouds1Anim.pause()
    clouds2Anim.pause()
    mushroomAnim.pause()
    inviteCard1.style.display = 'block'
    return
  }

  requestAnimationFrame(checkCollision)
}

requestAnimationFrame(checkCollision)

function restartGame() {
  gameOver = false
  inviteCard1.style.display = 'none'

  mushroomRate = 1
  mushroomIterations = 0
  characterAnimationDuration = 1.1
  mushroomAnim.updatePlaybackRate(mushroomRate)

  mushroom.addEventListener('animationiteration', speedUpMushroom)

  mushroomAnim.currentTime = 0

  clouds1Anim.play()
  clouds2Anim.play()
  mushroomAnim.play()

  requestAnimationFrame(checkCollision)
}

// screen-2
window.addEventListener('load', () => {
  const clowCover = document.getElementById('claw-machine-img')

  const clawCanvas = document.getElementById('claw-game')
  const ctx = clawCanvas.getContext('2d')

  const baseCanvasWidth = 425
  const baseCanvasHeight = 520
  const baseClawCoverWidth = 650
  const baseTopIndent = 70
  const baseGrabDepth = 100

  const isMobile = window.innerWidth <= 768
  const resizeCoeff = isMobile ? 0.5 : 1

  clowCover.width = baseClawCoverWidth * resizeCoeff

  clawCanvas.width = baseCanvasWidth * resizeCoeff
  clawCanvas.height = baseCanvasHeight * resizeCoeff
  clawCanvas.style.top = baseTopIndent * resizeCoeff + 'px'

  class Sprite {
    constructor(position, imageSrc) {
      this.grabDepth = baseGrabDepth * resizeCoeff
      this.position = {}
      this.position.x = position.x * resizeCoeff
      this.position.y = position.y * resizeCoeff

      this.originalY = this.position.y

      this.image = new Image()
      this.image.src = imageSrc
      this.loaded = false
      this.image.onload = () => (this.loaded = true)

      this.state = 'IDLE'
    }

    render() {
      if (this.loaded)
        ctx.drawImage(
          this.image,
          this.position.x,
          this.position.y,
          this.image.width * resizeCoeff,
          this.image.height * resizeCoeff,
        )
    }

    update() {
      switch (this.state) {
        case 'IDLE':
          break
        case 'DESCENDING':
          this.position.y += 2 * resizeCoeff

          if (this.position.y >= this.originalY + this.grabDepth) {
            this.state = 'GRABBING'
            this.grabTimer = 50
          }
          break
        case 'GRABBING':
          const justGrabbedObject = this.anythingToBeGrabbed()
          if (!this.grabbedObject && justGrabbedObject) {
            this.grabbedObject = justGrabbedObject
          }

          this.grabTimer--

          if (this.grabTimer <= 0) {
            this.state = 'ASCENDING'
          }
          break
        case 'ASCENDING':
          this.position.y -= 2 * resizeCoeff

          if (this.grabbedObject) {
            this.grabbedObject.position.y -= 2 * resizeCoeff
          }

          if (this.position.y <= this.originalY) {
            this.position.y = this.originalY

            if (this.grabbedObject) {
              this.state = 'WITHDRAW'
            } else {
              this.state = 'IDLE'
            }
          }
          break
        case 'WITHDRAW':
          if (this.position.x > 0) {
            this.position.x -= 2 * resizeCoeff
            this.grabbedObject.position.x -= 2 * resizeCoeff
          } else {
            this.state = 'DROP'
          }
          break
        case 'DROP':
          if (this.grabbedObject.position.y < clawCanvas.height) {
            this.grabbedObject.position.y += 4 * resizeCoeff
          } else {
            this.state = 'IDLE'
            this.grabbedObject = null
            if (!isMobile) {
              const clawPrize = document.querySelector('.claw-prize')
              clawPrize.classList.add('show')
            }
          }
          break
      }

      this.render()
    }

    anythingToBeGrabbed() {
      const clawCenterX = this.position.x + this.image.width / 2
      for (const obj of grabbableObjects) {
        const objCenterX = obj.position.x + obj.image.width / 2
        if (
          clawCenterX > objCenterX - 15 * resizeCoeff &&
          clawCenterX < objCenterX + 15 * resizeCoeff
        ) {
          return obj
        }
      }
      return null
    }

    moveRight() {
      this.position.x += 2 * resizeCoeff
    }

    moveLeft() {
      this.position.x -= 2 * resizeCoeff
    }

    startGrab() {
      if (this.state !== 'IDLE') return

      this.state = 'DESCENDING'
    }
  }

  const claw = new Sprite({ x: 0, y: 0 }, './images/claw.svg')
  const cat1 = new Sprite({ x: 120, y: 395 }, './images/cat-1.svg')
  const cat2 = new Sprite({ x: 265, y: 360 }, './images/cat-2.svg')
  const bgContent = new Sprite(
    { x: -7, y: 417 },
    './images/claw-background-content.svg',
  )
  const bgContentTopLayer = new Sprite(
    { x: 205, y: 450 },
    './images/claw-background-content-top-layer.svg',
  )

  const grabbableObjects = [cat1, cat2]

  const keysPressed = new Set()

  window.addEventListener('keydown', (e) => {
    e.preventDefault()
    keysPressed.add(e.code)
  })

  window.addEventListener('keyup', (e) => {
    keysPressed.delete(e.code)
  })

  const updateMovement = () => {
    if (claw.state === 'IDLE') {
      if (
        keysPressed.has('ArrowRight') &&
        claw.position.x + claw.image.width * resizeCoeff <= clawCanvas.width
      ) {
        claw.moveRight()
      } else if (keysPressed.has('ArrowLeft') && claw.position.x >= 0) {
        claw.moveLeft()
      }
    }

    if (keysPressed.has('Space')) {
      claw.startGrab()
    }
  }
  const animate = () => {
    requestAnimationFrame(animate)

    ctx.clearRect(0, 0, clawCanvas.width, clawCanvas.height)

    updateMovement()

    bgContent.update()
    cat1.update()
    cat2.update()
    bgContentTopLayer.update()
    claw.update()
  }

  animate()
})

// screen-3

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

window.addEventListener('load', () => {
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
    else if (e.key === 'ArrowRight') newX++
    else if (e.key === 'ArrowUp') newY--
    else if (e.key === 'ArrowDown') newY++
    else return

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
      for (let x = 0; x < window.innerWidth; x += 250) {
        for (let y = 0; y < window.innerHeight; y += 250) {
          const randomX = Math.random() * 150 - 75
          const randomY = Math.random() * 150 - 75

          confetti({
            position: {
              x: x + randomX,
              y: y + randomY,
            },
            size: 3,
          })
        }
      }
  })
})

// screen-4

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
          const randomX = Math.random() * 150 - 75
          const randomY = Math.random() * 150 - 75

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

// screen-5

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
