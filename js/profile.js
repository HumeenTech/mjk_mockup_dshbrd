// Profile UI Manager
class ProfileUI {
    static init() {
        // Check auth
        if (!AuthManager.checkAuth()) return;
        
        // Load current user data
        this.loadUserData();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    static loadUserData() {
        const currentUser = DataManager.getCurrentUser();
        
        if (currentUser) {
            // Update profile form
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const email = document.getElementById('email');
            const bio = document.getElementById('bio');
            const profileFullName = document.getElementById('profileFullName');
            const profileEmail = document.getElementById('profileEmail');
            
            // Split name into first and last
            const nameParts = currentUser.name.split(' ');
            const firstNameValue = nameParts[0] || '';
            const lastNameValue = nameParts.slice(1).join(' ') || '';
            
            if (firstName) firstName.value = firstNameValue;
            if (lastName) lastName.value = lastNameValue;
            if (email) email.value = currentUser.email || '';
            if (bio) bio.value = currentUser.bio || 'System administrator with full access to all features and settings.';
            if (profileFullName) profileFullName.textContent = currentUser.name;
            if (profileEmail) profileEmail.textContent = currentUser.email;
        }
    }
    
    static setupEventListeners() {
        // Profile form submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }
        
        // Cancel button
        const cancelProfileBtn = document.getElementById('cancelProfileBtn');
        if (cancelProfileBtn) {
            cancelProfileBtn.addEventListener('click', () => {
                window.location.href = "dashboard.html";
            });
        }
        
        // Change avatar button
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', () => {
                this.changeAvatar();
            });
        }
    }
    
    static saveProfile() {
        const firstName = document.getElementById('firstName')?.value;
        const lastName = document.getElementById('lastName')?.value;
        const email = document.getElementById('email')?.value;
        const bio = document.getElementById('bio')?.value;
        const currentPassword = document.getElementById('currentPassword')?.value;
        const newPassword = document.getElementById('newPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        
        // Validate required fields
        if (!firstName || !email) {
            Toast.show('First name and email are required', 'error');
            return;
        }
        
        // Check if password is being changed
        if (currentPassword || newPassword || confirmPassword) {
            if (!currentPassword || !newPassword || !confirmPassword) {
                Toast.show('All password fields are required when changing password', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                Toast.show('New passwords do not match', 'error');
                return;
            }
            
            if (newPassword.length < 6) {
                Toast.show('New password must be at least 6 characters', 'error');
                return;
            }
            
            // In a real app, you would verify current password and update
            Toast.show('Password changed successfully', 'success');
            
            // Clear password fields
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        }
        
        // Update user data
        const currentUser = DataManager.getCurrentUser();
        const users = DataManager.getUsers();
        
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            const fullName = `${firstName} ${lastName}`.trim();
            
            users[userIndex] = {
                ...users[userIndex],
                name: fullName,
                email: email,
                bio: bio
            };
            
            DataManager.saveUsers(users);
            
            // Update current user session
            DataManager.setCurrentUser(users[userIndex]);
            
            // Update header info
            AuthManager.updateUserInfo();
            
            Toast.show('Profile updated successfully', 'success');
        }
    }
    
    static changeAvatar() {
        Toast.show('Avatar change functionality would be implemented here', 'info');
        // In a real app, you would open a file picker and upload the avatar
    }
}