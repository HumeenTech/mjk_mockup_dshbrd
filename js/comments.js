// Comments UI Manager
class CommentsUI {
    static init() {
        // Check auth
        if (!AuthManager.checkAuth()) return;
        
        // Load data
        this.loadCommentsTable();
        this.populateCommentUserSelect();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    static loadCommentsTable() {
        const comments = DataManager.getComments();
        const tableBody = document.getElementById('commentsTable');

        if (!tableBody) return;

        tableBody.innerHTML = '';

        comments.forEach(comment => {
            const row = document.createElement('tr');
            row.className = 'table-row';

            // Status badge class
            let statusClass = 'status-active';
            if (comment.status === 'pending') statusClass = 'status-inactive';
            if (comment.status === 'spam') statusClass = 'status-banned';

            row.innerHTML = `
                <td class="py-4 pl-5">
                    <p class="text-gray-900">${comment.text}</p>
                </td>
                <td class="py-4">
                    <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                            <i class="fas fa-user text-gray-600 text-sm"></i>
                        </div>
                        <span class="font-medium text-gray-900">${comment.userName}</span>
                    </div>
                </td>
                <td class="py-4 text-gray-700">${comment.contentTitle}</td>
                <td class="py-4 text-gray-500">${comment.date}</td>
                <td class="py-4">
                    <span class="${statusClass} status-badge">${comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}</span>
                </td>
                <td class="py-4 pr-5 text-right">
                    <div class="flex justify-end space-x-2">
                        <button class="edit-comment-btn p-2 text-gray-500 hover:text-gray-700" data-id="${comment.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-comment-btn p-2 text-gray-500 hover:text-red-600" data-id="${comment.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commentId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.openEditCommentModal(commentId);
            });
        });

        document.querySelectorAll('.delete-comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commentId = parseInt(e.currentTarget.getAttribute('data-id'));
                this.deleteComment(commentId);
            });
        });
    }
    
    static populateCommentUserSelect() {
        const users = DataManager.getUsers();
        const select = document.getElementById('commentUser');

        if (!select) return;

        select.innerHTML = '<option value="">Select a user</option>';

        users.forEach(user => {
            if (user.status === 'active') {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.name} (@${user.username})`;
                select.appendChild(option);
            }
        });
    }
    
    static setupEventListeners() {
        // Add comment button
        const addCommentBtn = document.getElementById('addCommentBtn');
        if (addCommentBtn) {
            addCommentBtn.addEventListener('click', () => {
                this.openAddCommentModal();
            });
        }
        
        // Search comments
        const searchInput = document.getElementById('searchComments');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchComments(e.target.value);
            });
        }
        
        // Filter by status
        const filterStatus = document.getElementById('filterStatus');
        if (filterStatus) {
            filterStatus.addEventListener('change', (e) => {
                this.filterCommentsByStatus(e.target.value);
            });
        }
        
        // Comment form submission
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveComment();
            });
        }
        
        // Cancel comment button
        const cancelCommentBtn = document.getElementById('cancelCommentBtn');
        if (cancelCommentBtn) {
            cancelCommentBtn.addEventListener('click', () => {
                this.closeCommentModal();
            });
        }
    }
    
    static openAddCommentModal() {
        const commentModal = document.getElementById('commentModal');
        const commentForm = document.getElementById('commentForm');
        
        if (commentForm) commentForm.reset();
        if (commentModal) commentModal.classList.add('active');
    }
    
    static openEditCommentModal(commentId) {
        const comments = DataManager.getComments();
        const comment = comments.find(c => c.id === commentId);
        
        if (comment) {
            // This is a simplified version - in a real app you would populate the form
            Toast.show('Edit comment functionality would be implemented here', 'info');
        }
    }
    
    static saveComment() {
        const userId = document.getElementById('commentUser')?.value;
        const contentId = document.getElementById('commentContent')?.value;
        const text = document.getElementById('commentText')?.value;
        const status = document.getElementById('commentStatus')?.value;
        
        if (!userId || !text) {
            Toast.show('Please fill in all required fields', 'error');
            return;
        }
        
        const commentData = {
            userId: parseInt(userId),
            contentId: parseInt(contentId),
            text,
            status
        };
        
        const newComment = DataManager.addComment(commentData);
        Toast.show(`Comment added successfully`, 'success');
        this.closeCommentModal();
        this.loadCommentsTable();
    }
    
    static deleteComment(commentId) {
        if (confirm('Are you sure you want to delete this comment?')) {
            if (DataManager.deleteComment(commentId)) {
                Toast.show('Comment deleted successfully', 'success');
                this.loadCommentsTable();
            } else {
                Toast.show('Failed to delete comment', 'error');
            }
        }
    }
    
    static searchComments(searchTerm) {
        // Implementation for searching comments
        Toast.show(`Searching comments for: ${searchTerm}`, 'info');
    }
    
    static filterCommentsByStatus(status) {
        // Implementation for filtering comments by status
        Toast.show(`Filtering comments by status: ${status}`, 'info');
    }
    
    static closeCommentModal() {
        const commentModal = document.getElementById('commentModal');
        if (commentModal) commentModal.classList.remove('active');
    }
}