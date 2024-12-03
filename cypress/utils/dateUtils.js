export const selectDate = (targetMonth, targetYear, targetDay, $inputElement) => {
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	
	const selectDateInternal = () => {
		cy.get('.react-datepicker__current-month').should('be.visible').then(($currentMonth) => {
			const [currentMonthText, currentYear] = $currentMonth.text().trim().split(' ');
			const currentMonthIndex = months.indexOf(currentMonthText);
			const targetMonthIndex = months.indexOf(targetMonth);

			if (currentYear !== targetYear || currentMonthIndex !== targetMonthIndex) {
				const isNext = (parseInt(targetYear) > parseInt(currentYear)) || 
							   (targetYear === currentYear && targetMonthIndex > currentMonthIndex);
				const navigationSelector = isNext ? '.react-datepicker__navigation--next' : '.react-datepicker__navigation--previous';
				
				cy.get(navigationSelector).should('be.visible').click({force: true});
				cy.wait(300);
				selectDateInternal();
			} else {
				cy.get('.react-datepicker__day').not('.react-datepicker__day--outside-month').contains(new RegExp(`^${targetDay}$`)).click();
			}
		});
	};

	// Open the datepicker
	cy.wrap($inputElement).click();

	// Start the date selection process
	selectDateInternal();
};
