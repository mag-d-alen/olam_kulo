/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-app': 'var(--bg-app)',
        'bg-dark': 'var(--bg-dark)',
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',


        'text-default': 'var(--text-default)',
        'text-on-dark': 'var(--text-on-dark)',

        'color-green': 'var(--color-green)',
        'color-orange': 'var(--color-orange)',
        'color-tan': 'var(--color-tan)',
      },
      height: {
        'header': 'var(--header-height)',
        'footer': 'var(--footer-height)',

      },
     
      
  

        
   




      //   'bg-surface-muted': 'var(--bg-surface-muted)',
      //   'border-default': 'var(--border-default)',
      //   'border-strong': 'var(--border-strong)',
      //   'divider': 'var(--divider)',
      //   'link-default': 'var(--link-default)',
      //   'link-hover': 'var(--link-hover)',
      //   'link-active': 'var(--link-active)',
      //   'link-visited': 'var(--link-visited)',
      //   'text-primary': 'var(--text-primary)',
      //   'text-secondary': 'var(--text-secondary)',
      //   'text-muted': 'var(--text-muted)',
      //   'text-on-dark': 'var(--text-on-dark)',
      //   'text-on-dark-muted': 'var(--text-on-dark-muted)',
      //   'gunmetal': 'var(--gunmetal)',
      //   'tan': 'var(--tan)',
      //   'orange': 'var(--orange)',
      //   'green': 'var(--green)',
      //   'bg-app': 'var(--bg-app)',
      //   'bg-surface': 'var(--bg-surface)',
      // },
    },

  },
  plugins: [],
}
