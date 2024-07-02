// Fetch the sidebar HTML
fetch(chrome.runtime.getURL('sidebar.html'))
  .then(response => response.text())
  .then(data => {
    // Create a container for the sidebar
    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'sidebar';
    sidebarContainer.innerHTML = data;
    sidebarContainer.style.display = 'none'; // Initially hidden
    document.body.appendChild(sidebarContainer);

    // Load saved notes from chrome.storage
    chrome.storage.sync.get('notes', function(data) {
      const notepad = document.getElementById('notepad');
      if (data.notes) {
        notepad.value = data.notes;
      }

      // Save notes to chrome.storage when the user types
      notepad.addEventListener('input', function() {
        chrome.storage.sync.set({ notes: notepad.value });
      });
    });

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "toggleSidebar") {
        if (sidebarContainer.style.display === 'none') {
          sidebarContainer.style.display = 'flex';
          document.body.classList.add('sidebar-visible');
        } else {
          sidebarContainer.style.display = 'none';
          document.body.classList.remove('sidebar-visible');
        }
      }
    });
  })
  .catch(error => console.error('Error fetching sidebar:', error));
