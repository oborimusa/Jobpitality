// js/course-data.js - Shared course data for all learning pages
const courseData = {
    "c1": {
        title: "Front Office Essentials",
        category: "Front Office",
        description: "Master reception, guest check-in procedures, phone etiquette, and reservation systems for exceptional front office operations.",
        icon: "fas fa-door-open",
        color: "#4169e1",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        instructor: "Sarah Johnson",
        rating: 4.8,
        students: 1240,
        modules: [
            {
                title: "Introduction to Front Office",
                lessons: [
                    {
                        id: "l1-1",
                        title: "Welcome to Front Office Operations",
                        type: "video",
                        duration: "5:30",
                        content: `
                            <h3>Welcome to Front Office Operations</h3>
                            <div class="video-container">
                                <div class="video-placeholder">
                                    <i class="fas fa-play-circle"></i>
                                </div>
                            </div>
                            <div class="mt-4">
                                <h5>About This Course</h5>
                                <p>This course will teach you the essential skills needed to excel in front office operations in the hospitality industry.</p>
                                <ul>
                                    <li>Master guest check-in and check-out procedures</li>
                                    <li>Learn effective communication techniques</li>
                                    <li>Understand reservation systems</li>
                                    <li>Develop problem-solving skills</li>
                                </ul>
                            </div>
                        `
                    },
                    {
                        id: "l1-2",
                        title: "The Role of Front Office Staff",
                        type: "video",
                        duration: "8:15",
                        content: `
                            <h3>The Role of Front Office Staff</h3>
                            <div class="video-container">
                                <div class="video-placeholder">
                                    <i class="fas fa-play-circle"></i>
                                </div>
                            </div>
                            <div class="mt-4">
                                <h5>Key Responsibilities</h5>
                                <p>Front office staff are the face of the hotel and play a crucial role in guest satisfaction.</p>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <h6>Primary Duties:</h6>
                                        <ul>
                                            <li>Guest registration</li>
                                            <li>Room assignment</li>
                                            <li>Key handling</li>
                                            <li>Information services</li>
                                        </ul>
                                    </div>
                                    <div class="col-md-6">
                                        <h6>Secondary Duties:</h6>
                                        <ul>
                                            <li>Mail and message handling</li>
                                            <li>Safety deposit services</li>
                                            <li>Concierge services</li>
                                            <li>Emergency procedures</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        `
                    }
                ]
            }
        ]
    },
    "c2": {
        title: "Kitchen Hygiene & Safety",
        category: "Kitchen",
        description: "Comprehensive food safety training, HACCP basics, cleaning routines, and kitchen safety protocols.",
        icon: "fas fa-utensils",
        color: "#28a745",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        instructor: "Chef Michael Chen",
        rating: 4.9,
        students: 890,
        modules: [
            {
                title: "Food Safety Fundamentals",
                lessons: [
                    {
                        id: "k1-1",
                        title: "Introduction to Food Safety",
                        type: "video",
                        duration: "6:45",
                        content: `
                            <h3>Introduction to Food Safety</h3>
                            <div class="video-container">
                                <div class="video-placeholder">
                                    <i class="fas fa-play-circle"></i>
                                </div>
                            </div>
                            <div class="mt-4">
                                <h5>Why Food Safety Matters</h5>
                                <p>Food safety is critical in preventing foodborne illnesses and ensuring guest safety.</p>
                                <div class="row">
                                    <div class="col-md-4 text-center">
                                        <div class="p-3 border rounded">
                                            <i class="fas fa-bacteria fa-2x text-danger mb-2"></i>
                                            <h6>Prevent Illness</h6>
                                            <small class="text-muted">Stop foodborne diseases</small>
                                        </div>
                                    </div>
                                    <div class="col-md-4 text-center">
                                        <div class="p-3 border rounded">
                                            <i class="fas fa-shield-alt fa-2x text-warning mb-2"></i>
                                            <h6>Legal Compliance</h6>
                                            <small class="text-muted">Meet health regulations</small>
                                        </div>
                                    </div>
                                    <div class="col-md-4 text-center">
                                        <div class="p-3 border rounded">
                                            <i class="fas fa-award fa-2x text-success mb-2"></i>
                                            <h6>Quality Standards</h6>
                                            <small class="text-muted">Maintain excellence</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `
                    }
                ]
            }
        ]
    },
    "c3": {
        title: "Customer Service Excellence",
        category: "Customer Service",
        description: "Master handling complaints, upselling techniques, guest delight strategies, and communication skills.",
        icon: "fas fa-headset",
        color: "#20c997",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        instructor: "Customer Experience Expert Lisa Park",
        rating: 4.9,
        students: 1560,
        modules: [
            {
                title: "Communication Skills",
                lessons: [
                    {
                        id: "cs1-1",
                        title: "Effective Communication Techniques",
                        type: "video",
                        duration: "10:20",
                        content: `
                            <h3>Effective Communication Techniques</h3>
                            <div class="video-container">
                                <div class="video-placeholder">
                                    <i class="fas fa-play-circle"></i>
                                </div>
                            </div>
                            <div class="mt-4">
                                <h5>Mastering Guest Communication</h5>
                                <p>Learn how to communicate effectively with guests to provide exceptional service.</p>
                                <div class="alert alert-success">
                                    <h6><i class="fas fa-lightbulb me-2"></i>Key Principle:</h6>
                                    Listen twice as much as you speak - understanding guest needs is the first step to excellent service.
                                </div>
                            </div>
                        `
                    }
                ]
            }
        ]
    }
};