const toggleSwitch = document.querySelector('input[type="checkbox"].theme-switch');

  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
      document.documentElement.classList.add('dark');
      toggleSwitch.checked = true;
  } else {
      document.documentElement.classList.remove('dark')
  }
  function switchTheme(e) {
      if (e.target.checked) {
          localStorage.setItem('theme', 'dark');
          document.documentElement.classList.add('dark');
      } else {
          localStorage.setItem('theme', 'light');
          document.documentElement.classList.remove('dark')
      }
  }
  toggleSwitch.addEventListener('change', switchTheme, false);