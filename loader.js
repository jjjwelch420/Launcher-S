function createLauncherUI() {
  const container = document.getElementById('launcher');
  games.forEach(game => {
    const wrapper = document.createElement('div');
    wrapper.className = 'game-wrapper';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `check-${game.id}`;
    checkbox.onchange = () => toggleGameIframe(game.id, checkbox.checked);

    const button = document.createElement('button');
    button.className = 'fancy-button';
    button.textContent = game.label;
    button.onclick = async () => {
  if (!checkbox.checked) {
    checkbox.checked = true;
    await toggleGameIframe(game.id, true); // wait for iframe creation
  }

  // Now the iframe should exist
  fullscreenGame(game.id);
};

    wrapper.appendChild(checkbox);
    wrapper.appendChild(button);
    container.appendChild(wrapper);
  });
}


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

    async function toggleGameIframe(gameId, shouldEnable) {
  const existing = document.getElementById(`iframe-${gameId}`);
  if (shouldEnable && !existing) {
    const fullURL = ROOT_URL + 'Ports/' + gameId + '.xml';
    const htmlContent = await fetchHTMLFromXML(fullURL);

    const iframe = document.createElement('iframe');
    iframe.id = `iframe-${gameId}`;
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Wait a tick to ensure iframe is in the DOM
    setTimeout(() => {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(htmlContent);
      doc.close();
    }, 0);
  } else if (!shouldEnable && existing) {
    existing.remove();
  }
}




    function fullscreenGame(gameId) {
      const iframe = document.getElementById(`iframe-${gameId}`);
      if (!iframe) {
        alert('Enable the checkbox first to load this game.');
        return;
      }

      iframe.style.display = 'block';
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }

      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
          iframe.style.display = 'none';
        }
      });
    }
    createLauncherUI();