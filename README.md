# Personal Website - Viet Anh

A modern, anime-themed personal website with liquid glass design, falling snow effects, and background music controls.

## Features

### 🎨 Design & UI
- **Liquid Glass Design**: Modern glass morphism with blur effects
- **Anime Aesthetic**: Purple/pink color scheme with anime-inspired elements
- **Responsive Design**: Works on all devices from mobile to desktop
- **Multiple Themes**: Default, Sakura (pink), and Cyber (green) themes

### ❄️ Effects & Animations
- **Falling Snow**: Custom snow animation with performance optimization
- **Interactive Cards**: Hover effects with glass morphism
- **Smooth Transitions**: CSS animations and transitions throughout

### 🎵 Audio Features
- **Background Music**: Multiple tracks with play/pause/next controls
- **Volume Control**: Slider with percentage display
- **Auto-resume**: Remembers playback state between sessions

### ⚙️ Settings & Controls
- **Settings Menu**: Toggle snow effects, glass effects, and performance mode
- **Theme Switcher**: Change between different color themes
- **Performance Mode**: Reduce effects for better battery life
- **Keyboard Shortcuts**: Quick access to common functions

### 🔗 Social Integration
- **Social Media Links**: Instagram, Facebook, Discord, Twitter, Spotify, SoundCloud
- **GitHub Integration**: Link to GitHub profile with project display
- **Skills Showcase**: Interactive skills and interests section

### 🚀 Performance & Optimization
- **PWA Support**: Install as app on mobile/desktop
- **Offline Support**: Works without internet connection
- **Service Worker**: Intelligent caching strategy
- **CDN Usage**: Fonts and libraries from CDN for faster loading
- **Lazy Loading**: Images and resources loaded on demand
- **Cache Management**: Automatic cache cleanup and updates

## Technical Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern features (CSS Grid, Flexbox, Custom Properties)
- **JavaScript (ES6+)**: Modular classes with modern syntax
- **Three.js**: For advanced snow animations (optional)

### Performance
- **Service Worker**: For offline functionality and caching
- **Web App Manifest**: PWA installation support
- **Optimized Assets**: Minified and compressed where possible
- **CDN Delivery**: External resources from reliable CDNs

### Development
- **Modular Architecture**: Separate JS files for different features
- **Object-Oriented**: Class-based JavaScript for maintainability
- **Local Storage**: User settings persistence
- **Error Handling**: Graceful degradation and error recovery

## Project Structure

```
personal-website/
├── index.html              # Main HTML file
├── offline.html           # Offline fallback page
├── manifest.json          # PWA manifest
├── service-worker.js      # Service worker for caching
├── README.md             # This file
├── assets/
│   ├── css/
│   │   ├── style.css     # Main styles
│   │   └── snow.css      # Snow animation styles
│   ├── js/
│   │   ├── main.js       # Main application controller
│   │   ├── snow.js       # Snow animation manager
│   │   └── music.js      # Music player manager
│   ├── images/           # Image assets
│   └── music/            # Background music files
└── fonts/                # Custom fonts (if any)
```

## Installation & Setup

### Local Development
1. Clone the repository or extract the files
2. Open `index.html` in a modern web browser
3. No build process required - it's pure HTML/CSS/JS

### Web Server Deployment
1. Upload all files to your web server
2. Ensure proper MIME types are set
3. Access via your domain name

### PWA Installation
1. Visit the website in Chrome/Edge/Safari
2. Click "Install" when prompted (desktop) or "Add to Home Screen" (mobile)
3. The app will be installed with offline capabilities

## Configuration

### Customization
1. **Personal Info**: Edit `index.html` to update name, bio, and social links
2. **Themes**: Modify CSS variables in `style.css` for custom themes
3. **Music**: Add/remove tracks in `music.js` `musicTracks` array
4. **Colors**: Update CSS custom properties in `:root` selectors

### Performance Tuning
1. **Snow Density**: Adjust `maxFlakes` in `snow.js`
2. **Cache Strategy**: Modify `service-worker.js` caching rules
3. **Lazy Loading**: Configure in `main.js` `lazyLoadImages()` function

## Browser Support

- **Chrome 80+** (Recommended)
- **Firefox 75+**
- **Safari 13+**
- **Edge 80+**
- **Mobile browsers** (iOS Safari, Chrome for Android)

## Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)
- **Bundle Size**: < 500KB (excluding external CDN resources)

## Accessibility

- **WCAG 2.1 AA** compliant
- **Keyboard navigation** support
- **Screen reader** friendly
- **Color contrast** meets accessibility standards
- **Reduced motion** support

## Security

- **Content Security Policy** ready
- **HTTPS** required for service worker
- **No external tracking** by default
- **Local storage** for user preferences only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Credits

- **Design Inspiration**: Anime aesthetics and glass morphism trends
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins, Quicksand)
- **Music**: Pixabay royalty-free tracks
- **Snow Animation**: Custom implementation with Three.js

## Support

For issues or questions:
1. Check the [GitHub Issues](https://github.com/duckzangryy/personal-website/issues)
2. Contact via social media links on the website

---

**Last Updated**: May 25, 2026  
**Version**: 1.0.0  
**Author**: Viet Anh