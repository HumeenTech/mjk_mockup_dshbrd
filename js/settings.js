// Settings UI Manager
class SettingsUI {
    static init() {
        // Check auth
        if (!AuthManager.checkAuth()) return;
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    static setupEventListeners() {
        // Save settings button
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }
        
        // Danger zone buttons
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
        
        const clearCacheBtn = document.getElementById('clearCacheBtn');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => {
                this.clearCache();
            });
        }
        
        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => {
                this.deleteAccount();
            });
        }
        
        // Toggle switches
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            const toggleBg = checkbox.nextElementSibling;
            
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    toggleBg.classList.add('bg-black');
                    toggleBg.classList.remove('bg-gray-300');
                } else {
                    toggleBg.classList.remove('bg-black');
                    toggleBg.classList.add('bg-gray-300');
                }
            });
            
            // Initialize toggle state
            if (checkbox.checked) {
                toggleBg.classList.add('bg-black');
            }
        });
    }
    
    static saveSettings() {
        // Get values from form
        const platformName = document.getElementById('platformName')?.value;
        const timezone = document.getElementById('timezone')?.value;
        const dateFormat = document.getElementById('dateFormat')?.value;
        const emailNotifications = document.getElementById('emailNotifications')?.checked;
        const twoFactorAuth = document.getElementById('twoFactorAuth')?.checked;
        
        // In a real app, you would save these to localStorage or send to server
        Toast.show('Settings saved successfully', 'success');
    }
    
    static exportData() {
        // Export all data as JSON
        const allData = {
            users: DataManager.getUsers(),
            roles: DataManager.getRoles(),
            comments: DataManager.getComments(),
            blacklist: DataManager.getBlacklist(),
            reports: DataManager.getReports(),
            content: DataManager.getContent()
        };
        
        const dataStr = JSON.stringify(allData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'cms-dashboard-data.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        Toast.show('Data exported successfully', 'success');
    }
    
    static clearCache() {
        if (confirm('Are you sure you want to clear all cached data? This will reset the application to initial state.')) {
            // Clear all localStorage items
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            
            // Reinitialize data
            DataManager.initializeData();
            
            Toast.show('Cache cleared successfully', 'success');
            
            // Reload page to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
    
    static deleteAccount() {
        if (confirm('WARNING: This will permanently delete your account and all associated data. This action cannot be undone. Are you sure?')) {
            const currentUser = DataManager.getCurrentUser();
            const users = DataManager.getUsers();
            
            // Remove current user from users list
            const filteredUsers = users.filter(user => user.id !== currentUser.id);
            DataManager.saveUsers(filteredUsers);
            
            // Clear current user session
            DataManager.clearCurrentUser();
            
            Toast.show('Account deleted successfully', 'success');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        }
    }
}