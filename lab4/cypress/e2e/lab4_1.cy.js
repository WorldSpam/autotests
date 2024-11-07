describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://suninjuly.github.io/math.html')

    cy.get('#input_value').invoke('text').then((x) => {// get x in frm of text inside #input_value
      const result = Math.log(Math.abs(12*Math.sin(Number(x)))) //calculate result
      cy.get('#answer').type(result.toString()) // type result in #answer
    })

    cy.get('#robotCheckbox').click() // click checkbox
    cy.get('#robotsRule').click() // click radio button
    cy.get('button[type="submit"]').click() // click submit
  })
})