// RBAC UI Manager
class RBACUI {
    static init() {
        // Check auth
        if (!AuthManager.checkAuth()) return;
        
        console.log('RBAC UI Initializing...');
        
        // Wait for components to load, then initialize
        setTimeout(() => {
            // Load initial data
            this.loadUsersTable();
            this.loadRoles();
            this.loadBlacklist();
            this.loadReports();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup modal event listeners
            this.setupModalEventListeners();
        }, 500); // Give time for components to load
    }
    
    static setupEventListeners() {
        console.log('Setting up RBAC event listeners...');
        
        // Add user button
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            console.log('Found add user button');
            // Remove existing listener first
            addUserBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openAddUserModal();
            });
        } else {
            console.log('Add user button not found');
        }
        
        // RBAC tabs
        const rbacTabs = document.querySelectorAll('.rbac-tab');
        if (rbacTabs.length > 0) {
            console.log(`Found ${rbacTabs.length} RBAC tabs`);
            rbacTabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    const tabId = e.currentTarget.getAttribute('data-tab');
                    this.switchRBACTab(tabId);
                });
            });
        }
        
        // Search input
        const searchInput = document.getElementById('searchUsers');
        if (searchInput) {
            console.log('Found search input');
            searchInput.addEventListener('input', (e) => {
                this.filterUsers(e.target.value);
            });
        }
        
        // Role filter
        const roleFilter = document.getElementById('filterRole');
        if (roleFilter) {
            console.log('Found role filter');
            roleFilter.addEventListener('change', (e) => {
                this.filterByRole(e.target.value);
            });
        }
    }
    
    static setupModalEventListeners() {
        console.log('Setting up modal event listeners...');
        
        // Wait a bit for modals to be loaded
        setTimeout(() => {
            // User form submission
            const userForm = document.getElementById('userForm');
            if (userForm) {
                console.log('Found user form');
                userForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.saveUser();
                });
            } else {
                console.log('User form not found yet, will retry...');
            }
            
            // Cancel user button
            const cancelUserBtn = document.getElementById('cancelUserBtn');
            if (cancelUserBtn) {
                console.log('Found cancel user button');
                cancelUserBtn.addEventListener('click', () => {
                    this.closeUserModal();
                });
            }
            
            // Close modals when clicking outside
            const modalOverlays = document.querySelectorAll('.modal-overlay');
            modalOverlays.forEach(modal => {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                    }
                });
            });
        }, 300);
    }
    
    static loadUsersTable() {
        console.log('Loading users table...');
        const users = DataManager.getUsers();
        const tableBody = document.getElementById('usersTable');
        const emptyState = document.getElementById('usersEmptyState');

        if (!tableBody) {
            console.error('Users table body not found!');
            return;
        }

        tableBody.innerHTML = '';

        if (users.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="py-8 text-center text-gray-500">
                        No users found. Click "Add User" to create your first user.
                    </td>
                </tr>
            `;
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        users.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'table-row hover:bg-gray-50';

            // Role badge class
            let roleClass = 'role-admin';
            if (user.role === 'editor') roleClass = 'role-editor';
            if (user.role === 'viewer') roleClass = 'role-viewer';
            if (user.role === 'contributor') roleClass = 'role-contributor';

            // Status badge class
            let statusClass = 'status-active';
            if (user.status === 'inactive') statusClass = 'status-inactive';
            if (user.status === 'banned') statusClass = 'status-banned';

            // Status icon
            let statusIcon = 'fa-check-circle';
            if (user.status === 'inactive') statusIcon = 'fa-pause-circle';
            if (user.status === 'banned') statusIcon = 'fa-ban';

            row.innerHTML = `
                <td class="py-4 pl-4 md:pl-5">
                    <div class="flex items-center">
                        <div class="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <i class="fas fa-user text-gray-600 text-sm md:text-base"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 text-sm md:text-base">${user.name}</p>
                            <p class="text-xs md:text-sm text-gray-500">@${user.username}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 text-gray-700 hidden md:table-cell">${user.email}</td>
                <td class="py-4">
                    <span class="${roleClass} role-badge text-xs">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                </td>
                <td class="py-4 hidden sm:table-cell">
                    <div class="flex items-center">
                        <i class="fas ${statusIcon} mr-2 text-sm ${user.status === 'active' ? 'text-green-500' : user.status === 'inactive' ? 'text-gray-500' : 'text-red-500'}"></i>
                        <span class="${statusClass} status-badge">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                    </div>
                </td>
                <td class="py-4 pr-4 md:pr-5 text-right">
                    <div class="flex justify-end space-x-1 md:space-x-2">
                        <button class="edit-user-btn p-1.5 md:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" 
                                data-id="${user.id}"
                                title="Edit user">
                            <i class="fas fa-edit text-sm md:text-base"></i>
                        </button>
                        <button class="delete-user-btn p-1.5 md:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" 
                                data-id="${user.id}"
                                title="Delete user">
                            <i class="fas fa-trash-alt text-sm md:text-base"></i>
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Add event listeners to edit and delete buttons
        this.setupUserTableEventListeners();
    }
    
    static setupUserTableEventListeners() {
        console.log('Setting up user table event listeners...');
        
        // Edit buttons
        document.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const userId = parseInt(e.currentTarget.getAttribute('data-id'));
                console.log('Edit user clicked:', userId);
                this.openEditUserModal(userId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const userId = parseInt(e.currentTarget.getAttribute('data-id'));
                console.log('Delete user clicked:', userId);
                this.deleteUser(userId);
            });
        });
    }
    
    static loadRoles() {
        console.log('Loading roles...');
        const roles = DataManager.getRoles();
        const rolesContainer = document.getElementById('rolesGrid');
        const emptyState = document.getElementById('rolesEmptyState');

        if (!rolesContainer) {
            console.log('Roles container not found, might not be on roles tab');
            return;
        }

        rolesContainer.innerHTML = '';

        if (roles.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        // First, count users per role
        const users = DataManager.getUsers();
        const roleCounts = {};
        users.forEach(user => {
            roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
        });

        roles.forEach(role => {
            const roleCard = document.createElement('div');
            roleCard.className = 'card p-4 hover:shadow-md transition-shadow duration-200';
            
            // Update role count
            const userCount = roleCounts[role.name.toLowerCase()] || 0;
            
            // Role icon
            let roleIcon = 'fa-user-tag';
            if (role.name === 'Administrator') roleIcon = 'fa-shield-alt';
            if (role.name === 'Editor') roleIcon = 'fa-edit';
            if (role.name === 'Viewer') roleIcon = 'fa-eye';
            if (role.name === 'Contributor') roleIcon = 'fa-pen';

            roleCard.innerHTML = `
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center">
                        <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                            <i class="fas ${roleIcon} text-gray-600"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-900">${role.name}</h4>
                            <p class="text-xs text-gray-500">${userCount} user${userCount !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${role.description}</p>
                <div class="mb-3">
                    <p class="text-xs font-medium text-gray-700 mb-1">Permissions:</p>
                    <div class="flex flex-wrap gap-1">
                        ${role.permissions.slice(0, 3).map(perm => 
                            `<span class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">${perm}</span>`
                        ).join('')}
                        ${role.permissions.length > 3 ? 
                            `<span class="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded">+${role.permissions.length - 3} more</span>` : 
                            ''
                        }
                    </div>
                </div>
                <div class="flex space-x-2 pt-2 border-t border-gray-100">
                    <button class="edit-role-btn btn btn-outline flex-1 justify-center py-1.5 text-sm" 
                            data-id="${role.id}">
                        <i class="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button class="manage-role-btn btn btn-outline flex-1 justify-center py-1.5 text-sm" 
                            data-id="${role.id}">
                        <i class="fas fa-cog mr-1"></i>Manage
                    </button>
                </div>
            `;

            rolesContainer.appendChild(roleCard);
        });
        
        // Add event listeners to role buttons
        this.setupRoleCardEventListeners();
    }
    
    static setupRoleCardEventListeners() {
        console.log('Setting up role card event listeners...');
        
        document.querySelectorAll('.edit-role-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const roleId = parseInt(e.currentTarget.getAttribute('data-id'));
                console.log('Edit role clicked:', roleId);
                this.editRole(roleId);
            });
        });
        
        document.querySelectorAll('.manage-role-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const roleId = parseInt(e.currentTarget.getAttribute('data-id'));
                console.log('Manage role clicked:', roleId);
                this.manageRole(roleId);
            });
        });
    }
    
    static loadBlacklist() {
        console.log('Loading blacklist...');
        const blacklist = DataManager.getBlacklist();
        const users = DataManager.getUsers();
        const tableBody = document.getElementById('blacklistTable');
        const emptyState = document.getElementById('blacklistEmptyState');

        if (!tableBody) {
            console.log('Blacklist table not found, might not be on blacklist tab');
            return;
        }

        tableBody.innerHTML = '';

        if (blacklist.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        blacklist.forEach(item => {
            const user = users.find(u => u.id === item.userId);
            if (!user) return;

            const row = document.createElement('tr');
            row.className = 'table-row hover:bg-gray-50';

            row.innerHTML = `
                <td class="py-4 pl-4 md:pl-5">
                    <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <i class="fas fa-user text-gray-600 text-sm"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 text-sm">${user.name}</p>
                            <p class="text-xs text-gray-500">@${user.username}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 text-gray-700 text-sm">${item.reason}</td>
                <td class="py-4 text-gray-500 text-sm hidden md:table-cell">${item.date}</td>
                <td class="py-4 pr-4 md:pr-5 text-right">
                    <button class="remove-blacklist-btn btn btn-outline py-1 px-3 text-xs md:text-sm" 
                            data-id="${item.id}">
                        Remove
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });
        
        // Add event listeners to remove buttons
        this.setupBlacklistEventListeners();
    }
    
    static setupBlacklistEventListeners() {
        console.log('Setting up blacklist event listeners...');
        
        document.querySelectorAll('.remove-blacklist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const blacklistId = parseInt(e.currentTarget.getAttribute('data-id'));
                console.log('Remove from blacklist clicked:', blacklistId);
                this.removeFromBlacklist(blacklistId);
            });
        });
    }
    
    static loadReports() {
        console.log('Loading reports...');
        const reports = DataManager.getReports();
        const users = DataManager.getUsers();
        const tableBody = document.getElementById('reportsTable');
        const emptyState = document.getElementById('reportsEmptyState');

        if (!tableBody) {
            console.log('Reports table not found, might not be on reports tab');
            return;
        }

        tableBody.innerHTML = '';

        if (reports.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        reports.forEach(report => {
            const reportedUser = users.find(u => u.id === report.reportedUserId);
            const reporterUser = users.find(u => u.id === report.reporterId);

            if (!reportedUser || !reporterUser) return;

            const row = document.createElement('tr');
            row.className = 'table-row hover:bg-gray-50';

            row.innerHTML = `
                <td class="py-4 pl-4 md:pl-5">
                    <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <i class="fas fa-user text-gray-600 text-sm"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 text-sm">${reportedUser.name}</p>
                            <p class="text-xs text-gray-500">@${reportedUser.username}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 text-gray-700 text-sm hidden md:table-cell">
                    <div class="flex items-center">
                        <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <i class="fas fa-user text-gray-600 text-xs"></i>
                        </div>
                        <span>${reporterUser.name}</span>
                    </div>
                </td>
                <td class="py-4 text-gray-700 text-sm">${report.reason}</td>
                <td class="py-4 text-gray-500 text-sm hidden lg:table-cell">${report.date}</td>
                <td class="py-4 pr-4 md:pr-5 text-right">
                    <div class="flex space-x-1 md:space-x-2 justify-end">
                        <button class="review-report-btn btn btn-outline py-1 px-2 md:px-3 text-xs" 
                                data-id="${report.id}">
                            Review
                        </button>
                        <button class="ban-reported-btn btn btn-danger py-1 px-2 md:px-3 text-xs" 
                                data-user-id="${report.reportedUserId}">
                            Ban
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });
        
        // Add event listeners
        this.setupReportsEventListeners();
    }
    
    static setupReportsEventListeners() {
        console.log('Setting up reports event listeners...');
        
        document.querySelectorAll('.review-report-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const reportId = parseInt(e.currentTarget.getAttribute('data-id'));
                console.log('Review report clicked:', reportId);
                this.reviewReport(reportId);
            });
        });
        
        document.querySelectorAll('.ban-reported-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const userId = parseInt(e.currentTarget.getAttribute('data-user-id'));
                console.log('Ban user clicked:', userId);
                this.banUser(userId);
            });
        });
    }
    
    static switchRBACTab(tabId) {
        console.log('Switching to tab:', tabId);
        
        // Hide all tab contents
        document.querySelectorAll('.rbac-tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.rbac-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.classList.remove('border-black');
            tab.classList.add('border-transparent');
        });
        
        // Show selected tab content
        const tabElement = document.getElementById(tabId + 'Tab');
        if (tabElement) {
            tabElement.classList.add('active');
            
            // Update active tab
            const tabButton = document.querySelector(`[data-tab="${tabId}"]`);
            if (tabButton) {
                tabButton.classList.add('active', 'border-black');
                tabButton.classList.remove('border-transparent');
            }
            
            // Load data for the tab if needed
            if (tabId === 'roles' && document.getElementById('rolesGrid').innerHTML === '') {
                this.loadRoles();
            } else if (tabId === 'blacklist' && document.getElementById('blacklistTable').innerHTML === '') {
                this.loadBlacklist();
            } else if (tabId === 'reports' && document.getElementById('reportsTable').innerHTML === '') {
                this.loadReports();
            }
        }
    }
    
    static openAddUserModal() {
        console.log('Opening add user modal');
        const modalTitle = document.getElementById('modalTitle');
        const userForm = document.getElementById('userForm');
        const userIdInput = document.getElementById('userId');
        const userModal = document.getElementById('userModal');
        
        if (modalTitle) modalTitle.textContent = 'Add New User';
        if (userForm) userForm.reset();
        if (userIdInput) userIdInput.value = '';
        if (userModal) {
            userModal.classList.add('active');
            console.log('Modal opened successfully');
        } else {
            console.error('User modal not found!');
        }
    }
    
    static openEditUserModal(userId) {
        console.log('Opening edit user modal for ID:', userId);
        const users = DataManager.getUsers();
        const user = users.find(u => u.id === userId);
        
        if (user) {
            const modalTitle = document.getElementById('modalTitle');
            const userIdInput = document.getElementById('userId');
            const userFullName = document.getElementById('userFullName');
            const userEmail = document.getElementById('userEmail');
            const userUsername = document.getElementById('userUsername');
            const userRole = document.getElementById('userRole');
            const userStatus = document.getElementById('userStatus');
            const userModal = document.getElementById('userModal');
            
            if (modalTitle) modalTitle.textContent = 'Edit User';
            if (userIdInput) userIdInput.value = user.id;
            if (userFullName) userFullName.value = user.name;
            if (userEmail) userEmail.value = user.email;
            if (userUsername) userUsername.value = user.username;
            if (userRole) userRole.value = user.role;
            if (userStatus) userStatus.value = user.status;
            if (userModal) {
                userModal.classList.add('active');
                console.log('Edit modal opened successfully');
            } else {
                console.error('User modal not found!');
            }
        } else {
            console.error('User not found with ID:', userId);
            Toast.show('User not found', 'error');
        }
    }
    
    static saveUser() {
        console.log('Saving user...');
        const id = document.getElementById('userId')?.value;
        const name = document.getElementById('userFullName')?.value;
        const email = document.getElementById('userEmail')?.value;
        const username = document.getElementById('userUsername')?.value;
        const role = document.getElementById('userRole')?.value;
        const status = document.getElementById('userStatus')?.value;
        
        console.log('User data:', { id, name, email, username, role, status });
        
        if (!name || !email || !username) {
            Toast.show('Please fill in all required fields', 'error');
            return;
        }
        
        const userData = {
            name,
            email,
            username,
            role,
            status
        };
        
        if (id) {
            // Update existing user
            userData.id = parseInt(id);
            if (DataManager.updateUser(userData)) {
                Toast.show('User updated successfully', 'success');
                this.closeUserModal();
                this.loadUsersTable();
                this.loadRoles(); // Update role counts
            } else {
                Toast.show('Failed to update user', 'error');
            }
        } else {
            // Add new user
            const newUser = DataManager.addUser(userData);
            Toast.show(`User ${newUser.name} added successfully`, 'success');
            this.closeUserModal();
            this.loadUsersTable();
            this.loadRoles(); // Update role counts
        }
    }
    
    static deleteUser(userId) {
        console.log('Deleting user:', userId);
        if (confirm('Are you sure you want to delete this user?')) {
            if (DataManager.deleteUser(userId)) {
                Toast.show('User deleted successfully', 'success');
                this.loadUsersTable();
                this.loadRoles(); // Update role counts
            } else {
                Toast.show('Failed to delete user', 'error');
            }
        }
    }
    
    static editRole(roleId) {
        Toast.show(`Edit role ID: ${roleId} - This feature would be implemented fully in a production app`, 'info');
        // In a real app, you would open a role edit modal
    }
    
    static manageRole(roleId) {
        Toast.show(`Manage role ID: ${roleId} - This feature would be implemented fully in a production app`, 'info');
        // In a real app, you would open a role management interface
    }
    
    static removeFromBlacklist(blacklistId) {
        console.log('Removing from blacklist:', blacklistId);
        if (confirm('Are you sure you want to remove this user from blacklist?')) {
            const blacklist = DataManager.getBlacklist();
            const filteredBlacklist = blacklist.filter(item => item.id !== blacklistId);
            DataManager.saveBlacklist(filteredBlacklist);
            Toast.show('User removed from blacklist', 'success');
            this.loadBlacklist();
        }
    }
    
    static reviewReport(reportId) {
        Toast.show(`Reviewing report ${reportId}`, 'info');
        // In a real app, you would open a detailed review modal
    }
    
    static banUser(userId) {
        console.log('Banning user:', userId);
        if (confirm('Are you sure you want to ban this user?')) {
            const users = DataManager.getUsers();
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                // Update user status
                users[userIndex].status = 'banned';
                DataManager.saveUsers(users);
                
                // Add to blacklist if not already there
                const blacklist = DataManager.getBlacklist();
                const alreadyBlacklisted = blacklist.some(item => item.userId === userId);
                
                if (!alreadyBlacklisted) {
                    const newBlacklistItem = {
                        id: blacklist.length > 0 ? Math.max(...blacklist.map(item => item.id)) + 1 : 1,
                        userId: userId,
                        userName: users[userIndex].name,
                        reason: 'Banned from report review',
                        date: new Date().toISOString().split('T')[0]
                    };
                    blacklist.push(newBlacklistItem);
                    DataManager.saveBlacklist(blacklist);
                }
                
                Toast.show('User banned successfully', 'success');
                this.loadUsersTable();
                this.loadBlacklist();
                this.loadReports();
            }
        }
    }
    
    static filterUsers(searchTerm) {
        console.log('Filtering users by:', searchTerm);
        const users = DataManager.getUsers();
        const tableBody = document.getElementById('usersTable');
        const emptyState = document.getElementById('usersEmptyState');
        
        if (!tableBody) {
            console.error('Users table body not found!');
            return;
        }
        
        if (!searchTerm) {
            this.loadUsersTable();
            return;
        }
        
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        tableBody.innerHTML = '';

        if (filteredUsers.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="py-8 text-center text-gray-500">
                        No users found matching "${searchTerm}"
                    </td>
                </tr>
            `;
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        filteredUsers.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'table-row hover:bg-gray-50';

            let roleClass = 'role-admin';
            if (user.role === 'editor') roleClass = 'role-editor';
            if (user.role === 'viewer') roleClass = 'role-viewer';
            if (user.role === 'contributor') roleClass = 'role-contributor';

            let statusClass = 'status-active';
            if (user.status === 'inactive') statusClass = 'status-inactive';
            if (user.status === 'banned') statusClass = 'status-banned';

            let statusIcon = 'fa-check-circle';
            if (user.status === 'inactive') statusIcon = 'fa-pause-circle';
            if (user.status === 'banned') statusIcon = 'fa-ban';

            row.innerHTML = `
                <td class="py-4 pl-4 md:pl-5">
                    <div class="flex items-center">
                        <div class="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <i class="fas fa-user text-gray-600 text-sm md:text-base"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 text-sm md:text-base">${user.name}</p>
                            <p class="text-xs md:text-sm text-gray-500">@${user.username}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 text-gray-700 hidden md:table-cell">${user.email}</td>
                <td class="py-4">
                    <span class="${roleClass} role-badge text-xs">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                </td>
                <td class="py-4 hidden sm:table-cell">
                    <div class="flex items-center">
                        <i class="fas ${statusIcon} mr-2 text-sm ${user.status === 'active' ? 'text-green-500' : user.status === 'inactive' ? 'text-gray-500' : 'text-red-500'}"></i>
                        <span class="${statusClass} status-badge">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                    </div>
                </td>
                <td class="py-4 pr-4 md:pr-5 text-right">
                    <div class="flex justify-end space-x-1 md:space-x-2">
                        <button class="edit-user-btn p-1.5 md:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" 
                                data-id="${user.id}"
                                title="Edit user">
                            <i class="fas fa-edit text-sm md:text-base"></i>
                        </button>
                        <button class="delete-user-btn p-1.5 md:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" 
                                data-id="${user.id}"
                                title="Delete user">
                            <i class="fas fa-trash-alt text-sm md:text-base"></i>
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Re-attach event listeners
        this.setupUserTableEventListeners();
    }
    
    static filterByRole(role) {
        console.log('Filtering by role:', role);
        const users = DataManager.getUsers();
        const tableBody = document.getElementById('usersTable');
        const emptyState = document.getElementById('usersEmptyState');
        
        if (!tableBody) {
            console.error('Users table body not found!');
            return;
        }
        
        if (role === 'All Roles') {
            this.loadUsersTable();
            return;
        }
        
        const filteredUsers = users.filter(user => user.role === role.toLowerCase());
        
        tableBody.innerHTML = '';

        if (filteredUsers.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="py-8 text-center text-gray-500">
                        No users found with role "${role}"
                    </td>
                </tr>
            `;
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        filteredUsers.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'table-row hover:bg-gray-50';

            let roleClass = 'role-admin';
            if (user.role === 'editor') roleClass = 'role-editor';
            if (user.role === 'viewer') roleClass = 'role-viewer';
            if (user.role === 'contributor') roleClass = 'role-contributor';

            let statusClass = 'status-active';
            if (user.status === 'inactive') statusClass = 'status-inactive';
            if (user.status === 'banned') statusClass = 'status-banned';

            let statusIcon = 'fa-check-circle';
            if (user.status === 'inactive') statusIcon = 'fa-pause-circle';
            if (user.status === 'banned') statusIcon = 'fa-ban';

            row.innerHTML = `
                <td class="py-4 pl-4 md:pl-5">
                    <div class="flex items-center">
                        <div class="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <i class="fas fa-user text-gray-600 text-sm md:text-base"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 text-sm md:text-base">${user.name}</p>
                            <p class="text-xs md:text-sm text-gray-500">@${user.username}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 text-gray-700 hidden md:table-cell">${user.email}</td>
                <td class="py-4">
                    <span class="${roleClass} role-badge text-xs">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                </td>
                <td class="py-4 hidden sm:table-cell">
                    <div class="flex items-center">
                        <i class="fas ${statusIcon} mr-2 text-sm ${user.status === 'active' ? 'text-green-500' : user.status === 'inactive' ? 'text-gray-500' : 'text-red-500'}"></i>
                        <span class="${statusClass} status-badge">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                    </div>
                </td>
                <td class="py-4 pr-4 md:pr-5 text-right">
                    <div class="flex justify-end space-x-1 md:space-x-2">
                        <button class="edit-user-btn p-1.5 md:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded" 
                                data-id="${user.id}"
                                title="Edit user">
                            <i class="fas fa-edit text-sm md:text-base"></i>
                        </button>
                        <button class="delete-user-btn p-1.5 md:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded" 
                                data-id="${user.id}"
                                title="Delete user">
                            <i class="fas fa-trash-alt text-sm md:text-base"></i>
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Re-attach event listeners
        this.setupUserTableEventListeners();
    }
    
    static closeUserModal() {
        console.log('Closing user modal');
        const userModal = document.getElementById('userModal');
        if (userModal) {
            userModal.classList.remove('active');
            console.log('Modal closed successfully');
        } else {
            console.error('User modal not found!');
        }
    }
}