// הגדרת סכמות הצבעים השונות
const colorThemes = {
    'blue-turquoise': {
        primaryColor: '#1a5276',
        secondaryColor: '#2874a6',
        tertiaryColor: '#3498db',
        accentColor: '#48c9b0',
        highlightColor: '#76d7c4',
        backgroundColor: '#e8f8f5',
        textColor: '#1a5276'
    },
    'red-gold': {
        primaryColor: '#922b21',
        secondaryColor: '#cb4335',
        tertiaryColor: '#e74c3c',
        accentColor: '#d4ac0d',
        highlightColor: '#f1c40f',
        backgroundColor: '#fef9e7',
        textColor: '#922b21'
    },
    'purple-cyan': {
        primaryColor: '#6c3483',
        secondaryColor: '#8e44ad',
        tertiaryColor: '#a569bd',
        accentColor: '#3498db',
        highlightColor: '#5dade2',
        backgroundColor: '#eaf2f8',
        textColor: '#6c3483'
    },
    'ochre-desert': {
        primaryColor: '#b9770e',
        secondaryColor: '#ca9a5c',
        tertiaryColor: '#d68910',
        accentColor: '#cd6155',
        highlightColor: '#e6b0aa',
        backgroundColor: '#fdf2e9',
        textColor: '#b9770e'
    }
};

// פונקציה לשינוי הסכמה
function changeColorTheme(themeName) {
    // אם לא נשלח שם נושא, השתמש בברירת המחדל
    if (!themeName || !colorThemes[themeName]) {
        themeName = 'blue-turquoise';
    }
    
    // קבל את ערכי הצבעים של הנושא שנבחר
    const theme = colorThemes[themeName];
    
    // שנה את המשתנים בגיליון הסגנון
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--tertiary-color', theme.tertiaryColor);
    document.documentElement.style.setProperty('--accent-color', theme.accentColor);
    document.documentElement.style.setProperty('--highlight-color', theme.highlightColor);
    document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
    
    // שמור את הנושא שנבחר ב-localStorage
    localStorage.setItem('selectedTheme', themeName);
}

// פונקציה לטעינת הנושא השמור כאשר הדף נטען
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        // עדכן את הערך הנבחר בתיבת הבחירה
        const themeSelector = document.getElementById('themeSelector');
        if (themeSelector) {
            themeSelector.value = savedTheme;
        }
        
        // החל את הנושא השמור
        changeColorTheme(savedTheme);
    }
}

// בעת טעינת החלון, הוסף מאזינים ואתחל את הנושא
window.addEventListener('DOMContentLoaded', () => {
    // מצא את תיבת הבחירה של הנושא
    const themeSelector = document.getElementById('themeSelector');
    
    // הוסף מאזין אירועים לשינוי בתיבת הבחירה
    if (themeSelector) {
        themeSelector.addEventListener('change', (event) => {
            changeColorTheme(event.target.value);
        });
    }
    
    // טען את הנושא השמור (אם קיים)
    loadSavedTheme();
});