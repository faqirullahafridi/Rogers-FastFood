# 🍕 Roger's Restaurant - Legendary Flavors

A modern, responsive restaurant website showcasing Roger's Restaurant's delicious menu offerings with a beautiful cream and brown color scheme.

![Roger's Restaurant](https://img.shields.io/badge/Restaurant-Website-brightgreen)
![React](https://img.shields.io/badge/React-17.0.0-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26-orange)
![CSS3](https://img.shields.io/badge/CSS3-1572B6-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## ✨ Features

- **Modern Design**: Clean, elegant interface with warm cream and brown color palette
- **Responsive Layout**: Fully responsive design that works on all devices
- **Interactive Menu**: Dynamic menu system with category tabs (Starters, Pizzas, Deals, Sauces, Add-ons)
- **High-Quality Images**: Professional food photography from Pexels for all menu items
- **Smooth Navigation**: Fixed header with smooth scrolling to sections
- **Mobile-First**: Optimized mobile experience with collapsible navigation
- **Performance Optimized**: Lazy loading images and optimized CSS for fast loading

## 🎨 Design System

### Color Palette
- **Primary**: Warm browns (`#8B7355`, `#A0522D`, `#CD853F`)
- **Background**: Cream tones (`#F5F5DC`, `#FAEBD7`, `#FFF8DC`)
- **Text**: Dark browns (`#2F2F2F`, `#5D5D5D`)
- **Accents**: Golden browns (`#D2691E`, `#F4A460`, `#DEB887`)

### Typography
- **Headings**: Space Grotesk (Modern, clean)
- **Body Text**: Inter (Highly readable)

## 🚀 Technologies Used

- **Frontend**: React 17 with JSX
- **Styling**: Modern CSS with CSS Variables and Flexbox/Grid
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter, Space Grotesk)
- **Images**: High-quality Pexels stock photos
- **Build**: Babel Standalone for JSX compilation

## 📱 Sections

### 1. Hero Section
- Eye-catching title and subtitle
- Call-to-action button
- Warm gradient background

### 2. Menu Section
- **Starters & More**: Wings, sandwiches, rolls, burgers, pasta
- **Pizzas**: Legendary flavors, special crusts, various toppings
- **Deals**: Family packages and combo offers
- **Sauces**: Mayo, spicy, BBQ options
- **Add-ons**: Cheese crust, kabab crust, extra toppings

### 3. About Us
- Restaurant story and mission
- Premium ingredients focus

### 4. Contact & Footer
- Location details
- Phone number for orders
- Operating hours
- Free home delivery information

## 🛠️ Installation & Usage

### Prerequisites
- Modern web browser
- No build tools required (uses CDN resources)

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rogers-restaurant.git
   cd rogers-restaurant
   ```

2. Open `rogers.html` in your web browser

3. Or serve locally:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

## 📁 Project Structure

```
rogers-restaurant/
├── README.md
├── rogers.html          # Main website file
├── package.json         # Dependencies (if any)
└── .gitignore          # Git ignore file
```

## 🎯 Key Features Explained

### Responsive Grid System
```css
.menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 32px;
}
```

### CSS Custom Properties
```css
:root {
    --primary-gradient: linear-gradient(135deg, #8B7355 0%, #A0522D 50%, #CD853F 100%);
    --surface: #F5F5DC;
    --text-primary: #2F2F2F;
}
```

### React State Management
```javascript
const [activeCategory, setActiveCategory] = useState('starters');
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [activeNav, setActiveNav] = useState('home');
```

## 🌟 Performance Features

- **Lazy Loading**: Images load only when needed
- **Optimized CSS**: Minimal animations and efficient selectors
- **CDN Resources**: Fast loading of external libraries
- **Responsive Images**: Optimized image sizes for different devices

## 📱 Mobile Experience

- **Collapsible Navigation**: Hamburger menu for mobile devices
- **Touch-Friendly**: Large touch targets and smooth interactions
- **Optimized Layout**: Single-column layout on small screens
- **Fast Loading**: Optimized for mobile networks

## 🔧 Customization

### Changing Colors
Update the CSS variables in the `:root` selector:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 50%, #YOUR_COLOR3 100%);
    --surface: #YOUR_BACKGROUND_COLOR;
    --text-primary: #YOUR_TEXT_COLOR;
}
```

### Adding Menu Items
Edit the `menuData` object in the JavaScript section:
```javascript
const menuData = {
    starters: [
        {
            name: "Your Item Name",
            description: "Item description",
            price: "Rs.XXX",
            image: "your-image-url"
        }
    ]
};
```

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub
2. Go to Settings > Pages
3. Select source branch
4. Your site will be available at `https://username.github.io/repository-name`

### Netlify
1. Drag and drop the `rogers.html` file
2. Your site will be deployed instantly
3. Get a custom domain option

### Vercel
1. Connect your GitHub repository
2. Deploy automatically on push
3. Get preview deployments for PRs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Images**: [Pexels](https://pexels.com) for high-quality food photography
- **Icons**: [Font Awesome](https://fontawesome.com) for beautiful icons
- **Fonts**: [Google Fonts](https://fonts.google.com) for typography
- **React**: [Facebook](https://reactjs.org) for the amazing framework

## 📞 Contact

**Roger's Restaurant**
- 📍 Location: Ibrahim Market Phase 6 Sector F3 Block 5 Shop 1
- 📞 Phone: 0332-1771772
- 🕒 Hours: Daily 11:00 AM - 11:00 PM
- 🚚 Free Home Delivery Available

---

⭐ **Star this repository if you found it helpful!**

🍕 **Order now and experience Roger's Legendary Flavors!**
