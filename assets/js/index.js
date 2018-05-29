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

  $quizGrid.addEventListener('change', e => {
    let { target } = e
    if (target.localName.toLowerCase() !== 'input') {
      return
    }

    let index = parseInt(target.getAttribute('name').replace(/^question-/, ''), 10)
    __quiz[index].Answer = target.getAttribute('value')
    checkQuizValid()
  })

  checkQuizValid()

})()