// Content Analytics Manager
class ContentAnalytics {
    static init() {
        // Check auth
        if (!AuthManager.checkAuth()) return;

        console.log('Content Analytics Initializing...');

        // Initialize all analytics components
        this.loadStats();
        this.loadTopContent();
        this.loadUserActivity();

        // Initialize charts
        setTimeout(() => {
            this.initCharts();
            this.setupEventListeners();
        }, 500);
    }

    static loadStats() {
        console.log('Loading analytics stats...');

        const users = DataManager.getUsers();
        const content = DataManager.getContent();
        const comments = DataManager.getComments();

        // User statistics
        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.status === 'active').length;
        const newUsers = users.filter(u => {
            const joinDate = new Date(u.joined);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return joinDate > thirtyDaysAgo;
        }).length;

        // Content statistics
        const totalViews = content.reduce((sum, item) => sum + item.views, 0);
        const totalLikes = content.reduce((sum, item) => sum + item.likes, 0);
        const avgViews = content.length > 0 ? Math.round(totalViews / content.length) : 0;
        const topViews = content.length > 0 ? Math.max(...content.map(item => item.views)) : 0;

        // Comment statistics
        const totalComments = comments.length;
        const approvedComments = comments.filter(c => c.status === 'approved').length;
        const pendingComments = comments.filter(c => c.status === 'pending').length;

        // Engagement rate (likes + comments per 100 views)
        const engagementRate = totalViews > 0 ?
            Math.round(((totalLikes + totalComments) / totalViews) * 100) : 0;
        const avgLikesPerUser = totalUsers > 0 ? Math.round(totalLikes / totalUsers) : 0;

        // Update DOM elements
        this.updateElement('totalUsers', totalUsers.toLocaleString());
        this.updateElement('activeUsers', activeUsers);
        this.updateElement('newUsers', newUsers);
        this.updateElement('totalViews', totalViews.toLocaleString());
        this.updateElement('avgViews', avgViews.toLocaleString());
        this.updateElement('topViews', topViews.toLocaleString());
        this.updateElement('totalLikes', totalLikes.toLocaleString());
        this.updateElement('engagementRate', engagementRate + '%');
        this.updateElement('avgLikes', avgLikesPerUser);
        this.updateElement('totalComments', totalComments.toLocaleString());
        this.updateElement('approvedComments', approvedComments);
        this.updateElement('pendingComments', pendingComments);
    }

    static updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    static loadTopContent() {
        console.log('Loading top content...');
        const content = DataManager.getContent();
        const container = document.getElementById('topContentList');

        if (!container) return;

        // Sort by views (descending) and take top 5
        const topContent = [...content]
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);

        container.innerHTML = '';

        if (topContent.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-file-alt text-3xl mb-3"></i>
                    <p>No content available</p>
                </div>
            `;
            return;
        }

        topContent.forEach((item, index) => {
            const engagementRate = Math.round(((item.likes + item.comments) / item.views) * 100) || 0;

            const contentItem = document.createElement('div');
            contentItem.className = 'flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50';

            contentItem.innerHTML = `
                <div class="flex items-center">
                    <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                        <span class="font-semibold text-gray-700">${index + 1}</span>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900 text-sm line-clamp-1">${item.title}</h4>
                        <div class="flex items-center space-x-3 mt-1">
                            <span class="text-xs text-gray-500">
                                <i class="fas fa-eye mr-1"></i> ${item.views.toLocaleString()}
                            </span>
                            <span class="text-xs text-gray-500">
                                <i class="fas fa-thumbs-up mr-1"></i> ${item.likes}
                            </span>
                            <span class="text-xs text-gray-500">
                                <i class="fas fa-comment mr-1"></i> ${item.comments}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">${engagementRate}%</div>
                    <div class="text-xs text-gray-500">Engagement</div>
                </div>
            `;

            container.appendChild(contentItem);
        });
    }

    static loadUserActivity() {
        console.log('Loading user activity...');
        const users = DataManager.getUsers();
        const comments = DataManager.getComments();
        const container = document.getElementById('userActivityList');

        if (!container) return;

        // Create mock activity data (in a real app, this would come from a dedicated activity log)
        const activities = [
            { user: "Jane Editor", action: "published a new article", time: "2 hours ago", icon: "fa-edit", color: "text-blue-500" },
            { user: "John Viewer", action: "commented on 'Getting Started with RBAC'", time: "4 hours ago", icon: "fa-comment", color: "text-green-500" },
            { user: "Sarah Contributor", action: "liked 'Advanced Dashboard Techniques'", time: "6 hours ago", icon: "fa-thumbs-up", color: "text-pink-500" },
            { user: "Admin User", action: "updated user permissions", time: "1 day ago", icon: "fa-shield-alt", color: "text-purple-500" },
            { user: "Mike Banned", action: "account was suspended", time: "2 days ago", icon: "fa-ban", color: "text-red-500" },
            { user: "Alex Inactive", action: "logged in after 30 days", time: "3 days ago", icon: "fa-sign-in-alt", color: "text-yellow-500" }
        ];

        container.innerHTML = '';

        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'flex items-start';

            activityItem.innerHTML = `
                <div class="flex-shrink-0 mt-1">
                    <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <i class="fas ${activity.icon} ${activity.color} text-sm"></i>
                    </div>
                </div>
                <div class="ml-3 flex-1">
                    <p class="text-sm">
                        <span class="font-medium text-gray-900">${activity.user}</span>
                        <span class="text-gray-700"> ${activity.action}</span>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">${activity.time}</p>
                </div>
            `;

            container.appendChild(activityItem);
        });
    }

    static initCharts() {
        console.log('Initializing charts...');

        // Initialize all charts
        this.initUserGrowthChart();
        this.initContentPerformanceChart();
        this.initEngagementChart();
        this.initDemographicsChart();
    }

    static initUserGrowthChart() {
        const ctx = document.getElementById('userGrowthChart');
        if (!ctx) return;

        // Mock data for user growth (in a real app, this would come from your database)
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const data = {
            labels: labels,
            datasets: [{
                label: 'New Users',
                data: [65, 78, 90, 82, 105, 120, 135],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }, {
                label: 'Active Users',
                data: [120, 135, 140, 145, 150, 160, 170],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false,
                        },
                        ticks: {
                            precision: 0
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }

    static initContentPerformanceChart() {
        const ctx = document.getElementById('contentPerformanceChart');
        if (!ctx) return;

        // Mock data for content performance
        const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const data = {
            labels: labels,
            datasets: [{
                label: 'Views',
                data: [1200, 1900, 1500, 2200],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: '#3b82f6',
                borderWidth: 1
            }, {
                label: 'Likes',
                data: [340, 520, 480, 610],
                backgroundColor: 'rgba(236, 72, 153, 0.8)',
                borderColor: '#ec4899',
                borderWidth: 1
            }, {
                label: 'Comments',
                data: [85, 120, 95, 150],
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: '#10b981',
                borderWidth: 1
            }]
        };

        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false,
                        }
                    }
                }
            }
        });
    }

    static initEngagementChart() {
        const ctx = document.getElementById('engagementChart');
        if (!ctx) return;

        // Mock data for engagement rate
        const data = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Engagement Rate',
                data: [12, 19, 15, 25, 22, 18, 30],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#8b5cf6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `Engagement: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 50,
                        grid: {
                            drawBorder: false,
                        },
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    static initDemographicsChart() {
        const ctx = document.getElementById('demographicsChart');
        if (!ctx) return;

        const users = DataManager.getUsers();

        // Count users by role
        const roleCounts = {
            admin: users.filter(u => u.role === 'admin').length,
            editor: users.filter(u => u.role === 'editor').length,
            viewer: users.filter(u => u.role === 'viewer').length,
            contributor: users.filter(u => u.role === 'contributor').length
        };

        // Prepare data for pie chart
        const data = {
            labels: ['Administrators', 'Editors', 'Viewers', 'Contributors'],
            datasets: [{
                data: [roleCounts.admin, roleCounts.editor, roleCounts.viewer, roleCounts.contributor],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ],
                borderColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#8b5cf6'
                ],
                borderWidth: 2,
                hoverOffset: 15
            }]
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} users (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });

        // Create custom legend
        this.createDemographicsLegend(roleCounts);
    }

    static createDemographicsLegend(roleCounts) {
        const legendContainer = document.getElementById('demographicsLegend');
        if (!legendContainer) return;

        const roles = [
            { name: 'Administrators', count: roleCounts.admin, color: '#3b82f6', icon: 'fa-shield-alt' },
            { name: 'Editors', count: roleCounts.editor, color: '#10b981', icon: 'fa-edit' },
            { name: 'Viewers', count: roleCounts.viewer, color: '#f59e0b', icon: 'fa-eye' },
            { name: 'Contributors', count: roleCounts.contributor, color: '#8b5cf6', icon: 'fa-pen' }
        ];

        legendContainer.innerHTML = '';

        roles.forEach(role => {
            const legendItem = document.createElement('div');
            legendItem.className = 'flex items-center justify-between p-2 bg-gray-50 rounded';

            legendItem.innerHTML = `
                <div class="flex items-center">
                    <div class="h-3 w-3 rounded-full mr-2" style="background-color: ${role.color}"></div>
                    <span class="text-gray-700">${role.name}</span>
                </div>
                <div class="flex items-center">
                    <span class="font-medium text-gray-900 mr-2">${role.count}</span>
                    <i class="fas ${role.icon} text-gray-400"></i>
                </div>
            `;

            legendContainer.appendChild(legendItem);
        });
    }

    static setupEventListeners() {
        console.log('Setting up analytics event listeners...');

        // Time range selector
        const timeRange = document.getElementById('timeRange');
        if (timeRange) {
            timeRange.addEventListener('change', (e) => {
                this.onTimeRangeChange(e.target.value);
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportAnalyticsBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportAnalytics();
            });
        }

        // User growth filter buttons
        document.querySelectorAll('.user-growth-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.currentTarget.getAttribute('data-period');
                this.onUserGrowthFilterClick(period, e.currentTarget);
            });
        });

        // Refresh activity button
        const refreshBtn = document.getElementById('refreshActivity');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshActivity();
            });
        }
    }

    static onTimeRangeChange(range) {
        console.log('Time range changed to:', range);
        Toast.show(`Loading data for ${this.getTimeRangeLabel(range)}`, 'info');

        // In a real app, you would fetch new data based on the time range
        // For now, we'll just update the UI
        setTimeout(() => {
            this.loadStats();
            this.loadTopContent();
            Toast.show('Data updated', 'success');
        }, 500);
    }

    static getTimeRangeLabel(range) {
        const labels = {
            '7d': 'last 7 days',
            '30d': 'last 30 days',
            '90d': 'last 90 days',
            '1y': 'last year'
        };
        return labels[range] || range;
    }

    static onUserGrowthFilterClick(period, button) {
        console.log('User growth filter clicked:', period);

        // Update active button state
        document.querySelectorAll('.user-growth-filter').forEach(btn => {
            btn.classList.remove('bg-gray-100');
            btn.classList.add('bg-white');
        });
        button.classList.remove('bg-white');
        button.classList.add('bg-gray-100');

        // In a real app, you would update the chart data based on the period
        Toast.show(`Showing user growth for ${period}`, 'info');
    }

    static refreshActivity() {
        console.log('Refreshing activity...');
        Toast.show('Refreshing activity data...', 'info');

        // Simulate API call delay
        setTimeout(() => {
            this.loadUserActivity();
            Toast.show('Activity data refreshed', 'success');
        }, 800);
    }

    static exportAnalytics() {
        console.log('Exporting analytics...');

        // Prepare data for export
        const exportData = {
            timestamp: new Date().toISOString(),
            stats: {
                totalUsers: document.getElementById('totalUsers')?.textContent,
                totalViews: document.getElementById('totalViews')?.textContent,
                totalLikes: document.getElementById('totalLikes')?.textContent,
                totalComments: document.getElementById('totalComments')?.textContent
            },
            content: DataManager.getContent(),
            users: DataManager.getUsers().map(u => ({
                name: u.name,
                role: u.role,
                status: u.status,
                joined: u.joined
            }))
        };

        // Create and download JSON file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        Toast.show('Analytics data exported successfully', 'success');
    }
}