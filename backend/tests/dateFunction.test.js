const { dateToStrFr, dateToStrUS } = require('../services/backoffice');


describe('Calculator tests', () => {
        it('Turn US date type to FR string type', () => {
            expect(dateToStrFr(new Date('2024-05-18'))).toBe('18/05/2024');
        });
    
        it('Turn US date type to US string type', () => {
            expect(dateToStrUS(new Date('2024-06-27'))).toBe('2024-06-27');
        });
    }
);