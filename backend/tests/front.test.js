const { getSelectMaxValue, getSelectFirstValue } = require('../public/js/app/appScripts');

describe('getSelectMaxValue, getSelectFirstValue', () => {
    it('getSelectMaxValue: returns the maximum value from the select options', () => {
      // Créer un élément select et y ajouter des options
      document.body.innerHTML = `
        <select id="testSelect">
          <option value="10">Option 1</option>
          <option value="20">Option 2</option>
          <option value="30">Option 3</option>
        </select>
      `;
      const testSelect = document.getElementById('testSelect');
  
      // Appel de la fonction et vérification du résultat
      const maxValue = getSelectMaxValue(testSelect);
      expect(maxValue).toBe(30);
    });
  
    it('getSelectMaxValue: handles select elements with negative values', () => {
      // Test avec des valeurs négatives
      document.body.innerHTML = `
        <select id="testSelect">
          <option value="-10">Option 1</option>
          <option value="-20">Option 2</option>
          <option value="-30">Option 3</option>
        </select>
      `;
      const testSelect = document.getElementById('testSelect');
  
      // Vérifier que la valeur maximale est correctement identifiée comme -10
      const maxValue = getSelectMaxValue(testSelect);
      expect(maxValue).toBe(-10);
    });
  
    it('getSelectMaxValue: returns -Infinity for empty select elements', () => {
      // Test avec un élément select vide
      document.body.innerHTML = '<select id="testSelect"></select>';
      const testSelect = document.getElementById('testSelect');
  
      // Vérifier que le résultat est -Infinity pour un select vide
      const maxValue = getSelectMaxValue(testSelect);
      expect(maxValue).toBe(-Infinity);
    });

    it('getSelectFirstValue: returns the first value from the select options', () => {
      // Créer un élément select et y ajouter des options
      document.body.innerHTML = `
        <select id="testSelect">
          <option value="10">Option 1</option>
          <option value="20">Option 2</option>
          <option value="30">Option 3</option>
        </select>
      `;
      const testSelect = document.getElementById('testSelect');
  
      // Appel de la fonction et vérification du résultat
      const maxValue = getSelectFirstValue(testSelect);
      expect(maxValue).toBe('10');
    });

    it('getSelectFirstValue: returns false from for empty select elements', () => {
      // Créer un élément select et y ajouter des options
      document.body.innerHTML = `<select id="testSelect"></select>`;
      const testSelect = document.getElementById('testSelect');
  
      // Appel de la fonction et vérification du résultat
      const maxValue = getSelectFirstValue(testSelect);
      expect(maxValue).toBe(false);
    });
  });