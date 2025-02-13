describe('Leads Management', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/leads');
  });

  it('should display leads list', () => {
    cy.get('[data-testid="lead-table"]').should('be.visible');
    cy.get('[data-testid="lead-row"]').should('have.length.gt', 0);
  });

  it('should create new lead', () => {
    cy.get('[data-testid="add-lead-button"]').click();
    
    cy.get('[data-testid="lead-form"]').within(() => {
      cy.get('input[name="first_name"]').type('John');
      cy.get('input[name="last_name"]').type('Doe');
      cy.get('input[name="email"]').type('john@example.com');
      cy.get('input[name="phone"]').type('+1234567890');
      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="lead-row"]').should('contain', 'John Doe');
  });

  it('should edit lead', () => {
    cy.get('[data-testid="lead-row"]').first().within(() => {
      cy.get('[data-testid="edit-button"]').click();
    });

    cy.get('[data-testid="lead-form"]').within(() => {
      cy.get('input[name="first_name"]').clear().type('Jane');
      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="lead-row"]').first().should('contain', 'Jane');
  });

  it('should delete lead', () => {
    cy.get('[data-testid="lead-row"]').first().within(() => {
      cy.get('[data-testid="delete-button"]').click();
    });

    cy.get('[data-testid="confirm-delete"]').click();
    cy.get('[data-testid="lead-row"]').should('have.length.lt', 1);
  });

  it('should filter leads', () => {
    cy.get('[data-testid="search-input"]').type('John');
    cy.get('[data-testid="lead-row"]').should('have.length', 1);
  });

  it('should sort leads', () => {
    cy.get('[data-testid="sort-name"]').click();
    cy.get('[data-testid="lead-row"]').first().should('contain', 'Aaron');
  });
}); 