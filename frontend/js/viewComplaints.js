async function fetchComplaints() {
    const listElement = document.getElementById('complaintsList');
    try {
        const response = await fetch('/api/complaints');
        const complaints = await response.json();

        if (complaints.length === 0) {
            listElement.innerHTML = `
                <div class="card glass animate-up" style="text-align: center; padding: 40px;">
                    <p>No complaints registered yet. Be the first to speak up!</p>
                </div>
            `;
            return;
        }

        listElement.innerHTML = '';
        complaints.forEach((complaint, index) => {
            const card = document.createElement('div');
            card.className = 'complaint-card card glass animate-up';
            card.style.animationDelay = `${index * 0.1}s`;
            
            const date = new Date(complaint.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            card.innerHTML = `
                <div class="complaint-header">
                    <div style="flex: 1;">
                        <span class="author-badge">@${complaint.author || 'anonymous'}</span>
                        <h3 style="margin: 10px 0 5px 0;">${complaint.name}</h3>
                        <small style="opacity: 0.6;">${date}</small>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 800; font-size: 1.2rem; color: var(--primary-green);">${complaint.upvotes}</div>
                        <div style="font-size: 0.7rem; opacity: 0.6; text-transform: uppercase;">Upvotes</div>
                        <button class="upvote-btn glass" data-id="${complaint._id}" style="margin-top: 10px; padding: 6px 12px; font-size: 0.8rem;">
                            👍 Upvote
                        </button>
                    </div>
                </div>
                <div class="details" id="details-${complaint._id}">
                    <p><strong>Email:</strong> ${complaint.email}</p>
                    <p><strong>Mobile:</strong> ${complaint.mobileNo}</p>
                    <p style="margin-top: 15px; line-height: 1.6;">${complaint.complaint}</p>
                    <div class="media-container">
                        ${complaint.photos.map(p => `<img src="/${p}" alt="Photo" onclick="event.stopPropagation()">`).join('')}
                        ${complaint.videos.map(v => `<video controls src="/${v}" onclick="event.stopPropagation()"></video>`).join('')}
                    </div>
                </div>
            `;

            // Toggle Expand/Collapse with smooth height
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('upvote-btn') || e.target.tagName === 'VIDEO' || e.target.tagName === 'IMG') return;
                
                const details = document.getElementById(`details-${complaint._id}`);
                const isExpanded = details.classList.contains('expanded');
                
                // Close others (optional but cleaner)
                // document.querySelectorAll('.details.expanded').forEach(d => {
                //    if (d !== details) d.classList.remove('expanded');
                // });

                details.classList.toggle('expanded');
            });

            // Upvote logic
            const upvoteBtn = card.querySelector('.upvote-btn');
            upvoteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = e.target.getAttribute('data-id');
                const token = localStorage.getItem('token');

                if (!token) {
                    alert('Please login to upvote complaints.');
                    return;
                }

                try {
                    const res = await fetch(`/api/complaints/${id}/upvote`, { 
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    const result = await res.json();

                    if (res.ok) {
                        fetchComplaints(); // Refresh for sorting
                    } else {
                        alert(result.message);
                    }
                } catch (err) {
                    console.error('Error upvoting:', err);
                }
            });

            listElement.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching complaints:', error);
        listElement.innerHTML = '<div class="card glass" style="color:red">Error loading dashboard. Please check your connection.</div>';
    }
}

fetchComplaints();
