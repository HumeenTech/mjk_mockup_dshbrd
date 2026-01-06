// Dashboard UI Manager
class DashboardUI {
    static init() {
        DataManager.initializeData();
        
        // Check if user is logged in
        const currentUser = DataManager.getCurrentUser();
        if (!currentUser) {
            window.location.href = "index.html";
            return;
        }
        
        // Update user info
        this.updateUserInfo();
        
        // Load dashboard data
        this.loadDashboardData();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    static updateUserInfo() {
        const currentUser = DataManager.getCurrentUser();
        if (currentUser) {
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
    
    static loadDashboardData() {
        this.updateDashboardStats();
        this.loadRecentUsers();
    }
    
    static updateDashboardStats() {
        const users = DataManager.getUsers();
        const roles = DataManager.getRoles();
        const content = DataManager.getContent();

        // Count users by role
        const subscribers = users.filter(u => u.status === 'active').length;
        const contributors = users.filter(u => u.role === 'contributor' && u.status === 'active').length;

        // Update stats
        const totalUsersElement = document.getElementById('totalUsers');
        const totalSubscribersElement = document.getElementById('totalSubscribers');
        const totalContributorsElement = document.getElementById('totalContributors');
        const totalRolesElement = document.getElementById('totalRoles');
        
        if (totalUsersElement) totalUsersElement.textContent = users.length;
        if (totalSubscribersElement) totalSubscribersElement.textContent = subscribers;
        if (totalContributorsElement) totalContributorsElement.textContent = contributors;
        if (totalRolesElement) totalRolesElement.textContent = roles.length;
    }
    
    static loadRecentUsers() {
        const users = DataManager.getUsers();
        const recentUsers = users.slice(0, 5); // Get first 5 users
        const tableBody = document.getElementById('recentUsersTable');

        if (!tableBody) return;

        tableBody.innerHTML = '';

        recentUsers.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'table-row';

            // Role badge class
            let roleClass = 'role-admin';
            if (user.role === 'editor') roleClass = 'role-editor';
            if (user.role === 'viewer') roleClass = 'role-viewer';
            if (user.role === 'contributor') roleClass = 'role-contributor';

            // Status badge class
            let statusClass = 'status-active';
            if (user.status === 'inactive') statusClass = 'status-inactive';
            if (user.status === 'banned') statusClass = 'status-banned';

            row.innerHTML = `
                <td class="py-4">
                    <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                            <i class="fas fa-user text-gray-600 text-sm"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900">${user.name}</p>
                            <p class="text-sm text-gray-500">@${user.username}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4">
                    <span class="${roleClass} role-badge">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                </td>
                <td class="py-4">
                    <span class="${statusClass} status-badge">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                </td>
                <td class="py-4 text-gray-500">${user.joined}</td>
            `;

            tableBody.appendChild(row);
        });
    }
    
    static setupEventListeners() {
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