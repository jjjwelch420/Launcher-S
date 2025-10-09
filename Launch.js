 
    const ROOT_URL = 'https://jjjwelch420.github.io/Launcher/';

    async function fetchHTMLFromXML(url) {
      try {
        const response = await fetch(url);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        const contentNode = xmlDoc.querySelector('Content');
        return contentNode?.textContent || '<p>Error loading content</p>';
      } catch (error) {
        console.error('Failed to fetch XML:', error);
        return '<p>Failed to load XML content</p>';
      }
    }

    async function loadFile(relativePath) {
      const fullURL = ROOT_URL + relativePath;
      const htmlContent = await fetchHTMLFromXML(fullURL);
      const newTab = window.open('about:blank', '_blank');
      if (newTab) {
        newTab.document.open();
        newTab.document.write(htmlContent);
        newTab.document.close();
      } else {
        alert('Popup blocked. Please allow popups for this site.');
      }
    }
