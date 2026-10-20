// Dark mode toggle
function initDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  
  if (!darkModeToggle) return;

  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
    updateDarkModeIcon(true);
  }

  darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateDarkModeIcon(isDark);
  });
}

function updateDarkModeIcon(isDark) {
  const icon = document.querySelector('#darkModeToggle svg');
  if (!icon) return;
  
  if (isDark) {
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
  } else {
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
  }
}

// Bookmark functionality
async function toggleBookmark(projectId, button) {
  try {
    const response = await fetch(`/projects/${projectId}/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      // Update button appearance
      if (data.bookmarked) {
        button.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>';
        button.classList.add('text-yellow-500');
      } else {
        button.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>';
        button.classList.remove('text-yellow-500');
      }
    }
  } catch (error) {
    console.error('Bookmark error:', error);
  }
}

// Mark notification as read
async function markNotificationRead(notificationId) {
  try {
    await fetch(`/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Mark read error:', error);
  }
}

// Confirm delete
function confirmDelete(message) {
  return confirm(message || 'Are you sure you want to delete this? This action cannot be undone.');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  
  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  });
});
