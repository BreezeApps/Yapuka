module.exports = {
    activate({ overrideFunction, getConfigs, setConfig }) {
        const pluginName = 'testPlugin';
    
        // Obtenir les configurations du plugin
        getConfigs(pluginName).catch(err => console.error('Erreur de récupération des configs:', err));
    
        // Définir ou mettre à jour une configuration
        setConfig(pluginName, 'option1', 'Option de test pour le plugin', 'true')
          .catch(err => console.error('Erreur de mise à jour de config:', err));
      },
  
    modifyRenderer() {
      // Code JS à injecter pour modifier le front-end
      return `
        // Ajout d'un élément au DOM
        const newDiv = document.createElement('div');
        newDiv.textContent = 'Contenu ajouté par le plugin Test';
        newDiv.style.position = 'fixed';
        newDiv.style.bottom = '20px';
        newDiv.style.right = '20px';
        newDiv.style.backgroundColor = '#ffeb3b';
        newDiv.style.padding = '10px';
        newDiv.style.borderRadius = '5px';
        document.body.appendChild(newDiv);
  
        // Remplacement d'une fonction existante
        const originalAlert = window.alert;
        window.alert = function(message) {
          console.log('Alert intercepté par le plugin:', message);
          originalAlert('Plugin Test : ' + message);
        };
      `;
    },
  
    deactivate() {
      console.log('Test Plugin désactivé');
    }
  };
  