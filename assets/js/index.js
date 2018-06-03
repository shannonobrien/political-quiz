(() => {
  'use strict'

  let $ = document.querySelector.bind(document)
  let $$ = _ => [...document.querySelectorAll(_)]

  let $submitButton = $('.submit-button')
  let $quizGrid = $('.quiz-grid')

  let quizValid = false

  function checkQuizValid () {
    quizValid = __quiz.every(_ => _.Answer)
    $submitButton.disabled = !quizValid
  }

  function persistToStorage () {
    localStorage.answers = JSON.stringify(__quiz.map(_ => _.Answer))
  }

  function restoreFromStorage () {
    if (!localStorage.answers) {
      return
    }
    let answers = JSON.parse(localStorage.answers)
    if (answers.length !== __quiz.length) { // maybe these questions will change at some point, who knows
      return
    }
    for (let i = 0; i < answers.length; i++) {
      let answer = answers[i]
      if (!answer) {
        continue
      }
      __quiz[i].Answer = answer
      $(`.quiz-radio-option-${answer} > input[name="question-${i + 1}"]`).checked = true
    }
  }

  function clearStorage () {
    delete localStorage.answers
  }

  function calculateResult () {

    const getPoints = _ => {
      switch (_.Answer) {
        case 'strongly-oppose':
          return -2 * _.Points
        case 'oppose':
          return -1 * _.Points
        case 'support':
          return 1 * _.Points
        case 'strongly-support':
          return 2 * _.Points
        case 'neutral':
        default:
          return 0
      }
    }

    const getSocial = _ => _.Axis === 'Social'
    const getEconomic = _ => _.Axis === 'Economic'

    const add = (a, b) => a + b

    let socialScore = __quiz.filter(getSocial).map(getPoints).reduce(add, 0)
    let economicScore = __quiz.filter(getEconomic).map(getPoints).reduce(add, 0)
    let socialTotal = __quiz.filter(getSocial).length * 2
    let economicTotal = __quiz.filter(getEconomic).length * 2

    let socialNormalizedScore = socialScore / socialTotal
    let economicNormalizedScore = economicScore / economicTotal

    alert(`You scored ${socialNormalizedScore} on the social axis and ${economicNormalizedScore} on the economic axis`)
  }

  $quizGrid.addEventListener('change', e => {
    let { target } = e
    if (target.localName.toLowerCase() !== 'input') {
      return
    }

    let index = parseInt(target.getAttribute('name').replace(/^question-/, ''), 10) - 1
    __quiz[index].Answer = target.getAttribute('value')
    persistToStorage()
    checkQuizValid()
  })

  $submitButton.addEventListener('click', e => {
    let result = calculateResult()
  })

  restoreFromStorage()
  checkQuizValid()
})()