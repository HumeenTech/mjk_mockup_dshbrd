// Authentication Manager
class AuthManager {
    static checkAuth() {
        const currentUser = DataManager.getCurrentUser();
        if (!currentUser) {
            window.location.href = "index.html";
            return false;
        }
        return true;
    }
    
    static updateUserInfo() {
        const currentUser = DataManager.getCurrentUser();
        if (currentUser) {
            // Update header user info
            const usernameElement = document.getElementById('currentUsername');
            const profileUsernameElement = document.getElementById('profileUsername');
            const profileRoleElement = document.getElementById('profileRole');
            
            if (usernameElement) usernameElement.textContent = currentUser.name;
            if (profileUsernameElement) profileUsernameElement.textContent = currentUser.name;
            if (profileRoleElement) {
                profileRoleElement.textContent = currentUser.role === 'admin' ? 'Administrator' : 
                                                currentUser.role === 'editor' ? 'Editor' : 
                                                currentUser.role === 'viewer' ? 'Viewer' : 'Contributor';
            }
        }
    }
    
    static setupCommonEventListeners() {
        // User menu
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', () => {
                const menu = document.getElementById('userMenu');
                if (menu) menu.classList.toggle('hidden');
            });
        }
        
        // Close user menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#userMenuBtn') && !e.target.closest('#userMenu')) {
                const menu = document.getElementById('userMenu');
                if (menu) menu.classList.add('hidden');
            }
        });
        
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                DataManager.clearCurrentUser();
                Toast.show('You have been logged out', 'info');
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            });
        }
        
        // Active sidebar link
        const currentPage = window.location.pathname.split('/').pop();
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize auth on page load for all pages
document.addEventListener('DOMContentLoaded', () => {
    DataManager.initializeData();
    
    // Don't check auth on login page
    if (window.location.pathname.includes('index.html')) {
        return;
    }
    
    // Check authentication for all other pages
    if (AuthManager.checkAuth()) {
        AuthManager.updateUserInfo();
        AuthManager.setupCommonEventListeners();
    }
});