/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html, js, ts, vue}", 
    "./src/**/*",
    "index.html"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-image': "url('https://images.unsplash.com/photo-1684690640456-381bc7183e86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1vZi10aGUtZGF5fHx8fGVufDB8fHx8fA%3D%3D&dpr=1&auto=format%2Ccompress&fit=crop&w=1599&h=594')",
      },
      colors: {
        'custom-gold': "#eacd76",
        'main': "#ffbf00f3", // 主色
        'accent': "#FFD785", // 副色
      },
      boxShadow: {
        // 水平, 垂直, 陰影模糊半徑, 陰影擴散半徑
        'custom-inner': "inset -2px 2px 1px 1px rgb(0 0 0 / 0.5)",
        'custom-bottom': "inset 0px -1px 1px 0px rgb(0 0 0 / 0.5)",
      },
      fontFamily:{
          /* font-family: 'EB Garamond', serif; */
        'custom-fontFamily': "EB Garamond",
      },

    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.font-condensed': {
          'font-stretch': '200%',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
  darkMode: true,
}
