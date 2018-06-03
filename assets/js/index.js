(() => {
  'use strict'

  let $ = document.querySelector.bind(document)
  let $$ = _ => [...document.querySelectorAll(_)]

  let $submitButton = $('.submit-button')
  let $quizGrid = $('.quiz-grid')

  let quizValid = false

  function checkQuizValid () {
    quizValid = __quiz.every(_ => _.Answer)
    $submitButton.setAttribute('disabled', quizValid)
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
      $(`.quiz-radio-option-${answer} > input[name="question-${i + 1}"]`).setAttribute('checked', true)
    }
  }

  function clearStorage () {
    delete localStorage.answers
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

  restoreFromStorage()
  checkQuizValid()

})()