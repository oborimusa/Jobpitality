// course-content.js - Food Safety Fundamentals Course
const courseContent = {
    "food-safety-fundamentals": {
        title: "Food Safety Fundamentals: Introduction to Food Safety",
        category: "Kitchen",
        description: "Master essential food safety principles, HACCP basics, hygiene protocols, and contamination prevention.",
        modules: [
            {
                title: "Introduction to Food Safety",
                lessons: [
                    {
                        id: "fs-1-1",
                        title: "Why Food Safety Matters",
                        type: "video",
                        duration: "6:45",
                        content: `
                            <div class="content-section">
                                <h3>Why Food Safety Matters</h3>
                                <div class="video-container">
                                    <div class="video-placeholder">
                                        <i class="fas fa-play-circle"></i>
                                        <p>Video: Why Food Safety Matters</p>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <h5>The Importance of Food Safety</h5>
                                    <p>Food safety is critical in preventing foodborne illnesses and ensuring the wellbeing of both guests and staff in hospitality establishments.</p>
                                    
                                    <div class="row mt-4 text-center">
                                        <div class="col-md-4">
                                            <div class="p-3 border rounded">
                                                <i class="fas fa-bacteria fa-2x text-danger mb-2"></i>
                                                <h6>Prevent Illness</h6>
                                                <small class="text-muted">Stop foodborne diseases</small>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="p-3 border rounded">
                                                <i class="fas fa-shield-alt fa-2x text-warning mb-2"></i>
                                                <h6>Legal Compliance</h6>
                                                <small class="text-muted">Meet health regulations</small>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="p-3 border rounded">
                                                <i class="fas fa-award fa-2x text-success mb-2"></i>
                                                <h6>Quality Standards</h6>
                                                <small class="text-muted">Maintain excellence</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="alert alert-info mt-4">
                                        <h6><i class="fas fa-lightbulb me-2"></i>Did You Know?</h6>
                                        Foodborne illnesses affect 1 in 10 people worldwide each year, with proper food safety practices reducing this risk by over 90%.
                                    </div>
                                </div>
                            </div>
                        `
                    },
                    {
                        id: "fs-1-2", 
                        title: "Common Foodborne Pathogens",
                        type: "video",
                        duration: "8:20",
                        content: `
                            <div class="content-section">
                                <h3>Common Foodborne Pathogens</h3>
                                <div class="video-container">
                                    <div class="video-placeholder">
                                        <i class="fas fa-play-circle"></i>
                                        <p>Video: Common Foodborne Pathogens</p>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <h5>Understanding Foodborne Illnesses</h5>
                                    <p>Learn about the most common pathogens that cause foodborne illnesses and how to prevent their spread.</p>
                                    
                                    <div class="table-responsive mt-4">
                                        <table class="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Pathogen</th>
                                                    <th>Common Sources</th>
                                                    <th>Prevention</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><strong>Salmonella</strong></td>
                                                    <td>Raw poultry, eggs, meat</td>
                                                    <td>Proper cooking, hand washing</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>E. coli</strong></td>
                                                    <td>Undercooked beef, raw milk</td>
                                                    <td>Thorough cooking, pasteurization</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Listeria</strong></td>
                                                    <td>Deli meats, soft cheeses</td>
                                                    <td>Proper refrigeration, sanitation</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Norovirus</strong></td>
                                                    <td>Contaminated surfaces, food handlers</td>
                                                    <td>Hand hygiene, surface cleaning</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        `
                    },
                    {
                        id: "fs-1-3",
                        title: "Food Safety Quiz",
                        type: "quiz", 
                        duration: "10:00",
                        content: `
                            <div class="content-section">
                                <h3>Food Safety Fundamentals Quiz</h3>
                                <p>Test your knowledge of basic food safety principles.</p>
                            </div>
                        `,
                        quizData: {
                            title: "Food Safety Fundamentals Quiz",
                            description: "Answer these questions to test your understanding of food safety basics.",
                            passingScore: 70,
                            questions: [
                                {
                                    question: "What is the temperature danger zone for food?",
                                    options: [
                                        "0°C to 5°C (32°F to 41°F)",
                                        "5°C to 60°C (41°F to 140°F)", 
                                        "60°C to 100°C (140°F to 212°F)",
                                        "100°C to 120°C (212°F to 248°F)"
                                    ],
                                    correctAnswer: 1
                                },
                                {
                                    question: "How long should you wash your hands with soap?",
                                    options: [
                                        "5 seconds",
                                        "10 seconds",
                                        "20 seconds", 
                                        "30 seconds"
                                    ],
                                    correctAnswer: 2
                                },
                                {
                                    question: "Which is NOT a common symptom of foodborne illness?",
                                    options: [
                                        "Fever and chills",
                                        "Nausea and vomiting", 
                                        "Headache and dizziness",
                                        "Increased appetite"
                                    ],
                                    correctAnswer: 3
                                }
                            ]
                        }
                    }
                ]
            },
            {
                title: "Personal Hygiene & Sanitation",
                lessons: [
                    {
                        id: "fs-2-1",
                        title: "Proper Hand Washing Techniques",
                        type: "video",
                        duration: "7:15",
                        content: `
                            <div class="content-section">
                                <h3>Proper Hand Washing Techniques</h3>
                                <div class="video-container">
                                    <div class="video-placeholder">
                                        <i class="fas fa-play-circle"></i>
                                        <p>Video: Proper Hand Washing Techniques</p>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <h5>The 7 Steps of Hand Washing</h5>
                                    <ol>
                                        <li><strong>Wet hands</strong> with clean running water</li>
                                        <li><strong>Apply soap</strong> and lather thoroughly</li>
                                        <li><strong>Rub palms</strong> together</li>
                                        <li><strong>Clean between fingers</strong> and back of hands</li>
                                        <li><strong>Scrub under nails</strong></li>
                                        <li><strong>Rinse thoroughly</strong> under running water</li>
                                        <li><strong>Dry with clean towel</strong> or air dryer</li>
                                    </ol>
                                    
                                    <div class="alert alert-warning mt-3">
                                        <h6><i class="fas fa-clock me-2"></i>Timing is Key</h6>
                                        Proper hand washing should take at least 20 seconds - about the time it takes to sing "Happy Birthday" twice!
                                    </div>
                                </div>
                            </div>
                        `
                    }
                ]
            }
        ]
    }
    // You can add more courses here as needed
};