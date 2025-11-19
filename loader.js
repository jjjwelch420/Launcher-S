import { GAMES, ROOT_URL } from 'https://cdn.statically.io/gh/jjjwelch420/Launcher-S@main/list.js';

    // Expose to global scope if needed by non-module scripts
    window.GAMES = GAMES;
    window.ROOT_URL = ROOT_URL;

    /** Build the launcher UI dynamically */
    function createLauncherUI() {
      const container = document.getElementById('launcher');

      GAMES.forEach(game => {
        const wrapper = document.createElement('div');
        wrapper.className = 'game-wrapper';

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `check-${game.id}`;
        checkbox.onchange = () => toggleGameIframe(game.id, checkbox.checked);

        // Button
        const button = document.createElement('button');
        button.className = 'fancy-button';
        button.textContent = game.label;
        button.onclick = async () => {
          let iframe = document.getElementById(`iframe-${game.id}`);
          if (!checkbox.checked) {
            checkbox.checked = true;
            iframe = await toggleGameIframe(game.id, true);
          }
          if (iframe) fullscreenGame(game.id);
        };

        wrapper.appendChild(checkbox);
        wrapper.appendChild(button);
        container.appendChild(wrapper);
      });
    }

    /** Fetch XML and extract HTML content */
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

    /** Toggle game iframe on/off */
    async function toggleGameIframe(gameId, shouldEnable) {
      const existing = document.getElementById(`iframe-${gameId}`);

      if (shouldEnable && !existing) {
        const fullURL = `${ROOT_URL}Ports/${gameId}.xml`;
        const htmlContent = await fetchHTMLFromXML(fullURL);

        const iframe = document.createElement('iframe');
        iframe.id = `iframe-${gameId}`;
        Object.assign(iframe.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          border: 'none',
          zIndex: '9999',
          display: 'none'
        });

        document.body.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(htmlContent);
        doc.close();

        return iframe;
      } else if (!shouldEnable && existing) {
        existing.remove();
        return null;
      }

      return existing;
    }

    /** Fullscreen a game iframe */
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

    // Initialize UI
    createLauncherUI();
