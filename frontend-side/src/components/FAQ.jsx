import React from 'react'
import "../stylesFolder/faq.css"
import "../function/Faq.js"
function FAQ() {
  return (
    <div>
         {/* <!-- FAQ Section --> */}
    <section id="faq">
        <div class="faq-container">
            <h2>Frequently Asked Questions</h2>
            <p class="section-subtitle">Got questions? We've got answers. If you can't find what you're looking for, contact our support team.</p>
            
            <div class="faq-container">
                <div class="faq-item">
                    <div class="faq-question">How can my child get assistance if they're stuck on a coding challenge?</div>
                    <div class="faq-answer">
                        <p>We offer various avenues for assistance. Your child can receive help from our experienced instructors during live coding sessions or through our online platform's chat support feature. We also encourage collaboration among students in our dedicated forum, where they can ask questions and share solutions.</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">What support is available for beginners?</div>
                    <div class="faq-answer">
                        <p>We understand that coding can be daunting for beginners. That's why we provide comprehensive tutorials and interactive lessons designed specifically for students in grades 1 to 8. Our instructors are trained to offer personalized guidance and support to help your child navigate their coding journey with confidence.</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">How can I track my child's progress in the coding program?</div>
                    <div class="faq-answer">
                        <p>Parents can monitor their child's progress through our parent portal, which provides real-time updates on completed assignments, quiz scores, and overall performance. Additionally, our instructors are available to discuss your child's progress and address any concerns you may have.</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">Are the coding lessons interactive and engaging for young learners?</div>
                    <div class="faq-answer">
                        <p>Absolutely! We believe in making learning fun and engaging for students of all ages. Our coding lessons incorporate interactive games, projects, and hands-on activities to keep young learners motivated and excited about coding. We also encourage creativity and exploration, allowing students to express themselves through their coding projects.</p>
                    </div>
                </div>
                
                <div class="faq-item">
                    <div class="faq-question">Do students need any prior coding experience to enroll?</div>
                    <div class="faq-answer">
                        <p>No prior coding experience is required to join our program. Our curriculum is designed to accommodate students of all skill levels, from absolute beginners to more advanced learners. Our instructors will guide your child through each lesson, ensuring they build a strong foundation in coding regardless of their prior experience.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    </div>
  )
}

export default FAQ