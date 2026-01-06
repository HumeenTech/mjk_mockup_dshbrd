// Local Storage Keys
const STORAGE_KEYS = {
    USERS: 'cms_rbac_users',
    ROLES: 'cms_rbac_roles',
    COMMENTS: 'cms_rbac_comments',
    BLACKLIST: 'cms_rbac_blacklist',
    REPORTS: 'cms_rbac_reports',
    CURRENT_USER: 'cms_current_user',
    CONTENT: 'cms_content_data'
};

// Initial Data
const initialData = {
    users: [
        { id: 1, name: "Admin User", username: "admin", email: "admin@example.com", role: "admin", status: "active", joined: "2023-01-15" },
        { id: 2, name: "Jane Editor", username: "jane_editor", email: "jane@example.com", role: "editor", status: "active", joined: "2023-02-20" },
        { id: 3, name: "John Viewer", username: "john_viewer", email: "john@example.com", role: "viewer", status: "active", joined: "2023-03-10" },
        { id: 4, name: "Sarah Contributor", username: "sarah_contrib", email: "sarah@example.com", role: "contributor", status: "active", joined: "2023-04-05" },
        { id: 5, name: "Mike Banned", username: "mike_banned", email: "mike@example.com", role: "viewer", status: "banned", joined: "2023-01-30" },
        { id: 6, name: "Alex Inactive", username: "alex_inactive", email: "alex@example.com", role: "contributor", status: "inactive", joined: "2023-02-15" }
    ],
    roles: [
        { id: 1, name: "Administrator", description: "Full system access", userCount: 1, permissions: ["all"] },
        { id: 2, name: "Editor", description: "Can create and edit content", userCount: 1, permissions: ["create", "edit", "delete"] },
        { id: 3, name: "Viewer", description: "Read-only access", userCount: 2, permissions: ["read"] },
        { id: 4, name: "Contributor", description: "Can create content", userCount: 2, permissions: ["create", "read"] }
    ],
    comments: [
        { id: 1, userId: 2, userName: "Jane Editor", contentId: 1, contentTitle: "Getting Started with RBAC", text: "Great article! Very helpful for understanding RBAC systems.", date: "2023-06-10", status: "approved" },
        { id: 2, userId: 3, userName: "John Viewer", contentId: 2, contentTitle: "Advanced Dashboard Techniques", text: "Could you elaborate more on the chart integration section?", date: "2023-06-12", status: "pending" },
        { id: 3, userId: 4, userName: "Sarah Contributor", contentId: 1, contentTitle: "Getting Started with RBAC", text: "Thanks for sharing these insights.", date: "2023-06-08", status: "approved" },
        { id: 4, userId: 6, userName: "Alex Inactive", contentId: 3, contentTitle: "Content Management Best Practices", text: "SPAM: Check out my website for more tips!", date: "2023-06-05", status: "spam" }
    ],
    blacklist: [
        { id: 1, userId: 5, userName: "Mike Banned", reason: "Repeated policy violations", date: "2023-05-20" }
    ],
    reports: [
        { id: 1, reportedUserId: 5, reportedUserName: "Mike Banned", reporterId: 2, reporterName: "Jane Editor", reason: "Inappropriate content", date: "2023-05-18" },
        { id: 2, reportedUserId: 6, reportedUserName: "Alex Inactive", reporterId: 3, reporterName: "John Viewer", reason: "Spam comments", date: "2023-06-01" }
    ],
    content: [
        { id: 1, title: "Getting Started with RBAC", views: 3245, likes: 142, comments: 8, subscribers: 120 },
        { id: 2, title: "Advanced Dashboard Techniques", views: 2876, likes: 98, comments: 12, subscribers: 85 },
        { id: 3, title: "Content Management Best Practices", views: 1987, likes: 76, comments: 5, subscribers: 64 }
    ]
};

// Toast System
class Toast {
    static show(message, type = "info", duration = 5000) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';

        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, duration);

        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        });
    }
}

// Data Manager
class DataManager {
    static initializeData() {
        // Initialize users
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialData.users));
        }

        // Initialize roles
        if (!localStorage.getItem(STORAGE_KEYS.ROLES)) {
            localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(initialData.roles));
        }

        // Initialize comments
        if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
            localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(initialData.comments));
        }

        // Initialize blacklist
        if (!localStorage.getItem(STORAGE_KEYS.BLACKLIST)) {
            localStorage.setItem(STORAGE_KEYS.BLACKLIST, JSON.stringify(initialData.blacklist));
        }

        // Initialize reports
        if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
            localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(initialData.reports));
        }

        // Initialize content
        if (!localStorage.getItem(STORAGE_KEYS.CONTENT)) {
            localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(initialData.content));
        }
    }

    static getUsers() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    }

    static saveUsers(users) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    static getRoles() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ROLES) || '[]');
    }

    static saveRoles(roles) {
        localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
    }

    static getComments() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]');
    }

    static saveComments(comments) {
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    }

    static getBlacklist() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.BLACKLIST) || '[]');
    }

    static saveBlacklist(blacklist) {
        localStorage.setItem(STORAGE_KEYS.BLACKLIST, JSON.stringify(blacklist));
    }

    static getReports() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
    }

    static saveReports(reports) {
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    }

    static getContent() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTENT) || '[]');
    }

    static saveContent(content) {
        localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(content));
    }

    static getCurrentUser() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    }

    static setCurrentUser(user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }

    static clearCurrentUser() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }

    // User CRUD operations
    static addUser(user) {
        const users = this.getUsers();
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        user.id = newId;
        user.joined = new Date().toISOString().split('T')[0];
        users.push(user);
        this.saveUsers(users);
        return user;
    }

    static updateUser(updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedUser };
            this.saveUsers(users);
            return true;
        }
        return false;
    }

    static deleteUser(id) {
        const users = this.getUsers();
        const filteredUsers = users.filter(u => u.id !== id);
        this.saveUsers(filteredUsers);
        return filteredUsers.length < users.length;
    }

    // Comment CRUD operations
    static addComment(comment) {
        const comments = this.getComments();
        const newId = comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1;
        comment.id = newId;
        comment.date = new Date().toISOString().split('T')[0];

        // Get user name from user ID
        const users = this.getUsers();
        const user = users.find(u => u.id === parseInt(comment.userId));
        comment.userName = user ? user.name : "Unknown User";

        comments.push(comment);
        this.saveComments(comments);
        return comment;
    }

    static updateComment(updatedComment) {
        const comments = this.getComments();
        const index = comments.findIndex(c => c.id === updatedComment.id);
        if (index !== -1) {
            comments[index] = { ...comments[index], ...updatedComment };
            this.saveComments(comments);
            return true;
        }
        return false;
    }

    static deleteComment(id) {
        const comments = this.getComments();
        const filteredComments = comments.filter(c => c.id !== id);
        this.saveComments(filteredComments);
        return filteredComments.length < comments.length;
    }
}